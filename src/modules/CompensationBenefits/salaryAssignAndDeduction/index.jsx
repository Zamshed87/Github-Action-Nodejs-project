import { AddCircle, AddOutlined, SaveAlt } from "@mui/icons-material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FilterBadgeComponent from "../../../common/FilterBadgeComponent";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PopOverMasterFilter from "../../../common/PopoverMasterFilter";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useDebounce from "../../../utility/customHooks/useDebounce";
import FilterModal from "./components/FilterModal";
import {
  allowanceAndDeductionColumn,
  column,
  getSalaryAdditionAndDeductionLanding,
} from "./helper";
import "./styles.css";
import DefaultInput from "../../../common/DefaultInput";
import PeopleDeskTable from "../../../common/peopleDeskTable";
import BtnActionMenu from "common/BtnActionMenu";
import { gray500 } from "utility/customColor";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { dateFormatter } from "utility/dateFormatter";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { getTableDataMonthlyAttendance } from "modules/timeSheet/reports/joineeAttendanceReport/helper";
import { getWorkplaceDetails } from "common/api";

const date = new Date();
const initYear = date.getFullYear(); // 2022
const initMonth = date.getMonth() + 1; // 6
const modifyMonthResult = initMonth <= 9 ? `0${initMonth}` : `${initMonth}`;

const initData = {
  searchString: "",
  fromMonth: `${initYear}-${modifyMonthResult}`,
  workplace: "",
  department: "",
  employee: "",
  attendenceDate: "",
  attendenceStatus: "",
  employmentType: "",
  monthYear: "",
};

const validationSchema = Yup.object({});

