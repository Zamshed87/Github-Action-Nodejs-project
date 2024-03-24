import moment from "moment";
import { todayDate } from "utility/todayDate";
import { createFile } from "./createExcelHelper";

export const createCommonExcelFile = ({
  titleWithDate,
  fromDate,
  toDate,
  buAddress,
  businessUnit,
  tableHeader,
  getTableData,
  tableFooter,
  extraInfo,
  tableHeadFontSize,
  widthList,
  commonCellRange,
  CellAlignment,
  getSubTableData,
  subHeaderInfoArr = [],
  subHeaderColumn = {},
}) => {
  const tableHead = Object.values(tableHeader);
  const subHeader =
    Object.keys(subHeaderColumn).length > 0
      ? Object.values(subHeaderColumn)
      : [];
  const subHeaderInfo =
    subHeaderInfoArr.length > 0
      ? subHeaderInfoArr.filter((element) => element !== null && element !== "")
      : [];

  createExcelFile({
    titleWithDate,
    fromDate,
    toDate,
    buAddress,
    businessUnit,
    tableHead,
    getTableData,
    tableFooter,
    extraInfo,
    tableHeadFontSize,
    widthList,
    commonCellRange,
    CellAlignment,
    subHeader,
    getSubTableData,
    subHeaderInfo,
  });
};
const createExcelFile = ({
  titleWithDate,
  fromDate,
  toDate,
  buAddress,
  businessUnit,
  tableHead,
  getTableData,
  tableFooter,
  extraInfo,
  tableHeadFontSize,
  widthList,
  commonCellRange,
  CellAlignment,
  subHeader,
  getSubTableData,
  subHeaderInfo,
}) => {
  let dateStringRangeObj = {};
  if (fromDate && toDate) {
    dateStringRangeObj = {
      text: `${moment(fromDate).format("ll")} - ${moment(toDate).format("ll")}`,
      fontSize: 15,
      bold: true,
      cellRange: commonCellRange || "A1:J1",
      merge: true,
      alignment: "center:middle",
    };
  }
  const tableHeader =
    tableHead?.length > 0
      ? customCell(tableHead, tableHeadFontSize, "center")
      : [];
      const subHeaderList =
    subHeader?.length > 0
      ? customCell(subHeader, tableHeadFontSize, "center")
      : [];
      const tableFooterData =
    tableFooter?.length > 0
      ? customCell(tableFooter, tableHeadFontSize, CellAlignment)
      : [];
      const subHeaderInfoCell =
    subHeaderInfo?.length > 0
      ? customCell(subHeaderInfo, 9, "left", true, "A1:C1", false)
      : [];
  const subHeaderInfoModifed = subHeaderInfoCell.map((item) => [item]);
  const tableBody = getTableData?.() || [];
  const subTableBody = getSubTableData?.() || [];
  const excel = {
    name: `${titleWithDate} - ${todayDate()}`,
    sheets: [
      {
        name: `${titleWithDate} - ${todayDate()}`,
        gridLine: false,
        rows: [
          ["_blank*2"],
          [
            {
              text: businessUnit,
              fontSize: 18,
              bold: true,
              cellRange: commonCellRange || "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: buAddress,
              fontSize: 15,
              bold: true,
              cellRange: commonCellRange || "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: titleWithDate,
              fontSize: 15,
              bold: true,
              cellRange: commonCellRange || "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [fromDate && toDate ? dateStringRangeObj : null],
          [subHeaderInfoModifed.length > 0 ? "_blank" : null],
          ...subHeaderInfoModifed,
          [subHeaderInfoModifed.length > 0 ? "_blank" : null],
          [subHeaderList.length > 0 ? "_blank" : null],
          subHeaderList.length > 0 ? [...subHeaderList] : [null],
          subTableBody.length > 0 ? subTableBody : [null],
          ["_blank"],
          [...tableHeader],
          ...tableBody,
          [...tableFooterData],
          ["_blank*2"],
          [extraInfo?.text ? extraInfo : null],
          ["_blank*2"],
          [
            {
              text: `System Generated Report ${moment().format("ll")}`,
              fontSize: 12,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
        ].filter((element) => element.length > 0 && !element.includes(null)),
      },
    ],
  };
  // console.log(excel?.sheets?.[0]?.rows);
  createFile(excel, widthList);
};

const customCell = (
  arrayOfString,
  tableHeadFontSize = 10,
  alignment = "",
  merge = false,
  cellRange,
  isBorder = true
) => {
  const cellArry = [];
  arrayOfString.forEach((item) => {
    cellArry.push({
      text: item,
      fontSize: tableHeadFontSize || 10,
      bold: true,
      border: !isBorder ? false : "all 000000 thin",
      alignment: alignment ? `${alignment}:middle` : "center:middle",
      cellRange: cellRange,
      merge: merge,
    });
  });
  return cellArry;
};
