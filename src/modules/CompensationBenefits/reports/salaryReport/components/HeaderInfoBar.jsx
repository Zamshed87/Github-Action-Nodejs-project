import CircleButton from "../../../../../common/CircleButton";
import moneyIcon from "../../../../../assets/images/moneyIcon.png";
import { BatchPrediction, BusinessCenter, DateRange, Tag } from "@mui/icons-material";
import { gray200 } from "../../../../../utility/customColor";
import { numberWithCommas } from "../../../../../utility/numberWithCommas";
import { getMonthName } from "../../../../../utility/monthUtility";

const HeaderInfoBar = ({ state }) => {
  return (
    <div
      className="row"
      style={{
        borderTop: `1px solid ${gray200}`,
        borderBottom: `1px solid ${gray200}`,
        padding: "8px 0",
        marginBottom: "12px"
      }}
    >
      <div className="col-lg-2">
        <CircleButton
          icon={<BusinessCenter style={{ fontSize: "24px" }} />}
          title={state?.strBusinessUnit || "-"}
          subTitle="Business Unit"
        />
      </div>
      <div className="col-lg-2">
        <CircleButton
          icon={<Tag style={{ fontSize: "24px" }} />}
          title={state?.strSalaryCode || "-"}
          subTitle="Salary Code"
        />
      </div>
      <div className="col-lg-2">
        <CircleButton
          icon={<DateRange style={{ fontSize: "24px" }} />}
          title={state?.intMonth && `${getMonthName(state?.intMonth)},${state?.intYear}`}
          subTitle="Date"
        />
      </div>
      <div className="col-lg-2">
        <CircleButton
          icon={<img src={moneyIcon} alt="iBOS" />}
          title={numberWithCommas(state?.numNetPayableSalary) || "-"}
          subTitle="Net Amount"
        />
      </div>
      <div className="col-lg-2">
        <CircleButton
          icon={<BatchPrediction style={{ fontSize: "24px" }} />}
          title={state?.ApprovalStatus || "-"}
          subTitle="Status"
        />
      </div>
    </div>
  );
};

export default HeaderInfoBar;
