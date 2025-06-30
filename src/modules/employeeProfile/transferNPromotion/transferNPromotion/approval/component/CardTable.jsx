/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Cancel, CheckCircle, Clear } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { IconButton, Popover, Tooltip } from "@mui/material";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AntTable from "../../../../../../common/AntTable";
import AvatarComponent from "../../../../../../common/AvatarComponent";
import Chips from "../../../../../../common/Chips";
import FormikCheckBox from "../../../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../../../common/IConfirmModal";
import MuiIcon from "../../../../../../common/MuiIcon";
import NoResult from "../../../../../../common/NoResult";
import SortingIcon from "../../../../../../common/SortingIcon";
import { gray900, greenColor } from "../../../../../../utility/customColor";
import { dateFormatter } from "../../../../../../utility/dateFormatter";
import {
  getAllTransferAndPromotionListDataForApproval,
  transferNPromotionApproveReject,
} from "../helper";

const CardTable = ({ propsObj }) => {
  const {
    setFieldValue,
    applicationListData,
    setApplicationListData,
    appliedStatus,
    allData,
    setAllData,
    setSingleData,
    setViewModal,
  } = propsObj;

  const { employeeId, isOfficeAdmin, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [empOrder, setEmpOrder] = useState("desc");
  const [desgOrder, setDesgOrder] = useState("desc");
  const [deptOrder, setDeptOrder] = useState("desc");

  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...allData?.listData];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setApplicationListData({ listData: modifyRowData });
  };

  const demoPopup = (action, text, data) => {
    let payload = [
      {
        applicationId: data?.intTransferNpromotionId,
        approverEmployeeId: employeeId,
        isReject: text === "Reject" ? true : false,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAllTransferAndPromotionListDataForApproval(
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
        transferNPromotionApproveReject(payload, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
          {!(
            appliedStatus?.label === "Approved" ||
            appliedStatus?.label === "Rejected"
          ) && (
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
                setFieldValue("allSelected", e.target.checked);
              }}
            />
          )}

          <span style={{ marginLeft: "5px" }}>Code</span>
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
                  if (
                    item.intTransferNpromotionId ===
                    record?.intTransferNpromotionId
                  ) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else return item;
                });
                setApplicationListData({ listData: [...data] });
              }}
              disabled={record?.ApplicationStatus === "Approved"}
            />
          )}

          <span style={{ marginLeft: "5px" }}>{record?.employeeCode}</span>
        </div>
      ),
    },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
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
      dataIndex: "designationNameFrom",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "departmentNameFrom",
      sorter: true,
      filter: true,
    },
    {
      title: "Application Date",
      dataIndex: "dteCreatedAt",
      render: (_, record) => dateFormatter(record?.dteCreatedAt),
    },
    {
      title: "Effective Date",
      dataIndex: "dteEffectiveDate",
      render: (_, record) => dateFormatter(record?.dteEffectiveDate),
    },
    {
      title: "Type",
      dataIndex: "strSeparationTypeName",
      render: (_, record) => (
        <div style={{ display: "flex" }}>
          <InfoOutlinedIcon
            onClick={(e) => {
              e.stopPropagation();
              setAnchorEl(e.currentTarget);
            }}
            sx={{
              color: gray900,
            }}
          />
          <div className="ml-2">{record?.strTransferNpromotionType}</div>
        </div>
      ),
    },
    {
      title: "Waiting Stage",
      dataIndex: "currentStage",
      render: (_, record) => <>{record?.currentStage}</>,
      hidden: isOfficeAdmin,
    },
    {
      title: "Status",
      dataIndex: "strStatus",
      render: (_, record) => (
        <div>
          {record?.strStatus === "Pending" && (
            <>
              <div className="actionChip">
                <Chips label="Pending" classess=" warning" />
              </div>
              <div className="d-flex actionIcon justify-content-center">
                <Tooltip title="Accept">
                  <div
                    className="mx-2 muiIconHover success "
                    onClick={(e) => {
                      demoPopup("approve", "Approve", record);
                      e.stopPropagation();
                    }}
                  >
                    <MuiIcon icon={<CheckCircle sx={{ color: "#34A853" }} />} />
                  </div>
                </Tooltip>
                <Tooltip title="Reject">
                  <div
                    className="muiIconHover danger"
                    onClick={(e) => {
                      demoPopup("reject", "Reject", record);
                      e.stopPropagation();
                    }}
                  >
                    <MuiIcon icon={<Cancel sx={{ color: "#FF696C" }} />} />
                  </div>
                </Tooltip>
              </div>
            </>
          )}
          {record?.strStatus === "Rejected" && (
            <Chips label="Rejected" classess="danger" />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {applicationListData?.listData?.length > 0 ? (
        <AntTable
          rowSelection={{
            type: "checkbox",
          }}
          data={applicationListData?.listData}
          columnsData={columns()}
          onRowClick={(dataRow) => {
            history.push(
              `/profile/transferandpromotion/transferandpromotion/view/${dataRow?.intTransferNpromotionId}`,
              {
                employeeId: dataRow?.intEmployeeId,
                approval: true,
              }
            );
            setSingleData(dataRow);
            setViewModal(true);
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
        //       <th>Application Date</th>
        //       <th>Effective Date</th>
        //       <th>Type</th>
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
        //         <tr
        //           className="hasEvent"
        //           onClick={(e) => {
        //             e.stopPropagation();
        //             history.push(
        //               `/profile/transferandpromotion/transferandpromotion/view/${data?.intTransferNpromotionId}`,
        //               {
        //                 employeeId: data?.intEmployeeId,
        //                 approval: true,
        //               }
        //             );
        //             setSingleData(data);
        //             setViewModal(true);
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
        //                 label={data?.strEmployeeName}
        //               />
        //               <div className="employeeTitle ml-2">
        //                 <p className="employeeName tableBody-title">
        //                   {data?.strEmployeeName}
        //                 </p>
        //               </div>
        //             </div>
        //           </td>
        //           <td>
        //             <p className="tableBody-title">
        //               {data?.designationNameFrom}
        //             </p>
        //           </td>
        //           <td>
        //             <p className="tableBody-title">
        //               {data?.departmentNameFrom}
        //             </p>
        //           </td>
        //           <td>
        //             <p className="tableBody-title">
        //               {dateFormatter(data?.dteCreatedAt)}
        //             </p>
        //           </td>
        //           <td>
        //             <p className="tableBody-title">
        //               {dateFormatter(data?.dteEffectiveDate)}
        //             </p>
        //           </td>
        //           <td>
        //             <div className="d-flex align-items-center justify-content-start tableBody-title">
        //               <InfoOutlinedIcon
        //                 onClick={(e) => {
        //                   e.stopPropagation();
        //                   setAnchorEl(e.currentTarget);
        //                 }}
        //                 sx={{
        //                   color: gray900,
        //                 }}
        //               />
        //               <div className="ml-2 tableBody-title">
        //                 {data?.strTransferNpromotionType}
        //               </div>
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
        //             {data?.strStatus === "Pending" && (
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
        //             {data?.strStatus === "Rejected" && (
        //               <Chips label="Rejected" classess="danger" />
        //             )}
        //           </td>
        //         </tr>
        //       ))}
        //   </tbody>
        // </table>
        <NoResult />
      )}

      <Popover
        sx={{
          "& .MuiPaper-root": {
            width: "675px",
            minHeight: "200px",
            borderRadius: "4px",
          },
        }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "middle",
        }}
      >
        <div
          className="master-filter-modal-container employeeProfile-src-filter-main"
          style={{ height: "auto" }}
        >
          <div className="master-filter-header employeeProfile-src-filter-header">
            <div></div>
            <IconButton
              onClick={() => {
                setAnchorEl(null);
              }}
            >
              <Clear sx={{ fontSize: "18px", color: gray900 }} />
            </IconButton>
          </div>
          <hr />
          <div
            className="body-employeeProfile-master-filter"
            style={{ height: "300px" }}
          >
            <table className="table table-bordered mt-3">
              <thead>
                <tr
                  style={{
                    backgroundColor: "rgba(247, 247, 247, 1)",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "rgba(95, 99, 104, 1)!important",
                  }}
                >
                  <th
                    className="text-center"
                    rowSpan="2"
                    style={{
                      verticalAlign: "top",
                    }}
                  >
                    SL
                  </th>
                  <th
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                    }}
                    colSpan="2"
                  >
                    <div className="text-center">From</div>
                  </th>
                  <th
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                    }}
                    colSpan="2"
                  >
                    <div className="text-center">To</div>
                  </th>
                  <th
                    rowSpan="2"
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      verticalAlign: "top",
                    }}
                  >
                    <div className="sortable justify-content-center">Type</div>
                  </th>
                  <th
                    rowSpan="2"
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      verticalAlign: "top",
                    }}
                  >
                    <div className="sortable justify-content-center">
                      Effective Date
                    </div>
                  </th>
                </tr>
                <tr
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "rgba(82, 82, 82, 1)",
                  }}
                >
                  <td
                    style={{
                      backgroundColor: "rgba(247, 220, 92, 1)",
                    }}
                  >
                    <div>B.Unit & Workplace</div>
                  </td>
                  <td
                    style={{
                      backgroundColor: "rgba(247, 220, 92, 1)",
                    }}
                  >
                    Dept & Designation
                  </td>
                  <td
                    style={{
                      backgroundColor: "rgba(129, 225, 255, 1)",
                    }}
                  >
                    B.Unit & Workplace
                  </td>
                  <td
                    style={{
                      backgroundColor: "rgba(129, 225, 255, 1)",
                    }}
                  >
                    Dept & Designation
                  </td>
                </tr>
              </thead>
              <tbody>
                {applicationListData?.listData?.length > 0 &&
                  applicationListData?.listData?.map((data, i) => (
                    <tr
                      style={{
                        color: "rgba(95, 99, 104, 1)",
                        fontSize: "14px",
                      }}
                    >
                      <td className="text-center">
                        <div>{i + 1}</div>
                      </td>
                      <td
                        style={{
                          backgroundColor: "rgba(254, 249, 223, 1)",
                        }}
                      >
                        <div
                          style={{
                            color: "rgba(95, 99, 104, 1)",
                          }}
                          className=" "
                        >
                          <div>{data?.businessUnitNameFrom}</div>
                          <div>{data?.workplaceNameFrom}</div>
                        </div>
                      </td>
                      <td
                        style={{
                          backgroundColor: "rgba(254, 249, 223, 1)",
                        }}
                      >
                        <div
                          style={{
                            color: "rgba(95, 99, 104, 1)",
                          }}
                        >
                          <div>{data?.departmentNameFrom}</div>
                          <div>{data?.designationNameFrom}</div>
                        </div>
                      </td>
                      <td
                        style={{
                          backgroundColor: "rgba(230, 246, 253, 1)",
                        }}
                      >
                        <div
                          style={{
                            color: "rgba(95, 99, 104, 1)",
                          }}
                          className=""
                        >
                          <div>{data?.businessUnitName}</div>
                          <div>{data?.workplaceName}</div>
                        </div>
                      </td>
                      <td
                        style={{
                          backgroundColor: "rgba(230, 246, 253, 1)",
                        }}
                      >
                        <div
                          style={{
                            color: "rgba(95, 99, 104, 1)",
                          }}
                          className=""
                        >
                          <div>{data?.departmentName}</div>
                          <div>{data?.designationName}</div>
                        </div>
                      </td>
                      <td>
                        <div
                          style={{
                            color: "rgba(95, 99, 104, 1)",
                          }}
                        >
                          <div>{data?.strTransferNpromotionType}</div>
                        </div>
                      </td>
                      <td>
                        <div>{dateFormatter(data?.dteEffectiveDate)}</div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="master-filter-bottom footer-employeeProfile-src-filter">
            <div className="master-filter-btn-group">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={(e) => {
                  e.stopPropagation();
                  setAnchorEl(null);
                  setSingleData({});

                  setFieldValue("releaseDate", "");
                }}
                style={{
                  marginRight: "10px",
                }}
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default CardTable;
