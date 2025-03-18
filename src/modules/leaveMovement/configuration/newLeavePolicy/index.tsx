/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Avatar,
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
import type { RangePickerProps } from "antd/es/date-picker";

import { useApiRequest } from "Hooks";
import { Col, Form, Row, Switch, Tag } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { toast } from "react-toastify";
import { PModal } from "Components/Modal";
import LeaveExtension from "./components/LeaveExtension";

export const NewLeavePolicy = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    permissionList,
    profileData: { buId, wId, orgId, wgId, employeeId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const [singleData, setSingleData] = useState<any>({});

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 38),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const leaveTypeApi = useApiRequest({});
  const deleteApi = useApiRequest({});
  const generateApi = useApiRequest({});
  const [open, setOpen] = useState(false);

  // Form Instance
  const [form] = Form.useForm();
  //   api states

  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Leave Policy";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);
  useEffect(() => {
    getLeaveTypes();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // workplace wise
  // const getWorkplaceGroup = () => {
  //   workplaceGroup?.action({
  //     urlKey: "WorkplaceGroupWithRoleExtension",
  //     method: "GET",
  //     params: {
  //       accountId: orgId,
  //       businessUnitId: buId,
  //       workplaceGroupId: wgId,
  //       empId: employeeId,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.strWorkplaceGroup;
  //         res[i].value = item?.intWorkplaceGroupId;
  //       });
  //     },
  //   });
  // };

  // const getWorkplace = () => {
  //   const { workplaceGroup } = form.getFieldsValue(true);
  //   workplace?.action({
  //     urlKey: "WorkplaceWithRoleExtension",
  //     method: "GET",
  //     params: {
  //       accountId: orgId,
  //       businessUnitId: buId,
  //       workplaceGroupId: workplaceGroup?.value,
  //       empId: employeeId,
  //     },
  //     onSuccess: (res: any) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.strWorkplace;
  //         res[i].value = item?.intWorkplaceId;
  //       });
  //     },
  //   });
  // };

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
    searchText = "",
  }: TLandingApi = {}) => {
    const values = form.getFieldsValue(true);
    const ids = values?.leaveType?.map((i: any) => i?.value).join(",");
    landingApi.action({
      urlKey: "GetPolicyLanding",
      method: "GET",
      params: {
        WorkplaceId: wId,
        LeaveTypeId: ids || 0,
        Status: values?.status?.value,
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
      dataIndex: "policyName",
      width: 100,
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      width: 100,
    },
    {
      title: "Display Name",
      dataIndex: "policyDisplayName",
      width: 100,
    },
    {
      title: "Display Code",
      dataIndex: "policyDisplayCode",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 50,
      render: (_: any, rec: any, index: number) => {
        return (
          <div>
            {/* {rec?.status === "Active" ? (
              <Tag color="green">{rec?.status}</Tag>
            ) : rec?.status === "Inactive" ? (
              <Tag color="red">{rec?.status}</Tag>
            ) : (
              <Tag color="gold">{rec?.status}</Tag>
            )} */}
            {rec?.stepperId === 5 ? (
              <p className="">
                <Switch
                  checked={rec?.status === "Active"}
                  onChange={(checked) => {
                    // const newStatus = checked ? "Active" : "Inactive";
                    deleteDepositById(rec);
                    // Update your data source here
                    // Example (replace with your actual data update logic):
                    // dataSource[index].status = newStatus;
                    // setDataSource([...dataSource]);
                  }}
                />
              </p>
            ) : (
              <Tag color="red">{"Incompleted"}</Tag>
            )}
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
              item?.stepperId < 5 &&
                ({
                  type: "edit",
                  onClick: (e: any) => {
                    history.push(
                      `/administration/leaveandmovement/yearlyLeavePolicy/edit/${item?.policyId}`
                    );
                  },
                } as any),
              item?.stepperId === 5 &&
                ({
                  type: "view",
                  onClick: (e: any) => {
                    if (!employeeFeature?.isEdit) {
                      return toast.warn("You don't have permission");
                      e.stopPropagation();
                    }
                    window.open(
                      `/administration/leaveandmovement/yearlyLeavePolicy/view/${item?.policyId}`,
                      "_blank"
                    );
                  },
                } as any),
              item?.stepperId === 5 &&
                ({
                  type: "extend",
                  onClick: (e: any) => {
                    setSingleData(item);
                    setOpen(true);
                  },
                } as any),
            ]}
          />
          {item?.stepperId === 5 && (
            <PButton
              type="primary"
              action="button"
              content="Generate"
              onClick={() => {
                generateApi?.action({
                  urlKey: "BalanceGenerate",
                  method: "post",
                  payload: {
                    businessUnitId: buId,
                    workplaceGroupId: wgId,
                    policyId: item?.policyId,
                    createdBy: employeeId,
                  },
                  toast: true,
                  onSuccess: (res) => {
                    landingApiCall();
                    toast.success(res?.message[0]);
                  },
                  onError: (error: any) => {
                    if (
                      error?.response?.data?.errors?.[
                        "GeneralPayload.Description"
                      ]?.length > 1
                    ) {
                      //  setErrorData(
                      //    error?.response?.data?.errors?.["GeneralPayload.Description"]
                      //  );
                      //  setOpen(true);
                    } else {
                      toast.error(
                        error?.response?.data?.message?.[0] ||
                          error?.response?.data?.message ||
                          error?.response?.data?.errors?.[
                            "GeneralPayload.Description"
                          ]?.[0] ||
                          error?.response?.data?.Message ||
                          error?.response?.data?.title ||
                          error?.response?.title ||
                          error?.response?.message ||
                          error?.response?.Message ||
                          "Something went wrong"
                      );
                    }
                  },
                });
              }}
            />
          )}
        </div>
      ),
    },
  ];
  //   const detailsHeader: any = [
  //     {
  //       title: "SL",
  //       render: (_value: any, _row: any, index: number) => index + 1,
  //       align: "center",
  //       width: 30,
  //     },
  //     {
  //       title: "Deposit Type",
  //       dataIndex: "depositTypeName",
  //       width: 80,
  //     },
  //     {
  //       title: "Employee Name",
  //       dataIndex: "employeeName",
  //       render: (_: any, rec: any) => {
  //         return (
  //           <div className="d-flex align-items-center">
  //             <Avatar title={rec?.employeeName} />
  //             <span className="ml-2">{rec?.employeeName}</span>
  //           </div>
  //         );
  //       },

  //       width: 150,
  //     },
  //     {
  //       title: "Employee Code",
  //       dataIndex: "employeeCode",
  //       width: 100,
  //     },
  //     {
  //       title: "Department",
  //       dataIndex: "department",
  //       width: 100,
  //     },
  //     {
  //       title: "Designation",
  //       dataIndex: "designation",
  //       width: 100,
  //     },
  //     {
  //       title: "Deposit Amount",
  //       dataIndex: "depositAmount",
  //       width: 100,
  //     },
  //     {
  //       title: "Deposits Month Year",
  //       // dataIndex: "monthYear",
  //       render: (_: any, data: any) =>
  //         data?.monthYear ? moment(data?.depositDate).format("MMM-YYYY") : "-",
  //       width: 100,
  //     },
  //     {
  //       title: "comment",
  //       dataIndex: "comment",
  //       width: 100,
  //     },
  //     {
  //       title: "Status",
  //       dataIndex: "status",
  //       render: (_: any, rec: any) => {
  //         return (
  //           <div>
  //             {rec?.status === "Approved" ? (
  //               <Tag color="green">{rec?.status}</Tag>
  //             ) : // ) : rec?.status === "Inactive" ? (
  //             //   <Tag color="red">{rec?.status}</Tag>
  //             rec?.status === "Pending" ? (
  //               <Tag color="orange">{rec?.status}</Tag>
  //             ) : (
  //               <Tag color="red">{rec?.status}</Tag>
  //               // <Tag color="gold">{rec?.status}</Tag>
  //             )}
  //           </div>
  //         );
  //       },
  //       width: 100,
  //     },

  //     {
  //       title: "",
  //       width: 30,

  //       align: "center",
  //       render: (_: any, item: any) => (
  //         <TableButton
  //           buttonsList={
  //             [
  //               // {
  //               //   type: "delete",
  //               //   onClick: () => {
  //               //     deleteDepositById(item);
  //               //   },
  //               // },
  //             ]
  //           }
  //         />
  //       ),
  //     },
  //   ];

  //   const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  //     const { fromDate } = form.getFieldsValue(true);
  //     const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
  //     // Disable dates before fromDate and after next3daysForEmp
  //     return current && current < fromDateMoment.startOf("day");
  //   };

  const onFinish = () => {
    landingApiCall();
  };
  useEffect(() => {
    landingApiCall();
  }, [wgId, wId]);

  const deleteDepositById = (item: any) => {
    deleteApi?.action({
      urlKey: "DeleteByIdLeave",
      method: "DELETE",
      params: {
        PartName: item?.status === "Active" ? "InActivePolicy" : "ActivePolicy",
        PolicyId: item?.policyId,
      },
      toast: true,
      onSuccess: () => {
        landingApiCall();
      },
      onError: (error: any) => {
        if (
          error?.response?.data?.errors?.["GeneralPayload.Description"]
            ?.length > 1
        ) {
          //  setErrorData(
          //    error?.response?.data?.errors?.["GeneralPayload.Description"]
          //  );
          //  setOpen(true);
        } else {
          toast.error(
            error?.response?.data?.message ||
              error?.response?.data?.message?.[0] ||
              error?.response?.data?.errors?.[
                "GeneralPayload.Description"
              ]?.[0] ||
              error?.response?.data?.Message ||
              error?.response?.data?.title ||
              error?.response?.title ||
              error?.response?.message ||
              error?.response?.Message ||
              "Something went wrong"
          );
        }
      },
    });
  };
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          // employee: { value: employeeId, label: userName },
          leaveType: [{ value: 0, label: "All" }],
          status: { value: 2, label: "All" },
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
                    history.push(
                      "/administration/leaveandmovement/yearlyLeavePolicy/create"
                    );
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
            ]}
            title={`Leave Policy`}
          />
          {(deleteApi?.loading || generateApi?.loading) && <Loading />}
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={6} sm={24}>
                <PSelect
                  mode="multiple"
                  options={
                    leaveTypeApi?.data?.length > 0
                      ? [{ value: 0, label: "All" }, ...leaveTypeApi?.data]
                      : []
                  }
                  name="leaveType"
                  label=" Leave Type"
                  placeholder="  Leave Type"
                  onChange={(value, op) => {
                    if (value && value.includes(0)) {
                      // If "All" (value 0) is selected, clear other selections and set only "All"
                      form.setFieldsValue({
                        leaveType: [op.find((item: any) => item.value === 0)],
                      });
                    } else {
                      // If "All" is deselected or other options are selected, filter out "All"
                      const filteredOp = op.filter(
                        (item: any) => item.value !== 0
                      );
                      form.setFieldsValue({
                        leaveType: filteredOp,
                      });
                    }

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
          title={"Leave Extension"}
          width=""
          onCancel={() => setOpen(false)}
          maskClosable={false}
          components={
            <>
              <LeaveExtension
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
          }
        />
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};
