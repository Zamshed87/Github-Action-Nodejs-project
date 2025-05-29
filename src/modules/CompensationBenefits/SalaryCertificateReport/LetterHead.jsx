export default function LetterHead({
  letterHeadImage,
  landingViewPdf,
  signatureImage,
}) {
  if (!landingViewPdf || landingViewPdf.length === 0) return null;

  const emp = landingViewPdf[0];

  const salaryMap = {};
  landingViewPdf.forEach(({ PayrollElement, Amount }) => {
    salaryMap[PayrollElement] = Amount;
  });

  const pronoun = emp.ProNoun || "His";
  const genderWord =
    emp.Gender === "Son" ? "Son" : emp.Gender === "Daughter" ? "Daughter" : "";

  return (
    <>
      {letterHeadImage && (
        <img
          src={letterHeadImage.src}
          alt="letterhead"
          style={{
            height: "1570px",
            width: "1130px",
            objectFit: "cover",
            position: "fixed",
            zIndex: -1,
          }}
        />
      )}

      <div
        style={{
          margin: "0 96px",
          fontSize: "14px",
          marginTop: "50px",
          minWidth: "930px",
          color: "black",
          lineHeight: 1.7,
          fontFamily: "Arial, sans-serif",
          whiteSpace: "pre-line",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p style={{ fontWeight: "bold" }}>
          Date: <span>{emp.IssueDate}</span>
        </p>

        <p
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "16px",
            marginTop: "100px",
            marginBottom: "30px",
            textTransform: "uppercase",
          }}
        >
          TO WHOM IT MAY CONCERN
        </p>

        <p>
          This is to certify that{" "}
          <strong>{emp.EmployeeName}</strong>, {genderWord} of{" "}
          <strong>{emp.FatherName || "N/A"}</strong>, is a{" "}
          <strong>{emp.EmploymentType}</strong> employee of{" "}
          <strong>{emp.WorkplaceName}</strong>.
        </p>

        <p style={{ marginTop: "20px" }}>
          {pronoun} employment details are as follows:
        </p>

        <table
          style={{
            width: "100%",
            marginTop: "5px",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "150px" }}>Employee ID</td>
              <td style={{ width: "10px" }}>:</td>
              <td>{emp.EmployeeCode}</td>
            </tr>
            <tr>
              <td>Joining Date</td>
              <td>:</td>
              <td>{emp.dteJoiningDate}</td>
            </tr>
            <tr>
              <td>Designation</td>
              <td>:</td>
              <td>{emp.DesignationName}</td>
            </tr>
            <tr>
              <td>Department</td>
              <td>:</td>
              <td>{emp.DepartmentName}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginTop: "20px", fontWeight: "bold" }}>Salary Breakdown</p>

        <table
          style={{
            width: "100%",
            marginTop: "5px",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "150px" }}>Basic Salary</td>
              <td style={{ width: "10px" }}>:</td>
              <td style={{ textAlign: "right" }}>
                {salaryMap["Basic Salary"]?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                }) || "0.00"}
              </td>
            </tr>
            <tr>
              <td>House Rent</td>
              <td>:</td>
              <td style={{ textAlign: "right" }}>
                {salaryMap["House Rent"]?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                }) || "0.00"}
              </td>
            </tr>
            <tr>
              <td>Medical Allowance</td>
              <td>:</td>
              <td style={{ textAlign: "right" }}>
                {salaryMap["Medical Allowance"]?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                }) || "0.00"}
              </td>
            </tr>
            <tr>
              <td>Conveyance</td>
              <td>:</td>
              <td style={{ textAlign: "right" }}>
                {salaryMap["Conveyance"]?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                }) || "0.00"}
              </td>
            </tr>
          </tbody>
        </table>

        <hr
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            border: "1px solid black",
            width: "100%",
          }}
        />

        <table
          style={{
            width: "100%",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "150px" }}>Total Gross Salary</td>
              <td style={{ width: "10px" }}>:</td>
              <td style={{ textAlign: "right" }}>
                {emp.GrossAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontWeight: "bold", marginTop: "10px" }}>
          In word : One Lakh Ten Thousand Five Hundred Only
        </p>

        <p style={{ marginTop: "30px" }}>
          This certificate is issued at the request of the employee. Nearby
          confirm that the above information is true and accurate to the best of
          our knowledge.
        </p>

        <p style={{ marginTop: "50px", fontSize: "12px", fontStyle: "italic" }}>
          Note: This document is system-generated and does not require any
          signature
        </p>

        {signatureImage && (
          <img
            src={signatureImage.src}
            alt="signature"
            style={{
              marginTop: "50px",
              width: "300px",
              height: "150px",
              objectFit: "contain",
            }}
          />
        )}
      </div>
    </>
  );
}
