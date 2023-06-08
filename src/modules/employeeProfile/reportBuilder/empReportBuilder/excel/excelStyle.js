const modifyObjFunc = (row, property) => {
  return row.reduce(
    (a, v) => ({ ...a, [v]: property[`${v}`] }),
    {}
  );
};

// header
export const salaryDetailsExcelColumn = {
  sl: "SL",
};
// body
export const salaryDetailsExcelData = (tableHeader, tableRow) => {
  let newArr = [];
  newArr = tableRow.map((itm, index) => {
    return {
      sl: index + 1,
      ...modifyObjFunc(tableHeader, itm),
    };
  });
  return newArr;
};

// style
const salaryDetailsExcelWorkSheet = (
  cellArr,
  textCellArr,
  worksheet,
  rowIndex
) => {
  textCellArr.forEach((cell) => {
    worksheet.getCell(`${cell}${6 + rowIndex}`).alignment = {
      horizontal: "left",
      wrapText: true,
    };
  });
};

// column alignment
export const alignmentExcelFunc = (
  cellArr,
  textCellArr,
  filterIndex,
  worksheet,
  rowIndex
) => {
  switch (filterIndex) {
    default:
      return salaryDetailsExcelWorkSheet(
        cellArr,
        textCellArr,
        worksheet,
        rowIndex
      );
  }
};
