import AvatarComponent from "common/AvatarComponent";
import { gray600 } from "../../../../utility/customColor";
import { Cell } from "../../../../utility/customExcel/createExcelHelper";
import { getChipStyle } from "../../../employeeProfile/dashboard/components/EmployeeSelfCalendar";
import { fromToDateList } from "../helper";

export const onGetMonthlyAttendanceReport = (
  getMonthlyAttendanceInformation,
  orgId,
  wgId,
  values,
  setRowDto,
  pages,
  setPages,
  srcTxt,
  IsPaginated = true
) => {
  let search = srcTxt ? `&SearchTxt=${srcTxt}` : "";
  getMonthlyAttendanceInformation(
    `/TimeSheetReport/TimeManagementDynamicPIVOTReport?ReportType=monthly_attendance_report_for_all_employee&AccountId=${orgId}&DteFromDate=${values?.fromDate}&DteToDate=${values?.toDate}&EmployeeId=0&WorkplaceGroupId=${wgId}&WorkplaceId=0&PageNo=${pages.current}&PageSize=${pages.pageSize}&IsPaginated=${IsPaginated}${search}`,
    (data) => {
      setPages({
        ...pages,
        current: pages.current,
        pageSize: pages.pageSize,
        total: data[0]?.totalCount,
      });
      setRowDto?.(data);
    }
  );
};

export const monthlyAttendanceReportColumns = (
  fromDate,
  toDate,
  page,
  paginationSize
) => {
  const dateList = fromToDateList(fromDate, toDate);
  return [
    {
      title: () => <span style={{ color: gray600, minWidth: "25px" }}>SL</span>,
      render: (_, __, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
      width: 40,
      fixed: "left",
    },
    {
      title: () => <span style={{ color: gray600 }}>Employee ID</span>,
      dataIndex: "EmployeeCode",
      sorter: true,
      filter: true,
      fixed: "left",
      width: 120,
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.strEmployeeName}
            />
            <span className="ml-2">{record?.strEmployeeName}</span>
          </div>
        );
      },
      sorter: true,
      filter: true,
      fixed: "left",
      width: 200,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
      fixed: "left",
      width: 180,
    },
    {
      title: "Workplace Group",
      dataIndex: "strWorkplaceGroup",
      sorter: true,
      filter: true,
      width: 180,
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplace",
      sorter: true,
      // filter: true,
      width: 180,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      // filter: true,
      width: 180,
    },
    {
      title: "Section",
      dataIndex: "strSectionName",
      sorter: true,
      // filter: true,
      width: 180,
    },
  

    ...(dateList?.length > 0 &&
      dateList.map((item) => ({
        title: () => <span style={{ color: gray600 }}>{item?.level}</span>,
        render: (_, record) =>
          record?.[item?.date] ? (
            <span style={getChipStyle(record?.[item?.date])}>
              {record?.[item?.date]}
            </span>
          ) : (
            "-"
          ),
        width: 150,
        className: "text-center",
      }))),
  ];
};

