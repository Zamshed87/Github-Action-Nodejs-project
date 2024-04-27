/* eslint-disable react-hooks/exhaustive-deps */
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import DefaultInput from "../../../../common/DefaultInput";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../../utility/customColor";

import { Avatar, DataTable } from "Components";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import FormikSelect from "common/FormikSelect";
import { getPeopleDeskAllDDL, getWorkplaceDetails } from "common/api";
import { toast } from "react-toastify";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { getPDFAction } from "utility/downloadFile";
import { customStyles } from "utility/selectCustomStyle";
import { convertTo12HourFormat } from "utility/timeFormatter";
import MasterFilter from "../../../../common/MasterFilter";
import { paginationSize } from "../../../../common/peopleDeskTable";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { todayDate } from "../../../../utility/todayDate";
import {
  column,
  getTableDataDailyAttendance,
  getTableDataSummaryHeadData,
  subHeaderColumn,
} from "./helper";

const initialValues = {
  businessUnit: "",
  date: todayDate(),
  workplaceGroup: "",
  workplace: "",
  search: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.date().required("Date is required").typeError("Date is required"),
});
const initHeaderList = {
  calenderList: [],
  designationList: [],
  departmentList: [],
  sectionList: [],
  hrPositionList: [],
  actualStatusList: [],
  manualStatusList: [],
};

