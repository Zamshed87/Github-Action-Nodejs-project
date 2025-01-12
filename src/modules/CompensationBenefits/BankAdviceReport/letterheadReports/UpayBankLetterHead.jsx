export default function UpayBankLetterHead({
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
                Ref:{" "}
                {`${landingViewPdf?.[0]?.WorkplaceName}/Salary/${landingViewPdf?.[0]?.MonthName}/UCBL/${landingViewPdf?.[0]?.MonthId}/${landingViewPdf?.[0]?.YearId}`}
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                <b style={{ color: "black", fontSize: "14px" }}>
                  Date: {landingViewPdf?.[0]?.Today}
                </b>
              </p>{" "}
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                To <br />
                The Senior Executive Vice President,
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                {landingViewPdf?.[0]?.CompBankName}
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                {landingViewPdf?.[0]?.CompBranchName}
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                {landingViewPdf?.[0]?.CompBankAddress}
              </p>
              <br />
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                <u>
                  <b>
                    Subject: Disbursement of Salary for the Month of&nbsp;
                    {landingViewPdf?.[0]?.MonthName}-
                    {landingViewPdf?.[0]?.YearId}.
                  </b>
                </u>
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>Dear Sir,</p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                We would request you to kindly to disburse an amouth of
                Tk.&nbsp;
                <b style={{ color: "black", fontSize: "14px" }}>
                  {landingViewPdf?.[0]?.TotalBankPay.toFixed(2)}&nbsp;
                  {`(${landingViewPdf?.[0]?.TotalBankPayInWords})`}&nbsp;
                </b>
                only to the credit od the respective account of under mentioned
                officials of {landingViewPdf?.[0]?.WorkplaceName}&nbsp;and
                please debit our CD A/C No.{" "}
                <b style={{ color: "black", fontSize: "14px" }}>
                  {landingViewPdf?.[0]?.CompAccountNumber}
                </b>{" "}
                being maintained with you and credit the{" "}
                <b>
                  UCB Fintech Company Limited-Trust Cum Settlement
                  Account(TCSA)-Salary Disbursement,
                </b>
                &nbsp;SND A/C No. for the amount mentioned against UPAY-TCSA
                Salary disbursement account as per attached list of our workers.{" "}
              </p>
              <br />
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
                        Employee Code
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
                        Wallet No
                      </th>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Principal Amount
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
