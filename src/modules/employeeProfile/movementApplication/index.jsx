/* eslint-disable react-hooks/exhaustive-deps */
import {
  CreateOutlined,
  DeleteOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { APIUrl } from "../../../App";
import DemoImg from "../../../assets/images/demo.png";
import {
  getPeopleDeskAllLanding,
  getSearchEmployeeList,
} from "../../../common/api";
import Chips from "../../../common/Chips";
import DefaultInput from "../../../common/DefaultInput";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../utility/customColor";
import {
  dateFormatter,
  dateFormatterForInput,
  monthFirstDate,
  monthLastDate,
} from "../../../utility/dateFormatter";
import { timeFormatter } from "../../../utility/timeFormatter";
import FilterModal from "./component/FilterModal";
import FormCard from "./component/FormCard";
import {
  createMovementApplication,
  getMovementApplicationFilterEmpManagement,
} from "./helper";
import "./index.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IConfirmModal from "../../../common/IConfirmModal";
import AntTable from "../../../common/AntTable";
import NoResult from "../../../common/NoResult";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { LightTooltip } from "../../../common/LightTooltip";
import AsyncFormikSelect from "../../../common/AsyncFormikSelect";
import moment from "moment";

const initData = {
  search: "",
  movementType: "",
  fromDate: "",
  startTime: "",
  toDate: "",
  endTime: "",
  location: "",
  reason: "",
  movementFromDate: monthFirstDate(),
  movementToDate: monthLastDate(),
};

const validationSchema = Yup.object().shape({
  location: Yup.string().required("Location is required"),
  reason: Yup.string().required("Reason is required"),
  fromDate: Yup.string().required("From date is required"),
  startTime: Yup.string().required("Start time is required"),
  toDate: Yup.string().required("To date is required"),
  endTime: Yup.string().required("End time is required"),
  movementType: Yup.object()
    .shape({
      label: Yup.string().required("Movement type is required"),
      value: Yup.string().required("Movement type is required"),
    })
    .typeError("Movement type is required"),
});

export default function EmMovementApplication() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Movement Application";
  }, []);
  const {
    userName,
    intProfileImageUrl,
    orgId,
    buId,
    employeeId,
    isOfficeAdmin,
    wgId,
  } = useSelector((state) => state?.auth?.profileData, shallowEqual);
  const [anchorEl, setAnchorEl] = useState(null);
  const [employee, setEmployee] = useState("");
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [empBasic, setEmpBasic] = useState([]);
  const [othersEmployee, setOthersEmployee] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const scrollRef = useRef();

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    getData();
    getPeopleDeskAllLanding(
      "EmployeeBasicById",
      orgId,
      buId,
      employeeId,
      setEmpBasic,
      null,
      setLoading,
      "",
      "",
      wgId
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  useEffect(() => {
    getPeopleDeskAllLanding(
      "EmployeeBasicById",
      orgId,
      buId,
      employee?.employeeId ? employee?.employeeId : employeeId,
      setOthersEmployee,
      null,
      setLoading,
      "",
      "",
      wgId
    );
  }, [employee?.employeeId]);

  const saveHandler = (values, cb) => {
    const payload = {
      partId: singleData ? 2 : 1,
      movementId: singleData ? singleData?.MovementId : 0,
      intEmployeeId: employee ? employee?.employeeId : employeeId,
      movementTypeId: values?.movementType?.value,
      fromDate: values.fromDate,
      toDate: values.toDate,
      fromTime: moment(values?.startTime, "HH:mm:ss").format("HH:mm"),
      toTime: moment(values?.endTime, "HH:mm:ss").format("HH:mm"),
      reason: values?.reason,
      location: values?.location,
      accountId: orgId,
      businessUnitId: buId,
      workplaceGroupId: wgId,
      isActive: true,
      insertBy: employeeId,
    };

    const callback = () => {
      getData(values);
      cb();
    };
    if (employee) {
      createMovementApplication(payload, setLoading, callback);
    } else {
      createMovementApplication(payload, setLoading, callback);
    }
  };
  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      const newDta = allData?.filter((item) =>
        regex.test(item?.MovementType?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 88) {
      permission = item;
    }
  });

  const masterFilterHandler = ({
    movementType,
    fromDate,
    status,
    toDate,
    employee,
  }) => {
    setAnchorEl(null);

    const payload = {
      movementTypeId: movementType?.value || 0,
      applicationDate: "",
      fromDate: fromDate || "",
      toDate: toDate || "",
      statusId: status?.value || 0,
      empId: employee?.value || employeeId,
    };
    getMovementApplicationFilterEmpManagement(
      "MovementApplication",
      orgId,
      buId,
      payload,
      setRowDto,
      setAllData,
      setLoading
    );
  };

  const getData = (values) => {
    const payload = {
      movementTypeId: "",
      applicationDate: "",
      // fromDate: values?.fromDate || "",
      // toDate: values?.toDate || "",
      fromDate: values?.movementFromDate || monthFirstDate(),
      toDate: values?.movementToDate || monthLastDate(),
      statusId: "",
      empId: values?.employee?.value || employee?.employeeId || employeeId,
    };
    getMovementApplicationFilterEmpManagement(
      "MovementApplication",
      orgId,
      buId,
      payload,
      setRowDto,
      setAllData,
      setLoading
    );
  };

  useEffect(() => {
    getData();
  }, [orgId, buId]);

  const debounce = useDebounce();

  const demoPopup = (data, values) => {
    const confirmObject = {
      closeOnClickOutside: false,
      message: "Are you want to sure you delete your movement?",
      yesAlertFunc: () => {
        const payload = {
          partId: 3,
          movementId: data?.MovementId,
          intEmployeeId: data?.EmployeeId,
          movementTypeId: data?.MovementTypeId || 0,
          fromDate: data?.FromDate,
          toDate: data?.ToDate,
          fromTime: moment(data?.FromTime, "HH:mm:ss").format("HH:mm"),
          toTime: moment(data?.ToTime, "HH:mm:ss").format("HH:mm"),
          reason: data?.Reason,
          location: data?.Location,
          accountId: orgId,
          businessUnitId: buId,
          workplaceGroupId: wgId,
          isActive: true,
          insertBy: employeeId,
        };
        const callback = () => {
          getData(values);
          setSingleData("");
        };
        createMovementApplication(payload, setLoading, callback);
        setSingleData(data);
      },
      noAlertFunc: () => {
        //   history.push("/components/dialogs")
      },
    };
    IConfirmModal(confirmObject);
  };

  const columns = (values, setValues) => {
    return [
      {
        title: "SL",
        render: (text, record, index) =>
          (page - 1) * paginationSize + index + 1,
        sorter: false,
        filter: false,
        className: "text-center",
      },
      {
        title: "Movement Type",
        dataIndex: "MovementType",
        render: (_, record) => (
          <div className="d-flex align-items-center ">
            <LightTooltip
              title={
                <div className="movement-tooltip p-2">
                  <div className="border-bottom">
                    <p className="tooltip-title">Reason</p>
                    <p className="tooltip-subTitle">{record?.Reason}</p>
                  </div>
                  <div>
                    <p className="tooltip-title mt-2">Location</p>
                    <p className="tooltip-subTitle mb-0">{record?.Location}</p>
                  </div>
                </div>
              }
              arrow
            >
              <InfoOutlinedIcon
                sx={{
                  marginRight: "5px",
                  color: "rgba(0,0,0,0.6)",
                  fontSize: "16px",
                }}
              />
            </LightTooltip>
            <span> {record?.MovementType}</span>
          </div>
        ),
        sorter: false,
        filter: true,
      },
      {
        title: "From Date",
        dataIndex: "FromDate",
        render: (date) => dateFormatter(date),
        sorter: false,
        filter: false,
      },
      {
        title: "Start Time",
        dataIndex: "FromTime",
        render: (data) => <div>{data && timeFormatter(data)}</div>,
        filter: false,
        sorter: false,
      },
      {
        title: "To Date",
        dataIndex: "ToDate",
        render: (date) => dateFormatter(date),
        sorter: false,
        filter: false,
      },
      {
        title: "End Time",
        dataIndex: "ToTime",
        render: (data) => <div>{data && timeFormatter(data)}</div>,
        filter: false,
        sorter: false,
      },
      {
        title: "Application Date",
        dataIndex: "ApplicationDate",
        render: (data) => <div>{data && dateFormatter(data)}</div>,
        filter: false,
        sorter: false,
      },
      {
        title: "Status",
        dataIndex: "Status",
        render: (data) => (
          <div>
            {data === "Approved" && <Chips label={data} classess="success" />}
            {data === "Pending" && <Chips label={data} classess="warning" />}
            {data === "Rejected" && <Chips label={data} classess="danger" />}
            {data === "Process" && <Chips label={data} classess="primary" />}
          </div>
        ),
        sorter: false,
        filter: false,
      },
      {
        title: "",
        dataIndex: "Status",
        render: (data, record) => (
          <>
            {data === "Pending" && (
              <div className="d-flex align-items-center">
                <Tooltip title="Edit" arrow>
                  <button
                    type="button"
                    className="iconButton"
                    onClick={(e) => {
                      e.stopPropagation();
                      // setShowCreateModal(true);
                      setSingleData(record);
                      setIsEdit(true);
                      scrollRef.current.scrollIntoView({
                        behavior: "smooth",
                      });
                      setValues({
                        search: "",
                        movementType: {
                          value: record?.MovementTypeId,
                          label: record?.MovementType,
                        },
                        fromDate: dateFormatterForInput(record?.FromDate),
                        startTime: record?.FromTime,
                        toDate: dateFormatterForInput(record?.ToDate),
                        endTime: record?.ToTime,
                        location: record?.Location,
                        reason: record?.Reason,
                      });
                    }}
                  >
                    <CreateOutlined />
                  </button>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                  <button
                    type="button"
                    className="iconButton mt-0 mt-md-2 mt-lg-0"
                    onClick={() => {
                      demoPopup(record, values);
                    }}
                  >
                    <DeleteOutlined />
                  </button>
                </Tooltip>
              </div>
            )}
          </>
        ),
        sorter: false,
        filter: true,
      },
    ];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employee: {
            value: employee?.employeeId ? employee?.employeeId : employeeId,
            label: employee?.employeeName ? employee?.employeeName : userName,
          },
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setIsEdit(false);
            setSingleData("");
            // getData(values);
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
          setValues,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div ref={scrollRef}>
                {permission?.isCreate ? (
                  <div className="table-card">
                    <div className="table-card-heading pb-1 pr-0">
                      <div className="employeeInfo d-flex align-items-center">
                        {employee?.employeeId ? (
                          <img
                            src={
                              othersEmployee?.[0]?.strProfileImageUrl
                                ? `${APIUrl}/Document/DownloadFile?id=${othersEmployee?.[0]?.strProfileImageUrl}`
                                : DemoImg
                            }
                            alt="Profile"
                            style={{
                              width: "35px",
                              height: "35px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <img
                            src={
                              intProfileImageUrl
                                ? `${APIUrl}/Document/DownloadFile?id=${intProfileImageUrl}`
                                : DemoImg
                            }
                            alt="Profile"
                            style={{
                              width: "35px",
                              height: "35px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <div className="employeeTitle ml-2">
                          <p className="employeeName">
                            {employee?.employeeName
                              ? employee?.employeeName
                              : userName}
                          </p>
                          <p className="employeePosition">
                            {employee?.designationName
                              ? employee?.designationName
                              : empBasic?.[0]?.DesignationName}
                          </p>
                        </div>
                      </div>
                      <div className="table-card-head-right">
                        <ul>
                          {isFilter && (
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
                                styles={{
                                  marginRight: "16px",
                                }}
                                onClick={() => {
                                  setEmployee("");
                                  setIsFilter(false);
                                  getPeopleDeskAllLanding(
                                    "MovementApplication",
                                    orgId,
                                    buId,
                                    employeeId,
                                    setRowDto,
                                    setAllData,
                                    setLoading
                                  );
                                }}
                              />
                            </li>
                          )}
                          <li>
                            <div className="input-field-main d-flex align-items-center">
                              <label htmlFor="" className="mr-2">
                                Employee
                              </label>
                              <div style={{ width: "250px" }}>
                                {/* <FormikSelect
                                  isClearable={false}
                                  menuPosition="fixed"
                                  name="employee"
                                  options={employeeDDL || []}
                                  value={values?.employee}
                                  onChange={(valueOption) => {
                                    setFieldValue("employee", valueOption);
                                    setEmployee(valueOption);
                                    const payload = {
                                      movementTypeId: "",
                                      applicationDate: "",
                                      fromDate:
                                        values?.movementFromDate ||
                                        monthFirstDate(),
                                      toDate:
                                        values?.movementToDate ||
                                        monthLastDate(),
                                      statusId: "",
                                      empId:
                                        valueOption?.EmployeeId || employeeId,
                                    };
                                    getMovementApplicationFilterEmpManagement(
                                      "MovementApplication",
                                      orgId,
                                      buId,
                                      payload,
                                      setRowDto,
                                      setAllData,
                                      setLoading
                                    );
                                  }}
                                  styles={customStyles}
                                  placeholder=""
                                /> */}
                                <AsyncFormikSelect
                                  selectedValue={values?.employee}
                                  isSearchIcon={true}
                                  handleChange={(valueOption) => {
                                    setFieldValue("employee", valueOption);
                                    setEmployee(valueOption);
                                    const payload = {
                                      movementTypeId: "",
                                      applicationDate: "",
                                      fromDate:
                                        values?.movementFromDate ||
                                        monthFirstDate(),
                                      toDate:
                                        values?.movementToDate ||
                                        monthLastDate(),
                                      statusId: "",
                                      empId: valueOption?.value || employeeId,
                                    };
                                    getMovementApplicationFilterEmpManagement(
                                      "MovementApplication",
                                      orgId,
                                      buId,
                                      payload,
                                      setRowDto,
                                      setAllData,
                                      setLoading
                                    );
                                  }}
                                  placeholder="Search (min 3 letter)"
                                  loadOptions={(v) =>
                                    getSearchEmployeeList(buId, wgId, v)
                                  }
                                />
                              </div>
                            </div>
                            {/* <MasterFilter
                            isHiddenFilter
                              styles={{
                                marginRight: "0px",
                              }}
                              width="200px"
                              inputWidth="200px"
                              value={values?.search}
                              setValue={(value) => {
                                debounce(() => {
                                  getData(values);
                                  setFieldValue("search", value);
                                  searchData(value, allData, setRowDto);
                                });
                              }}
                              cancelHandler={() => {
                                getPeopleDeskAllLanding(
                                  "MovementApplication",
                                  orgId,
                                  buId,
                                  employee?.id ? employee?.id : employeeId,
                                  setRowDto,
                                  setAllData,
                                  setLoading
                                );
                                setFieldValue("search", "");
                              }}
                              handleClick={handleClick}
                            /> */}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-card-body">
                      <div className="leave-movement-FormCard col-md-12 p-0">
                        <FormCard
                          propsObj={{
                            employee,
                            setRowDto,
                            setAllData,
                            singleData,
                            isEdit,
                            setIsEdit,
                            setFieldValue,
                            values,
                            errors,
                            touched,
                            resetForm,
                            initData,
                            setSingleData,
                          }}
                        ></FormCard>
                      </div>
                      <div style={{ margin: "12px 0px" }}>
                        <div className="d-flex align-items-center justify-content-between">
                          <h2 style={{ color: gray500, fontSize: "14px" }}>
                            Movement List
                          </h2>
                          <MasterFilter
                            isHiddenFilter
                            styles={{
                              marginRight: "0px",
                            }}
                            width="200px"
                            inputWidth="200px"
                            value={values?.search}
                            setValue={(value) => {
                              debounce(() => {
                                // getData(values);
                                setFieldValue("search", value);
                                searchData(value, allData, setRowDto);
                              });
                            }}
                            cancelHandler={() => {
                              getPeopleDeskAllLanding(
                                "MovementApplication",
                                orgId,
                                buId,
                                employee?.id ? employee?.id : employeeId,
                                setRowDto,
                                setAllData,
                                setLoading
                              );
                              setFieldValue("search", "");
                            }}
                            handleClick={handleClick}
                          />
                        </div>

                        <div className="card-style my-2">
                          <div className="row">
                            <div className="col-lg-3">
                              <div className="input-field-main">
                                <label>Movement From Date</label>
                                <DefaultInput
                                  classes="input-sm"
                                  value={values?.movementFromDate}
                                  name="movementFromDate"
                                  type="date"
                                  className="form-control"
                                  onChange={(e) => {
                                    setFieldValue(
                                      "movementFromDate",
                                      e.target.value
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="input-field-main">
                                <label>Movement To Date</label>
                                <DefaultInput
                                  classes="input-sm"
                                  value={values?.movementToDate}
                                  name="movementToDate"
                                  type="date"
                                  className="form-control"
                                  onChange={(e) => {
                                    setFieldValue(
                                      "movementToDate",
                                      e.target.value
                                    );
                                  }}
                                />
                              </div>
                            </div>

                            <div className="col-lg-1">
                              <button
                                disabled={
                                  !values?.movementFromDate ||
                                  !values?.movementToDate
                                }
                                type="button"
                                style={{ marginTop: "23px" }}
                                className="btn btn-green"
                                onClick={(e) => {
                                  const data = {
                                    movementTypeId: "",
                                    applicationDate: "",
                                    fromDate: values.movementFromDate,
                                    toDate: values.movementToDate,
                                    statusId: 0,
                                    empId: values.employee.value || 0,
                                  };
                                  e.stopPropagation();
                                  getMovementApplicationFilterEmpManagement(
                                    "MovementApplication",
                                    orgId,
                                    buId,
                                    data,
                                    setRowDto,
                                    setAllData,
                                    setLoading
                                  );
                                }}
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {rowDto?.length > 0 ? (
                        <div className="table-card-styled tableOne">
                          <AntTable
                            data={rowDto}
                            columnsData={columns(values, setValues)}
                            setPage={setPage}
                            setPaginationSize={setPaginationSize}
                          />
                        </div>
                      ) : (
                        <NoResult />
                      )}
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
                    setEmployee,
                    setIsFilter,
                    masterFilterHandler,
                    isOfficeAdmin,
                  }}
                ></FilterModal>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
