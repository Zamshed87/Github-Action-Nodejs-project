import { fromToDateList } from "../../../../utility/createExcel";
import { Cell } from "../../../../utility/customExcel/createExcelHelper";

export const montlyInOutXlCol = (fromDate, toDate) => {
  const dateList = fromToDateList(fromDate, toDate);
  let tempObj = {};
  dateList?.length > 0 &&
    dateList.forEach((item) => {
      tempObj = {
        ...tempObj,
        [item?.date]: item?.level,
      };
    });
  return {
    sl: "SL",
    EmployeeCode: "Employee Id",
    strEmployeeName: "Employee Name",
    strDesignation: "Designation",
    strDepartment: "Department",
    ...tempObj,
  };
};

// for excel
export const getTableDataMonthlyInOut = (row, keys, totalKey) => {
  const data = row?.map((item, index) => {
    return keys?.map((key) => {
      return new Cell(item[key] ? item[key] : "-", "center", "text").getCell();
    });
  });
  return data;
};
