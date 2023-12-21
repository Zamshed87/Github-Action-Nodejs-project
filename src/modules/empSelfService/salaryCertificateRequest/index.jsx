/* eslint-disable react-hooks/exhaustive-deps */
import styled from "@emotion/styled";
import {
  AddOutlined,
  EditOutlined,
  InfoOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip, tooltipClasses } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AntTable from "../../../common/AntTable";
import AvatarComponent from "../../../common/AvatarComponent";
import Chips from "../../../common/Chips";
import FormikInput from "../../../common/FormikInput";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray900 } from "../../../utility/customColor";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import { getMonthName } from "../../../utility/monthUtility";

const initData = {
  searchMonthYear: "",
  status: "",
};

// status DDL
// const statusDDL = [
//   { value: "Pending", label: "Pending" },
//   { value: "Approved", label: "Approved" },
//   { value: "Rejected", label: "Rejected" },
// ];

const SelfSalaryCertificateRequest = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [, getSalaryCertificates, loading] = useAxiosGet([]);

  const [isFilter, setIsFilter] = useState(false);
  const [status, setStatus] = useState("");
  const [rowDto, setRowDto] = useState([]);
  // const [yearOrder, setYearOrder] = useState("desc");

  // ascending & descending
  // const commonSortByFilter = (filterType, property) => {
  //   const newRowData = [...rowDto];
  //   let modifyRowData = [];

  //   if (filterType === "asc") {
  //     modifyRowData = newRowData?.sort((a, b) => {
  //       if (a[property] > b[property]) return -1;
  //       return 1;
  //     });
  //   } else {
  //     modifyRowData = newRowData?.sort((a, b) => {
  //       if (b[property] > a[property]) return -1;
  //       return 1;
  //     });
  //   }
  //   setRowDto(modifyRowData);
  // };

  // const statusTypeFilter = (statusType) => {
  //   const newRowData = [...rowDto];
  //   let modifyRowData = [];
  //   if (statusType === "Approved") {
  //     modifyRowData = newRowData?.filter((item) => item?.Status === "Approved");
  //   } else if (statusType === "Pending") {
  //     modifyRowData = newRowData?.filter((item) => item?.Status === "Pending");
  //   } else if (statusType === "Rejected") {
  //     modifyRowData = newRowData?.filter((item) => item?.Status === "Rejected");
  //   }
  //   setRowDto(modifyRowData);
  // };

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

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Salary Certificate Requsition";
  }, []);

  const getData = (yearId = 0, monthId = 0) => {
    getSalaryCertificates(
      `/Employee/SalaryCertificateApplication?strPartName=SalaryCertificate&intAccountId=${orgId}&intEmployeeId=${employeeId}&MonthId=${monthId}&YearId=${yearId}`,
      (data) => {
        setRowDto([...data]);
      }
    );
  };

  useEffect(() => {
    getData();
  }, [orgId, buId]);

  const empSalaryReportCol = (history) => {
    return [
      {
        title: "SL",
        render: (text, record, index) => index + 1,
        className: "text-center",
        width: 20,
      },
      {
        title: "Code",
        dataIndex: "employeeCode",
        sorter: true,
        filter: true,
      },
      {
        title: "Employee Name",
        dataIndex: "EmployeeName",
        sorter: true,
        filter: true,
        render: (_, item) => {
          return (
            <div className="d-flex align-items-center">
              <div className="emp-avatar">
                <AvatarComponent
                  classess=""
                  letterCount={1}
                  label={item?.EmployeeName}
                />
              </div>
              <div className="ml-2">
                <span>{item?.EmployeeName}</span>
              </div>
            </div>
          );
        },
      },
      {
        title: "Designation",
        dataIndex: "strDesignation",
        sorter: true,
        filter: true,
        render: (_, item) => (
          <div>{`${item?.strDesignation}, ${item?.strEmploymentType}`}</div>
        ),
      },
      {
        title: "Department",
        dataIndex: "strDepartment",
        sorter: true,
        filter: true,
      },
      {
        title: "Month-Year",
        dataIndex: "intPayRollMonth",
        render: (_, item) => (
          <span>
            {" "}
            {`${getMonthName(item?.intPayRollMonth)}, ${item?.intPayRollYear}`}
          </span>
        ),
      },
      {
        title: "Status",
        dataIndex: "Status",
        width: 100,
        filter: true,
        render: (_, item) => {
          return (
            <div>
              {item?.Status === "Approved" && (
                <Chips label="Approved" classess="success p-2" />
              )}
              {item?.Status === "Pending" && (
                <Chips label="Pending" classess="warning p-2" />
              )}
              {item?.Status === "Process" && (
                <Chips label="Process" classess="primary p-2" />
              )}
              {item?.Status === "Rejected" && (
                <>
                  <Chips label="Rejected" classess="danger p-2 mr-2" />
                  {item?.RejectedBy && (
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
                              Rejected by {item?.RejectedBy}
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
                  )}
                </>
              )}
            </div>
          );
        },
      },
      {
        title: "",
        dataIndex: "action",
        render: (_, item) => {
          return (
            <div className="d-flex">
              {item?.Status === "Pending" && (
                <Tooltip title="Edit" arrow>
                  <button className="iconButton" type="button">
                    <EditOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                        history.push(
                          `/SelfService/salaryCertificate/salaryCertificateRequsition/edit/${item?.intSalaryCertificateRequestId}`
                        );
                      }}
                    />
                  </button>
                </Tooltip>
              )}
            </div>
          );
        },
      },
    ];
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, errors, touched, setValues }) => (
          <>
            <Form>
              {loading && <Loading />}
              <>
                <div className="table-card">
                  <div className="table-card-heading">
                    <div className="d-flex align-items-center"></div>
                    <ul className="d-flex flex-wrap">
                      {(isFilter || status) && (
                        <li>
                          <ResetButton
                            classes="btn-filter-reset"
                            title="reset"
                            icon={
                              <SettingsBackupRestoreOutlined
                                sx={{ marginRight: "10px", fontSize: "16px" }}
                              />
                            }
                            styles={{
                              marginRight: "16px",
                            }}
                            onClick={() => {
                              setIsFilter(false);
                              setFieldValue("searchMonthYear", "");
                              setStatus("");
                              getData();
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <div
                          style={{
                            marginRight: "10px",
                          }}
                        >
                          <FormikInput
                            placeholder=" "
                            classes="input-sm"
                            name="searchMonthYear"
                            value={values?.searchMonthYear}
                            type="month"
                            onChange={(e) => {
                              let yearId = +e.target.value
                                .split("")
                                .slice(0, 4)
                                .join("");
                              let monthId = +e.target.value
                                .split("")
                                .slice(-2)
                                .join("");
                              setFieldValue("searchMonthYear", e.target.value);
                              getData(yearId, monthId);
                              if (e.target.value) {
                                setIsFilter(true);
                              } else {
                                setIsFilter(false);
                              }
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </li>
                      <li>
                        <PrimaryButton
                          type="button"
                          className="btn btn-default flex-center"
                          label="Request New"
                          icon={
                            <AddOutlined
                              sx={{
                                marginRight: "0px",
                                fontSize: "15px",
                              }}
                            />
                          }
                          onClick={() => {
                            history.push(
                              `/SelfService/salaryCertificate/salaryCertificateRequsition/create`
                            );
                          }}
                        />
                      </li>
                    </ul>
                  </div>

                  {/* Table view start */}
                  <div className="table-card-body">
                    {rowDto?.length > 0 ? (
                      <>
                        {/*  <table className="table">
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>SL</th>
                              <th style={{ minWidth: "40px" }}>Code</th>

                              <th>
                                <div className="d-flex align-items-center pointer">
                                  Employee Name
                                </div>
                              </th>

                              <th>
                                <div className="d-flex align-items-center">
                                  Designation
                                </div>
                              </th>

                              <th style={{ width: "150px" }}>
                                <div className="d-flex align-items-center pointer">
                                  Department
                                </div>
                              </th>

                              <th style={{ width: "150px" }}>
                                <div
                                  className="d-flex align-items-center pointer"
                                  onClick={() => {
                                    setYearOrder(
                                      yearOrder === "desc" ? "asc" : "desc"
                                    );
                                    commonSortByFilter(
                                      yearOrder,
                                      "intPayRollYear"
                                    );
                                  }}
                                >
                                  Month-Year
                                  <div>
                                    <SortingIcon
                                      viewOrder={yearOrder}
                                    ></SortingIcon>
                                  </div>
                                </div>
                              </th>

                              <th style={{ width: "150px" }}>
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
                                        setStatus(e.target.value?.label);
                                        statusTypeFilter(e.target.value?.label);
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
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((item, index) => {
                              return (
                                <>
                                  <tr
                                    key={index}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (item?.Status === "Approved") {
                                        history.push(
                                          `/SelfService/salaryCertificate/salaryCertificateRequsition/view/${item?.intSalaryCertificateRequestId}`
                                        );
                                      }
                                    }}
                                    style={{
                                      cursor:
                                        item?.Status === "Approved"
                                          ? "pointer"
                                          : "default",
                                    }}
                                  >
                                    <td>
                                      <p className="tableBody-title pl-1">
                                        {index + 1}
                                      </p>
                                    </td>

                                    <td>
                                      <p className="tableBody-title pl-1">
                                        {item?.employeeCode}
                                      </p>
                                    </td>

                                    <td>
                                      <div className="d-flex align-items-center">
                                        <div className="emp-avatar">
                                          <AvatarComponent
                                            classess=""
                                            letterCount={1}
                                            label={item?.EmployeeName}
                                          />
                                        </div>
                                        <div className="ml-2">
                                          <span className="tableBody-title">
                                            {item?.EmployeeName}
                                          </span>
                                        </div>
                                      </div>
                                    </td>

                                    <td>
                                      <div className="content tableBody-title text-left">
                                        {`${item?.strDesignation}, ${item?.strEmploymentType}`}
                                      </div>
                                    </td>

                                    <td>
                                      <div className="content tableBody-title">
                                        {item?.strDepartment}
                                      </div>
                                    </td>

                                    <td>
                                      <div className="content tableBody-title">
                                        {`${getMonthName(
                                          item?.intPayRollMonth
                                        )}, ${item?.intPayRollYear}`}
                                      </div>
                                    </td>

                                    <td>
                                      {item?.Status === "Approved" && (
                                        <Chips
                                          label="Approved"
                                          classess="success p-2"
                                        />
                                      )}
                                      {item?.Status === "Pending" && (
                                        <Chips
                                          label="Pending"
                                          classess="warning p-2"
                                        />
                                      )}
                                      {item?.Status === "Process" && (
                                        <Chips
                                          label="Process"
                                          classess="primary p-2"
                                        />
                                      )}
                                      {item?.Status === "Rejected" && (
                                        <>
                                          <Chips
                                            label="Rejected"
                                            classess="danger p-2 mr-2"
                                          />
                                          {item?.RejectedBy && (
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
                                                      Rejected by{" "}
                                                      {item?.RejectedBy}
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
                                          )}
                                        </>
                                      )}
                                    </td>

                                    <td width="60px">
                                      <div className="d-flex">
                                        {item?.Status === "Pending" && (
                                          <Tooltip title="Edit" arrow>
                                            <button
                                              className="iconButton"
                                              type="button"
                                            >
                                              <EditOutlined
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  history.push(
                                                    `/SelfService/salaryCertificate/salaryCertificateRequsition/edit/${item?.intSalaryCertificateRequestId}`
                                                  );
                                                }}
                                              />
                                            </button>
                                          </Tooltip>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              );
                            })}
                          </tbody>
                        </table> */}
                        <div className="table-card-styled tableOne employee-table-card tableOne  table-responsive">
                          <AntTable
                            data={rowDto}
                            columnsData={empSalaryReportCol(history)}
                            removePagination
                            onRowClick={(item) => {
                              if (item?.Status === "Approved") {
                                history.push(
                                  `/SelfService/salaryCertificate/salaryCertificateRequsition/view/${item?.intSalaryCertificateRequestId}`
                                );
                              }
                            }}
                          />
                        </div>
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
                {/* Table view ends */}
              </>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default SelfSalaryCertificateRequest;
