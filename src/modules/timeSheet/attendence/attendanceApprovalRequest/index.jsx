/* eslint-disable no-unused-vars */
import { MenuItem } from "@material-ui/core";
import {
  ArrowDropDown,
  EditOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Select, Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { APIUrl } from "../../../../App";
import DemoImg from "../../../../assets/images/bigDemo.png";
import DefaultInput from "../../../../common/DefaultInput";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import ResetButton from "../../../../common/ResetButton";
import { getPeopleDeskAllLanding } from "../../../../common/api";
import Loading from "../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray900, greenColor } from "../../../../utility/customColor";
import AddEditFormComponent from "./addEditForm";
import StyledTable from "./component/StyledTable";
import { getManualAttendanceApprovalList } from "./helper";
import { currentYear } from "./utilities/currentYear";
import { dateFormatterForInput } from "utility/dateFormatter";

const initData = {
  search: "",
  status: "",
  inputFieldType: null,
};

// status DDL
const statusDDL = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Process", label: "Process" },
  { value: "Rejected", label: "Rejected" },
];

export default function AttendanceApprovalRequest() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Attendance Adjust Request";
  }, []);

  const {
    orgId,
    buId,
    employeeId,
    intProfileImageUrl,
    userName,
    strDesignation,
  } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // open
  const [openModal, setOpenModal] = useState(false);

  // for create Modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // filter
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [selectTableData, setSelectedTableData] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [singleRowData, setSingleRowData] = useState("");
  const [isMulti, setIsMulti] = useState(false);
  const [ddlMonth, setDDLMonth] = useState("");
  const [ddlYear, setDDLYear] = useState("");

  let currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    getManualAttendanceApprovalList(
      "MonthlyAttendanceSummaryByEmployeeId",
      buId,
      employeeId,
      currentYear(),
      currentMonth,
      setLoading,
      setTableData
    );
  }, [buId, employeeId, currentMonth]);

  useEffect(() => {
    getPeopleDeskAllLanding(
      "EmployeeBasicShortInfoByEmployeeId",
      orgId,
      buId,
      employeeId,
      setSingleData,
      null,
      setLoading
    );
  }, [buId, employeeId, orgId]);

  // active & inactive filter
  const statusTypeFilter = (statusType) => {
    const modifyRowData = tableData?.filter(
      ({ ApplicationStatus }) => ApplicationStatus === statusType
    );
    setTableData(modifyRowData);
  };

  const allSelectHandler = (e) => {
    const checked = e.target.checked;
    const modifyRowDto = tableData?.map((item) => {
      if (
        item?.ApplicationStatus !== "Approved" &&
        item?.ApplicationStatus !== "Rejected"
      ) {
        item.selectCheckbox = checked;
      }
      return item;
    });
    setTableData(modifyRowDto);

    const filterRow = checked
      ? tableData?.filter(
          ({ ApplicationStatus }) =>
            ApplicationStatus === "Pending" || !ApplicationStatus
        )
      : [];
    setSelectedTableData(filterRow);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {
          //
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="table-card">
                <div className="table-card-heading pb-1 pr-0">
                  <div className="employeeInfo d-flex align-items-center  ml-lg-0 ml-md-4">
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
                    <div className="employeeTitle ml-2">
                      <p className="employeeName">{userName}</p>
                      <p className="employeePosition">{strDesignation}</p>
                    </div>
                  </div>
                  <div className="table-card-head-right">
                    {tableData?.filter((item) => item?.selectCheckbox).length >
                      0 && (
                      <div className="d-flex actionIcon mr-3">
                        <Tooltip title="Edit" arrow>
                          <button className="staticIconButton" type="button">
                            <EditOutlined
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenModal(true);
                                setIsMulti(true);
                              }}
                            />
                          </button>
                        </Tooltip>
                      </div>
                    )}
                    <ul className="d-flex flex-wrap">
                      {status && (
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
                              getManualAttendanceApprovalList(
                                "MonthlyAttendanceSummaryByEmployeeId",
                                buId,
                                employeeId,
                                currentYear(),
                                +values?.inputFieldType?.value || currentMonth,
                                setLoading,
                                setTableData
                              );
                              setStatus("");
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <Tooltip
                          title="Previous Month 26 to Current Month 25"
                          arrow
                        >
                          <button
                            style={{
                              height: "32px",
                              width: "160px",
                              fontSize: "12px",
                              padding: "0px 12px 0px 12px",
                            }}
                            className="btn btn-default ml-3"
                            type="button"
                            onClick={() => {
                              //
                              const currentDate = new Date();
                              // Get the current month and year
                              const currentMonth = currentDate.getMonth();
                              const currentYear = currentDate.getFullYear();
                              const previousMonth =
                                currentMonth === 0 ? 11 : currentMonth - 1;
                              const previousYear =
                                currentMonth === 0
                                  ? currentYear - 1
                                  : currentYear;

                              // Set the dates
                              const previousMonthDate = new Date(
                                previousYear,
                                previousMonth,
                                26
                              );
                              const currentMonthDate = new Date(
                                currentYear,
                                currentMonth,
                                25
                              );
                              // getManualAttendanceApprovalList(
                              //   "MonthlyAttendanceSummaryByEmployeeId",
                              //   buId,
                              //   employeeId,
                              //   e.target.value.split("-")[0],
                              //   e.target.value.split("-")[1],
                              //   setLoading,
                              //   setTableData
                              // );
                            }}
                          >
                            Custom [26 - 25]
                          </button>
                        </Tooltip>
                      </li>
                      <li>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.inputFieldType}
                          name="inputFieldType"
                          type="month"
                          inputClasses="input-sm"
                          className="form-control"
                          onChange={(e) => {
                            if (e.target.value)
                              getManualAttendanceApprovalList(
                                "MonthlyAttendanceSummaryByEmployeeId",
                                buId,
                                employeeId,
                                e.target.value.split("-")[0],
                                e.target.value.split("-")[1],
                                setLoading,
                                setTableData
                              );
                            setFieldValue("inputFieldType", e.target.value);
                            e.target.value
                              ? setDDLMonth(e.target.value.split("-")[1])
                              : setDDLMonth(null);
                            e.target.value
                              ? setDDLYear(e.target.value.split("-")[0])
                              : setDDLYear(null);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="table-card-body">
                  <div className="table-card-styled table-responsive tableOne">
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={{ width: "30px", textAlign: "center" }}>
                            SL
                          </th>
                          <th scope="col" style={{ width: "25px" }}>
                            <FormikCheckBox
                              styleobj={{
                                margin: "0 auto!important",
                                padding: "0 !important",
                                color: gray900,
                                checkedColor: greenColor,
                              }}
                              name="allSelected"
                              checked={
                                tableData?.length > 0
                                  ? tableData
                                      ?.filter(
                                        (item) =>
                                          item?.ApplicationStatus !==
                                            "Approved" &&
                                          item.ApplicationStatus !== "Rejected"
                                      )
                                      ?.every((item) => item?.selectCheckbox)
                                  : false
                              }
                              onChange={(e) => {
                                e.stopPropagation();
                                allSelectHandler(e);
                                setFieldValue("allSelected", e.target.checked);
                              }}
                            />
                          </th>
                          <th scope="col">Date</th>
                          <th>In-Time</th>
                          <th>Out-Time</th>
                          <th>Manual In-Time</th>
                          <th>Manual Out-Time</th>
                          <th className="text-center">Actual Attendence</th>
                          <th className="text-center">Request Attendence</th>
                          <th>Remarks</th>
                          <th>
                            <div className="d-flex align-items-center justify-content-center">
                              Approval Status
                              <span>
                                <Select
                                  sx={{
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      border: "none !important",
                                    },
                                    "& .MuiSelect-select": {
                                      paddingRight: "22px !important",
                                      marginTop: "-15px",
                                    },
                                  }}
                                  className="selectBtn"
                                  name="status"
                                  IconComponent={ArrowDropDown}
                                  value={values?.status}
                                  onChange={(e) => {
                                    setFieldValue("status", "");
                                    setStatus(e.target.value?.label);
                                    statusTypeFilter(e.target.value?.label);
                                  }}
                                >
                                  {statusDDL?.length > 0 &&
                                    statusDDL?.map((item, index) => {
                                      return (
                                        <MenuItem key={index} value={item}>
                                          {item?.label}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              </span>
                            </div>
                          </th>
                          <th style={{ width: "80px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        <StyledTable
                          tableData={tableData}
                          values={values}
                          errors={errors}
                          touched={touched}
                          setOpenModal={setOpenModal}
                          setFieldValue={setFieldValue}
                          setTableData={setTableData}
                          setSingleRowData={setSingleRowData}
                        ></StyledTable>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <AddEditFormComponent
                show={openModal}
                title="Request Attendance Change"
                onHide={handleCloseModal}
                size="lg"
                backdrop="static"
                classes="default-modal"
                id={id}
                setTableData={setTableData}
                setOpenModal={setOpenModal}
                singleRowData={singleRowData}
                tableData={tableData}
                isMulti={isMulti}
                setIsMulti={setIsMulti}
                ddlMonth={ddlMonth}
                ddlYear={ddlYear}
                selectTableData={selectTableData}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
