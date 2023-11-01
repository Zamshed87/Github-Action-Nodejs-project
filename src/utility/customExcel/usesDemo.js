// import { Cell } from "../../../utility/customExcel/createExcelHelper";
// import { createCommonExcelFile } from "../../../utility/customExcel/generateExcelAction";
// import { withDecimal } from "../../../utility/numberToWord";
// import { numberWithCommas } from "../../../utility/numberWithCommas";
// import { todayDate } from "../../../utility/todayDate";
// import { salaryDetailsExcelColumn2 } from "../reports/salaryDetailsReport/excel/excelStyle";
// import {
//   colSumForDetailsReport,
//   dynamicTableCellFunc,
// } from "../reports/salaryDetailsReport/helper";

// const widthList = {
//   A: 25,
//   B: 30,
//   C: 10,
//   D: 30,
//   E: 30,
// };

// export const generateSalaryGenerateDetailsExcel = ({
//   data,
//   tableColumn,
//   tableAllowanceHead,
//   tableDeductionHead,
//   monthYear,
//   buAddress,
//   buUnit,
// }) => {
//   const tableHeader = {
//     ...salaryDetailsExcelColumn2,
//     ...dynamicTableCellFunc(tableColumn),
//     ...dynamicTableCellFunc(tableAllowanceHead),
//     numTotalAllowance: "Total Allowance",
//     numTotalGrossSalary: "Total Gross Salary",
//     ...dynamicTableCellFunc(tableDeductionHead),
//     numPFAmount: "PF",
//     numTaxAmount: "Tax",
//     numTotalDeduction: "Total Deduction",
//     netPay: "Net Pay",
//     bankPay: "Bank Pay",
//     cashPay: "Cash Pay",
//   };
//   createCommonExcelFile({
//     titleWithDate: `Salary Generate Details ${monthYear}`,
//     tableHeader: tableHeader,
//     getTableData: () =>
//       getTableDataForExcel(
//         data,
//         tableColumn,
//         tableAllowanceHead,
//         tableDeductionHead
//       ),
//     tableFooter: generateFooterData(
//       data,
//       tableColumn,
//       tableAllowanceHead,
//       tableDeductionHead
//     ),
//     widthList: widthList,
//     fromDate: todayDate(),
//     toDate: todayDate(),
//     buAddress,
//     businessUnit: buUnit,
//     tableHeadFontSize: 10,
//     commonCellRange: "A1:J1",
//     extraInfo: {
//       text: `In Word: ${withDecimal(
//         colSumForDetailsReport(data, "netPay")
//       )} Taka Only`,
//       fontSize: 13,
//       bold: true,
//       cellRange: "A1:J1",
//       merge: true,
//       alignment: "left:middle",
//     },
//   });
// };

