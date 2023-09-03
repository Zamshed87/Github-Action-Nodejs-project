import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { gray500 } from "../../../../utility/customColor";
import { numberWithCommas } from "../../../../utility/numberWithCommas";
import "../salaryGenerate.css";
import { dateFormatter } from './../../../../utility/dateFormatter';

const CardTable = (props) => {
  const history = useHistory();
  const {
    rowDto,
    // setSingleData,
    // setValues,
    values,
    // setIsEdit,
    // scrollRef,
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
            if (data?.intBonusHeaderId) {
              history.push({
                pathname: `/compensationAndBenefits/payrollProcess/bonusGenerate/view/${data?.intBonusHeaderId}`,
                state: data,
              });
            } else {
              return toast.warning(
                "Bonus Generate on processing. Please wait...",
                {
                  toastId: 1,
                }
              );
            }
          }}
        >
          <td style={{ width: "30px" }}>
            <div className="tableBody-title text-center">{index + 1}</div>
          </td>
          <td>
            <div className="tableBody-title">{data?.strBonusSystem}</div>
          </td>
          <td>
            <div className="tableBody-title">{data?.strBonusName}</div>
          </td>
          <td>
            <div className="tableBody-title">{data?.strBusinessUnit}</div>
          </td>
          {/* <td>
            <div className="d-flex align-items-center justify-content-start">
              <div className="tableBody-title pl-1">
                {data?.strWorkplaceGroupName}
              </div>
            </div>
          </td>
          <td>
            <div className="tableBody-title">{data?.strWorkplaceName}</div>
          </td>
          <td>
            <div className="tableBody-title">{data?.strPayrollGroupName}</div>
          </td> */}
          <td>
            <div className="tableBody-title">
              {dateFormatter(data?.dteEffectedDateTime)}
            </div>
          </td>
          <td>
            <div className="tableBody-title text-right">
              {numberWithCommas(data?.numBonusAmount)}
            </div>
          </td>
          <td>
            <div className="tableBody-title"></div>
          </td>
          <td>
            {data?.strStatus.includes("Approved") && (
              <p
                style={{ fontSize: "12px", color: gray500, fontWeight: "400" }}
              >
                {data?.strStatus}
              </p>
            )}
            {!data?.strStatus && (
              <div className="d-flex align-items-center">
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
                    sendForApprovalHandler(data, values);
                  }}
                >
                  Send for Approval
                </button>
              </div>
            )}
            {data?.strStatus.includes("Pending") && (
              <p
                style={{ fontSize: "12px", color: gray500, fontWeight: "400" }}
              >
                {data?.strStatus}
              </p>
            )}
            {data?.strStatus.includes("Reject") && (
              <p
                style={{ fontSize: "12px", color: gray500, fontWeight: "400" }}
              >
                {data?.strStatus}
              </p>
            )}
          </td>
          <td>
            {!data?.strStatus && (
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
                      pathname:
                        `/compensationAndBenefits/payrollProcess/bonusGenerate/edit/${data?.intBonusHeaderId}`,
                      state: {
                        bonusObj: data
                      },
                    });
                    // setIsEdit(true);
                    // scrollRef?.current?.scrollIntoView({
                    //   behavior: "smooth",
                    // });
                    // setSingleData(data);
                    // setValues({
                    //   ...values,
                    //   bonusName: {
                    //     value: data?.intBonusId,
                    //     label: data?.strBonusName,
                    //   },
                    //   religion: {
                    //     value: data?.intReligionId,
                    //     label: data?.strReligionName,
                    //   },
                    //   businessUnit: {
                    //     value: data?.intBusinessUnitId,
                    //     label: data?.strBusinessUnit,
                    //   },
                    //   workplaceGroup: {
                    //     value: data?.intWorkplaceGroupId,
                    //     label: data?.strWorkplaceGroupName,
                    //   },
                    //   workplace: {
                    //     value: data?.intWorkplaceId,
                    //     label: data?.strWorkplaceName,
                    //   },
                    //   payrollGroup: {
                    //     value: data?.intPayrollGroupId,
                    //     label: data?.strPayrollGroupName,
                    //   },
                    //   effectiveDate: dateFormatterForInput(data?.dteEffectedDateTime),
                    // });
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
