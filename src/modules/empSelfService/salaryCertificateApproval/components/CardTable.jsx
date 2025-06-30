import { Cancel, CheckCircle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
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
import { getMonthName } from "../../../../utility/monthIdToMonthName";
import {
  getAllSalaryCertificateListDataForApproval,
  salaryCertificateApproveReject,
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
        applicationId: data?.application?.intSalaryCertificateRequestId,
        approverEmployeeId: employeeId,
        isReject: text === "Reject" ? true : false,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAllSalaryCertificateListDataForApproval(
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
          workplaceId: 0,
          businessUnitId: 0,
          applicantId: 0,
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
        salaryCertificateApproveReject(payload, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

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
                listData: applicationListData?.listData?.map((item) => ({
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
                let data = applicationListData?.listData?.map((item) => {
                  if (item?.intId === record?.intId) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else return item;
                });
                setApplicationListData({ listData: [...data] });
                let data2 = allData?.listData?.map((item) => {
                  if (item?.intId === record?.intId) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else return item;
                });
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
      dataIndex: "strEmployee",
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
      dataIndex: "strDesignation",
      render: (_, record) => (
        <div>
          {record?.strDesignation}, {record?.strEmploymentType}
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
    },
    {
      title: "Month-Year",
      dataIndex: "dteInsertDate",
      render: (_, record) => (
        <>
          {getMonthName(record?.intPayRollMonth)}, {record?.intPayRollYear}
        </>
      ),
    },
    {
      title: "Waiting Stage",
      dataIndex: "waitingStage",
      hidden: isOfficeAdmin,
    },
    {
      title: "Status",
      dataIndex: "strStatus",
      render: (_, record) => (
        <div>
          {record?.application?.strStatus === "Approved" && (
            <Chips label="Approved" classess="success" />
          )}
          {record?.application?.strStatus === "Pending" && (
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
          {record?.application?.strStatus === "Rejected" && (
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
        //             commonSortByFilter(empOrder, "strEmployee");
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
        //             commonSortByFilter(desgOrder, "strDesignation");
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
        //             commonSortByFilter(deptOrder, "strDepartment");
        //           }}
        //         >
        //           Department
        //           <SortingIcon viewOrder={deptOrder} />
        //         </div>
        //       </th>
        //       <th>Month-Year</th>
        //       {isOfficeAdmin && (
        //         <th scope="col">
        //           <div className="d-flex align-items-center">Waiting Stage</div>
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
        //         <tr className="hasEvent" onClick={(e) => { }} key={i}>
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
        //                 label={data?.strEmployee}
        //               />
        //               <div className="employeeTitle ml-2">
        //                 <p className="employeeName tableBody-title">
        //                   {data?.strEmployee}
        //                 </p>
        //               </div>
        //             </div>
        //           </td>
        //           <td>
        //             <p className="tableBody-title">
        //               {data?.strDesignation}, {data?.strEmploymentType}
        //             </p>
        //           </td>
        //           <td>
        //             <p className="tableBody-title">{data?.strDepartment}</p>
        //           </td>
        //           <td>
        //             <p className="tableBody-title">
        //               {getMonthName(data?.intPayRollMonth)},{" "}
        //               {data?.intPayRollYear}
        //             </p>
        //           </td>
        //           {isOfficeAdmin && (
        //             <td>
        //               <div className="tableBody-title">
        //                 {data?.currentStage}
        //               </div>
        //             </td>
        //           )}
        //           <td className="text-center" width="10%">
        //             {data?.application?.strStatus === "Approved" && (
        //               <Chips label="Approved" classess="success" />
        //             )}
        //             {data?.application?.strStatus === "Pending" && (
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
        //             {data?.application?.strStatus === "Rejected" && (
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
