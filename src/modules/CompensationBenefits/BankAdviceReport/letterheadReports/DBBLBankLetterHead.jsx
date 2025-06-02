import { shallowEqual, useSelector } from "react-redux";

export default function DBBLBankLetterHead({
  letterHeadImage,
  landingViewPdf,
  signatureImage,
}) {
  const { intAccountId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
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
                {intAccountId == 1
                  ? "Head of Agent Banking Division"
                  : "The Manager,"}
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                {intAccountId == 1
                  ? "Dutch-Bangla Bank PLC"
                  : landingViewPdf?.[0]?.CompBankName}
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                {landingViewPdf?.[0]?.CompBranchName}
              </p>
              <p style={{ color: "black", fontSize: "14px" }}>
                {landingViewPdf?.[0]?.CompBankAddress}
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                Dear Recipients,
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                <b>
                  REQUEST TO DISBURSE EMPLOYEE SALARY&nbsp;
                  {landingViewPdf?.[0]?.MonthName.toUpperCase()},&nbsp;
                  {landingViewPdf?.[0]?.YearId}.
                </b>
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                With due respect, please disburse the net payable amount&nbsp;
                <b style={{ color: "black", fontSize: "14px" }}>
                  {landingViewPdf?.[0]?.TotalBankPay.toFixed(2)}&nbsp;
                  {`(${landingViewPdf?.[0]?.TotalBankPayInWords})`}&nbsp;
                </b>
                as Emoloyee Salary&nbsp;
                {landingViewPdf?.[0]?.MonthName},&nbsp;
                {landingViewPdf?.[0]?.YearId} to the all account holders as per
                attached sheet from our Company Account
                <b style={{ color: "black", fontSize: "14px" }}>
                  {`(${landingViewPdf?.[0]?.CompAccountNumber})`}.
                </b>
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>
                We are looking forward for your kind cooperation.
              </p>
              <br />
              <p style={{ color: "black", fontSize: "14px" }}>Thanking You,</p>
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
                        Employee ID
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
                        Account Number
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
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        Remark
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
                        <td
                          style={{
                            border: "1px solid #D3D3D3",
                            padding: "4px",
                          }}
                        >
                          {item?.Remark}
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
                            textAlign: "center",
                          }}
                        ></th>
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
