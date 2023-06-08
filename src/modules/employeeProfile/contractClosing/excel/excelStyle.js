import { dateFormatter } from "../../../../utility/dateFormatter";

export const contractualExcelColumn = {
  sl: "SL",
  EmployeeName: "Employee Name",
  EmployeeCode: "Employee Code",
  strEmploymentType: "Employee Type",
  DepartmentName: "Department Name",
  DesignationName: "Designation Name",
  dteContactFromDate: "Contractual From Date",
  dteContactToDate: "Contractual To Date",
  dteJoiningDate: "Joining Date",
};

export const contractualExcelData = (tableRow) => {
  let newArr = [];
  newArr = tableRow.map((itm, index) => {
    return {
      sl: index + 1,
      EmployeeName: itm?.EmployeeName || " ",
      EmployeeCode: itm?.EmployeeCode || " ",
      strEmploymentType: itm?.strEmploymentType || " ",
      DepartmentName: itm?.DepartmentName || " ",
      DesignationName: itm?.DesignationName || " ",
      dteContactFromDate: dateFormatter(itm?.dteContactFromDate || ""),
      dteContactToDate: dateFormatter(itm?.dteContactToDate || " "),
      dteJoiningDate: dateFormatter(itm?.dteJoiningDate || " "),
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
