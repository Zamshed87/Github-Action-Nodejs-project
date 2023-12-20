/* eslint-disable react-hooks/exhaustive-deps */
import { MenuItem } from "@material-ui/core";
import {
  ArrowDropDown,
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Select } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import Chips from "../../../../common/Chips";
import DefaultInput from "../../../../common/DefaultInput";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import {
  compensationBenefitsLSAction,
  setFirstLevelNameAction,
} from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  dateFormatter,
  monthFirstDate,
  monthLastDate,
} from "../../../../utility/dateFormatter";
import { getMonthName } from "../../../../utility/monthUtility";
import { numberWithCommas } from "../../../../utility/numberWithCommas";
import { getSalaryReport } from "./helper";

const initData = {
  search: "",
  status: "",
  filterFromDate: monthFirstDate(),
  filterToDate: monthLastDate(),
};

// status DDL
const statusDDL = [
  { value: "Send for Approval", label: "Send for Approval" },
  { value: "Waiting for Approval", label: "Waiting for Approval" },
  { value: "Approved", label: "Approved" },
];

export default function SalaryReport() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // LS data compensationBenefits
  const { compensationBenefits } = useSelector((state) => {
    return state?.localStorage;
  }, shallowEqual);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 81) {
      permission = item;
    }
  });

  // state define
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);

  // filter
  const [status, setStatus] = useState("");

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Salary Summary Report";
  }, []);

  useEffect(() => {
    getSalaryReport(
      "SalaryGenerateRequestLanding",
      orgId,
      buId,
      wgId,
      0,
      0,
      values?.filterFromDate,
      values?.filterToDate,
      0,
      0,
      setRowDto,
      setAllData,
      setLoading
    );
  }, [wgId]);

  // search
  const filterData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.strBusinessUnit?.toLowerCase()) ||
          regex.test(item?.strSalaryCode?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  // status type filter
  const statusTypeFilter = (statusType) => {
    const newRowData = [...rowDto];
    let modifyRowData = [];
    if (statusType === "Approved") {
      modifyRowData = newRowData?.filter(
        (item) => item?.ApprovalStatus === "Approved"
      );
    } else if (statusType === "Waiting for Approval") {
      modifyRowData = newRowData?.filter(
        (item) => item?.ApprovalStatus === "Waiting for Approval"
      );
    } else if (statusType === "Send for Approval") {
      modifyRowData = newRowData?.filter(
        (item) => item?.ApprovalStatus === "Send for Approval"
      );
    }
    setRowDto(modifyRowData);
  };

  const saveHandler = (values) => {};

  // useFormik hooks
  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initData,
      filterFromDate:
        compensationBenefits?.salarySummaryLanding?.fromDate ||
        monthFirstDate(),
      filterToDate:
        compensationBenefits?.salarySummaryLanding?.toDate || monthLastDate(),
    },
    onSubmit: (values) => saveHandler(values),
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        {loading && <Loading />}
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading">
              <h2>Generate List</h2>
              <ul className="d-flex flex-wrap">
                {(values?.search || status) && (
                  <li>
                    <ResetButton
                      classes="btn-filter-reset"
                      title="reset"
                      icon={
                        <SettingsBackupRestoreOutlined
                          sx={{ marginRight: "10px", fontSize: "16px" }}
                        />
                      }
                      onClick={() => {
                        setRowDto(allData);
                        setFieldValue("search", "");
                        setStatus("");
                      }}
                    />
                  </li>
                )}
                <li>
                  <DefaultInput
                    classes="search-input fixed-width mr-0"
                    inputClasses="search-inner-input"
                    placeholder="Search"
                    value={values?.search}
                    name="search"
                    type="text"
                    trailicon={<SearchOutlined sx={{ color: "#323232" }} />}
                    onChange={(e) => {
                      filterData(e.target.value, allData, setRowDto);
                      setFieldValue("search", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </li>
              </ul>
            </div>

            <div className="card-style pb-0 mt-3 mb-2">
              <div className="row">
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>From Date</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.filterFromDate}
                      placeholder="Month"
                      name="toDate"
                      max={values?.filterToDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        dispatch(
                          compensationBenefitsLSAction({
                            ...compensationBenefits,
                            salarySummaryLanding: {
                              ...compensationBenefits?.salarySummaryLanding,
                              fromDate: e.target.value,
                            },
                          })
                        );
                        setFieldValue("filterFromDate", e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>To Date</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.filterToDate}
                      placeholder="Month"
                      name="toDate"
                      min={values?.filterFromDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        dispatch(
                          compensationBenefitsLSAction({
                            ...compensationBenefits,
                            salarySummaryLanding: {
                              ...compensationBenefits?.salarySummaryLanding,
                              toDate: e.target.value,
                            },
                          })
                        );
                        setFieldValue("filterToDate", e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <button
                    className="btn btn-green btn-green-disable mt-4"
                    type="button"
                    disabled={!values?.filterFromDate || !values?.filterToDate}
                    onClick={(e) => {
                      e.stopPropagation();
                      getSalaryReport(
                        "SalaryGenerateRequestLanding",
                        orgId,
                        buId,
                        wgId,
                        0,
                        0,
                        values?.filterFromDate,
                        values?.filterToDate,
                        0,
                        0,
                        setRowDto,
                        setAllData,
                        setLoading
                      );
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            <div className="table-card-styled tableOne">
              {rowDto?.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}>
                        <div>SL</div>
                      </th>
                      <th>
                        <div>Salary Code</div>
                      </th>
                      <th>
                        <div>Salary Type</div>
                      </th>
                      <th>
                        <div>Business Unit</div>
                      </th>
                      <th>
                        <div>Workplace Group</div>
                      </th>
                      {wgId === 3 && (
                        <>
                          <th>
                            <div>Wing</div>
                          </th>
                          <th>
                            <div>Sole Depo</div>
                          </th>
                          <th>
                            <div>Region</div>
                          </th>
                          <th>
                            <div>Area</div>
                          </th>
                          <th>
                            <div>Territory</div>
                          </th>
                        </>
                      )}
                      <th>
                        <div>Payroll Month</div>
                      </th>
                      <th>
                        <div>Payroll Period</div>
                      </th>
                      <th style={{ textAlign: "right" }}>
                        <div>Net Amount</div>
                      </th>
                      <th></th>
                      <th>
                        <div className="table-th d-flex align-items-center">
                          Status
                          <span>
                            <Select
                              sx={{
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "none !important",
                                },
                                "& .MuiSelect-select": {
                                  paddingRight: "22px !important",
                                  marginTop: "-15px",
                                },
                              }}
                              className="selectBtn"
                              name="status"
                              IconComponent={ArrowDropDown}
                              value={values?.status}
                              onChange={(e) => {
                                setFieldValue("status", "");
                                setStatus(e.target.value?.value);
                                statusTypeFilter(e.target.value?.value);
                              }}
                            >
                              {statusDDL?.length > 0 &&
                                statusDDL?.map((item, index) => {
                                  return (
                                    <MenuItem key={index} value={item}>
                                      {item?.label}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item?.isGenerated === true) {
                            history.push({
                              pathname: `/compensationAndBenefits/reports/salaryReport/${item?.intSalaryGenerateRequestId}`,
                              state: item,
                            });
                          } else {
                            return toast.warning(
                              "Salary Generate on processing. Please wait...",
                              {
                                toastId: 1,
                              }
                            );
                          }
                        }}
                      >
                        <td>
                          <div>{index + 1}</div>
                        </td>

                        <td>
                          <div className="tableBody-title">
                            {item?.strSalaryCode}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.strSalaryTypeLabel}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.strBusinessUnit}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.strWorkplaceGroupName}
                          </div>
                        </td>
                        {wgId === 3 && (
                          <>
                            <td>
                              <div className="tableBody-title">
                                {item?.wingName}
                              </div>
                            </td>
                            {wgId === 3 && (
                              <td>
                                <div className="tableBody-title">
                                  {item?.soleDepoName}
                                </div>
                              </td>
                            )}
                            <td>
                              <div className="tableBody-title">
                                {item?.regionName}
                              </div>
                            </td>
                            <td>
                              <div className="tableBody-title">
                                {item?.areaName}
                              </div>
                            </td>
                            <td>
                              <div className="tableBody-title">
                                {item?.territoryName}
                              </div>
                            </td>
                          </>
                        )}

                        <td>
                          <div className="tableBody-title">
                            {`${getMonthName(item?.intMonth)}, ${
                              item?.intYear
                            }`}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.dteSalaryGenerateFrom
                              ? dateFormatter(item?.dteSalaryGenerateFrom)
                              : "-"}{" "}
                            -{" "}
                            {item?.dteSalaryGenerateTo
                              ? dateFormatter(item?.dteSalaryGenerateTo)
                              : "-"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title text-right">
                            {numberWithCommas(item?.numNetPayableSalary)}
                          </div>
                        </td>
                        <td style={{ width: "30px" }}></td>
                        <td>
                          <div className="tableBody-title">
                            {item?.ApprovalStatus === "Approved" && (
                              <Chips label="Approved" classess="success p-2" />
                            )}
                            {item?.ApprovalStatus ===
                              "Waiting for Approval" && (
                              <Chips
                                label="Waiting for Approval"
                                classess="warning p-2"
                              />
                            )}
                            {item?.ApprovalStatus === "Send for Approval" && (
                              <Chips
                                label="Send for Approval"
                                classess="indigo p-2"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <>{!loading && <NoResult title="No Result Found" para="" />}</>
              )}
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
}
