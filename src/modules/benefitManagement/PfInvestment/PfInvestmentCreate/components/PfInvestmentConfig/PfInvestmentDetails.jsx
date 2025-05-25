import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { getPFData } from "../../helper";

const PfInvestmentDetails = ({ landing = false }) => {
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

  const allFields = {
    "Total Employee Contribution Amount": pfData?.totalEmpContribution,
    "Total Company Contribution Amount": pfData?.totalCompContribution,
    "Total PF Profit Amount": pfData?.totalPFProfitAmount,
    "Total PF Amount": pfData?.totalPFAmount,
    "Total PF Invested Amount": pfData?.totalPFInvestAmount,
    "Total PF Available Amount": pfData?.totalPFAvailableAmount,
    "Total PF Loan Amount": pfData?.totalPFLoanAmount,
  };

  // Decide fields based on context
  let fieldKeys;
  if (landing) {
    fieldKeys = [
      "Total PF Amount",
      "Total PF Invested Amount",
      "Total PF Loan Amount",
      "Total PF Available Amount",
    ];
  } else {
    fieldKeys = isEdit
      ? ["Total PF Profit Amount"]
      : Object.keys(allFields);
  }

  if (landing) {
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
                {loading ? "Loading..." : allFields[label]?.toLocaleString() ?? "Info."}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {fieldKeys.map((label) => (
          <tr key={label}>
            <td style={styles.verticalLabel}>{label}</td>
            <td style={styles.verticalInfo}>
              <strong>{loading ? "Loading..." : allFields[label]?.toLocaleString() ?? "Info."}</strong>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

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
  verticalLabel: {
    fontSize: ".8rem",
    border: "1px solid #ccc",
    padding: "6px",
    width: "60%",
  },
  verticalInfo: {
    fontSize: ".8rem",
    border: "1px solid #ccc",
    padding: "6px",
    textAlign: "right",
    width: "40%",
  },
};

export default PfInvestmentDetails;
