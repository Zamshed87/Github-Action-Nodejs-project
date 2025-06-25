const fieldMap = [
  { label: "Total PF Loan Interest (Unadjusted/ Non Shared)", key: "pfLoanInterest" },
  { label: "Total Investment Profit (Unadjusted/ Non Shared)", key: "investedProfit" },
  { label: "Running Profit Share", key: "runningProfitShare" },
  { label: "Total Unadjusted Profit", key: "unadjustedProfit" },
];

const ProfitShareDetailsTable = ({ data, loading }) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {fieldMap.map(({ label }) => (
            <th key={label} style={styles.landingTh}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {fieldMap.map(({ key }) => (
            <TableDataCell key={key} loading={loading} value={data?.[key]} />
          ))}
        </tr>
      </tbody>
    </table>
  );
};

const TableDataCell = ({ loading, value }) => (
  <td style={styles.landingTd}>{loading ? "Loading..." : value ?? "N/A"}</td>
);

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
