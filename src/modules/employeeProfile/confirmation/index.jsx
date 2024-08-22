import { Clear, SaveAlt } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton, Popover, Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { paginationSize } from "../../../common/AntTable";
import { PeopleDeskSaasDDL, getWorkplaceDetails } from "../../../common/api";
import FormikInput from "../../../common/FormikInput";
import FormikSelect from "../../../common/FormikSelect";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../common/ResetButton";
import ViewModal from "../../../common/ViewModal";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray900 } from "../../../utility/customColor";
import {
  dateFormatter,
  dateFormatterForInput,
  monthFirstDate,
} from "../../../utility/dateFormatter";
import { customStyles } from "../../../utility/selectCustomStyle";
import { todayDate } from "../../../utility/todayDate";
import { getTodayDateAndTime } from "../../../utility/todayDateTime";
import "./confirmation.css";
import {
  columns,
  confirmationEmpAction,
  empConfirmcolumns,
  getEmployeeSalaryInfo,
  getPeopleDeskAllLandingForConfirmation,
} from "./helper";
import ViewForm from "./ViewForm";
import PeopleDeskTable from "../../../common/peopleDeskTable";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { toast } from "react-toastify";
import { getTableDataDailyAttendance } from "modules/timeSheet/reports/lateReport/helper";

const initData = {
  search: "",
  designation: "",
  filterFromDate: monthFirstDate(),
  filterToDate: todayDate(),
  confirmDate: getTodayDateAndTime(),
  // pinNo: "",
};

