import { formatBEFTN } from "./PrintFormats/BFTN";
import { formatCity } from "./PrintFormats/CityBank";
import { formatDBBL } from "./PrintFormats/DBBL";
import { formatDBL } from "./PrintFormats/DBL";
import { formatIbbl } from "./PrintFormats/IBBL";
import { formatSCB } from "./PrintFormats/SCB";

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
    case 3:
      formatDBL(
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
    case 4:
      formatSCB(
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
    case 5:
      formatDBBL(
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
    case 6:
      formatCity(
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
