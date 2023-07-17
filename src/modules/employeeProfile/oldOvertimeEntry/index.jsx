import {
  AddOutlined,
  DeleteOutline,
  EditOutlined,
  InfoOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import AvatarComponent from "../../../common/AvatarComponent";
import FilterBadgeComponent from "../../../common/FilterBadgeComponent";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PopOverMasterFilter from "../../../common/PopoverMasterFilter";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter, monthFirstDate } from "../../../utility/dateFormatter";
import { timeFormatter } from "../../../utility/timeFormatter";
import OvertimeFilterModal from "./component/OvertimeFilterModal";
import { getOvertimeLandingData, overtimeEntry_API } from "./helper";
import Chips from "../../../common/Chips";
import IConfirmModal from "../../../common/IConfirmModal";
import AntTable from "../../../common/AntTable";
import NoResult from "../../../common/NoResult";
import { todayDate } from "../../../utility/todayDate";
import { getPeopleDeskAllDDL } from "../../../common/api";
import FormikSelect from "../../../common/FormikSelect";
import { customStyles } from "../../../utility/newSelectCustomStyle";
import DefaultInput from "../../../common/DefaultInput";
import { LightTooltip } from "../LoanApplication/helper";
import { numberWithCommas } from "../../../utility/numberWithCommas";

const initData = {
  search: "",
  workplaceGroup: "",
  employee: "",
  designation: "",
  department: "",
  date: "",
  status: "",
  filterFromDate: monthFirstDate(),
  filterToDate: todayDate(),
};

