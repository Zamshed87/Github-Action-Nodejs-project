/* eslint-disable no-unused-vars */
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/styles";
import { useState } from "react";
import AvatarComponent from "../../../../../common/AvatarComponent";
import Chips from "../../../../../common/Chips";
import ScrollableTable from "../../../../../common/ScrollableTable";
import SortingIcon from "../../../../../common/SortingIcon";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import { getPDFAction } from "../../../../../utility/downloadFile";
import { formatMoney } from "../../../../../utility/formatMoney";

const CardTable = ({ propsObj }) => {
  const { setLoading, rowDto, setRowDto } = propsObj;

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(() => ({
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
  // filter
  const [empOrder, setEmpOrder] = useState("desc");
  const [designationOrder, setDesignationOrder] = useState("desc");
  const [departmentOrder, setDepartmentOrder] = useState("desc");

  // ascending & descending
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...rowDto];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setRowDto(modifyRowData);
  };
  return (
    <>
      <ScrollableTable
        classes="salary-process-table"
        secondClasses="table-card-styled tableOne scroll-table-height"
      >
        <thead>
          <tr>
            <th style={{ width: "40px", textAlign: "center" }}>SL</th>
            <th>Code</th>
            <th
             className="fixed-column"
             style={{ left: "125px" }}
            >
              <div
                className="d-flex align-items-center"
                onClick={() => {
                  setEmpOrder(empOrder === "desc" ? "asc" : "desc");
                  commonSortByFilter(empOrder, "EmployeeName");
                }}
              >
                <div>Employee</div>
                <div>
                  <SortingIcon viewOrder={empOrder}></SortingIcon>
                </div>
              </div>
            </th>
            <th>
              <div
                className="d-flex align-items-center"
                onClick={() => {
                  setDesignationOrder(
                    designationOrder === "desc" ? "asc" : "desc"
                  );
                  commonSortByFilter(designationOrder, "DesignationName");
                }}
              >
                <div>Designation</div>
                <div>
                  <SortingIcon viewOrder={designationOrder}></SortingIcon>
                </div>
              </div>
            </th>
            <th>
              <div
                className="d-flex align-items-center"
                onClick={() => {
                  setDepartmentOrder(
                    departmentOrder === "desc" ? "asc" : "desc"
                  );
                  commonSortByFilter(departmentOrder, "DepartmentName");
                }}
              >
                <div>Department</div>
                <div>
                  <SortingIcon viewOrder={departmentOrder}></SortingIcon>
                </div>
              </div>
            </th>
            <th>
              <div className="sortable">Separation Type</div>
            </th>
            <th className="text-center">
              <div>Joining Date</div>
            </th>
            <th width="7%">
              <div className="sortable">
                <div>Service Length</div>
              </div>
            </th>
            <th width="7%" className="text-center">
              <div> Application Date</div>
            </th>
            <th width="10%" className="text-right">
              <div>Adjusted Amount</div>
            </th>
            <th className="text-center">
              <div> Status</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((data, index) => (
            <tr
              key={index}
              className="hasEvent"
              onClick={(e) => {
                getPDFAction(
                  `/PdfAndExcelReport/SeparationReportByEmployee?EmployeeId=${data?.EmployeeId}`,
                  setLoading
                );
              }}
            >
              <td
                className="text-center"
                style={{ color: "rgba(0, 0, 0, 0.6)" }}
              >
                <div>{index + 1}</div>
              </td>
              <td>
                <div className="tableBody-title"> {data?.EmployeeCode}</div>
              </td>
              <td
               className="fixed-column"
               style={{ left: "125px" }}
               >
                <div className="d-flex align-items-center">
                  <div className="emp-avatar">
                    <AvatarComponent
                      classess=""
                      letterCount={1}
                      label={data?.EmployeeName}
                    />
                  </div>
                  <div className="ml-2 tableBody-title">
                    {data?.EmployeeName}
                  </div>
                </div>
              </td>
              <td>
                <div className="tableBody-title" style={{ width: "250px" }}>
                  {data?.DesignationName ? `${data?.DesignationName}` : ""}
                </div>
              </td>
              <td>
                <div className="tableBody-title">{data?.DepartmentName}</div>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <LightTooltip
                    title={
                      <div className="movement-tooltip p-2">
                        <div className="application-tooltip">
                          <h6>Employement Type</h6>
                          <h5 className="tableBody-title">
                            {data?.EmployementType}
                          </h5>
                        </div>
                        <div className="application-tooltip">
                          <h6>Reason</h6>
                          <h5 className="tableBody-title">{data?.Reason}</h5>
                        </div>
                      </div>
                    }
                    arrow
                  >
                    <InfoOutlinedIcon sx={{ fontSize: "1rem" }} />
                  </LightTooltip>
                  <div className="d-flex tableBody-title pl-1">
                    {data?.SeparationTypeName}
                  </div>
                </div>
              </td>
              <td className="text-center">
                <div className="tableBody-title">{data?.JoiningDate}</div>
              </td>
              <td>
                <div className="tableBody-title">{data?.ServiceLength}</div>
              </td>
              <td className="text-center">
                <div className="tableBody-title">
                  {dateFormatter(data?.InsertDate)}
                </div>
              </td>
              <td width="5%" className="text-right">
                <div className="tableBody-title">
                  {formatMoney(data?.AdjustedAmount)}
                </div>
              </td>
              <td className="text-center">
                <div className="tableBody-title">
                  {data?.ApprovalStatus === "Approve" && (
                    <Chips label="Approved" classess="success" />
                  )}
                  {data?.ApprovalStatus === "Pending" && (
                    <Chips label="Pending" classess=" warning" />
                  )}
                  {data?.ApprovalStatus === "Reject" && (
                    <Chips label="Rejected" classess="danger" />
                  )}
                  {data?.ApprovalStatus === "Released" && (
                    <>
                      <Chips label="Released" classess=" p-2 mr-2" />
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
    </>
  );
};

export default CardTable;
