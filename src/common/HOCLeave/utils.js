import { Attachment } from "@mui/icons-material";
import axios from "axios";
import { TableButton } from "Components";
import PBadge from "Components/Badge";
import moment from "moment";
import { fromDateToDateDiff } from "utility/fromDateToDateDiff";
import * as Yup from "yup";
import { getDownlloadFileView_Action } from "../../commonRedux/auth/actions";
import {
  dateFormatter,
  dateFormatterForInput,
} from "../../utility/dateFormatter";

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
  isSelfService: false,
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

export const empMgmtLeaveApplicationDto = (
  dispatch,
  setIsEdit,
  setSingleData,
  setImageFile,
  demoPopupForDelete,
  values,
  isOfficeAdmin
) => {
  return [
    {
      title: "SL",
      render: (value, row, index) => index + 1,
      align: "center",
      width: 30,
      fixed: "left",
    },
    {
      title: "Leave Type",
      dataIndex: "LeaveType",
      render: (_, record) => (
        <div className="d-flex align-items-center ">
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
    },

    {
      title: "From Date",
      dataIndex: "AppliedFromDate",
      render: (date) => dateFormatter(date),
    },
    {
      title: "To Date",
      dataIndex: "AppliedToDate",
      render: (date) => dateFormatter(date),
    },

    {
      title: "Application Date",
      dataIndex: "ApplicationDate",
      render: (date) => dateFormatter(date),
    },
    {
      title: "Half Day",
      dataIndex: "HalfDayRange",
    },
    {
      title: "Location",
      dataIndex: "AddressDuetoLeave",
    },
    {
      title: "Reason",
      dataIndex: "Reason",
    },
    {
      title: "Total",
      dataIndex: "",
      render: (_, record) => {
        return record?.HalfDay ? (
          "0.5"
        ) : (
          <span>
            {`${
              +fromDateToDateDiff(
                dateFormatterForInput(record?.AppliedFromDate),
                dateFormatterForInput(record?.AppliedToDate)
              )?.split(" ")[0] + 1
            } Days`}{" "}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "ApprovalStatus",
      render: (data) => (
        <div>
          {data === "Approved" && <PBadge text={data} type="success" />}
          {data === "Pending" && <PBadge text={data} type="warning" />}
          {data === "Rejected" && <PBadge text={data} type="danger" />}
          {data === "Process" && <PBadge text={data} type="warning" />}
        </div>
      ),
    },

    {
      width: 50,
      align: "center",
      render: (data, rec) => (
        <>
          <TableButton
            buttonsList={[
              rec?.ApprovalStatus === "Pending" &&
                rec?.LeaveTypeId !== 5 && {
                  type: "edit",
                  onClick: (e) => {
                    e.stopPropagation();
                    setIsEdit(true);
                    e.stopPropagation();
                    // scrollRef.current.scrollIntoView({
                    //   behavior: "smooth",
                    // });
                    setSingleData(rec);

                    setImageFile({
                      globalFileUrlId: rec?.DocumentFileUrl,
                    });
                  },
                },
              isOfficeAdmin &&
                rec?.ApprovalStatus === "Approved" &&
                rec?.LeaveTypeId !== 5 && {
                  type: "edit",
                  onClick: (e) => {
                    e.stopPropagation();
                    setIsEdit(true);
                    e.stopPropagation();
                    // scrollRef.current.scrollIntoView({
                    //   behavior: "smooth",
                    // });
                    setSingleData(rec);

                    setImageFile({
                      globalFileUrlId: rec?.DocumentFileUrl,
                    });
                  },
                },

              rec?.ApprovalStatus === "Pending" &&
                rec?.LeaveTypeId !== 5 && {
                  type: "delete",
                  onClick: (e) => {
                    e.stopPropagation();
                    setSingleData("");
                    demoPopupForDelete(data, values);
                  },
                },
              isOfficeAdmin &&
                rec?.ApprovalStatus === "Approved" &&
                rec?.LeaveTypeId !== 5 && {
                  type: "delete",
                  onClick: (e) => {
                    e.stopPropagation();
                    setSingleData("");
                    demoPopupForDelete(data, values);
                  },
                },
            ]}
          />
        </>
      ),
    },
  ];
};

export const getLvePunishmentData = async (
  tableName,
  buId,
  empId,
  yearId,
  setLoading,
  setter
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=${tableName}&BusinessUnitId=${buId}&EmpId=${empId}&YearId=${yearId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getLeaveTypeData = async (
  tableName,
  buId,
  empId,
  yearId,
  setLoading,
  id,
  setter
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=${tableName}&BusinessUnitId=${buId}&EmpId=${empId}&YearId=${yearId}&leaveTypeId=${id}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};