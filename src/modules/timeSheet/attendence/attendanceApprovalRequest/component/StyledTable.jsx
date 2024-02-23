import React from "react";
import { Tooltip } from "@mui/material";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import { greenColor, gray900 } from "../../../../../utility/customColor";
import Chips from "../../../../../common/Chips";
import { CreateOutlined } from "@mui/icons-material";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import { useHistory } from "react-router-dom";

const StyledTable = (props) => {
  const history = useHistory();

  const {
    tableData,
    setOpenModal,
    setTableData,
    setSingleRowData,
  } = props;

  const getWeek = (day) => {
    if (day === 0) {
      return "Sun";
    } else if (day === 1) {
      return "Mon";
    } else if (day === 2) {
      return "Tue";
    } else if (day === 3) {
      return "Wed";
    } else if (day === 4) {
      return "Thu";
    } else if (day === 5) {
      return "Fri";
    } else if (day === 6) {
      return "Sat";
    }
  };

  let day = (date) => {
    let getDay = new Date(date).getDay();
    return getWeek(getDay);
  };

  return (
    <>
      {tableData?.map((data, index) => (
        <tr key={index}>
          <td className="text-center">{index + 1}</td>
          <td className="m-0">
            <div onClick={(e) => e.stopPropagation()}>
              <FormikCheckBox
                styleobj={{
                  margin: "0 0 0 1px",
                  padding: "0 !important",
                  color: gray900,
                  checkedColor: greenColor,
                }}
                name="selectCheckbox"
                color={greenColor}
                checked={tableData[index]?.selectCheckbox}
                onChange={(e) => {
                  let data = [...tableData];
                  data[index].selectCheckbox = e.target.checked;
                  setTableData([...data]);
                }}
                disabled={
                  data?.ApplicationStatus === "Approved" ||
                  data?.ApplicationStatus === "Rejected"
                }
              />
            </div>
          </td>
          <td>
            {dateFormatter(data?.dteAttendanceDate) +
              ` (${day(dateFormatter(data?.dteAttendanceDate))})`}
          </td>
          <td>{data?.InTime ? data?.InTime : "-"}</td>
          <td>{data?.OutTime ? data?.OutTime : "-"}</td>
          <td>{data?.ManulInTime ? data?.ManulInTime : "-"}</td>
          <td>{data?.ManulOutTime ? data?.ManulOutTime : "-"}</td>
          <td className="text-center">
            {data?.isPresent && data?.isLate ? (
              <Chips label="Late" classess="warning" />
            ) : data?.isPresent === true ? (
              <Chips label="Present" classess="success" />
            ) : data?.isHoliday === true ? (
              <Chips label="Holiday" classess="secondary" />
            ) : data?.isOffday === true ? (
              <Chips label="Offday" classess="primary" />
            ) : data?.isLate === true ? (
              <Chips label="Late" classess="warning" />
            ) : data?.isLeave === true ? (
              <Chips label="Leave" classess="indigo" />
            ) : data?.isMovement === true ? (
              <Chips label="Movement" classess="movement" />
            ) : data?.isAbsent === true ? (
              <Chips label="Absent" classess="danger" />
            ) : (
              "-"
            )}
          </td>
          <td className="text-center">
            {data?.strRequestStatus === "Present" && (
              <Chips label="Present" classess="success" />
            )}
            {data?.strRequestStatus === "Late" && (
              <Chips label="Late" classess="warning" />
            )}
            {data?.strRequestStatus === "Absent" && (
              <Chips label="Absent" classess="danger" />
            )}
            {!data?.strRequestStatus && ("-")}
          </td>
          <td>
            {data?.strRemarks ? data?.strRemarks : "-"}
          </td>
          <td className="text-center">
            {data?.ApplicationStatus === "Approved" && (
              <Chips
                label="Approved"
                classess="success p-2"
              />
            )}
            {data?.ApplicationStatus === "Pending" && (
              <Chips
                label="Pending"
                classess="warning p-2"
              />
            )}
            {data?.ApplicationStatus === "Process" && (
              <Chips
                label="Process"
                classess="primary p-2"
              />
            )}
            {data?.ApplicationStatus === "Rejected" && (
              <Chips
                label="Rejected"
                classess="danger p-2 mr-2"
              />
            )}
          </td>
          <td>
            {(data?.ApplicationStatus !== "Approved" && data?.ApplicationStatus !== "Rejected" && !data?.selectCheckbox) && (
              <Tooltip title="Edit">
                <button
                  className="iconButton"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSingleRowData(data);
                    setOpenModal(true);
                    history.push({
                      singleRowData: data,
                    });
                  }}
                  disabled={
                    data?.selectCheckbox ||
                    data?.ApplicationStatus === "Approved" ||
                    data?.ApplicationStatus === "Rejected"
                  }
                >
                  <CreateOutlined />
                </button>
              </Tooltip>
            )}
          </td>
        </tr>
      ))}
    </>
  );
};

export default StyledTable;
