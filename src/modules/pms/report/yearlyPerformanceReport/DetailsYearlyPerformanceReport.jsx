import useYearlyPerformanceReportDetails from "./hooks/useYearlyPerformanceReportDetails";

const DetailsYearlyPerformanceReport = ({employeeId,year}) => {
    const {details,loading} = useYearlyPerformanceReportDetails({employeeId,year})
    return (
        <div>
            
        </div>
    );
};

export default DetailsYearlyPerformanceReport;