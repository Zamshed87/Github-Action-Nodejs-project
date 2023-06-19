import {
  Clear,
  SaveAlt,
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { IconButton, Popover, Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { paginationSize } from "../../../common/AntTable";
import FormikInput from "../../../common/FormikInput";
import FormikSelect from "../../../common/FormikSelect";
import NoResult from "../../../common/NoResult";
import ResetButton from "../../../common/ResetButton";
import { PeopleDeskSaasDDL } from "../../../common/api";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PeopleDeskTable from "../../../common/peopleDeskTable";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray600, gray900 } from "../../../utility/customColor";
import {
  dateFormatterForInput,
} from "../../../utility/dateFormatter";
import { customStyles } from "../../../utility/selectCustomStyle";
import Loading from "./../../../common/loading/Loading";
import "./contactBook.css";
import { generateExcelAction } from "./excel/excelConvert";
import {
  contractualExcelColumn,
  contractualExcelData,
} from "./excel/excelStyle";
import {
  contactClosingColumns,
  extendContractEmpAction,
  getBuDetails,
  getContractClosingInfo,
} from "./helper";

const initData = {
  search: "",
  designation: "",
  contractFromDate: "",
  contractToDate: "",
};

export default function ContactClosingReport() {
  // hook
  const dispatch = useDispatch();

  // redux
  const { buId, buName, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 91) {
      permission = item;
    }
  });

  // state
  const [loading, setLoading] = useState(false);

  const [buDetails, setBuDetails] = useState({});
  const [designationDDL, setDesignationDDL] = useState([]);

  //Modal
  const [singleData, setSingleData] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // landing data
  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const getData = (pagination, searchText) => {
    getContractClosingInfo(
      buId,
      wgId,
      setRowDto,
      setLoading,
      "",
      pagination?.current,
      pagination?.pageSize,
      setPages,
      true
    );
  };

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      }
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      }
    );
  };

  // initial
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getBuDetails(buId, setBuDetails, setLoading);
  }, [buId]);

  useEffect(() => {
    PeopleDeskSaasDDL(
      "EmpDesignation",
      wgId,
      buId,
      setDesignationDDL,
      "DesignationId",
      "DesignationName"
    );
  }, [buId, wgId]);

  const confirmation = (values) => {
    extendContractEmpAction(values, singleData, setLoading, () => {
      setSingleData(false);
      setIsEdit(false);
      setAnchorEl(null);
      getContractClosingInfo(
        buId,
        wgId,
        setRowDto,
        setLoading,
        "",
        1,
        paginationSize,
        setPages,
        true
      );
    });
  };

  // excel column set up
  const excelColumnFunc = () => {
    return contractualExcelColumn;
  };

  // excel data set up
  const excelDataFunc = () => {
    return contractualExcelData(rowDto);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          designation: {
            value: singleData?.DesignationId,
            label: singleData?.DesignationName,
          },
          contractFromDate: singleData?.dteContactFromDate
            ? dateFormatterForInput(singleData?.dteContactFromDate)
            : "",
          contractToDate: singleData?.dteContactToDate
            ? dateFormatterForInput(singleData?.dteContactToDate)
            : "",
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          resetForm(initData);
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <>
                  <div className="table-card">
                    <div
                      className="table-card-heading"
                      style={{ marginBottom: "12px" }}
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        <Tooltip title="Export CSV" arrow>
                          <div
                            className="btn-save"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (rowDto?.length <= 0) {
                                return toast.warning("Data is empty !!!!", {
                                  toastId: 1,
                                });
                              }
                              const excelLanding = () => {
                                generateExcelAction(
                                  "Contract Closing Report",
                                  "",
                                  "",
                                  excelColumnFunc(),
                                  excelDataFunc(),
                                  buName,
                                  0,
                                  rowDto,
                                  buDetails?.strBusinessUnitAddress
                                );
                              };
                              excelLanding();
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <SaveAlt
                              sx={{ color: gray600, fontSize: "16px" }}
                            />
                          </div>
                        </Tooltip>
                        <div className="ml-2">
                          {rowDto?.length > 0 ? (
                            <>
                              <h6 className="count">
                                Total {rowDto?.length} employees
                              </h6>
                            </>
                          ) : (
                            <>
                              <h6 className="count">Total result 0</h6>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="table-card-head-right">
                        <ul className="d-flex">
                          {values?.search && (
                            <li>
                              <ResetButton
                                classes="btn-filter-reset"
                                title="reset"
                                icon={
                                  <SettingsBackupRestoreOutlined
                                    sx={{
                                      marginRight: "10px",
                                      fontSize: "16px",
                                    }}
                                  />
                                }
                                onClick={() => {
                                  setFieldValue("search", "");
                                  getContractClosingInfo(
                                    buId,
                                    wgId,
                                    setRowDto,
                                    setLoading,
                                    "",
                                    1,
                                    paginationSize,
                                    setPages,
                                    true
                                  );
                                }}
                              />
                            </li>
                          )}
                          <li>
                            <FormikInput
                              classes="search-input fixed-width mr-0"
                              inputClasses="search-inner-input"
                              placeholder="Search"
                              value={values?.search}
                              name="search"
                              type="text"
                              trailicon={
                                <SearchOutlined sx={{ color: "#323232" }} />
                              }
                              onChange={(e) => {
                                setFieldValue("search", e.target.value);
                                if (e.target.value) {
                                  getContractClosingInfo(
                                    buId,
                                    wgId,
                                    setRowDto,
                                    setLoading,
                                    e.target.value || "",
                                    1,
                                    paginationSize,
                                    setPages,
                                    true
                                  );
                                } else {
                                  getContractClosingInfo(
                                    buId,
                                    wgId,
                                    setRowDto,
                                    setLoading,
                                    "",
                                    1,
                                    paginationSize,
                                    setPages,
                                    true
                                  );
                                }
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>

                    {rowDto?.length > 0 ? (
                      <>
                        <PeopleDeskTable
                          customClass="iouManagementTable"
                          columnData={contactClosingColumns(
                            pages?.current,
                            pages?.pageSize,
                            permission,
                            setAnchorEl,
                            setSingleData,
                          )}
                          pages={pages}
                          rowDto={rowDto}
                          setRowDto={setRowDto}
                          handleChangePage={(e, newPage) =>
                            handleChangePage(e, newPage, values?.search)
                          }
                          handleChangeRowsPerPage={(e) =>
                            handleChangeRowsPerPage(e, values?.search)
                          }
                          uniqueKey="strEmployeeCode"
                          isCheckBox={false}
                          isScrollAble={false}
                        />
                      </>
                    ) : (
                      <>{!loading && <NoResult title="No Result Found" para="" />}</>
                    )}

                  </div>

                  {/* popover */}
                  <Popover
                    sx={{
                      "& .MuiPaper-root": {
                        width: "675px",
                        minHeight: "200px",
                        borderRadius: "4px",
                      },
                    }}
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={() => {
                      setAnchorEl(null);
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "middle",
                    }}
                  >
                    <div
                      className="master-filter-modal-container employeeProfile-src-filter-main"
                      style={{ height: "auto" }}
                    >
                      <div className="master-filter-header employeeProfile-src-filter-header">
                        <div></div>
                        <IconButton
                          onClick={() => {
                            setAnchorEl(null);
                            getContractClosingInfo(
                              buId,
                              wgId,
                              setRowDto,
                              setLoading,
                              "",
                              1,
                              paginationSize,
                              setPages,
                              true
                            );
                            setSingleData(false);
                            setIsEdit(false);
                            setFieldValue("contractFromDate", "");
                            setFieldValue("contractToDate", "");
                          }}
                        >
                          <Clear sx={{ fontSize: "18px", color: gray900 }} />
                        </IconButton>
                      </div>
                      <hr />
                      <div
                        className="body-employeeProfile-master-filter"
                        style={{ height: "250px" }}
                      >
                        <div className="row content-input-field">
                          <div className="col-4">
                            <div className="input-field-main">
                              <label>Designation</label>
                              <FormikSelect
                                menuPosition="fixed"
                                name="designation"
                                options={designationDDL || []}
                                value={values?.designation}
                                onChange={(valueOption) => {
                                  setFieldValue("designation", valueOption);
                                }}
                                styles={customStyles}
                                placeholder=""
                                errors={errors}
                                touched={touched}
                                isDisabled
                              />
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="input-field-main">
                              <label>Contract From Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.contractFromDate}
                                onChange={(e) => {
                                  setFieldValue(
                                    "contractFromDate",
                                    e.target.value
                                  );
                                }}
                                name="contractFromDate"
                                type="date"
                                className="form-control"
                                errors={errors}
                                min={dateFormatterForInput(
                                  singleData?.contractFromDate
                                )}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="input-field-main">
                              <label>Contract to Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.contractToDate}
                                onChange={(e) => {
                                  setFieldValue(
                                    "contractToDate",
                                    e.target.value
                                  );
                                }}
                                name="contractToDate"
                                type="date"
                                className="form-control"
                                errors={errors}
                                min={dateFormatterForInput(
                                  singleData?.contractToDate
                                )}
                                touched={touched}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="master-filter-bottom footer-employeeProfile-src-filter">
                        <div className="master-filter-btn-group">
                          <button
                            type="button"
                            className="btn btn-cancel"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAnchorEl(null);
                              getContractClosingInfo(
                                buId,
                                wgId,
                                setRowDto,
                                setLoading,
                                "",
                                1,
                                paginationSize,
                                setPages,
                                true
                              );
                              setSingleData(false);
                              setIsEdit(false);
                              setFieldValue("contractFromDate", "");
                              setFieldValue("contractToDate", "");
                            }}
                            style={{
                              marginRight: "10px",
                            }}
                          >
                            cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-green btn-green-disable"
                            style={{ width: "auto" }}
                            onClick={() => {
                              confirmation(values);
                            }}
                          >
                            {isEdit ? "Save" : "Extend"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Popover>

                </>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
