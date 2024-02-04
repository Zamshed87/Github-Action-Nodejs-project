import {
  Attachment,
  CreateOutlined,
  DeleteOutline,
  InfoOutlined,
} from "@mui/icons-material";
import { Tooltip, styled, tooltipClasses } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import Chips from "../../../common/Chips";
import { getDownlloadFileView_Action } from "../../../commonRedux/auth/actions";
import { gray600 } from "../../../utility/customColor";
import {
  dateFormatter,
  dateFormatterForInput,
} from "../../../utility/dateFormatter";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import { todayDate } from "../../../utility/todayDate";

export const onGetLoanRequestLanding = (
  getLoanRequestLanding,
  orgId,
  buId,
  wgId,
  values,
  setRowDto
) => {
  getLoanRequestLanding(
    `/Employee/PeopleDeskAllLanding?TableName=LoanApplicationList&AccountId=${orgId}&BusinessUnitId=${buId}&fromDate=${values?.filterFromDate}&toDate=${values?.filterToDate}&WorkplaceGroupId=${wgId}`,
    (data) => {
      setRowDto?.(data);
    }
  );
};

export const onFilterLoanApplication = (
  keywords,
  loanRequestLanding,
  setRowDto
) => {
  const regex = new RegExp(keywords?.toLowerCase());
  let newDta = loanRequestLanding?.filter(
    (item) =>
      regex.test(item?.employeeName?.toLowerCase()) ||
      regex.test(item?.employeeCode?.toLowerCase()) ||
      regex.test(item?.designationName?.toLowerCase()) ||
      regex.test(item?.departmentName?.toLowerCase()) ||
      regex.test(item?.loanType?.toLowerCase())
  );
  setRowDto(newDta);
};

