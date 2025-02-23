/* eslint-disable @typescript-eslint/no-empty-function */
import { DataTable, PCard, PCardHeader, PForm } from "Components";

import { useApiRequest } from "Hooks";
import { Form, Row, Tag } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";
import moment from "moment";

export const LeaveDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    permissionList,
    profileData: { buId, employeeId, orgId, wgId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const [loading, setLoading] = useState(false);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30530),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});

  //   const debounce = useDebounce();

  // Form Instance
  const [form] = Form.useForm();
  //   api states

  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Leave Details";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);
  useEffect(() => {
    // getLeaveTypes();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  //   const getLeaveTypes = () => {
  //     leaveTypeApi?.action({
  //       urlKey: "PeopleDeskAllDDL",
  //       method: "GET",
  //       params: {
  //         DDLType: "LeaveType",
  //         BusinessUnitId: buId,
  //         intId: 0,
  //         WorkplaceGroupId: wgId,
  //       },
  //       onSuccess: (res) => {
  //         res.forEach((item: any, i: any) => {
  //           res[i].label = item?.LeaveType;
  //           res[i].value = item?.LeaveTypeId;
  //         });
  //       },
  //     });
  //   };
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

    landingApi.action({
      urlKey: "newLanding",
      method: "GET",
      params: {
        fromDate: values?.fromDate
          ? moment(values?.fromDate).startOf("month").format("YYYY-MM-DD")
          : todayDate(),
        toDate: values?.toDate
          ? moment(values?.toDate).endOf("month").format("YYYY-MM-DD")
          : todayDate(),
        pageNumber: pagination?.current || 1,
        pageSize: pagination?.pageSize || 100,
      },
      onSuccess: (res: any) => {
        res?.data?.forEach((element: any, idex: number) => {
          res.data[idex].monthId = element?.monthYear.split("/")[0];
          res.data[idex].yearId = element?.monthYear.split("/")[1];
        });
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
      title: "Leave Name",
      dataIndex: "policyName",
      width: 100,
    },
    {
      title: "Remaining",
      dataIndex: "leaveType",
      width: 100,
    },
    {
      title: "Taken",
      dataIndex: "displayName",
      width: 100,
    },
    {
      title: "Total",
      dataIndex: "displayCode",
      width: 100,
    },
    {
      title: "Carry Balance",
      dataIndex: "displayCode",
      width: 100,
    },
    {
      title: "Carry Taken",
      dataIndex: "displayCode",
      width: 100,
    },
    {
      title: "Carry Allocated",
      dataIndex: "displayCode",
      width: 100,
    },
    {
      title: "Carry Expire",
      dataIndex: "displayCode",
      width: 100,
    },
    {
      title: "Total Leave Adjusted",
      dataIndex: "displayCode",
      width: 100,
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (_: any, rec: any) => {
    //     return (
    //       <div>
    //         {rec?.status === "Active" ? (
    //           <Tag color="green">{rec?.status}</Tag>
    //         ) : rec?.status === "Inactive" ? (
    //           <Tag color="red">{rec?.status}</Tag>
    //         ) : (
    //           <Tag color="gold">{rec?.status}</Tag>
    //         )}
    //       </div>
    //     );
    //   },
    // },

    // {
    //   title: "",
    //   width: 30,

    //   align: "center",
    //   render: (_: any, item: any) => (
    //     <TableButton
    //       buttonsList={[
    //         {
    //           type: "view",
    //           onClick: (e: any) => {
    //             if (!employeeFeature?.isEdit) {
    //               return toast.warn("You don't have permission");
    //               e.stopPropagation();
    //             }
    //             //   setOpen(true);
    //             // detailsApi?.action({
    //             //   urlKey: "DepositDetails",
    //             //   method: "GET",
    //             //   params: {
    //             //     month: item?.monthId,
    //             //     year: item?.yearId,
    //             //     depositType: item?.depositTypeId,
    //             //   },
    //             //   onSuccess: () => {
    //             //     setOpen(true);
    //             //     setTypeId({
    //             //       id: item?.depositTypeId,
    //             //       month: item?.monthId,
    //             //       year: item?.yearId,
    //             //     });
    //             //   },
    //             // });
    //           },
    //         },
    //         {
    //           type: "extend",
    //           onClick: (e: any) => {
    //             // if (!employeeFeature?.isEdit) {
    //             //   return toast.warn("You don't have permission");
    //             // }
    //             // history.push({
    //             //   pathname: `/compensationAndBenefits/securityDeposit/edit/${item?.depositTypeId}`,
    //             //   state: {
    //             //     month: item?.monthId,
    //             //     year: item?.yearId,
    //             //   },
    //             // });
    //             //   setOpen(true);
    //             //   setId(rec);
    //           },
    //         },
    //         // {
    //         //   type: "delete",
    //         //   onClick: () => {
    //         //     deleteDepositById(item);
    //         //   },
    //         // },
    //       ]}
    //     />
    //   ),
    // },
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
        // initialValues={{
        //   // employee: { value: employeeId, label: userName },
        //   fromDate: moment(todayDate()),
        //   toDate: moment(todayDate()),
        // }}
        // onFinish={onFinish}
      >
        <PCard>
          <PCardHeader
            // buttonList={[
            //   {
            //     type: "primary",
            //     content: "Create",
            //     icon: "plus",
            //     onClick: () => {
            //       if (employeeFeature?.isCreate) {
            //         history.push(
            //           "/compensationAndBenefits/securityDeposit/create"
            //         );
            //       } else {
            //         toast.warn("You don't have permission");
            //       }
            //     },
            //   },
            // ]}
            title={`Leave Details`}
            backButton
          />
          {loading && <Loading />}

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
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};
