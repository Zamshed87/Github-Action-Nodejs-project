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

  // Format date properly
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return dateString;

      // Format: DD Month YYYY (e.g., 15 January 2023)
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <>
      {letterHeadImage && (
        <img
          src={letterHeadImage.src}
          alt="letterhead"
          style={{
            height: "100%",
            width: "1130px",
            objectFit: "cover",
            position: "fixed",
            zIndex: -1,
          }}
        />
      )}

      <div
        style={{
          height: "auto",
          fontSize: "18px",
          color: "#000000",
        }}
      >
        <p style={{ fontWeight: "bold" }}>
          Date: <span>{formatDate(emp.IssueDate)}</span>
        </p>

        <p
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "22px",
            marginTop: "100px",
            marginBottom: "30px",
            textTransform: "uppercase",
          }}
        >
          TO WHOM IT MAY CONCERN
        </p>

        <p style={{ fontSize: "18px" }}>
          This is to certify that <strong>{emp.EmployeeName}</strong>,{" "}
          {genderWord} of <strong>{emp.FatherName || "N/A"}</strong>, is a{" "}
          <strong>{emp.EmploymentType}</strong> employee of{" "}
          <strong>{emp.WorkplaceName}</strong>.
        </p>

        <p
          style={{ marginTop: "20px", fontSize: "18px", marginBottom: "20px" }}
        >
          {pronoun} employment details are as follows:
        </p>

        <table
          style={{
            width: "100%",
            marginTop: "5px",
            borderCollapse: "collapse",
            fontSize: "18px",
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

        <p style={{ marginTop: "20px", fontWeight: "bold", fontSize: "18px" }}>
          Salary Breakdown
        </p>

        <table
          style={{
            width: "100%",
            marginTop: "5px",
            borderCollapse: "collapse",
            fontSize: "18px",
          }}
        >
          <tbody>
            {/* Dynamically render all payroll elements */}
            {Object.entries(salaryMap).map(([element, amount]) => (
              <tr key={element}>
                <td style={{ width: "200px" }}>{element}</td>
                <td style={{ width: "30px", textAlign: "center" }}>:</td>
                <td>
                  {amount?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  }) || "0.00"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            border: "1px solid black",
            width: "50%",
          }}
        />

        <table
          style={{
            width: "100%",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "200px" }}>Total Gross Salary</td>
              <td style={{ width: "30px", textAlign: "center" }}>:</td>
              <td>
                {emp.GrossAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontWeight: "bold", marginTop: "10px", fontSize: "18px" }}>
          In word : {emp.InWord || "One Lakh Fifty Thousand Five Hundred Only"}
        </p>

        <p style={{ marginTop: "30px", fontSize: "18px" }}>
          This certificate is issued at the request of the employee. Nearby
          confirm that the above information is true and accurate to the best of
          our knowledge.
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

        <p
          style={{
            marginTop: "50px",
            fontSize: "16px",
            fontStyle: "italic",
            textAlign: "center",
            color: "#000000",
            padding: "10px 0",
            marginBottom: "30px",
          }}
        >
          Note: This document is system-generated and does not require any
          signature
        </p>
      </div>
    </>
  );
}