export const loanRequestLandingTableColumns = (
  dispatch,
  setShow,
  getData,
  employeeId,
  orgId,
  setSingleData,
  setFileId,
  page,
  paginationSize,
  buId,
  wgId
) => {
  return [
    {
      title: () => (
        <p style={{ color: gray600, textAlign: "center", fontWeight: 600 }}>
          SL
        </p>
      ),
      render: (_, __, index) => (
        <p style={{ textAlign: "center" }}>
          {(page - 1) * paginationSize + index + 1}
        </p>
      ),
      width: "50px",
      fixed: "left",
    },
    {
      title: () => <span style={{ color: gray600 }}>Code</span>,
      render: (_, record) => <span>{record?.employeeCode}</span>,
      width: "75px",
      fixed: "left",
      filter: true,
      sorter: true,
      dataIndex: "employeeCode",
    },
    {
      title: () => <span style={{ color: gray600 }}>Employee</span>,
      render: (_, record) => <span>{record?.employeeName}</span>,
      width: "125px",
      fixed: "left",
      filter: true,
      sorter: true,
      dataIndex: "employeeName",
    },
    {
      title: () => <span style={{ color: gray600 }}>Designation</span>,
      dataIndex: "designationName",
      width: 150,
      filter: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Department</span>,
      dataIndex: "departmentName",
      width: 150,
      filter: true,
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
      filter: true,
      render: (_, data) => (
        <div className="d-flex align-items-center justify-content-start tableBody-title">
          <div className="pr-2">
            <LightTooltip
              title={
                <div className="application-tooltip">
                  <h6>Reason</h6>
                  <h5>{data?.description}</h5>
                  <h6 className="pt-2">Effective Date</h6>
                  <h5>
                    {" "}
                    {data?.effectiveDate
                      ? dateFormatter(data?.effectiveDate)
                      : "N/A"}
                  </h5>
                  <h6 className="pt-2">Attachment</h6>
                  {data?.fileUrl ? (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(getDownlloadFileView_Action(data?.fileUrl));
                      }}
                    >
                      <div
                        className="text-decoration-none file text-primary"
                        style={{ cursor: "pointer" }}
                      >
                        <Attachment /> Attachment
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              }
            >
              <InfoOutlined style={{ color: gray600 }} />
            </LightTooltip>
          </div>

          <span style={{ fontSize: "11px", color: gray600 }}>
            {data?.loanType}
          </span>
        </div>
      ),
      width: 100,
    },
    {
      title: () => <span style={{ color: gray600 }}>Loan Amount</span>,
      render: (_, record) => (
        <>{record?.loanAmount ? numberWithCommas(record?.loanAmount) : "N/A"}</>
      ),
      width: 150,
      className: "text-right",
    },
    {
      title: "Interest",
      dataIndex: "intInterest",
      width: 150,
      filter: true,
      className: "text-right",

      render: (_, record) => <>{record?.intInterest} %</>,
    },
    {
      className: "text-right",

      title: "Total Amount with Interest",
      dataIndex: "designationName",
      width: 200,
      filter: true,
      render: (_, record) => {
        const amount = record?.intInterest
          ? (
              +record?.loanAmount +
              +record?.loanAmount * (+record?.intInterest / 100)
            ).toFixed(2)
          : 0;
        return <>{numberWithCommas(amount)}</>;
      },
    },
    // {
    //   title: "Guarantor",
    //   dataIndex: "GurrantorName",
    //   width: 150,
    //   filter: true,
    // },
    {
      title: () => <span style={{ color: gray600 }}>Installment Amount</span>,
      dataIndex: "numberOfInstallmentAmount",
      render: (_, record) => (
        <span>
          {record?.numberOfInstallmentAmount
            ? numberWithCommas(record?.numberOfInstallmentAmount)
            : "N/A"}
        </span>
      ),
      width: 150,
      className: "text-right",
    },
    {
      title: <span style={{ color: gray600 }}>Installments</span>,
      dataIndex: "numberOfInstallment",
      className: "text-center",
      width: 150,
    },
    {
      title: () => <span style={{ color: gray600 }}>Approve Loan Amount</span>,
      render: (_, data) => (
        <>
          {data?.approveLoanAmount
            ? numberWithCommas(data?.approveLoanAmount)
            : "N/A"}
        </>
      ),
      width: 150,
    },
    {
      title: () => (
        <span style={{ color: gray600 }}>Approve Installment Amount</span>
      ),
      render: (_, data) => (
        <>
          {data?.approveNumberOfInstallmentAmount
            ? numberWithCommas(data?.approveNumberOfInstallmentAmount)
            : "N/A"}
        </>
      ),
      width: 150,
    },
    {
      title: "Effective Date",
      dataIndex: "effectiveDate",
      render: (_, rec) => dateFormatter(rec?.effectiveDate),
      sorter: true,
      dataType: "date",
      width: 150,
    },
    {
      title: "Closing Date",
      dataIndex: "closingDate",
      render: (_, rec) => dateFormatter(rec?.closingDate),
      sorter: true,
      dataType: "date",
      width: 150,
    },
    {
      title: () => <span style={{ color: gray600 }}>Approve Installments</span>,
      dataIndex: "approveNumberOfInstallment",
      width: 200,
    },
    {
      title: "Application Status",
      dataIndex: "applicationStatus",
      filter: true,
      render: (_, data) => (
        <div className="d-flex align-items-center">
          {data?.applicationStatus === "Approved" && (
            <Chips label={data?.applicationStatus} classess="success" />
          )}
          {data?.applicationStatus === "Pending" && (
            <Chips label={data?.applicationStatus} classess="warning" />
          )}
          {data?.applicationStatus === "Rejected" && (
            <Chips label={data?.applicationStatus} classess="danger" />
          )}
          {data?.applicationStatus === "Process" && (
            <Chips label={data?.applicationStatus} classess="primary" />
          )}
        </div>
      ),
      width: 150,
    },
    {
      title: () => <span style={{ color: gray600 }}>Loan Status</span>,
      dataIndex: "installmentStatus",
      filter: true,
      render: (_, data) => (
        <div className="d-flex align-items-center">
          <div className="d-flex mr-2">
            {data?.installmentStatus === "Completed" && (
              <Chips label={data?.installmentStatus} classess="success" />
            )}
            {data?.installmentStatus === "Running" && (
              <Chips label={data?.installmentStatus} classess="primary" />
            )}
            {data?.installmentStatus === "Not Started" && (
              <Chips label={data?.installmentStatus} classess="danger" />
            )}
            {data?.installmentStatus === "Hold" && (
              <Chips label={data?.installmentStatus} classess="danger" />
            )}
          </div>
          <div>
            {data?.applicationStatus === "Pending" && (
              <div className="d-flex">
                <Tooltip title="Edit" arrow>
                  <button
                    type="button"
                    className="iconButton"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSingleLoanApplication(data, setSingleData, setFileId);
                      setShow(true);
                    }}
                  >
                    <CreateOutlined />
                  </button>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                  <button
                    type="button"
                    className="iconButton"
                    onClick={(e) => {
                      e.stopPropagation();
                      loanCrudAction(
                        { loanApplicationId: data?.loanApplicationId },
                        getData,
                        null,
                        employeeId,
                        null,
                        orgId,
                        true,
                        buId,
                        wgId
                      );
                    }}
                  >
                    <DeleteOutline />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      ),
      width: 180,
    },
  ];
};

