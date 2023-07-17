import { Cancel, CheckCircle, InfoOutlined } from "@mui/icons-material";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/styles";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import AntTable from "../../../../common/AntTable";
import AvatarComponent from "../../../../common/AvatarComponent";
import Chips from "../../../../common/Chips";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
import MuiIcon from "../../../../common/MuiIcon";
import NoResult from "../../../../common/NoResult";
import { gray900, greenColor } from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { todayDate } from "../../../../utility/todayDate";
import {
  expenseApproveReject,
  getAllExpenseListDataForApproval,
} from "../helper";

const CardTable = ({ propsObj }) => {
  const {
    setFieldValue,
    applicationListData,
    setApplicationListData,
    appliedStatus,
    allData,
    setAllData,
  } = propsObj;

  const { employeeId, isOfficeAdmin, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const demoPopup = (action, text, data) => {
    let payload = [
      {
        applicationId: data?.expenseApplication?.intExpenseId,
        approverEmployeeId: employeeId,
        isReject: text === "Reject" ? true : false,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAllExpenseListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          isSupOrLineManager: 0,
          isSupervisor: true,
          isLineManager: true,
          isUserGroup: true,
          approverId: employeeId,
          workplaceGroupId: 0,
          departmentId: 0,
          designationId: 0,
          applicantId: 0,
          expenseTypeId: 0,
          expenseDate: todayDate(),
          accountId: orgId,
          intId: 0,
        },
        setApplicationListData,
        setAllData,
        setLoading
      );
    };
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to ${action}? `,
      yesAlertFunc: () => {
        expenseApproveReject(payload, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };
  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#fff !important",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#fff",
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow:
        "0px 1px 5px rgba(0, 0, 0, 0.05), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 5px rgba(0, 0, 0, 0.05)",
      fontSize: 11,
    },
  }));

  const columns = (page, paginationSize) => [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
    },
    {
      title: () => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <FormikCheckBox
            styleObj={{
              margin: "0 auto!important",
              padding: "0 !important",
              color: gray900,
              checkedColor: greenColor,
            }}
            name="allSelected"
            checked={
              applicationListData?.listData?.length > 0 &&
              applicationListData?.listData?.every(
                (item) => item?.selectCheckbox
              )
            }
            onChange={(e) => {
              setApplicationListData({
                listData: applicationListData?.listData?.map((item) => ({
                  ...item,
                  selectCheckbox: e.target.checked,
                })),
              });
              setAllData({
                listData: allData?.listData?.map((item) => ({
                  ...item,
                  selectCheckbox: e.target.checked,
                })),
              });
              setFieldValue("allSelected", e.target.checked);
            }}
          />

          <span style={{ marginLeft: "5px" }}>Employee Id</span>
        </div>
      ),
      dataIndex: "employeeCode",
      render: (_, record, index) => (
        <div onClick={(e) => e.stopPropagation()}>
          {!(
            appliedStatus?.label === "Approved" ||
            appliedStatus?.label === "Rejected"
          ) && (
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                color: gray900,
                checkedColor: greenColor,
                padding: "0px",
              }}
              name="selectCheckbox"
              color={greenColor}
              checked={record?.selectCheckbox}
              onChange={(e) => {
                // let data = [...applicationListData?.listData];
                // data[i].selectCheckbox = e.target.checked;
                let data = applicationListData?.listData?.map((item) => {
                  if (item?.intExpenseId === record?.intExpenseId) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else return item;
                });
                let data2 = allData?.listData?.map((item) => {
                  if (item?.intExpenseId === record?.intExpenseId) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else return item;
                });
                setApplicationListData({ listData: [...data] });
                setAllData({ listData: [...data2] });
              }}
            />
          )}

          <span style={{ marginLeft: "5px" }}>{record?.employeeCode}</span>
        </div>
      ),
    },
    {
      title: "Employee",
      dataIndex: "employeeName",
      render: (EmployeeName) => (
        <div className="d-flex align-items-center">
          <AvatarComponent classess="" letterCount={1} label={EmployeeName} />
          <span className="ml-2">{EmployeeName}</span>
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      render: (_, record) => (
        <div>
          {record?.designation}, {record?.employmentType}
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: true,
      filter: true,
    },
    {
      title: "Expense Type",
      dataIndex: "strExpenseType",
      render: (_, record) => <>{record?.strExpenseType}</>,
    },
    {
      title: "To Date",
      dataIndex: "dteExpenseDate",
      render: (_, record) => (
        <>{dateFormatter(record?.expenseApplication?.dteExpenseDate)}</>
      ),
    },
    {
      title: "Expense Amount",
      dataIndex: "numExpenseAmount",
      render: (_, record) => (
        <div className="d-flex align-items-center justify-content-start">
          <LightTooltip
            title={
              <div className="p-1">
                <div className="mb-1">
                  <p
                    className="tooltip-title"
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Reason
                  </p>
                  <p
                    className="tooltip-subTitle"
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    {record?.expenseApplication?.strDiscription}
                  </p>
                </div>
              </div>
            }
            arrow
          >
            <InfoOutlined
              sx={{
                color: gray900,
              }}
            />
          </LightTooltip>
          <div className="ml-2">
            {record?.expenseApplication?.numExpenseAmount}
          </div>
        </div>
      ),
    },
    {
      title: "Waiting Stage",
      dataIndex: "currentStage",
      hidden: isOfficeAdmin,
    },
    {
      title: "Status",
      dataIndex: "strStatus",
      render: (_, record) => (
        <div>
          {record?.expenseApplication?.strStatus === "Approved" && (
            <Chips label="Approved" classess="success" />
          )}
          {record?.expenseApplication?.strStatus === "Pending" && (
            <>
              <div className="actionChip">
                <Chips label="Pending" classess=" warning" />
              </div>
              <div className="d-flex actionIcon justify-content-center">
                <Tooltip title="Accept">
                  <div
                    className="mx-2 muiIconHover success "
                    onClick={() => {
                      demoPopup("approve", "Approve", record);
                    }}
                  >
                    <MuiIcon icon={<CheckCircle sx={{ color: "#34A853" }} />} />
                  </div>
                </Tooltip>
                <Tooltip title="Reject">
                  <div
                    className="muiIconHover danger"
                    onClick={() => {
                      demoPopup("reject", "Reject", record);
                    }}
                  >
                    <MuiIcon icon={<Cancel sx={{ color: "#FF696C" }} />} />
                  </div>
                </Tooltip>
              </div>
            </>
          )}
          {record?.expenseApplication?.strStatus === "Rejected" && (
            <Chips label="Rejected" classess="danger" />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {loading && <Loading />}
      {allData?.listData?.length > 0 ? (
        <AntTable
          rowSelection={{
            type: "checkbox",
          }}
          data={allData?.listData}
          columnsData={columns(page, paginationSize)}
          onRowClick={(dataRow) => {}}
          setColumnsData={(dataRow) => {
            if (dataRow?.length === allData?.listData?.length) {
              let temp = dataRow?.map((item) => {
                return {
                  ...item,
                  selectCheckbox: false,
                };
              });
              setApplicationListData({ listData: [...temp] });
              setAllData({ listData: [...temp] });
            } else {
              setApplicationListData({ listData: [...dataRow] });
            }
          }}
          setPage={setPage}
          setPaginationSize={setPaginationSize}
        />
      ) : (
        // <table className="table">
        //   <thead>
        //     <tr>
        //       <th style={{ width: "25px", textAlign: "center" }}>SL</th>
        //       {!(
        //         appliedStatus?.label === "Approved" ||
        //         appliedStatus?.label === "Rejected"
        //       ) && (
        //           <th scope="col">
        //             <FormikCheckBox
        //               styleObj={{
        //                 margin: "0 auto!important",
        //                 color: gray900,
        //                 checkedColor: greenColor,
        //               }}
        //               name="allSelected"
        //               checked={
        //                 applicationListData?.listData?.length > 0 &&
        //                 applicationListData?.listData?.every(
        //                   (item) => item?.selectCheckbox
        //                 )
        //               }
        //               onChange={(e) => {
        //                 setApplicationListData({
        //                   listData: applicationListData?.listData?.map(
        //                     (item) => ({
        //                       ...item,
        //                       selectCheckbox: e.target.checked,
        //                     })
        //                   ),
        //                 });
        //                 setFieldValue("allSelected", e.target.checked);
        //               }}
        //             />
        //           </th>
        //         )}
        //       <th style={{ width: "100px" }}>Code</th>
        //       <th scope="col">
        //         <div
        //           className="d-flex align-items-center pointer ml-2"
        //           onClick={() => {
        //             setEmpOrder(empOrder === "desc" ? "asc" : "desc");
        //             commonSortByFilter(empOrder, "employeeName");
        //           }}
        //         >
        //           Employee
        //           <SortingIcon viewOrder={empOrder} />
        //         </div>
        //       </th>
        //       <th scope="col">
        //         <div
        //           className="d-flex align-items-center pointer"
        //           onClick={() => {
        //             setDesgOrder(desgOrder === "desc" ? "asc" : "desc");
        //             commonSortByFilter(desgOrder, "designation");
        //           }}
        //         >
        //           Designation
        //           <SortingIcon viewOrder={desgOrder} />
        //         </div>
        //       </th>
        //       <th scope="col">
        //         <div
        //           className="d-flex align-items-center pointer"
        //           onClick={() => {
        //             setDeptOrder(deptOrder === "desc" ? "asc" : "desc");
        //             commonSortByFilter(deptOrder, "department");
        //           }}
        //         >
        //           Department
        //           <SortingIcon viewOrder={deptOrder} />
        //         </div>
        //       </th>
        //       <th>Expense Type</th>
        //       <th>To Date</th>
        //       <th>Expense Amount</th>
        //       {isOfficeAdmin && (
        //         <th scope="col">
        //           <div className="d-flex align-items-center">
        //             Waiting Stage
        //           </div>
        //         </th>
        //       )}
        //       <th>
        //         <div className="d-flex align-items-center justify-content-center">
        //           Status
        //         </div>
        //       </th>
        //     </tr>
        //   </thead>
        //   <tbody>
        //     {applicationListData?.listData?.length > 0 &&
        //       applicationListData?.listData?.map((data, i) => (
        //         <tr
        //           className="hasEvent"
        //           onClick={(e) => {
        //           }}
        //           key={i}
        //         >
        //           <td className="text-center">{i + 1}</td>
        //           {!(
        //             appliedStatus?.label === "Approved" ||
        //             appliedStatus?.label === "Rejected"
        //           ) && (
        //               <td
        //                 className="m-0"
        //                 onClick={(e) => {
        //                   e.stopPropagation();
        //                 }}
        //               >
        //                 <FormikCheckBox
        //                   styleObj={{
        //                     margin: "0 0 0 1px",
        //                     color: gray900,
        //                     checkedColor: greenColor,
        //                   }}
        //                   name="selectCheckbox"
        //                   color={greenColor}
        //                   checked={
        //                     applicationListData?.listData[i]?.selectCheckbox
        //                   }
        //                   onChange={(e) => {
        //                     let data = [...applicationListData?.listData];
        //                     data[i].selectCheckbox = e.target.checked;
        //                     setApplicationListData({ listData: [...data] });
        //                   }}
        //                 />
        //               </td>
        //             )}
        //           <td>
        //             <div className="tableBody-title"> {data?.employeeCode}</div>
        //           </td>
        //           <td>
        //             <div className="employeeInfo d-flex align-items-center ml-2">
        //               <AvatarComponent
        //                 letterCount={1}
        //                 label={data?.employeeName}
        //               />
        //               <div className="employeeTitle ml-2">
        //                 <p className="employeeName tableBody-title">
        //                   {data?.employeeName}
        //                 </p>
        //               </div>
        //             </div>
        //           </td>
        //           <td>
        //             <p className="tableBody-title">
        //               {data?.designation}, {data?.employmentType}
        //             </p>
        //           </td>
        //           <td>
        //             <p className="tableBody-title">{data?.department}</p>
        //           </td>
        //           <td>
        //             <p className="tableBody-title">{data?.strExpenseType}</p>
        //           </td>
        //           <td>
        //             <p className="tableBody-title">
        //               {dateFormatter(data?.expenseApplication?.dteExpenseDate)}
        //             </p>
        //           </td>
        //           <td>
        //             <div className="d-flex align-items-center justify-content-start">
        //               <LightTooltip
        //                 title={
        //                   <div className="p-1">
        //                     <div className="mb-1">
        //                       <p
        //                         className="tooltip-title"
        //                         style={{
        //                           fontSize: "12px",
        //                           fontWeight: "600",
        //                         }}
        //                       >
        //                         Reason
        //                       </p>
        //                       <p
        //                         className="tooltip-subTitle"
        //                         style={{
        //                           fontSize: "12px",
        //                           fontWeight: "500",
        //                         }}
        //                       >
        //                         {data?.expenseApplication?.strDiscription}
        //                       </p>
        //                     </div>
        //                   </div>
        //                 }
        //                 arrow
        //               >
        //                 <InfoOutlined
        //                   sx={{
        //                     color: gray900,
        //                   }}
        //                 />
        //               </LightTooltip>
        //               <div className="ml-2 tableBody-title">
        //                 {data?.expenseApplication?.numExpenseAmount}
        //               </div>
        //             </div>
        //           </td>
        //           {isOfficeAdmin && (
        //             <td>
        //               <div className="tableBody-title">{data?.currentStage}</div>
        //             </td>
        //           )}
        //           <td className="text-center" width="10%">
        //             {data?.expenseApplication?.strStatus === "Approved" && (
        //               <Chips label="Approved" classess="success" />
        //             )}
        //             {data?.expenseApplication?.strStatus === "Pending" && (
        //               <>
        //                 <div className="actionChip">
        //                   <Chips label="Pending" classess=" warning" />
        //                 </div>
        //                 <div className="d-flex actionIcon justify-content-center">
        //                   <Tooltip title="Accept">
        //                     <div
        //                       className="mx-2 muiIconHover success "
        //                       onClick={(e) => {
        //                         demoPopup("approve", "Approve", data);
        //                         e.stopPropagation();
        //                       }}
        //                     >
        //                       <MuiIcon
        //                         icon={<CheckCircle sx={{ color: "#34A853" }} />}
        //                       />
        //                     </div>
        //                   </Tooltip>
        //                   <Tooltip title="Reject">
        //                     <div
        //                       className="muiIconHover danger"
        //                       onClick={(e) => {
        //                         demoPopup("reject", "Reject", data);
        //                         e.stopPropagation();
        //                       }}
        //                     >
        //                       <MuiIcon
        //                         icon={<Cancel sx={{ color: "#FF696C" }} />}
        //                       />
        //                     </div>
        //                   </Tooltip>
        //                 </div>
        //               </>
        //             )}
        //             {data?.expenseApplication?.strStatus === "Rejected" && (
        //               <Chips label="Rejected" classess="danger" />
        //             )}
        //           </td>
        //         </tr>
        //       ))}
        //   </tbody>
        // </table>
        <NoResult />
      )}
    </>
  );
};

export default CardTable;
