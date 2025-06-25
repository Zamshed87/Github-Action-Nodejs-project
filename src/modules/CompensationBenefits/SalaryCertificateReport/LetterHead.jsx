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

  // Calculate total gross salary dynamically from salary elements
  const totalGrossSalary = Object.values(salaryMap).reduce(
    (total, amount) => total + (Number(amount) || 0),
    0
  );

  const pronoun = emp.ProNoun || "His";
  const genderWord =
    emp.Gender === "Son" || emp.Gender === "son" ? "Son" : 
    emp.Gender === "Daughter" || emp.Gender === "daughter" ? "Daughter" : "";

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
          color: "#000",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          lineHeight: "1.5", // Added base line height for all content
        }}
      >
        <div style={{ marginTop: "200px" }}>
          {" "}
          {/* Increased top margin to match the image */}
          <p style={{ fontWeight: "bold", color: "#000", lineHeight: "1.6"}}>
            Date: <span>{formatDate(emp.IssueDate)}</span>
          </p>

          <p
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "22px",
              marginTop: "30px",
              marginBottom: "30px",
              textTransform: "uppercase",
              color: "#000",
              lineHeight: "1.6",
            }}
          >
            TO WHOM IT MAY CONCERN
          </p>

          <p style={{ fontSize: "18px", color: "#000", lineHeight: "1.6" }}>
            This is to certify that <strong>{emp.EmployeeName}</strong>,{" "}
            {genderWord} of <strong>{emp.FatherName || "N/A"}</strong>, is a{" "}
            <strong>{emp.EmploymentType}</strong> employee of{" "}
            <strong>{emp.WorkplaceName}</strong>.
          </p>

          <p
            style={{
              marginTop: "20px",
              fontSize: "18px",
              marginBottom: "20px",
              color: "#000",
              lineHeight: "1.6",
            }}
          >
            {pronoun} employment details are as follows:
          </p>

          <table
            style={{
              width: "100%",
              marginTop: "5px",
              borderCollapse: "collapse",
              fontSize: "18px",
              lineHeight: "1.8", // Added line height to table rows
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

          <p
            style={{
              marginTop: "20px",
              fontWeight: "bold",
              fontSize: "18px",
              color: "#000",
              lineHeight: "1.6",
            }}
          >
            Salary Breakdown
          </p>

          <table
            style={{
              width: "100%",
              marginTop: "5px",
              borderCollapse: "collapse",
              fontSize: "18px",
              lineHeight: "1.8", // Added line height to table rows
            }}
          >
            <tbody>
              {/* Dynamically render all payroll elements */}
              {Object.entries(salaryMap).map(([element, amount]) => (
                <tr key={element}>
                  <td style={{ width: "200px", color: "#000" }}>{element}</td>
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
                <td style={{ width: "200px", color: "#000" }}>Total Gross Salary</td>
                <td style={{ width: "30px", textAlign: "center" }}>:</td>
                <td>
                  {totalGrossSalary.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tbody>
          </table>
          <p
            style={{
              fontWeight: "bold",
              marginTop: "20px",
              fontSize: "18px",
              color: "#000",
              lineHeight: "1.6",
            }}
          >
            In word : {emp.InWord || "One Lakh Fifty Thousand Five Hundred Only"}
          </p>

          <p style={{ marginTop: "30px", fontSize: "18px", color: "#000", lineHeight: "1.6" }}>
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
        </div>
      </div>
    </>
  );
}
