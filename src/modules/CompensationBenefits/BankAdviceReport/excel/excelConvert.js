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
  values,
  rowDto,
  bankAccountNo,
  total,
  totalInWords,
  buAddress
) => {
  switch (values?.bank?.label) {
    case 0:
      formatIbbl(
        comapanyNameHeader,
        tableHeader,
        tableData,
        fromDate,
        toDate,
        businessUnit,
        "",
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
        "",
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
        "",
        rowDto,
        bankAccountNo,
        total,
        totalInWords,
        buAddress
      );
      break;
    case "Dhaka Bank Limited ":
      formatDBL(
        comapanyNameHeader,
        tableHeader,
        tableData,
        fromDate,
        toDate,
        businessUnit,
        "",
        rowDto,
        bankAccountNo,
        total,
        totalInWords,
        buAddress
      );
      break;
    case "Standard Chartered Bank":
      formatSCB(
        comapanyNameHeader,
        tableHeader,
        tableData,
        fromDate,
        toDate,
        businessUnit,
        "",
        rowDto,
        bankAccountNo,
        total,
        totalInWords,
        buAddress
      );
      break;
    case 5:
      // formatDBBL(
      //   comapanyNameHeader,
      //   tableHeader,
      //   tableData,
      //   fromDate,
      //   toDate,
      //   businessUnit,
      //   "",
      //   rowDto,
      //   bankAccountNo,
      //   total,
      //   totalInWords,
      //   buAddress
      // );
      break;
    case "The City Bank Limited":
      formatCity(
        comapanyNameHeader,
        tableHeader,
        tableData,
        fromDate,
        toDate,
        businessUnit,
        "",
        rowDto,
        bankAccountNo,
        total,
        totalInWords,
        buAddress
      );
      break;
    case "THE CITY BANK LTD":
      formatCity(
        comapanyNameHeader,
        tableHeader,
        tableData,
        fromDate,
        toDate,
        businessUnit,
        "",
        rowDto,
        bankAccountNo,
        total,
        totalInWords,
        buAddress
      );
      break;
    default:
      formatDBBL(
        comapanyNameHeader,
        tableHeader,
        tableData,
        fromDate,
        toDate,
        businessUnit,
        "",
        rowDto,
        bankAccountNo,
        total,
        totalInWords,
        buAddress
      );
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
  values,
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
    values,
    rowDto,
    bankAccountNo,
    total,
    totalInWords,
    buAddress
  );
};
