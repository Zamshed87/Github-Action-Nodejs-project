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
  const newDta = loanRequestLanding?.filter(
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
  wgId,
  setLoading
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
          : record?.loanAmount;
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
    // {
    //   title: () => <span style={{ color: gray600 }}>Approve Loan Amount</span>,
    //   render: (_, data) => (
    //     <>
    //       {data?.approveLoanAmount
    //         ? numberWithCommas(data?.approveLoanAmount)
    //         : "N/A"}
    //     </>
    //   ),
    //   width: 150,
    // },
    // {
    //   title: () => (
    //     <span style={{ color: gray600 }}>Approve Installment Amount</span>
    //   ),
    //   render: (_, data) => (
    //     <>
    //       {data?.approveNumberOfInstallmentAmount
    //         ? numberWithCommas(data?.approveNumberOfInstallmentAmount)
    //         : "N/A"}
    //     </>
    //   ),
    //   width: 150,
    // },
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
    // {
    //   title: () => <span style={{ color: gray600 }}>Approve Installments</span>,
    //   dataIndex: "approveNumberOfInstallment",
    //   width: 200,
    // },
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
                        data,
                        getData,
                        setLoading,
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
            {data?.installmentStatus === "Running" && (
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
    setGurantorDDL(data);
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
      : data?.loanAmount,
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

  if (!isDelete) {
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
  }

  try {
    setLoading?.(true);
    const row = tableData?.map((item) => ({
      applicationId: item?.loanApplicationId || 0,
      installmentId: item?.empLoanRescheduleId || 0,
      perInstallmentAmount: +item?.intInstallmentAmount || 0,
      paymentYear: item?.paymentYear || 0,
      paymentMonth: item?.paymentMonth || 0,
      remark: item?.strRemarks || "",
      date: item?.date,
    }));
    const payload = {
      partType: isDelete
        ? "LoanDelete"
        : values?.loanApplicationId
        ? "ManagerLoanUpdate"
        : "LoanCreate",
      intAccountId: orgId,
      loanApplicationId: values?.loanApplicationId || 0,
      employeeId: values?.employee?.value || values?.employeeId,
      loanTypeId: values?.loanType?.value || 0,
      intInterest: +values?.interest || 0,
      intGurrantorId: !isDelete ? guarantorId || [] : "",
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
    const payload = {
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
    const res = await axios.post(
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
))(() => ({
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
// function isValidDate(dateString) {
//   const dateObject = new Date(dateString);
//   return !isNaN(dateObject.getTime());
// }

export const costInputHandler = (name, value, sl, tableData, setTableData) => {
  if (value >= 0) {
    const data = [...tableData];
    const row = data[sl];
    row[name] = value;
    +row.intInstallmentAmount;
    row.isHold = +row.intInstallmentAmount === 0 ? true : false;
    row.strRemarks;

    setTableData(data);
  } else if (value) {
    const data = [...tableData];
    const row = data[sl];
    row[name] = value;
    +row.intInstallmentAmount;
    row.isHold = +row.intInstallmentAmount === 0 ? true : false;
    row.strRemarks;
  } else {
    const data = [...tableData];
    const row = data[sl];
    row[name] = "";

    +row.intInstallmentAmount;
    row.isHold = +row.intInstallmentAmount === 0 ? true : false;
    row.strRemarks;

    setTableData(data);
  }
};

export const handleAmendmentClick = (
  tableData,
  setTableData,
  item,
  clickedRowIndex
) => {
  // Clone the existing tableData
  const updatedTableData = [...tableData];

  // Calculate the new date based on the clicked row or the last row
  const referenceIndex =
    clickedRowIndex >= 0 ? clickedRowIndex : updatedTableData.length - 1;
  const referenceDate = moment(updatedTableData[referenceIndex]?.date);
  const newDate = referenceDate.isValid()
    ? referenceDate.add(1, "months")
    : moment();

  // Find the next available month that follows the sequence
  const nextDate = newDate.clone();
  while (
    updatedTableData.some((row) => moment(row.date).isSame(nextDate, "month"))
  ) {
    nextDate.add(1, "month");
  }

  // Create a new data object for the last index with the new date
  const newDataRow = {
    isHold: item?.isHold || false,
    date: nextDate.format("YYYY-MM"),
    paymentYear: nextDate.year() || 0,
    paymentMonth: nextDate.month() + 1,
    strRemarks: item?.strRemarks || "",
    loanApplicationId: item?.loanApplicationId || 0,
    intInterest: +item?.intInterest || 0,
    totalLoanAmount: +item?.totalLoanAmount || 0,
    intInstallmentNumber: +item?.intInstallmentNumber || 0,
    intInstallmentAmount: +item?.intInstallmentAmount || 1,
    strApplicantName: item?.strApplicantName || "",
  };

  // Add the new object to the end of the array
  updatedTableData.push(newDataRow);

  // Make the intInstallmentAmount, paymentYear, and paymentMonth of the clicked row zero
  if (clickedRowIndex >= 0 && clickedRowIndex < updatedTableData.length - 1) {
    updatedTableData[clickedRowIndex].intInstallmentAmount = 0;
    updatedTableData[clickedRowIndex].isHold = true;
    updatedTableData[clickedRowIndex].paymentYear = nextDate.year() || 0;
    updatedTableData[clickedRowIndex].paymentMonth = nextDate.month() + 1;
    updatedTableData[clickedRowIndex].strRemarks = "";
  }

  // Set the state with the updated array
  setTableData(updatedTableData);
};

export const handleDeleteClick = (index, tableData, setTableData) => {
  // Clone the existing tableData array
  const updatedTableData = [...tableData];

  // Add the "amendment" property to the object at the specified index
  updatedTableData[index].amendment = true;

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
//