export const getGurantor = async (id, setGurantorDDL) => {
  try {
    const res = await axios.get(`/Employee/GurrantorListByLoanId?loanId=${id}`);

    const data = res?.data?.gurrantors?.map((item) => {
      return {
        ...item,
        value: item?.gurrantorId,
        label: item?.strGurrantorName,
      };
    });
    setGurantorDDL(data)
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const setSingleLoanApplication = (data, setSingleData, setFileId) => {
  setSingleData({
    employee: {
      label: data?.employeeName,
      value: data?.employeeId,
      code: data?.employeeCode,
      designation: data?.designationName,
      department: data?.departmentName,
    },
    loanType: {
      value: data?.loanTypeId,
      label: data?.loanType,
    },
    insertDateTime: data?.insertDateTime,
    loanAmount: data?.loanAmount,
    installmentNumber: data?.numberOfInstallment,
    amountPerInstallment: data?.numberOfInstallmentAmount,
    description: data?.description,
    effectiveDate: dateFormatterForInput(data?.effectiveDate),
    loanClosingDate: dateFormatterForInput(data?.closingDate),
    fileUrl: data?.fileUrl,
    loanApplicationId: data?.loanApplicationId,
    status: data?.applicationStatus,
    approveLoanAmount: data?.approveLoanAmount || data?.loanAmount,
    approveInstallmentNumber:
      data?.approveNumberOfInstallment || data?.numberOfInstallment,
    approveAmountPerInstallment:
      data?.approveNumberOfInstallmentAmount || data?.numberOfInstallmentAmount,
    intCreatedBy: data?.intCreatedBy,
    // new requirment payload -- 2023-12-03
    // guarantor:
    //   data?.GurrantorName && data?.GurrantorId
    //     ? {
    //         label: data?.GurrantorName,
    //         value: data?.GurrantorId,
    //       }
    //     : "",
    guarantor: [],
    interest: data?.intInterest || 0,
    totalwithinterest: data?.intInterest
      ? (
          +data?.loanAmount +
          +data?.loanAmount * (+data?.intInterest / 100)
        ).toFixed(2)
      : 0,
  });
  setFileId(data?.fileUrl);
};

export const loanCrudAction = async (
  values,
  cb,
  setLoading,
  employeeId,
  fileId,
  orgId,
  isDelete = false,
  buId,
  wgId,
  tableData
) => {
  if (values?.intInterest > 100) {
    toast.warn("Interest can't be greater than 100");
    return;
  }

  let guarantorId = "";

  // Check if values.guarantor exists and is an array
  const guarantorArray = values?.guarantor;

  if (
    guarantorArray &&
    Array.isArray(guarantorArray) &&
    guarantorArray.length >= 2
  ) {
    // If it's an array with at least 2 elements, extract values and join them
    const id = guarantorArray.map((item) => item?.value);
    guarantorId = id.join(",");
  } else {
    // If values.guarantor is not an array or doesn't have at least 2 elements, show an error
    return toast.warn("There should be at least 2 Guarantor employees.");
  }

  try {
    setLoading?.(true);
    const row = tableData?.map((item) => ({
      loanApplicationId: item?.loanApplicationId || 0,
      intInterest: item?.intInterest || 0,
      totalLoanAmount: item?.totalLoanAmount || 0,
      installmentNumber: item?.intInstallmentNumber || 0,
      installmentAmount: item?.intInstallmentAmount || 0,
      strApplicantName: item?.strApplicantName || "",
      repaymentDate: item?.date || todayDate(),
      actualPaymentAmount: item?.intInstallmentAmount || 0,
      isHold: item?.isHold || false,
      remark: item?.strRemarks || "",
    }));
    let payload = {
      partType: isDelete
        ? "LoanDelete"
        : values?.loanApplicationId
        ? "ManagerLoanUpdate"
        : "LoanCreate",
      intAccountId: orgId,
      loanApplicationId: values?.loanApplicationId || 0,
      employeeId: values?.employee?.value || 0,
      loanTypeId: values?.loanType?.value || 0,
      intInterest: +values?.interest || 0,
      intGurrantorId: guarantorId || [],
      loanAmount: +values?.loanAmount || 0,
      numberOfInstallment: +values?.installmentNumber || 0,
      numberOfInstallmentAmount: +values?.amountPerInstallment || 0,
      description: values?.description || "",
      fileUrl:
        values?.loanApplicationId && !fileId?.globalFileUrlId
          ? fileId
          : fileId?.globalFileUrlId || 0,
      applicationDate: "2021-12-02T04:43:22.009Z",
      approveBy: "",
      approveLoanAmount: 0,
      approveNumberOfInstallment: 0,
      createdBy: employeeId,
      effectiveDate: values?.effectiveDate || todayDate(),
      dteLoanClosingDate: values?.loanClosingDate || todayDate(),
      rejectBy: "",
      referenceNo: "",
      isActive: !isDelete,
      insertByUserId: employeeId,
      insertDateTime: todayDate() || null,
      updateByUserId: employeeId,
      isApprove: false,
      isReject: false,
      remainingBalance: values?.loanApplicationId
        ? values?.approveLoanAmount
        : null,
      intApproveLoanAmount: values?.approveLoanAmount || null,
      intApproveNumberOfInstallment: values?.approveInstallmentNumber || null,
      intApproveNumberOfInstallmentAmount:
        values?.approveAmountPerInstallment || null,
      businessUnitId: buId,
      workPlaceGrop: wgId,
      rowList: row,
    };
    const res = await axios.post(`/Employee/LoanCRUD`, payload);
    setLoading?.(false);
    cb?.();
    toast.success(res?.data?.message || "Submitted Successfully");
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};

export const loanFilterAction = async (
  values,
  setter,
  setAllData,
  setLoading,
  cb,
  buId
) => {
  try {
    let payload = {
      loanTypeId: values?.loanType?.value || 0,
      departmentId: values?.department?.value || 0,
      designationId: values?.designation?.value || 0,
      employeeId: values?.employee?.value || 0,
      fromDate: values?.fromDate || "",
      toDate: values?.toDate || "",
      minimumAmount: +values?.minimumAmount || 0,
      maximumAmount: +values?.maximumAmount || 0,
      applicationStatus: values?.applicationStatus?.label || "",
      installmentStatus: values?.installmentStatus?.label || "",
      businessUnitId: buId,
    };
    setLoading(true);
    let res = await axios.post(
      `/Employee/GetLoanApplicationByAdvanceFilter`,
      payload
    );
    setLoading(false);
    setter({ Result: res?.data });
    setAllData(res?.data);
    cb();
  } catch (error) {
    setLoading(false);
  }
};

export const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff !important",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 300,
    boxShadow:
      "0px 1px 5px rgba(0, 0, 0, 0.05), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 5px rgba(0, 0, 0, 0.05)",
    fontSize: 11,
  },
}));
function isValidDate(dateString) {
  const dateObject = new Date(dateString);
  return !isNaN(dateObject.getTime());
}

