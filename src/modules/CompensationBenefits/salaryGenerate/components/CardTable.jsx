import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Chips from "../../../../common/Chips";
import { gray500 } from "../../../../utility/customColor";
import {
  dateFormatter
} from "../../../../utility/dateFormatter";
import { getMonthName } from "../../../../utility/monthUtility";
import { numberWithCommas } from "../../../../utility/numberWithCommas";
import "../salaryGenerate.css";

const CardTable = (props) => {
  const history = useHistory();
  const {
    rowDto,
    sendForApprovalHandler,
  } = props;

  return (
    <>
      {rowDto?.map((data, index) => (
        <tr
          className="hasEvent"
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            if (data?.isGenerated === true) {
              history.push({
                pathname: `/compensationAndBenefits/payrollProcess/generateSalaryView/${data?.intSalaryGenerateRequestId}`,
                state: data,
              });
            } else {
              return toast.warning(
                "Salary Generate on processing. Please wait...",
                {
                  toastId: 1,
                }
              );
            }
          }}
        >
          <td style={{ width: "30px" }}>
            <div className="tableBody-title">{index + 1}</div>
          </td>
          <td style={{ width: "120px" }}>
            <div className="tableBody-title">{data?.strSalaryCode}</div>
          </td>
          <td>
            <div className="tableBody-title">{data?.strSalaryTypeLabel}</div>
          </td>
          <td>
            <div className="d-flex align-items-center justify-content-start">
              <div className="tableBody-title pl-1">
                {data?.strBusinessUnit}
              </div>
            </div>
          </td>
          <td>
            <div className="tableBody-title">
              {`${getMonthName(data?.intMonth)}, ${data?.intYear}`}
            </div>
          </td>

          <td>
            <div className="tableBody-title">
              {data?.dteSalaryGenerateFrom
                ? dateFormatter(data?.dteSalaryGenerateFrom)
                : "-"} - {data?.dteSalaryGenerateTo
                  ? dateFormatter(data?.dteSalaryGenerateTo)
                  : "-"}
            </div>
          </td>
          <td
            className="fixed-column right"
            style={{ right: "394px" }}
          >
            <div className="tableBody-title text-right">
              {numberWithCommas(data?.numNetPayableSalary)}
            </div>
          </td>

          <td
            className="fixed-column right"
            style={{ right: "260px" }}
          >
            <div>
              {data?.ProcessionStatus === "Success" && (
                <Chips label={data?.ProcessionStatus} classess="success" />
              )}
              {data?.ProcessionStatus === "Processing" && (
                <Chips label={data?.ProcessionStatus} classess="warning" />
              )}
            </div>
          </td>
          <td
            className="fixed-column right"
            style={{ right: "115px" }}
          >
            {data?.ApprovalStatus === "Approved" && (
              <p
                style={{ fontSize: "12px", color: gray500, fontWeight: "400" }}
              >
                {data?.ApprovalStatus}
              </p>
            )}
            {data?.ApprovalStatus === "Send for Approval" && (
              <div className="d-flex align-items-center justify-content-start">
                <button
                  style={{
                    height: "24px",
                    fontSize: "12px",
                    padding: "0px 12px 0px 12px",
                    backgroundColor: "#0BA5EC",
                  }}
                  className="btn btn-default"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sendForApprovalHandler(data);
                  }}
                >
                  Send for Approval
                </button>
              </div>
            )}
            {data?.ApprovalStatus === "Waiting for Approval" && (
              <p
                style={{ fontSize: "12px", color: gray500, fontWeight: "400" }}
              >
                {data?.ApprovalStatus}
              </p>
            )}
            {data?.ApprovalStatus === "Rejected" && (
              <p
                style={{ fontSize: "12px", color: gray500, fontWeight: "400" }}
              >
                {data?.ApprovalStatus}
              </p>
            )}
          </td>
          <td className="fixed-column right">
            {!!data?.isReGenerate && (
              <div>
                <button
                  style={{
                    height: "24px",
                    fontSize: "12px",
                    padding: "0px 12px 0px 12px",
                  }}
                  className="btn btn-default"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push({
                      pathname: `/compensationAndBenefits/payrollProcess/generateSalary/edit/${data?.intSalaryGenerateRequestId}`,
                      state: data
                    })
                  }}
                >
                  Re-Generate
                </button>
              </div>
            )}
          </td>
        </tr>
      ))}
    </>
  );
};

export default CardTable;
