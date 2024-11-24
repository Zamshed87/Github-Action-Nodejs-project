import React from "react";
import { dateFormatter } from "../../../../utility/dateFormatter";

const ActionPlanGrowModelPdf = ({ pdfData }) => {
  const { rowDto } = pdfData;
  return (
    <>
      <div className="text-center mb-5">
        <strong>Action Plan Grow Model</strong>
      </div>
      <div className="row">
        <div className="col-lg-4 ml-3">
          <div>
            <strong>Name</strong>: <span>{rowDto?.employeeName}</span>
          </div>
          <div>
            <strong>Enroll</strong>: <span>{rowDto?.employeeId}</span>
          </div>
        </div>
        <div className="col-lg-4">
          <div>
            <strong>Designation</strong>:{" "}
            <span>{rowDto?.designation || ""}</span>
          </div>
          <div>
            <strong>Location</strong>:{" "}
            <span>{rowDto?.workplaceGroup || ""}</span>
          </div>
        </div>
        <div className="col-lg-3">
          <div>
            <strong>Year</strong>: <span>{rowDto?.year || ""}</span>
          </div>
          <div>
            <strong>Quarter</strong>: <span>{rowDto?.quarter || ""}</span>
          </div>
        </div>
      </div>
      <table className="pms-global-table mt-2">
        <tr>
          <th colSpan={4} className="text-center">
            GOAL/OBJECTIVE/KPI/BEHAVIOUR
          </th>
        </tr>
        <tr>
          <td className="text-center" colSpan={4}>
            {rowDto?.typeReference}
          </td>
        </tr>
        <tr>
          <th
            colSpan={2}
            className="text-center"
            style={{
              width: "50%",
            }}
          >
            CURRENT RESULT
          </th>
          <th colSpan={2} className="text-center">
            DESIRED RESULT
          </th>
        </tr>
        <tr>
          <td colSpan={2} className="text-center">
            {rowDto?.currentResult}
          </td>
          <td colSpan={2} className="text-center">
            {rowDto?.desiredResult}
          </td>
        </tr>

        <tr>
          <th className="text-center">SN</th>
          <th className="text-center">LIST OF TASK</th>
          <th className="text-center">START DATE</th>
          <th className="text-center">END DATE</th>
        </tr>
        {rowDto?.row?.map((item, index) => {
          return (
            <tr key={index}>
              <td className="text-center">{index + 1}</td>
              <td className="text-center">{item.activity}</td>
              <td className="text-center">{dateFormatter(item.stardDate)}</td>
              <td className="text-center">{dateFormatter(item.endDate)}</td>
            </tr>
          );
        })}
      </table>

      <div style={{ marginTop: "45px", marginBottom: "45px" }}>
        <h6 style={{ textAlign: "right", marginRight: "25px" }}>DATE & SIGN</h6>
      </div>
    </>
  );
};

export default ActionPlanGrowModelPdf;
