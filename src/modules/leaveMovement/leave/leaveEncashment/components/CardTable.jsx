import React, { useState } from "react";
import SortingIcon from "../../../../../common/SortingIcon";
import { CreateOutlined } from "@mui/icons-material";
import Chips from "../../../../../common/Chips";
import AvatarComponent from "../../../../../common/AvatarComponent";
import NoResult from "../../../../../common/NoResult";

const CardTable = ({ rowDto, setShow, allData, setRowDto, singleData, setSingleData, setAllData, loading }) => {
  // sorting
  const [employeeOrder, setEmployeeOrder] = useState("desc");
  const [year, setYear] = useState("desc");
  const [days, setDays] = useState("desc");
  const [amount, setAmount] = useState("desc");

  // ascending & descending
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...allData];
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
      <div className="application-table">
        <div className="table-card-styled">
          {rowDto?.length > 0 ? (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <div
                        className="sortable"
                        onClick={() => {
                          setEmployeeOrder(employeeOrder === "desc" ? "asc" : "desc");
                          commonSortByFilter(employeeOrder, "employeeBasicInfo?.strEmployeeName");
                        }}
                      >
                        <span>Employee</span>
                        <div>
                          <SortingIcon viewOrder={employeeOrder}></SortingIcon>
                        </div>
                      </div>
                    </th>
                    <th>
                      <div
                        className="sortable"
                        onClick={() => {
                          setYear(year === "desc" ? "asc" : "desc");
                          commonSortByFilter(year, "leaveNencashmentApplication?.dteInsertDateTime");
                        }}
                      >
                        <span>Year</span>
                        <div>
                          <SortingIcon viewOrder={year}></SortingIcon>
                        </div>
                      </div>
                    </th>
                    <th>
                      <div
                        className="sortable justify-content-center"
                        onClick={() => {
                          setDays(days === "desc" ? "asc" : "desc");
                          commonSortByFilter(days, "leaveNencashmentApplication?.intRequestDays");
                        }}
                      >
                        <span>Request Days</span>
                        <div>
                          <SortingIcon viewOrder={days}></SortingIcon>
                        </div>
                      </div>
                    </th>
                    <th>
                      <div
                        className="sortable justify-content-center"
                        onClick={() => {
                          setAmount(amount === "desc" ? "asc" : "desc");
                          commonSortByFilter(amount, "leaveNencashmentApplication?.numRequestAmount");
                        }}
                      >
                        <span>Request Amount</span>
                        <div>
                          <SortingIcon viewOrder={amount}></SortingIcon>
                        </div>
                      </div>
                    </th>
                    <th>
                      <div className="sortable justify-content-center">
                        <span>Status</span>
                      </div>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div className="employeeInfo d-flex align-items-center">
                            <AvatarComponent letterCount={1} label={data?.employeeBasicInfo?.strEmployeeName} />
                            <div className="employeeTitle ml-3">
                              <p className="tableBody-title employeeName">
                                {data?.employeeBasicInfo?.strEmployeeName} [{data?.employeeBasicInfo?.strEmployeeCode}]
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>{data?.leaveNencashmentApplication?.dteInsertDateTime.split("-")[0]}</td>
                        <td className="text-center">{data?.leaveNencashmentApplication?.intRequestDays}</td>
                        <td className="text-center">{data?.leaveNencashmentApplication?.numRequestAmount}</td>
                        <td>
                          <div className="d-flex align-items-center justify-content-center">
                            <div>
                              {data?.leaveNencashmentApplication?.isApproved === false && <Chips label="Pending" classess="warning" />}
                              {data?.leaveNencashmentApplication?.isApproved === true && (
                                <Chips
                                  label="Encashed"
                                  classess="primary"
                                  // style={{ borderRadius: "8px", fontWeight: "bold" }}
                                />
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            {data?.leaveNencashmentApplication?.isApproved === false && (
                              <button
                                className="iconButton"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShow(true);
                                  setSingleData(data);
                                }}
                                type="button"
                              >
                                <CreateOutlined />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <>{!loading && <NoResult title="No Result Found" para="" />}</>
          )}
        </div>
      </div>
    </>
  );
};

export default CardTable;
