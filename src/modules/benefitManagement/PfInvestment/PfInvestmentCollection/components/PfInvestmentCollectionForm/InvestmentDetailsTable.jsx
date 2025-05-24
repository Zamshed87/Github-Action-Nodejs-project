import { useLocation } from "react-router-dom";

const InvestmentDetailsTable = () => {
  const location = useLocation();
  const record = location.state?.state?.data || {};

  // Extracting data from the record
  const {
    investmentName,
    orgInvestmentName,
    investmentDate,
    investmentAmount,
    expectedROI,
    investmentDuration,
    maturityDate,
    status,
  } = record;

  // Format dates for display
  const formattedInvestmentDate = investmentDate
    ? new Date(investmentDate).toLocaleDateString()
    : "N/A";
  const formattedMaturityDate = maturityDate
    ? new Date(maturityDate).toLocaleDateString()
    : "N/A";

  const headersTop = [
    "Investment Type",
    "Investment To",
    "Investment Date",
    "Investment Amount",
  ];

  const headersBottom = [
    "Expected ROI (%)",
    "Investment Duration (Months)",
    "Maturity Date",
    "Comments",
  ];

  const topRowData = [
    investmentName,
    orgInvestmentName,
    formattedInvestmentDate,
    investmentAmount?.toLocaleString(),
  ];

  const bottomRowData = [
    expectedROI,
    investmentDuration,
    formattedMaturityDate,
    status,
  ];

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {headersTop.map((label) => (
            <th key={label} style={styles.header}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {topRowData.map((data, index) => (
            <td key={index} style={styles.cell}>
              {data}
            </td>
          ))}
        </tr>
      </tbody>
      <thead>
        <tr>
          {headersBottom.map((label) => (
            <th key={label} style={styles.header}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {bottomRowData.map((data, index) => (
            <td key={index} style={styles.cell}>
              {data}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

const styles = {
  header: {
    border: "1px solid #ccc",
    padding: "6px",
    backgroundColor: "#f0f0f0",
    textAlign: "center",
    fontSize: ".8rem",
  },
  cell: {
    border: "1px solid #ccc",
    padding: "6px",
    textAlign: "center",
    fontSize: ".8rem",
  },
};

export default InvestmentDetailsTable;
