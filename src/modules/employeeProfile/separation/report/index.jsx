import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { paginationSize } from "../../../../common/AntTable";
import FormikInput from "../../../../common/FormikInput";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PeopleDeskTable from "../../../../common/peopleDeskTable";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray600 } from "../../../../utility/customColor";
import { getDateOfYear } from "../../../../utility/dateFormatter";
import { getPDFAction } from "../../../../utility/downloadFile";
import { getBuDetails, getEmployeeSeparationLanding } from "../helper";
import FilterModal from "./component/FilterModal";
import { generateExcelAction } from "./excel/excelConvert";
import { empSeparationCol } from "./helper";
import { getPeopleDeskAllDDL, getWorkplaceDetails } from "common/api";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";

const initData = {
  search: "",
  separationType: "",
  department: "",
  employee: "",
  movementFromDate: "",
  movementToDate: "",
  workplaceGroup: "",
  workplace: "",
  designation: "",
  appStatus: "",
  filterFromDate: getDateOfYear("first"),
  filterToDate: getDateOfYear("last"),
};

const SeparationReport = () => {
  // hook
  const dispatch = useDispatch();

  // redux
  const {
    profileData: { buId, wgId, wId, employeeId },
    decodedTokenData: { workplaceGroupList= "", workplaceList="" },
  } = useSelector((state) => state?.auth, shallowEqual);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 96) {
      permission = item;
    }
  });

  // state
  const [loading, setLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [buDetails, setBuDetails] = useState({});
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
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
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const getData = (values, pagination, searchText) => {
    getEmployeeSeparationLanding(
      values?.workplace?.value || wId,
      buId,
      values?.workplaceGroup?.value || wgId,
      getDateOfYear("first"),
      getDateOfYear("last"),
      searchText,
      false,
      setRowDto,
      setLoading,
      pagination?.current,
      pagination?.pageSize,
      setPages,
      workplaceGroupList || "",
      workplaceList || ""
    );
  };

  const handleChangePage = (_, newPage, searchText = "", values) => {
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

  const handleChangeRowsPerPage = (event, searchText = "", values) => {
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

  // initial

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Separation Report";
  }, []);

  useEffect(() => {
    getEmployeeSeparationLanding(
      wId,
      buId,
      wgId,
      getDateOfYear("first"),
      getDateOfYear("last"),
      "",
      false,
      setRowDto,
      setLoading,
      1,
      paginationSize,
      setPages,
      workplaceGroupList || "",
      workplaceList || ""
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
  }, [buId, wgId, wId]);

  useEffect(() => {
    getWorkplaceDetails(wId, setBuDetails);
  }, [wId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
              <div className="separation-approval-wrapper">
                {permission?.isView ? (
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div className="d-flex">
                        <Tooltip title="Export CSV" arrow>
                          <div
                            type="button"
                            className="btn-save "
                            onClick={(e) => {
                              e.stopPropagation();
                              generateExcelAction(
                                buDetails?.strWorkplace,
                                "",
                                "",
                                buDetails?.strWorkplace,
                                rowDto,
                                buDetails?.strAddress
                              );
                            }}
                            style={{ cursor: "pointer" }}
                            disabled={rowDto?.data?.length <= 0}
                          >
                            <SaveAlt
                              sx={{ color: gray600, fontSize: "16px" }}
                            />
                          </div>
                        </Tooltip>
                      </div>
                      <div className="table-card-head-right">
                        <ul className="d-flex flex-wrap">
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
                                  setIsFilter(false);
                                  getEmployeeSeparationLanding(
                                    values?.workplace?.value || wId,
                                    buId,
                                    values?.workplaceGroup?.value || wgId,

                                    getDateOfYear("first"),
                                    getDateOfYear("last"),
                                    "",
                                    false,
                                    setRowDto,
                                    setLoading,
                                    1,
                                    paginationSize,
                                    setPages,
                                    workplaceGroupList || "",
                                    workplaceList || ""
                                  );
                                }}
                              />
                            </li>
                          )}
                          <li>
                            <MasterFilter
                              width="200px"
                              inputWidth="200px"
                              value={values?.search}
                              isHiddenFilter
                              styles={{ marginRight: "0px !important" }}
                              setValue={(value) => {
                                setFieldValue("search", value);
                                getEmployeeSeparationLanding(
                                  values?.workplace?.value || wId,
                                  buId,
                                  values?.workplaceGroup?.value || wgId,

                                  values?.filterFromDate,
                                  values?.filterToDate,
                                  value || "",
                                  false,
                                  setRowDto,
                                  setLoading,
                                  1,
                                  paginationSize,
                                  setPages,
                                  workplaceGroupList || "",
                                  workplaceList || ""
                                );
                              }}
                              cancelHandler={() => {
                                setFieldValue("search", "");
                                getEmployeeSeparationLanding(
                                  values?.workplace?.value || wId,
                                  buId,
                                  values?.workplaceGroup?.value || wgId,

                                  values?.filterFromDate,
                                  values?.filterToDate,
                                  "",
                                  false,
                                  setRowDto,
                                  setLoading,
                                  1,
                                  paginationSize,
                                  setPages,
                                  workplaceGroupList || "",
                                  workplaceList || ""
                                );
                              }}
                              handleClick={handleClick}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-card-body">
                      {/* <CardTable
                        propsObj={{
                          setFieldValue,
                          values,
                          setLoading,
                          rowDto,
                          setRowDto,
                        }}
                      /> */}
                      <div className="card-style my-2">
                        <div className="row">
                          <div className="col-lg-2">
                            <div className="input-field-main">
                              <label>From Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.filterFromDate}
                                placeholder=""
                                name="filterFromDate"
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue(
                                    "filterFromDate",
                                    e.target.value
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-lg-2">
                            <div className="input-field-main">
                              <label>To Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.filterToDate}
                                placeholder="Month"
                                name="filterToDate"
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("filterToDate", e.target.value);
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
                                  getWorkplaceDetails(
                                    valueOption?.value,
                                    setBuDetails
                                  );
                                }}
                                placeholder=""
                                styles={customStyles}
                              />
                            </div>
                          </div>
                          <div className="col-lg-1">
                            <button
                              disabled={
                                !values?.filterToDate || !values?.filterFromDate
                              }
                              style={{ marginTop: "21px" }}
                              className="btn btn-green"
                              onClick={() => {
                                getEmployeeSeparationLanding(
                                  values?.workplace?.value || wId,
                                  buId,
                                  values?.workplaceGroup?.value || wgId,

                                  values?.filterFromDate,
                                  values?.filterToDate,
                                  values?.search,
                                  false,
                                  setRowDto,
                                  setLoading,
                                  1,
                                  paginationSize,
                                  setPages,
                                  workplaceGroupList || "",
                                  workplaceList || ""
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
                          columnData={empSeparationCol(
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
                          onRowClick={(data) => {
                            getPDFAction(
                              `/PdfAndExcelReport/SeparationReportByEmployee?EmployeeId=${data?.intEmployeeId}`,
                              setLoading
                            );
                          }}
                          uniqueKey="strEmployeeCode"
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
                ) : (
                  <NotPermittedPage />
                )}
              </div>
              <FilterModal
                propsObj={{
                  id,
                  open,
                  anchorEl,
                  handleClose,
                  setRowDto,
                  setIsFilter,
                  initData,
                  values,
                  resetForm,
                  errors,
                  touched,
                  setFieldValue,
                }}
              ></FilterModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default SeparationReport;