export const costInputHandler = (
  name,
  value,
  sl,
  tableData,
  setTableData,
  values
) => {
  if (value >= 0) {
    const data = [...tableData];
    const row = data[sl];
    row[name] = value;
    +row.intInstallmentAmount;
    row.isHold = +row?.intInstallmentAmount === 0 ? false : true;
    row.strRemarks;

    setTableData(data);
  }
  else if (value) {
    const data = [...tableData];
    const row = data[sl];
    row[name] = value;
    +row.intInstallmentAmount;
    row.isHold = +row?.intInstallmentAmount === 0 ? false : true;
    row.strRemarks;
  }
  else {
    const data = [...tableData];
    const row = data[sl];
    row[name] = "";

    +row.intInstallmentAmount;
    row.isHold = +row?.intInstallmentAmount === 0 ? false : true;
    row.strRemarks;

    setTableData(data);
  }
};



export const handleAmendmentClick = (tableData, setTableData, item) => {
  // Clone the existing tableData
  const updatedTableData = [...tableData];

  // Check if a new row has already been added
  if (updatedTableData.some(item => item.loanApplicationId === 0)) {
    // A new row has already been added, do nothing or handle as needed
    return toast.warn("Already added a row for this month",{ toastId: "toastId" })
  }

  // Determine the last index
  const lastIndex = updatedTableData.length - 1;

  // Calculate the new date based on the previous index
  const previousDate = moment(updatedTableData[lastIndex]?.date);
  const newDate = previousDate.isValid() ? previousDate.add(1, 'months') : moment();

  // Create a new data object for the last index with the new date
  const newDataRow = {
    loanApplicationId: item?.loanApplicationId || 0,
    intInterest: +item?.intInterest || 0,
    totalLoanAmount: +item?.totalLoanAmount || 0,
    intInstallmentNumber: +item?.intInstallmentNumber || 0,
    intInstallmentAmount: +item?.intInstallmentAmount || 0,
    strApplicantName: item?.strApplicantName || "",
    inMonth: new Date().getMonth() + 1,
    intYear: new Date().getFullYear(),
    intActualPaymentAmount: null,
    strRemarks: item?.strRemarks || "",
    isHold: item?.isHold || false,
    date: newDate.format("YYYY-MM"),
  };

  // Add the new object to the last index
  updatedTableData.push(newDataRow);
  console.log("updatedTableData",updatedTableData)
  // Set the state with the updated array
  setTableData(updatedTableData);
};



export const handleDeleteClick = (index, tableData, setTableData) => {
  // Clone the existing tableData array
  const updatedTableData = [...tableData];

  // Remove the object at the specified index
  updatedTableData.splice(index, 1);

  // Set the state with the updated array
  setTableData(updatedTableData);
};

export const subTotal = (tableData) => {
  return tableData.reduce(function (a, c) {
    return a + c?.intInstallmentAmount;
  }, 0);
};
