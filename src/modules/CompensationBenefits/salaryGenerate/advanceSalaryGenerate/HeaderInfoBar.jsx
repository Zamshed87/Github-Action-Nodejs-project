import BatchPredictionIcon from "@mui/icons-material/BatchPrediction";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TagIcon from "@mui/icons-material/Tag";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import moneyIcon from "../../../../assets/images/moneyIcon.png";
import CircleButton from "../../../../common/CircleButton";
// import { getMonthName } from "../../../../utility/monthUtility";
import { numberWithCommas } from "../../../../utility/numberWithCommas";
// import { createSalaryGenerateRequest } from "../helper";
import useAxiosPost from "utility/customHooks/useAxiosPost";

const HeaderInfoBar = ({ data, setLoading }) => {
  // const month = getMonthName(data?.intMonth);
  const history = useHistory();
  // const year = data?.intYear;
  // const monthYear = `${month}, ${year}`;
  const [, sendApprovalRequest] = useAxiosPost();

  const { buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // send for approval
  const sendForApprovalHandler = (values) => {
    setLoading(true);
    // const payload = {
    //   strPartName: "GeneratedSalarySendForApproval",
    //   intSalaryGenerateRequestId: values?.intSalaryGenerateRequestId,
    //   strSalaryCode: values?.strSalaryCode,
    //   intAccountId: values?.intAccountId,
    //   intBusinessUnitId: values?.intBusinessUnitId,
    //   strBusinessUnit: values?.strBusinessUnit,
    //   intMonthId: values?.intMonth,
    //   intYearId: values?.intYear,
    //   strDescription: values?.strDescription,
    //   intWorkplaceGroupId: wgId,
    //   intCreatedBy: employeeId,
    // };
    const callback = () => {
      setLoading(false);
      history.push(
        "/compensationAndBenefits/payrollProcess/advanceSalaryGenerate"
      );
    };
    // createSalaryGenerateRequest(payload, setLoading, callback);

    // createSalaryGenerateRequest(payload, setLoading, callback);
    sendApprovalRequest(
      `/AdvanceSalary/AdvanceSalaryApproval?advanceSalaryId=${data?.advanceSalaryId}`,
      {
        advanceSalaryId: data?.advanceSalaryId,
      },
      () => {
        callback();
      },
      true
    );
  };

  return (
    <div className="row border-top pb-3 pt-2">
      <div className="col-lg-3">
        <CircleButton
          icon={<BusinessCenterIcon style={{ fontSize: "24px" }} />}
          title={buName || "-"}
          subTitle="Business Unit"
        />
      </div>
      <div className="col-lg-2">
        <CircleButton
          icon={<TagIcon style={{ fontSize: "24px" }} />}
          title={data?.advanceSalaryCode || "-"}
          subTitle="Salary Code"
        />
      </div>
      <div className="col-lg-2">
        <CircleButton
          icon={<DateRangeIcon style={{ fontSize: "24px" }} />}
          title={data?.payrollMonth}
          subTitle="Month"
        />
      </div>
      <div className="col-lg-2">
        <CircleButton
          icon={<img src={moneyIcon} alt="iBOS" />}
          title={numberWithCommas(data?.netAmount) || "-"}
          subTitle="Amount"
        />
      </div>
      <div className="col-lg-3">
        <CircleButton
          icon={<BatchPredictionIcon style={{ fontSize: "24px" }} />}
          title={
            data?.strStatus === "Generated" ? (
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
            ) : (
              data?.strStatus
            )
          }
          subTitle="Status"
        />
      </div>
    </div>
  );
};

export default HeaderInfoBar;
