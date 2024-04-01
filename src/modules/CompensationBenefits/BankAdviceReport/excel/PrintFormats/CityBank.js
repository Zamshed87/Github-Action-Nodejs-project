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
const getTableData = (row) => {
  const data = row?.map((item, index) => {
    return [
      new Cell(index + 1, "center", "text").getCell(),
      new Cell(item?.accountName || "N/A", "center", "text").getCell(),
      new Cell(item?.accountNo || "N/A", "left", "text").getCell(),
      new Cell(item?.numNetPayable || 0, "right", "money").getCell(),
    ];
  });
  return data;
};

export const formatCity = (
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
        name: "City Bank Report",
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
              text: "Branch Manager",
              fontSize: 10,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: "Gulshan Avenue Branch",
              fontSize: 10,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: "The City Bank Limited",
              fontSize: 10,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: "136, Gulshan Avenue branch, Gulshan 2 ",
              fontSize: 10,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: "Dhaka – 1212",
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
              cellRange: "A1:H1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: `Subject : Salary Disbursement for the month of ${comapanyNameHeader} of "10MS Limited" employees.`,
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
              text: "Dear Sir,",
              fontSize: 9,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: `With due respect, we are requesting you to transfer the salary for the month of ${comapanyNameHeader} of ‘10MS Limited’ employees. Please debit BDT  ${total}  from our company account no. ${bankAccountNo}  to disburse salaries as mentioned below. `,
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
              text: "Employee Bank Account Information with Transfer Amount:",
              fontSize: 9,
              cellRange: "A1:L1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          ["_blank*1"],
          //   [
          //     {
          //       text: "Thanking You",
          //       fontSize: 9,
          //       cellRange: "A1:L1",
          //       merge: true,
          //       alignment: "left:middle",
          //     },
          //   ],
          //   ["_blank*1"],
          [
            {
              text: "SL ",
              fontSize: 8,
              bold: true,

              border: "all 000000 thin",
              alignment: "center:middle",
            },
            {
              text: "Name",
              fontSize: 8,
              bold: true,

              border: "all 000000 thin",
              alignment: "left:middle",
            },
            {
              text: "A/C Number",
              fontSize: 8,
              bold: true,

              border: "all 000000 thin",
              alignment: "left:middle",
            },

            {
              text: "Net Salary Payable",
              fontSize: 8,
              bold: true,

              border: "all 000000 thin",
              alignment: "right:middle",
            },
          ],
          ...getTableData(rowDto),
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
              text: total,
              fontSize: 7,
              border: "all 000000 thin",
              bold: true,
              alignment: "right:middle",
              textFormat: "money",
            },
          ],
          ["_blank*1"],
          //   [
          //     {
          //       text: `In Word :`,
          //       fontSize: 9,
          //       bold: false,
          //       cellRange: "A1:A1",
          //       merge: true,
          //       alignment: "left:end",
          //     },
          //     {
          //       text: ` ${totalInWords} Taka Only.`,
          //       fontSize: 9,
          //       bold: true,
          //       cellRange: "B1:L1",
          //       merge: true,
          //       alignment: "left:middle",
          //     },
          //   ],
          //   ["_blank*2"],
          //   [
          //     {
          //       text: `For : ${businessUnit}`,
          //       fontSize: 9,
          //       bold: true,
          //       cellRange: "A1:F1",
          //       merge: true,
          //       alignment: "left:middle",
          //     },
          //   ],
          //   ["_blank*6"],
          [
            {
              text: `Ayman Sadiq`,
              fontSize: 9,
              bold: true,
              cellRange: "A1:C1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: `CEO & Managing Director`,
              fontSize: 9,
              bold: true,
              cellRange: "A1:C1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: `10MS Limited`,
              fontSize: 9,
              bold: true,
              cellRange: "A1:C1",
              merge: true,
              alignment: "left:middle",
            },
          ],
          [
            {
              text: `Email- ayman@10minuteschool.com`,
              fontSize: 9,
              bold: true,
              cellRange: "A1:C1",
              merge: true,
              alignment: "left:middle",
            },
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
