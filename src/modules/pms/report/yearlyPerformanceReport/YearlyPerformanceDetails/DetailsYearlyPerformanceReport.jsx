import EmployeeDetails from "./EmployeeDetails";
import useYearlyPerformanceReportDetails from "../hooks/useYearlyPerformanceReportDetails";
import PerformanceSummary from "./PerformanceSummary";
import KeyPerformanceIndicatorDetails from "./KeyPerformanceIndicatorDetails";
import BehaviorallyAnchoredRatingBARDetails from "./BehaviorallyAnchoredRatingBARDetails";
import Loading from "common/loading/Loading";

const DetailsYearlyPerformanceReport = ({ employeeId, year }) => {
  const { details, loading } = useYearlyPerformanceReportDetails({
    employeeId,
    year,
  });
  return (
    <>
      {loading && <Loading />}
      <div>
        <div className="d-flex justify-content-between">
          <EmployeeDetails empBasic={details} />
          <PerformanceSummary summary={details} />
        </div>
        <KeyPerformanceIndicatorDetails details={details} />
        <BehaviorallyAnchoredRatingBARDetails details={details} />
      </div>
    </>
  );
};

export default DetailsYearlyPerformanceReport;
