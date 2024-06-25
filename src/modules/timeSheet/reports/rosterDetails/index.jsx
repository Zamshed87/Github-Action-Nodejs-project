/* eslint-disable react-hooks/exhaustive-deps */
import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ScrollableTable from "../../../../common/ScrollableTable";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { downloadFile } from "../../../../utility/downloadFile";
import { getRosterDetails } from "../helper";
import ResetButton from "./../../../../common/ResetButton";
import PopOverFilter from "./PopOverFilter";
import "./rosterReport.css";

const initData = {
  search: "",

  // master filter
  monthYear: "",
  workplace: "",
  department: "",
  designation: "",
  employmentType: "",
};

export default function RosterDetails() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, []);

  const [loading, setLoading] = useState(false);

  const date = new Date();
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [isFilter, setIsFilter] = useState({
    monthYear: "",
    workplaceGroup: "",
    departmentList: "",
    designation: "",
    employmentType: "",
  });
  const [departStringList, setDepartmentStringList] = useState(null);

  // row data
  const [rowDto, setRowDto] = useState([]);

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

  const { buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getData = () => {
    getRosterDetails(
      month,
      year,
      buId,
      "0",
      0,
      0,
      0,
      "",
      setRowDto,
      setLoading
    );
  };

  useEffect(() => {
    if (month && year) {
      getData();
    }
    setMonth(date.getMonth() + 1);
    setYear(date.getFullYear());
  }, [month, year]);

  const masterFilterHandler = (values) => {
    const month = Math.abs(values?.monthYear.split("").slice(-2).join(""));
    const year = values?.monthYear.split("").slice(0, 4).join("");

    let depStr = "";
    if (values?.department) {
      values?.department.map((item, idx) =>
        idx === 0
          ? (depStr = item?.value)
          : (depStr = depStr + "," + item?.value)
      );

      setDepartmentStringList(depStr);
    }
    getRosterDetails(
      month,
      year,
      buId,
      depStr || "0",
      values?.designation?.value || 0,
      values?.workplace?.value || 0,
      values?.employmentType?.value || 0,
      "",
      setRowDto,
      setLoading
    );
    setAnchorEl(null);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 95) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          monthYear: `${year}-${month}`,
        }}
        onSubmit={(values, { resetForm }) => {
          resetForm(initData);
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="attendence-report">
                  <div className="table-card">
                    <div className="table-card-heading pb-2 mt-1">
                      <div className="d-flex">
                        <Tooltip title="Export CSV" arrow>
                          <button
                            className="btn-save "
                            type="button"
                            onClick={() => {
                              // values?.monthYear.split("").slice(-2).join("")
                              downloadFile(
                                `/PdfAndExcelReport/RosterDetailsReportExportAsExcel?monthId=${
                                  values?.monthYear
                                    ? Math.abs(
                                        values?.monthYear
                                          .split("")
                                          .slice(-2)
                                          .join("")
                                      )
                                    : month
                                }&yearId=${
                                  values?.monthYear
                                    .split("")
                                    .slice(0, 4)
                                    .join("") || Math.abs(year)
                                }&businessUnitId=${buId}&departmentList=${
                                  departStringList || "0"
                                }&designationId=${
                                  values?.designation?.value || 0
                                }&workplaceGroupId=${
                                  values?.workplace?.value || 0
                                }&employmentTypeId=${
                                  values?.employmentType?.value || 0
                                }&srcText=${values?.search || ""}`,
                                "Roster Details",
                                "xlsx",
                                setLoading
                              );
                            }}
                            style={{
                              border: "transparent",
                              width: "30px",
                              height: "30px",
                              background: "#f2f2f7",
                              borderRadius: "100px",
                            }}
                          >
                            <SaveAlt
                              sx={{ color: "#637381", fontSize: "16px" }}
                            />
                          </button>
                        </Tooltip>
                        {/* <Tooltip title="Print" arrow>
                              <button
                                className="btn-save ml-3"
                                style={{
                                  border: "transparent",
                                  width: "40px",
                                  height: "40px",
                                  background: "#f2f2f7",
                                  borderRadius: "100px",
                                }}
                                onClick={() => {
                                  getPDFAction(
                                    `/emp/PdfAndExcelReport/RosterReport?AccountId=${orgId}&BusinessUnitId=${buId}&WorkPalceGroupId=${values?.workplace?.value || 0}&WorkPlaceId=0&CalendarId=0&CalendarTypeId=0&UserDate=`,
                                    setLoading
                                  );
                                }}
                              >
                                <Print sx={{ color: "#637381" }} />
                              </button>
                            </Tooltip> */}
                      </div>
                      <div className="table-card-head-right">
                        <ul>
                          {(values?.search ||
                            values?.workplace ||
                            values?.department ||
                            values?.designation ||
                            values?.employmentType ||
                            isFilter?.monthYear ||
                            isFilter?.workplaceGroup ||
                            isFilter?.departmentList ||
                            isFilter?.designation ||
                            isFilter?.employmentType) && (
                            <li>
                              <ResetButton
                                title="reset"
                                icon={
                                  <SettingsBackupRestoreOutlined
                                    sx={{ marginRight: "10px" }}
                                  />
                                }
                                onClick={() => {
                                  getData();
                                  setIsFilter({
                                    monthYear: "",
                                    workplaceGroup: "",
                                    departmentList: "",
                                    designation: "",
                                    employmentType: "",
                                  });
                                  setFieldValue("workplace", "");
                                  setFieldValue("department", "");
                                  setFieldValue("designation", "");
                                  setFieldValue("employmentType", "");
                                  setFieldValue("search", "");
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
                                getRosterDetails(
                                  month,
                                  year,
                                  buId,
                                  departStringList || "0",
                                  0,
                                  0,
                                  0,
                                  value,
                                  setRowDto,
                                  setLoading
                                );
                                setFieldValue("search", value);
                              }}
                              cancelHandler={() => {
                                setFieldValue("search", "");
                                getData();
                              }}
                              handleClick={handleClick}
                            />
                            {/* <FilterButton
                                  title="filter"
                                  onClick={(e) => {
                                    handleClick(e);
                                  }}
                                /> */}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-card-body">
                      {rowDto?.tableRow?.length > 0 ? (
                        <ScrollableTable>
                          <thead>
                            <tr>
                              {rowDto?.headingNames?.map((item, index) =>
                                index === 0 ? (
                                  <th key={index}>{item}</th>
                                ) : (
                                  <th key={index}>{item}</th>
                                )
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto.tableRow?.length > 0 &&
                              rowDto.tableRow?.map((item, index) => (
                                <tr key={index}>
                                  {item?.tableData?.map((item, idx) =>
                                    idx === 0 ? (
                                      <td key={index} className="text-left">
                                        {item}
                                      </td>
                                    ) : (
                                      <td key={index}>{item}</td>
                                    )
                                  )}
                                </tr>
                              ))}
                          </tbody>
                        </ScrollableTable>
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
              ) : (
                <NotPermittedPage />
              )}

              {/* filter */}
              <PopOverFilter
                propsObj={{
                  id,
                  open,
                  anchorEl,
                  setAnchorEl,
                  handleClose,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                }}
                masterFilterHandler={masterFilterHandler}
                setIsFilter={setIsFilter}
                isFilter={isFilter}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
