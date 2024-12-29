export default function DigitalPaymentLetterHead({
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
            <div style={{ margin: "0px 96px", fontSize: "14px" }}>
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
                        {""}
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
