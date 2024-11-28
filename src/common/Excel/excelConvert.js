import moment from "moment";
import { createFile } from "./createFile";

const createExcelFile = ({
  title,
  getHeader,
  getTableHeader,
  getTableRow,
  extraInfo,
}) => {
  const Header = getHeader ? getHeader() || [] : [];
  const TableHeader = getTableRow ?  getTableHeader() || [] : [] ;
  const tableRow = getTableRow ? getTableRow() || []  : [];
  const headerOfObj = Header.map(obj => [obj]);
  const excel = {
    name: title,
    sheets: [
      {
        name: title,
        gridLine: false,
        rows: [
          ["_blank*2"],
          ...headerOfObj,
          [...TableHeader],
          ...tableRow,
          ["_blank*2"],
          [
            {
              text: `System Generated Report [${moment().format('LLLL')}]`,
              fontSize: 15,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          // ["_blank*2"],
          // [
          //   {
          //     text: `System Generated Report ${moment().format("ll")}`,
          //     fontSize: 12,
          //     bold: true,
          //     cellRange: "A1:E1",
          //     merge: true,
          //     alignment: "center:middle",
          //   },
          // ],
        ],
      },
    ],
  };
  createFile(excel);
};

export const generateCommonExcelAction = ({
  title,
  getHeader,
  getTableHeader,
  getTableRow,
  extraInfo,
}) => {
  createExcelFile(
    {
      title,
      getHeader,
      getTableHeader,
      getTableRow,
      extraInfo,
    }
  );
};
