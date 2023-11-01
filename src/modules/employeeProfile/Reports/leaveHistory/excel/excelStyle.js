export const contractualExcelColumn = {
  sl: "SL",
  employee: "Employee Name",
  designation: "Designation",
  department: "Department",
  clTaken: "CL",
  SL: "SL",
  elTaken: "EL",
  lwpTaken: "LWP",
  mlTaken: "ML",
};

export const contractualExcelData = (tableRow) => {
  let newArr = [];
  newArr = tableRow.map((data, index) => {
    return {
      sl: index + 1,
      employee: data?.employee || " ",
      designation: data?.designation || " ",
      department: data?.department || " ",
      clTaken: `${data?.clTaken || 0} / ${data?.clBalance || 0}`,
      SL: `${data?.slTaken || 0} / ${data?.slBalance || 0}`,
      elTaken: `${data?.elTaken || 0} / ${data?.elBalance || 0}`,
      lwpTaken: `${data?.lwpTaken || 0} / ${data?.lwpBalance || 0}`,
      mlTaken: `${data?.mlTaken || 0} / ${data?.mlBalance || 0}`,
    };
  });
  return newArr;
};

const contractualExcelWorkSheet = (
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
  cellArr.forEach((cell) => {
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
      return contractualExcelWorkSheet(
        cellArr,
        textCellArr,
        worksheet,
        rowIndex
      );
  }
};
