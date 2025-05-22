import { useLocation } from "react-router-dom";

const InvestmentDetailsTable = () => {
  const location = useLocation();
  const record = location.state?.state?.data || {};

  // Extracting data from the record
  const {
    investmentName = "Info.",
    orgInvestmentName = "Info.",
    investmentDate = "Info.",
    investmentAmount = "Info.",
    expectedROI = "Info.",
    investmentDuration = "Info.",
    maturityDate = "Info.",
    status = "Info.",
  } = record;

  // Format dates for display
  const formattedInvestmentDate = investmentDate !== "Info."
    ? new Date(investmentDate).toLocaleDateString()
    : "Info.";
  const formattedMaturityDate = maturityDate !== "Info."
    ? new Date(maturityDate).toLocaleDateString()
    : "Info.";

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
    investmentAmount.toLocaleString(),
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