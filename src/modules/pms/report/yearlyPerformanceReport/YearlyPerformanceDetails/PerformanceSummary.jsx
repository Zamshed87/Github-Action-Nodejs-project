import Loading from "common/loading/Loading";
import { PButton } from "Components";
import { useState } from "react";
import { downloadFile } from "utility/downloadFile";

const PerformanceSummary = ({ summary, employeeID, year }) => {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      {loading && <Loading />}
      <PButton
        type="primary"
        action="submit"
        onClick={() => {
          const url = `/PdfAndExcelReport/PMS/YearlyPerformanceReportDetailPdf?EmployeeId=${employeeID}&Year=${year}`;
          downloadFile(url, `YearlyPerformanceReport`, "pdf", setLoading);
        }}
        content="Print"
        parentClassName="d-flex flex-row-reverse pr-3"
      />
      <div className="container mt-4">
        <div className="table-responsive">
          <table
            className="table table-bordered"
            style={{ fontSize: "12px", lineHeight: "1.5" }}
          >
            <tbody>
              <tr>
                <td className="fw-bold p-2">Year</td>
                <td className="p-2">{summary?.year}</td>
              </tr>
              <tr>
                <td className="fw-bold p-2">Level of Leadership</td>
                <td className="p-2">{summary?.levelOfLeadership}</td>
              </tr>
              <tr>
                <td className="fw-bold p-2">Total KPI Score by Scale</td>
                <td className="p-2">{summary?.totalKPIScoreByScale}</td>
              </tr>
              <tr>
                <td className="fw-bold p-2">Total BAR Score by Scale</td>
                <td className="p-2">{summary?.totalBARScoreByScale}</td>
              </tr>
              <tr>
                <td className="fw-bold p-2">
                  Total Performance Score (Out of 100)
                </td>
                <td className="p-2">{summary?.totalPerformanceScore}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSummary;
