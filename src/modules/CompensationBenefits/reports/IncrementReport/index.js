/* eslint-disable react-hooks/exhaustive-deps */
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { IconButton, Tooltip } from "@mui/material";
import { paginationSize } from "common/AntTable";
import FormikSelect from "common/FormikSelect";
import NoResult from "common/NoResult";
import ResetButton from "common/ResetButton";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import PeopleDeskTable from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useFormik } from "formik";
import { getDDLForAnnouncement } from "modules/announcement/helper";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { downloadFile, getPDFAction } from "utility/downloadFile";
import { monthDDL } from "utility/monthUtility";
import { customStyles } from "utility/selectCustomStyle";
import { yearDDLAction } from "utility/yearDDL";
import * as Yup from "yup";
import { getIncrementData, incrementDtoCol } from "./helper";

const initialValues = {
  year: "",
  month: "",
  department: "",
  search: "",
};

const validationSchema = Yup.object().shape({
  year: Yup.object().shape({
    label: Yup.string().required("Year is required"),
    value: Yup.number().required("Year is required"),
  }),
});

const IncrementReport = () => {
  // redux
  const dispatch = useDispatch();

  const { buId, wgId, wId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // states
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  // const [buDetails, setBuDetails] = useState({});
  const [departmentDDL, setDepartmentDDL] = useState([]);
console.log("rowDto",rowDto)
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  // const [, getExcelData, apiLoading] = useAxiosGet();

  // const debounce = useDebounce();

  //  menu permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30423) {
      permission = item;
    }
  });

  const getData = (
    values,
    pagination = { current: 1, pageSize: paginationSize },
    srcTxt = "",
    isExcel = false
  ) => {
    getIncrementData(
      values,
      setRowDto,
      setLoading,
      srcTxt,
      pagination?.current,
      pagination?.pageSize,
      isExcel,
      wgId,
      setPages,
      wId
    );
  };

  useEffect(() => {
    getDDLForAnnouncement(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}&intId=0`,
      "DepartmentId",
      "DepartmentName",
      setDepartmentDDL
    );
  }, [buId, wgId, wId]);

  // formik
  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues,
    onSubmit: () => {
      getData(values, { current: 1, pageSize: paginationSize }, "");
      setFieldValue("search", "");
    },
  });

  //set to module
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
  }, [dispatch]);
  const handleChangePage = (_, newPage, searchText, values) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      values,
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      searchText
    );
  };

  const handleChangeRowsPerPage = (event, searchText, values) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      values,
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      searchText
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading && <Loading />}
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading mt-2 pt-1">
            <div className="d-flex align-items-center">
              <h2 className="ml-1">Increment Report</h2>
            </div>
            <div className="table-header-right">
              <ul className="d-flex flex-wrap"></ul>
            </div>
          </div>
          <div className="table-card-body" style={{ marginTop: "12px" }}>
            <div className="card-style" style={{ margin: "14px 0px 12px 0px" }}>
              <div className="row">
                <div className="col-lg-2">
                  <div className="input-field-main">
                    <label>Year</label>
                    <FormikSelect
                      name="year"
                      options={yearDDLAction(5, 10) || []}
                      value={values?.year}
                      onChange={(valueOption) => {
                        setFieldValue("year", valueOption);
                      }}
                      isClearable={false}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="input-field-main">
                    <label>Month</label>
                    <FormikSelect
                      name="month"
                      options={monthDDL || []}
                      value={values?.month}
                      // label="Month"
                      placeholder=" "
                      onChange={(valueOption) => {
                        setFieldValue("month", valueOption);
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Department</label>
                    <FormikSelect
                      name="department"
                      options={
                        departmentDDL?.length > 0 ? departmentDDL?.slice(1) : []
                      }
                      value={values?.department}
                      label=""
                      onChange={(valueOption) => {
                        setFieldValue("department", valueOption);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      isClearable={false}
                      touched={touched}
                      isDisabled={false}
                    />
                  </div>
                </div>
                <div className="col-lg-3 mt-3 pt-2">
                  <button
                    className="btn btn-green btn-green-disable"
                    type="submit"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            {rowDto?.length > 0 ? (
              <div>
                <div className="d-flex justify-content-between">
                  <div></div>

                  <div>
                    <ul className="d-flex flex-wrap">
                      {rowDto?.length > 0 && (
                        <>
                          <li className="pr-2">
                            <Tooltip title="Export CSV" arrow>
                              <IconButton
                                style={{ color: "#101828" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const Year = values?.year?.value
                                    ? "Year=" + values?.year?.value
                                    : "";
                                  const Month = values?.month?.value
                                    ? "&Month=" + values?.month?.value
                                    : "";
                                  const dept = values?.department?.value
                                    ? "&DepartmentId=" +
                                      values?.department?.value
                                    : "";
                                  downloadFile(
                                    `/PdfAndExcelReport/IncrementReportExportAsExcel?${Year}${Month}${dept}`,
                                    "Annual Increment Report",
                                    "xlsx",
                                    setLoading
                                  );
                                }}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </li>
                          <li className="pr-2">
                            <Tooltip title="Print" arrow>
                              <IconButton
                                style={{ color: "#101828" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const Year = values?.year?.value
                                    ? "Year=" + values?.year?.value
                                    : "";
                                  const Month = values?.month?.value
                                    ? "&Month=" + values?.month?.value
                                    : "";
                                  const dept = values?.department?.value
                                    ? "&DepartmentId=" +
                                      values?.department?.value
                                    : "";
                                  getPDFAction(
                                    `/PdfAndExcelReport/IncrementReportExportAsPDF?${Year}${Month}${dept}`,
                                    setLoading
                                  );
                                }}
                              >
                                <LocalPrintshopIcon />
                              </IconButton>
                            </Tooltip>
                          </li>
                        </>
                      )}
                      {values?.search && (
                        <li className="pt-1">
                          <ResetButton
                            classes="btn-filter-reset"
                            title="Reset"
                            icon={<SettingsBackupRestoreOutlined />}
                            onClick={() => {
                              getData(
                                values,
                                { current: 1, pageSize: paginationSize },
                                "",
                                values?.date
                              );
                              setFieldValue("search", "");
                            }}
                          />
                        </li>
                      )}
                     
                    </ul>
                  </div>
                </div>

                <PeopleDeskTable
                  columnData={incrementDtoCol(pages?.current, pages?.pageSize)}
                  pages={pages}
                  rowDto={rowDto}
                  setRowDto={setRowDto}
                  handleChangePage={(e, newPage) =>
                    handleChangePage(e, newPage, values?.search, values)
                  }
                  handleChangeRowsPerPage={(e) =>
                    handleChangeRowsPerPage(e, values?.search, values)
                  }
                  uniqueKey="empID"
                  isCheckBox={false}
                  isScrollAble={false}
                />
              </div>
            ) : (
              !loading && <NoResult />
            )}
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </form>
  );
};

export default IncrementReport;
