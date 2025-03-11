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
import { Col, Form, Row, Tag } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";
import moment from "moment";
import { downloadFile } from "utility/downloadFile";
import { PModal } from "Components/Modal";

export const NewLeavePolicy = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    permissionList,
    profileData: { buId, wId, orgId, wgId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const [loading, setLoading] = useState(false);
  const [typeId, setTypeId] = useState<any>({});

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 38),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const leaveTypeApi = useApiRequest({});
  const deleteApi = useApiRequest({});
  const detailsApi = useApiRequest({});
  const [open, setOpen] = useState(false);

  //   const debounce = useDebounce();

  //   const options: any = [
  //     { value: "", label: "All" },
  //     { value: true, label: "Assigned" },
  //     { value: false, label: "Not-Assigned" },
  //   ];
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  // const workplaceGroup = useApiRequest([]);
  // const workplace = useApiRequest([]);
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
        LeaveTypeId: ids,
        Status: values?.status?.value,
      },
    });
  };

  //  Delete Element
  //   const deleteProposalById = (item: any) => {
  //     deleteProposal?.action({
  //       urlKey: "DeleteIncrementProposal",
  //       method: "DELETE",
  //       params: {
  //         Id: item?.id,
  //       },
  //       toast: true,
  //       onSuccess: () => {
  //         setSelectedRow([]);

  //         landingApiCall();
  //       },
  //     });
  //   };
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
      render: (_: any, rec: any) => {
        return (
          <div>
            {rec?.status === "Active" ? (
              <Tag color="green">{rec?.status}</Tag>
            ) : rec?.status === "Inactive" ? (
              <Tag color="red">{rec?.status}</Tag>
            ) : (
              <Tag color="gold">{rec?.status}</Tag>
            )}
          </div>
        );
      },
    },

    {
      title: "",
      width: 30,

      align: "center",
      render: (_: any, item: any) => (
        <TableButton
          buttonsList={[
            {
              type: "view",
              onClick: (e: any) => {
                if (!employeeFeature?.isEdit) {
                  return toast.warn("You don't have permission");
                  e.stopPropagation();
                }
                history.push(
                  `/administration/leaveandmovement/yearlyLeavePolicy/view/${item?.policyId}`
                );
              },
            },
            {
              type: "extend",
              onClick: (e: any) => {
                // if (!employeeFeature?.isEdit) {
                //   return toast.warn("You don't have permission");
                // }
                // history.push({
                //   pathname: `/compensationAndBenefits/securityDeposit/edit/${item?.depositTypeId}`,
                //   state: {
                //     month: item?.monthId,
                //     year: item?.yearId,
                //   },
                // });
                //   setOpen(true);
                //   setId(rec);
              },
            },
            // {
            //   type: "delete",
            //   onClick: () => {
            //     deleteDepositById(item);
            //   },
            // },
          ]}
        />
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
  //   const deleteDepositById = (item: any) => {
  //     deleteApi?.action({
  //       urlKey: "Deposit",
  //       method: "DELETE",
  //       params: {
  //         id: item?.id,
  //       },
  //       toast: true,
  //       onSuccess: () => {
  //         detailsApi?.action({
  //           urlKey: "DepositDetails",
  //           method: "GET",
  //           params: {
  //             month: typeId?.month,
  //             year: typeId?.year,
  //             depositType: typeId?.id,
  //           },
  //         });
  //       },
  //     });
  //   };
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          // employee: { value: employeeId, label: userName },
          fromDate: moment(todayDate()),
          toDate: moment(todayDate()),
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
          {loading && <Loading />}
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              {/* <Col md={6} sm={12} xs={24}>
                <PInput
                  type="month"
                  name="fromDate"
                  format={"MMM-YYYY"}
                  label="From Date"
                  placeholder="From Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      fromDate: value,
                      toDate: value,
                    });
                  }}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PInput
                  type="month"
                  name="toDate"
                  label="To Date"
                  placeholder="To Date"
                  format={"MMM-YYYY"}
                  disabledDate={disabledDate}
                  onChange={(value) => {
                    form.setFieldsValue({
                      toDate: value,
                    });
                  }}
                />
              </Col> */}
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
                  label="status"
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
          title={"Leave Details"}
          width=""
          onCancel={() => setOpen(false)}
          maskClosable={false}
          components={
            <>
              {/* <DataTable
                bordered
                data={
                  detailsApi?.data?.data?.length > 0
                    ? detailsApi?.data.data
                    : []
                }
                loading={detailsApi?.loading}
                header={detailsHeader}
              /> */}
            </>
          }
        />
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};
