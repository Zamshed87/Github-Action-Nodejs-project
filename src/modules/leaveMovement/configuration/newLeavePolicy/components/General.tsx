import { Col, Divider, Form, Row } from "antd";
import { PInput, PSelect } from "Components";
import React, { useEffect, useState } from "react";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
import ReactQuill from "react-quill";
import { useApiRequest } from "Hooks";
import { getWorkplaceDDL } from "common/api/commonApi";
import { orgIdsForBn } from "utility/orgForBanglaField";
import { toast } from "react-toastify";
import { ImAttachment } from "react-icons/im";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";

export const General = ({
  form,
  params,
  buId,
  orgId,
  employeeId,
  wgId,
  setAttachmentList,
  attachmentList,
  policyApi,
  detailsApi,
  dispatch,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);

  // api
  const leaveTypeApi = useApiRequest({});
  const EmploymentTypeDDL = useApiRequest([]);
  const HRPositionDDL = useApiRequest([]);
  const workplaceDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  const religionDDL = useApiRequest([]);

  const getLeaveTypes = () => {
    leaveTypeApi?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "LeaveType",
        BusinessUnitId: buId,
        intId: 0,
        WorkplaceGroupId: wgId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.LeaveType;
          res[i].value = item?.LeaveTypeId;
        });
      },
    });
  };

  const getReligion = () => {
    religionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Religion",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.ReligionName;
          res[i].value = item?.ReligionId;
        });
      },
    });
  };
  const getEmploymentType = () => {
    const { workplace } = form.getFieldsValue(true);
    // const strWorkplaceIdList = intWorkplaceList
    //   ?.map((item: any) => item.value)
    //   .join(",");

    EmploymentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentTypeWorkplaceWise",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        strWorkplaceIdList: workplace?.value,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, idx: number) => {
          data[idx].label = item?.EmploymentType;
          data[idx].value = item?.Id;
        });
      },
    });
  };
  const getHRPosition = () => {
    const { workplace } = form.getFieldsValue(true);
    // const strWorkplaceIdList = intWorkplaceList
    //   ?.map((item: any) => item.value)
    //   .join(",");

    HRPositionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "AllPosition",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        strWorkplaceIdList: workplace?.value,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, idx: number) => {
          data[idx].label = item?.PositionName;
          data[idx].value = item?.PositionId;
        });
      },
    });
  };
  const getEmployeDesignation = () => {
    const { workplace } = form.getFieldsValue(true);

    empDesignationDDL?.action({
      urlKey: "DesignationIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: workplace?.value,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = orgIdsForBn.includes(orgId)
            ? item?.designationBn
            : item?.designationName;
          res[i].value = item?.designationId;
        });
      },
    });
  };
  const getDDL = () => {
    const values = form.getFieldsValue(true);
    policyApi.action({
      urlKey: "GetPolicyName",
      method: "GET",
      params: {
        WorkplaceId: values?.workplace?.value,
      },
      onSuccess: (res: any) => {
        res?.data?.forEach((item: any, i: any) => {
          res.data[i].label = item?.policyName;
          res.data[i].value = item?.policyId;
        });
      },
      onError: (e: any) => {
        toast.error(e?.response?.data);
      },
    });
  };

  useEffect(() => {
    getLeaveTypes();
    getWorkplaceDDL({ workplaceDDL, orgId, buId, wgId });
    getReligion();
  }, []);

  useEffect(() => {
    getDDL();
  }, [detailsApi?.data]);

  return (
    <>
      <Divider
        style={{
          marginBlock: "4px",
          marginTop: "6px",
          fontSize: "14px",
          fontWeight: 600,
        }}
        orientation="left"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span>General Configuration</span>
        </div>
      </Divider>
      <Row gutter={[10, 2]}>
        <Col md={6} sm={24}>
          <PInput
            type="text"
            name="strPolicyName"
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

        <Col md={6} sm={24}>
          <PSelect
            // mode="multiple"
            options={leaveTypeApi?.data?.length > 0 ? leaveTypeApi?.data : []}
            name="leaveType"
            label=" Leave Type"
            placeholder="  Leave Type"
            onChange={(value, op) => {
              form.setFieldsValue({
                leaveType: op,
              });

              // value && getWorkplace();
            }}
            rules={[
              {
                required: true,
                message: "Leave Type is required",
              },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={6} sm={24}>
          <PInput
            type="text"
            name="strDisplayName"
            label="Display Name"
            placeholder="Display Name"
            rules={[
              {
                required: true,
                message: "Display Name is required",
              },
            ]}
          />
        </Col>
        <Col md={6} sm={24}>
          <PInput
            type="text"
            name="strDisplayCode"
            label="Display Code"
            placeholder="Display Code"
            rules={[
              {
                required: true,
                message: "Display Code is required",
              },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={6} sm={24}>
          <PSelect
            showSearch
            allowClear
            options={workplaceDDL?.data || []}
            name="workplace"
            label="Workplace"
            placeholder="Workplace"
            disabled={params?.id}
            onChange={(value, op) => {
              form.setFieldsValue({
                intEmploymentTypeList: undefined,
                hrPositionListDTO: undefined,
                designationListDTO: undefined,
                workplace: op,
              });
              if (value) {
                getEmploymentType();
                getHRPosition();
                getEmployeDesignation();
                getDDL();
              }
            }}
            rules={[
              {
                required: true,
                message: "Workplace is required",
              },
            ]}
          />
        </Col>
        <Col md={6} sm={24}>
          <PSelect
            mode="multiple"
            options={
              empDesignationDDL?.data?.length > 0
                ? [{ value: 0, label: "All" }, ...empDesignationDDL?.data]
                : []
            }
            name="designationListDTO"
            label="Designation"
            placeholder="Designation"
            onChange={(value, op) => {
              console.log({ value });
              if (value && value.includes(0)) {
                form.setFieldsValue({
                  designationListDTO: [
                    op.find((item: any) => item.value === 0),
                  ],
                });
              } else {
                const filteredOp = op.filter((item: any) => item.value !== 0);
                form.setFieldsValue({
                  designationListDTO: filteredOp,
                });
              }
            }}
            rules={[
              {
                required: true,
                message: "Designation is required",
              },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={6} sm={24}>
          <PSelect
            mode="multiple"
            options={
              EmploymentTypeDDL?.data?.length > 0
                ? [{ value: 0, label: "All" }, ...EmploymentTypeDDL?.data]
                : []
            }
            name="intEmploymentTypeList"
            label=" Employment Type"
            placeholder="  Employment Type"
            onChange={(value, op) => {
              if (value && value.includes(0)) {
                form.setFieldsValue({
                  intEmploymentTypeList: [
                    op.find((item: any) => item.value === 0),
                  ],
                });
              } else {
                const filteredOp = op.filter((item: any) => item.value !== 0);
                form.setFieldsValue({
                  intEmploymentTypeList: filteredOp,
                });
              }
            }}
            rules={[
              {
                required: true,
                message: "Employment Type is required",
              },
            ]}
          />
        </Col>

        <Col md={6} sm={24}>
          <PSelect
            mode="multiple"
            allowClear
            options={[
              { value: 0, label: "All" },
              { value: 1, label: "Male" },
              { value: 2, label: "Female" },
            ]}
            name="intGender"
            label="Gender"
            placeholder="Gender"
            onChange={(value, op) => {
              if (value && value.includes(0)) {
                form.setFieldsValue({
                  intGender: [op.find((item: any) => item.value === 0)],
                });
              } else {
                const filteredOp = op.filter((item: any) => item.value !== 0);
                form.setFieldsValue({
                  intGender: filteredOp,
                });
              }
            }}
            rules={[
              {
                required: true,
                message: "Gender is required",
              },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={6} sm={24}>
          <PSelect
            mode="multiple"
            allowClear
            options={
              religionDDL?.data?.length > 0
                ? [{ value: 0, label: "All" }, ...religionDDL?.data]
                : []
            }
            name="religionListDto"
            label="Religion"
            placeholder="Religion"
            onChange={(value, op) => {
              if (value && value.includes(0)) {
                form.setFieldsValue({
                  religionListDto: [op.find((item: any) => item.value === 0)],
                });
              } else {
                const filteredOp = op.filter((item: any) => item.value !== 0);
                form.setFieldsValue({
                  religionListDto: filteredOp,
                });
              }
            }}
            rules={[
              {
                required: true,
                message: "Religion is required",
              },
            ]}
          />
        </Col>

        <Col md={6} style={{ marginTop: "1.5rem" }}>
          <div>
            <>
              <FileUploadComponents
                propsObj={{
                  isOpen,
                  setIsOpen,
                  destroyOnClose: false,
                  attachmentList,
                  setAttachmentList,
                  accountId: orgId,
                  tableReferrence: "LeaveAndMovement",
                  documentTypeId: 15,
                  userId: employeeId,
                  buId,
                  maxCount: 1,
                  isIcon: true,
                  isErrorInfo: true,
                  subText:
                    "Recommended file formats are: PDF, JPG and PNG. Maximum file size is 2 MB",
                }}
              />
            </>
          </div>
          {attachmentList?.length === 0 &&
          detailsApi?.data?.data?.generalData[0]?.documentId ? (
            <div
              style={{
                color: "rgb(0, 114, 229)",
                cursor: "pointer",
                marginTop: "0.5rem",
              }}
              onClick={() => {
                dispatch(
                  getDownlloadFileView_Action(
                    detailsApi?.data?.data?.generalData[0]?.documentId
                  )
                );
              }}
            >
              <ImAttachment /> Attachment
            </div>
          ) : null}
        </Col>
      </Row>

      <Form.Item shouldUpdate noStyle>
        {() => {
          const { applicationBody } = form.getFieldsValue(true);

          return (
            <>
              <Col md={12} sm={24}>
                <h2 style={{ marginBottom: "12px" }}>Leave Description</h2>
                <ReactQuill
                  style={{
                    height: "100px",
                    // width: "500px",
                    marginBottom: "50px",
                  }}
                  value={applicationBody}
                  preserveWhitespace={true}
                  onChange={(value) =>
                    form.setFieldsValue({
                      applicationBody: value,
                    })
                  }
                />
              </Col>
            </>
          );
        }}
      </Form.Item>

      {/* <Col
    style={{
      marginTop: "23px",
    }}
  >
    <PButton type="primary" action="submit" content="View" />
  </Col> */}
    </>
  );
};
