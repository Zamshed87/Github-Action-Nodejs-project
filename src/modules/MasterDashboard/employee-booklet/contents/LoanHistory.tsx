import { Attachment, InfoOutlined } from "@mui/icons-material";
import Chips from "common/Chips";
import { LightTooltip } from "common/LightTooltip";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { DataTable } from "Components";
import React, { forwardRef } from "react";
import { useDispatch } from "react-redux";
import { dateFormatter } from "utility/dateFormatter";
import { numberWithCommas } from "utility/numberWithCommas";

const LoanHistory = forwardRef((props: any, ref: any) => {
  const loanData = props?.loanDto;
  const dispatch = useDispatch();

  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) => index + 1,
      align: "center",
    },

    {
      title: "Loan Type",
      dataIndex: "loanType",
      render: (_: any, data: any) => {
        return (
          <div className="d-flex align-items-center justify-content-start">
            <div className="pr-1">
              <LightTooltip
                style={{ fontSize: "14px" }}
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
      render: (_: any, record: any) => dateFormatter(record?.applicationDate),
    },
    {
      title: "Loan Amount",
      dataIndex: "loanAmount",
      render: (_: any, item: any) => (
        <p className="text-center"> {numberWithCommas(item?.loanAmount)}</p>
      ),
    },
    {
      title: "Installment Amount",
      dataIndex: "numberOfInstallmentAmount",
      render: (_: any, item: any) => (
        <p className="text-center">
          {" "}
          {numberWithCommas(item?.numberOfInstallmentAmount)}
        </p>
      ),
    },
    {
      title: "Installments",
      dataIndex: "numberOfInstallment",
      className: "text-center",
    },
    {
      title: "Approve Loan Amount",
      dataIndex: "approveLoanAmount",
      render: (_: any, item: any) => (
        <p className="text-center">
          {" "}
          {numberWithCommas(item?.approveLoanAmount)}
        </p>
      ),
    },
    {
      title: "Approve Installment Amount",
      dataIndex: "approveNumberOfInstallmentAmount",
      render: (_: any, item: any) => (
        <p className="text-center">
          {" "}
          {numberWithCommas(item?.approveNumberOfInstallmentAmount)}
        </p>
      ),
    },
    {
      title: "Approve Installments",
      dataIndex: "approveNumberOfInstallment",
      className: "text-center",
    },
    {
      title: "Application Status",
      dataIndex: "applicationStatus",
      render: (_: any, data: any) => {
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
      render: (_: any, data: any) => {
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
          </div>
        );
      },
    },
  ];

  return (
    <div ref={ref} style={{ fontSize: "12px" }}>
      <center>
        <h1 style={{ fontSize: "16px" }}> Loan History</h1>
      </center>
      <div>
        <DataTable
          bordered
          data={loanData || []}
          header={header}
          scroll={{ x: 2000 }}
        />
      </div>
    </div>
  );
});

export default LoanHistory;
