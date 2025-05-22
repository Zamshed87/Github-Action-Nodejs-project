import usePfInvestmentConfig from "./usePfInvestmentConfig";

const PfInvestmentDetails = ({ form }) => {
  const { investmentOpts, loadingInvestment } = usePfInvestmentConfig(form, {
    fetchInvestmentEnum: true,
  });

  return (
    <table
      style={{ width: "100%", borderCollapse: "collapse" }}
    >
      <tbody>
        <tr>
          <td style={styles.td}>Total Employee Contribution Amount</td>
          <td style={styles.td}>Info.</td>
        </tr>
        <tr>
          <td style={styles.td}>Total Company Contribution Amount</td>
          <td style={styles.td}>Info.</td>
        </tr>
        <tr>
          <td style={styles.td}>Total PF Profit Amount</td>
          <td style={styles.td}>Info.</td>
        </tr>
        <tr>
          <td style={styles.td}>Total PF Amount</td>
          <td style={styles.td}>Info.</td>
        </tr>
        <tr>
          <td style={styles.td}>Total PF Invested Amount</td>
          <td style={styles.td}>Info.</td>
        </tr>
        <tr>
          <td style={styles.td}>Total PF Available Amount</td>
          <td style={styles.td}>Info.</td>
        </tr>
      </tbody>
    </table>
  );
};
const styles = {
  th: {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f5f5f5",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ccc",
    padding: "8px",
  },
};
export default PfInvestmentDetails;
