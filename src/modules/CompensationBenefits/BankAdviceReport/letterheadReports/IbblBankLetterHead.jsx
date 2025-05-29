export default function IbblBankLetterHead({
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
                &nbsp;Salary Disbursement for the month of&nbsp;
                {landingViewPdf?.[0]?.MonthName},&nbsp;
                {landingViewPdf?.[0]?.YearId}&nbsp;of&nbsp;
                <b style={{ color: "black", fontSize: "14px" }}>
                  &quot;
                  {landingViewPdf?.[0]?.WorkplaceGroupName}
                  &quot;&nbsp;
                </b>
                employees.
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>Dear Sir,</p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                With due respect, we are requesting you to transfer the salary
                for the month of&nbsp;
                {landingViewPdf?.[0]?.MonthName},&nbsp;
                {landingViewPdf?.[0]?.YearId} of
                <b style={{ color: "black", fontSize: "14px" }}>
                  &nbsp;&quot;
                  {landingViewPdf?.[0]?.WorkplaceGroupName}
                  &quot;&nbsp;
                </b>
                employees. Please debit <b>BDT</b>&nbsp;
                <b style={{ color: "black", fontSize: "14px" }}>
                  {landingViewPdf?.[0]?.TotalBankPay?.toFixed(2)}&nbsp;
                </b>
                from our company account no.&nbsp;
                <b style={{ color: "black", fontSize: "14px" }}>
                  {landingViewPdf?.[0]?.CompAccountNumber}&nbsp;
                </b>
                to disburse salaries as mentioned below.
              </p>
              <div style={{ marginTop: "50px" }}>
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
                        Account Number
                      </th>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Account Name
                      </th>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Net Payment
                      </th>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Payment Info
                      </th>
                      <th
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Branch
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {landingViewPdf?.map((item, index) => (
                      <tr key={index}>
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
                          {item?.EmpBankAccountNumber}
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
                          {item?.NeyPayableSalary?.toFixed(2)}
                        </td>
                        <td
                          style={{
                            border: "1px solid #D3D3D3",
                            padding: "8px",
                          }}
                        >
                          {""}
                        </td>
                        <td
                          style={{
                            border: "1px solid #D3D3D3",
                            padding: "8px",
                          }}
                        >
                          {item?.EmpBranchName}
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
