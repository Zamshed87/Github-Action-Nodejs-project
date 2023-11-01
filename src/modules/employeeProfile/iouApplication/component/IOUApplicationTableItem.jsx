import React from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { shallowEqual, useSelector } from "react-redux";
import AvatarComponent from "../../../../common/AvatarComponent";
import Chips from "../../../../common/Chips";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { toast } from "react-toastify";
import { timeFormatter } from "../../../../utility/timeFormatter";

const IOUApplicationTableItem = ({
  item,
  rowDto,
  setRowDto,
  index,
  setSingleData,
  setCreateModal,
  setModalType,
  setLoading,
  setIsLoading,
  getData,
  permission,
}) => {
  let LogoURL = item?.strProfileImageUrl;
  const {
    // userId,
    orgId,
    buId,
  } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  return (
    <>
      <td>
        <div className="employeeInfo d-flex align-items-center">
          <AvatarComponent letterCount={1} label={item?.EmployeeName} />
          <div className="employeeTitle ml-3">
            <p className="employeeName">
              {item?.EmployeeName} [{item?.EmployeeCode}]
            </p>
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
        <div className="content tableBody-title text-right">
          {dateFormatter(item?.OvertimeDate)}
        </div>
      </td>
      <td>
        <div className="content tableBody-title text-center">
          {" "}
          {timeFormatter(item?.StartTime)}
        </div>
      </td>
      <td>
        <div className="content tableBody-title text-center">
          {" "}
          {timeFormatter(item?.EndTime)}
        </div>
      </td>
      <td>
        <div className="content tableBody-title text-center">
          {" "}
          {item?.OvertimeHour}
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
            <button className="iconButton">
              <EditOutlinedIcon
                sx={{ fontSize: "20px" }}
                onClick={(e) => {
                  if (!permission?.isEdit)
                    return toast.warn("You don't have permission");
                  setModalType("edit");
                  setSingleData(item);
                  setCreateModal(true);
                }}
              />
            </button>
            <button className="iconButton">
              <DeleteOutlineIcon
                sx={{ fontSize: "20px" }}
                // onClick={(e) => {
                //   if(!permission?.isClose) return toast.warn("You don't have permission")
                //   overtimeEntry_AP(item, orgId, buId, setIsLoading, "delete", () => {
                //     getData();
                //   });
                // }}
              />
            </button>
          </div>
        )}
      </td>
    </>
  );
};

export default IOUApplicationTableItem;
