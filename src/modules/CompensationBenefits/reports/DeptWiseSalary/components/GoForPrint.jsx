import React, { useState, useEffect } from "react";
import PrintView from "../../../../../common/PrintView";
import "../deptWiseSalary.css";

const tableData = [
  {
    department: "OFFICERS & STAF",
    manPower: 110,
    otAmt: "2299.77",
    eSide: "0.00",
    naAmt: "5660.00",
    attBonus: "0.00",
    salary: "1716592.89",
    grossSalary: "1746592.66",
    cbaSubscription: "3040.00",
    deductAmt: "0.00",
    netPayble: "1746592.66",
  },
  {
    department: "SECURITY DEPT",
    manPower: 36,
    otAmt: "0.00",
    eSide: "0.00",
    naAmt: "7660.00",
    attBonus: "0.00",
    salary: "537885.39",
    grossSalary: "544585.39",
    cbaSubscription: "0.00",
    deductAmt: "0.00",
    netPayble: "544585.39",
  },
  {
    department: "BLOWROOM/CARDING",
    manPower: 107,
    otAmt: "25139.00",
    eSide: "0.00",
    naAmt: "6020.00",
    attBonus: "20000.00",
    salary: "649623.78",
    grossSalary: "700782.78",
    cbaSubscription: "4280.00",
    deductAmt: "0.00",
    netPayble: "696502.78",
  },
  {
    department: "DRAWING/SIMPLEX",
    manPower: 29,
    otAmt: "10815.88",
    eSide: "0.00",
    naAmt: "1770.00",
    attBonus: "4000.00",
    salary: "181068.36",
    grossSalary: "197654.24",
    cbaSubscription: "1160.00",
    deductAmt: "0.00",
    netPayble: "196490.24",
  },
];

const GoForPrintSalary = () => {
  const [rowDto, setRowDto] = useState([]);

  useEffect(() => {
    setRowDto(tableData);
  }, []);
  return (
    <>
      <div className="dept-salary-width">
        <PrintView isSignature theading="Salary report by department">
          <div className="dept-salary-print">
            <div className="goForPrintBody">
              <div className="table-title" style={{ marginBottom: "10px" }}>
                <h4>Salary & Wages for the month of November 21</h4>
              </div>
              <div className="table-body">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Department</th>
                      <th scope="col">Man Power</th>
                      <th scope="col">O.T AMT</th>
                      <th scope="col">E.SIDE</th>
                      <th scope="col">N/A AMT</th>
                      <th scope="col">ATT. Bonus</th>
                      <th scope="col">Salary</th>
                      <th scope="col">Gross Salary</th>
                      <th scope="col">C.B.A Subscription</th>
                      <th scope="col">Deduct AMT</th>
                      <th scope="col">Net Payable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((data, index) => (
                      <>
                        <tr key={index}>
                          <td>{data?.department}</td>
                          <td>{data?.manPower}</td>
                          <td>{data?.otAmt}</td>
                          <td>{data?.eSide}</td>
                          <td>{data?.naAmt}</td>
                          <td>{data?.attBonus}</td>
                          <td>{data?.salary}</td>
                          <td>{data?.grossSalary}</td>
                          <td>{data?.cbaSubscription}</td>
                          <td>{data?.deductAmt}</td>
                          <td>{data?.netPayble}</td>
                        </tr>
                      </>
                    ))}
                    <tr style={{ borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}>
                      <td style={{ fontWeight: "bold" }}>Total</td>
                      <td style={{ fontWeight: "bold" }}>285</td>
                      <td style={{ fontWeight: "bold" }}>55299.77</td>
                      <td style={{ fontWeight: "bold" }}>0.00</td>
                      <td style={{ fontWeight: "bold" }}>19990.00</td>
                      <td style={{ fontWeight: "bold" }}>24000.00</td>
                      <td style={{ fontWeight: "bold" }}>3716592.98</td>
                      <td style={{ fontWeight: "bold" }}>3916592.98</td>
                      <td style={{ fontWeight: "bold" }}>8116.00</td>
                      <td style={{ fontWeight: "bold" }}>0.00</td>
                      <td style={{ fontWeight: "bold" }}>3916592.98</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </PrintView>
      </div>
    </>
  );
};

export default GoForPrintSalary;
