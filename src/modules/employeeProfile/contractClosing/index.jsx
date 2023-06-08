/* eslint-disable react-hooks/exhaustive-deps */
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
import AntTable from "../../../common/AntTable";
import { PeopleDeskSaasDDL } from "../../../common/api";
import FormikInput from "../../../common/FormikInput";
import FormikSelect from "../../../common/FormikSelect";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray600, gray900 } from "../../../utility/customColor";
import { paginationSize } from "../../../common/AntTable";

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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, []);

  // eslint-disable-next-line no-unused-vars
  const { orgId, buId, buName, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [buDetails, setBuDetails] = useState({});
  const [allData, setAllData] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  // sorting
  const [designationDDL, setDesignationDDL] = useState([]);

  const getData = (pages, srcText) => {
    getContractClosingInfo(
      "ContractualClosing",
      orgId,
      buId,
      "",
      setRowDto,
      setAllData,
      setLoading,
      "",
      pages,
      srcText,
      setPages,
      wgId
    );
  };

  useEffect(() => {
    getData(pages, "");
  }, []);

  useEffect(() => {
    getBuDetails(buId, setBuDetails, setLoading);
  }, []);

  //Modal
  const [singleData, setSingleData] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // const [page, setPage] = useState(1);
  // const [paginationSize, setPaginationSize] = useState(15);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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

  // search
  // const filterData = (keywords, allData, setRowDto) => {
  //   try {
  //     const regex = new RegExp(keywords?.toLowerCase());
  //     let newDta = allData?.filter(
  //       (item) =>
  //         regex.test(item?.EmployeeName?.toLowerCase()) ||
  //         regex.test(item?.DepartmentName?.toLowerCase()) ||
  //         regex.test(dateFormatter(item?.dteJoiningDate)?.toLowerCase()) ||
  //         regex.test(dateFormatter(item?.dteContactFromDate)?.toLowerCase()) ||
  //         regex.test(dateFormatter(item?.dteContactToDate)?.toLowerCase())
  //     );
  //     setRowDto(newDta);
  //   } catch {
  //     setRowDto([]);
  //   }
  // };
  const handleTableChange = (pagination, newRowDto, srcText) => {
    if (newRowDto?.action === "filter") {
      return;
    }
    if (
      pages?.current === pagination?.current &&
      pages?.pageSize !== pagination?.pageSize
    ) {
      return getData(pagination, srcText);
    }
    if (pages?.current !== pagination?.current) {
      return getData(pagination, srcText);
    }
  };

  const saveHandler = (values) => { };

  const confirmation = (values) => {
    extendContractEmpAction(values, singleData, setLoading, () => {
      setSingleData(false);
      setIsEdit(false);
      setAnchorEl(null);
      getData(pages, "");
    });
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 91) {
      permission = item;
    }
  });

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
          saveHandler(values, () => {
            resetForm(initData);
          });
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
                                  setRowDto(allData);
                                  setFieldValue("search", "");
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
                                // filterData(e.target.value, allData, setRowDto);
                                setFieldValue("search", e.target.value);
                                if (e.target.value) {
                                  getData(
                                    { current: 1, pageSize: paginationSize },
                                    e.target.value
                                  );
                                } else {
                                  getData(
                                    { current: 1, pageSize: paginationSize },
                                    ""
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
                    <div className="table-card-body">
                      {rowDto?.length > 0 ? (
                        <div className="table-card-styled employee-table-card tableOne  table-responsive ">
                          <AntTable
                            data={rowDto?.length > 0 ? rowDto : []}
                            columnsData={contactClosingColumns(
                              permission,
                              setAnchorEl,
                              setSingleData,
                              pages.current,
                              pages.paginationSize
                            )}
                            pages={pages?.pageSize}
                            pagination={pages}
                            handleTableChange={({ pagination, newRowDto }) =>
                              handleTableChange(
                                pagination,
                                newRowDto,
                                values?.search || ""
                              )
                            }
                          // setPage={setPage}
                          // setPaginationSize={setPaginationSize}
                          />
                        </div>
                      ) : (
                        <NoResult />
                      )}
                    </div>
                  </div>
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
                            setRowDto(allData);
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
                              setRowDto(allData);
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
