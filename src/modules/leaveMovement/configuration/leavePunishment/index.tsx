/* eslint-disable @typescript-eslint/no-empty-function */
import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PSelect,
  TableButton,
} from "Components";

import { useApiRequest } from "Hooks";
import { Col, Form, Row, Switch } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { PModal } from "Components/Modal";
import { getWorkplaceDDL } from "common/api/commonApi";
import PunishmentCreate from "./PunishmentCreate";
import { PunishmentDetails } from "./PunishmentDetails";
import PunishmentExtension from "./PunishmentExtension";
// import LeaveExtension from "./components/LeaveExtension";

export const LeavePunishmentLanding = () => {
  const dispatch = useDispatch();

  const {
    permissionList,
    profileData: { buId, wId, orgId, wgId, employeeId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const [singleData, setSingleData] = useState<any>({});

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30578),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const workplaceDDL = useApiRequest([]);
  const deleteApi = useApiRequest({});
  const activeInactiveApi = useApiRequest({});
  const generateApi = useApiRequest({});
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [extend, setExtend] = useState(false);

  // Form Instance
  const [form] = Form.useForm();
  //   api states

  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Leave Punishment";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);
  useEffect(() => {
    getWorkplaceDDL({ workplaceDDL, orgId, buId, wgId });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any;
    searchText?: string;
    excelDownload?: boolean;
    IsForXl?: boolean;
    date?: string;
  };
  const landingApiCall = ({
    pagination = { current: 1, pageSize: paginationSize },
  }: TLandingApi = {}) => {
    const values = form.getFieldsValue(true);
    landingApi.action({
      urlKey: "LeavePunishmentLanding",
      method: "GET",
      params: {
        WorkplaceId: values?.workplace?.value || 0,
        IsActive: values?.status?.value,
      },
    });
  };

  const header: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Policy Name",
      dataIndex: "punishmentPolicyName",
      width: 100,
    },
    {
      title: "Workplace",
      dataIndex: "workplaceName",
      width: 100,
    },
    {
      title: "Employment Type",
      dataIndex: "employmentName",
      width: 100,
    },

    {
      title: "Status",
      dataIndex: "status",
      width: 50,
      render: (_: any, rec: any) => {
        return (
          <div>
            {/* {rec?.status === "Active" ? (
              <Tag color="green">{rec?.status}</Tag>
            ) : rec?.status === "Inactive" ? (
              <Tag color="red">{rec?.status}</Tag>
            ) : (
              <Tag color="gold">{rec?.status}</Tag>
            )} */}

            <p className="">
              <Switch
                checked={rec?.isActive}
                onChange={(checked) => {
                  // const newStatus = checked ? "Active" : "Inactive";
                  activeInactiveById(rec);
                  // Update your data source here
                  // Example (replace with your actual data update logic):
                  // dataSource[index].status = newStatus;
                  // setDataSource([...dataSource]);
                }}
              />
            </p>
          </div>
        );
      },
    },

    {
      title: "Actions",
      width: 120,

      align: "center",
      render: (_: any, item: any) => (
        <div className="d-flex justify-content-around">
          <TableButton
            buttonsList={[
              // {
              //   type: "delete",
              //   onClick: (e: any) => {
              //     deletePolicyId(item);
              //   },
              // },
              {
                type: "view",
                onClick: (e: any) => {
                  setView(true);
                  setSingleData(item);
                  setOpen(true);

                  //   window.open(
                  //     `/administration/punishmentConfiguration/sandwichLeave/view/${item?.punishmentId}`,
                  //     "_blank"
                  //   );
                },
              },
              {
                type: "extend",
                onClick: (e: any) => {
                  setSingleData(item);
                  setOpen(true);
                  setExtend(true);
                },
              },
            ]}
          />
        </div>
      ),
    },
  ];
  const onFinish = () => {
    landingApiCall();
  };
  useEffect(() => {
    landingApiCall();
  }, [wgId, wId]);

  const activeInactiveById = (item: any) => {
    activeInactiveApi?.action({
      urlKey: "LeavePunishmentActiveOrDeleteById",
      method: "DELETE",
      params: {
        Active: item?.isActive ? false : true,
        PunishmentId: item?.punishmentId,
      },
      toast: true,
      onSuccess: () => {
        landingApiCall();
      },
      // onError: (error: any) => {
      //   if (
      //     error?.response?.data?.errors?.["GeneralPayload.Description"]
      //       ?.length > 1
      //   ) {
      //     //  setErrorData(
      //     //    error?.response?.data?.errors?.["GeneralPayload.Description"]
      //     //  );
      //     //  setOpen(true);
      //   } else {
      //     toast.error(
      //       error?.response?.data?.message ||
      //         error?.response?.data?.message?.[0] ||
      //         error?.response?.data?.errors?.[
      //           "GeneralPayload.Description"
      //         ]?.[0] ||
      //         error?.response?.data?.Message ||
      //         error?.response?.data?.title ||
      //         error?.response?.title ||
      //         error?.response?.message ||
      //         error?.response?.Message ||
      //         "Something went wrong"
      //     );
      //   }
      // },
    });
  };
  // const deletePolicyId = (item: any) => {
  //   deleteApi?.action({
  //     urlKey: "LeavePunishmentDeleteById",
  //     method: "DELETE",
  //     params: {
  //       PunishmentId: item?.punishmentId,
  //     },
  //     toast: true,
  //     onSuccess: () => {
  //       landingApiCall();
  //     },
  //   });
  // };
  return employeeFeature?.isView ? (
    <>
      {(activeInactiveApi?.loading || landingApi?.loading) && <Loading />}
      <PForm
        form={form}
        initialValues={{
          workplace: [{ value: 0, label: "All" }],
          status: { value: 1, label: "Active" },
        }}
        onFinish={onFinish}
      >
        <PCard>
          <PCardHeader
            buttonList={[
              {
                type: "primary",
                content: "Create",
                icon: "plus",
                onClick: () => {
                  if (employeeFeature?.isCreate) {
                    setOpen(true);
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
            ]}
            title={`Leave Punishment`}
          />
          {(deleteApi?.loading ||
            generateApi?.loading ||
            activeInactiveApi?.loading) && <Loading />}
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={6} sm={24}>
                <PSelect
                  showSearch
                  allowClear
                  options={
                    workplaceDDL?.data?.length > 0
                      ? [{ value: 0, label: "All" }, ...workplaceDDL?.data]
                      : []
                  }
                  name="workplace"
                  label="Workplace"
                  placeholder="Workplace"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                    });
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
                  //   mode="multiple"
                  options={[
                    { value: 2, label: "All" },
                    { value: 1, label: "Active" },
                    { value: 0, label: "Inactive" },
                  ]}
                  name="status"
                  label="Status"
                  placeholder="status"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      status: op,
                    });

                    // value && getWorkplace();
                  }}
                />
              </Col>
              <Col
                style={{
                  marginTop: "23px",
                }}
              >
                <PButton type="primary" action="submit" content="View" />
              </Col>
            </Row>
          </PCardBody>

          <DataTable
            bordered
            data={
              landingApi?.data?.data?.length > 0 ? landingApi?.data.data : []
            }
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;

              landingApiCall({
                pagination,
              });
            }}
            // scroll={{ x: 1500 }}
          />
        </PCard>
        <PModal
          open={open}
          title={`Leave Punishment Configuration ${view ? "Details" : ""}${
            extend ? "Extention" : ""
          }`}
          width=""
          onCancel={() => {
            setOpen(false);
            setView(false);
            setExtend(false);
            setSingleData({});
          }}
          maskClosable={false}
          components={
            view ? (
              <>
                <PunishmentDetails singleData={singleData} />
              </>
            ) : extend ? (
              <>
                <PunishmentExtension
                  orgId={orgId}
                  buId={buId}
                  wgId={wgId}
                  employeeId={employeeId}
                  getData={() => landingApiCall()}
                  setOpen={setOpen}
                  setExtend={setExtend}
                  setSingleData={setSingleData}
                  singleData={singleData}
                />
              </>
            ) : (
              <>
                <PunishmentCreate
                  orgId={orgId}
                  buId={buId}
                  wgId={wgId}
                  employeeId={employeeId}
                  getData={() => landingApiCall()}
                  setOpen={setOpen}
                  setSingleData={setSingleData}
                  singleData={singleData}
                />
              </>
            )
          }
        />
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};
