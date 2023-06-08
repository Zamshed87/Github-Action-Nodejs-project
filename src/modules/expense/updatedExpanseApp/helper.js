import { EditOutlined, InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Chips from "../../../common/Chips";
import { gray900 } from "../../../utility/customColor";
import { dateFormatter } from "../../../utility/dateFormatter";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import { LightTooltip } from "../../employeeProfile/LoanApplication/helper";

export const empExpenceDtoCol = (history, page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
      width: 20,
    },
    {
      title: "Expense Type",
      dataIndex: "strExpenseType",
      sorter: true,
      filter: true,
    },
    {
      title: "To Date",
      dataIndex: "dteExpenseDate",
      isDate: true,
      render: (_, record) => dateFormatter(record?.dteExpenseDate),
    },
    {
      title: "Expense Amount",
      dataIndex: "numExpenseAmount",
      sorter: true,
      render: (_, record) => (
        <span className="text-right">
          {numberWithCommas(record?.numExpenseAmount)}
        </span>
      ),
    },
    {
      title: "Reason",
      dataIndex: "strDiscription",
      sorter: true,
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
                        `/SelfService/expense/expenseApplication/edit/${item?.ExpenseId}`
                      );
                    }}
                  />
                </button>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
};
