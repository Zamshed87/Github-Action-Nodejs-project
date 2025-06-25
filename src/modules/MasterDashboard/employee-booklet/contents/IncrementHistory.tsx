import NoResult from "common/NoResult";
import React, { forwardRef } from "react";
import { dateFormatter } from "utility/dateFormatter";
import { numberWithCommas } from "utility/numberWithCommas";

const IncrementHistory = forwardRef((props: any, ref: any) => {
  const incHistory = props?.incrementHistory;
  return (
    <div ref={ref} style={{ fontSize: "12px" }}>
      <center>
        <h1 style={{ fontSize: "16px", marginBottom: "10px" }}>
          {" "}
          Increment History
        </h1>
      </center>
      <div>
        {incHistory?.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th className="sortable" style={{ width: "30px" }}>
                  SL
                </th>
                <th>Increment Date</th>
                <th>Increment Amount</th>
                <th>Curr. Gross Salary</th>
                <th>Prev Gross Salary</th>
                <th>Salary Type</th>
                <th>Slab Count</th>
              </tr>
            </thead>
            <tbody>
              <>
                {incHistory?.map((data: any, index: number) => (
                  <tr key={index}>
                    <td
                      style={{
                        background:
                          data?.strStatus === "Pending" ? "#FEF9DF" : "",
                      }}
                    >
                      <div className="tableBody-title pl-1">{index + 1}</div>
                    </td>
                    <td
                      style={{
                        background:
                          data?.strStatus === "Pending" ? "#FEF9DF" : "",
                      }}
                    >
                      {dateFormatter(data?.dteEffectiveDate)}
                    </td>
                    <td
                      style={{
                        background:
                          data?.strStatus === "Pending" ? "#FEF9DF" : "",
                      }}
                    >
                      <div>{data?.numIncrementAmount}</div>
                    </td>
                    <td
                      style={{
                        background:
                          data?.strStatus === "Pending" ? "#FEF9DF" : "",
                      }}
                    >
                      <div>{numberWithCommas(data?.numCurrentGrossAmount)}</div>
                    </td>
                    <td
                      style={{
                        background:
                          data?.strStatus === "Pending" ? "#FEF9DF" : "",
                      }}
                    >
                      <div>{numberWithCommas(data?.numOldGrossAmount)}</div>
                    </td>
                    <td
                      style={{
                        background:
                          data?.strStatus === "Pending" ? "#FEF9DF" : "",
                      }}
                    >
                      <div>{data?.isGradeBasedSalary ? "Grade" : "Non-Grade"}</div>
                    </td>
                    <td
                      style={{
                        background:
                          data?.strStatus === "Pending" ? "#FEF9DF" : "",
                      }}
                    >
                      <div>{data?.slabCount}</div>
                    </td>
                  </tr>
                ))}
              </>
            </tbody>
          </table>
        ) : (
          <NoResult />
        )}
      </div>
    </div>
  );
});

export default IncrementHistory;
