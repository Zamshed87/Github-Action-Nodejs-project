

import moment from "moment";
import { getRowTotal } from "../../../../../utility/getRowTotal";
import { createFile } from "./createFile";

const createExcelFile = (
  comapanyNameHeader,
  tableHeader,
  tableData,
  fromDate,
  toDate,
  businessUnit,
  moneyProcessId,
  rowDto,
  tableHeaderArr,
  totalSalary,
  totalAllowance,
  totalDeduction,
  totalNetPay,
  totalBankPay,
  totalDBPay,
  totalCashPay,
  totalBS,
  totalHR,
  totalMA,
  totalTA,
  totalOA,
  totalTD,
  totalLD,
  totalPFA,
  monthYear,
  buAddress,
  tableAllowanceHead,
  tableDeductionHead
) => {
  let tempObj = [];
  let tempObj2 = [];
  let tempObj3 = [];
  let tempMainRowData = [];
//  table header
  tableHeader.forEach((item) => {
    tempObj.push({
      text: item,
      fontSize: 8.5,
      bold: true,
      border: "all 000000 thin",
    });
  });
  // each row Data
  tableData.forEach((rowData) => {
    rowData.forEach((item) => {
      tempObj2.push({
        text: item,
        fontSize: 8.5,
        border: "all 000000 thin",
      });
    });

    tempMainRowData.push([...tempObj2]);
    tempObj2 = [];
  });
  // for total
  let tempTotal = [
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    "Total",
    getRowTotal(rowDto, "numGrossSalary"),
    ...dynamicTableHeadCellFunc(tableHeaderArr, rowDto),
    ...dynamicTableHeadCellFunc(tableAllowanceHead, rowDto),
    getRowTotal(rowDto, "numTotalAllowance"),
    ...dynamicTableHeadCellFunc(tableDeductionHead, rowDto),
    getRowTotal(rowDto, "numPFAmount"),
    getRowTotal(rowDto, "numTaxAmount"),
    getRowTotal(rowDto, "numTotalDeduction"),

    getRowTotal(rowDto, "netPay"),
    getRowTotal(rowDto, "bankPay"),
    getRowTotal(rowDto, "cashPay"),
  ];
 /*  let tempTotal = [
    " ",
    "Total",
    getRowTotal(rowDto, "numGrossSalary"),
    getRowTotal(rowDto, "numTotalAllowance"),
    getRowTotal(rowDto, "numTotalDeduction"),
    getRowTotal(rowDto, "netPay"),
    getRowTotal(rowDto, "bankPay"),
    getRowTotal(rowDto, "degitalBankPay"),
    getRowTotal(rowDto, "cashPay"),
    " ",
    " ",
    " ",
    ...dynamicTableHeadCellFunc(tableHeaderArr, rowDto),
    getRowTotal(rowDto, "numOverTimeAmount"),
    getRowTotal(rowDto, "numTaxAmount"),
    getRowTotal(rowDto, "numLoanAmount"),
    getRowTotal(rowDto, "numPFAmount"),
  ]; */
  tempTotal.forEach((item) => {
    tempObj3.push({
      text: item,
      fontSize: 8.5,
      bold: true,
      border: "all 000000 thin",
    });
  });
  const excel = {
    name: `Salary Details Report-${monthYear}`,
    sheets: [
      {
        name: `Salary Report-${monthYear}`,
        gridLine: false,
        rows: [
          ["_blank*2"],
          [
            {
              text: businessUnit,
              fontSize: 18,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: buAddress,
              fontSize: 15,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: `Salary Details Report-${monthYear}`,
              fontSize: 15,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          ["_blank*2"],
          [...tempObj],
          ...tempMainRowData,
          [...tempObj3],
          // [
          //   //   {
          //   //     text: "SL",
          //   //     fontSize: 8.5,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //   },
          //   //   {
          //   //     text: "Employee Name",
          //   //     fontSize: 9,
          //   //     // cellRange: "A1:B1",
          //   //     // merge: true,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //   },
          //   //   {
          //   //     text: "Employee Id",
          //   //     fontSize: 9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //   },
          //   //   {
          //   //     text: "Salary",
          //   //     fontSize: 9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //   },
          //   //   {
          //   //     text: "Total Allowance",
          //   //     fontSize: 9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //     alignment: "center",
          //   //   },
          //   //   {
          //   //     text: "Total Deduction",
          //   //     fontSize:  9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //     alignment: "center",
          //   //   },
          //   //   {
          //   //     text: "Net Pay",
          //   //     fontSize:  9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //   },
          //   //   {
          //   //     text: "Bank Pay",
          //   //     fontSize:  8.5,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //   },
          //   //   {
          //   //     text: "Digital Bank Pay",
          //   //     fontSize:  9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //     alignment: "center",
          //   //   },
          //   //   {
          //   //     text: "Cash Pay",
          //   //     fontSize:  9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //   },
          //   //   {
          //   //     text: "Workplace Name",
          //   //     fontSize:  8.5,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //   },
          //   //   {
          //   //     text: "Workplace Group",
          //   //     fontSize:  9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //     alignment: "center",
          //   //   },
          //   //   {
          //   //     text: "Payroll Group",
          //   //     fontSize: 9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //     alignment: "center",
          //   //   },
          //   //   {
          //   //     text: "Basic Salary",
          //   //     fontSize: 9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //   },
          //   //   {
          //   //     text: "House Rent",
          //   //     fontSize:  9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //   },
          //   //   {
          //   //     text: "Medical Allowance",
          //   //     fontSize: 9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //     alignment: "center",
          //   //   },
          //   //   {
          //   //     text: "Transport Allowance",
          //   //     fontSize:  9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //     alignment: "center",
          //   //   },
          //   //   {
          //   //     text: "Overtime Allowance",
          //   //     fontSize:  9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //     alignment: "center",
          //   //   },
          //   //   {
          //   //     text: "Tax Deduction",
          //   //     fontSize:  9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //   },
          //   //   {
          //   //     text: "Loan Deduction",
          //   //     fontSize:  9,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //   },
          //   //   {
          //   //     text: "Profident Fund Allowance",
          //   //     fontSize:  8.5,
          //   //     bold: true,
          //   //     border: "all 000000 thin",
          //   //     alignment: "left",
          //   //   },
          // ],
          ["_blank*2"],
          [
            {
              text: `System Generated Report-${moment().format('ll')}`,
              fontSize: 15,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          // ...getTableDataForExcel(rowDto),
          // [
          //   {
          //     text: "",
          //     fontSize: 8.8,
          //     bold: true,
          //     border: "all 000000 thin",
          //     alignment: "left:middle",
          //   },
          //   {
          //     text: "",
          //     fontSize: 8.8,
          //     border: "all 000000 thin",
          //   },
          //   {
          //     text: "Total",
          //     fontSize: 9,
          //     border: "all 000000 thin",
          //   },
          //   {
          //     text: totalSalary,
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: totalAllowance,
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: totalDeduction,
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: totalNetPay,
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: totalBankPay,
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: totalDBPay,
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: totalCashPay,
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: "",
          //     fontSize: 7,
          //     border: "all 000000 thin",
          //   },
          //   {
          //     text: "",
          //     fontSize: 7,
          //     border: "all 000000 thin",
          //   },
          //   {
          //     text: "",
          //     fontSize: 7,
          //     border: "all 000000 thin",
          //   },
          //   {
          //     text: totalBS,
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: totalHR,
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: totalMA,
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: totalTA,
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: totalOA,
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: totalTD,
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: totalLD,
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: totalPFA,
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          // ],
        ],
      },
    ],
  };
  createFile(excel);
  //   let workbook = new Workbook();
  //   let worksheet = workbook.addWorksheet(comapanyNameHeader);

  //   // busisness Unit
  //   let businessUnitName = worksheet.addRow([businessUnit]);
  //   businessUnitName.font = { size: 20, bold: true };
  //   worksheet.mergeCells("A1:F1");
  //   worksheet.getCell("A1").alignment = { horizontal: "center" };
  //   let businessUnitAddress = worksheet.addRow([buAddress]);
  //   businessUnitAddress.font = { size: 20, bold: true };
  //   worksheet.mergeCells("A2:F2");
  //   worksheet.getCell("A2").alignment = { horizontal: "center" };

  //   // excel heading name
  //   let title = worksheet.addRow([comapanyNameHeader+"-"+monthYear]);
  //   title.font = { size: 16, bold: true };
  //   worksheet.mergeCells("A3:F3");
  //   worksheet.getCell("A3").alignment = { horizontal: "center" };

  //   // form Date
  //   let companyLocation;
  //   if (fromDate) {
  //     companyLocation = worksheet.addRow([
  //       `From Date : ${fromDate}, To Date : ${toDate}`,
  //     ]);
  //     companyLocation.font = { size: 14, bold: true };
  //     worksheet.mergeCells("A3:S3");
  //     worksheet.getCell("A3").alignment = { horizontal: "lefts" };
  //   }

  //   // empty cell
  //   worksheet.getCell("A4").alignment = { horizontal: "center", wrapText: true };

  //   // table header
  //   let _tableHeader = worksheet.addRow(tableHeader);
  //   _tableHeader.font = { bold: true };
  //   _tableHeader.eachCell((cell) => {
  //     cell.alignment = { horizontal: "center" };
  //     cell.border = {
  //       top: { style: "thin", color: { argb: "00000000" } },
  //       left: { style: "thin", color: { argb: "00000000" } },
  //       bottom: { style: "thin", color: { argb: "00000000" } },
  //       right: { style: "thin", color: { argb: "00000000" } },
  //     };
  //   });

  // table row
  // const _tableData = worksheet.addRows(tableData);
  // _tableData.forEach((row, index) => {
  //   row.eachCell((cell) => {
  //     cell.alignment = { horizontal: "right" };
  //     alignmentExcelFunc(
  //       ["D", "E", "F", "G", "H", "I", "J"],
  //       ["A", "B", "C", "K", "L", "M"],
  //       moneyProcessId,
  //       worksheet,
  //       index
  //     );
  //     cell.border = {
  //       top: { style: "thin", color: { argb: "00000000" } },
  //       left: { style: "thin", color: { argb: "00000000" } },
  //       bottom: { style: "thin", color: { argb: "00000000" } },
  //       right: { style: "thin", color: { argb: "00000000" } },
  //     };
  //   });
  // });

  //   // worksheet.mergeCells(true);
  //   // worksheet.getCell("A2").alignment = { horizontal: "center" };
  //   totalRowWorkSheet(
  //     worksheet,
  //     _tableData,
  //     rowDto,
  //     moneyProcessId,
  //     ["C", "D", "E", "F", "G", "H", "I", "J"],
  //     tableHeaderArr
  //   );
  //    worksheet.addRow([]);
  //    worksheet.addRow([]);
  //     let systemGen= worksheet.addRow(['','','',`System Generated Report-${moment().format('ll')}`]);
  //  systemGen.font = { size: 12, bold: true };
  //   worksheet.columns.forEach((column) => {
  //     let maxLength = 0;
  //     column["eachCell"]({ includeEmpty: true }, function (cell) {
  //       maxLength = Math.max(
  //         maxLength,
  //         0,
  //         cell.value ? cell.value.toString().length : 0
  //       );
  //     });
  //     column.width = maxLength + 2;
  //   });

  //   worksheet.getColumn("A").width = 6;

  // workbook.xlsx.writeBuffer().then((data) => {
  //   let blob = new Blob([data], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   fs.saveAs(blob, `${comapanyNameHeader}.xlsx`);
  // });
};

const getTableData = (row, keys, totalKey) => {
  const data = row?.map((item, index) => {
    return keys?.map((key) => item[key]);
  });
  return data;
};

export const generateExcelAction = (
  title,
  fromDate,
  toDate,
  column,
  data,
  businessUnit,
  moneyProcessId,
  rowDto,
  tableHeaderArr,
  totalSalary,
  totalAllowance,
  totalDeduction,
  totalNetPay,
  totalBankPay,
  totalDBPay,
  totalCashPay,
  totalBS,
  totalHR,
  totalMA,
  totalTA,
  totalOA,
  totalTD,
  totalLD,
  totalPFA,
  monthYear,
  buAddress,
  tableAllowanceHead,
  tableDeductionHead
) => {
  const tableDataInfo = getTableData(data, Object.keys(column));
  createExcelFile(
    title,
    Object.values(column),
    tableDataInfo,
    fromDate,
    toDate,
    businessUnit,
    moneyProcessId,
    rowDto,
    tableHeaderArr,
    totalSalary,
    totalAllowance,
    totalDeduction,
    totalNetPay,
    totalBankPay,
    totalDBPay,
    totalCashPay,
    totalBS,
    totalHR,
    totalMA,
    totalTA,
    totalOA,
    totalTD,
    totalLD,
    totalPFA,
    monthYear,
    buAddress,
    tableAllowanceHead,
    tableDeductionHead
  );
};
const dynamicTableHeadCellFunc = (arr, rowDto) => {
  return arr.map((cell) => getRowTotal(rowDto, `${cell}`));
};
