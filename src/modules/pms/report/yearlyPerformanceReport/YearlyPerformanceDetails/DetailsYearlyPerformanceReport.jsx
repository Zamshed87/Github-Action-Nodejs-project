import EmployeeDetails from "./EmployeeDetails";
import useYearlyPerformanceReportDetails from "../hooks/useYearlyPerformanceReportDetails";
import PerformanceSummary from "./PerformanceSummary";

const DetailsYearlyPerformanceReport = ({employeeId,year}) => {
    const {details,loading} = useYearlyPerformanceReportDetails({employeeId,year})
    console.log(details)
    return (
        <div className="d-flex justify-content-between">
            <EmployeeDetails empBasic={details}/>
            <PerformanceSummary summary={details}/>
        </div>
    );
};

export default DetailsYearlyPerformanceReport;