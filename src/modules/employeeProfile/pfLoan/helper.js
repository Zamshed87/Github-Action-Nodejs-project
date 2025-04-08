import { Avatar, TableButton } from "Components";
import Chips from "common/Chips";
import moment from "moment";
import { dateFormatter } from "utility/dateFormatter";

export const initialValues = {
  employee: "",
  loanId: "",
  loanType: "",
  loanAmount: "",
  interest: "",
  installmentNum: "",
  effeciveDate: "",
  description: "",
  attachment: "",
};

// Function to calculate the monthly payment
function calculateMonthlyPayment(
  loanAmount,
  annualInterestRate,
  numInstallments
) {
  const monthlyInterestRate = annualInterestRate / 12 / 100;

  if (monthlyInterestRate === 0) {
    return loanAmount / numInstallments;
  } else {
    return (
      (loanAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numInstallments)) /
      (Math.pow(1 + monthlyInterestRate, numInstallments) - 1)
    );
  }
}

export const viewHandler = (values, setGeneratedData) => {
  const modifiedArr = [];
  const monthlyPayment = calculateMonthlyPayment(
    +values?.loanAmount,
    +values?.interest,
    +values?.installmentNum
  );
  const monthlyInterestRate = +values?.interest / 12 / 100;

  let balance = values?.loanAmount;
  const date = new Date(values?.effeciveDate);
  date.setDate(1);

  for (let i = 0; i < +values?.installmentNum; i++) {
    const interest = balance * monthlyInterestRate;
    let principal = monthlyPayment - interest;

    if (balance < principal) {
      principal = balance;
      balance = 0;
    } else {
      balance -= principal;
    }

    modifiedArr.push({
      sl: i + 1,
      month: moment(date).format("MMM-YYYY"),
      beginningBalance: parseFloat(balance + principal),
      interest: parseFloat(interest),
      principal: parseFloat(principal),
      installment: parseFloat(monthlyPayment),
      endingBalance: parseFloat(balance),
    });

    date.setMonth(date.getMonth() + 1);
  }

  setGeneratedData(() => modifiedArr);
};

export const pfLandingColData = (history) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      className: "text-center",
      width: 20,
    },
    {
      title: "Employee Id",
      dataIndex: "strEmployeeCode",
      sort: true,
      fieldType: "string",
    },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
      sort: true,
      render: (_, item) => (
        <div className="d-flex align-items-center justify-content-start">
          <div>
            <Avatar title={item?.strEmployeeName} />
          </div>
          <div className="ml-2">
            <span>{item?.strEmployeeName}</span>
          </div>
        </div>
      ),
      fieldType: "string",
      width: 100,
    },
    {
      title: "Loan ID",
      dataIndex: "strLoanId",
      sort: true,
      fieldType: "string",
    },
    {
      title: "Loan Type",
      dataIndex: "strLoanType",
      sort: true,
      fieldType: "string",
    },
    {
      title: "Loan Amount",
      dataIndex: "numLoanAmount",
      sort: true,
      fieldType: "string",
    },
    {
      title: "Interest(%)",
      dataIndex: "numInterest",
      render: (text) => <>{text}%</>,
      sort: true,
      fieldType: "string",
    },
    {
      title: "Installment Number",
      dataIndex: "intNumberOfInstallment",
      sort: true,
      fieldType: "string",
    },
    {
      title: "Effective Date",
      dataIndex: "dteEffectiveDate",
      render: (text) => <>{dateFormatter(text)}</>,
      sort: true,
      fieldType: "string",
    },
    {
      title: "Description",
      dataIndex: "strDescription",
      render: (text) => <>{text || "-"}</>,
      sort: true,
      fieldType: "string",
    },
    {
      title: "Status",
      dataIndex: "strStatus",
      render: (data) => (
        <div>
          {data === "Approved" && <Chips label={data} classess="success" />}
          {data === "Pending" && <Chips label={data} classess="warning" />}
          {data === "Rejected" && <Chips label={data} classess="danger" />}
          {data === "Process" && <Chips label={data} classess="primary" />}
        </div>
      ),
      sort: true,
      fieldType: "string",
      width: 50,
    },
    {
      title: "",
      dataIndex: "strStatus",
      width: 30,
      render: (text, record) => (
        <>
          {text.toLowerCase() === "pending" && (
            <TableButton
              buttonsList={[
                {
                  type: "edit",
                  onClick: () => {
                    history.push({
                      pathname: `/profile/pfLoan/edit/${record?.intEmployeeLoanHeaderId}`,
                    });
                  },
                },
              ]}
            />
          )}
        </>
      ),
    },
  ];
};
