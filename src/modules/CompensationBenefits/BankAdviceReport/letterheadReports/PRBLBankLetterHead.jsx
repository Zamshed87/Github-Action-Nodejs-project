import React from "react";

export default function PRBLBankLetterHead({
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
                Date: {landingViewPdf?.[0]?.Today}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Our Ref:{" "}
                {`${landingViewPdf?.[0]?.WorkplaceCode}/AF/${landingViewPdf?.[0]?.MonthName}/${landingViewPdf?.[0]?.YearId}`}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Your Ref:{" "}
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>The Manager,</p>
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
                Subject:&nbsp;
                <b>
                  <u>Fund Transfer</u>
                </b>
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>Dear Sir,</p>
              <p style={{ color: "black", fontSize: "14px" }}>
                Requesting you to effect transfer of fund as details below:
              </p>
              <br />{" "}
              <p style={{ color: "black", fontSize: "14px" }}>
                <b>
                  <u>Details of Transfer:</u>
                </b>
              </p>
              <br />
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                }}
              >
                <thead>
                  <tr>
                    <th
                      rowSpan={"2"}
                      style={{
                        border: "1px solid #D3D3D3",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      Account No to be debited
                    </th>
                    <th
                      colSpan={"2"}
                      style={{
                        border: "1px solid #D3D3D3",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      Account No. to be Credited
                    </th>
                    <th
                      style={{
                        border: "1px solid #D3D3D3",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                  <tr>
                    {" "}
                    <th
                      style={{
                        border: "1px solid #D3D3D3",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      Account Name
                    </th>
                    <th
                      style={{
                        border: "1px solid #D3D3D3",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      Account No
                    </th>
                    <th
                      style={{
                        border: "1px solid #D3D3D3",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      (In BDT)
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
                        {landingViewPdf?.[0]?.CompAccountNumber}
                      </td>
                      <td
                        style={{
                          border: "1px solid #D3D3D3",
                          padding: "4px",
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
                        {item?.NeyPayableSalary?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {landingViewPdf.length > 0 && (
                    <tr>
                      <th
                        colSpan="3"
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
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                <b>
                  Amount in Words:{" "}
                  {`(${landingViewPdf?.[0]?.TotalBankPayInWords} Only)`}
                </b>
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                {landingViewPdf?.[0]?.Remarks}
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                Thanks in advance anticipating your cooperation and execution.
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>Thanking You</p>
              <p style={{ color: "black", fontSize: "14px" }}>For,</p>
              <p style={{ color: "black", fontSize: "14px" }}>
                {landingViewPdf?.[0]?.CompName}
              </p>
              <br />
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
