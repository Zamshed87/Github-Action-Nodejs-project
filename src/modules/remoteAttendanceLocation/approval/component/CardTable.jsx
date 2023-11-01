/* eslint-disable no-unused-vars */
import { Cancel, CheckCircle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import AntTable from "../../../../common/AntTable";
import AvatarComponent from "../../../../common/AvatarComponent";
import Chips from "../../../../common/Chips";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../common/IConfirmModal";
import MuiIcon from "../../../../common/MuiIcon";
import NoResult from "../../../../common/NoResult";
import { gray900, greenColor } from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { timeFormatter } from "../../../../utility/timeFormatter";
import {
  getAllRemoteAttendanceListDataForApproval,
  RemoteAttendanceApproveReject
} from "../helper";

const CardTable = ({ propsObj }) => {
  const {
    setFieldValue,
    applicationListData,
    setApplicationListData,
    appliedStatus,
    allData,
    setAllData,
    filterValues,
    setFilterValues,
  } = propsObj;

  const { employeeId, isOfficeAdmin, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const demoPopup = (action, text, data) => {
    let payload = [
      {
        applicationId: data?.application?.intRemoteAttendanceId,
        approverEmployeeId: employeeId,
        isReject: text === "Reject" ? true : false,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAllRemoteAttendanceListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          approverId: employeeId,
          workplaceGroupId: 0,
          departmentId: 0,
          designationId: 0,
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
        RemoteAttendanceApproveReject(payload, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const columns = () => [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
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
                let data = applicationListData?.listData.map((item) => {
                  if (
                    item?.application?.intAutoIncrement ===
                    record?.application?.intAutoIncrement
                  ) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else {
                    return item;
                  }
                });
                let data2 = allData?.listData?.map((item) => {
                  if (
                    item?.application?.intAutoIncrement ===
                    record?.application?.intAutoIncrement
                  ) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else {
                    return item;
                  }
                });
                // data[i].selectCheckbox = e.target.checked;
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
      title: "Attendance Date",
      dataIndex: "dteAttendanceDate",
      render: (_, record) => (
        <>{dateFormatter(record?.application?.dteAttendanceDate)}</>
      ),
    },
    {
      title: "Attendance Time",
      dataIndex: "dteAttendanceTime",
      render: (_, record) => (
        <>
          {moment(
            timeFormatter(record?.application?.dteAttendanceTime),
            "HH:mm:ss"
          ).format("hh:mm A")}
        </>
      ),
    },
    {
      title: "Attendance Type",
      dataIndex: "strDeviceName",
      render: (_, record) => <>{record?.application?.strAttendanceType}</>,
    },
    {
      title: "Waiting Stage",
      dataIndex: "currentStage",
      hidden: isOfficeAdmin,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <div>
          {record?.status === "Approved" && (
            <Chips label="Approved" classess="success" />
          )}
          {record?.status === "Pending" && (
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
          {record?.status === "Rejected" && (
            <Chips label="Rejected" classess="danger" />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {allData?.listData?.length > 0 ? (
        <AntTable
          rowSelection={{
            type: "checkbox",
          }}
          data={allData?.listData}
          columnsData={columns()}
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
        //                 checkColor: greenColor,
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
        //           className="d-flex align-items-center pointer"
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
        //       <th>
        //         <div>Attendance Date</div>
        //       </th>
        //       <th>
        //         <div>Attendance Time</div>
        //       </th>
        //       <th>
        //         <div>Attendance Type</div>
        //       </th>
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
        //         <tr key={i}>
        //           <td className="text-center">{i + 1}</td>
        //           {!(
        //             appliedStatus?.label === "Approved" ||
        //             appliedStatus?.label === "Rejected"
        //           ) && (
        //               <td>
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
        //             <div className="employeeInfo d-flex align-items-center">
        //               <AvatarComponent
        //                 letterCount={1}
        //                 label={data?.employeeName}
        //               />
        //               <div className="employeeTitle ml-2">
        //                 <div className="employeeName tableBody-title">
        //                   {data?.employeeName}
        //                 </div>
        //               </div>
        //             </div>
        //           </td>
        //           <td>
        //             <div className="tableBody-title">
        //               {data?.designation}, {data?.employmentType}
        //             </div>
        //           </td>
        //           <td>
        //             <div className="tableBody-title">{data?.department}</div>
        //           </td>
        //           <td>
        //             <div className="tableBody-title">
        //               {dateFormatter(data?.application?.dteAttendanceDate)}
        //             </div>
        //           </td>
        //           <td>
        //             <div className="tableBody-title">
        //               {moment(
        //                 timeFormatter(data?.application?.dteAttendanceTime),
        //                 "HH:mm:ss"
        //               ).format("hh:mm A")}
        //             </div>
        //           </td>
        //           <td>
        //             <div className="tableBody-title">
        //               {data?.application?.strAttendanceType}
        //             </div>
        //           </td>
        //           {isOfficeAdmin && (
        //             <td>
        //               <div className="tableBody-title">
        //                 {data?.currentStage}
        //               </div>
        //             </td>
        //           )}
        //           <td className="text-center" width="10%">
        //             {data?.status === "Approved" && (
        //               <Chips label="Approved" classess="success" />
        //             )}
        //             {data?.status === "Pending" && (
        //               <>
        //                 <div className="actionChip">
        //                   <Chips label="Pending" classess=" warning" />
        //                 </div>
        //                 <div className="d-flex actionIcon justify-content-center">
        //                   <Tooltip title="Accept">
        //                     <div
        //                       className="mx-2 muiIconHover success "
        //                       onClick={() => {
        //                         demoPopup("approve", "Approve", data);
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
        //                       onClick={() => {
        //                         demoPopup("reject", "Reject", data);
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
        //             {data?.status === "Rejected" && (
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
