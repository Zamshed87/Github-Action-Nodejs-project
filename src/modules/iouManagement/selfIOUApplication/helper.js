import { toast } from "react-toastify";
import axios from "axios";
import { dateFormatter } from "../../../utility/dateFormatter";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import Chips from "../../../common/Chips";
import { LightTooltip } from "../../employeeProfile/LoanApplication/helper";
import { CheckOutlined, EditOutlined, InfoOutlined } from "@mui/icons-material";
import { gray900 } from "../../../utility/customColor";
import { Tooltip } from "@mui/material";

export const saveIOUApplication = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/IOUApplicationCreateEdit`, payload);
    cb && cb();
    toast.success(res?.data?.message || "Submitted Successfully", {
      toastId: "saveIOUApplication",
    });
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong", {
      toastId: "saveIOUApplication",
    });
    setLoading && setLoading(false);
  }
};

export const getAllIOULanding = async (
  partType,
  buId,
  wgId,
  iouId,
  fromDate,
  toDate,
  search,
  docType,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  setLoading && setLoading(true);
  let searchTxt = search ? `&searchTxt=${search}` : "";
  let docTypeTxt = docType ? `&strDocFor=${docType}` : "";

  try {
    const res = await axios.get(
      `/Employee/GetAllIOULanding?strReportType=${partType}&intBusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intIOUId=${iouId}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}${searchTxt}${docTypeTxt}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const iouDtoCol = (page, paginationSize, history, acknowledgedPopup) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "IOU Code",
      dataIndex: "strIOUCode",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Application Date",
      dataIndex: "dteApplicationDate",
      render: (record) => dateFormatter(record?.dteApplicationDate),
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "From Date",
      dataIndex: "dteFromDate",
      isDate: true,
      render: (record) => dateFormatter(record?.dteFromDate),
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "To Date",
      dataIndex: "dteToDate",
      isDate: true,
      render: (record) => dateFormatter(record?.dteToDate),
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "IOU",
      dataIndex: "numIOUAmount",
      sorter: true,
      render: (record) => numberWithCommas(record?.numIOUAmount),
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "Adjusted",
      dataIndex: "numAdjustedAmount",
      render: (record) => numberWithCommas(record?.numAdjustedAmount),
      sort: true,
      filter: false,
      fieldType: "number",
    },
    {
      title: "Adjusted by Accounts",
      dataIndex: "numReceivableAmount",
      sort: true,
      render: (record) => numberWithCommas(record?.numReceivableAmount),
      width: 120,
      filter: false,
      fieldType: "number",
    },
    {
      title: "Pay To Accounts",
      dataIndex: "numPendingAdjAmount",
      sort: true,
      render: (record) => numberWithCommas(record?.numPendingAdjAmount),
      filter: false,
      fieldType: "number",
    },
    {
      title: "Receive From Accounts",
      dataIndex: "numPayableAmount",
      sort: true,
      render: (record) => numberWithCommas(record?.numPayableAmount),
      filter: false,
      fieldType: "number",
    },
    {
      title: "Status",
      dataIndex: "Status",
      width: 100,
      filter: false,
      render: (item) => {
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
      sort: true,
      fieldType: "string",
    },
    {
      title: "Adjustment Status",
      dataIndex: "AdjustmentStatus",
      filter: false,
      sort: true,
      render: (item) => {
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
      fieldType: "string",
    },
    {
      title: "",
      dataIndex: "action",
      render: (item) => {
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
      sort: true,
      filter: false,
      fieldType: "string",
    },
  ];
};