const validationSchema = Yup.object({
  // designation: Yup.object()
  //   .shape({
  //     label: Yup.string().required("Designation is required"),
  //     value: Yup.number().required("Designation is required"),
  //   })
  //   .typeError("Designation is required"),
  confirmDate: Yup.string().required("Confirmation  Date is required"),
});
function Confirmation() {
  const dispatch = useDispatch();

  // const history = useHistory();
  const {
    orgId,
    buId,
    wgId,
    wId: intWorkplaceId,
  } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  // const [landingLoading, setLandingLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState(false);
  const [allData, setAllData] = useState(false);
  const [singleData, setSingleData] = useState(false);
  const [, setSingleSalaryData] = useState([]);
  const [isAddEditForm, setIsAddEditForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [buDetails, setBuDetails] = useState({});

  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const getData = (fromDate, toDate, searchText, pages) => {
    getPeopleDeskAllLandingForConfirmation(
      "EmployeeBasicForConfirmation",
      orgId,
      buId,
      "",
      0,
      0,
      0,
      setRowDto,
      setAllData,
      setLoading,
      0,
      fromDate,
      toDate,
      setPages,
      wgId,
      pages,
      searchText,
      intWorkplaceId
    );
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // const [viewModal, setViewModal] = useState(null);
  // const openModal = Boolean(viewModal);
  // const openId = openModal ? "simple-popover" : undefined;
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Confirmation";
  }, [dispatch]);

  const handleClick = () => {
    // setViewModal(event.currentTarget);
  };
  // const handleClose = () => {
  //   setViewModal(null);
  // };

  const handleChangePage = (event, newPage, values) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });
    getData(values?.filterFromDate, values?.filterToDate, "", {
      current: newPage,
      pageSize: pages?.pageSize,
      total: pages?.total,
    });
  };
  const handleChangeRowsPerPage = (event, values) => {
    setPages(() => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(values?.filterFromDate, values?.filterToDate, "", {
      current: 1,
      pageSize: +event.target.value,
      total: pages?.total,
    });
  };

  useEffect(() => {
    PeopleDeskSaasDDL(
      "EmpDesignation",
      wgId,
      buId,
      setDesignationDDL,
      "DesignationId",
      "DesignationName"
    );
  }, [wgId, buId]);

  useEffect(() => {
    getData(monthFirstDate(), todayDate(), "", pages);
    getWorkplaceDetails(intWorkplaceId, setBuDetails);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId, intWorkplaceId]);

  const confirmation = (values) => {
    confirmationEmpAction(values, singleData, setLoading, () => {
      setSingleData(false);
      setIsEdit(false);
      setAnchorEl(null);
      getData(
        values?.filterFromDate,
        values?.filterToDate,
        values?.search,
        pages
      );
      // !isEdit &&
      //   history.push({
      //     pathname: "/compensationAndBenefits/employeeSalary/salaryAssign",
      //     state: singleData,
      //   });
    });
  };
  // const handleTableChange = (
  //   fromDate,
  //   toDate,
  //   pagination,
  //   newRowDto,
  //   srcText
  // ) => {
  //   if (newRowDto?.action === "filter") {
  //     return;
  //   }
  //   if (
  //     pages?.current === pagination?.current &&
  //     pages?.pageSize !== pagination?.pageSize
  //   ) {
  //     return getData(fromDate, toDate, srcText, pagination);
  //   }
  //   if (pages?.current !== pagination?.current) {
  //     return getData(fromDate, toDate, srcText, pagination);
  //   }
  // };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 9) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        // onSubmit={(values, { setSubmitting, resetForm }) => {
        //   saveHandler(values, () => {
        //     resetForm(initData);
        //   });
        // }}
      >
        {({
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
        }) => (
          <>
            {loading && <Loading />}
            <Form onSubmit={handleSubmit} className="employeeProfile-form-main">
              <div className="employee-profile-main">
                {permission?.isView ? (
                  <div className="table-card">
                    <div
                      className="table-card-heading justify-content-between"
                      style={{ marginBottom: "6px" }}
                    >
                      <div className="ml-2 ">
                        <div className="d-flex justify-content-between align-items-center">
                          {rowDto?.length > 0 ? (
                            <>
                              <Tooltip title="Export CSV" arrow>
                                <button
                                  className="btn-save "
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    if (!rowDto?.length) {
                                      return toast.warn("No Data Found");
                                    }
                                    setLoading(true);
                                    const excelLanding = async () => {
                                      try {
                                        const newData = rowDto?.map(
                                          (item, idx) => ({
                                            ...item,
                                            sl: idx + 1,
                                            confirmationDate: dateFormatter(
                                              item?.confirmationDate
                                            ),
                                            joiningDate: dateFormatter(
                                              item?.joiningDate
                                            ),
                                          })
                                        );
                                        createCommonExcelFile({
                                          titleWithDate: `Confirmation - ${dateFormatter(
                                            values?.filterFromDate
                                          )} to ${dateFormatter(
                                            values?.filterToDate
                                          )}`,
                                          fromDate: "",
                                          toDate: "",
                                          buAddress: buDetails?.strAddress,
                                          businessUnit: buDetails?.strWorkplace,
                                          tableHeader: columns,
                                          getTableData: () =>
                                            getTableDataDailyAttendance(
                                              newData,
                                              Object.keys(columns)
                                            ),
                                          tableFooter: [],
                                          extraInfo: {},
                                          tableHeadFontSize: 10,
                                          widthList: {
                                            C: 14,
                                            B: 30,
                                            D: 30,
                                            E: 25,
                                            F: 20,
                                            G: 20,
                                            H: 15,
                                            I: 15,
                                            J: 20,
                                            K: 20,
                                          },
                                          commonCellRange: "A1:J1",
                                          CellAlignment: "left",
                                        });
                                        setLoading(false);
                                      } catch (error) {
                                        setLoading(false);
                                        console.log({ error });
                                        // toast.error(error?.response?.data?.message);
                                      }
                                    };
                                    excelLanding();
                                  }}
                                >
                                  <SaveAlt
                                    sx={{ color: "#637381", fontSize: "16px" }}
                                  />
                                </button>
                              </Tooltip>
                              <h6 className="count">
                                Total {rowDto[0]?.totalCount} employees
                              </h6>
                            </>
                          ) : (
                            <>
                              <h6 className="count">Total result 0</h6>
                            </>
                          )}
                        </div>
                      </div>
                      <ul className="d-flex flex-wrap">
                        {values?.search && (
                          <ResetButton
                            classes="btn-filter-reset"
                            title="Reset"
                            icon={<RefreshIcon sx={{ marginRight: "10px" }} />}
                            onClick={() => {
                              getData("", "", "", {
                                current: 1,
                                pageSize: paginationSize,
                              });
                              setFieldValue("search", "");
                            }}
                            styles={{
                              height: "auto",
                              fontSize: "12px",
                              marginRight: "10px",
                              marginTop: "3px",
                              paddingTop: "0px",
                            }}
                          />
                        )}
                        <li>
                          <MasterFilter
                            isHiddenFilter
                            styles={{
                              marginRight: "0px",
                            }}
                            width="200px"
                            inputWidth="200px"
                            value={values?.search}
                            setValue={(value) => {
                              setFieldValue("search", value);
                              if (value) {
                                getData(
                                  values?.filterFromDate,
                                  values.filterToDate,
                                  value,
                                  { current: 1, pageSize: paginationSize }
                                );
                              } else {
                                getData(
                                  values?.filterFromDate,
                                  values.filterToDate,
                                  value,
                                  { current: 1, pageSize: paginationSize }
                                );
                              }
                            }}
                            cancelHandler={() => {
                              getData(
                                values?.filterFromDate,
                                values.filterToDate,
                                "",
                                { current: 1, pageSize: paginationSize }
                              );
                              setFieldValue("search", "");
                            }}
                            handleClick={handleClick}
                          />
                        </li>
                      </ul>
                    </div>
                    <div className="table-card-body">
                      <div
                        className="card-style mb-2"
                        style={{ marginTop: "13px" }}
                      >
                        <div className="row">
                          <div className="col-lg-3">
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
                          <div className="col-lg-3">
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

                          <div className="col-lg-1">
                            <button
                              // disabled={
                              //   !values?.filterToDate || !values?.filterFromDate
                              // }
                              style={{ marginTop: "21px" }}
                              className="btn btn-green"
                              onClick={() => {
                                getData(
                                  values?.filterFromDate,
                                  values?.filterToDate,
                                  values.search,
                                  pages
                                );
                              }}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                      {rowDto?.length > 0 ? (
                        <div className="table-card-styled employee-table-card tableOne mt-3">
                          <PeopleDeskTable
                            scrollCustomClass="confirmationScrollTable"
                            columnData={empConfirmcolumns(
                              setAnchorEl,
                              setSingleData,
                              setIsEdit,
                              permission,
                              orgId,
                              setValues,
                              pages,
                              setLoading
                            )}
                            pages={pages}
                            rowDto={rowDto}
                            setRowDto={setRowDto}
                            handleChangePage={(e, newPage) =>
                              handleChangePage(e, newPage, values)
                            }
                            handleChangeRowsPerPage={(e) =>
                              handleChangeRowsPerPage(e, values)
                            }
                            uniqueKey="strEmployeeCode"
                            getFilteredData={() =>
                              getData(
                                values?.filterFromDate,
                                values?.filterToDate,
                                values.search,
                                pages
                              )
                            }
                            isCheckBox={false}
                            onRowClick={(item) => {
                              if (item?.intEmploymentTypeId === 2) {
                                setIsAddEditForm(true);
                                const obj = {
                                  partType: "EmployeeSalaryInfoByEmployeeId",
                                  businessUnitId: buId,
                                  workplaceGroupId: 0,
                                  departmentId: 0,
                                  designationId: 0,
                                  supervisorId: 0,
                                  employeeId: item?.EmployeeId || 0,
                                };
                                getEmployeeSalaryInfo(
                                  setSingleSalaryData,
                                  setLoading,
                                  obj
                                );
                              }
                            }}
                            isScrollAble={true}
                          />
                        </div>
                      ) : (
                        <NoResult title="No Result Found" para="" />
                      )}
                    </div>
                  </div>
                ) : (
                  <NotPermittedPage />
                )}
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
                  setSingleData(false);
                  setFieldValue("pinNo", "");
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
                        setFieldValue("confirmDate", "");
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
                    {/* confirmation by fosu and maruf vai 🔥🔥 */}
                    <div className="row content-input-field ">
                      <div className="col-6 d-none">
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
                            isDisabled={isEdit && true}
                            isClearable={false}
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="input-field-main">
                          <label>Confirmation Date</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.confirmDate}
                            onChange={(e) => {
                              setFieldValue("confirmDate", e.target.value);
                            }}
                            name="confirmDate"
                            type="date"
                            className="form-control"
                            errors={errors}
                            min={dateFormatterForInput(singleData?.JoiningDate)}
                            touched={touched}
                            disabled={isEdit && true}
                          />
                        </div>
                      </div>
                      {/* // requirement from fosu 🔥🔥 */}

                      <div className="col-4 d-none">
                        <div className="input-field-main">
                          <label>PIN No.</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.pinNo}
                            onChange={(e) => {
                              setFieldValue("pinNo", e.target.value);
                            }}
                            name="pinNo"
                            type="text"
                            className="form-control"
                            errors={errors}
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
                          setFieldValue("confirmDate", "");
                          // setFieldValue("pinNo", "");
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
                        {isEdit ? "Save" : "Assign"}
                      </button>
                    </div>
                  </div>
                </div>
              </Popover>
              {/* <PopOverFilter
                propsObj={{
                  openId,
                  openModal,
                  viewModal,
                  setLoading,
                  setIsFilter,
                  handleClose,
                }}
                masterFilterHandler={masterFilterHandler}
              /> */}
            </Form>
          </>
        )}
      </Formik>
      <ViewModal
        show={isAddEditForm}
        title="View Employee"
        onHide={() => setIsAddEditForm(false)}
        size="lg"
        backdrop="static"
        classes="default-modal form-modal"
      >
        <ViewForm
          setIsAddEditForm={setIsAddEditForm}
          // singleSalaryData={singleSalaryData}
        />
      </ViewModal>
    </>
  );
}

export default Confirmation;
