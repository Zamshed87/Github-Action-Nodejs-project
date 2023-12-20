/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import AntScrollTable from "../../../../common/AntScrollTable";
import { paginationSize } from "../../../../common/AntTable";
import DefaultInput from "../../../../common/DefaultInput";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { monthFirstDate } from "../../../../utility/dateFormatter";
import { todayDate } from "../../../../utility/todayDate";
import { getBuDetails } from "../helper";
import { generateExcelAction } from "./excel/excelConvert";
import {
  getfromToDateList,
  monthlyRosterReportColumns,
  onGetRosterReportForAll,
} from "./helper";
import { toast } from "react-toastify";
import axios from "axios";
import { getWorkplaceDetails, getWorkplaceGroupDetails } from "common/api";

const initialValues = {
  search: "",
  businessUnit: "",
  workplaceGroup: "",
  workplace: "",
  fromDate: monthFirstDate(),
  toDate: todayDate(),
};
const RosterReport = () => {
  const {
    permissionList,
    profileData: { orgId, buId, buName, wgId, wId, wName },
  } = useSelector((state) => state?.auth, shallowEqual);
  const [loading, setLoading] = useState(false);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30340) {
      permission = item;
    }
  });

  const [buDetails, setBuDetails] = useState({});
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues,
    onSubmit: (formValues) => {
      onGetRosterReportForAll(
        wId,
        getRosterReportInformation,
        orgId,
        wgId,
        formValues,
        setRowDto,
        pages,
        setPages,
        "true"
      );
    },
  });

  const [rowData, setRowDto] = useState([]);
  const [, getRosterReportInformation, loadingOnGetRosterReportInformation] =
    useAxiosGet();

  useEffect(() => {
    onGetRosterReportForAll(
      wId,
      getRosterReportInformation,
      orgId,
      wgId,
      values,
      setRowDto,
      pages,
      setPages,
      "true"
    );
  }, [wgId]);
  const handleTableChange = (pagination, newRowDto, srcText) => {
    if (newRowDto?.action === "filter") {
      return;
    }
    if (
      pages?.current === pagination?.current &&
      pages?.pageSize !== pagination?.pageSize
    ) {
      return onGetRosterReportForAll(
        wId,
        getRosterReportInformation,
        orgId,
        wgId,
        values,
        setRowDto,
        pagination,
        setPages,
        "true",
        srcText
      );
    }
    if (pages?.current !== pagination?.current) {
      return onGetRosterReportForAll(
        wId,
        getRosterReportInformation,
        orgId,
        wgId,
        values,
        setRowDto,
        pagination,
        setPages,
        "true",
        srcText
      );
    }
  };
  useEffect(() => {
    getWorkplaceDetails(wId, setBuDetails);
  }, [wId]);
  console.log({ buDetails });
  return (
    <>
      {(loadingOnGetRosterReportInformation || loading) && <Loading />}
      {permission?.isView && (
        <div className="table-card">
          <div className="table-card-heading pb-2">
            <div className="d-flex">
              <Tooltip title="Export CSV" arrow>
                <button
                  className="btn-save "
                  onClick={(e) => {
                    const excelLanding = async () => {
                      setLoading(true);
                      try {
                        const res = await axios.get(
                          `/TimeSheetReport/TimeManagementDynamicPIVOTReport?ReportType=monthly_roster_report_for_all_employee&AccountId=${orgId}&DteFromDate=${
                            values?.fromDate
                          }&DteToDate=${
                            values?.toDate
                          }&EmployeeId=0&WorkplaceGroupId=${wgId}&WorkplaceId=${wId}&PageNo=1&SearchTxt=${
                            values?.search || ""
                          }&PageSize=1000&IsPaginated=false`
                        );
                        if (res?.data) {
                          if (res?.data < 1) {
                            setLoading(false);
                            return toast.error("No  Data Found");
                          }

                          generateExcelAction(
                            "Roster Report",
                            values?.fromDate,
                            values?.toDate,
                            buDetails?.strWorkplace,
                            res?.data,
                            buDetails?.strAddress,
                            getfromToDateList(values?.fromDate, values?.toDate)
                          );
                          setLoading(false);
                        }
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
            </div>
            <div className="table-card-head-right">
              {values?.search && (
                <div className="pr-2">
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
                      onGetRosterReportForAll(
                        wId,
                        getRosterReportInformation,
                        orgId,
                        wgId,
                        values,
                        setRowDto,
                        pages,
                        setPages,
                        "true",
                        ""
                      );
                    }}
                  />
                </div>
              )}
              <MasterFilter
                styles={{ marginRight: "0px" }}
                width="200px"
                inputWidth="200px"
                isHiddenFilter
                value={values?.search}
                setValue={(value) => {
                  setFieldValue("search", value);
                  if (value) {
                    onGetRosterReportForAll(
                      wId,
                      getRosterReportInformation,
                      orgId,
                      wgId,
                      values,
                      setRowDto,
                      pages,
                      setPages,
                      "true",
                      value
                    );
                  } else {
                    onGetRosterReportForAll(
                      wId,
                      getRosterReportInformation,
                      orgId,
                      wgId,
                      values,
                      setRowDto,
                      pages,
                      setPages,
                      "true",
                      ""
                    );
                  }
                }}
                cancelHandler={() => {
                  setFieldValue("search", "");
                  onGetRosterReportForAll(
                    wId,
                    getRosterReportInformation,
                    orgId,
                    wgId,
                    values,
                    setRowDto,
                    pages,
                    setPages,
                    "true",
                    ""
                  );
                }}
              />
            </div>
          </div>
          <div className="table-card-body">
            <div className="card-style mb-2 row px-0 pb-0">
              {/*   <div className="col-lg-3">
                <div className="input-field-main">
                  <label>Business Unit</label>
                  <FormikSelect
                    name="businessUnit"
                    options={businessUnitDDL || []}
                    value={values?.businessUnit}
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                      if (valueOption?.value) {
                        getBuDetails(valueOption?.value, setBuDetails);
                        getPeopleDeskAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${valueOption?.value}&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
                          "intWorkplaceGroupId",
                          "strWorkplaceGroup",
                          setWorkplaceGroupDDL
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
                  <label>Workplace Group</label>
                  <FormikSelect
                    name="workplaceGroup"
                    options={workplaceGroupDDL || []}
                    value={values?.workplaceGroup}
                    onChange={(valueOption) => {
                      setValues((prev) => ({
                        ...prev,
                        workplace: "",
                        workplaceGroup: valueOption,
                      }));
                      if (valueOption?.value) {
                        getPeopleDeskAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${values?.businessUnit?.value}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
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
                    options={workplaceDDL || []}
                    value={values?.workplace}
                    onChange={(valueOption) => {
                      setFieldValue("workplace", valueOption);
                    }}
                    placeholder=""
                    styles={customStyles}
                  />
                </div>
              </div> */}
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>From Date</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.fromDate}
                    placeholder=""
                    name="fromDate"
                    type="date"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>To Date</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.toDate}
                    placeholder="Month"
                    name="toDate"
                    type="date"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="col-lg-1">
                <button
                  type="button"
                  disabled={!values?.toDate || !values?.fromDate}
                  style={{ marginTop: "21px" }}
                  className="btn btn-green"
                  onClick={handleSubmit}
                >
                  View
                </button>
              </div>
            </div>
          </div>
          {rowData?.length > 0 ? (
            <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
              <AntScrollTable
                data={rowData}
                columnsData={monthlyRosterReportColumns(
                  values?.fromDate,
                  values?.toDate,
                  pages?.current,
                  pages?.pageSize
                )}
                handleTableChange={({ pagination, newRowDto }) =>
                  handleTableChange(pagination, newRowDto, values?.search || "")
                }
                pages={pages?.pageSize}
                pagination={pages}
              />
            </div>
          ) : (
            <>
              <NoResult />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default RosterReport;
