import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import { Tooltip } from "@mui/material";
import { getPeopleDeskAllDDL, getSearchEmployeeList } from "common/api";
import AsyncFormikSelect from "common/AsyncFormikSelect";
import FormikSelect from "common/FormikSelect";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { gray600, success500 } from "utility/customColor";
import { customStyles } from "utility/selectCustomStyle";
import { yearDDLAction } from "utility/yearDDL";
import AvatarComponent from "../../../../common/AvatarComponent";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter } from "../../../../utility/dateFormatter";
import PeopleDeskTable, {
  paginationSize,
} from "./../../../../common/peopleDeskTable/index";
import FilterModal from "./component/FilterModal";
import { getBuDetails, getTypeWiseLeaveReport } from "./helper";

const initData = {};

const EmMovementHistory = () => {
  // hook
  const dispatch = useDispatch();

  // redux
  const { buId, wgId, buName, wId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30571) {
      permission = item;
    }
  });

  // state
  const [loading, setLoading] = useState(false);
  const [, setBuDetails] = useState([]);

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
  const [leaveTypeDDL, setLeaveTypeDDL] = useState([]);

  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const getData = () => {
    getTypeWiseLeaveReport(wgId, buId, setRowDto, "", setLoading);
  };

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData({
      current: newPage,
      pageSize: pages?.pageSize,
      total: pages?.total,
    });
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData({
      current: 1,
      pageSize: +event.target.value,
      total: pages?.total,
    });
  };

  // initial
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getBuDetails(buId, setBuDetails, setLoading);
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=LeaveType&BusinessUnitId=${buId}&intId=0&WorkplaceGroupId=${wgId}`,
      "LeaveTypeId",
      "LeaveType",
      setLeaveTypeDDL
    );
  }, [buId, wgId, wId]);

  useEffect(() => {
    getTypeWiseLeaveReport(wgId, buId, setRowDto, "", setLoading);
  }, [buId, wgId, wId]);

  const columns = (page, paginationSize) => {
    return [
      {
        title: "SL",
        render: (_, index) => (page - 1) * paginationSize + index + 1,
        sort: false,
        filter: false,
        className: "text-center",
        width: 60,
      },
      {
        title: "Workplace",
        dataIndex: "strWorkplace",
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "Employee Code",
        dataIndex: "strEmployeeCode",
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "Employee Name",
        dataIndex: "strEmployeeName",
        render: (item) => (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={item?.strEmployeeName}
            />
            <span className="ml-2">{item?.strEmployeeName}</span>
          </div>
        ),
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "Department",
        dataIndex: "strDepartment",
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "Designation",
        dataIndex: "strDesignation",
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "Functional Designation",
        dataIndex: "strFunctionalDesignationName",
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "Leave Type",
        dataIndex: "strLeaveType",
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "From Date",
        dataIndex: "dteFromDate",
        render: (item) => (
          <div className="d-flex align-items-center">
            <span className="ml-2">{dateFormatter(item?.dteFromDate)}</span>
          </div>
        ),
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "To Date",
        dataIndex: "dteToDate",
        render: (item) => (
          <div className="d-flex align-items-center">
            <span className="ml-2">{dateFormatter(item?.dteToDate)}</span>
          </div>
        ),
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "Applied Date",
        dataIndex: "dteApplicationDate",
        render: (item) => (
          <div className="d-flex align-items-center">
            <span className="ml-2">
              {dateFormatter(item?.dteApplicationDate)}
            </span>
          </div>
        ),
        sort: true,
        filter: false,
        fieldType: "string",
      },
      {
        title: "Days Enjoyed",
        dataIndex: "daysEnjoyed",
        sort: true,
        filter: false,
        fieldType: "number",
      },
      {
        title: "Remarks",
        dataIndex: "strReason",
        sort: true,
        filter: false,
        fieldType: "string",
      },
    ];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="loan-application">
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div className="d-flex">
                        <Tooltip title="Export CSV" arrow>
                          <button
                            type="button"
                            className="btn-save "
                            onClick={() => {
                              // generateExcelAction(
                              //   "Type Wise Leave Report",
                              //   "",
                              //   "",
                              //   buName,
                              //   rowDto,
                              //   buDetails?.strBusinessUnitAddress
                              // );
                            }}
                          >
                            <SaveAlt
                              sx={{ color: "#637381", fontSize: "16px" }}
                            />
                          </button>
                        </Tooltip>
                        <Tooltip title="Print" arrow>
                          <button
                            className="btn-save ml-3"
                            type="button"
                            onClick={(e) => {
                              // getPDFAction(
                              //   `/PdfAndExcelReport/MovementReport?BusinessUnitId=${buId}&WorkplaceId=${wId}&WorkplaceGroupId=${wgId}&FromDate=${
                              //     values?.fromDate || initStartData
                              //   }&ToDate=${
                              //     values?.toDate || initEndDate
                              //   }&SearchText=${values?.search}`,
                              //   setLoading
                              // );
                            }}
                          >
                            <PrintIcon
                              sx={{ color: "#637381", fontSize: "16px" }}
                            />
                          </button>
                        </Tooltip>
                      </div>
                      <ul className="d-flex flex-wrap">
                        {values?.search && (
                          <li className="mr-2">
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
                                getTypeWiseLeaveReport(
                                  wgId,
                                  buId,
                                  setRowDto,
                                  values,
                                  setLoading
                                );
                              }}
                            />
                          </li>
                        )}
                        <li>
                          <MasterFilter
                            isHiddenFilter={true}
                            width="200px"
                            inputWidth="200px"
                            value={values?.search}
                            setValue={(value) => {
                              setFieldValue("search", value);
                            }}
                            cancelHandler={() => {
                              setFieldValue("search", "");
                            }}
                            handleClick={handleClick}
                          />
                        </li>
                      </ul>
                    </div>
                    <div className="table-card-body">
                      <div className="card-style my-2">
                        <div className="row">
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>Select Employee</label>
                            </div>
                            <AsyncFormikSelect
                              selectedValue={values?.employeeName}
                              isSearchIcon={true}
                              handleChange={(valueOption) => {
                                setFieldValue("employeeName", valueOption);
                              }}
                              placeholder="Search (min 3 letter)"
                              loadOptions={(v) =>
                                getSearchEmployeeList(buId, wgId, v)
                              }
                            />
                          </div>

                          <div className="col-lg-3">
                            <div>
                              <label>Leave Type</label>
                              <FormikSelect
                                placeholder=" "
                                classes="input-sm"
                                styles={{
                                  ...customStyles,
                                  control: (provided, state) => ({
                                    ...provided,
                                    minHeight: "auto",
                                    height:
                                      values?.leaveType?.length > 1
                                        ? "auto"
                                        : "30px",
                                    borderRadius: "4px",
                                    boxShadow: `${success500}!important`,
                                    ":hover": {
                                      borderColor: `${gray600}!important`,
                                    },
                                    ":focus": {
                                      borderColor: `${gray600}!important`,
                                    },
                                  }),
                                  valueContainer: (provided, state) => ({
                                    ...provided,
                                    height:
                                      values?.leaveType?.length > 1
                                        ? "auto"
                                        : "30px",
                                    padding: "0 6px",
                                  }),
                                  multiValue: (styles) => {
                                    return {
                                      ...styles,
                                      position: "relative",
                                      top: "-1px",
                                    };
                                  },
                                  multiValueLabel: (styles) => ({
                                    ...styles,
                                    padding: "0",
                                  }),
                                }}
                                name="leaveType"
                                options={leaveTypeDDL || []}
                                value={values?.leaveType}
                                onChange={(valueOption) => {
                                  setFieldValue("leaveType", valueOption);
                                }}
                                isMulti
                                errors={errors}
                                touched={touched}
                                isClearable={false}
                              />
                            </div>
                          </div>

                          <div className="col-lg-3">
                            <label>Year</label>
                            <FormikSelect
                              name="year"
                              options={yearDDLAction(5, 100) || []}
                              value={values?.year}
                              placeholder="Year"
                              onChange={(valueOption) => {
                                setFieldValue("year", valueOption);
                              }}
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                            />
                          </div>

                          <div className="col-lg-1">
                            <button
                              style={{ marginTop: "21px" }}
                              className="btn btn-green"
                              onClick={() => {
                                getTypeWiseLeaveReport(
                                  wgId,
                                  buId,
                                  setRowDto,
                                  values,
                                  setLoading
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
                          columnData={columns(pages?.current, pages?.pageSize)}
                          pages={pages}
                          rowDto={rowDto}
                          setRowDto={setRowDto}
                          handleChangePage={(e, newPage) =>
                            handleChangePage(e, newPage, values?.search)
                          }
                          handleChangeRowsPerPage={(e) =>
                            handleChangeRowsPerPage(e, values?.search)
                          }
                          uniqueKey="employeeCode"
                          isCheckBox={false}
                          isScrollAble={false}
                          isPagination={false}
                        />
                      ) : (
                        <>
                          <NoResult />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>

            <FilterModal
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
              // masterFilterHandler={masterFilterHandler}
            />
          </>
        )}
      </Formik>
    </>
  );
};

export default EmMovementHistory;
