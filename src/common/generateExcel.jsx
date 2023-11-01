import { Workbook } from "exceljs";
import * as fs from "file-saver";
import moment from "moment";

const getWorkBook = ({ creator = '', createTime = new Date() }) => {
  const workbook = new Workbook();
  workbook.creator = creator;
  workbook.created = createTime;
  return workbook;
};

const getIndex = char => {
  return char?.toUpperCase()?.charCodeAt() - 64;
};
const getfontStyle = cell => {
  return {
    // name: row[cellIndex]?.fontFamily,
    size: cell?.fontSize || 9,
    bold: cell?.bold || false,
    underline: cell?.underline || false,
    italic: cell?.italic || false,
    color: { argb: cell?.textColor } || 'black'
  };
};

const getTextFormat = formatName => {
  const format = {
    number: '0',
    text: '@',
    date: 'mm/dd/yyyy',
    money: "#,##0.00",
  };
  return formatName ? format[formatName] : '@';
};
const getFill = cell => {
  return {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: cell?.bgColor || '#ffffff' }
  };
};

const borderTypes = [
  'thin',
  'dotted',
  'dashDot',
  'hair',
  'dashDotDot',
  'slantDashDot',
  'mediumDashed',
  'mediumDashDotDot',
  'mediumDashDot',
  'medium',
  'double',
  'thick'
];

const getBorder = borderInfo => {
  const _borderDefinations = borderInfo.split(':');
  if (_borderDefinations[0].split(' ')[0] === 'all') {
    const _borderData = _borderDefinations[0].split(' ');
    if (_borderData?.length === 2) {
      return borderTypes.includes(_borderData[1])
        ? {
          top: { style: _borderData[1] },
          left: { style: _borderData[1] },
          bottom: { style: _borderData[1] },
          right: { style: _borderData[1] }
        }
        : {
          top: { color: { argb: _borderData[1] }, style: 'thin' },
          left: { color: { argb: _borderData[1] }, style: 'thin' },
          bottom: { color: { argb: _borderData[1] }, style: 'thin' },
          right: { color: { argb: _borderData[1] }, style: 'thin' }
        };
    } else {
      return {
        top: { color: { argb: _borderData[1] }, style: _borderData[2] },
        left: { color: { argb: _borderData[1] }, style: _borderData[2] },
        bottom: { color: { argb: _borderData[1] }, style: _borderData[2] },
        right: { color: { argb: _borderData[1] }, style: _borderData[2] }
      };
    }
  } else {
    const obj = {};
    _borderDefinations.forEach(item => {
      const _singleBorderDef = item.split(' ');
      // eslint-disable-next-line default-case
      switch (_singleBorderDef?.length) {
        case 1:
          obj[_singleBorderDef[0]] = { color: 'black', style: 'thin' };
          break;
        case 2:
          obj[_singleBorderDef[0]] = borderTypes.includes(_singleBorderDef[1])
            ? { style: _singleBorderDef[1] }
            : { color: { argb: _singleBorderDef[1] }, style: 'thin' };
          break;
        case 3:
          obj[_singleBorderDef[0]] = {
            color: { argb: _singleBorderDef[1] },
            style: _singleBorderDef[2]
          };
          break;
      }
    });

    return obj;
  }
};

const getAlignment = cell => {
  return {
    horizontal: cell?.alignment?.split(':')[0] || 'center',
    vertical: cell?.alignment?.split(':')[1] || 'middle',
    wrapText: cell?.wrapText || true
  };
};



