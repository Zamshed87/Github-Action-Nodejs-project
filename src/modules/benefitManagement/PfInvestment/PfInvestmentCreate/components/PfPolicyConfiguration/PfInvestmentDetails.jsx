import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { getPFData } from "../../helper";

const PfInvestmentDetails = () => {
  const {
    profileData: { intAccountId },
  } = useSelector((store) => store?.auth, shallowEqual);
  const location = useLocation();
  const isEdit = location.pathname.includes("/edit");

  const [loading, setLoading] = useState(false);
  const [pfData, setPfData] = useState(null);

  useEffect(() => {
    if (intAccountId) {
      getPFData(intAccountId, setLoading, setPfData);
    }
  }, [intAccountId]);

  const labelsMap = {
    "Total Employee Contribution Amount": pfData?.totalEmpContribution,
    "Total Company Contribution Amount": pfData?.totalCompContribution,
    "Total PF Profit Amount": pfData?.totalPFProfitAmount,
    "Total PF Amount": pfData?.totalPFAmount,
    "Total PF Invested Amount": pfData?.totalPFInvestAmount,
    "Total PF Available Amount": pfData?.totalPFAvailableAmount,
  };

  const rows = Object.keys(labelsMap);

  const filteredRows = isEdit
    ? rows.filter((row) => row === "Total PF Profit Amount")
    : rows;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {filteredRows.map((label) => (
          <tr key={label}>
            <td style={styles.td}>{label}</td>
            <td style={styles.td}>
              {loading
                ? "Loading..."
                : labelsMap[label]?.toLocaleString() ?? "-"}
            </td>
          </tr>
        ))}
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
