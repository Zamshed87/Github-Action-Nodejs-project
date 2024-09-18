/* eslint-disable no-unused-vars */
import {
  EditOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Tooltip } from "@mui/material";
import {
  getPeopleDeskAllDDL,
  getPeopleDeskAllDDLCustom,
  getPeopleDeskAllLanding,
  PeopleDeskSaasDDL,
} from "common/api";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";
import DemoImg from "assets/images/demo.png";
import * as Yup from "yup";
import {
  createLeaveEncashmentApplication,
  demoPopupForDeleteNew,
  getEmployeeLeaveEncashmentHistory,
} from "./helper";
import { getEmployeeLeaveBalanceAndHistory } from "../helper";
import IConfirmModal from "common/IConfirmModal";
import { dateFormatter, dateFormatterForInput } from "utility/dateFormatter";
import Chips from "common/Chips";
import Loading from "common/loading/Loading";
import { APIUrl } from "App";
import ResetButton from "common/ResetButton";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import { yearDDLAction } from "utility/yearDDL";
import LeaveEncashmentForm from "./encashmentForm/LeaveEncashmentForm";
import { gray500 } from "utility/customColor";
import AntTable from "common/AntTable";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import LeaveBalanceTable from "./components/LeaveBalanceTable";

const initData = {
  search: "",
  days: "",
  hour: "",
  mainBalance: "",
  carryBalance: "",
  applicationDate: todayDate(),
  year: { value: moment().year(), label: moment().year() },
};