function SalaryAssignAndDeduction() {
  const debounce = useDebounce();
  const dispatch = useDispatch();
  const history = useHistory();
  const [filterBadges, setFilterBadges] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const openFilter = Boolean(filterAnchorEl);

  const [loading, setLoading] = useState(false);

  // row data
  const [rowDto, setRowDto] = useState([]);

  // master filter
  const [anchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { orgId, buId, wgId, wId, buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const handleSearch = (values) => {
    getData(values);
    setFilterBadges(values);
    setFilterAnchorEl(null);
  };
  const clearBadge = (values, name) => {
    const data = values;
    data[name] = "";
    setFilterBadges(data);
    setFilterValues(data);
    handleSearch(data);
  };

  const clearFilter = () => {
    setFilterBadges({});
    setFilterValues("");
    getData();
  };

  const getFilterValues = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const [pages, setPages] = useState({
    current: 1,
    pageSize: 100,
    total: 0,
  });

  // useFormik hooks
  const {
    handleSubmit,
    resetForm,
    values,
    errors,
    touched,
    setFieldValue,
    dirty,
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initData,
    },
    onSubmit: () => resetForm(initData),
  });
  const [buDetails, setBuDetails] = useState({});

  const getData = () => {
    getSalaryAdditionAndDeductionLanding(
      wId,
      "",
      buId,
      setRowDto,
      setLoading,
      "",
      pages,
      setPages,
      wgId
    );
  };

  useEffect(() => {
    getSalaryAdditionAndDeductionLanding(
      wId,
      values?.fromMonth,
      buId,
      setRowDto,
      setLoading,
      "",
      pages,
      setPages,
      wgId
    );
    getWorkplaceDetails(wId, setBuDetails);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId, wId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let employeeFeature = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30257) {
      employeeFeature = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Allowance & Deduction";
  }, []);

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getSalaryAdditionAndDeductionLanding(
      wId,
      values?.fromMonth,
      buId,
      setRowDto,
      setLoading,
      searchText,
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      setPages,
      wgId
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages(() => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getSalaryAdditionAndDeductionLanding(
      wId,
      values?.fromMonth,
      buId,
      setRowDto,
      setLoading,
      searchText,
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      setPages,
      wgId
    );
  };

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit} className="employeeProfile-form-main">
        <div className="employee-profile-main">
          {/* box-employee-profile  */}
          {employeeFeature?.isView ? (
            <div className="table-card">
              {/* header-employee-profile  */}
              <div className="table-card-heading">
                <div className="d-flex justify-content-center align-items-center">
                  <Tooltip title="Export CSV" arrow>
                    <button
                      className="btn-save "
                      onClick={(e) => {
                        e.preventDefault();
                        setLoading(true);
                        const excelLanding = async () => {
                          try {
                            // const res = await axios.get(
                            //   `/TimeSheetReport/TimeManagementDynamicPIVOTReport?ReportType=monthly_in_out_attendance_report_for_all_employee&AccountId=${orgId}&DteFromDate=${
                            //     values?.fromDate
                            //   }&DteToDate=${
                            //     values?.toDate
                            //   }&EmployeeId=0&WorkplaceGroupId=${
                            //     values?.workplaceGroup?.value || wgId || 0
                            //   }&WorkplaceId=${
                            //     values?.workplace?.value || wId || 0
                            //   }&PageNo=1&PageSize=100000&IsPaginated=false`
                            // );

                            if (rowDto?.length < 1) {
                              setLoading(false);
                              return toast.error("No Attendance Data Found");
                            }

                            const newData = rowDto?.map((item, index) => {
                              return {
                                ...item,
                                sl: index + 1,
                              };
                            });

                            createCommonExcelFile({
                              titleWithDate: `Allowance & Deduction Report - ${values?.fromMonth}`,
                              fromDate: "",
                              toDate: "",
                              buAddress: buDetails?.strAddress,
                              businessUnit: values?.workplaceGroup?.value
                                ? buDetails?.strWorkplace
                                : buName,
                              tableHeader: column,
                              getTableData: () =>
                                getTableDataMonthlyAttendance(
                                  newData,
                                  Object.keys(column)
                                ),

                              // eslint-disable-next-line @typescript-eslint/no-empty-function
                              getSubTableData: () => {},
                              subHeaderInfoArr: [],
                              subHeaderColumn: [],
                              tableFooter: [],
                              extraInfo: {},
                              tableHeadFontSize: 10,
                              widthList: {
                                C: 30,
                                B: 30,
                                D: 30,
                                E: 25,
                                F: 20,
                                G: 25,
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
                            toast.error(error?.response?.data?.message);
                          }
                        };
                        excelLanding();
                      }}
                    >
                      <SaveAlt sx={{ color: "#637381", fontSize: "16px" }} />
                    </button>
                  </Tooltip>
                  <div>
                    <div className="input-field-main">
                      {/* <label>From Month</label> */}
                      <DefaultInput
                        classes="input-sm month-picker"
                        value={values?.fromMonth}
                        name="fromMonth"
                        type="month"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("fromMonth", e.target.value);
                          getSalaryAdditionAndDeductionLanding(
                            wId,
                            e.target.value,
                            buId,
                            setRowDto,
                            setLoading,
                            "",
                            pages,
                            setPages,
                            wgId
                          );
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
                <ul className="d-flex flex-wrap">
                  <li>
                    <MasterFilter
                      inputWidth="250px"
                      width="250px"
                      isHiddenFilter
                      value={values?.searchString}
                      setValue={(value) => {
                        setFieldValue("searchString", value);
                        debounce(() => {
                          getSalaryAdditionAndDeductionLanding(
                            wId,
                            values?.fromMonth,
                            buId,
                            setRowDto,
                            setLoading,
                            value,
                            {
                              current: 1,
                              pageSize: pages?.pageSize,
                            },
                            setPages,
                            wgId
                          );
                        }, 500);
                      }}
                      cancelHandler={() => {
                        setFieldValue("searchString", "");
                        getSalaryAdditionAndDeductionLanding(
                          wId,
                          values?.fromMonth,
                          buId,
                          setRowDto,
                          setLoading,
                          "",
                          {
                            current: 1,
                            pageSize: pages?.pageSize,
                          },
                          setPages,
                          wgId
                        );
                      }}
                      handleClick={(e) => setFilterAnchorEl(e.currentTarget)}
                    />
                  </li>
                  {/* <li>
                    <PrimaryButton
                      type="button"
                      className="btn btn-default flex-center"
                      label={"Assign"}
                      icon={
                        <AddOutlined
                          sx={{
                            marginRight: "0px",
                            fontSize: "15px",
                          }}
                        />
                      }
                      onClick={() => {
                        if (employeeFeature?.isCreate) {
                          history.push(
                            "/compensationAndBenefits/employeeSalary/allowanceNDeduction/bulkAssign/create",
                            { state: { isCreate: true } }
                          );
                        } else {
                          toast.warn("You don't have permission");
                        }
                      }}
                    />
                    <BtnActionMenu
                      className="btn btn-default flex-center btn-deafult-create-job"
                      icon={
                        <AddOutlined
                          sx={{
                            marginRight: "0px",
                            fontSize: "15px",
                          }}
                        />
                      }
                      label="Assign"
                      options={[
                        {
                          value: 1,
                          label: "Single Assign",
                          icon: (
                            <AddCircle
                              sx={{
                                marginRight: "10px",
                                color: gray500,
                                fontSize: "16px",
                              }}
                            />
                          ),
                          onClick: () => {
                            if (employeeFeature?.isCreate) {
                              history.push(
                                "/compensationAndBenefits/employeeSalary/allowanceNDeduction/singleAssign/create",
                                { state: { isCreate: true } }
                              );
                            } else {
                              toast.warn("You don't have permission");
                            }
                          },
                        },
                        {
                          value: 2,
                          label: "Bulk Assign",
                          icon: (
                            <PlaylistAddCircleIcon
                              sx={{
                                marginRight: "10px",
                                color: gray500,
                                fontSize: "16px",
                              }}
                            />
                          ),
                          onClick: () => {
                            if (employeeFeature?.isCreate) {
                              history.push(
                                "/compensationAndBenefits/employeeSalary/allowanceNDeduction/bulkAssign/create",
                                { state: { isCreate: true } }
                              );
                            } else {
                              toast.warn("You don't have permission");
                            }
                          },
                        },
                      ]}
                      onClick
                    />
                  </li> */}
                  <li>
                    <BtnActionMenu
                      className="btn btn-default flex-center btn-deafult-create-job"
                      icon={
                        <AddOutlined
                          sx={{
                            marginRight: "0px",
                            fontSize: "15px",
                          }}
                        />
                      }
                      label="Assign"
                      options={[
                        {
                          value: 1,
                          label: "Manual Assign",
                          icon: (
                            <AddCircle
                              sx={{
                                marginRight: "10px",
                                color: gray500,
                                fontSize: "16px",
                              }}
                            />
                          ),
                          onClick: () => {
                            if (employeeFeature?.isCreate) {
                              history.push(
                                "/compensationAndBenefits/employeeSalary/allowanceNDeduction/bulkAssign/create",
                                { state: { isCreate: true } }
                              );
                            } else {
                              toast.warn("You don't have permission");
                            }
                          },
                        },
                        {
                          value: 2,
                          label: "Bulk Assign",
                          icon: (
                            <PlaylistAddCircleIcon
                              sx={{
                                marginRight: "10px",
                                color: gray500,
                                fontSize: "16px",
                              }}
                            />
                          ),
                          onClick: () => {
                            if (employeeFeature?.isCreate) {
                              history.push(
                                "/compensationAndBenefits/employeeSalary/allowanceNDeduction/bulkAssignCreate",
                                { state: { isCreate: true } }
                              );
                            } else {
                              toast.warn("You don't have permission");
                            }
                          },
                        },
                      ]}
                    />
                  </li>
                </ul>
              </div>

              <FilterBadgeComponent
                propsObj={{
                  filterBadges,
                  setFieldValue,
                  clearBadge,
                  values: filterValues,
                  resetForm,
                  initData,
                  clearFilter,
                }}
              />
              <div className="table-card-body">
                {rowDto?.length > 0 ? (
                  <PeopleDeskTable
                    columnData={allowanceAndDeductionColumn(
                      pages?.current,
                      pages?.pageSize
                    )}
                    pages={pages}
                    rowDto={rowDto}
                    setRowDto={setRowDto}
                    handleChangePage={(e, newPage) =>
                      handleChangePage(e, newPage, values?.searchString)
                    }
                    handleChangeRowsPerPage={(e) =>
                      handleChangeRowsPerPage(e, values?.searchString)
                    }
                    onRowClick={(item) => {
                      history.push(
                        "/compensationAndBenefits/employeeSalary/allowanceNDeduction/view",
                        {
                          state: {
                            isView: true,
                            empId: item?.intEmployeeId,
                            businessUnitId: item?.intBusinessUnitId,
                            workplaceGroupId: item?.intWorkplaceGroupId,
                          },
                        }
                      );
                    }}
                    uniqueKey="intEmployeeId"
                  />
                ) : (
                  <>
                    {!loading && (
                      <div className="col-12">
                        <NoResult title={"No Data Found"} para={""} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <NotPermittedPage />
          )}
        </div>
        <PopOverMasterFilter
          propsObj={{
            id,
            open: openFilter,
            anchorEl: filterAnchorEl,
            handleClose: () => setFilterAnchorEl(null),
            handleSearch,
            values: filterValues,
            dirty,
            initData,
            resetForm,
            clearFilter,
            sx: {},
            size: "lg",
          }}
        >
          <FilterModal
            propsObj={{
              getFilterValues,
              setFieldValue,
              values,
              errors,
              touched,
            }}
          />
        </PopOverMasterFilter>
      </form>
    </>
  );
}

export default SalaryAssignAndDeduction;
