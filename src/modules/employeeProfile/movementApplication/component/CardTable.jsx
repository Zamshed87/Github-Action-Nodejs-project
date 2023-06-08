import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/styles";
import { CreateOutlined, DeleteOutlined } from "@mui/icons-material";
import { shallowEqual, useSelector } from "react-redux";
import { createMovementApplication } from "../helper";
import { getPeopleDeskAllLanding } from "../../../../common/api";
import IConfirmModal from "../../../../common/IConfirmModal";
import {
  dateFormatter,
  dateFormatterForInput,
} from "../../../../utility/dateFormatter";
import { timeFormatter } from "../../../../utility/timeFormatter";
import Chips from "../../../../common/Chips";

const CardTable = ({ propsObj }) => {
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const {
    rowDto,
    setRowDto,
    setSingleData,
    setLoading,
    setAllData,
    setValues,
    scrollRef,
    setIsEdit,
    employee,
  } = propsObj;

  const demoPopup = (data) => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: "Are you want to sure you delete your movement?",
      yesAlertFunc: () => {
        const payload = {
          partId: 3,
          movementId: data?.MovementId,
          intEmployeeId: data?.EmployeeId,
          movementTypeId: data?.MovementTypeId,
          fromDate: data?.FromDate,
          toDate: data?.ToDate,
          fromTime: data?.FromTime,
          toTime: data?.ToTime,
          reason: data?.Reason,
          location: data?.Location,
          accountId: orgId,
          businessUnitId: buId,
          isActive: true,
          insertBy: employeeId,
        };
        const callback = () => {
          getPeopleDeskAllLanding(
            "MovementApplication",
            orgId,
            buId,
            employee?.id ? employee?.id : employeeId,
            setRowDto,
            setAllData,
            setLoading
          );
          setSingleData("");
        };
        createMovementApplication(payload, setLoading, callback);
        setSingleData(data);
      },
      noAlertFunc: () => {
        //   history.push("/components/dialogs")
      },
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
    <div className="table-card-body">
      <div className="table-card-styled tableOne mt-1">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: "30px", textAlign: "center" }}>
                <div>SL</div>
              </th>
              <th>
                <div className="sortable" onClick={() => { }}>
                  <span>Movement Type </span>
                </div>
              </th>
              <th>
                <div className="sortable" onClick={() => { }}>
                  <span>From Date </span>
                </div>
              </th>
              <th>
                <div className="sortable" onClick={() => { }}>
                  <span>Start Time</span>
                </div>
              </th>
              <th>
                <div className="sortable" onClick={() => { }}>
                  <span>To Date</span>
                </div>
              </th>
              <th>
                <div className="sortable" onClick={() => { }}>
                  <span>End Time</span>
                </div>
              </th>
              <th>
                <div className="sortable" onClick={() => { }}>
                  <span> Application Date</span>
                </div>
              </th>
              <th>
                <div className="sortable center" onClick={() => { }}>
                  <span>Status</span>
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rowDto?.length > 0 &&
              rowDto?.map((data, index) => (
                <tr key={index}>
                  <td className="tableBody-title text-center">
                    <div>{index + 1}</div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center ">
                      <LightTooltip
                        title={
                          <div className="movement-tooltip p-2">
                            <div className="border-bottom">
                              <p className="tooltip-title">Reason</p>
                              <p className="tooltip-subTitle">{data?.Reason}</p>
                            </div>
                            <div>
                              <p className="tooltip-title mt-2">Location</p>
                              <p className="tooltip-subTitle mb-0">
                                {data?.Location}
                              </p>
                            </div>
                          </div>
                        }
                        arrow
                      >
                        <InfoOutlinedIcon sx={{ marginRight: "12px", color: "rgba(0,0,0,0.6)" }} />
                      </LightTooltip>
                      <span className="content tableBody-title">
                        {" "}
                        {data?.MovementType}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="content tableBody-title">
                      {dateFormatter(data?.FromDate)}
                    </div>
                  </td>
                  <td>
                    <div className="content tableBody-title">
                      {timeFormatter(data?.FromTime)}
                    </div>
                  </td>
                  <td>
                    <div className="content tableBody-title">
                      {dateFormatter(data?.ToDate)}
                    </div>
                  </td>
                  <td>
                    <div className="content tableBody-title">
                      {timeFormatter(data?.ToTime)}
                    </div>
                  </td>
                  <td>
                    <div className="content tableBody-title">
                      {dateFormatter(data?.ApplicationDate)}
                    </div>
                  </td>
                  <td className="text-center">
                    {data?.Status === "Approved" && (
                      <Chips label="Approved" classess="success" />
                    )}
                    {data?.Status === "Pending" && (
                      <Chips label="Pending" classess="warning" />
                    )}
                    {data?.Status === "Rejected" && (
                      <Chips label="Rejected" classess="danger" />
                    )}
                    {data?.Status === "Process" && (
                      <Chips label="Process" classess="primary" />
                    )}
                  </td>
                  <td width="10%">
                    {data?.Status === "Pending" && (
                      <div className="d-flex align-items-center">
                        <Tooltip title="Edit" arrow>
                          <button
                            type="button"
                            className="iconButton"
                            onClick={(e) => {
                              e.stopPropagation();
                              // setShowCreateModal(true);
                              setSingleData(data);
                              setIsEdit(true);
                              scrollRef.current.scrollIntoView({
                                behavior: "smooth",
                              });
                              setValues({
                                search: "",
                                movementType: {
                                  value: data?.MovementTypeId,
                                  label: data?.MovementType,
                                },
                                fromDate: dateFormatterForInput(data?.FromDate),
                                startTime: data?.FromTime,
                                toDate: dateFormatterForInput(data?.ToDate),
                                endTime: data?.ToTime,
                                location: data?.Location,
                                reason: data?.Reason,
                              });
                            }}
                          >
                            <CreateOutlined />
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <button
                            type="button"
                            className="iconButton mt-0 mt-md-2 mt-lg-0"
                            onClick={() => {
                              demoPopup(data);
                            }}
                          >
                            <DeleteOutlined />
                          </button>
                        </Tooltip>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CardTable;