export const attendeceReportExlCol = (fromDate, toDate) => {
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
/* 
const getTableData = (row, keys, totalKey) => {
  const data = row?.map((item, index) => {
    return keys?.map((key) => item[key]);
  });
  return data;
};

const exelHeading = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
  8: "H",
  9: "I",
  10: "J",
  11: "K",
  12: "L",
  13: "M",
  14: "N",
  15: "O",
  16: "P",
  17: "Q",
  18: "R",
  19: "S",
  20: "T",
  21: "U",
  22: "V",
  23: "W",
  24: "X",
  25: "Y",
  26: "Z",
  27: "AA",
  28: "AB",
  29: "AC",
  30: "AD",
  31: "AE",
  32: "AF",
  33: "AG",
  34: "AH",
  35: "AI",
  36: "AJ",
  37: "AK",
  38: "AL",
  39: "AM",
  40: "AN",
  41: "AO",
  42: "AP",
  43: "AQ",
  44: "AR",
  45: "AS",
  46: "AT",
  47: "AU",
  48: "AV",
  49: "AW",
  50: "AX",
};

export const generateExcelActionBeta = (
  title,
  fromDate,
  toDate,
  column,
  data,
  businessUnit,
  businessUnitAddress,
  widthList
) => {
  const endCell = Object.values(column).length;
  const tableDataInfo = getTableData(data, Object.keys(column));
  createExcelFile(
    title,
    Object.values(column),
    tableDataInfo,
    fromDate,
    toDate,
    businessUnit,
    businessUnitAddress,
    endCell,
    widthList
  );
};

const createExcelFile = (
  comapanyNameHeader,
  tableHeader,
  tableData,
  fromDate,
  toDate,
  businessUnit,
  businessUnitAddress,
  endCell,
  widthList,
  isHiddenHeader,
  fileName
) => {
  let workbook = new Workbook();
  let worksheet = workbook.addWorksheet(comapanyNameHeader);
  if (!isHiddenHeader) {
    worksheet.getCell("A1").alignment = {
      horizontal: "center",
      wrapText: true,
    };
    let businessUnitName = worksheet.addRow([businessUnit]);
    businessUnitName.font = { size: 20, bold: true };
    worksheet.mergeCells(`A2:${exelHeading[endCell]}2`);
    worksheet.getCell("A2").alignment = { horizontal: "center" };

    let companyLocation = worksheet.addRow([businessUnitAddress]);
    companyLocation.font = { size: 14, bold: true };
    worksheet.mergeCells(`A3:${exelHeading[endCell]}3`);
    worksheet.getCell("A3").alignment = { horizontal: "center" };

    let title = worksheet.addRow([comapanyNameHeader]);
    title.font = { size: 16, bold: true };
    worksheet.mergeCells(`A4:${exelHeading[endCell]}4`);
    worksheet.getCell("A4").alignment = { horizontal: "center" };
    worksheet.getCell("A5").alignment = {
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("A6").alignment = {
      horizontal: "center",
      wrapText: true,
    };

    let skipCell = ["A1", "A2", "A3", "A4", "A5", "A6"];

    worksheet.columns.forEach(function (column, i) {
      var maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        if (!skipCell?.includes(cell?._address)) {
          var columnLength = cell.value ? cell.value.toString().length : 4;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        }
      });
      column.width = maxLength < 10 ? 10 : 15;
    });
  }

  let _tableHeader = worksheet.addRow(tableHeader);
  _tableHeader.font = { bold: true };
  _tableHeader.eachCell((cell) => {
    cell.alignment = { horizontal: "center" };
  });

  if (isHiddenHeader) {
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        maxLength = Math.max(
          maxLength,
          0,
          cell.value ? cell.value.toString().length : 0
        );
      });
      column.width = maxLength + 2;
    });
  }

  const _tableData = worksheet.addRows(tableData);
  _tableData.forEach((row) => {
    row.eachCell((cell, index) => {
      cell.alignment = { horizontal: index === 1 ? "center" : "left" };
    });
  });
  worksheet.getCell(`A${tableData?.length + 8}`).alignment = {
    horizontal: "center",
    wrapText: true,
  };
  worksheet.getCell(`A${tableData?.length + 9}`).alignment = {
    horizontal: "center",
    wrapText: true,
  };
  let footer = worksheet.addRow([
    `System Generated Report ${moment().format("ll")}`,
  ]);
  footer.font = { size: 12 };
  worksheet.mergeCells(
    `A${+tableData?.length + 10}:${exelHeading[endCell]}${
      +tableData?.length + 10
    }`
  );
  worksheet.getCell(`A${+tableData?.length + 10}`).alignment = {
    horizontal: "center",
  };

  Object.keys(widthList).forEach((key) => {
    worksheet.getColumn(key).width = widthList[key];
  });

  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fs.saveAs(blob, `${fileName || comapanyNameHeader}.xlsx`);
  });
}; */

// for excel
export const getTableDataMonthlyAttendance = (row, keys, totalKey) => {
  const data = row?.map((item, index) => {
    return keys?.map((key) => {
      return new Cell(item[key] ? item[key] : "-", "center", "text").getCell();
    });
  });
  return data;
};

// excel columns
export const column = (fromDate, toDate) => {
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
    strWorkplaceGroup: "Workplace Group",
    strWorkplace: "Workplace",
    strDepartment: "Department",
    strSectionName: "Section",
    EmployeeCode: "Code",
    strEmployeeName: "Employee Name",
    strDesignation: "Designation",
    ...tempObj,
  };
};
