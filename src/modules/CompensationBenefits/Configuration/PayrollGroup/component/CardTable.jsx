import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import Chips from "../../../../../common/Chips";
import SortingIcon from "../../../../../common/SortingIcon";

// status DDL
const statusDDL = [
  { value: "Active", label: "Active" },
  { value: "InActive", label: "Inactive" },
];

const CardTable = ({ propsObj }) => {
  const { rowDto, setRowDto, filterActiveInactive, values, status, setStatus } = propsObj;

  // sorting
  const [payrollGroupName, setPayrollGroupName] = useState("desc");
  const [payFrequency, setPayFrequency] = useState("desc");

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
    <div className="table-card-styled  payroll-group-table tableOne">
      <table className="table  movement-table">
        <thead>
          <tr>
            <th className="tableBody-title">SL</th>
            <th scope="col">
              <div
                className="sortable"
                onClick={() => {
                  setPayrollGroupName(payrollGroupName === "desc" ? "asc" : "desc");
                  commonSortByFilter(payrollGroupName, "PayrollGroupName");
                }}
              >
                <span>Payroll Group Name</span>
                <div>
                  <SortingIcon viewOrder={payrollGroupName}></SortingIcon>
                </div>
              </div>
            </th>
            <th className="content tableBody-title">
              Code
            </th>
            <th scope="col">
              <div
                className="sortable"
                onClick={() => {
                  setPayFrequency(payFrequency === "desc" ? "asc" : "desc");
                  commonSortByFilter(payFrequency, "PayFrequencyName");
                }}
              >
                <span>Pay Frequency</span>
                <div>
                  <SortingIcon viewOrder={payFrequency}></SortingIcon>
                </div>
              </div>
            </th>
            <th className="content tableBody-title">
              Start Date
            </th>
            <th className="content tableBody-title">
              End Date
            </th>
            <th>
              <div
                className="sortable d-flex align-items-center justify-content-center"
              >
                <span>Status</span>
                <span>
                  <Select
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none !important",
                      },
                      "& .MuiSelect-select": {
                        paddingRight: "15px !important",
                        marginTop: "-15px",
                      },
                    }}
                    className="selectBtn"
                    name="status"
                    IconComponent={status && status !== "Active" ? ArrowDropUp : ArrowDropDown}
                    value={values?.status}
                    onChange={(e) => {
                      filterActiveInactive(e.target.value?.label)
                      // setFieldValue("status", e.target.value);
                      setStatus(e.target.value?.label);
                      // statusTypeFilter(e.target.value?.label);
                    }}
                  >
                    {statusDDL?.length > 0 &&
                      statusDDL?.map((item, index) => {
                        return (
                          <MenuItem key={index} value={item}>
                            {item?.label}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </span>
              </div>
            </th>
            {/* <th></th> */}
          </tr>
        </thead>
        <tbody>
          {
            // tableData?.Result?.length > 0 &&
            rowDto?.map((data, index) => (
              <tr>
                <td><div className="tableBody-title pl-1">{index+1}</div></td>
                <td>
                  <div className="d-flex align-items-center tableBody-title">{data.PayrollGroupName}</div>
                </td>
                <td>
                  <div className="tableBody-title">{data.PayrollGroupCode}</div>
                </td>
                <td>
                  <div className="tableBody-title">{data.PayFrequencyName}</div>
                </td>
                <td>
                  <div className="d-flex  justify-content-center tableBody-title">{data.StartDateOfMonth}</div>
                </td>
                <td>
                  <div className="d-flex  justify-content-center">{data.EndDateOfMonth}</div>
                </td>
                <td className="text-center">
                  {data?.IsActive && <Chips label="Active" classess="success" />}
                  {!data?.IsActive && <Chips label="Inactive" classess="danger" />}
                </td>
                {/* <td  className="action-td">
                      <button
                        type="button"
                        className="iconButton"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenModal(true)
                        }}
                      >
                        <CreateOutlined />
                      </button>
                </td> */}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default CardTable;
