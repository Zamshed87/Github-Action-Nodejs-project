/* eslint-disable react-hooks/exhaustive-deps */
import styled from "@emotion/styled";
import {
  CreateOutlined,
  DeleteOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip, tooltipClasses } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { APIUrl } from "../../../../App";
import DemoImg from "../../../../assets/images/demo.png";
import { getPeopleDeskAllLanding } from "../../../../common/api";
import Chips from "../../../../common/Chips";
import IConfirmModal from "../../../../common/IConfirmModal";
import MasterFilter from "../../../../common/MasterFilter";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../../utility/customColor";
import {
  dateFormatter,
  dateFormatterForInput,
  monthFirstDate,
  monthLastDate,
} from "../../../../utility/dateFormatter";
import { timeFormatter } from "../../../../utility/timeFormatter";
import {
  createMovementApplication,
  getMovementApplicationFilter,
} from "../helper";
import Loading from "./../../../../common/loading/Loading";
import FilterModal from "./component/FilterModal";
import FormCard from "./component/FormCard";
import "./index.css";
import AntTable from "../../../../common/AntTable";
import NoResult from "../../../../common/NoResult";
import DefaultInput from "../../../../common/DefaultInput";
import { getMovementApplicationFilterEmpManagement } from "../../../employeeProfile/movementApplication/helper";
import moment from "moment";
import { todayDate } from "utility/todayDate";

const initData = {
  search: "",
  movementType: "",
  fromDate: todayDate(),
  startTime: "",
  toDate: todayDate(),
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

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff !important",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow:
      "0px 1px 5px rgba(0, 0, 0, 0.05), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 5px rgba(0, 0, 0, 0.05)",
    fontSize: 11,
  },
}));

export default function MovementApplication() {
  const dispatch = useDispatch();
  const { userName, intProfileImageUrl, orgId, buId, employeeId, wgId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);
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
      setLoading
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  useEffect(() => {
    getPeopleDeskAllLanding(
      "EmployeeBasicById",
      orgId,
      buId,
      employee?.id ? employee?.id : employeeId,
      setOthersEmployee,
      null,
      setLoading
    );
  }, [employee?.id]);

  const saveHandler = (values, cb) => {
    const payload = {
      partId: singleData ? 2 : 1,
      movementId: singleData ? singleData?.MovementId : 0,
      intEmployeeId: employee ? employee?.id : employeeId,
      movementTypeId: values?.movementType?.value,
      fromDate: values.fromDate,
      toDate: values.toDate,
      fromTime: moment(values?.startTime, "HH:mm:ss").format("HH:mm:ss"),
      toTime: moment(values?.endTime, "HH:mm:ss").format("HH:mm:ss"),
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

  const getData = (values) => {
    const payload = {
      movementTypeId: "",
      applicationDate: "",
      fromDate: values?.movementFromDate || monthFirstDate(),
      toDate: values?.movementToDate || monthLastDate(),
      statusId: "",
      empId: employeeId,
    };

    getMovementApplicationFilter(
      "MovementApplication",
      orgId,
      buId,
      employeeId,
      payload,
      setRowDto,
      setAllData,
      setLoading
    );
  };

  useEffect(() => {
    getData();
  }, [orgId, buId]);

  const masterFilterHandler = ({
    movementType,
    fromDate,
    status,
    toDate,
    applicationDate,
  }) => {
    setAnchorEl(null);
    const payload = {
      movementTypeId: movementType.value || 0,
      applicationDate,
      fromDate,
      toDate,
      statusId: status?.value || 0,
      empId: employeeId || 0,
    };

    getMovementApplicationFilter(
      "MovementApplication",
      orgId,
      buId,
      employee?.id ? employee?.id : employeeId,
      payload,
      setRowDto,
      setAllData,
      setLoading
    );
  };

  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter((item) =>
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
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Self-Movement Application";
  }, []);

  const demoPopup = (data, values) => {
    let confirmObject = {
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
          fromTime: data?.FromTime,
          toTime: data?.ToTime,
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

  const columns = (values, setValues, page, paginationSize) => {
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
        dataIndex: "LeaveType",
        render: (_, record) => (
          <div className="d-flex align-items-center ">
            {/* <LightTooltip
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
            </LightTooltip> */}
            <span> {record?.MovementType}</span>
          </div>
        ),
        sorter: false,
        filter: false,
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
        title: "Location",
        dataIndex: "Location",
      },
      {
        title: "Reason",
        dataIndex: "Reason",
      },

      {
        title: "Status",
        dataIndex: "Status",
        render: (data, record) => (
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
        filter: false,
      },
    ];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setIsEdit(false);
            setSingleData("");
            getData(values);
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
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div ref={scrollRef} className="all-candidate">
                <div className="table-card" style={{ paddingTop: "44px" }}>
                  <div className="table-card-heading">
                    <div className="employeeInfo d-flex align-items-center">
                      {employee?.id ? (
                        <img
                          src={
                            othersEmployee?.[0]?.strProfileImageUrl
                              ? `${APIUrl}/Document/DownloadFile?id=${othersEmployee?.[0]?.strProfileImageUrl}`
                              : DemoImg
                          }
                          alt="Profile"
                          style={{
                            width: "40px",
                            height: "40px",
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
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      )}

                      <div className="employeeTitle ml-2">
                        <p className="employeeName">
                          {employee?.name ? employee?.name : userName}
                        </p>
                        <p className="employeePosition">
                          {employee.id
                            ? othersEmployee?.[0]?.DesignationName
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
                                  sx={{ marginRight: "10px", fontSize: "16px" }}
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
                                  employee?.id ? employee?.id : employeeId,
                                  setRowDto,
                                  setAllData,
                                  setLoading
                                );
                              }}
                            />
                          </li>
                        )}
                        {/* <li>
                          <MasterFilter
                            isHiddenFilter
                            width="200px"
                            inputWidth="200px"
                            value={values?.search}
                            setValue={(value) => {
                              setFieldValue("search", value);
                              searchData(value, allData, setRowDto);
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
                        </li> */}
                      </ul>
                    </div>
                  </div>
                  <div className="table-card-body">
                    <div className="leave-movement-FormCard col-md-12 pl-0 pr-0">
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
                        <div>
                          <MasterFilter
                            isHiddenFilter
                            styles={{ marginRight: "0px" }}
                            width="200px"
                            inputWidth="200px"
                            value={values?.search}
                            setValue={(value) => {
                              setFieldValue("search", value);
                              searchData(value, allData, setRowDto);
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
                                  empId: employeeId || 0,
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
                          columnsData={columns(
                            values,
                            setValues,
                            page,
                            paginationSize
                          )}
                          setPage={setPage}
                          setPaginationSize={setPaginationSize}
                        />
                      </div>
                    ) : (
                      <NoResult />
                    )}
                  </div>
                </div>
                <FilterModal
                  propsObj={{
                    id,
                    open,
                    anchorEl,
                    handleClose,
                    setEmployee,
                    setIsFilter,
                    masterFilterHandler,
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
