import {
  Attachment,
  CreateOutlined,
  DeleteOutline,
  InfoOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../../../common/AvatarComponent";
import Chips from "../../../../common/Chips";
import { getDownlloadFileView_Action } from "../../../../commonRedux/auth/actions";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { numberWithCommas } from "../../../../utility/numberWithCommas";
import { todayDate } from "../../../../utility/todayDate";
import { LightTooltip } from "../../../employeeProfile/LoanApplication/helper";

export const getLoanLanding = async (
  tableName,
  accId,
  buId,
  filterFromDate,
  filterToDate,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);

  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=${tableName}&AccountId=${accId}&BusinessUnitId=${buId}&fromDate=${filterFromDate}&toDate=${filterToDate}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
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
  wgId
) => {
  try {
    setLoading(true);
    let payload = {
      partType: isDelete
        ? "LoanDelete"
        : values?.loanApplicationId
        ? "LoanUpdate"
        : "LoanCreate",
      intAccountId: orgId,
      loanApplicationId: values?.loanApplicationId || 0,
      employeeId: values?.employee?.value || 0,
      loanTypeId: values?.loanType?.value || 0,
      loanAmount: +values?.loanAmount || 0,
      numberOfInstallment: +values?.installmentNumber || 0,
      createdBy: employeeId,
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
      effectiveDate: values?.effectiveDate || todayDate(),
      rejectBy: "",
      referenceNo: "",
      isActive: !isDelete,
      insertByUserId: employeeId,
      insertDateTime: todayDate() || null,
      updateByUserId: employeeId,
      isApprove: false,
      isReject: false,
      remainingBalance: 0,
      businessUnitId: buId,
      workPlaceGrop: wgId,
    };
    const res = await axios.post(`/Employee/LoanCRUD`, payload);
    setLoading(false);
    cb();
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
export const selfServiceLoanReqDtoColumns = (
  dispatch,
  setSingleDataAction,
  setShow,
  employeeId,
  orgId,
  getData,
  setLoading,
  values,
  page,
  paginationSize,
  buId,
  wgId
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
      width: 60,
      fixed: "left",
    },
    {
      title: "Code",
      dataIndex: "employeeCode",
      sorter: true,
      filter: true,
      width: 100,
      fixed: "left",
    },
    {
      title: "Employee",
      dataIndex: "employeeName",
      sorter: true,
      filter: true,
      width: 200,
      fixed: "left",
      render: (_, item) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent letterCount={1} label={item?.employeeName} />
            <div className="employeeTitle ml-3">
              <p>{item?.employeeName}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
      sorter: true,
      filter: true,
      width: 150,
      render: (_, data) => {
        return (
          <div className="d-flex align-items-center justify-content-start">
            <div className="pr-1">
              <LightTooltip
                title={
                  <div className="application-tooltip">
                    <h6>Reason</h6>
                    <h5>{data?.description}</h5>
                    <h6 className="pt-2">Effective Date</h6>
                    <h5> {dateFormatter(data?.effectiveDate)}</h5>
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
                <InfoOutlined />
              </LightTooltip>
            </div>
            <span>{data?.loanType}</span>
          </div>
        );
      },
    },
    {
      title: "Application Date",
      dataIndex: "applicationDate",
      width: 150,
      render: (_, record) => dateFormatter(record?.applicationDate),
    },
    {
      title: "Loan Amount",
      dataIndex: "loanAmount",
      sorter: true,
      width: 150,
      render: (_, item) => (
        <p className="text-center"> {numberWithCommas(item?.loanAmount)}</p>
      ),
    },
    {
      title: "Installment Amount",
      dataIndex: "numberOfInstallmentAmount",
      sorter: true,
      width: 150,
      render: (_, item) => (
        <p className="text-center">
          {" "}
          {numberWithCommas(item?.numberOfInstallmentAmount)}
        </p>
      ),
    },
    {
      title: "Installments",
      dataIndex: "numberOfInstallment",
      sorter: true,
      filter: true,
      width: 120,
      className: "text-center",
    },
    {
      title: "Approve Loan Amount",
      dataIndex: "approveLoanAmount",
      width: 200,
      render: (_, item) => (
        <p className="text-center">
          {" "}
          {numberWithCommas(item?.approveLoanAmount)}
        </p>
      ),
    },
    {
      title: "Approve Installment Amount",
      dataIndex: "approveNumberOfInstallmentAmount",
      width: 200,
      render: (_, item) => (
        <p className="text-center">
          {" "}
          {numberWithCommas(item?.approveNumberOfInstallmentAmount)}
        </p>
      ),
    },
    {
      title: "Approve Installments",
      dataIndex: "approveNumberOfInstallment",
      // sorter: true,
      // filter: true,
      width: 200,
      className: "text-center",
    },
    {
      title: "Application Status",
      dataIndex: "applicationStatus",
      filter: true,
      width: 150,
      render: (_, data) => {
        return (
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
        );
      },
    },
    {
      title: "Loan Status",
      dataIndex: "installmentStatus",
      filter: true,
      width: 200,
      // fixed: "right",
      render: (_, data) => {
        return (
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
                        setSingleDataAction(data);
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
                          () => {
                            getData(values?.fromDate, values?.toDate);
                          },
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
            </div>
          </div>
        );
      },
    },

    /* 
    {
      title: "From Date",
      dataIndex: "dteFromDate",
      isDate: true,
      render: (_, record) => dateFormatter(record?.dteFromDate),
    },
    {
      title: "To Date",
      dataIndex: "dteToDate",
      isDate: true,
      render: (_, record) => dateFormatter(record?.dteToDate),
    },
    {
      title: "IOU",
      dataIndex: "numIOUAmount",
      sorter: true,
      render: (_, record) => {
        numberWithCommas(record?.numIOUAmount);
      },
    },
    {
      title: "Adjusted",
      dataIndex: "numAdjustedAmount",
      sorter: true,
      render: (_, record) => {
        numberWithCommas(record?.numAdjustedAmount);
      },
    },
    {
      title: "Pay To Accounts",
      dataIndex: "numPayableAmount",
      sorter: true,
      render: (_, record) => {
        numberWithCommas(record?.numPayableAmount);
      },
    },
    {
      title: "Receive From Accounts",
      dataIndex: "numReceivableAmount",
      sorter: true,
      render: (_, record) => {
        numberWithCommas(record?.numReceivableAmount);
      },
    },
    {
      title: "Status",
      dataIndex: "Status",
      width: 100,
      filter: true,
      render: (_, item) => {
        return (
          <div>
            {item?.Status === "Approved" && (
              <Chips label="Approved" classess="success p-2" />
            )}
            {item?.Status === "Pending" && (
              <Chips label="Pending" classess="warning p-2" />
            )}
            {item?.Status === "Process" && (
              <Chips label="Process" classess="primary p-2" />
            )}
            {item?.Status === "Rejected" && (
              <>
                <Chips label="Rejected" classess="danger p-2 mr-2" />
                {item?.RejectedBy && (
                  <LightTooltip
                    title={
                      <div className="p-1">
                        <div className="mb-1">
                          <p
                            className="tooltip-title"
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            Rejected by {item?.RejectedBy}
                          </p>
                        </div>
                      </div>
                    }
                    arrow
                  >
                    <InfoOutlined
                      sx={{
                        color: gray900,
                      }}
                    />
                  </LightTooltip>
                )}
              </>
            )}
          </div>
        );
      },
    },
    {
      title: "Adjustment Status",
      dataIndex: "AdjustmentStatus",
      filter: true,
      sorter: true,
      render: (_, item) => {
        return (
          <div>
            {item?.AdjustmentStatus === "Adjusted" && (
              <Chips label="Adjusted" classess="success p-2" />
            )}
            {item?.AdjustmentStatus === "Pending" && (
              <Chips label="Pending" classess="warning p-2" />
            )}
            {item?.AdjustmentStatus === "Process" && (
              <Chips label="Process" classess="primary p-2" />
            )}
            {item?.AdjustmentStatus === "Completed" && (
              <Chips label="Completed" classess="indigo p-2" />
            )}
            {item?.AdjustmentStatus === "Rejected" && (
              <>
                <Chips label="Rejected" classess="danger p-2 mr-2" />
              </>
            )}
          </div>
        );
      },
    },
    {
      title: "",
      dataIndex: "action",
      render: (_, item) => {
        return (
          <div className="d-flex">
            {item?.Status === "Pending" && (
              <Tooltip title="Edit" arrow>
                <button className="iconButton" type="button">
                  <EditOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push(
                        `/SelfService/iOU/application/edit/${item?.intIOUId}`
                      );
                    }}
                  />
                </button>
              </Tooltip>
            )}
            {item?.AdjustmentStatus === "Adjusted" && (
              <Tooltip title="Acknowledged" arrow>
                <button className="iconButton" type="button">
                  <CheckOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      acknowledgedPopup(item);
                    }}
                  />
                </button>
              </Tooltip>
            )}
          </div>
        );
      },
    }, */
  ];
};
