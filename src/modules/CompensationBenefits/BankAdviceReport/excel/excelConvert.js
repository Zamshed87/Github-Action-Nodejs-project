import { formatBEFTN } from "./PrintFormats/BFTN";
import { formatIbbl } from "./PrintFormats/IBBL";

const createExcelFile = (
  comapanyNameHeader,
  tableHeader,
  tableData,
  fromDate,
  toDate,
  businessUnit,
  moneyProcessId,
  rowDto,
  bankAccountNo,
  total,
  totalInWords,
  buAddress
) => {
  switch (moneyProcessId) {
    case 0:
          formatIbbl(
          comapanyNameHeader,
          tableHeader,
          tableData,
          fromDate,
          toDate,
          businessUnit,
          moneyProcessId,
          rowDto,
          bankAccountNo,
          total,
          totalInWords,
          buAddress
        );
      break;
    case 1:
      formatBEFTN(
        comapanyNameHeader,
        tableHeader,
        tableData,
        fromDate,
        toDate,
        businessUnit,
        moneyProcessId,
        rowDto,
        bankAccountNo,
        total,
        totalInWords,
        buAddress
      );
      break;
    case 2:
      formatBEFTN(
        comapanyNameHeader,
        tableHeader,
        tableData,
        fromDate,
        toDate,
        businessUnit,
        moneyProcessId,
        rowDto,
        bankAccountNo,
        total,
        totalInWords,
        buAddress
      );
      break;
    default:
  }
};

const getTableData = (row, keys, totalKey) => {
  const data = row?.map((item, index) => {
    return keys?.map((key) => item[key]);
  });
  return data;
};

export const generateExcelAction = (
  title,
  fromDate,
  toDate,
  column,
  data,
  businessUnit,
  moneyProcessId,
  rowDto,
  bankAccountNo,
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
    bankAccountNo,
    total,
    totalInWords,
    buAddress
  );
};
