
export default function SONALIBankLetterHead({
  letterHeadImage,
  landingViewPdf,
  signatureImage,
}) {
  return (
    <>
      {letterHeadImage && (
        <img
          src={letterHeadImage.src}
          style={{
            height: "1570px",
            width: "1130px",
            objectFit: "cover",
            position: "fixed",
            zIndex: -1,
          }}
          alt="letterhead"
        />
      )}
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
                marginTop: "50px",
                minWidth: "930px",
              }}
            >
              <p style={{ color: "black", fontSize: "14px" }}>
                <b style={{ color: "black", fontSize: "14px" }}>
                  Date: {landingViewPdf?.[0]?.Today}
                </b>
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                To <br />
                The Manager,
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                {landingViewPdf?.[0]?.CompBankName},{" "}
                {landingViewPdf?.[0]?.CompBranchName}
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                {landingViewPdf?.[0]?.CompBankAddress}
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                <b style={{ color: "black", fontSize: "14px" }}>
                  Subject: Request for Salary Disbursement for the month
                  of&nbsp;
                  {landingViewPdf?.[0]?.MonthName}&nbsp;{landingViewPdf?.[0]?.YearId}
                </b>
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                Dear Recipients,
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                  Greetings from&nbsp;{landingViewPdf?.[0]?.CompName}.
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                We would like to inform you that our organization holds an
                account with the number {`${landingViewPdf?.[0]?.CompAccountNumber}`}.
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                We kindly request the disbursement of salaries for the month of {landingViewPdf?.[0]?.MonthName}&nbsp;{landingViewPdf?.[0]?.YearId} from the above-mentioned account to the respective employees' individual accounts. These accounts are maintained under the names of the designated employees at your branch.
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>Thank you for your cooperation and prompt action.</p>
              <div style={{ marginTop: "50px" }}>
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
                          padding: "4px",
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
                        Name
                      </th>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Designation
                      </th>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Account no.
                      </th>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Amount
                      </th>
                      <th
                        style={{
                          width:"270px",
                          border: "1px solid #D3D3D3",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        Amount (In Words)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {landingViewPdf?.map((item, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            border: "1px solid #D3D3D3",
                            padding: "4px",
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
                          {item?.EmployeeDesignation}
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
                        <td
                          style={{
                            border: "1px solid #D3D3D3",
                            padding: "4px",
                          }}
                        >
                          {item?.EmployeeBankPayInWords}
                        </td>
                      </tr>
                    ))}
                    {landingViewPdf.length > 0 && (
                      <tr>
                        <th
                          colSpan="4"
                          style={{
                            border: "1px solid #D3D3D3",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          Total
                        </th>
                        <th
                          style={{
                            border: "1px solid #D3D3D3",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {landingViewPdf?.[0]?.TotalBankPay.toFixed(2)}
                        </th>
                        <th
                          style={{
                            border: "1px solid #D3D3D3",
                            padding: "4px",
                            textAlign: "left",
                          }}
                        >
                          {landingViewPdf?.[0]?.TotalBankPayInWords}
                        </th>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
