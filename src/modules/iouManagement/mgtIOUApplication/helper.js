import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";
import Chips from "../../../common/Chips";
import { styled, Tooltip, tooltipClasses } from "@mui/material";
import { EditOutlined, InfoOutlined } from "@mui/icons-material";
import { gray900 } from "../../../utility/customColor";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import { dateFormatter } from "../../../utility/dateFormatter";

export const getEmployeeProfileViewData = async (
  id,
  setter,
  setLoading,
  buId,
  wgId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetEmpBasicInfoById?id=${id}&businessUnitId=${buId}&workplaceGroupId=${wgId}`
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
  partType = "",
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
      if (partType === "Landing") {
        const modifiedData = res?.data?.iouApplicationLandings?.map(
          (item, index) => ({
            ...item,
            sl: index + 1,
            dteApplicationDate: item.dteApplicationDate
              ? moment(item?.dteApplicationDate).format("DD MMM, yyyy")
              : "N/A",
            dteFromDate: item?.dteFromDate
              ? moment(item?.dteFromDate).format("DD MMM, yyyy")
              : "N/A",
            dteToDate: item?.dteToDate
              ? moment(item?.dteToDate).format("DD MMM, yyyy")
              : "N/A",
            AdjustmentStatus: item?.AdjustmentStatus || "",
            Status: item?.Status || "",
          })
        );
        setter?.(modifiedData);

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

export const searchFromIouLanding = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter(
      (item) =>
        regex.test(item?.strEmployeeCode?.toLowerCase()) ||
        regex.test(item?.strEmployeeName?.toLowerCase()) ||
        regex.test(item?.strIOUCode?.toLowerCase())
    );
    setRowDto(newDta);
  } catch {
    setRowDto([]);
  }
};

export const iouLandingTableColumn = (page, paginationSize, history) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Employee",
      dataIndex: "employeeName",
      sort: true,
      filter: false,
      fieldType: "string",
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
      className: "text-right",
      sort: true,
      render: (record) => numberWithCommas(record?.numIOUAmount),
      filter: false,
      fieldType: "number",
    },
    {
      title: "Adjusted",
      dataIndex: "numAdjustedAmount",
      className: "text-right",
      sort: true,
      render: (record) => numberWithCommas(record?.numAdjustedAmount),
      filter: false,
      fieldType: "number",
    },
    {
      title: "Adjusted by Accounts",
      dataIndex: "numReceivableAmount",
      className: "text-right",
      sort: true,
      render: (record) => numberWithCommas(record?.numReceivableAmount),
      filter: false,
      fieldType: "number",
      width: 120,
    },
    {
      title: "Pay to Accounts",
      dataIndex: "numPendingAdjAmount",
      className: "text-right",
      sort: true,
      render: (record) => numberWithCommas(record?.numPendingAdjAmount) || 0,
      filter: false,
      fieldType: "number",
    },
    {
      title: "Receive from Accounts",
      dataIndex: "numPayableAmount",
      className: "text-right",
      sort: true,
      render: (record) => numberWithCommas(record?.numPayableAmount),
      filter: false,
      fieldType: "number",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (item) => (
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
      ),
      filter: false,
      sort: true,
      fieldType: "string",
    },
    {
      title: "Adjustment Status",
      dataIndex: "adjustmentStatus",
      render: (item) => (
        <div>
          {" "}
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
      ),
      filter: false,
      sort: true,
      fieldType: "string",
    },
    {
      title: "",
      render: (record) => (
        <>
          {record?.status === "Pending" && (
            <div className="d-flex">
              <Tooltip title="Edit" arrow>
                <button className="iconButton" type="button">
                  <EditOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      history?.push(
                        `/profile/iOU/application/edit/${record?.iouId}`
                      );
                    }}
                  />
                </button>
              </Tooltip>
            </div>
          )}
        </>
      ),
      filter: false,
      sort: false,
      fieldType: "string",
    },
  ];
};

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff !important",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow:
      "0px 1px 5px rgba(0, 0, 0, 0.05), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 5px rgba(0, 0, 0, 0.05)",
    fontSize: 11,
  },
}));
