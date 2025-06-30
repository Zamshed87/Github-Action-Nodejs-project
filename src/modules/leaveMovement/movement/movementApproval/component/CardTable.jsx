/* eslint-disable no-unused-vars */
import { Cancel, CheckCircle } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/styles";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import AvatarComponent from "../../../../../common/AvatarComponent";
import Chips from "../../../../../common/Chips";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../../common/IConfirmModal";
import MuiIcon from "../../../../../common/MuiIcon";
import NoResult from "../../../../../common/NoResult";
import SortingIcon from "../../../../../common/SortingIcon";
import { gray900, greenColor } from "../../../../../utility/customColor";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import { timeFormatter } from "../../../../../utility/timeFormatter";
import {
  getAllMovementApplicatonListDataForApproval,
  movementApproveReject,
} from "../../helper";

const CardTable = ({ propsObj }) => {
  const {
    setFieldValue,
    applicationListData,
    setApplicationListData,
    appliedStatus,
    allData,
    /* isSupOrLineManager, */ setAllData,
    filterValues,
    setFilterValues,
  } = propsObj;

  const { employeeId, isOfficeAdmin, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // eslint-disable-next-line no-unused-vars
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
        applicationId: data?.movementApplication?.intApplicationId,
        approverEmployeeId: employeeId,
        // approverEmployeeId: item?.movementApplication?.intEmployeeId,
        isReject: text === "Reject" ? true : false,
        fromDate: data?.movementApplication?.dteFromDate,
        toDate: data?.movementApplication?.dteToDate,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAllMovementApplicatonListDataForApproval(
        {
          approverId: employeeId,
          movementTypeId: filterValues?.movementType?.MovementTypeId || 0,
          workplaceGroupId: filterValues?.workplace?.id || 0,
          departmentId: filterValues?.department?.id || 0,
          designationId: filterValues?.designation?.id || 0,
          applicantId: filterValues?.employee?.id || 0,
          fromDate: filterValues?.movementFromDate || "",
          toDate: filterValues?.movementToDate || "",
          applicationStatus:
            filterValues?.appStatus?.label === "Rejected"
              ? "Reject"
              : filterValues?.appStatus?.label || "Pending",
          isAdmin: isOfficeAdmin,
          // isSupOrLineManager: isSupOrLineManager?.value,
          isSupOrLineManager: 0,
          accountId: orgId,
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
        movementApproveReject(payload, callback);
      },
      noAlertFunc: () => { },
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
  return (
    <>
      {applicationListData?.listData?.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: "30px", textAlign: "center" }}>SL</th>

              {!(
                appliedStatus?.label === "Approved" ||
                appliedStatus?.label === "Rejected"
              ) && (
                  <th scope="col" style={{ width: "35px" }}>
                    <FormikCheckBox
                      styleObj={{
                        margin: "0 auto!important",
                        color: gray900,
                        checkColor: greenColor,
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
                          listData: applicationListData?.listData?.map(
                            (item) => ({
                              ...item,
                              selectCheckbox: e.target.checked,
                            })
                          ),
                        });
                        setFieldValue("allSelected", e.target.checked);
                      }}
                    />
                  </th>
                )}
              <th style={{ width: "30px", textAlign: "center" }}>Code</th>
              <th scope="col">
                <div
                  className="d-flex align-items-center pointer"
                  onClick={() => {
                    setEmpOrder(empOrder === "desc" ? "asc" : "desc");
                    commonSortByFilter(empOrder, "employeeName");
                  }}
                >
                  Employee
                  <SortingIcon viewOrder={empOrder} />
                </div>
              </th>
              <th scope="col">
                <div
                  className="d-flex align-items-center pointer"
                  onClick={() => {
                    setDesgOrder(desgOrder === "desc" ? "asc" : "desc");
                    commonSortByFilter(desgOrder, "designation");
                  }}
                >
                  Designation
                  <SortingIcon viewOrder={desgOrder} />
                </div>
              </th>
              <th scope="col">
                <div
                  className="d-flex align-items-center pointer"
                  onClick={() => {
                    setDeptOrder(deptOrder === "desc" ? "asc" : "desc");
                    commonSortByFilter(deptOrder, "department");
                  }}
                >
                  Department
                  <SortingIcon viewOrder={deptOrder} />
                </div>
              </th>
              <th scope="col">Movement Type</th>
              <th scope="col">Date Range</th>
              <th scope="col">Time Range</th>
              <th>Application Date</th>
              {isOfficeAdmin && (
                <th scope="col">
                  <div className="d-flex align-items-center">Waiting Stage</div>
                </th>
              )}
              <th>
                <div className="d-flex align-items-center justify-content-center">
                  Status
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {applicationListData?.listData?.length > 0 &&
              applicationListData?.listData?.map((data, i) => (
                <tr key={i}>
                  <td className="text-center">{i + 1}</td>

                  {!(
                    appliedStatus?.label === "Approved" ||
                    appliedStatus?.label === "Rejected"
                  ) && (
                      <td>
                        <FormikCheckBox
                          styleObj={{
                            margin: "0 0 0 1px",
                            checkedColor: greenColor,
                            color: gray900,
                          }}
                          name="selectCheckbox"
                          color={greenColor}
                          checked={
                            applicationListData?.listData[i]?.selectCheckbox
                          }
                          onChange={(e) => {
                            let data = [...applicationListData?.listData];
                            data[i].selectCheckbox = e.target.checked;
                            setApplicationListData({ listData: [...data] });
                          }}
                        />
                      </td>
                    )}
                  <td>
                    <div className="tableBody-title"> {data?.employeeCode}</div>
                  </td>
                  <td>
                    <div className="employeeInfo d-flex align-items-center">
                      <AvatarComponent
                        letterCount={1}
                        label={data?.employeeName}
                      />
                      <div className="employeeTitle ml-2">
                        <p className="employeeName tableBody-title">
                          {data?.employeeName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="tableBody-title">
                      {data?.designation}, {data?.employmentType}
                    </p>
                  </td>
                  <td>
                    <p className="tableBody-title">{data?.department}</p>
                  </td>
                  <td>
                    <div className="d-flex align-items-center justify-content-start">
                      <LightTooltip
                        title={
                          <div className="movement-tooltip p-1">
                            <div className="border-bottom">
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
                                {data?.movementApplication?.strReason}
                              </p>
                            </div>
                            <div>
                              <p
                                className="tooltip-title mt-1"
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                }}
                              >
                                Location
                              </p>
                              <p
                                className="tooltip-subTitle mb-0"
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "500",
                                }}
                              >
                                {data?.movementApplication?.strLocation}
                              </p>
                            </div>
                          </div>
                        }
                        arrow
                      >
                        <InfoOutlinedIcon
                          sx={{
                            color: gray900,
                          }}
                        />
                      </LightTooltip>
                      <div className="ml-2 tableBody-title">
                        {data?.movementType}
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="tableBody-title">
                      {dateFormatter(data?.movementApplication?.dteFromDate)}-{" "}
                      {dateFormatter(data?.movementApplication?.dteToDate)}
                    </p>
                  </td>
                  <td>
                    <p className="tableBody-title">
                      {data?.movementApplication?.tmeFromTime &&
                        timeFormatter(data?.movementApplication?.tmeFromTime)}
                      -
                      {data?.movementApplication?.tmeToTime &&
                        timeFormatter(data?.movementApplication?.tmeToTime)}
                    </p>
                  </td>
                  <td>
                    <p className="tableBody-title">
                      {dateFormatter(data?.movementApplication?.dteCreatedAt)}
                    </p>
                  </td>
                  {isOfficeAdmin && (
                    <td>
                      <div className="tableBody-title">
                        {data?.currentStage}
                      </div>
                    </td>
                  )}
                  <td className="text-center" width="10%">
                    {data?.status === "Approved" && (
                      <Chips label="Approved" classess="success" />
                    )}
                    {data?.status === "Pending" && (
                      <>
                        <div className="actionChip">
                          <Chips label="Pending" classess=" warning" />
                        </div>
                        <div className="d-flex actionIcon justify-content-center">
                          <Tooltip title="Accept">
                            <div
                              className="mx-2 muiIconHover success "
                              onClick={() => {
                                demoPopup("approve", "Approve", data);
                              }}
                            >
                              <MuiIcon
                                icon={<CheckCircle sx={{ color: "#34A853" }} />}
                              />
                            </div>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <div
                              className="muiIconHover danger"
                              onClick={() => {
                                demoPopup("reject", "Reject", data);
                              }}
                            >
                              <MuiIcon
                                icon={<Cancel sx={{ color: "#FF696C" }} />}
                              />
                            </div>
                          </Tooltip>
                        </div>
                      </>
                    )}
                    {data?.status === "Rejected" && (
                      <Chips label="Rejected" classess="danger" />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <NoResult />
      )}
    </>
  );
};

export default CardTable;
