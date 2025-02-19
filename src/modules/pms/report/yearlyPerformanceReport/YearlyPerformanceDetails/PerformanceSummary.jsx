import { gray700 } from "utility/customColor";

const PerformanceSummary = ({ summary }) => {
  return (  
    <div>
      <div className="container mt-4">
      <div className="table-responsive">
        <table className="table table-bordered" style={{ fontSize: "12px", lineHeight: "1.5" }}>
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
              <td className="p-2">{summary?.totalPerformanceScore}</td>
            </tr>
            <tr>
              <td className="fw-bold p-2">Total Performance Score (Out of 100)</td>
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
