
import * as fs from 'file-saver';
import { getAlignment, getBorder, getFill, getfontStyle, getIndex, getTextFormat, getWorkBook } from './utils';

// import { getWorkBook, getIndex } from './utils.js';
// import { getfontStyle, getTextFormat, getFill } from './font.js';
// import { getAlignment } from './alignment.js';
// import { getBorder } from './border.js';

export const createFile = (excel) => {
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
    
    _sheet.properties.defaultColWidth=18
    _sheet.getColumn("A").width = 25;
    _sheet.getColumn("B").width = 27;
    _sheet.getColumn("C").width = 9;
    _sheet.getColumn("K").width = 28
    _sheet.getColumn("L").width = 28;
    _sheet.getColumn("M").width = 28;

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
                  (Number(points[0].slice(1)) - 1)}:${
                  points[1][0]
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
