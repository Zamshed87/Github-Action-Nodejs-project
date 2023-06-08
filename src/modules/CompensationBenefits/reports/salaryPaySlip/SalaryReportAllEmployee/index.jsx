// import { EditOutlined, RemoveRedEyeOutlined } from "@mui/icons-material";
// import React from "react";
// import ActionMenu from "../../../../../common/ActionMenu";
// import ScrollableTable from "../../../../../common/ScrollableTable";
import PrintView from "../../../../../common/PrintView";
import "./styles.css";

const tableHeading = [
  { name: "Personal ", col: "2" },
  { name: "Salary", col: "2" },
  { name: "Leave", col: "8" },
  { name: "Attendance ", col: "5" },
  { name: "Overtime", col: "3" },
  { name: "Att. Bouns" },
  { name: "Allowance", col: "5" },
  { name: "Deduction", row: "2" },
  { name: "Loan", row: "2" },
  { name: "Stamp", row: "2" },
  { name: "Net Payable", row: "2" },
  { name: "Signature", row: "2" },
];
const tHead2 = [
  { name: "Employee" },
  { name: "Grade" },
  { name: "Gross" },
  { name: "Basic" },
  { name: "C/L" },
  { name: "S/L" },
  { name: "E/L" },
  { name: "P/L" },
  { name: "M/L" },
  { name: "LWP" },
  { name: "PDL" },
  { name: "U/L" },
  { name: "Working Day", rotate: true },
  { name: "Present", rotate: true },
  { name: "Absent", rotate: true },
  { name: "Off Day", rotate: true },
  { name: "Holiday", rotate: true },
  { name: "OT Rate", rotate: true },
  { name: "OT Amt. (tk)", rotate: true },
  { name: "OT Hr.", rotate: true },
  { name: "Att. Bonus", rotate: true },
  { name: "Arrear", rotate: true },
  { name: "N/A", rotate: true },
  { name: "N/A Amt.", rotate: true },
  { name: "E/S", rotate: true },
  { name: "E/S Amt.", rotate: true },
];
const tableData = [
  {
    item1: "item-1",
    item2: "item2",
    item3: "item3",
    item4: "item4",
    item5: "item-3",
    item6: "item-3",
    item7: "item-3",
    item8: "item-3",
    item9: "item-3",
    item10: "item-1",
    item11: "item-2",
    item12: "item-3",
    item13: "item-3",
    item14: "item-3",
    item15: "item-3",
    item16: "item-3",
    item17: "item-3",
    item18: "item-3",
    item19: "item-3",
    item20: "item-3",
    item21: "item-3",
    item22: "item-3",
    item23: "item-3",
    item24: "item-3",
    item25: "item-3",
    item26: "item-3",
    item27: "item-3",
    item28: "item-3",
    item29: "item-3",
    item30: "item-3",
  },
  {
    item1: "item-1",
    item2: "item2",
    item3: "item3",
    item4: "item4",
    item5: "item-3",
    item6: "item-3",
    item7: "item-3",
    item8: "item-3",
    item9: "item-3",
    item10: "item-1",
    item11: "item-2",
    item12: "item-3",
    item13: "item-3",
    item14: "item-3",
    item15: "item-3",
    item16: "item-3",
    item17: "item-3",
    item18: "item-3",
    item19: "item-3",
    item20: "item-3",
    item21: "item-3",
    item22: "item-3",
    item23: "item-3",
    item24: "item-3",
    item25: "item-3",
    item26: "item-3",
    item27: "item-3",
    item28: "item-3",
    item29: "item-3",
    item30: "item-3",
  },
  {
    item1: "item-1",
    item2: "item2",
    item3: "item3",
    item4: "item4",
    item5: "item-3",
    item6: "item-3",
    item7: "item-3",
    item8: "item-3",
    item9: "item-3",
    item10: "item-1",
    item11: "item-2",
    item12: "item-3",
    item13: "item-3",
    item14: "item-3",
    item15: "item-3",
    item16: "item-3",
    item17: "item-3",
    item18: "item-3",
    item19: "item-3",
    item20: "item-3",
    item21: "item-3",
    item22: "item-3",
    item23: "item-3",
    item24: "item-3",
    item25: "item-3",
    item26: "item-3",
    item27: "item-3",
    item28: "item-3",
    item29: "item-3",
    item30: "item-3",
  },
];
const SalaryReportAllEmployee = () => {
  return (
    <div className="print-preview-main">
      <PrintView theading="All Salary Sheet">
        <div className="saleryPaySlip-table-main mt-5 p-3">
          <table>
            <tr>
              {tableHeading.map((item, index) => {
                return (
                  <th
                    key={index}
                    colSpan={item?.col}
                    rowSpan={item?.row}
                    className={`${item?.row ? "rotate" : ""}`}
                  >
                    {item.name}
                  </th>
                );
              })}
            </tr>
            <tr>
              {tHead2.map((item, index) => {
                return (
                  <th
                    key={index}
                    scope="col"
                    className={`${item?.rotate ? "rotate" : ""}`}
                    rowSpan={item?.col}
                  >
                    {item?.name}
                  </th>
                );
              })}
            </tr>

            {tableData.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.item1}</td>
                  <td>{item.item2}</td>
                  <td>{item.item3}</td>
                  <td>{item.item4}</td>
                  <td>{item.item5}</td>
                  <td>{item.item6}</td>
                  <td>{item.item7}</td>
                  <td>{item.item8}</td>
                  <td>{item.item9}</td>
                  <td>{item.item10}</td>
                  <td>{item.item11}</td>
                  <td>{item.item12}</td>
                  <td>{item.item13}</td>
                  <td>{item.item14}</td>
                  <td>{item.item15}</td>
                  <td>{item.item16}</td>
                  <td>{item.item17}</td>
                  <td>{item.item18}</td>
                  <td>{item.item19}</td>
                  <td>{item.item20}</td>
                  <td>{item.item21}</td>
                  <td>{item.item22}</td>
                  <td>{item.item23}</td>
                  <td>{item.item24}</td>
                  <td>{item.item25}</td>
                  <td>{item.item26}</td>
                  <td>{item.item27}</td>
                  <td>{item.item28}</td>
                  <td>{item.item29}</td>
                  <td>{item.item30}</td>
                  <td></td>
                </tr>
              );
            })}
          </table>
        </div>
      </PrintView>
    </div>
  );
};

export default SalaryReportAllEmployee;
