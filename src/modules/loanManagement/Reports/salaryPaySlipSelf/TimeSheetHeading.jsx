import React from "react";
import { Tooltip } from "@mui/material";
import { SaveAlt } from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import { downloadFile, getPDFAction } from "../../../../utility/downloadFile";

const TimeSheetHeading = (props) => {
  const { values, setLoading, buId, employeeId } = props;

  return (
    <div className="configuration-heading">
      <div className="table-card-heading d-flex flex-wrap">
        <div className="d-flex">
          <Tooltip title="Export CSV" arrow>
            <button
              className="btn-save"
              type="button"
              onClick={(e) => {
                let splittedMonth = values?.month?.split("-");
                let date = new Date();
                downloadFile(
                  `/emp/PdfAndExcelReport/MonthlySalaryReportExportAsExcel?BusinessUnitId=${buId}&Year=${
                    splittedMonth?.[0] || date.getFullYear()
                  }&Month=${
                    splittedMonth?.[1] || date.getMonth() + 1
                  }&WorkplaceGroupId=${
                    values?.workplaceGroup?.value || 0
                  }&DepartmentId=${
                    values?.department?.value || 0
                  }&DesignationId=${
                    values?.designation?.value || 0
                  }&EmployeeId=${employeeId}`,
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
                  `/emp/PdfAndExcelReport/MonthlySalaryReport?BusinessUnitId=${buId}&Year=${
                    splittedMonth?.[0] || date.getFullYear()
                  }&Month=${
                    splittedMonth?.[1] || date.getMonth() + 1
                  }&WorkplaceGroupId=${
                    values?.workplaceGroup?.value || 0
                  }&DepartmentId=${
                    values?.department?.value || 0
                  }&DesignationId=${
                    values?.designation?.value || 0
                  }&EmployeeId=${employeeId}`,
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
      </div>
    </div>
  );
};

export default TimeSheetHeading;
