/* eslint-disable no-unused-vars */
import { Cancel, CheckCircle } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/styles";
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
import { numberWithCommas } from "../../../../../utility/numberWithCommas";
import {
  getAllSalaryGenerateListDataForApproval,
  salaryGenerateApproveReject
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
    setFilterValues,
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
        fromDate: data?.dteEffectiveFrom,
        toDate: data?.dteEffectiveTo,
      },
    ];

    const callback = () => {
      getAllSalaryGenerateListDataForApproval(
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
        salaryGenerateApproveReject(payload, callback);
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

  const singleViewData = (data) => {
    history.push({
      pathname: `/compensationAndBenefits/payrollProcess/arearSalaryGenerate/view/${data?.intId}`,
      state: {
        isApproval: true,
        data: {
          ...data,
          intSalaryGenerateRequestId: data?.intId,
          dteSalaryGenerateFrom: data?.dteEffectiveFrom,
          dteSalaryGenerateTo: data?.dteEffectiveTo,
          ApprovalStatus: data?.application?.strStatus,
        },
      },
    });
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
                  if (
                    item?.application?.intAttendanceRegId ===
                    record?.application?.intAttendanceRegId
                  ) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else return item;
                });
                setApplicationListData({ listData: [...data] });
              }}
            />
          )}

          <span style={{ marginLeft: "5px" }}>{record?.employeeCode}</span>
        </div>
      ),
    },
    {
      title: "Business Unit",
      dataIndex: "strBusinessUnit",
      render: (strBusinessUnit) => (
        <div className="d-flex align-items-center">
          <AvatarComponent
            classess=""
            letterCount={1}
            label={strBusinessUnit}
          />
          <span className="ml-2">{strBusinessUnit}</span>
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Arrear Salary Code",
      dataIndex: "strArearSalaryCode",
      sorter: true,
      filter: true,
    },
    {
      title: "Payroll Period",
      dataIndex: "department",
      render: (_, record) => (
        <>
          <div className="d-flex align-items-center ">
            <LightTooltip
              title={
                <div className="movement-tooltip p-2">
                  <div>
                    <p className="tooltip-title">Description</p>
                    <p className="tooltip-subTitle">
                      {record?.application?.strDescription}
                    </p>
                  </div>
                </div>
              }
              arrow
            >
              <InfoOutlinedIcon
                sx={{
                  marginRight: "12px",
                  color: "rgba(0,0,0,0.6)",
                }}
              />
            </LightTooltip>
            <span className="content tableBody-title">
              {record?.dteEffectiveFrom
                ? dateFormatter(record?.dteEffectiveFrom)
                : "-"}{" "}
              -{" "}
              {record?.dteEffectiveTo
                ? dateFormatter(record?.dteEffectiveTo)
                : "-"}
            </span>
          </div>
        </>
      ),
    },
    {
      title: "Net Amount",
      dataIndex: "numNetPayableSalary",
      render: (_, record) => (
        <>{numberWithCommas(record?.numNetPayableSalary)}</>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Waiting Stage",
      dataIndex: "waitingStage",
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
      {applicationListData?.listData?.length > 0 ? (
        //   <AntTable
        //   rowSelection={{
        //     type: "checkbox",
        //   }}
        //   data={applicationListData?.listData}
        //   columnsData={columns()}
        //   onRowClick={(dataRow) => {
        //     singleViewData(dataRow)
        //   }}
        // />
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
              <th scope="col">
                <div
                  className="d-flex align-items-center pointer"
                  onClick={() => {
                    setBusinessUnitOrder(
                      businessUnitOrder === "desc" ? "asc" : "desc"
                    );
                    commonSortByFilter(businessUnitOrder, "strBusinessUnit");
                  }}
                >
                  Business Unit
                  <SortingIcon viewOrder={businessUnitOrder} />
                </div>
              </th>
              <th scope="col">
                <div
                  className="d-flex align-items-center pointer"
                  onClick={() => {
                    setSalaryCodeOrder(
                      salaryCodeOrder === "desc" ? "asc" : "desc"
                    );
                    commonSortByFilter(salaryCodeOrder, "strArearSalaryCode");
                  }}
                >
                  Arrear Salary Code
                  <SortingIcon viewOrder={salaryCodeOrder} />
                </div>
              </th>
              <th scope="col">Payroll Period</th>
              <th style={{ textAlign: "right" }}>Net Amount</th>
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
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{ cursor: "pointer" }}
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
                  <td onClick={() => singleViewData(data)}>
                    <div className="employeeInfo d-flex align-items-center">
                      <AvatarComponent
                        letterCount={1}
                        label={data?.strBusinessUnit}
                      />
                      <div className="employeeTitle ml-2">
                        <p className="employeeName tableBody-title">
                          {data?.strBusinessUnit}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td onClick={() => singleViewData(data)}>
                    <p className="tableBody-title">
                      {data?.strArearSalaryCode}
                    </p>
                  </td>
                  <td onClick={() => singleViewData(data)}>
                    <div className="tableBody-title">
                      <div className="d-flex align-items-center ">
                        <LightTooltip
                          title={
                            <div className="movement-tooltip p-2">
                              <div>
                                <p className="tooltip-title">Description</p>
                                <p className="tooltip-subTitle">
                                  {data?.application?.strDescription}
                                </p>
                              </div>
                            </div>
                          }
                          arrow
                        >
                          <InfoOutlinedIcon
                            sx={{
                              marginRight: "12px",
                              color: "rgba(0,0,0,0.6)",
                            }}
                          />
                        </LightTooltip>
                        <span className="content tableBody-title">
                          {data?.dteEffectiveFrom
                            ? dateFormatter(data?.dteEffectiveFrom)
                            : "-"}{" "}
                          -{" "}
                          {data?.dteEffectiveTo
                            ? dateFormatter(data?.dteEffectiveTo)
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="tableBody-title text-right">
                      {numberWithCommas(data?.numNetPayableSalary)}
                    </div>
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
