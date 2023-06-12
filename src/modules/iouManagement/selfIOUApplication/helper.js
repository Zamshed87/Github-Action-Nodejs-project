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
  pageSize,
  setPages,
  employeeId = null
) => {
  setLoading && setLoading(true);

  let apiUrl = `/Employee/GetIOULanding?businessUnitId=${buId}&workplaceGroupId=${wgId}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}`;

  iouId >= 0 && (apiUrl += `&intIOUId=${iouId}`);

  search && (apiUrl += `&searchTxt=${search}`);

  docType && (apiUrl += `&strDocFor=${docType}`);

  employeeId && (apiUrl += `&employeeId=${employeeId}`);

  if (partType === "ViewById") {
    apiUrl = `/Employee/IOULandingById?intIOUId=${iouId}`;
  }

  if (partType === "DocList") {
    apiUrl = `/Employee/IouDocList?intIOUId=${iouId}&strDocFor=${docType}`;
  }

  try {
    const res = await axios.get(apiUrl);

    if (res?.data) {
      if (partType === "IOULandingByEmployeeId") {
        const modifiedData = res?.data?.iouApplicationLandings?.map(
          (item, index) => ({
            ...item,
            initialSerialNumber: index + 1,
          })
        );
        setter(modifiedData);

        setPages({
          current: res?.data?.currentPage,
          pageSize: res?.data?.pageSize,
          total: res?.data?.totalCount,
        });
      }

      if (partType === "ViewById") {
        setter?.(res?.data);
      }

      if (partType === "DocList") {
        setter?.(res?.data);
      }

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
      dataIndex: "iouCode",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Application Date",
      dataIndex: "applicationDate",
      render: (record) => dateFormatter(record?.applicationDate),
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
      dataIndex: "status",
      width: 100,
      filter: false,
      render: (item) => {
        return (
          <div>
            {item?.status === "Approved" && (
              <Chips label="Approved" classess="success p-2" />
            )}
            {item?.status === "Pending" && (
              <Chips label="Pending" classess="warning p-2" />
            )}
            {item?.status === "Process" && (
              <Chips label="Process" classess="primary p-2" />
            )}
            {item?.status === "Rejected" && (
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
      dataIndex: "adjustmentStatus",
      filter: false,
      sort: true,
      render: (item) => {
        return (
          <div>
            {item?.adjustmentStatus === "Adjusted" && (
              <Chips label="Adjusted" classess="success p-2" />
            )}
            {item?.adjustmentStatus === "Pending" && (
              <Chips label="Pending" classess="warning p-2" />
            )}
            {item?.adjustmentStatus === "Process" && (
              <Chips label="Process" classess="primary p-2" />
            )}
            {item?.adjustmentStatus === "Completed" && (
              <Chips label="Completed" classess="indigo p-2" />
            )}
            {item?.adjustmentStatus === "Rejected" && (
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
      render: (item) => {
        return (
          <div className="d-flex">
            {item?.status === "Pending" && (
              <Tooltip title="Edit" arrow>
                <button className="iconButton" type="button">
                  <EditOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push(
                        `/SelfService/iOU/application/edit/${item?.iouId}`
                      );
                    }}
                  />
                </button>
              </Tooltip>
            )}
            {item?.adjustmentStatus === "Adjusted" && (
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
