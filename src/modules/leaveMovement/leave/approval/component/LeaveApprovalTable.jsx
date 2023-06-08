/* eslint-disable no-unused-vars */
import { Attachment, Cancel, CheckCircle } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/styles";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AvatarComponent from "../../../../../common/AvatarComponent";
import Chips from "../../../../../common/Chips";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../../common/IConfirmModal";
import MuiIcon from "../../../../../common/MuiIcon";
import { getDownlloadFileView_Action } from "../../../../../commonRedux/auth/actions";
import {
  failColor,
  gray900,
  greenColor,
  successColor,
} from "../../../../../utility/customColor";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import {
  getAllLeaveApplicatonListDataForApproval,
  leaveApproveReject,
} from "../../helper";

const LeaveApprovalTable = ({ objProps }) => {
  const {
    key,
    item,
    index,
    leaveApplicationData,
    setAllLeaveApplicatonData,
    setSingleData,
    setViewModal,
    appliedStatus,
    setCreateModal,
    setImageFile,
    filterValues,
    setAllData,
    setLoading,
    /* isSupOrLineManager, */
  } = objProps;

  const { orgId, employeeId, isOfficeAdmin } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();
  const demoPopup = (action, text, item) => {
    let payload = [
      {
        applicationId: item?.leaveApplication?.intApplicationId,
        // approverEmployeeId: item?.leaveApplication?.intEmployeeId,
        fromDate: item?.leaveApplication?.dteFromDate,
        toDate: item?.leaveApplication?.dteToDate,
        approverEmployeeId: employeeId,
        isReject: text === "Approve" ? false : true,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];

    const callback = () => {
      getAllLeaveApplicatonListDataForApproval(
        {
          approverId: employeeId,
          workplaceGroupId: filterValues?.workplace?.id || 0,
          departmentId: filterValues?.department?.id || 0,
          designationId: filterValues?.designation?.id || 0,
          applicantId: filterValues?.employee?.id || 0,
          leaveTypeId: filterValues?.leaveType?.LeaveTypeId || 0,
          fromDate: filterValues?.fromDate || "",
          toDate: filterValues?.toDate || "",
          applicationStatus:
            filterValues?.appStatus?.label === "Rejected"
              ? "Reject"
              : filterValues?.appStatus?.label || "Pending",
          isAdmin: isOfficeAdmin,
          // isSupOrLineManager: isSupOrLineManager?.value,
          isSupOrLineManager: 0,
          accountId: orgId,
        },

        setAllLeaveApplicatonData,
        setAllData,
        setLoading
      );
    };
    let confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to ${action}? `,
      yesAlertFunc: () => {
        leaveApproveReject(payload, callback);
      },
      noAlertFunc: () => { },
    };
    IConfirmModal(confirmObject);
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
  return (
    <tr
      className="hasEvent"
      onClick={(e) => {
        setSingleData(item);
        setViewModal(true);
        setImageFile(item?.strDocumentFile);
      }}
      key={key}
    >
      <td style={{ textAlign: "center" }}>{index + 1}</td>
      {!(
        appliedStatus?.label === "Approved" ||
        appliedStatus?.label === "Rejected"
      ) && (
          <td
            className="m-0"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <FormikCheckBox
              styleObj={{
                color: gray900,
                checkedColor: greenColor,
                margin: "0 0 0 -2px",
              }}
              name="selectCheckbox"
              color={greenColor}
              checked={leaveApplicationData?.listData[index]?.selectCheckbox}
              onChange={(e) => {
                let data = [...leaveApplicationData?.listData];
                data[index].selectCheckbox = e.target.checked;
                setAllLeaveApplicatonData({ listData: [...data] });
              }}
            />
          </td>
        )}
      <td>
        <div className="tableBody-title"> {item?.employeeCode}</div>
      </td>
      <td className="m-0">
        <div className="employeeInfo d-flex align-items-center">
          <AvatarComponent letterCount={1} label={item?.employeeName} />
          <div className="ml-3 tableBody-title">{item?.employeeName}</div>
        </div>
      </td>
      <td>
        <p className="tableBody-title">
          {item?.designation}, {item?.employmentType}
        </p>
      </td>
      <td>
        <div className="tableBody-title">{item?.department}</div>
      </td>
      <td>
        <div className="d-flex align-items-center justify-content-start">
          <LightTooltip
            title={
              <div className="movement-tooltip p-1">
                <div className="border-bottom">
                  <p
                    className="tooltip-title"
                    style={{ fontSize: "12px", fontWeight: "600" }}
                  >
                    Reason
                  </p>
                  <p
                    className="tooltip-subTitle"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                  >
                    {item?.leaveApplication?.strReason}
                  </p>
                </div>
                <div>
                  <p
                    className="tooltip-title mt-1"
                    style={{ fontSize: "12px", fontWeight: "600" }}
                  >
                    Location
                  </p>
                  <p
                    className="tooltip-subTitle mb-0"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                  >
                    {item?.leaveApplication?.strAddressDuetoLeave}
                  </p>
                </div>
              </div>
            }
            arrow
          >
            <InfoOutlinedIcon sx={{ color: gray900 }} />
          </LightTooltip>
          <div className="ml-2 tableBody-title"> {item?.leaveType}</div>

          {item?.intDocumentFileId && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                dispatch(getDownlloadFileView_Action(item?.intDocumentFileId));
              }}
            >
              <div className="text-decoration-none file text-primary">
                <Attachment /> attachment
              </div>
            </div>
          )}
        </div>
      </td>
      <td>
        <div className="tableBody-title">{item?.dateRange}</div>
      </td>
      <td>
        <div className="tableBody-title">
          {dateFormatter(item?.leaveApplication?.dteApplicationDate)}
        </div>
      </td>
      {isOfficeAdmin && (
        <td>
          <div className="tableBody-title">{item?.currentStage}</div>
        </td>
      )}
      <td className="text-center action-chip" width="14%">
        {item?.status === "Approved" && (
          <Chips label="Approved" classess="success" />
        )}
        {item?.status === "Pending" && (
          <>
            <div className="actionChip">
              <Chips label="Pending" classess=" warning" />
            </div>
            <div className="d-flex actionIcon justify-content-center">
              {/* <Tooltip title="Edit">
                <div
                  className="mr-0 muiIconHover success "
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreateModal(true);
                    setSingleData(item);
                  }}
                >
                  <MuiIcon
                    icon={
                      <EditOutlinedIcon sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                    }
                  />
                </div>
              </Tooltip> */}
              <Tooltip title="Approve">
                <div
                  className="mx-2 muiIconHover success "
                  onClick={(e) => {
                    e.stopPropagation();
                    demoPopup("approve", "Approve", item);
                  }}
                >
                  <MuiIcon
                    icon={<CheckCircle sx={{ color: successColor }} />}
                  />
                </div>
              </Tooltip>
              <Tooltip title="Reject">
                <div
                  className="muiIconHover  danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    demoPopup("reject", "Reject", item);
                  }}
                >
                  <MuiIcon icon={<Cancel sx={{ color: failColor }} />} />
                </div>
              </Tooltip>
            </div>
          </>
        )}
        {item?.status === "Rejected" && (
          <Chips label="Rejected" classess="danger" />
        )}
      </td>
    </tr>
  );
};

export default LeaveApprovalTable;
