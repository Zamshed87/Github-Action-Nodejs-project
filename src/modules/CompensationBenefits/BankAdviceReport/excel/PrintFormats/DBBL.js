import moment from "moment";
import { createFile } from "./createFile";

class Cell {
  constructor(label, align, format) {
    this.text = label;
    this.alignment = `${align}:middle`;
    this.format = format;
  }
  getCell() {
    return {
      text: this.text,
      fontSize: 7.5,
      border: "all 000000 thin",
      alignment: this.alignment || "",
      textFormat: this.format,
    };
  }
}
const getTableData = (row, BankName, comapanyNameHeader) => {
  const data = row?.map((item, index) => {
    return [
      new Cell(index + 1, "center", "text").getCell(),
      new Cell(item?.employeeCode || "N/A", "center", "text").getCell(),
      new Cell(item?.accountName || "N/A", "left", "text").getCell(),
      new Cell(item?.accountNo || "N/A", "left", "text").getCell(),
      new Cell(item?.numNetPayable || 0, "right", "money").getCell(),
    ];
  });
  return data;
};

export const formatDBBL = (
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
  const excel = {
    name: "Bank Advice",
    sheets: [
      {
        name: "DBL Report",
        gridLine: false,
        rows: [
          [
            {
              text: businessUnit,
              fontSize: 16,
              underline: true,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: buAddress?.strWorkplace,
              fontSize: 12,
              underline: true,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "center",
            },
          ],
          [
            {
              text: "Bank Advice Report",
              fontSize: 12,
              underline: true,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "center",
            },
          ],
          ["_blank*2"],
          [
            {
              text: `${moment().format("DD-MMMM-yyyy")}`,
              fontSize: 10,
              bold: true,
              cellRange: "A1:C1",
              merge: true,
              alignment: "left",
            },
          ],
          [
            {
              text: "To,",
              fontSize: 10,
              bold: true,
              cellRange: "A1:D1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: "The Manager",
              fontSize: 10,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: "Dutch- Bangla Bank Limited",
              fontSize: 10,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: "Local Office Branch, Dilkusha Dhaka.",
              fontSize: 10,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: "",
              fontSize: 10,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: `Subject : REQUEST TO DISBURSE EMPLOYEE SALARY ${comapanyNameHeader.toUpperCase()}`,
              fontSize: 10,
              bold: true,
              underline: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          ["_blank*1"],
          [
            {
              text: "Dear Recipients,",
              fontSize: 9,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: `With due respect, please disburse the net payable amount ${total} (${totalInWords} Only) as Employee Salary ${comapanyNameHeader} to the all-account holders as per attached sheet from our Company Account ${bankAccountNo?.BankAccountNo} `,
              fontSize: 9,
              cellRange: "A2:H1",
              merge: true,
              alignment: "left:middle",
              wrapText: true,
            },
          ],
          ["_blank*1"],
          [
            {
              text: "We are looking forward for your kind cooperation.",
              fontSize: 9,
              cellRange: "A1:L1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          ["_blank*1"],
          [
            {
              text: "Thanking You",
              fontSize: 9,
              cellRange: "A1:L1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          ["_blank*1"],
          [
            {
              text: "SL ",
              fontSize: 8,
              bold: true,

              border: "all 000000 thin",
              alignment: "center:middle",
            },
            {
              text: "Employee Id",
              fontSize: 8,
              bold: true,

              border: "all 000000 thin",
              alignment: "left:middle",
            },
            {
              text: "Account Name",
              fontSize: 8,
              bold: true,

              border: "all 000000 thin",
              alignment: "left:middle",
            },
            {
              text: "Bank Account No",
              fontSize: 8,
              bold: true,

              border: "all 000000 thin",
              alignment: "left:middle",
            },
            {
              text: "Net Amount",
              fontSize: 8,
              bold: true,

              border: "all 000000 thin",
              alignment: "right:middle",
            },
          ],
          ...getTableData(rowDto, bankAccountNo?.BankName),
          [
            {
              text: "Total",
              fontSize: 8,
              bold: true,
              border: "all 000000 thin",
              alignment: "center",
            },

            {
              text: "",
              fontSize: 9,
              border: "all 000000 thin",
            },
            {
              text: "",
              fontSize: 9,
              border: "all 000000 thin",
            },
            {
              text: "",
              fontSize: 9,
              border: "all 000000 thin",
            },
            {
              text: total,
              fontSize: 7,
              border: "all 000000 thin",
              bold: true,
              alignment: "right:middle",
              textFormat: "money",
            },
          ],
          ["_blank*1"],
          [
            {
              text: `In Word :`,
              fontSize: 9,
              bold: false,
              cellRange: "A1:A1",
              merge: true,
              alignment: "left:end",
            },
            {
              text: ` ${totalInWords} Taka Only.`,
              fontSize: 9,
              bold: true,
              cellRange: "B1:L1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          ["_blank*2"],
          [
            {
              text: `For : ${businessUnit}`,
              fontSize: 9,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          ["_blank*6"],
          [
            {
              text: `Authorize Signature`,
              fontSize: 9,
              bold: true,
              cellRange: "A1:C1",
              merge: true,
              alignment: "left:middle",
            },
            // {
            //   text: `Authorize Signature`,
            //   fontSize: 10,
            //   bold: true,
            //   cellRange: "D1:F1",
            //   merge: true,
            //   alignment: "left:middle",
            // },
          ],
          ["_blank*2"],
          [
            {
              text: `System Generated Report ${moment().format("ll")}`,
              fontSize: 7,
              bold: false,
              cellRange: "A1:F1",
              merge: true,
              alignment: "center:middle",
            },
          ],
        ],
      },
    ],
  };
  createFile(excel, true);
};