const validationSchema = Yup.object().shape({
  // days: Yup.string().required("Encashment day is required"),
  applicationDate: Yup.string().required("Effective date is required"),
});
function LeaveEncashment() {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { userName, orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // states
  const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [leaveHistoryData, setLeaveHistoryData] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [leaveBalanceData, setLeaveBalanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [carry, setCarry] = useState("");
  const [carryHour, setCarryHour] = useState("");
  const [leaveTypeDDL, setLeaveTypeDDL] = useState([]);


  const getEmpInfoDetails = (empId) => {
    getPeopleDeskAllLanding(
      "EmployeeBasicById",
      orgId,
      buId,
      empId ? empId : employeeId,
      setEmployeeInfo,
      null,
      setLoading
    );
  };

  useEffect(() => {
    getEmpInfoDetails();
    getPeopleDeskAllDDLCustom(
      `/Employee/EmployeeListBySupervisorORLineManagerNOfficeadmin?EmployeeId=${employeeId}&WorkplaceGroupId=${wgId}&businessUnitId=${buId}`,
      "intEmployeeBasicInfoId",
      "strEmployeeCode",
      setEmployeeDDL
    );
  }, [wgId]);


  const getData = (empId, year) => {
    getEmployeeLeaveBalanceAndHistory(
      empId ? empId : employeeId,
      "LeaveBalance",
      setLeaveBalanceData,
      setLoading,
      "",
      year,
      buId,
      wgId
    );
    PeopleDeskSaasDDL(
      "EmployeeLeaveType",
      wgId,
      buId,
      setLeaveTypeDDL,
      "LeaveTypeId",
      "LeaveType",
      empId ? empId : employeeId,
      0,
      year
    );
    getEmployeeLeaveEncashmentHistory(
      empId ? empId : employeeId,
      orgId,
      setLeaveHistoryData,
      setLoading,
      setAllData,
      year
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const demoPopup = (action, values, cb) => {
    const callback = () => {
      getData(values?.employee?.value, values?.year?.value);
      setSingleData("");
      setIsEdit(false);
      cb();
    };
    const payload = {
      intEncashmentId: singleData ? singleData?.intEncashmentId || 0 : 0,
      intEmployeeId: values?.employee ? values?.employee?.value : employeeId,
      intAccountId: orgId,
      intBusinessUnitId: buId,
      dteEffectiveDate: values?.applicationDate,
      IntEncashmentDays: +values?.days || 0,
      isActive: true,
      intCreatedBy: employeeId,
      intUpdatedBy: employeeId || 0,
      dteCreatedAt: new Date(),
      intLeaveTypeId: values?.leaveType?.value || 0,
      intMainBalanceEncashmentDays: values?.mainBalance || 0,
      intCarryBalanceEncashmentDays: values?.carryBalance || 0,
    };
    let confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action} ?`,
      yesAlertFunc: () => {
        if (values?.employee) {
          createLeaveEncashmentApplication(payload, setLoading, callback);
        } else {
          createLeaveEncashmentApplication(payload, setLoading, callback);
        }
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const saveHandler = (values, cb) => {
    demoPopup("Apply", values, cb);
  };

  const searchData = (keywords, allData, setLeaveHistoryData) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter((item) => regex.test(item?.inDays));
      setLeaveHistoryData(newDta);
    } catch {
      setLeaveHistoryData([]);
    }
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30430) {
      permission = item;
    }
  });
  const demoPopupForDelete = (item, values) => {
    console.log("item", item);

    const callback = () => {
      getData(values?.employee?.value, values?.year?.value);
    };

    let confirmObject = {
      closeOnClickOutside: false,
      message: "Are you want to sure you delete your leave?",
      yesAlertFunc: () => {
        const id = item?.intEncashmentId;
        demoPopupForDeleteNew(callback, setLoading, id);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const columns = (setValues, values) => {
    return [
      {
        title: "SL",
        render: (text, record, index) => index + 1,
        sorter: false,
        filter: false,
        className: "text-center",
      },
      {
        title: "Employee Id",
        dataIndex: "strEmployeeCode",
        sorter: false,
        filter: false,
        className: "text-center",
      },
      {
        title: "Employee Name",
        dataIndex: "employeeName",
        sorter: false,
        filter: false,
        className: "text-center",
      },
      {
        title: "Designation",
        dataIndex: "designationName",
        sorter: false,
        filter: false,
        className: "text-center",
      },
      {
        title: "Department",
        dataIndex: "departmentName",
        sorter: false,
        filter: false,
        className: "text-center",
      },
      {
        title: "Main Encashment Days",
        dataIndex: "intMainBalanceEncashmentDays",
        render: (data, record) => (
          <div>{record?.intMainBalanceEncashmentDays?.toFixed(2) || 0} </div>
        ),
        sorter: false,
        filter: false,
        isNumber: true,
      },
      {
        title: "Carry Encashment Days",
        dataIndex: "intCarryBalanceEncashmentDays",
        render: (data, record) => (
          <div>{record?.intCarryBalanceEncashmentDays?.toFixed(2) || 0} </div>
        ),
        sorter: false,
        filter: false,
        isNumber: true,
      },
      {
        title: "Amount",
        dataIndex: "numEncashmentAmount",
        sorter: true,
        filter: false,
        isNumber: true,
      },
      {
        title: "Effective Date",
        dataIndex: "dteEffectiveDate",
        render: (dteEffectiveDate) => dateFormatter(dteEffectiveDate),
        sorter: false,
        filter: false,
      },
      {
        // className: "text-center",
        title: "Status",
        dataIndex: "strStatus",
        render: (data, record) => (
          <div>
            {data === "Approved" && <Chips label={data} classess="success" />}
            {data === "Pending" && <Chips label={data} classess="warning" />}
            {data === "Rejected" && <Chips label={data} classess="danger" />}
            {data === "Process" && <Chips label={data} classess="primary" />}
          </div>
        ),
        sorter: true,
        filter: true,
      },
      {
        className: "text-center",
        render: (data, record) => (
          <div className="d-flex justify-content-center">
            {record?.strStatus === "Pending" && (
              <Tooltip title="Edit" arrow>
                <button className="iconButton" type="button">
                  <EditOutlined
                    onClick={(e) => {
                      setIsEdit(true);
                      e.stopPropagation();
                      scrollRef.current.scrollIntoView({
                        behavior: "smooth",
                      });
                      setSingleData(record);
                      console.log("record", record);
                      setValues({
                        ...values,
                        applicationDate: dateFormatterForInput(
                          record?.dteEffectiveDate
                        ),
                        days: record?.intEncashmentDays,
                        hour: (record?.intEncashmentDays * 8)?.toFixed(2) || 0,
                      });
                    }}
                  />
                </button>
              </Tooltip>
            )}
            {record?.strStatus === "Pending" && (
              <Tooltip title="Delete" arrow>
                <button type="button" className="iconButton">
                  <DeleteOutlineOutlinedIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      setSingleData("");
                      demoPopupForDelete(data, values);
                    }}
                  />
                </button>
              </Tooltip>
            )}
          </div>
        ),
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
            value: employeeInfo?.[0]?.EmployeeId || employeeId,
            label: employeeInfo?.[0]?.EmployeeCode,
          },
        }}
        validationSchema={validationSchema}
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
          setValues,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {loading && <Loading />}
            <Form onSubmit={handleSubmit}>
              {permission?.isCreate ? (
                <div className="table-card">
                  <div ref={scrollRef} className="table-card-heading pb-1 pr-0">
                    <div className="employeeInfo d-flex align-items-center  ml-lg-0 ml-md-4">
                      {employeeInfo?.[0]?.strProfileImageUrl ? (
                        <img
                          src={
                            employeeInfo?.[0]?.strProfileImageUrl
                              ? `${APIUrl}/Document/DownloadFile?id=${employeeInfo?.[0]?.strProfileImageUrl}`
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
                          src={DemoImg}
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
                          {employeeInfo?.[0]?.EmployeeName
                            ? employeeInfo?.[0]?.EmployeeName
                            : userName}
                        </p>
                        <p className="employeePosition">
                          {employeeInfo?.[0]?.DesignationName}
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
                                setIsFilter(false);
                                setFieldValue("search", "");
                                getData();
                                resetForm();
                              }}
                            />
                          </li>
                        )}
                        <li>
                          <div
                            style={{ width: "200px" }}
                            className="input-field-main"
                          >
                            <FormikSelect
                              isClearable={false}
                              menuPosition="fixed"
                              name="employee"
                              options={employeeDDL || []}
                              value={values?.employee}
                              onChange={(valueOption) => {
                                setIsEdit(false);
                                setSingleData("");
                                setFieldValue("employee", valueOption);
                                setFieldValue("leaveType", "");
                                getEmpInfoDetails(valueOption?.value);
                                setLeaveHistoryData([]);
                                setLeaveBalanceData([]);
                                getData(
                                  valueOption?.value,
                                  values?.year?.value
                                );
                              }}
                              styles={customStyles}
                              placeholder=""
                            />
                          </div>
                        </li>
                        <li>
                          <div
                            className="input-field-main"
                            style={{ width: "200px" }}
                          >
                            <FormikSelect
                              name="year"
                              options={yearDDLAction(5, 10) || []}
                              value={values?.year}
                              onChange={(valueOption) => {
                                setIsEdit(false);
                                setSingleData("");
                                setFieldValue("year", valueOption);
                                getData(
                                  values?.employee?.value,
                                  valueOption?.value
                                );
                              }}
                              isClearable={false}
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-10 leave-movement-FormCard">
                      <LeaveEncashmentForm
                        propsObj={{
                          singleData,
                          handleSubmit,
                          initData,
                          resetForm,
                          values,
                          setValues,
                          errors,
                          touched,
                          setFieldValue,
                          isValid,
                          setLeaveHistoryData,
                          isEdit,
                          setIsEdit,
                          setSingleData,
                          setLoading,
                          loading,
                          carry,
                          carryHour,
                          leaveTypeDDL,
                        }}
                      />
                    </div>
                    <div className="col-lg-6 col-md-10 leave-movement-FormCard">
                      <LeaveBalanceTable
                        leaveBalanceData={leaveBalanceData}
                        setCarry={setCarry}
                        setCarryHour={setCarryHour}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 my-3">
                      <div className="table-card-body pl-lg-1 pl-md-3">
                        <div>
                          <div className="d-flex align-items-center justify-content-between">
                            <h2 style={{ color: gray500, fontSize: "14px" }}>
                              Leave Encashment List
                            </h2>
                          </div>
                        </div>

                        <div
                          className="table-card-styled table-responsive tableOne mt-2"
                          style={{ minHeight: "190px" }}
                        >
                          {leaveHistoryData?.length > 0 ? (
                            <AntTable
                              data={leaveHistoryData}
                              columnsData={columns(setValues, values)}
                              onRowClick={(item) => {
                                setSingleData(item);
                              }}
                              removePagination
                            />
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
                  </div>
                </div>
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
export default LeaveEncashment;