const createFile = (excel) => {
  //create workbook
  const workbook = getWorkBook(excel);

  //generate sheets
  // eslint-disable-next-line no-unused-expressions
  excel?.sheets?.forEach(sheet => {
    //create worksheet

    const _sheet = workbook.addWorksheet(sheet?.name ?? '', {
      views: [
        {
          showGridLines: true
        }
      ]
    });

    _sheet.properties.defaultColWidth = 18
    _sheet.getColumn("A").width = 6;
    _sheet.getColumn("B").width = 27;
    _sheet.getColumn("F").width = 27;
    _sheet.getColumn("G").width = 27;
    _sheet.getColumn("H").width = 27;
    _sheet.getColumn("I").width = 27;
    // _sheet.getColumn("J").width = 27;
    // _sheet.getColumn("K").width = 27;
    // _sheet.getColumn("L").width = 27;
    // _sheet.getColumn("M").width = 27;
    // _sheet.getColumn("N").width = 27;
    // _sheet.getColumn("O").width = 27;
    // _sheet.getColumn("P").width = 27;
    // _sheet.getColumn("S").width = 12;
    // _sheet.getColumn("T").width = 12;
    // _sheet.getColumn("U").width = 27;
    // _sheet.getColumn("V").width = 27;
    // _sheet.getColumn("W").width = 27;
    // _sheet.getColumn("X").width = 27;
    // _sheet.getColumn("Y").width = 22;
    // _sheet.getColumn("AA").width = 22;
    // _sheet.getColumn("AB").width = 22;
    // _sheet.getColumn("AC").width = 22;

    // generate rows
    // eslint-disable-next-line no-unused-expressions
    sheet?.rows?.forEach((row, rowIndex) => {
      // preprocess row
      const _row = [];

      let lastCellIndex = 0;
      // eslint-disable-next-line no-unused-expressions
      row?.forEach((cell, index) => {
        if (cell === null) {
          cell = '';
        }
        if (typeof cell !== 'object') {
          if (typeof cell === 'string' && cell?.startsWith('_blank')) {
            for (let i = 0; i < Number(cell?.split('_blank*')[1]) - 1; i++) {
              _sheet.addRow([]);
            }
          } else {
            _row[lastCellIndex + 1] = cell;
            lastCellIndex += 1;
          }
        } else {
          if (cell instanceof Date) {
            _row[lastCellIndex + 1] = cell;
            lastCellIndex += 1;
          }
          _row[
            cell?.cellRange ? getIndex(cell?.cellRange[0]) : lastCellIndex + 1
          ] = cell?.text;
          lastCellIndex = cell?.cellRange
            ? getIndex(cell?.cellRange?.split(':')[1][0])
            : lastCellIndex + 1;
        }
      });

      const _addedRow = _sheet.addRow(_row);
      _addedRow.border = sheet?.border && getBorder(sheet?.border);
      _addedRow.font = getfontStyle({
        fontSize: sheet?.fontSize,
        bold: sheet?.bold,
        underline: sheet?.underline,
        textColor: sheet?.italic,
        italic: sheet?.textColor
      });
      _addedRow.alignment = getAlignment({
        alignment: sheet?.alignment
      });
      _addedRow.fill =
        sheet?.bgColor &&
        getFill({
          bgColor: sheet?.bgColor
        });
      let _cellIndex = 0;
      lastCellIndex = 0;
      _addedRow.eachCell((cell, cellIndex) => {
        if (lastCellIndex < cellIndex) {
          if (typeof row[_cellIndex] === 'object') {
            // add fonyt style
            cell.font = getfontStyle(row[_cellIndex]);

            //merge cell to the cell
            if (row[_cellIndex]?.merge) {
              const points = row[_cellIndex]?.cellRange?.split(':');
              _sheet.mergeCells(
                `${points[0][0]}${_addedRow.number +
                (Number(points[0].slice(1)) - 1)}:${points[1][0]
                }${_addedRow.number + (Number(points[1].slice(1)) - 1)}`
              );
            }

            // add alignment to the cell
            cell.alignment = getAlignment(row[_cellIndex]);

            // add fill color
            cell.fill = row[_cellIndex]?.bgColor && getFill(row[_cellIndex]);

            // add border to the cell
            cell.border =
              row[_cellIndex]?.border && getBorder(row[_cellIndex].border);

            // add text format to the cell
            cell.numFmt = getTextFormat(row[_cellIndex]?.textFormat);
            if (row[_cellIndex] instanceof Date) {
              cell.numFmt = getTextFormat('date');
            }
            lastCellIndex = row[_cellIndex]?.cellRange
              ? getIndex(row[_cellIndex]?.cellRange?.split(':')[1][0])
              : lastCellIndex + 1;
            _cellIndex++;
          } else {
            if (typeof row[_cellIndex] === 'number') {
              cell.numFmt = getTextFormat('number');
            } else {
              cell.numFmt = getTextFormat('text');
            }
            lastCellIndex += 1;
            _cellIndex++;
          }
        }
      });
    });

  });
  workbook.xlsx.writeBuffer().then(data => {
    let blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    fs.saveAs(blob, `${excel.name}.xlsx`);
  });
};

