export default function MBLBankLetterHead({
  letterHeadImage,
  landingViewPdf,
  signatureImage,
}) {
  return (
    <>
      {letterHeadImage && (
        <img
          className="invoice-header"
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
                minWidth: "930px",
              }}
            >
              <p style={{ color: "black", fontSize: "14px" }}>
                Ref: No.{" "}
                {`${landingViewPdf?.[0]?.WorkplaceCode}/${landingViewPdf?.[0]?.MonthName}/${landingViewPdf?.[0]?.YearId}`}
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                Date: {landingViewPdf?.[0]?.Today}
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                To <br />
                The Manager,
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                {landingViewPdf?.[0]?.CompBankName}
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                {landingViewPdf?.[0]?.CompBranchName}
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                <b style={{ color: "black", fontSize: "14px" }}>
                  Subject:&nbsp;Staff Salary on&nbsp;
                  {landingViewPdf?.[0]?.MonthName}&apos;
                  {landingViewPdf?.[0]?.YearId}&nbsp;Transfer to the respective
                  account.
                </b>
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>Dear Sir,</p>
              <p style={{ color: "black", fontSize: "14px" }}>
                Referring to the above we would like to debit the mentioned
                amount Tk.&nbsp;{landingViewPdf?.[0]?.TotalBankPay.toFixed(2)}
                /-&nbsp;
                {`(${landingViewPdf?.[0]?.TotalBankPayInWords} Only)`}&nbsp;
                from the Current Account no.&nbsp;
                {landingViewPdf?.[0]?.CompAccountNumber}.
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                Please take necessary action for transferring the amount against
                mentioned account enclosed herewith.
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                Sincerely yours,
              </p>
              <br />
              <div style={{ marginTop: "50px" }}>
                <p
                  style={{
                    color: "black",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ color: "black", fontSize: "14px" }}>
                    <b style={{ color: "black", fontSize: "14px" }}>
                      {landingViewPdf?.[0]?.WorkplaceName}
                      {`(${landingViewPdf?.[0]?.CompAddress})`}
                    </b>
                  </p>
                  <p style={{ color: "black", fontSize: "14px" }}>
                    <b style={{ color: "black", fontSize: "14px" }}>
                      Salary for the Month of {landingViewPdf?.[0]?.MonthName}-
                      {landingViewPdf?.[0]?.YearId}
                    </b>
                  </p>
                  <p style={{ color: "black", fontSize: "14px" }}>
                    <b style={{ color: "black", fontSize: "14px" }}>
                      Bank name- {landingViewPdf?.[0]?.CompBankName}{" "}
                      {`(${landingViewPdf?.[0]?.CompBranchName})`}
                    </b>
                  </p>
                  <p style={{ color: "black", fontSize: "14px" }}>
                    <b style={{ color: "black", fontSize: "14px" }}>
                      C/D AC NO # {landingViewPdf?.[0]?.CompAccountNumber}
                    </b>
                  </p>
                </p>
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
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        ID No.
                      </th>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        Bank Accout No.
                      </th>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        Net Pay
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
                            padding: "4px",
                          }}
                        >
                          {item?.EmployeeCode}
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
                            padding: "4px",
                          }}
                        >
                          {item?.EmpBankAccountNumber}
                        </td>
                        <td
                          style={{
                            border: "1px solid #D3D3D3",
                            padding: "4px",
                          }}
                        >
                          {item?.NeyPayableSalary?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
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
