import { DeleteOutline, EditOutlined, InfoOutlined } from "@mui/icons-material";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/styles";
import { toast } from "react-toastify";
import AvatarComponent from "../../../../common/AvatarComponent";
import Chips from "../../../../common/Chips";
import IConfirmModal from "../../../../common/IConfirmModal";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { timeFormatter } from "../../../../utility/timeFormatter";
import { getOvertimeLandingData, overtimeEntry_API } from "../helper";

const OverTimeEntryTableItem = ({
  item,
  index,
  getData,
  permission,
  orgId,
  buId,
  employeeId,
  setLoading,
  history,
  setRowDto,
  setAllData,
}) => {
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

  const deleteHandler = (item) => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to delete ?`,
      yesAlertFunc: () => {
        const callback = () => {
          getOvertimeLandingData(
            {
              strPartName: "Overtime",
              status: "All",
              departmentId: 0,
              designationId: 0,
              supervisorId: 0,
              employeeId: 0,
              workplaceGroupId: 0,
              businessUnitId: buId,
              loggedEmployeeId: 0,
            },
            setRowDto,
            setLoading,
            () => {},
            setAllData
          );
        };
        let payload = {
          partType: "Overtime",
          employeeId: item?.EmployeeId,
          autoId: item?.OvertimeId,
          isActive: false,
          businessUnitId: buId,
          accountId: orgId,
          startTime: item?.startTime || null,
          endTime: item?.endTime || null,
          workplaceId: 0,
          overtimeDate: item?.date,
          overtimeHour: +item?.overTimeHour,
          reason: item?.reason,
          intCreatedBy: employeeId,
        };
        overtimeEntry_API(payload, setLoading, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <td className="text-center">
        <div>{index + 1}</div>
      </td>
      <td>
        <div className="content tableBody-title">{item?.EmployeeCode}</div>
      </td>
      <td>
        <div className="employeeInfo d-flex align-items-center">
          <AvatarComponent
            classess="mr-2"
            letterCount={1}
            label={item?.EmployeeName}
          />
          <div className="employeeTitle">
            <p className="employeeName tableBody-title">{item?.EmployeeName}</p>
          </div>
        </div>
      </td>
      <td>
        <div className="content tableBody-title">{item?.DesignationName}</div>
      </td>
      <td>
        <div className="content tableBody-title"> {item?.DepartmentName}</div>
      </td>
      <td>
        <div className="content tableBody-title">
          {dateFormatter(item?.OvertimeDate)}
        </div>
      </td>
      <td>
        <div className="content tableBody-title">
          {" "}
          {item?.StartTime && timeFormatter(item?.StartTime)}
        </div>
      </td>
      <td>
        <div className="content tableBody-title">
          {"  "}
          {item?.EndTime && timeFormatter(item?.EndTime)}
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center tableBody-title">
          <LightTooltip
            title={
              <div className="movement-tooltip p-2">
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                    className="tooltip-title"
                  >
                    Reason
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                    className="tooltip-subTitle"
                  >
                    {item?.Reason}
                  </p>
                </div>
              </div>
            }
            arrow
          >
            <InfoOutlined
              sx={{ marginRight: "12px", color: "rgba(0, 0, 0, 0.6)" }}
            />
          </LightTooltip>
          <div>{item?.OvertimeHour}</div>
        </div>
      </td>
      <td>
        {item?.ApprovalStatus === "Approve" && (
          <Chips label="Approved" classess="success" />
        )}
        {item?.ApprovalStatus === "Pending" && (
          <Chips label="Pending" classess="warning" />
        )}
        {item?.ApprovalStatus === "Reject" && (
          <Chips label="Rejected" classess="danger" />
        )}
      </td>
      <td>
        {item?.ApprovalStatus === "Pending" && (
          <div className="d-flex">
            <Tooltip title="Edit" arrow>
              <button type="button" className="iconButton">
                <EditOutlined
                  sx={{ fontSize: "20px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!permission?.isEdit)
                      return toast.warn("You don't have permission");
                    history.push({
                      pathname: `/profile/overTimeEntry/edit/${item?.OvertimeId}`,
                      state: item,
                    });
                  }}
                />
              </button>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <button className="iconButton">
                <DeleteOutline
                  sx={{ fontSize: "20px" }}
                  onClick={(e) => {
                    if (!permission?.isClose)
                      return toast.warn("You don't have permission");
                    deleteHandler(item);
                  }}
                />
              </button>
            </Tooltip>
          </div>
        )}
      </td>
    </>
  );
};

export default OverTimeEntryTableItem;