const MgmtDailyAttendance = () => {
  // redux
  const dispatch = useDispatch();
  const landingApi = useApiRequest({});

  const { buId, wgId, wId, orgId, employeeId, buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // states
  const [filterList, setFilterList] = useState({});

  const [loading, setLoading] = useState(false);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [buDetails, setBuDetails] = useState({});
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const debounce = useDebounce();

  //  menu permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30327) {
      permission = item;
    }
  });

  const landingApiCall = ({
    pagination = { current: 1, pageSize: paginationSize },
    filerList,
    searchText = "",
    IsForXl = false,
    date = todayDate(),
  }) => {
    const payload = {
      intBusinessUnitId: buId,
      intWorkplaceGroupId: values?.workplaceGroup?.value || 0,

      intWorkplaceId: values?.workplace?.value || 0,
      pageNo: pagination?.current,
      pageSize: pagination?.pageSize,
      isPaginated: true,
      isHeaderNeed: true,
      searchTxt: searchText || "",
      isXls: IsForXl || false,
      attendanceDate: values?.date || date,

      departmentList: filerList?.department || [],
      calenderList: filerList?.calender || [],
      actualStatusList: filerList?.actualStatus || [],
      designationList: filerList?.designation || [],
      hrPositionList: filerList?.hrPosition || [],
      manualStatusList: filerList?.manualStatus || [],
      sectionList: filerList?.section || [],
    };
    landingApi.action({
      urlKey: "GetDateWiseAttendanceReport",
      method: "POST",
      payload: payload,
    });
  };

  useEffect(() => {
    getWorkplaceDetails(wId, setBuDetails);
    landingApiCall(pages);
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
  }, [wId]);

  // formik
  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues,
    onSubmit: () => {
      landingApiCall({ pagination: { current: 1, pageSize: paginationSize } });

      setFieldValue("search", "");
    },
  });

  //set to module
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Daily Attendance Report";
  }, []);

  const header = [
    {
      title: "SL",
      render: (_, rec, index) =>
        getSerial({
          currentPage: landingApi?.data?.currentPage,
          pageSize: landingApi?.data?.pageSize,
          index,
        }),
      fixed: "left",
      width: 15,
      align: "center",
    },

    {
      title: "Work. Group/Location",
      dataIndex: "workplaceGroup",
      width: 60,
      fixed: "left",
    },
    {
      title: "Workplace/Concern",
      dataIndex: "workplace",
      width: 55,
      fixed: "left",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      width: 55,
      fixed: "left",
    },

    {
      title: "Employee Name",
      dataIndex: "employeeName",
      render: (_, rec) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.employeeName} />
            <span className="ml-2">{rec?.employeeName}</span>
          </div>
        );
      },
      sorter: true,
      fixed: "left",
      width: 50,
    },

    {
      title: "Designation",
      dataIndex: "designation",
      sorter: true,
      filter: true,
      filterKey: "designationList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: true,
      filter: true,
      filterKey: "departmentList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Section",
      dataIndex: "section",
      sorter: true,
      filter: true,
      filterKey: "sectionList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "HR Position",
      dataIndex: "hrPosition",
      sorter: true,
      filter: true,
      filterKey: "hrPositionList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Employment Type",
      dataIndex: "employmentType",
      width: 55,
    },
    {
      title: "Calendar Name",
      dataIndex: "calender",
      sorter: true,
      filter: true,
      filterKey: "calenderList",
      filterSearch: true,
      width: 50,
    },

    {
      title: "In Time",
      dataIndex: "inTime",
      render: (_, rec) => {
        rec?.inTime ? convertTo12HourFormat(rec?.inTime) : "N/A";
      },
      width: 35,
    },
    {
      title: "Out Time",
      dataIndex: "outTime",
      render: (_, rec) => {
        rec?.outTime ? convertTo12HourFormat(rec?.outTime) : "N/A";
      },
      width: 35,
    },
    {
      title: "Duration",
      dataIndex: "dutyHours",
      render: (_, rec) => rec?.dutyHours,
      width: 35,
    },
    {
      title: "Status",
      dataIndex: "actualStatus",
      filter: true,
      filterKey: "actualStatusList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Manual Status",
      dataIndex: "manualStatus",
      filter: true,
      filterKey: "manualStatusList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Address",
      dataIndex: "location",

      width: 35,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",

      width: 35,
    },
  ];
  {
    console.log({ landingApi });
  }

  return (
    <form onSubmit={handleSubmit}>
      {landingApi?.loading && <Loading />}
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading mt-2 pt-1">
            <div className="d-flex align-items-center">
              <h2 className="ml-1">Daily Attendance Report</h2>
            </div>
            <div className="table-header-right">
              <ul className="d-flex flex-wrap"></ul>
            </div>
          </div>
          <div className="table-card-body" style={{ marginTop: "12px" }}>
            <div className="card-style" style={{ margin: "14px 0px 12px 0px" }}>
              <div className="row">
                {/* bu */}
                <div className="col-lg-2">
                  <div className="input-field-main">
                    <label>Date</label>
                    <DefaultInput
                      classes="input-sm"
                      placeholder=""
                      value={values?.date}
                      name="date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                      }}
                      // min={values?.date}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Workplace Group</label>
                    <FormikSelect
                      name="workplaceGroup"
                      options={[...workplaceGroupDDL] || []}
                      value={values?.workplaceGroup}
                      onChange={(valueOption) => {
                        setWorkplaceDDL([]);
                        setFieldValue("workplaceGroup", valueOption);
                        setFieldValue("workplace", "");
                        if (valueOption?.value) {
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
                            "intWorkplaceId",
                            "strWorkplace",
                            setWorkplaceDDL
                          );
                        }
                      }}
                      placeholder=""
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Workplace</label>
                    <FormikSelect
                      name="workplace"
                      options={[...workplaceDDL] || []}
                      value={values?.workplace}
                      onChange={(valueOption) => {
                        setFieldValue("workplace", valueOption);
                        getWorkplaceDetails(valueOption?.value, setBuDetails);
                      }}
                      placeholder=""
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="col-lg-3 mt-3 pt-2">
                  <button
                    className="btn btn-green btn-green-disable"
                    type="submit"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            {landingApi?.data?.data?.length > 0 ? (
              <div>
                <div className="d-flex justify-content-between">
                  <div>
                    <h2
                      style={{
                        color: gray500,
                        fontSize: "14px",
                        margin: "12px 0px 10px 0px",
                      }}
                    >
                      Daily Attendance Report
                    </h2>
                  </div>

                  <div>
                    <ul className="d-flex flex-wrap">
                      {landingApi?.data?.data?.length > 0 && (
                        <>
                          <li className="pr-2">
                            <Tooltip title="Export CSV" arrow>
                              <IconButton
                                style={{ color: "#101828" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const excelLanding = async () => {
                                    try {
                                      if (landingApi?.data?.data?.length > 0) {
                                        const newData =
                                          landingApi?.data?.data?.map(
                                            (item, index) => {
                                              return {
                                                ...item,
                                                sl: index + 1,
                                              };
                                            }
                                          );
                                        // const date = todayDate();

                                        createCommonExcelFile({
                                          titleWithDate: `Daily Attendance ${values?.date} `,
                                          fromDate: "",
                                          toDate: "",
                                          buAddress: buDetails?.strAddress,
                                          businessUnit: values?.workplaceGroup
                                            ?.value
                                            ? buDetails?.strWorkplace
                                            : buName,
                                          tableHeader: column,
                                          getTableData: () =>
                                            getTableDataDailyAttendance(
                                              newData,
                                              Object.keys(column),
                                              landingApi?.data?.data
                                            ),
                                          getSubTableData: () =>
                                            getTableDataSummaryHeadData(
                                              landingApi?.data
                                            ),
                                          subHeaderInfoArr: [
                                            landingApi?.data?.workplaceGroup
                                              ? `Workplace Group-${landingApi?.data?.data?.workplaceGroup}`
                                              : "",
                                            landingApi?.data?.workplace
                                              ? `Workplace-${landingApi?.data?.data?.workplace}`
                                              : "",
                                          ],
                                          subHeaderColumn,
                                          tableFooter: [],
                                          extraInfo: {},
                                          tableHeadFontSize: 10,
                                          widthList: {
                                            B: 30,
                                            C: 30,
                                            D: 15,
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
                                        setLoading && setLoading(false);
                                      } else {
                                        setLoading && setLoading(false);
                                        toast.warn("Empty Employee Data");
                                      }
                                    } catch (error) {
                                      toast.warn("Failed to download excel");
                                      setLoading && setLoading(false);
                                    }
                                  };
                                  excelLanding();
                                }}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </li>
                          <li className="pr-2 ">
                            <Tooltip title="Print" arrow>
                              <IconButton
                                style={{ color: "#101828" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const list = landingApi?.data?.data?.map(
                                    (item) => item?.employeeId
                                  );
                                  getPDFAction(
                                    `/PdfAndExcelReport/DailyAttendanceReportPDF?IntAccountId=${orgId}&AttendanceDate=${
                                      values?.date
                                    }${
                                      buId ? `&IntBusinessUnitId=${buId}` : ""
                                    }${
                                      wgId
                                        ? `&IntWorkplaceGroupId=${
                                            values?.workplaceGroup?.value ||
                                            wgId
                                          }`
                                        : ""
                                    }${
                                      landingApi?.data?.data?.length !==
                                      landingApi?.data?.totalCount
                                        ? `&EmployeeIdList=${list}`
                                        : ""
                                    }${
                                      wId
                                        ? `&IntWorkplaceId=${
                                            values?.workplace?.value || wId
                                          }`
                                        : ""
                                    }`,
                                    setLoading
                                  );
                                }}
                              >
                                <LocalPrintshopIcon />
                              </IconButton>
                            </Tooltip>
                          </li>
                        </>
                      )}
                      {values?.search && (
                        <li className="pt-1">
                          <ResetButton
                            classes="btn-filter-reset"
                            title="Reset"
                            icon={<SettingsBackupRestoreOutlined />}
                            onClick={() => {
                              landingApiCall({
                                pagination: {
                                  current: 1,
                                  pageSize: paginationSize,
                                },
                              });

                              setFieldValue("search", "");
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <MasterFilter
                          isHiddenFilter
                          styles={{
                            marginRight: "10px",
                          }}
                          inputWidth="200px"
                          width="200px"
                          value={values?.search}
                          setValue={(value) => {
                            setFieldValue("search", value);
                            debounce(() => {
                              landingApiCall({
                                pagination: {
                                  current: 1,
                                  pageSize: paginationSize,
                                },
                                searchText: value,
                              });
                            }, 500);
                          }}
                          cancelHandler={() => {
                            setFieldValue("search", "");
                            landingApiCall({
                              pagination: {
                                current: 1,
                                pageSize: paginationSize,
                              },
                              searchText: "",
                            });
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  style={{ marginLeft: "-7px" }}
                  className=" d-flex justify-content-between align-items-center my-2"
                >
                  <div className="d-flex align-items-center">
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      Total Employee:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {landingApi?.data?.totalEmployee || 0}
                    </Typography>
                  </div>
                  <div className="d-flex align-items-center">
                    <Typography
                      fontWeight={500}
                      className="ml-3"
                      fontSize={"12px"}
                    >
                      Present:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {landingApi?.data?.presentCount || 0}
                    </Typography>
                  </div>
                  <div className="d-flex align-items-center">
                    <Typography
                      fontWeight={500}
                      className="ml-3"
                      fontSize={"12px"}
                    >
                      Absent:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {landingApi?.data?.absentCount || 0}
                    </Typography>
                  </div>
                  <div className="d-flex align-items-center ">
                    <Typography
                      fontWeight={500}
                      className="ml-3"
                      fontSize={"12px"}
                    >
                      Late:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {landingApi?.data?.lateCount || 0}
                    </Typography>
                  </div>
                  <div className="d-flex align-items-center ">
                    <Typography
                      fontWeight={500}
                      className="ml-3"
                      fontSize={"12px"}
                    >
                      Leave:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {landingApi?.data?.leaveCount || 0}
                    </Typography>
                  </div>
                  <div className="d-flex align-items-center ">
                    <Typography
                      fontWeight={500}
                      className="ml-3"
                      fontSize={"12px"}
                    >
                      Movement:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {landingApi?.data?.movementCount || 0}
                    </Typography>
                  </div>
                  <div className="d-flex align-items-center ">
                    <Typography
                      fontWeight={500}
                      className="ml-3"
                      fontSize={"12px"}
                    >
                      Weekend:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {landingApi?.data?.weekendCount || 0}
                    </Typography>
                  </div>
                  <div className="d-flex align-items-center ">
                    <Typography
                      fontWeight={500}
                      className="ml-3"
                      fontSize={"12px"}
                    >
                      Holiday:
                    </Typography>
                    <Typography
                      fontWeight={500}
                      className="ml-2"
                      fontSize={"12px"}
                    >
                      {landingApi?.data?.holidayCount || 0}
                    </Typography>
                  </div>
                </div>
                <div>
                  <DataTable
                    bordered
                    data={landingApi?.data?.data || []}
                    loading={landingApi?.loading}
                    header={header}
                    pagination={{
                      pageSize: landingApi?.data?.pageSize,
                      total: landingApi?.data?.totalCount,
                    }}
                    filterData={landingApi?.data?.dailyAttendanceHeader}
                    onChange={(pagination, filters, sorter, extra) => {
                      // Return if sort function is called
                      if (extra.action === "sort") return;
                      setFilterList(filters);
                      landingApiCall({
                        pagination,
                        filerList: filters,
                        searchText: values?.search,
                      });
                    }}
                    scroll={{ x: 2000 }}
                  />
                </div>
              </div>
            ) : (
              !loading && <NoResult />
            )}
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </form>
  );
};

export default MgmtDailyAttendance;
