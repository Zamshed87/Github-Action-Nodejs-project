import FormikCheckBox from "../../../../common/FormikCheckbox";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import { gray900, greenColor } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { getAllAllowanceAndDeduction } from "../helper";

const HeaderTableForm = ({
  values,
  setFieldValue,
  errors,
  touched,
  orgId,
  wId,
  buId,
  setAllowanceAndDeductionDDL,
  setLoading,
  allowanceAndDeductionDDL,
}) => {

  return (
    <div className="row card-style pt-3">
      <div className="col-2">
        <FormikCheckBox
          label="Auto Renewal"
          height="15px"
          name="isAutoRenew"
          styleObj={{
            color: gray900,
            checkedColor: greenColor,
            padding: "0px 0px 0px 5px",
          }}
          checked={values?.isAutoRenew}
          onChange={(e) => {
            setFieldValue("isAutoRenew", e.target.checked);
            setFieldValue("toMonth", "");
          }}
        />
      </div>
      <div className="col-lg-8"></div>

      <div className="col-lg-3">
        <div className="input-field-main">
          <label>
            From Month <span className="text-danger fs-3">*</span>
          </label>
          <FormikInput
            classes="input-sm"
            value={values?.fromMonth}
            name="fromMonth"
            type="month"
            className="form-control"
            onChange={(e) => {
              setFieldValue("fromMonth", e.target.value);
            }}
            errors={errors}
            touched={touched}
          />
        </div>
      </div>
      <div className="col-lg-3">
        <div className="input-field-main">
          <label>To Month</label>
          <FormikInput
            classes="input-sm"
            value={values?.toMonth}
            name="toMonth"
            type="month"
            className="form-control"
            onChange={(e) => {
              setFieldValue("toMonth", e.target.value);
            }}
            disabled={values?.isAutoRenew}
            errors={errors}
            touched={touched}
          />
        </div>
      </div>
      <div className="col-lg-3">
        <label>
          Salary Type <span className="text-danger fs-3">*</span>
        </label>
        <FormikSelect
          classes="input-sm"
          styles={customStyles}
          placeholder={" "}
          name="salaryType"
          options={
            [
              {
                value: 1,
                label: "Addition",
              },
              {
                value: 2,
                label: "Deduction",
              },
            ] || []
          }
          value={values?.salaryType}
          onChange={(valueOption) => {
            setFieldValue("allowanceAndDeduction", "");
            setFieldValue("salaryType", valueOption);
            getAllAllowanceAndDeduction(
              orgId,
              buId,
              wId,
              setAllowanceAndDeductionDDL,
              valueOption?.value === 1 ? true : false,
              setLoading
            );
          }}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <label>
          Select Allowance/Deduction <span className="text-danger fs-3">*</span>
        </label>
        <FormikSelect
          classes="input-sm"
          styles={customStyles}
          placeholder={" "}
          name="allowanceAndDeduction"
          options={allowanceAndDeductionDDL || []}
          value={values?.allowanceAndDeduction}
          onChange={(valueOption) => {
            setFieldValue("allowanceAndDeduction", valueOption);
          }}
          isDisabled={!values?.salaryType}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <label>
          Select Amount Dimension <span className="text-danger fs-3">*</span>
        </label>
        <FormikSelect
          classes="input-sm"
          placeholder={" "}
          styles={customStyles}
          name="amountDimension"
          options={
            [
              {
                value: 1,
                label: "Percentage Of Basic",
              },
              {
                value: 2,
                label: "Percentage Of Gross",
              },
              {
                value: 3,
                label: "Fixed Amount",
              },
              // {
              //   value: 4,
              //   label: "One Day Salary",
              // },
            ] || []
          }
          value={values?.amountDimension}
          onChange={(valueOption) => {
            setFieldValue("amountDimension", valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>

      <div className="col-lg-3">
        <label>
          Enter Amount{" "}
          {(values?.amountDimension?.value === 1 ||
            values?.amountDimension?.value === 2) && <span>(%)</span>}
          {(values?.amountDimension?.value === 3 ||
            values?.amountDimension?.value === 4) && <span>(BDT)</span>}{" "}
          <span className="text-danger fs-3">*</span>
        </label>
        <FormikInput
          classes="input-sm"
          value={values?.amount}
          placeholder={" "}
          name="amount"
          type="number"
          className="form-control"
          onChange={(e) => setFieldValue("amount", e.target.value)}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <label>Allowance Duration</label>
        <FormikSelect
          classes="input-sm"
          styles={customStyles}
          placeholder={" "}
          name="intAllowanceDuration"
          options={
            [
              {
                value: 1,
                label: "Perday",
              },
              {
                value: 2,
                label: "Per Month",
              },
            ] || []

            /* 
            🔥 from backend -- 
            public enum AllowanceDuration
            {
                [Description ("Perday") ]
                PERDAY = 1,
                [Description("Per Month")]
                PER_MONTH = 2
            }
            */
          }
          value={values?.intAllowanceDuration}
          onChange={(valueOption) => {
            setFieldValue("intAllowanceDuration", valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>
      {values?.intAllowanceDuration?.value === 1 ? (
        <>
          <div className="col-lg-3">
            <label>
              Max Amount <small>[ for a month ]</small>
            </label>
            <FormikInput
              classes="input-sm"
              value={values?.maxAmount}
              placeholder={" "}
              name="maxAmount"
              type="number"
              min={0}
              className="form-control"
              onChange={(e) => setFieldValue("maxAmount", e.target.value)}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-lg-3">
            <label>AllowanceAttendenceStatus</label>
            <FormikSelect
              classes="input-sm"
              styles={customStyles}
              placeholder={" "}
              name="intAllowanceAttendenceStatus"
              options={
                [
                  {
                    value: 1,
                    label: "Default",
                  },
                  {
                    value: 2,
                    label: "Based On InTime",
                  },
                  {
                    value: 3,
                    label: "Based On Attendence",
                  },
                ] || []
                /* 
            🔥 from backend -- 
              public enum AllowanceAttendenceStatus
              {
              [Description("Default")] 
              DEFAULT = 1,  //Default value is for all.No restiction
              [Description("Based On InTime")]
              BASED_ON_INTIME = 2, //Will be implemented on only attendence intime
              [Description("Based On Attendence")]
              BASED_ON_ATTENDENCE = 3  
              }
            */
              }
              value={values?.intAllowanceAttendenceStatus}
              onChange={(valueOption) => {
                setFieldValue("intAllowanceAttendenceStatus", valueOption);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default HeaderTableForm;
