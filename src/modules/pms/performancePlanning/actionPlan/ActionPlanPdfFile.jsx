import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { dateFormatter } from "../../../../utility/dateFormatter";

const ActionPlanPdfFile = ({
  year,
  targetedResult,
  achievementResult,
  rowData,
}) => {
  const { employeeId, strDesignation, userName, buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  return (
    <section className="action-content">
      <div className="action-mt-8 action-mb-4">
        <h1 style={{ fontSize: "28px" }} className="action-text-center">
          {buName}
        </h1>
        <h3
          style={{ fontSize: "20px", marginTop: "20px" }}
          className="action-text-center"
        >
          Action Plan/Initiative From
        </h3>
      </div>

      <div className="action-grid-container action-mb-4">
        <div>
          <p style={{ fontSize: "15px", margin: "5px" }}>
            <span className="font-weight-bold">Name :</span>{" "}
            <span>{userName}</span>
          </p>
        </div>
        <div>
          <p style={{ fontSize: "15px", margin: "5px" }}>
            <span className="font-weight-bold">Designation :</span>{" "}
            <span>{strDesignation}</span>
          </p>
        </div>
        <div>
          <p style={{ fontSize: "15px", margin: "5px" }}>
            <span className="font-weight-bold">Year :</span>{" "}
            <span>{year?.label}</span>
          </p>
        </div>
        <div>
          <p style={{ fontSize: "15px", margin: "5px" }}>
            <span className="font-weight-bold">Enroll Id :</span>{" "}
            <span>{employeeId}</span>
          </p>
        </div>
        <p style={{ fontSize: "15px", margin: "5px" }}>
          <span className="font-weight-bold">Workplace :</span>{" "}
        </p>
      </div>
      <div>
        <table className="action-table mt-8">
          <thead>
            <tr>
              <th className="action-kpi" colSpan="4">
                KPI
              </th>
            </tr>
            <tr>
              <th style={{ height: "10px" }} colSpan="4"></th>
            </tr>
            <tr>
              <th className="action-current-result" colSpan="2">
                Current Result
              </th>
              <th colSpan="2">Desired Result</th>
            </tr>
            <tr>
              <th colSpan="2">{achievementResult}</th>
              <th colSpan="2">{targetedResult}</th>
            </tr>
            <tr>
              <th className="action-sl">SL</th>
              <th className="action-list-of-tasks">
                List of task / activities
              </th>
              <th className="action-start-date">Start Date</th>
              <th className="action-end-date">End Date</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.length &&
              rowData?.map((item, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{item?.activity}</td>
                  <td>{dateFormatter(item?.stardDate)}</td>
                  <td>{dateFormatter(item?.endDate)}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="action-mt-60">
          <h2 className="action-sign-container">Date & Sign</h2>
        </div>
      </div>
    </section>
  );
};

export default ActionPlanPdfFile;
