import React from "react";

const PfEmployeeDetails = ({ landingApi }) => {
  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Total Employee Contribution Amount</th>
            <th style={styles.tableHeader}>Total Company Contribution Amount</th>
            <th style={styles.tableHeader}>Total Profit Share Amount</th>
            <th style={styles.tableHeader}>Total PF Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.tableData}>{landingApi?.data?.data?.numTotalEmployeeContribution ?? '-'}</td>
            <td style={styles.tableData}>{landingApi?.data?.data?.numTotalCompanyContribution ?? '-'}</td>
            <td style={styles.tableData}>{landingApi?.data?.data?.numTotalProfitShare ?? '-'}</td>
            <td style={styles.tableData}>{landingApi?.data?.data?.numTotalPFAmount ?? '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableContainer: {
    width: "100%",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch", // smooth scrolling on iOS
    border: "1px solid #ccc",
    borderRadius: 4,
  },
  table: {
    width: "100%",
    minWidth: 600, // ensure minimum width for horizontal scroll on small screens
    borderCollapse: "collapse",
    transition: "all 0.3s ease",
  },
  tableHeader: {
    border: "1px solid #ccc",
    fontSize: ".9rem",
    padding: "8px",
    backgroundColor: "#f0f0f0",
    textAlign: "center",
    whiteSpace: "nowrap", // prevent header text from wrapping
  },
  tableData: {
    fontSize: ".9rem",
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "center",
    whiteSpace: "nowrap", // keep data on one line
  },
};

export default PfEmployeeDetails;
