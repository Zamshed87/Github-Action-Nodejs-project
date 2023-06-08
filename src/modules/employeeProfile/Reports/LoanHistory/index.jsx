import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import AntTable, { paginationSize } from "../../../../common/AntTable";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { getDateOfYear } from "../../../../utility/dateFormatter";
import { getPDFAction } from "../../../../utility/downloadFile";
import FilterModal from "./components/FilterModal";
import { getLoanApplicationByAdvanceFilter, loanReportColumns } from "./helper";
import "./loanHistory.css";

const initData = {
  status: "",
  search: "",
  loanType: "",
  department: "",
  designation: "",
  employee: "",
  fromDate: getDateOfYear("first"),
  toDate: getDateOfYear("last"),
  minimumAmount: "",
  maximumAmount: "",
  applicationStatus: "",
  installmentStatus: "",
};

const validationSchema = Yup.object().shape({
  minimumAmount: Yup.number().min(0, "Amount must be greater than zero"),
  maximumAmount: Yup.number().min(0, "Amount must be greater than zero"),
});

const EmLoanHistory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [loading, setLoading] = useState(false);

  // row data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);

  // master filter
  const [anchorEl, setAnchorEl] = useState(null);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { buId, employeeId, orgId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const getData = (
    fromDate,
    toDate,
    searchTxt = "",
    pagination = { current: 1, pageSize: paginationSize }
  ) => {
    getLoanApplicationByAdvanceFilter(
      pages,
      setPages,
      setAllData,
      setRowDto,
      setLoading,
      {
        accountId: orgId,
        businessUnitId: buId,
        loanTypeId: 0,
        departmentId: 0,
        designationId: 0,
        employeeId: 0,
        fromDate: fromDate || getDateOfYear("first"),
        toDate: toDate || getDateOfYear("last"),
        minimumAmount: 0,
        maximumAmount: 0,
        applicationStatus: "",
        installmentStatus: "",
        pageSize: pagination.pageSize,
        pageNo: pagination.current,
        ispaginated: true,
        searchText: searchTxt || "",
        workplaceGroupId: wgId,
      }
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, buId, wgId]);

  const saveHandler = (values) => {};

  // ascending & descending
  // const commonSortByFilter = (filterType, property) => {
  //   const newRowData = [...allData];
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

  // masterHandler
  const masterFilterHandler = (values) => {
    getLoanApplicationByAdvanceFilter(setAllData, setRowDto, setLoading, {
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
    });
    setAnchorEl(null);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 99) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
              {permission?.isView ? (
                <div className="loan-application">
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div>
                        {rowDto?.length > 0 && (
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
                                  `/PdfAndExcelReport/LoanReportAll?accountId=${orgId}&BusinessUnitId=${buId}&DepartmentId=${
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
                        )}
                      </div>
                      <div className="table-card-head-right">
                        <ul>
                          {(values?.search ||
                            // status ||
                            values?.loanType ||
                            values?.department ||
                            values?.designation ||
                            values?.employee ||
                            // values?.fromDate ||
                            // values?.toDate ||
                            values?.minimumAmount ||
                            values?.maximumAmount ||
                            values?.applicationStatus ||
                            values?.installmentStatus ||
                            values?.search) && (
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
                                  setRowDto(allData);
                                  setFieldValue("loanType", "");
                                  setFieldValue("department", "");
                                  setFieldValue("designation", "");
                                  setFieldValue("employee", "");
                                  setFieldValue("fromDate", "");
                                  setFieldValue("toDate", "");
                                  setFieldValue("minimumAmount", "");
                                  setFieldValue("maximumAmount", "");
                                  setFieldValue("applicationStatus", "");
                                  setFieldValue("installmentStatus", "");
                                  setFieldValue("search", "");
                                  // setStatus("");
                                }}
                              />
                            </li>
                          )}
                          <li>
                            <MasterFilter
                              isHiddenFilter
                              width="200px"
                              inputWidth="200px"
                              value={values?.search}
                              setValue={(value) => {
                                getData(
                                  values?.fromDate,
                                  values?.toDate,
                                  values?.search,
                                  pages
                                );
                                setFieldValue("search", value);
                              }}
                              cancelHandler={() => {
                                getData();
                                setFieldValue("search", "");
                              }}
                              handleClick={handleClick}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-card-body">
                      <div className="card-style my-2">
                        <div className="row">
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>From Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.fromDate}
                                placeholder=""
                                name="fromDate"
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("fromDate", e.target.value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>To Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.toDate}
                                placeholder="Month"
                                name="toDate"
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("toDate", e.target.value);
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-lg-1">
                            <button
                              disabled={!values?.toDate || !values?.fromDate}
                              style={{ marginTop: "21px" }}
                              className="btn btn-green"
                              onClick={() => {
                                getData(
                                  values?.fromDate,
                                  values?.toDate,
                                  values?.search,
                                  pages
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
                          <>
                            <AntTable
                              data={rowDto?.length > 0 && rowDto}
                              columnsData={loanReportColumns(pages)}
                              onRowClick={(dataRow) => {
                                getPDFAction(
                                  `/PdfAndExcelReport/LoanReportDetails?LoanApplicationId=${dataRow?.loanApplicationId}`,
                                  setLoading
                                );
                              }}
                            />
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
                    }}
                  ></FilterModal>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default EmLoanHistory;
