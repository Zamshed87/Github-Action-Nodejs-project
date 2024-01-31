import DefaultInput from "common/DefaultInput";

const ClearanceFromHr = ({ formData }) => {
  const { values, errors, touched, setFieldValue } = formData;

  return (
    <form>
      <div className="row">
        <div className="col-lg-3">
          <div className="input-field-main">
            <label>ID card /Card Holder /Health Card</label>
            <DefaultInput
              classes="input-sm"
              placeholder=" "
              value={values?.cardNumber}
              name="cardNumber"
              type="text"
              onChange={(e) => {
                setFieldValue("cardNumber", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="input-field-main">
            <label>Health Card (if issued Policy Manual)</label>
            <DefaultInput
              classes="input-sm"
              placeholder=" "
              value={values?.healthCard}
              name="healthCard"
              type="text"
              onChange={(e) => {
                setFieldValue("healthCard", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="input-field-main">
            <label>Salary Dues</label>
            <DefaultInput
              classes="input-sm"
              placeholder=" "
              value={values?.salaryDues}
              name="salaryDues"
              type="text"
              onChange={(e) => {
                setFieldValue("salaryDues", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="input-field-main">
            <label>Last Drawn Month</label>
            <DefaultInput
              classes="input-sm"
              placeholder=" "
              value={values?.lastDrawnMonth}
              name="lastDrawnMonth"
              type="date"
              onChange={(e) => {
                setFieldValue("lastDrawnMonth", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="input-field-main">
            <label>Due month</label>
            <DefaultInput
              classes="input-sm"
              placeholder=" "
              value={values?.dueMonth}
              name="dueMonth"
              type="date"
              onChange={(e) => {
                setFieldValue("dueMonth", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="input-field-main">
            <label>Advance Dues</label>
            <DefaultInput
              classes="input-sm"
              placeholder=" "
              value={values?.advanceDues}
              name="advanceDues"
              type="text"
              onChange={(e) => {
                setFieldValue("advanceDues", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="input-field-main">
            <label>TA/DA/OT Dues</label>
            <DefaultInput
              classes="input-sm"
              placeholder=" "
              value={values?.taDaOtDues}
              name="taDaOtDues"
              type="text"
              onChange={(e) => {
                setFieldValue("taDaOtDues", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="input-field-main">
            <label>Other Dues</label>
            <DefaultInput
              classes="input-sm"
              placeholder=" "
              value={values?.otherDues}
              name="otherDues"
              type="text"
              onChange={(e) => {
                setFieldValue("otherDues", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="input-field-main">
            <label>Remarks(HR)</label>
            <DefaultInput
              classes="input-sm"
              placeholder=" "
              value={values?.remarksHr}
              name="remarksHr"
              type="text"
              onChange={(e) => {
                setFieldValue("remarksHr", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ClearanceFromHr;
