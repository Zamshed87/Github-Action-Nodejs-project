import { Col, Form, Row } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
  TableButton,
} from "Components";
import {} from "utility/dateFormatter";
import Loading from "common/loading/Loading";

import useAxiosGet from "utility/customHooks/useAxiosGet";
import { PlusCircleOutlined } from "@ant-design/icons";
import { PModal } from "Components/Modal";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { getWorkplaceGroupDDL } from "common/api/commonApi";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
import { AttachmentOutlined } from "@mui/icons-material";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import {
  deletePolicy,
  getMultipleDepartment,
  getMultipleWorkplace,
} from "./helper";

export const PolicyCRUD = () => {
  // hook
  const dispatch = useDispatch();
  const [policyDDL, getPolicyDDL, policyLoader] = useAxiosGet();
  const [, postPolicyType, typeCreateLoader] = useAxiosPost();
  const [, postPolicy, createLoader] = useAxiosPost();

  // redux
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  // menu permission
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 132) {
      employeeFeature = item;
    }
  });

  // Form Instance
  const [form] = Form.useForm();
  const landingApi = useApiRequest({});
  const workGroupApi = useApiRequest({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [images, setImages] = useState<any[]>([]);

  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any;
    searchText?: string;
    excelDownload?: boolean;
  };
  const landingApiCall = ({ searchText = "" }: TLandingApi = {}) => {
    landingApi.action({
      urlKey: "MasterPolicyLanding",
      method: "GET",
      params: {
        BusinessUnitId: buId,
        CategoryId: 0,
        accountId: orgId,
        Search: searchText || "",
      },
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Policy Upload";
    return () => {
      document.title = "Peopledesk";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    landingApiCall();
    getPolicies();
    getWorkplaceGroupDDL({
      workplaceGroupDDL: workGroupApi,
      orgId,
      buId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wId, wgId]);

  const searchFunc = debounce((value) => {
    landingApiCall({
      searchText: value,
    });
  }, 500);
  const getPolicies = () => {
    getPolicyDDL(`/SaasMasterData/GetPolicyCategoryDDL?AccountId=${orgId}`);
  };

  // Header
  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) => index + 1,
      fixed: "left",
      width: 15,
      align: "center",
    },
    {
      title: "Policy Title",
      dataIndex: "policyTitle",
      width: 70,
    },

    {
      title: "Policy Category",
      dataIndex: "policyCategoryName",
      filter: false,
      width: 70,
    },
    {
      title: "WorkplaceGroup",
      dataIndex: "workplaceGroupList",
      sorter: false,
      width: 70,

      render: (_: any, rec: any) => (
        <span style={{ wordBreak: "break-word" }}>
          {rec?.workplaceGroupList}
        </span>
      ),

      filter: false,
    },
    {
      title: "Workplace",
      dataIndex: "workplaceList",
      width: 70,

      render: (_: any, rec: any) => (
        <span style={{ wordBreak: "break-word" }}>{rec?.workplaceList}</span>
      ),
    },

    {
      title: "Department",
      dataIndex: "departmentList",
      width: 70,

      render: (_: any, rec: any) => (
        <span style={{ wordBreak: "break-word" }}>{rec?.departmentList}</span>
      ),
    },
    {
      title: "Acknowledged",
      dataIndex: "acknowledgeCount",
      width: 50,
    },
    {
      title: "Attachment File",
      dataIndex: "AllocatedLeave",
      width: 120,

      render: (_: any, record: any) => (
        <div>
          <div
            onClick={() => {
              dispatch(getDownlloadFileView_Action(record?.policyFileUrlId));
            }}
            className="d-flex"
          >
            <AttachmentOutlined sx={{ marginRight: "5px", color: "#0072E5" }} />
            <p
              style={{
                fontSize: "12px",
                fontWeight: "500",
                color: "#0072E5",
                cursor: "pointer",
              }}
            >
              {record?.policyFileName}
            </p>
          </div>
        </div>
      ),
      sorter: false,
      filter: false,
    },

    {
      title: "Action",
      dataIndex: "",
      width: 40,

      render: (_: any, rec: any) => {
        return (
          <TableButton
            buttonsList={[
              {
                type: "delete",
                onClick: () => {
                  deletePolicy(rec?.policyId, () => {
                    landingApiCall();
                  });
                },
              },
            ]}
          />
        );
      },
    },
  ];
  const viewHandler = async () => {
    const cb = () => {
      form.resetFields();
      getPolicies();
    };

    await form
      .validateFields(["policyType"])
      .then(() => {
        const values = form.getFieldsValue(true);
        const payload = {
          policyCategoryId: 0,
          policyCategoryName: values?.policyType,
          accountId: orgId,
          isActive: true,
          intCreatedBy: employeeId,
        };
        postPolicyType(
          `/SaasMasterData/CRUDPolicyCategory`,
          payload,
          () => {},
          true
        );
      })
      .catch(() => {
        console.error("Validate Failed:");
      });
  };
  const savePolicy = async () => {
    const cb = () => {
      form.resetFields();
      getPolicies();
      landingApiCall();
    };

    await form
      .validateFields([
        "policyTitle",
        "policyCategory",
        "workGroup",
        "workplace",
        "department",
      ])
      .then(() => {
        const values = form.getFieldsValue(true);

        console.log({ images });
        const payload = {
          objHeader: {
            policyId: 0,
            accountId: orgId,
            businessUnitId: buId,
            policyTitle: values?.policyTitle || "",
            policyCategoryId: values?.policyCategory?.value || 0,
            policyCategoryName: values?.policyCategory?.label || "",
            policyFileUrlId: (images[0] as any)?.response[0]?.globalFileUrlId,
            policyFileName: (images[0] as any)?.response[0]?.fileName,
            intCreatedBy: employeeId,
            isActive: true,
          },
          objRow: {
            rowId: 0,
            policyId: 0,
            workplaceGroupId: values?.workGroup
              ?.map((i: any) => i?.value)
              .join(","),
            workplaceId: values?.workplace?.map((i: any) => i?.value).join(","),
            intDepartmentId: values?.department
              ?.map((i: any) => i?.value)
              .join(","),
            isActive: true,
            intCreatedBy: employeeId,
          },
        };

        postPolicy(`/SaasMasterData/CreatePolicy`, payload, cb, true);
      })
      .catch(() => {
        console.error("Validate Failed:");
      });
  };
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{}}
        onFinish={() => {
          landingApiCall({});
        }}
      >
        <PCard>
          {(landingApi?.loading ||
            policyLoader ||
            typeCreateLoader ||
            createLoader) && <Loading />}
          <PCardHeader
            title={`Policy Upload`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            buttonList={[
              {
                type: "primary",
                content: "Save",
                onClick: () => {
                  savePolicy();
                },
              },
            ]}
          />
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  showSearch
                  name="policyCategory"
                  label="Policy Category"
                  placeholder=""
                  options={policyDDL?.length > 0 ? policyDDL : []}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      policyCategory: op,
                    });
                  }}
                  filterOption={false}
                  rules={[
                    {
                      required: true,
                      message: "Policy Type is required",
                    },
                  ]}
                />
              </Col>
              <Col md={1}>
                <button
                  type="button"
                  className="mt-4  btn add-ddl-btn "
                  style={{
                    margin: "0.4em 0 0 0.7em",
                    padding: "0.2em",
                  }}
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  <PlusCircleOutlined style={{ fontSize: "16px" }} />
                </button>
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="text"
                  name="policyTitle"
                  label="Policy Title"
                  placeholder="Policy Title"
                  rules={[
                    {
                      required: true,
                      message: "Policy Title is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  showSearch
                  allowClear
                  mode="multiple"
                  name="workGroup"
                  label="Workplace Group"
                  placeholder=""
                  options={
                    workGroupApi?.data?.length > 0 ? workGroupApi?.data : []
                  }
                  onChange={(value, op) => {
                    setWorkplaceDDL([]);

                    form.setFieldsValue({
                      workGroup: op,
                    });
                    getMultipleWorkplace(setLoading, op, setWorkplaceDDL);
                  }}
                  filterOption={false}
                  rules={[
                    {
                      required: true,
                      message: "Workplace Group is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  allowClear
                  mode="multiple"
                  name="workplace"
                  label="Workplace"
                  placeholder=""
                  options={workplaceDDL}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                    });
                    getMultipleDepartment(setLoading, op, setDepartmentDDL);
                  }}
                  filterOption={false}
                  rules={[
                    {
                      required: true,
                      message: "Workplace is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  allowClear
                  mode="multiple"
                  name="department"
                  label="Department"
                  placeholder=""
                  options={departmentDDL || []}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      department: op,
                    });
                  }}
                  filterOption={false}
                  rules={[
                    {
                      required: true,
                      message: "Department is required",
                    },
                  ]}
                />
              </Col>
              <Col md={11} sm={12} className="mt-4">
                <FileUploadComponents
                  propsObj={{
                    title: "Upload",
                    attachmentList: images,
                    setAttachmentList: setImages,
                    accountId: orgId,
                    tableReferrence: "PolicyUpload",
                    documentTypeId: 13,
                    userId: employeeId,
                    buId,
                    maxCount: 1,
                    accept: "image/png, image/jpeg, image/jpg",
                    subText:
                      "Recommended file formats are:  PDF,JPG and PNG. Maximum file size is 2 MB",
                  }}
                />
              </Col>
              {/* <Col md={5} sm={12} xs={24} className="mt-4">
                <PButton type="primary" action="submit" content="Save" />
              </Col> */}
            </Row>
          </PCardBody>

          <DataTable
            bordered
            data={landingApi?.data?.length > 0 ? landingApi?.data : []}
            loading={landingApi?.loading}
            header={header}
          />
        </PCard>
        <PModal
          open={open}
          title={"Create Policy Type"}
          width="500px"
          onCancel={() => {
            setOpen(false);
          }}
          maskClosable={false}
          components={
            <>
              <Row gutter={[10, 2]}>
                <Col md={20} sm={24}>
                  <PInput
                    type="text"
                    name="policyType"
                    label="Policy Name"
                    placeholder="Policy Name"
                    rules={[
                      {
                        required: true,
                        message: "Policy Name is required",
                      },
                    ]}
                  />
                </Col>

                <Col span={2} className="">
                  <PButton
                    type="primary"
                    onClick={() => {
                      viewHandler();
                    }}
                    action="button"
                    content="Save"
                  />
                </Col>
              </Row>
            </>
          }
        />
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};