class Cell {
  constructor(label, align, format) {
    this.text = label;
    this.alignment = `${align}:middle`;
    this.format = format;
  }
  getCell() {
    return {
      text: this.text,
      fontSize: 9,
      border: "all 000000 thin",
      alignment: this.alignment || "",
      textFormat: this.format,
    };
  }
}
const getTableDataForExcel = (row) => {
  const data = row?.map((item, index) => {
    return [
      new Cell(String(index + 1), "center", "text").getCell(),
      new Cell(item[1] || "N/A", "left", "text").getCell(),
      new Cell(item[32] || "N/A", "center", "text").getCell(),
      new Cell(item[3] || "N/A", "center", "text").getCell(),
      new Cell(item[4] || "N/A", "center", "text").getCell(),
      // new Cell(item[5] || "N/A", "left", "text").getCell(),
      // new Cell(item[6] || "N/A", "center", "text").getCell(),
      // new Cell(item[7] || "N/A", "left", "text").getCell(),
      // new Cell(item[8] || "N/A", "left", "text").getCell(),
      new Cell(item[9] || "N/A", "left", "text").getCell(),
      // new Cell(item[10] || "N/A", "left", "text").getCell(),
      new Cell(item[11] || "N/A", "left", "text").getCell(),
      new Cell(item[12] || "N/A", "left", "text").getCell(),
      new Cell(item[13] || "N/A", "left", "text").getCell(),
      // new Cell(item[14] || "N/A", "left", "text").getCell(),
      // new Cell(item[15] || "N/A", "left", "text").getCell(),
      // new Cell(item[16] || "N/A", "center", "text").getCell(),
      // new Cell(item[17] || "N/A", "center", "text").getCell(),
      // new Cell(item[18] || "N/A", "center", "text").getCell(),
      // new Cell(item[19] || "N/A", "center", "text").getCell(),
      // new Cell(item[20] || "N/A", "left", "text").getCell(),
      // new Cell(item[21] || "N/A", "left", "text").getCell(),
      // new Cell(item[22] || "N/A", "left", "text").getCell(),
      // new Cell(item[23] || "N/A", "left", "text").getCell(),
      // new Cell(item[24] || "N/A", "left", "text").getCell(),
      // new Cell(item[25] || "N/A", "left", "text").getCell(),
      // new Cell(item[26] || "N/A", "left", "text").getCell(),
      // new Cell(item[27] || "N/A", "left", "text").getCell(),
      // new Cell(item[28] || "N/A", "left", "text").getCell(),
      // new Cell(item[29] || "N/A", "left", "text").getCell(),
      new Cell(item[30] || "N/A", "left", "text").getCell(),
      // new Cell(item[31] || "N/A", "center", "text").getCell(),

    ];
  });
  return data;
};
const createExcelFile = (
  comapanyNameHeader,
  tableHeader,
  tableData,
  fromDate,
  toDate,
  businessUnit,
  businessUnitAddress
) => {

  const excel = {
    name: `${comapanyNameHeader} Report ${moment().format('ll')}`,
    sheets: [
      {
        // name: `Salary Report-${monthYear}`,
        name: `${comapanyNameHeader} ${moment().format('ll')}`,
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
              text: businessUnitAddress,
              fontSize: 15,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: `${comapanyNameHeader}-${moment().format('LL')}`,
              fontSize: 15,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center",
            },
          ],

          ["_blank*2"],
          [
            {
              text: "SL",
              fontSize: 8.5,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Employee Name",
              fontSize: 9,
              // cellRange: "A1:B1",
              // merge: true,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Reference Id",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Employee Id",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Joining Date",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            // {
            //   text: "Service Length",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Confirmation Date",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Contract From Date",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Contract To Date",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            {
              text: "Supervisor",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            // {
            //   text: "Dotted Supervisor",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            {
              text: "Line Manager",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Designation",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Department",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },

            // {
            //   text: "Office Mail",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Personal Mail",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Office Mobile",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Personal Mobile",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Gender",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Religion",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Payroll Group",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Bank Or Wallet",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Branch Name",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Account Name",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Account No",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Routing No",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },

            // {
            //   text: "Workplace",
            //   fontSize: 8.5,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Workplace Group",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            //   alignment: "center",
            // },
            // {
            //   text: "Business Unit",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            //   alignment: "center",
            // },
            // {
            //   text: "Date Of Birth",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            //   alignment: "center",
            // },
            {
              text: "Employment Type",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
              alignment: "center",
            },
            // {
            //   text: "Employee Status",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            //   alignment: "center",
            // },

          ],
          ...getTableDataForExcel(tableData),
          ["_blank*2"],
          [
            {
              text: `System Generated Report ${moment().format('ll')}`,
              fontSize: 12,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
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
          //     text: "",
          //     fontSize: 8.8,
          //     border: "all 000000 thin",
          //   },
          //   {
          //     text: "",
          //     fontSize: 8.8,
          //     border: "all 000000 thin",
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
          //     text: 'totalSalary',
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: 'totalBasic',
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: 'totalBonus',
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: '',
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: '',
          //     fontSize: 9,
          //     bold: true,
          //     textFormat: "money",
          //     border: "all 000000 thin",
          //     alignment: "right:middle",
          //   },
          //   {
          //     text: '',
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
  // let workbook = new Workbook();
  // let worksheet = workbook.addWorksheet(comapanyNameHeader);

  // // busisness Unit
  // let businessUnitName = worksheet.addRow([businessUnit]);
  // businessUnitName.font = { size: 20, bold: true };
  // worksheet.mergeCells("A1:S1");
  // worksheet.getCell("A1").alignment = { horizontal: "left" };

  // // excel heading name
  // let title = worksheet.addRow([comapanyNameHeader]);
  // title.font = { size: 16, bold: true };
  // worksheet.mergeCells("A2:S2");
  // worksheet.getCell("A2").alignment = { horizontal: "left" };

  // // form Date
  // let companyLocation;
  // if (fromDate) {
  //   companyLocation = worksheet.addRow([
  //     `From Date : ${fromDate}, To Date : ${toDate}`
  //   ]);
  //   companyLocation.font = { size: 14, bold: true };
  //   worksheet.mergeCells("A3:S3");
  //   worksheet.getCell("A3").alignment = { horizontal: "lefts" };
  // }

  // // empty cell
  // worksheet.getCell("A4").alignment = { horizontal: "center", wrapText: true };


  // // table header
  // let _tableHeader = worksheet.addRow(tableHeader);
  // _tableHeader.font = { bold: true };
  // _tableHeader.eachCell((cell) => {
  //   cell.alignment = { horizontal: "center" };
  //   cell.border = {
  //     top: { style: 'thin', color: { argb: '00000000' } },
  //     left: { style: 'thin', color: { argb: '00000000' } },
  //     bottom: { style: 'thin', color: { argb: '00000000' } },
  //     right: { style: 'thin', color: { argb: '00000000' } }
  //   };
  // });

  // // table row
  // const _tableData = worksheet.addRows(tableData);
  // _tableData.forEach((row) => {
  //   row.eachCell((cell) => {
  //     cell.alignment = { horizontal: "left" };
  //     cell.border = {
  //       top: { style: 'thin', color: { argb: '00000000' } },
  //       left: { style: 'thin', color: { argb: '00000000' } },
  //       bottom: { style: 'thin', color: { argb: '00000000' } },
  //       right: { style: 'thin', color: { argb: '00000000' } }
  //     };
  //   });
  // });

  // worksheet.columns.forEach(column => {
  //   let maxLength = 0;
  //   column["eachCell"]({ includeEmpty: true }, function (cell) {
  //     maxLength = Math.max(
  //       maxLength,
  //       0,
  //       cell.value ? cell.value.toString().length : 0
  //     );
  //   });
  //   column.width = maxLength + 2;
  // });

  // worksheet.getColumn("A").width = 6;

  // workbook.xlsx.writeBuffer().then((data) => {
  //   let blob = new Blob([data], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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

export const generateExcelAction = (title, fromDate, toDate, column, data, businessUnit, businessUnitAddress) => {

  const tableDataInfo = getTableData(data, Object.keys(column));
  createExcelFile(
    title,
    Object.values(column),
    tableDataInfo,
    fromDate,
    toDate,
    businessUnit,
    businessUnitAddress
  );
}