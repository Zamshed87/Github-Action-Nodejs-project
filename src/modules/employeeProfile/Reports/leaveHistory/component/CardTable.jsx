import React, { useEffect, useState } from "react";
import SortingIcon from "../../../../../common/SortingIcon";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/styles";
import Chips from "../../../../../common/Chips";
import { Avatar } from "@material-ui/core";
import { Cancel, CheckCircle } from "@mui/icons-material";
import IConfirmModal from "../../../../../common/IConfirmModal";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import {
  failColor,
  greenColor,
  successColor,
} from "../../../../../utility/customColor";
import MuiIcon from "../../../../../common/MuiIcon";
// import {
//   getAllMovementApplicatonListData,
//   movementApproveReject,
// } from "../../helper";
import { shallowEqual, useSelector } from "react-redux";
import { dateFormatterForInput } from "../../../../../utility/dateFormatter";

const CardTable = ({ propsObj }) => {
  const {
    setFieldValue,
    tableData,
    // applicationListData,
    // setApplicationListData,
    // appliedStatus,
    // filterData,
  } = propsObj;

  const { username, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

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
    <div className="table-card-styled pt-4 card-table-small rowgap-0">
      <table className="table  movement-table">
        <thead>
          <tr>
            <th scope="col">
              <div className="d-flex align-items-center  ">
                Employee
                <SortingIcon />
              </div>
            </th>
            <th scope="col">
              <div className="d-flex align-items-center  ">
                Department
                <SortingIcon />
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-center ">
                CL
                <SortingIcon />
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-center ">
                SL
                <SortingIcon />
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-center ">
                EL
                <SortingIcon />
              </div>
            </th>
            <th scope="col">
              <div className="d-flex align-items-center  justify-content-center">
                LWP
                <SortingIcon />
              </div>
            </th>
            <th scope="col">
              <div className="d-flex align-items-center  justify-content-center">
                ML
                <SortingIcon />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((data, i) => (
            <tr key={i}>
              <td>
                <div className="employeeInfo d-flex align-items-center">
                  <Avatar
                    alt="Remy Sharp"
                    src={data?.empImg}
                    sx={{ height: 50, width: 50 }}
                  />
                  <div className="employeeTitle ml-2">
                    <p className="employeeName">
                      {data?.empName}[{data?.empCode}]
                    </p>
                    <p className="employeePosition">
                      {data?.empPosition}, {data?.empType}
                    </p>
                  </div>
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <p className="type"> {data?.empDept}</p>
                  {/* <LightTooltip
                    title={
                      <div className="movement-tooltip p-2">
                        <div className="border-bottom">
                          <p className="tooltip-title">Reason</p>
                          <p className="tooltip-subTitle">{data?.strReason}</p>
                        </div>
                        <div>
                          <p className="tooltip-title mt-2">Location</p>
                          <p className="tooltip-subTitle">
                            {data?.strLocation}
                          </p>
                        </div>
                      </div>
                    }
                    arrow
                  >
                    <InfoOutlinedIcon sx={{ marginLeft: "12px" }} />
                  </LightTooltip> */}
                </div>
              </td>
              <td className="text-center">
                <p className="date">{data?.casualLeaveTaken}</p>
                <p className="time"> {data?.casualLeaveTotal}</p>
              </td>
              <td>
                <div className=" text-center d-flex flex-column">
                  <p className="date">{data?.sickLeaveTaken}</p>
                  <p className="time"> {data?.SickLeaveTotal}</p>
                </div>
              </td>
              <td>
                <div className="text-center d-flex flex-column">
                  <p className="date">{data?.earnLeaveTaken}</p>
                  <p className="time"> {data?.earnLeaveTotal}</p>
                </div>
              </td>
              <td>
                <div className="text-center d-flex flex-column">
                  <p className="date">{data?.leaveWithoutPay}</p>
                </div>
              </td>
              <td>
                <div className="text-center d-flex flex-column">
                  <p className="date">{data?.maternityLeave}</p>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CardTable;