// const getTableDataForExcel = (
//   row,
//   tableHeaderArr,
//   tableAllowanceHead,
//   tableDeductionHead
// ) => {
//   const data = row?.map((item, index) => {
//     return [
//       new Cell(
//         item?.DeptName?.trim()
//           ? item?.DeptName === "Sub-Total:"
//             ? "Sub-Total:"
//             : `Depertment: ${item?.DeptName}`
//           : item?.sl,
//         "left",
//         "text",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       new Cell(
//         !item?.DeptName?.trim() ? item?.strEmployeeCode : " ",
//         "center",
//         "text",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       new Cell(
//         !item?.DeptName?.trim() ? item?.strEmployeeName : " ",
//         "left",
//         "text",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       new Cell(
//         !item?.DeptName?.trim() ? item?.strDesignation : " ",
//         "left",
//         "text",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       new Cell(
//         !item?.DeptName?.trim() ? item?.intPayableDays : " ",
//         "center",
//         "text",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       new Cell(
//         !item?.DeptName?.trim() ? item?.intPresent : " ",
//         "center",
//         "text",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       new Cell(
//         !item?.DeptName?.trim() ? item?.numOverTimeHour : " ",
//         "center",
//         "text",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       new Cell(
//         !item?.DeptName?.trim() ? item?.numOverTimeAmount : " ",
//         "right",
//         "amount",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       new Cell(
//         item?.DeptName?.trim()
//           ? item?.DeptName === "Sub-Total:"
//             ? `${numberWithCommas(item?.numGrossSalary)}`
//             : ""
//           : item?.numGrossSalary,
//         "right",
//         "amount",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       ...dynamicTableHeadCellFunc(tableHeaderArr, item),
//       ...dynamicTableHeadCellFunc(tableAllowanceHead, item),
//       new Cell(
//         item?.DeptName?.trim()
//           ? item?.DeptName === "Sub-Total:"
//             ? `${numberWithCommas(item?.numTotalAllowance)}`
//             : ""
//           : item?.numTotalAllowance,
//         // !item?.DeptName?.trim() ? item?.numTotalAllowance : " ",
//         "right",
//         "amount",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       new Cell(
//         item?.DeptName?.trim()
//           ? item?.DeptName === "Sub-Total:"
//             ? `${numberWithCommas(item?.numTotalGrossSalary)}`
//             : ""
//           : item?.numTotalGrossSalary,
//         // !item?.DeptName?.trim() ? item?.numTotalAllowance : " ",
//         "right",
//         "amount",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       ...dynamicTableHeadCellFunc(tableDeductionHead, item),
//       new Cell(
//         item?.DeptName?.trim()
//           ? item?.DeptName === "Sub-Total:"
//             ? `${numberWithCommas(item?.numPFAmount)}`
//             : ""
//           : item?.numPFAmount,
//         // !item?.DeptName?.trim() ? item?.numPFAmount : " ",
//         "right",
//         "amount",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       new Cell(
//         item?.DeptName?.trim()
//           ? item?.DeptName === "Sub-Total:"
//             ? `${numberWithCommas(item?.numTaxAmount)}`
//             : ""
//           : item?.numTaxAmount,
//         // !item?.DeptName?.trim() ? item?.numTaxAmount : " ",
//         "right",
//         "amount",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       new Cell(
//         item?.DeptName?.trim()
//           ? item?.DeptName === "Sub-Total:"
//             ? `${numberWithCommas(item?.numTotalDeduction)}`
//             : ""
//           : item?.numTotalDeduction,
//         // !item?.DeptName?.trim() ? item?.numTotalDeduction : " ",
//         "right",
//         "amount",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       new Cell(
//         item?.DeptName?.trim()
//           ? item?.DeptName === "Sub-Total:"
//             ? `${numberWithCommas(item?.netPay)}`
//             : " "
//           : item?.netPay,
//         "right",
//         "amount",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       new Cell(
//         item?.DeptName?.trim()
//           ? item?.DeptName === "Sub-Total:"
//             ? `${numberWithCommas(item?.bankPay)}`
//             : " "
//           : item?.bankPay,
//         "right",
//         "amount",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//       new Cell(
//         item?.DeptName?.trim()
//           ? item?.DeptName === "Sub-Total:"
//             ? `${numberWithCommas(item?.cashPay)}`
//             : " "
//           : item?.cashPay,
//         "right",
//         "amount",
//         item?.DeptName?.trim() ? true : false,
//         item?.DeptName?.trim() ? 10 : 9
//       ).getCell(),
//     ];
//   });
//   return data;
// };

// const dynamicTableHeadCellFunc = (tableHeaderArr, item) => {
//   const data = tableHeaderArr?.map((head) => {
//     return new Cell(
//       item?.DeptName?.trim()
//         ? item?.DeptName === "Sub-Total:"
//           ? `${numberWithCommas(item?.[head])}`
//           : ""
//         : item?.[head],
//       "right",
//       "amount",
//       item?.DeptName?.trim() ? true : false,
//       item?.DeptName?.trim() ? 10 : 9
//     ).getCell();
//   });
//   return data;
// };
// const dynamicTableHeadCellFunc2 = (arr, rowDto) => {
//   return arr?.map((cell) =>
//     numberWithCommas(colSumForDetailsReport(rowDto, `${cell}`).toFixed(2))
//   );
// };

// const generateFooterData = (
//   rowDto,
//   tableHeaderArr,
//   tableAllowanceHead,
//   tableDeductionHead
// ) => {
//   return [
//     " ",
//     " ",
//     " ",
//     " ",
//     " ",
//     " ",
//     " ",
//     "Grand Total",
//     numberWithCommas(
//       colSumForDetailsReport(rowDto, "numGrossSalary").toFixed(2)
//     ),
//     ...dynamicTableHeadCellFunc2(tableHeaderArr, rowDto),
//     ...dynamicTableHeadCellFunc2(tableAllowanceHead, rowDto),
//     numberWithCommas(
//       colSumForDetailsReport(rowDto, "numTotalAllowance").toFixed(2)
//     ),
//     numberWithCommas(
//       colSumForDetailsReport(rowDto, "numTotalGrossSalary").toFixed(2)
//     ),
//     ...dynamicTableHeadCellFunc2(tableDeductionHead, rowDto),
//     numberWithCommas(colSumForDetailsReport(rowDto, "numPFAmount").toFixed(2)),
//     numberWithCommas(colSumForDetailsReport(rowDto, "numTaxAmount").toFixed(2)),
//     numberWithCommas(
//       colSumForDetailsReport(rowDto, "numTotalDeduction").toFixed(2)
//     ),

//     numberWithCommas(colSumForDetailsReport(rowDto, "netPay").toFixed(2)),
//     numberWithCommas(colSumForDetailsReport(rowDto, "bankPay").toFixed(2)),
//     numberWithCommas(colSumForDetailsReport(rowDto, "cashPay").toFixed(2)),
//   ];
// };
