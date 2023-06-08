import { toast } from "react-toastify";
import axios from "axios";
import { dateFormatter } from "../../../utility/dateFormatter";
// import { numberWithCommas } from "../../../utility/numberWithCommas";
import AvatarComponent from "../../../common/AvatarComponent";
import Chips from "../../../common/Chips";
import { LightTooltip } from "../../employeeProfile/LoanApplication/helper";
import { CheckOutlined, EditOutlined, InfoOutlined } from "@mui/icons-material";
import { gray900 } from "../../../utility/customColor";
import { Tooltip } from "@mui/material";
import { numberWithCommas } from "../../../utility/numberWithCommas";

export const getEmployeeProfileViewData = async (id, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/EmployeeProfileView?employeeId=${id}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    console.log(error.message);
    setLoading && setLoading(false);
  }
};

export const saveIOUApplication = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/IOUApplicationCreateEdit`, payload);
    cb && cb();
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
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

export const iouReportDtoCol = (
  page,
  paginationSize,
  history,
  acknowledgedPopup
) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
      sort: true,
      filter: false,
      render: (item) => {
        return (
          <div className="d-flex align-items-center">
            <div className="emp-avatar">
              <AvatarComponent
                classess=""
                letterCount={1}
                label={item?.strEmployeeName}
              />
            </div>
            <div className="ml-2">
              <span>{item?.strEmployeeName}</span>
            </div>
          </div>
        );
      },
      fieldType: "string",
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
      sort: true,
      filter: false,
      fieldType: "date",
      render: (record) => dateFormatter(record?.dteApplicationDate),
    },
    {
      title: "From Date",
      dataIndex: "dteFromDate",
      render: (record) => dateFormatter(record?.dteFromDate),
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "To Date",
      dataIndex: "dteToDate",
      render: (record) => dateFormatter(record?.dteToDate),
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "IOU",
      dataIndex: "numIOUAmount",
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "Adjusted",
      dataIndex: "numAdjustedAmount",
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
      title: "Receive from Accounts",
      dataIndex: "numPayableAmount",
      sort: true,
      filter: false,
      fieldType: "number",
    },
    {
      title: "Pay to Accounts",
      dataIndex: "numPendingAdjAmount",
      sort: true,
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
                        `/SelfService/iOU/report/edit/${item?.intIOUId}`
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
      sort: false,
      filter: false,
      fieldType: "string",
    },
  ];
};
