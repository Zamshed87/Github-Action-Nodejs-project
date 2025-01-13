export default function SJIBLBankLetterHead({
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
                The VP & Manager,
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
              <p style={{ color: "black", fontSize: "14px" }}>
                <b>
                  Subject: Salary Transfer from Current Account No,&nbsp;
                  {landingViewPdf?.[0]?.CompAccountNumber} to Individual Salary
                  Account.
                </b>
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>Dear Sir,</p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                We would like to request you to debit the&nbsp;
                <b style={{ color: "black", fontSize: "14px" }}>
                  {landingViewPdf?.[0]?.WorkplaceName}
                </b>
                &nbsp;Current Account No.&nbsp;
                <b style={{ color: "black", fontSize: "14px" }}>
                  {landingViewPdf?.[0]?.CompAccountNumber}, Date:&nbsp;
                  {landingViewPdf?.[0]?.Today}&nbsp;
                </b>
                for an amount of&nbsp;
                <b style={{ color: "black", fontSize: "14px" }}>
                  Tk.&nbsp;{landingViewPdf?.[0]?.TotalBankPay.toFixed(2)}
                  /-&nbsp;
                  {`(${landingViewPdf?.[0]?.TotalBankPayInWords}) taka Only`}
                  &nbsp;
                </b>
                and credit the same amount to the respective employees account
                as per list attached herewith against employee{" "}
                <b style={{ color: "black", fontSize: "14px" }}>
                  Monthly Salary of {landingViewPdf?.[0]?.MonthName.slice(0, 3)}
                  -{landingViewPdf?.[0]?.YearId}.
                </b>
                &nbsp;
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                Your early action in this regards will be highly appreciated.
              </p>
              <br />

              <div style={{ marginTop: "50px" }}>
                <b style={{ color: "black", fontSize: "14px" }}>
                  Monthly Salary of {landingViewPdf?.[0]?.MonthName.slice(0, 3)}
                  -{landingViewPdf?.[0]?.YearId}.
                  <br />
                  Payment Date: {landingViewPdf?.[0]?.Today}
                </b>
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
                        Employee ID
                      </th>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Account Holder Name
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
                        Amount
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
                    {landingViewPdf.length > 0 && (
                      <tr>
                        <th
                          style={{
                            border: "1px solid #D3D3D3",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        ></th>
                        <th
                          style={{
                            border: "1px solid #D3D3D3",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        ></th>
                        <th
                          colSpan="2"
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
                            textAlign: "left",
                          }}
                        >
                          {landingViewPdf?.[0]?.TotalBankPay.toFixed(2)}
                        </th>
                      </tr>
                    )}
                  </tbody>
                </table>
                <b style={{ color: "black", fontSize: "14px" }}>
                  Inword:&nbsp;{landingViewPdf?.[0]?.TotalBankPayInWords}
                  &nbsp;only
                </b>
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
