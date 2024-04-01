import { topSheet } from "./PrintFormats/TopSheet";

const createExcelFile = (
  comapanyNameHeader,
  tableHeader,
  tableData,
  fromDate,
  toDate,
  businessUnit,
  moneyProcessId,
  rowDto,
  values,
  total,
  totalInWords,
  buAddress
) => {
  topSheet(
    comapanyNameHeader,
    tableHeader,
    tableData,
    fromDate,
    toDate,
    businessUnit,
    moneyProcessId,
    rowDto,
    values,
    total,
    totalInWords,
    buAddress
  );
};

const getTableData = (row, keys, totalKey) => {
  const data = row?.map((item, index) => {
    return keys?.map((key) => item[key]);
  });
  return data;
};

export const generateTopSheetAction = (
  title,
  fromDate,
  toDate,
  column,
  data,
  businessUnit,
  moneyProcessId,
  rowDto,
  values,
  total,
  totalInWords,
  buAddress
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
    values,
    total,
    totalInWords,
    buAddress
  );
};
