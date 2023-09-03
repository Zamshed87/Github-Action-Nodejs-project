/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Tooltip, tooltipClasses } from "@mui/material";
import {
  InfoOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import FilterModal from "./components/FilterModal";
import PrintIcon from "@mui/icons-material/Print";
import { getPDFAction } from "../../../../utility/downloadFile";
import { filterData, getLoanApplicationByAdvanceFilter } from "./helper";
import NoResult from "../../../../common/NoResult";
import SortingIcon from "../../../../common/SortingIcon";
import AvatarComponent from "../../../../common/AvatarComponent";
import { dateFormatter } from "../../../../utility/dateFormatter";
import Chips from "../../../../common/Chips";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import "./loanHistory.css";

// status DDL
// eslint-disable-next-line no-unused-vars
const statusDDL = [
  { value: "Completed", label: "Completed" },
  { value: "Running", label: "Running" },
  { value: "Not Started", label: "Not Started" },
  { value: "Hold", label: "Hold" },
];

const initData = {
  status: "",
  search: "",
  loanType: "",
  department: "",
  designation: "",
  employee: "",
  fromDate: "",
  toDate: "",
  minimumAmount: "",
  maximumAmount: "",
  applicationStatus: "",
  installmentStatus: "",
};

const LoanHistory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#fff !important",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#fff",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 300,
      boxShadow:
        "0px 1px 5px rgba(0, 0, 0, 0.05), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 5px rgba(0, 0, 0, 0.05)",
      fontSize: 11,
    },
  }));

  const [loading, setLoading] = useState(false);

  // row data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);

  // filter
  const [isFilter, setIsFilter] = useState(false);
  // const [status, setStatus] = useState("");
  const [viewOrder, setViewOrder] = useState("desc");
  const [designationOrder, setDesignationOrder] = useState("desc");
  const [dateOrder, setDateOrder] = useState("desc");

  // master filter
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { buId, employeeId, fullname, designationId, designationName, wgId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  useEffect(() => {
    getLoanApplicationByAdvanceFilter(
      setAllData,
      setRowDto,
      setLoading,
      {
        businessUnitId: buId,
        loanTypeId: 0,
        departmentId: 0,
        designationId: 0,
        employeeId: 0,
        fromDate: "",
        toDate: "",
        minimumAmount: 0,
        maximumAmount: 0,
        applicationStatus: "",
        installmentStatus: "",
      },
      ""
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, buId]);

  const saveHandler = (values) => {};

  // active & inactive filter
  // eslint-disable-next-line no-unused-vars
  const statusTypeFilter = (statusType) => {
    const newRowData = [...allData];
    let modifyRowData = [];
    if (statusType === "Completed") {
      modifyRowData = newRowData?.filter(
        (item) => item?.installmentStatus === "Completed"
      );
    } else if (statusType === "Running") {
      modifyRowData = newRowData?.filter(
        (item) => item?.installmentStatus === "Running"
      );
    } else if (statusType === "Hold") {
      modifyRowData = newRowData?.filter(
        (item) => item?.installmentStatus === "Hold"
      );
    } else {
      modifyRowData = newRowData?.filter(
        (item) => item?.installmentStatus === "Not Started"
      );
    }
    setRowDto(modifyRowData);
  };

  // ascending & descending
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...allData];
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
    setRowDto(modifyRowData);
  };

  // masterHandler
  const masterFilterHandler = (values, resetForm, initData) => {
    const callback = () => {
      resetForm(initData);
    };
    getLoanApplicationByAdvanceFilter(
      setAllData,
      setRowDto,
      setLoading,
      {
        businessUnitId: buId,
        loanTypeId: values?.loanType?.value || 0,
        departmentId: values?.department?.value || 0,
        designationId: values?.designation?.value || 0,
        employeeId: values?.employee?.value || 0,
        fromDate: values?.fromDate || "",
        toDate: values?.toDate || "",
        minimumAmount: values?.minimumAmount || 0,
        maximumAmount: values?.maximumAmount || 0,
        applicationStatus: values?.applicationStatus?.label || "",
        installmentStatus: values?.installmentStatus?.label || "",
      },
      callback
    );
    setAnchorEl(null);
  };
  // eslint-disable-next-line no-unused-vars
  const [hasData, setHasData] = useState(false);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employee: { value: employeeId, label: fullname },
          designation: { value: designationId, label: designationName },
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="table-card">
                <div className="table-card-heading">
                  <div>
                    <Tooltip title="Print">
                      <button
                        className="btn-save"
                        type="button"
                        style={{
                          border: "transparent",
                          width: "30px",
                          height: "30px",
                          background: "#f2f2f7",
                          borderRadius: "100px",
                        }}
                        onClick={() => {
                          getPDFAction(
                            `/emp/PdfAndExcelReport/LoanReportAll?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&DepartmentId=${
                              values?.department?.value || 0
                            }&DesignationId=${
                              values?.designation?.value || 0
                            }&EmployeeId=${
                              values?.employee?.value || 0
                            }&LoanTypeId=${
                              values?.loanType?.value || 0
                            }&FromDate=${values?.fromDate || ""}&ToDate=${
                              values?.toDate || ""
                            }&MinimumAmount=${
                              values?.minimumAmount || 0
                            }&MaximumAmount=${
                              values?.maximumAmount || 0
                            }&ApplicationStatus=${
                              values?.applicationStatus?.label || ""
                            }&InstallmentStatus=${
                              values?.installmentStatus?.label || ""
                            }`,
                            setLoading
                          );
                        }}
                      >
                        <PrintIcon
                          sx={{ color: "#637381", fontSize: "16px" }}
                        />
                      </button>
                    </Tooltip>
                  </div>
                  <div className="table-card-head-right">
                    <ul>
                      {isFilter && (
                        <li>
                          <ResetButton
                            title="reset"
                            icon={
                              <SettingsBackupRestoreOutlined
                                sx={{ marginRight: "10px" }}
                              />
                            }
                            onClick={() => {
                              getLoanApplicationByAdvanceFilter(
                                setAllData,
                                setRowDto,
                                setLoading,
                                {
                                  businessUnitId: buId,
                                  loanTypeId: 0,
                                  departmentId: 0,
                                  designationId: 0,
                                  employeeId: 0,
                                  fromDate: "",
                                  toDate: "",
                                  minimumAmount: 0,
                                  maximumAmount: 0,
                                  applicationStatus: "",
                                  installmentStatus: "",
                                },
                                resetForm(initData)
                              );
                              setRowDto(allData);
                              resetForm(initData);
                              setIsFilter(false);
                              // setStatus("");
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <MasterFilter
                          width="200px"
                          inputWidth="200px"
                          value={values?.search}
                          setValue={(value) => {
                            filterData(value, allData, setRowDto);
                            setFieldValue("search", value);
                          }}
                          cancelHandler={() => {
                            getLoanApplicationByAdvanceFilter(
                              setAllData,
                              setRowDto,
                              setLoading,
                              {
                                businessUnitId: buId,
                                loanTypeId: 0,
                                departmentId: 0,
                                designationId: 0,
                                employeeId: 0,
                                fromDate: "",
                                toDate: "",
                                minimumAmount: 0,
                                maximumAmount: 0,
                                applicationStatus: "",
                                installmentStatus: "",
                              },
                              resetForm(initData)
                            );
                            setFieldValue("search", "");
                          }}
                          handleClick={handleClick}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="table-card-body">
                  <div className="table-card-styled tableOne">
                    {rowDto?.length > 0 ? (
                      <>
                        <table className="table">
                          <thead>
                            <tr>
                              <th>
                                <div
                                  className="sortable"
                                  onClick={() => {
                                    setViewOrder(
                                      viewOrder === "desc" ? "asc" : "desc"
                                    );
                                    commonSortByFilter(
                                      viewOrder,
                                      "employeeName"
                                    );
                                  }}
                                >
                                  <span>Employee</span>
                                  <div>
                                    <SortingIcon
                                      viewOrder={viewOrder}
                                    ></SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th>
                                <div
                                  className="sortable"
                                  onClick={() => {
                                    setDesignationOrder(
                                      designationOrder === "desc"
                                        ? "asc"
                                        : "desc"
                                    );
                                    commonSortByFilter(
                                      designationOrder,
                                      "designationName"
                                    );
                                  }}
                                >
                                  <span>Designation</span>
                                  <div>
                                    <SortingIcon
                                      viewOrder={designationOrder}
                                    ></SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Department</span>
                                </div>
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Loan Type</span>
                                </div>
                              </th>
                              <th>
                                <div
                                  className="sortable"
                                  onClick={() => {
                                    setDateOrder(
                                      dateOrder === "desc" ? "asc" : "desc"
                                    );
                                    commonSortByFilter(
                                      dateOrder,
                                      "applicationDate"
                                    );
                                  }}
                                >
                                  <span>Loan Amount & Date</span>
                                  <div>
                                    <SortingIcon
                                      viewOrder={dateOrder}
                                    ></SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th>
                                <div className="sortable text-center">
                                  <span>Installment</span>
                                </div>
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Approval</span>
                                </div>
                              </th>
                              <th>
                                <div className="d-flex align-items-center">
                                  Status
                                  {/* <span>
                                            <Select
                                              sx={{
                                                "& .MuiOutlinedInput-notchedOutline":
                                                  {
                                                    border: "none !important",
                                                  },
                                                "& .MuiSelect-select": {
                                                  paddingRight:
                                                    "22px !important",
                                                  marginTop: "-15px",
                                                },
                                              }}
                                              className="selectBtn"
                                              name="status"
                                              IconComponent={
                                                status && status !== "Active"
                                                  ? ArrowDropUp
                                                  : ArrowDropDown
                                              }
                                              value={values?.status}
                                              onChange={(e) => {
                                                setFieldValue("status", "");
                                                setStatus(
                                                  e.target.value?.label
                                                );
                                                statusTypeFilter(
                                                  e.target.value?.label
                                                );
                                              }}
                                            >
                                              {statusDDL?.length > 0 &&
                                                statusDDL?.map(
                                                  (item, index) => {
                                                    return (
                                                      <MenuItem
                                                        key={index}
                                                        value={item}
                                                      >
                                                        {item?.label}
                                                      </MenuItem>
                                                    );
                                                  }
                                                )}
                                            </Select>
                                          </span> */}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((item, index) => {
                              return (
                                item?.employeeId === employeeId && (
                                  <tr
                                    key={index}
                                    className="hasEvent"
                                    onClick={() => {
                                      getPDFAction(
                                        `/emp/PdfAndExcelReport/LoanReportDetails?LoanApplicationId=${item?.loanApplicationId}`,
                                        setLoading
                                      );
                                    }}
                                  >
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <div className="emp-avatar">
                                          <AvatarComponent
                                            classess=""
                                            letterCount={1}
                                            label={item?.employeeName}
                                          />
                                        </div>
                                        <div className="ml-2">
                                          <span className="tableBody-title">
                                            {item?.employeeName}{" "}
                                            {item?.employeeCode &&
                                              `[${item?.employeeCode}]`}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {item?.designationName}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {item?.departmentName}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        {item?.loanType}
                                        <LightTooltip
                                          title={
                                            <div className="application-tooltip">
                                              <h6>Reason</h6>
                                              <span className="tableBody-title">
                                                {item?.description}
                                              </span>
                                            </div>
                                          }
                                          arrow
                                        >
                                          <InfoOutlined
                                            sx={{ marginLeft: "12px" }}
                                          />
                                        </LightTooltip>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title">
                                        BDT {item?.approveLoanAmount}
                                      </div>
                                      <div className="tableBody-title">
                                        {dateFormatter(item?.applicationDate)}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="tableBody-title text-center">
                                        {item?.approveNumberOfInstallment}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="d-flex align-center">
                                        <div className="mr-1">
                                          {item?.applicationStatus ===
                                            "Approved" && (
                                            <Chips
                                              label="Approved"
                                              classess="success"
                                            />
                                          )}
                                          {item?.applicationStatus ===
                                            "Pending" && (
                                            <Chips
                                              label="Pending"
                                              classess="warning"
                                            />
                                          )}
                                          {item?.applicationStatus ===
                                            "Rejected" && (
                                            <Chips
                                              label="Rejected"
                                              classess="danger"
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="d-flex align-center">
                                        <div className="mr-1">
                                          {item?.installmentStatus ===
                                            "Completed" && (
                                            <Chips
                                              label="Completed"
                                              classess="success"
                                            />
                                          )}
                                          {item?.installmentStatus ===
                                            "Running" && (
                                            <Chips
                                              label="Running"
                                              classess="warning"
                                            />
                                          )}
                                          {item?.installmentStatus ===
                                            "Not Started" && (
                                            <Chips
                                              label="Not Started"
                                              classess="danger"
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              );
                            })}
                          </tbody>
                        </table>
                      </>
                    ) : (
                      <>
                        {!loading && (
                          <NoResult title="No Result Found" para="" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <FilterModal
                propsObj={{
                  id,
                  open,
                  anchorEl,
                  handleClose,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                  masterFilterHandler,
                  setIsFilter,
                  resetForm,
                  initData,
                }}
              ></FilterModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default LoanHistory;
