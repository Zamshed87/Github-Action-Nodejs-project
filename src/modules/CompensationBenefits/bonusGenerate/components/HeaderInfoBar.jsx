import BatchPredictionIcon from "@mui/icons-material/BatchPrediction";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TagIcon from "@mui/icons-material/Tag";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import moneyIcon from "../../../../assets/images/moneyIcon.png";
import CircleButton from "../../../../common/CircleButton";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { numberWithCommas } from "../../../../utility/numberWithCommas";
import { createBonusGenerateRequest } from "../helper";

const HeaderInfoBar = ({ data, setLoading }) => {
  const history = useHistory();


  const { employeeId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // send for approval
  const sendForApprovalHandler = (values) => {
    const payload = {
      strPartName: values?.bonusSystemType?.value === 2 ? "ArrearBonusGenerateSendToApproval" : "BonusGenerateSendToApproval",
      intBonusHeaderId: values?.intBonusHeaderId || 0,
      intAccountId: values?.intAccountId || orgId,
      intBusinessUnitId: values?.intBusinessUnitId,
      intBonusId: values?.intBonusId,
      intPayrollGroupId: values?.intPayrollGroupId,
      intWorkplaceId: values?.intWorkplaceId,
      workplaceGroupId: values?.intWorkplaceGroupId,
      intReligionId: values?.intReligionId,
      dteEffectedDate: values?.dteEffectedDateTime,
      intCreatedBy: employeeId,
    };
    const callback = () => {
      history.push("/compensationAndBenefits/payrollProcess/bonusGenerate");
    };
    createBonusGenerateRequest(payload, setLoading, callback);
  };

  return (
    <div className="row border-top pb-3 pt-2">
      <div className="col-lg-2 mb-1">
        <CircleButton
          icon={<TagIcon style={{ fontSize: "24px" }} />}
          title={data?.strBonusName || "-"}
          subTitle="Bonus Name"
        />
      </div>
      <div className="col-lg-2 mb-1">
        <CircleButton
          icon={<BusinessCenterIcon style={{ fontSize: "24px" }} />}
          title={data?.strBusinessUnit || "-"}
          subTitle="Business Unit"
        />
      </div>
      <div className="col-lg-2 mb-1">
        <CircleButton
          icon={<BusinessCenterIcon style={{ fontSize: "24px" }} />}
          title={data?.strWorkplaceGroup || "-"}
          subTitle="Workplace Group Name"
        />
      </div>
      {/* <div className="col-lg-2 mb-1">
        <CircleButton
          icon={<BusinessCenterIcon style={{ fontSize: "24px" }} />}
          title={data?.strWorkplaceName || "-"}
          subTitle="Workplace Name"
        />
      </div>
      <div className="col-lg-2 mb-1">
        <CircleButton
          icon={<BusinessCenterIcon style={{ fontSize: "24px" }} />}
          title={data?.strPayrollGroupName || "-"}
          subTitle="Payroll Group Name"
        />
      </div> */}
      <div className="col-lg-2 mb-1">
        <CircleButton
          icon={<DateRangeIcon style={{ fontSize: "24px" }} />}
          title={dateFormatter(data?.dteEffectedDateTime) || "-"}
          subTitle="Effective Date"
        />
      </div>
      <div className="col-lg-2 mb-1">
        <CircleButton
          icon={<img src={moneyIcon} alt="iBOS" />}
          title={numberWithCommas(data?.numBonusAmount) || "-"}
          subTitle="Net Amount"
        />
      </div>
      <div className="col-lg-2 mb-1">
        <CircleButton
          icon={<BatchPredictionIcon style={{ fontSize: "24px" }} />}
          title={
            !data?.strStatus ? (
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
              data?.strStatus || "-"
            )
          }
          subTitle="Status"
        />
      </div>
    </div>
  );
};

export default HeaderInfoBar;
