import { Avatar, Flex } from "Components";
import { Tooltip, Modal } from "antd";
import axios from "axios";
import AttachmentTooltip from "common/AttachmentTooltip";
import Chips from "common/Chips";
import {
  getDownlloadFileView_Action,
} from "commonRedux/auth/actions";
import moment from "moment";
import { toast } from "react-toastify";
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

export const pfLandingColData = (history, setLoading, getData, dispatch) => {
  const showInActiveConfirm = (record) => {
    Modal.confirm({
      title: "Are you sure you want to inactivate this loan?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      onOk: () => handleInActive(record, setLoading, getData),
    });
  };
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      className: "text-center",
      width: 40,
      fixed: "left",
    },
    {
      title: "Employee Code",
      dataIndex: "strEmployeeCode",
      sort: true,
      fieldType: "string",
      fixed: "left",
      width: 100,
    },
    {
      title: "Employee Name",
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
      width: 110,
      fixed: "left",
    },
    {
      title: "Loan ID",
      dataIndex: "strLoanId",
      sort: true,
      fieldType: "string",
      width: 60,
      fixed: "left",
    },
    {
      title: "Loan Type",
      dataIndex: "strLoanType",
      sort: true,
      fieldType: "string",
      fixed: "left",
      width: 80,
    },
    {
      title: "Loan Amount",
      dataIndex: "numLoanAmount",
      sort: true,
      fieldType: "string",
      width: 100,
    },
    {
      title: "Interest(%)",
      dataIndex: "numInterest",
      render: (text) => <>{text}%</>,
      sort: true,
      fieldType: "string",
      width: 100,
    },
    {
      title: "Loan Amount with Interest",
      dataIndex: "numTotalInstallment",
      sort: true,
      fieldType: "string",
      width: 180,
    },
    {
      title: "Installment",
      dataIndex: "intNumberOfInstallment",
      sort: true,
      fieldType: "string",
      width: 90,
    },
    {
      title: "Settled Installment",
      dataIndex: "settledInstallment",
      sort: true,
      fieldType: "string",
      width: 100,
    },
    {
      title: "Settled Amount",
      dataIndex: "settledAmount",
      sort: true,
      fieldType: "string",
      width: 100,
    },
    {
      title: "Un-settled Amount",
      dataIndex: "unSettledAmount",
      sort: true,
      fieldType: "string",
      width: 100,
    },
    {
      title: "Effective Date",
      dataIndex: "dteEffectiveDate",
      render: (text) => <>{dateFormatter(text)}</>,
      sort: true,
      fieldType: "string",
      width: 100,
    },
    // attachement column
    {
      title: "Attachment",
      dataIndex: "intFileUrlId",
      render: (_, record) => (
        <AttachmentTooltip
          strDocumentList={record?.intFileUrlId ? String(record.intFileUrlId) : ""}
          onClickAttachment={() => dispatch(getDownlloadFileView_Action(record?.intFileUrlId))}
        />
      ),
      sort: true,
      fieldType: "string",
      width: 100,
    },
    {
      title: "Description",
      dataIndex: "strDescription",
      render: (text) => <>{text || "-"}</>,
      sort: true,
      fieldType: "string",
      width: 100,
    },
    {
      title: "Status",
      render: (data, record) => (
        <div>
          {/* Show status chips based on isApproved, isReject, isActive, and strStatus */}
          {record.isApproved && <Chips label="Approved" classess="success" />}
          {record.isReject && <Chips label="Rejected" classess="danger" />}
          {!record.isApproved &&
            !record.isReject &&
            record?.strStatus?.toLowerCase() === "pending" && (
              <Chips label="Pending" classess="warning" />
            )}
        </div>
      ),
      sort: true,
      fieldType: "string",
      width: 80,
      // fixed: "right",
    },
    {
      title: "Action",
      dataIndex: "strStatus",
      width: 160,
      render: (text, record) => {
        const isPending = text?.toLowerCase() === "pending";
        const isApproved = record.isApproved === true;
        return (
          <Flex justify="center" align="center" gap="5px">
            {/* Show Edit and InActive if pending, only InActive if approved */}
            {isPending && (
              <>
                <button
                  style={{
                    height: "24px",
                    fontSize: "12px",
                    padding: "0px 12px",
                    merginRight: "5px",
                  }}
                  className="btn btn-default"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    history.push({
                      pathname: `/loanManagement/PfLoan/edit/${record?.intEmployeeLoanHeaderId}`,
                    });
                  }}
                >
                  Edit
                </button>
                {record.isActive && (
                  <Tooltip
                    placement="bottom"
                    title={record?.isActive ? "Inactive" : "Active"}
                  >
                    <button
                      style={{
                        height: "24px",
                        fontSize: "12px",
                        padding: "0px 12px",
                      }}
                      className="btn btn-info"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        showInActiveConfirm(record);
                      }}
                    >
                      InActive
                    </button>
                  </Tooltip>
                )}
              </>
            )}
            {!record.isActive && (
              <Chips label="InActivated" classess="danger" />
            )}
            {!isPending && isApproved && record.isActive && (
              <Tooltip
                placement="bottom"
                title={record?.isActive ? "Inactive" : "Active"}
              >
                <button
                  style={{
                    height: "24px",
                    fontSize: "12px",
                    padding: "0px 12px",
                  }}
                  className="btn btn-info"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    showInActiveConfirm(record);
                  }}
                >
                  InActive
                </button>
              </Tooltip>
            )}
          </Flex>
        );
      },
      // fixed: "right",
    },
  ];
};

export const handleInActive = async (data, setLoading, getData) => {
  console.log("data", data);

  setLoading(true);
  try {
    const res = await axios.delete(
      `/PfLoan/DeleteById?HeaderId=${data?.intEmployeeLoanHeaderId}`
    );
    toast.success("InActive Successfully", { toastId: 1222 });
    getData();
    setLoading(false);
  } catch (error) {
    toast.warn(error.response.data.message || "An unexpected error occurred", {
      toastId: 1222,
    });
  } finally {
    setLoading(false);
  }
};

export const statusDDL = [
  { value: 0, label: "All" },
  { value: 1, label: "Pending" },
  { value: 2, label: "Inactive" },
  { value: 3, label: "Approved" },
  { value: 4, label: "Running" },
  { value: 5, label: "Early Settled" },
  { value: 6, label: "Completed" },
];
