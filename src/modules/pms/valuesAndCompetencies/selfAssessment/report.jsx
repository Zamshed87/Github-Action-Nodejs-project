import ScrollableTable from "../../../../common/ScrollableTable";

const AssessmentReport = ({ selfAssessmentReportData }) => {
  return (
    <div>
      <ScrollableTable
        classes="salary-process-table"
        secondClasses="table-card-styled tableOne scroll-table-height"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Section</th>
            {selfAssessmentReportData?.valuesOrCompetencyList?.map(
              (data, index) => (
                <th key={index}>{data?.valueOrCompetencyName}</th>
              )
            )}
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{selfAssessmentReportData?.employee?.employeeId}</td>
            <td>{selfAssessmentReportData?.employee?.employeeName}</td>
            <td>{selfAssessmentReportData?.employee?.designation}</td>
            <td>{selfAssessmentReportData?.employee?.department}</td>
            <td>{selfAssessmentReportData?.employee?.section}</td>
            {selfAssessmentReportData?.valuesOrCompetencyList?.map(
              (data, index) => (
                <td key={index}>{data?.selfValue}</td>
              )
            )}
            <td>{selfAssessmentReportData?.totalScore?.totalSelfScore}</td>
          </tr>
          <tr>
            <td colSpan={5}>Suppervisor Assessment</td>
            {selfAssessmentReportData?.valuesOrCompetencyList?.map(
              (data, index) => (
                <td key={index}>{data?.supervisorValue}</td>
              )
            )}
            <td>
              {selfAssessmentReportData?.totalScore?.totalSupervisorScore}
            </td>
          </tr>
          <tr>
            <td colSpan={5}>Improvement Areas Gap (Suppervisor)</td>
            {selfAssessmentReportData?.valuesOrCompetencyList?.map(
              (data, index) => (
                <td key={index}>{data?.gapValue}</td>
              )
            )}
            <td>{selfAssessmentReportData?.totalScore?.totalGapScore}</td>
          </tr>
        </tbody>
      </ScrollableTable>
    </div>
  );
};

export default AssessmentReport;
