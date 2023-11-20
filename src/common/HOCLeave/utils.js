import * as Yup from "yup";
import moment from "moment";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { LightTooltip } from "../LightTooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { getDownlloadFileView_Action } from "../../commonRedux/auth/actions";
import { Attachment, EditOutlined } from "@mui/icons-material";
import {
  dateFormatter,
  dateFormatterForInput,
} from "../../utility/dateFormatter";
import Chips from "../Chips";
import { Tooltip } from "@mui/material";

export const initDataForLeaveApplication = {
  search: "",
  leaveType: "",
  employee: "",
  location: "",
  reason: "",
  fromDate: "",
  toDate: "",
  halfTime: "",
  isHalfDay: "",
  year: { value: moment().year(), label: moment().year() },
};

export const validationSchemaForLeaveApplication = Yup.object().shape({
  location: Yup.string().required("Location is required"),
  reason: Yup.string().required("Reason is required"),
  fromDate: Yup.string().required("From Date is required"),
  toDate: Yup.string().required("To Date is required"),
  leaveType: Yup.object()
    .shape({
      label: Yup.string().required("Leave type is required"),
      value: Yup.string().required("Leave type is required"),
    })
    .typeError("Leave type is required"),
});

export const empMgmtLeaveApplicationDtoColumn = (
  setValues,
  values,
  dispatch,
  setIsEdit,
  scrollRef,
  setSingleData,
  setImageFile,
  demoPopupForDelete
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Leave Type",
      dataIndex: "LeaveType",
      render: (_, record) => (
        <div className="d-flex align-items-center ">
          <LightTooltip
            title={
              <div className="movement-tooltip p-2">
                <div className="border-bottom">
                  <p className="tooltip-title">Reason</p>
                  <p className="tooltip-subTitle">{record?.Reason}</p>
                </div>
                <div>
                  <p className="tooltip-title mt-2">Location</p>
                  <p className="tooltip-subTitle mb-0">
                    {record?.AddressDuetoLeave}
                  </p>
                </div>
              </div>
            }
            arrow
          >
            <InfoOutlinedIcon
              sx={{ marginRight: "12px", color: "rgba(0, 0, 0, 0.6)" }}
            />
          </LightTooltip>
          <div className="d-flex align-items-center">
            <div>{record?.LeaveType}</div>
            <div className="leave-application-document ml-1">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(
                    getDownlloadFileView_Action(record?.DocumentFileUrl)
                  );
                }}
              >
                {record?.DocumentFileUrl !== 0 && <Attachment />}
              </span>
            </div>
          </div>
        </div>
      ),
      sorter: false,
      filter: true,
    },
    {
      title: "Location",
      dataIndex: "AddressDuetoLeave",
      sorter: true,
      filter: true,
      isNumber: true,
    },
    {
      title: "From Date",
      dataIndex: "AppliedFromDate",
      render: (date) => dateFormatter(date),
      sorter: false,
      filter: false,
    },
    {
      title: "To Date",
      dataIndex: "AppliedToDate",
      render: (date) => dateFormatter(date),
      sorter: false,
      filter: false,
    },
    {
      title: "Application Date",
      dataIndex: "ApplicationDate",
      render: (date) => dateFormatter(date),
      sorter: false,
      filter: false,
    },
    {
      title: "Half Day",
      dataIndex: "HalfDayRange",
    },
    {
      title: "Status",
      dataIndex: "ApprovalStatus",
      render: (data, record) => (
        <div>
          {data === "Approved" && <Chips label={data} classess="success" />}
          {data === "Pending" && <Chips label={data} classess="warning" />}
          {data === "Rejected" && <Chips label={data} classess="danger" />}
          {data === "Process" && <Chips label={data} classess="primary" />}
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      className: "text-center",
      render: (data, record) => (
        <div className="d-flex justify-content-center">
          {record?.ApprovalStatus === "Pending" && (
            <Tooltip title="Edit" arrow>
              <button className="iconButton" type="button">
                <EditOutlined
                  onClick={(e) => {
                    setIsEdit(true);
                    e.stopPropagation();
                    scrollRef.current.scrollIntoView({
                      behavior: "smooth",
                    });
                    setSingleData(record);
                    setValues({
                      ...values,
                      leaveType: {
                        value: record?.LeaveTypeId,
                        label: record?.LeaveType,
                      },
                      fromDate: dateFormatterForInput(record?.AppliedFromDate),
                      toDate: dateFormatterForInput(record?.AppliedToDate),
                      location: record?.AddressDuetoLeave,
                      reason: record?.Reason,
                    });

                    setImageFile({
                      globalFileUrlId: record?.DocumentFileUrl,
                    });
                  }}
                />
              </button>
            </Tooltip>
          )}
          {record?.ApprovalStatus === "Pending" && (
            <Tooltip title="Delete" arrow>
              <button type="button" className="iconButton">
                <DeleteOutlineOutlinedIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    setSingleData("");
                    demoPopupForDelete(data, values);
                  }}
                />
              </button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
};
