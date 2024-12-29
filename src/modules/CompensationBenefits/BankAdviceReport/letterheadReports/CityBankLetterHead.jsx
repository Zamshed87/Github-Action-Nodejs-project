export default function CityBankLetterHead({
  letterHeadImage,
  landingViewPdf,
}) {
  return (
    <>
      <div
        className="invoice-header"
        style={{
          backgroundImage: letterHeadImage,
          backgroundRepeat: "no-repeat",
          height: "1400px",
          width: "991px",
          backgroundSize: "cover",
          position: "fixed",
          zIndex: -1,
        }}
      ></div>
      <table>
        <thead>
          <tr>
            <td
              style={{
                border: "none",
              }}
            >
              {/* place holder for the fixed-position header */}
              <div
                style={{
                  height: "173px",
                }}
              ></div>
            </td>
          </tr>
        </thead>
        <tbody>
          {/* CONTENT GOES HERE */}
          {landingViewPdf.length > 0 && (
            <div
              style={{
                margin: "0px 96px",
                fontSize: "14px",
                marginTop: "100px",
              }}
            >
              <p style={{ color: "black", fontSize: "14px" }}>
                <b style={{ color: "black", fontSize: "14px" }}>
                  Date: {landingViewPdf?.[0]?.Today}
                </b>
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                To <br />
                Branch Manager,
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                {landingViewPdf?.[0]?.CompBankName}
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                {landingViewPdf?.[0]?.CompBranchName}
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                <b style={{ color: "black", fontSize: "14px" }}>Subject:</b>
                &nbsp; Salary Disbursement For The Month of&nbsp;
                {landingViewPdf?.[0]?.MonthName},&nbsp;
                {landingViewPdf?.[0]?.YearId}&nbsp; of &nbsp;
                <b style={{ color: "black", fontSize: "14px" }}>
                  &quot;
                  {landingViewPdf?.[0]?.WorkplaceGroupName}
                  &quot;&nbsp;
                </b>
                Employees.
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>Dear Sir,</p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                With Due Respect, We Are Requesting You To Transfer The Salary
                For The Month of&nbsp;
                {landingViewPdf?.[0]?.MonthName},&nbsp;
                {landingViewPdf?.[0]?.YearId} of
                <b style={{ color: "black", fontSize: "14px" }}>
                  &nbsp;&quot;
                  {landingViewPdf?.[0]?.WorkplaceGroupName}
                  &quot;&nbsp;
                </b>
                Employees. Please Debit BDT&nbsp;
                <b style={{ color: "black", fontSize: "14px" }}>
                  {landingViewPdf?.[0]?.TotalBankPay}&nbsp;
                </b>
                From Our Company Account no.&nbsp;
                <b style={{ color: "black", fontSize: "14px" }}>
                  {landingViewPdf?.[0]?.CompAccountNumber}&nbsp;
                </b>
                To Disburse Salaries As Mentioned Below.
              </p>
              <div style={{ pageBreakBefore: "always" }}>
                Employee Bank Account Information with Transfer Amount:
                <table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        SL
                      </th>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Employee Name
                      </th>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Account Number
                      </th>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Net Salary Payable
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {landingViewPdf?.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          pageBreakBefore: index % 25 === 0 ? "always" : "auto",
                        }}
                      >
                        <td
                          style={{
                            border: "1px solid #D3D3D3",
                            padding: "8px",
                          }}
                        >
                          {item?.Sl}
                        </td>
                        <td
                          style={{
                            border: "1px solid #D3D3D3",
                            padding: "8px",
                          }}
                        >
                          {item?.EmpAccountName}
                        </td>
                        <td
                          style={{
                            border: "1px solid #D3D3D3",
                            padding: "8px",
                          }}
                        >
                          {item?.EmpBankAccountNumber}
                        </td>
                        <td
                          style={{
                            border: "1px solid #D3D3D3",
                            padding: "8px",
                          }}
                        >
                          {item?.NeyPayableSalary.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td
              style={{
                border: "none",
                // Adds space between data and footer
              }}
            >
              <div
                style={{
                  height: "125px",
                  // For visibility
                }}
              ></div>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}
