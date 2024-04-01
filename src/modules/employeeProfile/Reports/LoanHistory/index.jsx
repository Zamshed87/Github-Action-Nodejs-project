import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
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
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import DefaultInput from "./../../../../common/DefaultInput";
import { getPeopleDeskAllDDL, getWorkplaceDetails } from "common/api";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";

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
  workplaceGroup: "",
  workplace: "",
};

const validationSchema = Yup.object().shape({
  minimumAmount: Yup.number().min(0, "Amount must be greater than zero"),
  maximumAmount: Yup.number().min(0, "Amount must be greater than zero"),
});

const EmLoanHistory = () => {
  // hook
  const dispatch = useDispatch();

  // redux
  const { buId, wgId, wId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 99) {
      permission = item;
    }
  });

  // status
  const [loading, setLoading] = useState(false);

  // modal
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // landing data
  const [rowDto, setRowDto] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const getData = (
    values,
    searchTxt = "",
    pagination = { current: 1, pageSize: paginationSize }
  ) => {
    getLoanApplicationByAdvanceFilter(setPages, setRowDto, setLoading, {
      businessUnitId: buId,
      loanTypeId: 0,
      departmentId: 0,
      designationId: 0,
      employeeId: 0,
      fromDate: values?.fromDate || "",
      toDate: values?.toDate || "",
      minimumAmount: 0,
      maximumAmount: 0,
      applicationStatus: "",
      installmentStatus: "",
      pageSize: pagination.pageSize,
      pageNo: pagination.current,
      ispaginated: true,
      searchText: searchTxt || "",
      workplaceGroupId: values?.workplaceGroup?.value || wgId,
      workplaceId: values?.workplace?.value || wId,
    });
  };
  const handleChangePage = (_, newPage, searchText = "", values) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(values, searchText, {
      current: newPage,
      pageSize: pages?.pageSize,
      total: pages?.total,
    });
  };

  const handleChangeRowsPerPage = (event, searchText = "", values) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(values, searchText, {
      current: 1,
      pageSize: +event.target.value,
      total: pages?.total,
    });
  };

  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {},
  });

  // initial
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Loan History";
  }, []);

  useEffect(() => {
    getLoanApplicationByAdvanceFilter(setPages, setRowDto, setLoading, {
      businessUnitId: buId,
      loanTypeId: 0,
      departmentId: 0,
      designationId: 0,
      employeeId: 0,
      fromDate: getDateOfYear("first"),
      toDate: getDateOfYear("last"),
      minimumAmount: 0,
      maximumAmount: 0,
      applicationStatus: "",
      installmentStatus: "",
      pageSize: paginationSize,
      pageNo: 1,
      ispaginated: true,
      searchText: "",
      workplaceGroupId: wgId,
      workplaceId: wId,
    });
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
  }, [buId, wgId, wId]);

  return (
    <>
      <form onSubmit={handleSubmit}>
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
                            `/PdfAndExcelReport/LoanReportAll?&BusinessUnitId=${buId}&WorkplaceGroupId=${
                              values?.workplaceGroup?.value || wgId
                            }&DepartmentId=${
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
                      values?.loanType ||
                      values?.department ||
                      values?.designation ||
                      values?.employee ||
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
                            getLoanApplicationByAdvanceFilter(
                              setPages,
                              setRowDto,
                              setLoading,
                              {
                                businessUnitId: buId,
                                loanTypeId: 0,
                                departmentId: 0,
                                designationId: 0,
                                employeeId: 0,
                                fromDate: values?.fromDate || "",
                                toDate: values?.toDate || "",
                                minimumAmount: 0,
                                maximumAmount: 0,
                                applicationStatus: "",
                                installmentStatus: "",
                                pageSize: paginationSize,
                                pageNo: 1,
                                ispaginated: true,
                                searchText: "",
                                workplaceGroupId:
                                  values?.workplaceGroup?.value || wgId,
                                workplaceId: values?.workplace?.value || wId,
                              }
                            );
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
                          getLoanApplicationByAdvanceFilter(
                            setPages,
                            setRowDto,
                            setLoading,
                            {
                              businessUnitId: buId,
                              loanTypeId: 0,
                              departmentId: 0,
                              designationId: 0,
                              employeeId: 0,
                              fromDate: values?.fromDate || "",
                              toDate: values?.toDate || "",
                              minimumAmount: 0,
                              maximumAmount: 0,
                              applicationStatus: "",
                              installmentStatus: "",
                              pageSize: paginationSize,
                              pageNo: 1,
                              ispaginated: true,
                              searchText: values || "",
                              workplaceGroupId:
                                values?.workplaceGroup?.value || wgId,
                              workplaceId: values?.workplace?.value || wId,
                            }
                          );
                          setFieldValue("search", value);
                        }}
                        cancelHandler={() => {
                          getLoanApplicationByAdvanceFilter(
                            setPages,
                            setRowDto,
                            setLoading,
                            {
                              businessUnitId: buId,
                              loanTypeId: 0,
                              departmentId: 0,
                              designationId: 0,
                              employeeId: 0,
                              fromDate: values?.fromDate || "",
                              toDate: values?.toDate || "",
                              minimumAmount: 0,
                              maximumAmount: 0,
                              applicationStatus: "",
                              installmentStatus: "",
                              pageSize: paginationSize,
                              pageNo: 1,
                              ispaginated: true,
                              searchText: "",
                              workplaceGroupId:
                                values?.workplaceGroup?.value || wgId,
                              workplaceId: values?.workplace?.value || wId,
                            }
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
                <div className="card-style my-2">
                  <div className="row">
                    <div className="col-lg-2">
                      <div className="input-field-main">
                        <label>From Date</label>
                        <DefaultInput
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
                    <div className="col-lg-2">
                      <div className="input-field-main">
                        <label>To Date</label>
                        <DefaultInput
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
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Workplace Group</label>
                        <FormikSelect
                          name="workplaceGroup"
                          options={[...workplaceGroupDDL] || []}
                          value={values?.workplaceGroup}
                          onChange={(valueOption) => {
                            setWorkplaceDDL([]);
                            setFieldValue("workplaceGroup", valueOption);
                            setFieldValue("workplace", "");
                            if (valueOption?.value) {
                              getPeopleDeskAllDDL(
                                `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
                                "intWorkplaceId",
                                "strWorkplace",
                                setWorkplaceDDL
                              );
                            }
                          }}
                          placeholder=""
                          styles={customStyles}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Workplace</label>
                        <FormikSelect
                          name="workplace"
                          options={[...workplaceDDL] || []}
                          value={values?.workplace}
                          onChange={(valueOption) => {
                            setFieldValue("workplace", valueOption);
                            // getWorkplaceDetails(
                            //   valueOption?.value,
                            //   setBuDetails
                            // );
                          }}
                          placeholder=""
                          styles={customStyles}
                        />
                      </div>
                    </div>
                    <div className="col-lg-1">
                      <button
                        disabled={!values?.toDate || !values?.fromDate}
                        style={{ marginTop: "21px" }}
                        className="btn btn-green"
                        onClick={() => {
                          getLoanApplicationByAdvanceFilter(
                            setPages,
                            setRowDto,
                            setLoading,
                            {
                              businessUnitId: buId,
                              loanTypeId: 0,
                              departmentId: 0,
                              designationId: 0,
                              employeeId: 0,
                              fromDate: values?.fromDate || "",
                              toDate: values?.toDate || "",
                              minimumAmount: 0,
                              maximumAmount: 0,
                              applicationStatus: "",
                              installmentStatus: "",
                              pageSize: paginationSize,
                              pageNo: 1,
                              ispaginated: true,
                              searchText: "",
                              workplaceGroupId:
                                values?.workplaceGroup?.value || wgId,
                              workplaceId: values?.workplace?.value || wId,
                            }
                          );
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>

                {rowDto?.length > 0 ? (
                  <PeopleDeskTable
                    customClass="iouManagementTable"
                    columnData={loanReportColumns(
                      pages?.current,
                      pages?.pageSize
                    )}
                    pages={pages}
                    rowDto={rowDto}
                    setRowDto={setRowDto}
                    handleChangePage={(e, newPage) =>
                      handleChangePage(e, newPage, values?.search, values)
                    }
                    handleChangeRowsPerPage={(e) =>
                      handleChangeRowsPerPage(e, values?.search, values)
                    }
                    onRowClick={(dataRow) => {
                      getPDFAction(
                        `/PdfAndExcelReport/LoanReportDetails?LoanApplicationId=${
                          dataRow?.loanApplicationId
                        }&BusinessUintId=${buId}&WorkplaceGroupId=${
                          values?.workplaceGroup?.value || wgId
                        }&EmployeeId=${dataRow?.employeeId}`,
                        setLoading
                      );
                    }}
                    uniqueKey="employeeCode"
                    isCheckBox={false}
                    isScrollAble={true}
                  />
                ) : (
                  <>
                    <NoResult />
                  </>
                )}
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
                // masterFilterHandler,
              }}
            ></FilterModal>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
};

export default EmLoanHistory;
