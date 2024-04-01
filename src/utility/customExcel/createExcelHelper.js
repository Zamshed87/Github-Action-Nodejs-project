import * as fs from "file-saver";

import { Workbook } from "exceljs";

const getWorkBook = ({ creator = "", createTime = new Date() }) => {
  const workbook = new Workbook();
  workbook.creator = creator;
  workbook.created = createTime;
  return workbook;
};

const getIndex = (char) => {
  return char?.toUpperCase()?.charCodeAt() - 64;
};

const getfontStyle = (cell) => {
  return {
    // name: row[cellIndex]?.fontFamily,
    size: cell?.fontSize || 9,
    bold: cell?.bold || false,
    underline: cell?.underline || false,
    italic: cell?.italic || false,
    color: { argb: cell?.textColor } || "black",
  };
};

const getTextFormat = (formatName) => {
  const format = {
    number: "0",
    text: "@",
    date: "mm/dd/yyyy",
    money: "#,##0.00",
  };
  return formatName ? format[formatName] : "@";
};
const getFill = (cell) => {
  return {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: cell?.bgColor || "#ffffff" },
  };
};

const borderTypes = [
  "thin",
  "dotted",
  "dashDot",
  "hair",
  "dashDotDot",
  "slantDashDot",
  "mediumDashed",
  "mediumDashDotDot",
  "mediumDashDot",
  "medium",
  "double",
  "thick",
];

const getBorder = (borderInfo) => {
  const _borderDefinations = borderInfo.split(":");
  if (_borderDefinations[0].split(" ")[0] === "all") {
    const _borderData = _borderDefinations[0].split(" ");
    if (_borderData?.length === 2) {
      return borderTypes.includes(_borderData[1])
        ? {
            top: { style: _borderData[1] },
            left: { style: _borderData[1] },
            bottom: { style: _borderData[1] },
            right: { style: _borderData[1] },
          }
        : {
            top: { color: { argb: _borderData[1] }, style: "thin" },
            left: { color: { argb: _borderData[1] }, style: "thin" },
            bottom: { color: { argb: _borderData[1] }, style: "thin" },
            right: { color: { argb: _borderData[1] }, style: "thin" },
          };
    } else {
      return {
        top: { color: { argb: _borderData[1] }, style: _borderData[2] },
        left: { color: { argb: _borderData[1] }, style: _borderData[2] },
        bottom: { color: { argb: _borderData[1] }, style: _borderData[2] },
        right: { color: { argb: _borderData[1] }, style: _borderData[2] },
      };
    }
  } else {
    const obj = {};
    _borderDefinations.forEach((item) => {
      const _singleBorderDef = item.split(" ");
      // eslint-disable-next-line default-case
      switch (_singleBorderDef?.length) {
        case 1:
          obj[_singleBorderDef[0]] = { color: "black", style: "thin" };
          break;
        case 2:
          obj[_singleBorderDef[0]] = borderTypes.includes(_singleBorderDef[1])
            ? { style: _singleBorderDef[1] }
            : { color: { argb: _singleBorderDef[1] }, style: "thin" };
          break;
        case 3:
          obj[_singleBorderDef[0]] = {
            color: { argb: _singleBorderDef[1] },
            style: _singleBorderDef[2],
          };
          break;
      }
    });

    return obj;
  }
};

const getAlignment = (cell) => {
  return {
    horizontal: cell?.alignment?.split(":")[0] || "center",
    vertical: cell?.alignment?.split(":")[1] || "middle",
    wrapText: cell?.wrapText || true,
  };
};

export const createFile = (excel, colWidth) => {
  //create workbook
  const workbook = getWorkBook(excel);

  //generate sheets
  // eslint-disable-next-line no-unused-expressions
  excel?.sheets?.forEach((sheet) => {
    //create worksheet

    const _sheet = workbook.addWorksheet(sheet?.name ?? "", {
      views: [
        {
          showGridLines: true,
        },
      ],
    });
    _sheet.properties.defaultColWidth = 12;
    if (colWidth) {
      // generate custom column width
      Object.keys(colWidth).forEach((key) => {
        _sheet.getColumn(key).width = colWidth[key];
      });
    } else {
      // generate default column width
      _sheet.getColumn("A").width = 6;
      _sheet.getColumn("B").width = 27;
      _sheet.getColumn("C").width = 27;
      _sheet.getColumn("D").width = 27;
      _sheet.getColumn("E").width = 27;
      _sheet.getColumn("G").width = 27;
    }
    // generate rows
    // eslint-disable-next-line no-unused-expressions
    sheet?.rows?.forEach((row, rowIndex) => {
      // preprocess row
      const _row = [];

      let lastCellIndex = 0;
      // eslint-disable-next-line no-unused-expressions
      row?.forEach((cell, index) => {
        if (cell === null) {
          cell = "";
        }
        if (typeof cell !== "object") {
          if (typeof cell === "string" && cell?.startsWith("_blank")) {
            for (let i = 0; i < Number(cell?.split("_blank*")[1]) - 1; i++) {
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
            ? getIndex(cell?.cellRange?.split(":")[1][0])
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
        italic: sheet?.textColor,
      });
      _addedRow.alignment = getAlignment({
        alignment: sheet?.alignment,
      });
      _addedRow.fill =
        sheet?.bgColor &&
        getFill({
          bgColor: sheet?.bgColor,
        });
      let _cellIndex = 0;
      lastCellIndex = 0;
      _addedRow.eachCell((cell, cellIndex) => {
        if (lastCellIndex < cellIndex) {
          if (typeof row[_cellIndex] === "object") {
            // add fonyt style
            cell.font = getfontStyle(row[_cellIndex]);

            //merge cell to the cell
            if (row[_cellIndex]?.merge) {
              const points = row[_cellIndex]?.cellRange?.split(":");
              _sheet.mergeCells(
                `${points[0][0]}${
                  _addedRow.number + (Number(points[0].slice(1)) - 1)
                }:${points[1][0]}${
                  _addedRow.number + (Number(points[1].slice(1)) - 1)
                }`
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
              cell.numFmt = getTextFormat("date");
            }
            lastCellIndex = row[_cellIndex]?.cellRange
              ? getIndex(row[_cellIndex]?.cellRange?.split(":")[1][0])
              : lastCellIndex + 1;
            _cellIndex++;
          } else {
            if (typeof row[_cellIndex] === "number") {
              cell.numFmt = getTextFormat("number");
            } else {
              cell.numFmt = getTextFormat("text");
            }
            lastCellIndex += 1;
            _cellIndex++;
          }
        }
      });
    });
  });
  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fs.saveAs(blob, `${excel.name}.xlsx`);
  });
};

export class Cell {
    constructor(label, align = "left", format, isBold = false, fontSize = 9) {
      this.text = label;
      this.alignment = `${align}:middle`;
      this.format = format;
      this.bold = isBold;
      this.fontSize = fontSize;
    }
    getCell() {
      return {
        text: this.text,
        fontSize: this.fontSize || 9,
        border: "all 000000 thin",
        alignment: this.alignment || "",
        textFormat: this.format,
        bold: this.bold || false,
      };
    }
  }