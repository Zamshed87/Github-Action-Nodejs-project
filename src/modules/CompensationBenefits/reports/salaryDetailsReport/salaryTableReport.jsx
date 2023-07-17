import React from "react";
import AvatarComponent from "../../../../common/AvatarComponent";
import ScrollableTable from "../../../../common/ScrollableTable";
import { numberWithCommas } from "../../../../utility/numberWithCommas";
import { colSumForDetailsReport } from "../../salaryGenerate/helper";
import { dateFormatter } from "../../../../utility/dateFormatter";

export const getSingleSumOfRow = (item, headArr) => {
  let sum = 0;
  headArr?.forEach((cell) => {
    sum += item[cell] || 0;
  });
  return sum;
};
    
function SalaryTableReport({
  rowDto,
  tableColumn,
  tableAllowanceHead,
  tableDeductionHead,
}) {
  return (
    <>
      <ScrollableTable
        classes="salary-process-table"
        secondClasses="table-card-styled tableOne scroll-table-height"
        customClass="salary-details-custom"
      >
        <thead>
          <tr>
            <th rowSpan="2" className="text-left">
              SN
            </th>
            <th
              rowspan="2"
              style={{ minWidth: "100px" }}
              className="text-center"
            >
              Employee's ID
            </th>
            <th rowspan="2" className="text-center">
              Employee's Name
            </th>
            <th rowspan="2" className="text-center">
              Designation
            </th>
            <th rowspan="2" className="text-center">
              PIN
            </th>
            <th rowspan="2" className="text-center">
              Joining Date
            </th>
            <th rowspan="2" className="text-center">
              Present
            </th>
            <th rowspan="2" className="text-center">
              Approved Leave
            </th>
            <th rowspan="2" className="text-center">
              Absent
            </th>
            {tableColumn?.length > 0 && (
              <th colSpan={tableColumn?.length} className="text-center">
                Earnings
              </th>
            )}
            <th rowspan="2" className="text-center">
              Gross Salary <br />{" "}
              <span>
                {numberWithCommas(
                  colSumForDetailsReport(rowDto, `numGrossSalary`).toFixed(2)
                )}
              </span>
            </th>
            <th rowspan="2" className="text-center">
              Arrear Salary <br />{" "}
              <span>
                {numberWithCommas(
                  colSumForDetailsReport(rowDto, `numArearSalary`).toFixed(2)
                )}
              </span>
            </th>
            {tableAllowanceHead?.length > 0 && (
              <th colSpan={tableAllowanceHead?.length} className="text-center">
                Allowance
              </th>
            )}
            <th rowspan="2" className="text-center">
              Total Salary
            </th>

            <th
              colSpan={
                tableDeductionHead?.length > 0
                  ? tableDeductionHead?.length + 2
                  : 0 + 2
              }
              className="text-center"
            >
              Deduction
            </th>

            {/* deduction head  end */}
            <th rowspan="2" className="text-center">
              Net Salary <br />{" "}
              <span>
                {numberWithCommas(
                  colSumForDetailsReport(rowDto, `NetSalary`).toFixed(2)
                )}
              </span>
            </th>
            <th rowspan="2" className="text-center">
              PF (Com.) <br />{" "}
              <span>
                {numberWithCommas(
                  colSumForDetailsReport(rowDto, `numPFCompany`).toFixed(2)
                )}
              </span>
            </th>
            <th rowspan="2" className="text-center">
              Gratuity <br />{" "}
              <span>
                {numberWithCommas(
                  colSumForDetailsReport(rowDto, `numGratuity`).toFixed(2)
                )}
              </span>
            </th>
            <th rowspan="2" className="text-center">
              Total PF & Gratuity <br />{" "}
              <span>
                {numberWithCommas(
                  colSumForDetailsReport(rowDto, `TotalPfNGratuity`).toFixed(2)
                )}
              </span>
            </th>
            <th rowspan="2" className="text-center">
              Total Cost at Salary <br />{" "}
              <span>
                {numberWithCommas(
                  colSumForDetailsReport(rowDto, `TotalCostOfSalary`).toFixed(2)
                )}
              </span>
            </th>
          </tr>
          <tr>
            {/* basic head  */}
            {tableColumn?.map((cell) => {
              return (
                <th className="green" style={{ textAlign: "center" }}>
                  {cell} <br />{" "}
                  <span>
                    {numberWithCommas(
                      colSumForDetailsReport(rowDto, `${cell}`).toFixed(2)
                    )}
                  </span>
                </th>
              );
            })}

            {/* allowance head  */}
            {tableAllowanceHead?.length > 0 &&
              tableAllowanceHead?.map((cell) => {
                return (
                  <th className="warnHead" style={{ textAlign: "center" }}>
                    {cell} <br />{" "}
                    <span>
                      {numberWithCommas(
                        colSumForDetailsReport(rowDto, `${cell}`).toFixed(2)
                      )}
                    </span>
                  </th>
                );
              })}

            {/* deduction head  */}
            <th className="infoHead" style={{ textAlign: "center" }}>
              PF <br />{" "}
              <span>
                {numberWithCommas(
                  colSumForDetailsReport(rowDto, `numPFAmount`).toFixed(2)
                )}
              </span>
            </th>
            <th className="infoHead" style={{ textAlign: "center" }}>
              Tax <br />{" "}
              <span>
                {numberWithCommas(
                  colSumForDetailsReport(rowDto, `numTaxAmount`).toFixed(2)
                )}
              </span>
            </th>
            {tableDeductionHead?.length > 0 &&
              tableDeductionHead?.map((cell) => {
                return (
                  <th className="infoHead" style={{ textAlign: "center" }}>
                    {cell} <br />{" "}
                    <span>
                      {numberWithCommas(
                        colSumForDetailsReport(rowDto, `${cell}`).toFixed(2)
                      )}
                    </span>
                  </th>
                );
              })}
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((item, index) => (
            <tr key={index}>
              <td
                style={{ minWidth: 150 }}
                className={item?.DeptName.trim()  ? "rowClass" : ""}
              >
                <div>
                  {item?.DeptName.trim() ? (
                    item?.DeptName === "Sub-Total:" ? (
                      <b>Sub-Total:</b>
                    ) : (
                      <b>Depertment: {item?.DeptName}</b>
                    )
                  ) : (
                    item?.sl
                  )}
                </div>
              </td>
              <td style={{ minWidth: 150 }}>
                {item?.DeptName.trim()  ? <></> : item?.strEmployeeCode}
              </td>
              <td>
                {" "}
                {item?.DeptName.trim()  ? (
                  <></>
                ) : (
                  <div className="d-flex align-items-center">
                    <div className="emp-avatar">
                      <AvatarComponent
                        classess=""
                        letterCount={1}
                        label={item?.strEmployeeName}
                      />
                    </div>
                    <div className="ml-2">
                      <span className="tableBody-title">
                        {item?.strEmployeeName}
                      </span>
                    </div>
                  </div>
                )}
              </td>
              <td>{item?.DeptName.trim()  ? <></> : item?.strDesignation}</td>
              <td style={{ textAlign: "center" }}>
                {item?.DeptName.trim()  ? <></> : item?.PIN}
              </td>
              <td style={{ textAlign: "center" }}>
                {item?.DeptName.trim()  ? <></> : dateFormatter(item?.dteJoiningDate)}
              </td>
              <td style={{ textAlign: "center" }}>
                {item?.DeptName.trim()  ? <></> : item?.intPresent}
              </td>
              <td style={{ textAlign: "center" }}>
                {item?.DeptName.trim()  ? <></> : item?.ApprovedLeave}
              </td>
              <td style={{ textAlign: "center" }}>
                {item?.DeptName.trim()  ? <></> : item?.intAbsent}
              </td>
              {/* salary */}
              {tableColumn?.length > 0 &&
                tableColumn?.map((cell, index) => {
                  return (
                    <td
                      key={index}
                      style={{ textAlign: "right" }}
                      className={item?.DeptName.trim()  ? "rowClass" : ""}
                    >
                      {item?.DeptName.trim()  ? (
                        item?.DeptName === "Sub-Total:" ? (
                          <b>{numberWithCommas(item[`${cell}`]) || 0}</b>
                        ) : (
                          <></>
                        )
                      ) : (
                        numberWithCommas(item[`${cell}`]) || 0
                      )}
                    </td>
                  );
                })}
              <td style={{ textAlign: "right" }}>
                {item?.DeptName.trim()  ? (
                  item?.DeptName === "Sub-Total:" ? (
                    <b>{numberWithCommas(item?.numGrossSalary) || 0}</b>
                  ) : (
                    <></>
                  )
                ) : (
                  numberWithCommas(item?.numGrossSalary) || 0
                )}
              </td>
              <td style={{ textAlign: "right" }}>
                {item?.DeptName.trim()  ? (
                  item?.DeptName === "Sub-Total:" ? (
                    <b>{numberWithCommas(item?.numArearSalary) || 0}</b>
                  ) : (
                    <></>
                  )
                ) : (
                  numberWithCommas(item?.numArearSalary) || 0
                )}
              </td>

              {/* allowence  */}
              {tableAllowanceHead?.length > 0 &&
                tableAllowanceHead?.map((cell, index) => {
                  return (
                    <td
                      key={index}
                      style={{ textAlign: "right" }}
                      className={item?.DeptName.trim()  ? "rowClass" : ""}
                    >
                      {item?.DeptName.trim()  ? (
                        item?.DeptName === "Sub-Total:" ? (
                          <b>{numberWithCommas(item[`${cell}`]) || 0}</b>
                        ) : (
                          <></>
                        )
                      ) : (
                        numberWithCommas(item[`${cell}`]) || 0
                      )}
                    </td>
                  );
                })}
              <td style={{ textAlign: "right" }}>
                {item?.DeptName.trim()  ? (
                  item?.DeptName === "Sub-Total:" ? (
                    <b>{numberWithCommas(item?.TotalSalary) || 0}</b>
                  ) : (
                    <></>
                  )
                ) : (
                  numberWithCommas(item?.TotalSalary) || 0
                )}
              </td>

              {/* deduction */}
              <td
                style={{ textAlign: "right" }}
                className={item?.DeptName.trim()  ? "rowClass" : ""}
              >
                {item?.DeptName.trim()  ? (
                  item?.DeptName === "Sub-Total:" ? (
                    <b>{numberWithCommas(item?.numPFAmount) || 0}</b>
                  ) : (
                    <></>
                  )
                ) : (
                  numberWithCommas(item?.numPFAmount) || 0
                )}
              </td>
              <td
                style={{ textAlign: "right" }}
                className={item?.DeptName.trim()  ? "rowClass" : ""}
              >
                {item?.DeptName.trim()  ? (
                  item?.DeptName === "Sub-Total:" ? (
                    <b>{numberWithCommas(item?.numTaxAmount) || 0}</b>
                  ) : (
                    <></>
                  )
                ) : (
                  numberWithCommas(item?.numTaxAmount) || 0
                )}
              </td>
              {tableDeductionHead?.length > 0 &&
                tableDeductionHead?.map((cell, index) => {
                  return (
                    <td
                      key={index}
                      style={{ textAlign: "right" }}
                      className={item?.DeptName.trim()  ? "rowClass" : ""}
                    >
                      {item?.DeptName.trim()  ? (
                        item?.DeptName === "Sub-Total:" ? (
                          <b>{numberWithCommas(item[`${cell}`]) || 0}</b>
                        ) : (
                          <></>
                        )
                      ) : (
                        numberWithCommas(item[`${cell}`]) || 0
                      )}
                    </td>
                  );
                })}

              {/* common */}
              <td style={{ textAlign: "right" }}>
                {item?.DeptName.trim()  ? (
                  item?.DeptName === "Sub-Total:" ? (
                    <b>{numberWithCommas(item?.NetSalary) || 0}</b>
                  ) : (
                    <></>
                  )
                ) : (
                  numberWithCommas(item?.NetSalary) || 0
                )}
              </td>
              <td style={{ textAlign: "right" }}>
                {item?.DeptName.trim()  ? (
                  item?.DeptName === "Sub-Total:" ? (
                    <b>{numberWithCommas(item?.numPFCompany) || 0}</b>
                  ) : (
                    <></>
                  )
                ) : (
                  numberWithCommas(item?.numPFCompany) || 0
                )}
              </td>
              <td style={{ textAlign: "right" }}>
                {item?.DeptName.trim()  ? (
                  item?.DeptName === "Sub-Total:" ? (
                    <b>{numberWithCommas(item?.numGratuity) || 0}</b>
                  ) : (
                    <></>
                  )
                ) : (
                  numberWithCommas(item?.numGratuity) || 0
                )}
              </td>
              <td style={{ textAlign: "right" }}>
                {item?.DeptName.trim()  ? (
                  item?.DeptName === "Sub-Total:" ? (
                    <b>{numberWithCommas(item?.TotalPfNGratuity) || 0}</b>
                  ) : (
                    <></>
                  )
                ) : (
                  numberWithCommas(item?.TotalPfNGratuity) || 0
                )}
              </td>
              <td style={{ textAlign: "right" }}>
                {item?.DeptName.trim()  ? (
                  item?.DeptName === "Sub-Total:" ? (
                    <b>{numberWithCommas(item?.TotalCostOfSalary) || 0}</b>
                  ) : (
                    <></>
                  )
                ) : (
                  numberWithCommas(item?.TotalCostOfSalary) || 0
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
    </>
  );
}
