
const fieldKeys = [
  "Total PF Loan Interest (Unadjusted/ Non Shared)",
  "Total Investment Profit (Unadjusted/ Non Shared)",
  "Running Profit Share",
  "Total Unadjusted Profit"
];

const ProfitShareDetailsTable = ({data,loading}) => {
 

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {fieldKeys.map((label) => (
            <th key={label} style={styles.landingTh}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {fieldKeys.map((label) => (
            <td key={label} style={styles.landingTd}>
              {loading ? "Loading..." : data[label]?.toLocaleString?.() ?? "Info."}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default ProfitShareDetailsTable;

const styles = {
  landingTh: {
    border: "1px solid #ccc",
    fontSize: ".8rem",
    padding: "6px",
    backgroundColor: "#f0f0f0",
    textAlign: "center",
  },
  landingTd: {
    fontSize: ".8rem",
    border: "1px solid #ccc",
    padding: "6px",
    textAlign: "center",
  },
};