export default function EmOvertimeEntry() {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // state
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [isFilter, setIsFilter] = useState(false);

  // filter
  const [status, setStatus] = useState("");
  const [empDDL, setEmpDDL] = useState([]);

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getData = (values) => {
    getOvertimeLandingData(
      {
        strPartName: "Overtime",
        status: values?.status?.label || "All",
        departmentId: values?.department?.value || 0,
        designationId: values?.designation?.value || 0,
        supervisorId: 0,
        employeeId: values?.employee?.value || 0,
        workplaceGroupId: values?.workplaceGroup?.value || 0,
        businessUnitId: buId,
        loggedEmployeeId: employeeId,
        formDate: values?.filterFromDate || monthFirstDate(),
        toDate: values?.filterToDate || todayDate(),
      },
      setRowDto,
      setLoading,
      () => { }
    );
  };

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfo&BusinessUnitId=${buId}&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
      "EmployeeId",
      "EmployeeName",
      setEmpDDL
    );
  }, [wgId, buId, employeeId]);

  useEffect(() => {
    getOvertimeLandingData(
      {
        strPartName: "Overtime",
        status: "All",
        departmentId: 0,
        designationId: 0,
        supervisorId: 0,
        employeeId: 0,
        workplaceGroupId: 0,
        businessUnitId: buId,
        loggedEmployeeId: employeeId,
        formDate: monthFirstDate(),
        toDate: todayDate(),
      },
      setRowDto,
      setLoading,
      () => { }
    );
  }, [buId, employeeId]);

  const saveHandler = (values) => {
    const payload = {
      strPartName: "Overtime",
      status: "All",
      departmentId: 0,
      designationId: 0,
      supervisorId: 0,
      employeeId: values?.employee?.value || 0,
      workplaceGroupId: 0,
      businessUnitId: buId,
      loggedEmployeeId: employeeId,
      formDate: values?.filterFromDate,
      toDate: values?.filterToDate,
    };
    getOvertimeLandingData(payload, setRowDto, setLoading, () => { });
  };

  // Advanced Filter
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const openFilter = Boolean(filterAnchorEl);
  const id = openFilter ? "simple-popover" : undefined;
  const handleSearch = (values) => {
    getData(values);
    setFilterBages(values);
    setfilterAnchorEl(null);
  };
  const clearFilter = () => {
    setFilterBages({});
    setFilterValues("");
    getData();
  };
  const clearBadge = (values, name) => {
    const data = values;
    data[name] = "";
    setFilterBages(data);
    setFilterValues(data);
    handleSearch(data);
  };
  const getFilterValues = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30333) {
      permission = item;
    }
  });

  const deleteHandler = (item) => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to delete ?`,
      yesAlertFunc: () => {
        const callback = () => {
          getOvertimeLandingData(
            {
              strPartName: "Overtime",
              status: "All",
              departmentId: 0,
              designationId: 0,
              supervisorId: 0,
              employeeId: 0,
              workplaceGroupId: 0,
              businessUnitId: buId,
              loggedEmployeeId: 0,
              formDate: monthFirstDate(),
              toDate: todayDate(),
            },
            setRowDto,
            setLoading,
            () => { }
          );
        };
        let payload = {
          partType: "Overtime",
          employeeId: item?.EmployeeId,
          autoId: item?.OvertimeId,
          isActive: false,
          businessUnitId: buId,
          accountId: orgId,
          startTime: item?.startTime || null,
          endTime: item?.endTime || null,
          workplaceId: 0,
          overtimeDate: item?.date,
          overtimeHour: +item?.overTimeHour,
          reason: item?.reason,
          intCreatedBy: employeeId,
        };
        overtimeEntry_API(payload, setLoading, callback);
      },
      noAlertFunc: () => { },
    };
    IConfirmModal(confirmObject);
  };

  const columns = [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee Id",
      dataIndex: "EmployeeCode",
      sorter: true,
      filter: true,
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      render: (_, data) => (
        <div className="d-flex align-items-center">
          <AvatarComponent
            classess=""
            letterCount={1}
            label={data?.EmployeeName}
          />
          <span className="ml-2">{data?.EmployeeName}</span>
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Designation",
      dataIndex: "DesignationName",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "DepartmentName",
      sorter: true,
      filter: true,
    },
    {
      title: "Overtime Date",
      dataIndex: "OvertimeDate",
      render: (data) => dateFormatter(data),
      sorter: false,
      filter: false,
      isDate: true,
    },
    {
      title: "Start Time",
      dataIndex: "StartTime",
      render: (data) => <div>{data && timeFormatter(data)}</div>,
      filter: false,
      sorter: false,
    },
    {
      title: "End Time",
      dataIndex: "EndTime",
      render: (data) => <div>{data && timeFormatter(data)}</div>,
      filter: false,
      sorter: false,
    },
    {
      title: "Hours",
      // dataIndex: "OvertimeHour",
      render: (_, record) => (
        <div className="d-flex align-items-center">
          <LightTooltip
            title={
              <div className="movement-tooltip p-2">
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                    className="tooltip-title"
                  >
                    Reason
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                    className="tooltip-subTitle"
                  >
                    {record?.Reason}
                  </p>
                </div>
              </div>
            }
            arrow
          >
            <InfoOutlined
              sx={{ marginRight: "12px", color: "rgba(0, 0, 0, 0.6)" }}
            />
          </LightTooltip>
          <div>{record?.OvertimeHour}</div>
        </div>
      ),
      filter: false,
      sorter: false,
      isDate: true,
    },
    {
      title: "Amount",
      dataIndex: "TotalAmount",
      className: "text-right",
      render: (_, record) => (
        <p className="text-right">{numberWithCommas(record?.TotalAmount)}</p>
      ),
      filter: false,
      sorter: false,
    },
    {
      title: "Status",
      dataIndex: "ApprovalStatus",
      render: (_, record) => (
        <>
          {record?.ApprovalStatus === "Approve" && (
            <Chips label="Approved" classess="success" />
          )}
          {record?.ApprovalStatus === "Pending" && (
            <Chips label="Pending" classess="warning" />
          )}
          {record?.ApprovalStatus === "Reject" && (
            <Chips label="Rejected" classess="danger" />
          )}
        </>
      ),
      filter: false,
      sorter: true,
    },
    {
      // title: "",
      dataIndex: "ApprovalStatus",
      render: (_, record) => (
        <>
          {" "}
          {record?.ApprovalStatus === "Pending" && (
            <div className="d-flex">
              <Tooltip title="Edit" arrow>
                <button type="button" className="iconButton">
                  <EditOutlined
                    sx={{ fontSize: "20px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!permission?.isEdit)
                        return toast.warn("You don't have permission");
                      history.push({
                        pathname: `/profile/overTime/manualEntry/edit/${record?.OvertimeId}`,
                        state: record,
                      });
                    }}
                  />
                </button>
              </Tooltip>
              <Tooltip title="Delete" arrow>
                <button className="iconButton">
                  <DeleteOutline
                    sx={{ fontSize: "20px" }}
                    onClick={(e) => {
                      if (!permission?.isClose)
                        return toast.warn("You don't have permission");
                      deleteHandler(record);
                    }}
                  />
                </button>
              </Tooltip>
            </div>
          )}
        </>
      ),
      filter: false,
      sorter: false,
    },
  ];

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
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
          isValid,
          dirty,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <>
                  <div className="table-card">
                    <div
                      className="table-card-heading"
                      style={{ marginBottom: "2px" }}
                    >
                      <div className="d-flex align-items-center">
                        {rowDto?.length > 0 ? (
                          <h6 className="count">
                            Total {rowDto?.length} employees
                          </h6>
                        ) : (
                          <>
                            <h6 className="count">Total result 0</h6>
                          </>
                        )}
                      </div>
                      <ul className="d-flex flex-wrap">
                        {(isFilter || status) && (
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
                                setIsFilter(false);
                                setFieldValue("search", "");
                                setStatus("");
                                getData();
                              }}
                            />
                          </li>
                        )}
                        <li>
                          <PrimaryButton
                            type="button"
                            className="btn btn-default flex-center"
                            label={"Entry Overtime"}
                            icon={
                              <AddOutlined
                                sx={{
                                  marginRight: "0px",
                                  fontSize: "15px",
                                }}
                              />
                            }
                            onClick={() => {
                              if (!permission?.isCreate)
                                return toast.warn("You don't have permission");
                              history.push(
                                `/profile/overTime/manualEntry/create`
                              );
                            }}
                          />
                        </li>
                      </ul>
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
                      <div className="card-style with-form-card pb-0 my-3 ">
                        <div className="row">
                          <div className="input-field-main  col-lg-3">
                            <label>From Date</label>
                            <DefaultInput
                              classes="input-sm"
                              value={values?.filterFromDate}
                              name="filterFromDate"
                              type="date"
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue("filterFromDate", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="input-field-main col-lg-3">
                            <label>To Date</label>
                            <DefaultInput
                              classes="input-sm"
                              value={values?.filterToDate}
                              name="filterToDate"
                              type="date"
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue("filterToDate", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="input-field-main col-lg-3">
                            <label>Employee</label>
                            <FormikSelect
                              classes="input-sm"
                              name="employee"
                              options={empDDL || []}
                              value={values?.employee}
                              onChange={(valueOption) => {
                                setFieldValue("employee", valueOption);
                              }}
                              placeholder=" "
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                              menuPosition="fixed"
                            />
                          </div>
                          <div
                            style={{ marginTop: "24px" }}
                            className="col-lg-3"
                          >
                            <PrimaryButton
                              type="submit"
                              className="btn btn-green flex-center"
                              label={"View"}
                            />
                          </div>
                        </div>
                      </div>
                      {rowDto?.length > 0 ? (
                        <div className="table-card-styled tableOne table-responsive">
                          <AntTable data={rowDto} columnsData={columns} />
                        </div>
                      ) : (
                        <NoResult />
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <NotPermittedPage />
              )}
            </Form>

            {/* filter */}
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
              <OvertimeFilterModal
                propsObj={{
                  getFilterValues,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                }}
              ></OvertimeFilterModal>
            </PopOverMasterFilter>
          </>
        )}
      </Formik>
    </>
  );
}
