/* eslint-disable react-hooks/exhaustive-deps */
import {
  CheckCircle,
  Info,
  SettingsBackupRestoreOutlined,
  Unpublished,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import { customStyles } from "../../../../utility/selectCustomStyle";
import FilterModal from "./component/FilterModal";
// import MasterFilter from "../../../../common/MasterFilter";
import { ModalFooter, PModal } from "Components/Modal";
import FormikInput from "common/FormikInput";
import AntTable from "../../../../common/AntTable";
import FilterBadgeComponent from "../../../../common/FilterBadgeComponent";
import FormikSelectWithIcon from "../../../../common/FormikSelectWithIcon";
import MasterFilter from "../../../../common/MasterFilter";
import PopOverMasterFilter from "../../../../common/PopoverMasterFilter";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import IConfirmModal from "./../../../../common/IConfirmModal";
import NoResult from "./../../../../common/NoResult";
import ResetButton from "./../../../../common/ResetButton";
import { todayDate } from "./../../../../utility/todayDate";
import "./attendanceAdjust.css";
import AttendanceAdjustFilterModal from "./component/AttendanceAdjustFilterModal";
import {
  attendenceAdjustColumns,
  getAttendanceAdjustmentFilter,
  // filterData,
  manualAttendanceAction,
} from "./helper";
import { toast } from "react-toastify";

const initData = {
  search: "",
  status: "",
  approvedStatus: "",
  attendedanceAdjustStatus: "",
  attendedanceStatus: "",
  allSelected: false,
  workplace: "",
  department: "",
  employee: "",
  attendenceDate: "",
  attendenceStatus: "",
  employmentType: "",
  inTime: "09:00",
  outTime: "18:00",
  strCalenderName: "",
  strReason: "",
  monthYear: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
};

export default function AttendenceAdjust() {
  const { userName, buId, employeeId, orgId, wgId, isOfficeAdmin } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // row data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isFilter, setIsFilter] = useState(false);

  // filter
  const [status, setStatus] = useState("");
  const [approvedStatus, setApprovedStatus] = useState("");

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  // master filter
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Attendence Adjust";
  }, []);

  const getData = (values) => {
    const yearId = +values?.monthYear?.split("").slice(0, 4).join("");
    const monthId = +values?.monthYear?.split("").slice(-2).join("");
    const payload = {
      employeeId:
        values?.employee?.value >= 0 ? values?.employee?.value : employeeId,
      workplaceGroupId: wgId,
      departmentId: values?.department?.value || 0,
      attendanceStatus: values?.attendenceStatus?.code || "all",
      punchStatus: "all",
      jobTypeId: values?.employmentType?.value || 0,
      businessUnitId: buId,
      yearId: yearId || new Date().getFullYear(),
      monthId: monthId || new Date().getMonth() + 1,
      applicationDate: values?.attendenceDate || null,
    };
    getAttendanceAdjustmentFilter(setAllData, setRowDto, setLoading, payload);
  };

  useEffect(() => {
    setRowDto([]);
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, buId, wgId]);

  //  adjustStatushandler
  const adjustStatushandler = (values, setFieldValue, valueOption) => {
    const confirmObject = {
      closeOnClickOutside: false,
      message: ` Are you sure?`,
      yesAlertFunc: () => {
        const modifyFilterRowDto = rowDto.filter(
          (itm) => itm.presentStatus === true
        );
        const payload = modifyFilterRowDto.map((item) => {
          return {
            id: item?.ManualAttendanceId || 0,
            accountId: orgId,
            attendanceSummaryId: item?.AutoId,
            employeeId: item?.EmployeeId,
            attendanceDate: item?.AttendanceDate,
            inTime: values?.inTime || item?.StartTime,
            outTime: values?.outTime || item?.EndTime,
            status: item?.isPresent
              ? "Present"
              : item?.isLeave
              ? "Leave"
              : "Absent",
            requestStatus: valueOption?.label,
            remarks: "",
            isApproved: true,
            isActive: true,
            isManagement: true,
            insertUserId: employeeId,
            insertDateTime: todayDate(),
            workPlaceGroup: wgId,
            businessUnitId: buId,
          };
        });
        const callBack = () => {
          getData(values);
          setFieldValue("attendedanceStatus", "");
        };
        manualAttendanceAction(payload, setLoading, callBack);
      },
      noAlertFunc: () => {
        setFieldValue("attendedanceStatus", "");
      },
    };
    IConfirmModal(confirmObject);
  };

  //  all Grid Check
  const allGridCheck = (value) => {
    const modifyRowData = rowDto?.map((item) => ({
      ...item,
      presentStatus: value,
    }));
    setRowDto(modifyRowData);
  };

  // single grid check
  const rowDtoHandler = (index) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index].presentStatus = !copyRowDto[index].presentStatus;
    setRowDto(copyRowDto);
  };

  const masterFilterHandler = (values, initData) => {
    getData(values, initData);
    setAnchorEl(null);
  };

  const saveHandler = (values) => {
    console.log("COME HERE");
    if (!values?.inTime) {
      return toast.warn("In Time is Required");
    }
    if (!values?.outTime) {
      return toast.warn("Out Time is Required");
    }
    const modifyFilterRowDto = rowDto.filter(
      (itm) => itm.presentStatus === true
    );
    const payload = modifyFilterRowDto.map((item) => {
      return {
        id: item?.ManualAttendanceId || 0,
        accountId: orgId,
        attendanceSummaryId: item?.AutoId,
        employeeId: item?.EmployeeId,
        attendanceDate: item?.AttendanceDate,
        inTime: values?.inTime || item?.StartTime,
        outTime: values?.outTime || item?.EndTime,
        status: item?.isPresent
          ? "Present"
          : item?.isLeave
          ? "Leave"
          : "Absent",
        requestStatus: values?.attendedanceAdjustStatus?.label,
        remarks: values?.strReason || "",
        isApproved: true,
        isActive: true,
        isManagement: true,
        insertUserId: employeeId,
        insertDateTime: todayDate(),
        workPlaceGroup: wgId,
        businessUnitId: buId,
      };
    });
    const callBack = () => {
      getData(values);
      setOpenModal(false);
    };
    manualAttendanceAction(payload, setLoading, callBack);
  };

  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const debounce = useDebounce();
  const openFilter = Boolean(filterAnchorEl);

  const handleSearch = (values) => {
    getData(values);
    setFilterBages(values);
    setfilterAnchorEl(null);
  };
  const clearBadge = (values, name) => {
    const data = values;
    data[name] = "";
    setFilterBages(data);
    setFilterValues(data);
    handleSearch(data);
  };

  const clearFilter = () => {
    setFilterBages({});
    setFilterValues("");
    getData();
  };

  const getFilterValues = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const searchData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      const newDta = allData?.filter((item) =>
        regex.test(item?.EmployeeName?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 85) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employee: {
            value: employeeId,
            label: userName,
          },
        }}
        onSubmit={(values, { resetForm }) => {
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
          dirty,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {!permission?.isView ? (
                <div className="table-card all-candidate">
                  <div
                    className="table-card-heading"
                    style={{ marginBottom: "6px" }}
                  >
                    <div className="w-50">
                      <AttendanceAdjustFilterModal
                        propsObj={{
                          getFilterValues,
                          setFieldValue,
                          values,
                          errors,
                          touched,
                          getData,
                        }}
                      />
                    </div>
                    <div className="table-card-head-right">
                      <ul>
                        {(values?.search || status || approvedStatus) && (
                          <li>
                            <ResetButton
                              classes="btn-filter-reset"
                              title="reset"
                              icon={
                                <SettingsBackupRestoreOutlined
                                  sx={{
                                    marginRight: "10px",
                                    fontSize: "18px",
                                  }}
                                />
                              }
                              onClick={() => {
                                setRowDto(allData);
                                setFieldValue("search", "");
                                setStatus("");
                                setApprovedStatus("");
                              }}
                            />
                          </li>
                        )}
                        <li>
                          {rowDto?.filter((item) => item?.presentStatus)
                            .length > 0 && (
                            <div
                              style={{
                                width: "300px",
                                marginRight: "15px",
                              }}
                            >
                              <FormikSelectWithIcon
                                name="attendedanceAdjustStatus"
                                options={[
                                  {
                                    value: 1,
                                    label: "Present",
                                    code: "present",
                                    icon: <CheckCircle />,
                                  },
                                  {
                                    value: 2,
                                    label: "Absent",
                                    code: "absent",
                                    icon: <Unpublished />,
                                  },
                                  {
                                    value: 3,
                                    label: "Late",
                                    code: "late",
                                    icon: <Info />,
                                  },
                                ]}
                                value={values?.attendedanceAdjustStatus}
                                onChange={(valueOption) => {
                                  setFieldValue(
                                    "attendedanceAdjustStatus",
                                    valueOption
                                  );
                                  if (valueOption) {
                                    if (valueOption?.value === 1) {
                                      setOpenModal(true);
                                      return;
                                    }
                                    adjustStatushandler(
                                      values,
                                      setFieldValue,
                                      valueOption
                                    );
                                  }
                                }}
                                placeholder="Change Attendance"
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                                isDisabled={false}
                              />
                            </div>
                          )}
                        </li>
                      </ul>
                      <ul>
                        {isFilter && (
                          <li>
                            <ResetButton
                              classes="btn-filter-reset"
                              title="reset"
                              icon={
                                <SettingsBackupRestoreOutlined
                                  sx={{ marginRight: "10px", fontSize: "16px" }}
                                />
                              }
                              onClick={() => {
                                setIsFilter(false);
                                setFieldValue("search", "");
                                getData();
                              }}
                            />
                          </li>
                        )}
                        <li>
                          <MasterFilter
                            styles={{
                              marginRight: "0px",
                            }}
                            inputWidth="200px"
                            width="200px"
                            value={values?.search}
                            setValue={(value) => {
                              setFieldValue("search", value);
                              debounce(() => {
                                // filterData(value);
                                searchData(value);
                              }, 500);
                            }}
                            cancelHandler={() => {
                              setFieldValue("search", "");
                              getData();
                            }}
                            handleClick={(e) =>
                              setfilterAnchorEl(e.currentTarget)
                            }
                            isHiddenFilter={true}
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                  <FilterBadgeComponent
                    propsObj={{
                      filterBages,
                      setFieldValue,
                      clearBadge,
                      values: filterValues,
                      resetForm,
                      initData,
                      clearFilter,
                    }}
                  />
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      {rowDto?.length > 0 ? (
                        <>
                          <AntTable
                            rowSelection={{
                              type: "checkbox",
                            }}
                            data={rowDto}
                            columnsData={attendenceAdjustColumns(
                              setFieldValue,
                              page,
                              paginationSize,
                              rowDto,
                              allGridCheck,
                              setRowDto,
                              rowDtoHandler,
                              isOfficeAdmin
                            )}
                            setPage={setPage}
                            setPaginationSize={setPaginationSize}
                            removePagination
                            rowKey={(record) => record?.AttendanceDate}
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
              ) : (
                <NotPermittedPage />
              )}

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
                  setIsFilter,
                  initData,
                  resetForm,
                }}
                masterFilterHandler={masterFilterHandler}
              ></FilterModal>
              <PopOverMasterFilter
                propsObj={{
                  id,
                  open: openFilter,
                  anchorEl: filterAnchorEl,
                  handleClose: () => setfilterAnchorEl(null),
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
                <AttendanceAdjustFilterModal
                  propsObj={{
                    getFilterValues,
                    setFieldValue,
                    values,
                    errors,
                    touched,
                  }}
                />
              </PopOverMasterFilter>
              <PModal
                title={"In Time/Out Time Setup For Present"}
                open={openModal}
                onClose={() => {
                  setOpenModal(false);
                  setFieldValue("attendedanceAdjustStatus", "");
                  setFieldValue("inTime", "");
                  setFieldValue("outTime", "");
                  setFieldValue("strCalenderName", "");
                  setFieldValue("strReason", "");
                }}
                onCancel={() => {
                  setOpenModal(false);
                }}
                components={
                  <>
                    <div className="modalBody p-0">
                      <div className="row mx-0">
                        <div className="col-6">
                          <label>In Time </label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.inTime}
                            onChange={(e) => {
                              setFieldValue("inTime", e.target.value);
                              setFieldValue("strCalenderName", "");
                              // if (e.target.value) {
                              //   debounce(
                              //     () =>
                              //       getExistingCalenderByTime(
                              //         `/Employee/ManualAttendanceShiftTracing?InTime=${e.target.value}&WorkPlaceGroupId=${wgId}`,
                              //         (res) => {
                              //           setFieldValue(
                              //             "strCalenderName",
                              //             res?.strCalenderName
                              //           );
                              //         }
                              //       ),
                              //     500
                              //   );
                              // }
                            }}
                            name="inTime"
                            type="time"
                            className="form-control"
                            placeholder=""
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-6">
                          <label>Out Time </label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.outTime}
                            onChange={(e) => {
                              setFieldValue("outTime", e.target.value);
                            }}
                            name="outTime"
                            type="time"
                            className="form-control"
                            placeholder=""
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="row mx-0">
                        <div
                          className={`${
                            values?.strCalenderName ? "col-6" : "d-none"
                          }`}
                        >
                          <label>Existing Calender Name</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.strCalenderName}
                            disabled
                            name="strCalenderName"
                            type="text"
                            className="form-control"
                          />
                        </div>
                        <div
                          className={`${
                            values?.strCalenderName ? "col-6" : "col-12"
                          }`}
                        >
                          <label>Reason </label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.strReason}
                            onChange={(e) => {
                              setFieldValue("strReason", e.target.value);
                            }}
                            name="strReason"
                            type="string"
                            className="form-control"
                            placeholder=""
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>

                    <ModalFooter
                      onCancel={() => {
                        setOpenModal(false);
                      }}
                      onSubmit={() => {
                        saveHandler(values);
                      }}
                    />
                  </>
                }
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
