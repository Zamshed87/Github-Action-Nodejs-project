import { Cancel, CheckCircle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AvatarComponent from "../../../../../common/AvatarComponent";
import Chips from "../../../../../common/Chips";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../../common/IConfirmModal";
import MuiIcon from "../../../../../common/MuiIcon";
import NoResult from "../../../../../common/NoResult";
import SortingIcon from "../../../../../common/SortingIcon";
import { gray900, greenColor } from "../../../../../utility/customColor";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import {
  bonusGenerateApproveReject, getAllBonusGenerateListDataForApproval
} from "../../helper";

const CardTable = ({ propsObj }) => {
  const {
    setFieldValue,
    applicationListData,
    setApplicationListData,
    appliedStatus,
    allData,
    setAllData,
    filterValues,
  } = propsObj;

  const { employeeId, isOfficeAdmin, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [businessUnitOrder, setBusinessUnitOrder] = useState("desc");
  const [salaryCodeOrder, setSalaryCodeOrder] = useState("desc");
  const history = useHistory();

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
        applicationId: data?.intId,
        approverEmployeeId: employeeId,
        isReject: text === "Reject" ? true : false,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAllBonusGenerateListDataForApproval(
        {
          approverId: employeeId,
          intId: filterValues?.applicationStatus || 0,
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
        bonusGenerateApproveReject(payload, callback);
      },
      noAlertFunc: () => { },
    };
    IConfirmModal(confirmObject);
  };

  const singleViewRoute = (data) => {
    history.push({
      pathname: `/compensationAndBenefits/payrollProcess/bonusGenerate/view/${data?.application?.intBonusHeaderId}`,
      state: {
        isApproval: true,
        data: {
          ...data,
          intBonusHeaderId: data?.intId,
          strBusinessUnit: data?.strBusinessUnitName,
          strStatus: data?.application?.strStatus
        }
      },
    });
  };

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
                        e.stopPropagation();
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
              <th scope="col">
                <div
                  className="d-flex align-items-center pointer"
                  onClick={() => {
                    setBusinessUnitOrder(
                      businessUnitOrder === "desc" ? "asc" : "desc"
                    );
                    commonSortByFilter(businessUnitOrder, "strBusinessUnitName");
                  }}
                >
                  Business Unit
                  <SortingIcon viewOrder={businessUnitOrder} />
                </div>
              </th>
              <th scope="col">Bonus System Type</th>
              <th scope="col">
                <div
                  className="d-flex align-items-center pointer"
                  onClick={() => {
                    setSalaryCodeOrder(
                      salaryCodeOrder === "desc" ? "asc" : "desc"
                    );
                    commonSortByFilter(salaryCodeOrder, "strBonusName");
                  }}
                >
                  Bonus Name
                  <SortingIcon viewOrder={salaryCodeOrder} />
                </div>
              </th>
              {/* <th scope="col">Workplace Group</th>
              <th scope="col">Workplace</th>
              <th scope="col">Payroll Group</th> */}
              <th>Effective Date</th>
              {isOfficeAdmin && (
                <th scope="col">
                  <div className="d-flex align-items-center">
                    Waiting Stage
                  </div>
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
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{
                    cursor: "pointer"
                  }}
                >
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
                            e.stopPropagation();
                            let data = [...applicationListData?.listData];
                            data[i].selectCheckbox = e.target.checked;
                            setApplicationListData({ listData: [...data] });
                          }}
                        />
                      </td>
                    )}
                  <td onClick={() => singleViewRoute(data)}>
                    <div className="employeeInfo d-flex align-items-center">
                      <AvatarComponent
                        letterCount={1}
                        label={data?.strBusinessUnitName}
                      />
                      <div className="employeeTitle ml-2">
                        <p className="employeeName tableBody-title">
                          {data?.strBusinessUnitName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td onClick={() => singleViewRoute(data)}>
                    <p className="tableBody-title">
                      {data?.intArrearBonusReferenceId ? "Arrear Bonus Generate" : "Bonus Generate"}
                    </p>
                  </td>
                  <td onClick={() => singleViewRoute(data)}>
                    <p className="tableBody-title">{data?.strBonusName}</p>
                  </td>
                  {/* <td onClick={() => singleViewRoute(data)}>
                    <div className="ableBody-title">
                      {data?.application?.strWorkplaceGroupName}
                    </div>
                  </td>
                  <td onClick={() => singleViewRoute(data)}>
                    <p className="tableBody-title">
                      {data?.application?.strWorkplaceName}
                    </p>
                  </td>
                  <td onClick={() => singleViewRoute(data)}>
                    <div className="tableBody-title">
                      {data?.application?.strPayrollGroupName}
                    </div>
                  </td> */}
                  <td onClick={() => singleViewRoute(data)}>
                    <p className="tableBody-title">
                      {dateFormatter(data?.dteEffectedDateTime)}
                    </p>
                  </td>
                  {isOfficeAdmin && (
                    <td>
                      <div className="tableBody-title">{data?.currentStage}</div>
                    </td>
                  )}
                  <td className="text-center" width="10%">
                    {data?.application?.strStatus === "Approved" && (
                      <Chips label="Approved" classess="success" />
                    )}
                    {data?.application?.strStatus === "Pending" && (
                      <>
                        <div className="actionChip">
                          <Chips label="Pending" classess=" warning" />
                        </div>
                        <div className="d-flex actionIcon justify-content-center">
                          <Tooltip title="Accept">
                            <div
                              className="mx-2 muiIconHover success "
                              onClick={(e) => {
                                e.stopPropagation();
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
                              onClick={(e) => {
                                e.stopPropagation();
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
                    {data?.application?.strStatus === "Rejected" && (
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
