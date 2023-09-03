import React from "react";
import { Tooltip } from "@mui/material";
import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import MasterFilter from "../../../../common/MasterFilter";
import { downloadFile, getPDFAction } from "../../../../utility/downloadFile";
import ResetButton from "../../../../common/ResetButton";

const TimeSheetHeading = (props) => {
  const { values, setFieldValue, handleClick, searchData, setLoading, buId ,isFilter,setIsFilter,resetForm,setMonthValue,initData} = props;

  return (
    <div className="configuration-heading">
      <div className="table-card-heading d-flex flex-wrap">
        <div className="d-flex">
          <Tooltip title="Export CSV" arrow>
            <button
              className="btn-save "
              type="button"
              onClick={(e) => {
                downloadFile(
                  `/emp/PdfAndExcelReport/MonthlySalaryReportExportAsExcel?BusinessUnitId=10&Year=2021&Month=12&WorkplaceGroupId=0&DepartmentId=0&DesignationId=0&EmployeeId=0`,
                  "Salary Details",
                  "xlsx",
                  setLoading
                );
              }}
              style={{
                border: "transparent",
                width: "30px",
                height: "30px",
                background: "#f2f2f7",
                borderRadius: "100px",
              }}
            >
              <SaveAlt sx={{ color: "#637381", fontSize: "16px" }} />
            </button>
          </Tooltip>
          <Tooltip title="Print" arrow>
            <button
              onClick={() => {
                let splittedMonth = values?.month?.split("-");
                let date = new Date();
                getPDFAction(
                  `/emp/PdfAndExcelReport/MonthlySalaryReport?BusinessUnitId=${buId}&Year=${splittedMonth?.[0] || date.getFullYear()}&Month=${
                    splittedMonth?.[1] || date.getMonth() + 1
                  }&WorkplaceGroupId=${values?.workplaceGroup?.value || 0}&DepartmentId=${values?.department?.value || 0}&DesignationId=${
                    values?.designation?.value || 0
                  }&EmployeeId=${values?.employee?.value || 0}`,
                  setLoading
                );
              }}
              type="button"
              className="btn-save ml-3"
              style={{
                border: "transparent",
                width: "30px",
                height: "30px",
                background: "#f2f2f7",
                borderRadius: "100px",
              }}
            >
              <PrintIcon sx={{ color: "#637381", fontSize: "16px" }} />
            </button>
          </Tooltip>
        </div>
        <ul className="d-flex flex-wrap">
          {isFilter && (
            <li>
              <ResetButton
                title="reset"
                icon={<SettingsBackupRestoreOutlined sx={{ marginRight: "10px" }} />}
                onClick={() => {
                  setIsFilter(false);
                  resetForm(initData);
                  setMonthValue(initData.month)
                  setFieldValue("search", "");
                  searchData(null);
                }}
              />
            </li>
          )}
          <li>
            <MasterFilter
              width="200px"
              inputWidth="200"
              value={values?.search}
              setValue={(value) => {
                setFieldValue("search", value);
                searchData(value);
              }}
              cancelHandler={() => {
                searchData(null);
                setFieldValue("search", "");
              }}
              handleClick={handleClick}
            />
          </li>
        </ul>
        {/* <div className="table-card-head-right">
          <div className="col-lg-7">
            <div>
              <MasterFilter
                width="200px"
                inputWidth="200"
                value={values?.search}
                setValue={(value) => {
                  setFieldValue("search", value);
                  searchData(value);
                }}
                cancelHandler={() => {
                  searchData(null);
                  setFieldValue("search", "");
                }}
                handleClick={handleClick}
              />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default TimeSheetHeading;
