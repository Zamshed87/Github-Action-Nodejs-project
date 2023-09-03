/* eslint-disable no-unused-vars */
import { Cancel, CheckCircle } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/styles";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AvatarComponent from "../../../../common/AvatarComponent";
import Chips from "../../../../common/Chips";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../common/IConfirmModal";
import MuiIcon from "../../../../common/MuiIcon";
import NoResult from "../../../../common/NoResult";
import SortingIcon from "../../../../common/SortingIcon";
import { gray900, greenColor } from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { getAllIOUListDataForApproval, IOUApproveReject } from "../helper";

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
    if (data?.application?.numReceivableAmount) {
      return toast.warning("Receivable amount must be equal zero!!!", {
        toastId: "111",
      });
    }
    let payload = [
      {
        applicationId: data?.application?.intIouadjustmentId,
        approverEmployeeId: employeeId,
        isReject: text === "Reject" ? true : false,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAllIOUListDataForApproval(
        {
          applicationStatus: "Pending",
          isAdmin: isOfficeAdmin,
          isSupOrLineManager: 0,
          isSupervisor: false,
          isLineManager: false,
          isUserGroup: false,
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
        IOUApproveReject(payload, callback);
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
              <th style={{ width: "25px", textAlign: "center" }}>SL</th>
              {!(
                appliedStatus?.label === "Approved" ||
                appliedStatus?.label === "Rejected"
              ) && (
                  <th scope="col">
                    <FormikCheckBox
                      styleObj={{
                        margin: "0 auto!important",
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
              <th style={{ width: "100px" }}>
                <div >Code</div>
              </th>
              <th scope="col">
                <div
                  className="d-flex align-items-center pointer ml-2"
                  onClick={() => {
                    setEmpOrder(empOrder === "desc" ? "asc" : "desc");
                    commonSortByFilter(empOrder, "strEmployeeName");
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
              <th>Application Date</th>
              <th>Date Range</th>
              <th>IOU Amount</th>
              <th>Adjusted</th>
              <th>Payable</th>
              <th>Receivable</th>
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
                <tr
                  className="hasEvent"
                  onClick={(e) => {
                    setSingleData(data);
                    setViewModal(true);
                  }}
                  key={i}
                >
                  <td className="text-center">{i + 1}</td>
                  {!(
                    appliedStatus?.label === "Approved" ||
                    appliedStatus?.label === "Rejected"
                  ) && (
                      <td
                        className="m-0"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <FormikCheckBox
                          styleObj={{
                            margin: "0 0 0 1px",
                            color: gray900,
                            checkedColor: greenColor,
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
                    <div className="employeeInfo d-flex align-items-center ml-2">
                      <AvatarComponent
                        letterCount={1}
                        label={data?.strEmployeeName}
                      />
                      <div className="employeeTitle ml-2">
                        <p className="employeeName tableBody-title">
                          {data?.strEmployeeName}
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
                    <p className="tableBody-title">
                      {dateFormatter(data?.application?.dteCreatedAt)}
                    </p>
                  </td>
                  <td>
                    <p className="tableBody-title">
                      {dateFormatter(data?.dteFromDate)}-
                      {dateFormatter(data?.dteToDate)}
                    </p>
                  </td>
                  <td>
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
                                Description
                              </p>
                              <p
                                className="tooltip-subTitle"
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "500",
                                }}
                              >
                                {data?.description}
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
                        {data?.iouAmount}
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="tableBody-title">
                      {data?.numAdjustmentAmount}
                    </p>
                  </td>
                  <td>
                    <p className="tableBody-title">
                      {data?.application?.numPayableAmount}
                    </p>
                  </td>
                  <td>
                    <p className="tableBody-title">
                      {data?.application?.numReceivableAmount}
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
                              onClick={(e) => {
                                demoPopup("approve", "Approve", data);
                                e.stopPropagation();
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
                              onClick={(e) => {
                                demoPopup("reject", "Reject", data);
                                e.stopPropagation();
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
