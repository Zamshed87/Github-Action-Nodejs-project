import React from "react";
import PBadge from "Components/Badge";
import { Tag } from "antd";
import moment from "moment";
import { formatMoney } from "utility/formatMoney";
import SalaryElementTable from "./SalaryElementTable";
import { Divider } from "@mui/material";

const HistoryPrintView = ({
  approveListData,
  assetHistory,
  employmentHistory,
  duesRowDto,
  deductionRowDto,
  totalDuesAmount,
  totalDeductionAmount,
  type,
}) => {
  return (
    <>
      {type === "dueAmount" || type === "dueView" ? (
        <>
          <h6 className="mb-3" style={{ fontSize: "18px" }}>
            Due Amount
          </h6>
          <div className="d-flex justify-content-between">
            <div style={{ width: "48%" }}>
              <SalaryElementTable
                title="Dues"
                rowDto={duesRowDto}
                showHeader={true}
                isDisabled={true}
                type={"dueView"}
              />
            </div>
            <div style={{ width: "48%" }}>
              <SalaryElementTable
                title="Deductions"
                rowDto={deductionRowDto}
                showHeader={true}
                isDisabled={true}
                type={"dueView"}
              />
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div style={{ width: "48%" }}>
              <div className="d-flex justify-content-end my-2">
                <p>
                  <span className="mr-3">
                    <b>{"Total Dues (BDT)"}</b>
                  </span>
                  <span>
                    <b>{formatMoney(totalDuesAmount || 0)}</b>
                  </span>
                </p>
              </div>
            </div>
            <div style={{ width: "48%" }}>
              <div className="d-flex justify-content-end my-2">
                <p>
                  <span className="mr-3">
                    <b>{"Total Deductions (BDT)"}</b>
                  </span>
                  <span>
                    <b>{formatMoney(totalDeductionAmount || 0)}</b>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div>
            <Divider className="mb-2" />
            <div className="d-flex justify-content-end my-2">
              <p>
                <span className="mr-3">
                  <b>Employee Will Get (BDT)</b>
                </span>
                <span>
                  <b>{formatMoney(totalDuesAmount - totalDeductionAmount)}</b>
                </span>
              </p>
            </div>
          </div>
        </>
      ) : null}
      <h6 className="mb-3 pt-2" style={{ fontSize: "18px" }}>
        Approval History
      </h6>
      <div className="table-card-body">
        <div className="table-card-styled">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "30px", textAlign: "center" }}>SL</th>
                <th>
                  <div className="sortable">
                    <span>Approve Dept.</span>
                  </div>
                </th>
                <th style={{ width: "80px" }}>
                  <div className="sortable justify-content-center">
                    <span>Status</span>
                  </div>
                </th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {approveListData?.map((item, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td>
                    {item?.strStatusTitle === "Approve By Supervisor"
                      ? "Supervisor"
                      : item?.strStatusTitle === "Approve By User Group"
                      ? `User Group (${item?.strUserGroup})`
                      : "Line Manager"}
                  </td>
                  <td className="text-center">
                    {item?.status === "Pending" ? (
                      <PBadge type="warning" text={item?.status} />
                    ) : item?.status === "Rejected" ? (
                      <PBadge type="danger" text={item?.status} />
                    ) : (
                      <PBadge type="success" text={item?.status} />
                    )}
                  </td>
                  <td>{item?.comment || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <h6 className="mb-3 pt-2" style={{ fontSize: "18px" }}>
        Employment History
      </h6>
      <div className="table-card-body">
        <div className="table-card-styled">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "30px", textAlign: "center" }}>SL</th>
                <th>Promotion Type</th>
                <th>Workplace</th>
                <th>Employee Name</th>
                <th>Code</th>
                <th>Department</th>
                <th>Designation</th>
                <th>HR Position</th>
                <th>Employment Type</th>
                <th>Effective Date</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              {employmentHistory?.map((item, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td>{item?.promotionTypeName}</td>
                  <td>{item?.workPlace}</td>
                  <td>{item?.name}</td>
                  <td>{item?.code}</td>
                  <td>{item?.department}</td>
                  <td>{item?.designation}</td>
                  <td>{item?.hrPosition}</td>
                  <td>{item?.employmentType}</td>
                  <td>
                    {item?.effectiveDate
                      ? moment(item?.effectiveDate).format("DD-MM-YYYY")
                      : "N/A"}
                  </td>
                  <td>{item?.salaryAmount && formatMoney(item?.salaryAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <h6 className="mb-3 pt-2" style={{ fontSize: "18px" }}>
        Asset History
      </h6>
      <div className="table-card-body">
        <div className="table-card-styled">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "30px", textAlign: "center" }}>SL</th>
                <th>
                  <div className="sortable">
                    <span>Asset Name</span>
                  </div>
                </th>
                <th>UOM</th>
                <th>Assign Date</th>
                <th>Unassign Date</th>
                <th style={{ width: "80px" }}>
                  <div className="sortable justify-content-center">
                    <span>Status</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {assetHistory?.map((item, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td>{item?.itemName}</td>
                  <td>{item?.itemUom}</td>
                  <td>
                    {item?.assignDate
                      ? moment(item?.assignDate).format("DD-MM-YYYY")
                      : "N/A"}
                  </td>
                  <td>
                    {item?.unassignDate
                      ? moment(item?.unassignDate).format("DD-MM-YYYY")
                      : "N/A"}
                  </td>
                  <td className="text-center">
                    {
                      <div className="d-flex justify-content-center align-items-center">
                        {item?.active ? (
                          <Tag color="green">{"Active"}</Tag>
                        ) : (
                          <Tag color="red">{"Inactive"}</Tag>
                        )}
                      </div>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HistoryPrintView;
