import { ArrowBack } from "@mui/icons-material";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AvatarComponent from "../../../../common/AvatarComponent";
import FormikInput from "../../../../common/FormikInput";
import FormikRadio from "../../../../common/FormikRadio";
import FormikSelect from "../../../../common/FormikSelect";
import PrimaryButton from "../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { greenColor } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";

const initData = {
  search: "",
};
const RewardsAndPunishmentAdd = () => {
  const dispatch = useDispatch();
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const history = useHistory();
  // image
  const inputFile = useRef(null);

  const onButtonClick = () => {
    inputFile.current.click();
  };
  return (
    <>
      <Formik initialValues={initData}>
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form>
              <div className="reward-application">
                <div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="pt-5">
                        <Tooltip title="Back">
                          <ArrowBack
                            onClick={() => history.goBack()}
                            sx={{
                              fontSize: "16px",
                              marginRight: "10px",
                              cursor: "pointer",
                            }}
                          />
                        </Tooltip>
                        <p
                          style={{
                            display: "inline-block",
                            fontSize: "14px",
                          }}
                        >
                          Add Reward or Punishment
                        </p>
                      </div>
                      <div
                        className="employee-info d-flex align-items-center"
                        style={{ marginTop: "20px" }}
                      >
                        {/* <img src="" alt="" /> */}
                        <AvatarComponent
                          classess=""
                          letterCount={1}
                          label={"M"}
                        />
                        <div
                          className="employee-title"
                          style={{ marginLeft: "15px" }}
                        >
                          <strong className="employee-name">
                            Md. Imran Hassan
                          </strong>
                          <p
                            className="employee-title"
                            style={{ fontSize: "12px" }}
                          >
                            UI/UX Designer
                          </p>
                        </div>
                      </div>
                      <hr />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-5">
                      <div className="reward-form-left ">
                        <FormikSelect
                          name="reward-status"
                          placeholder="Status"
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={false}
                        />
                        <FormikSelect
                          name="reward-department"
                          placeholder="Department"
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={false}
                        />
                        <FormikSelect
                          name="reward-supervisor"
                          placeholder={supervisor || "Supervisor"}
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={false}
                        />
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="reward-form-right ">
                        <FormikSelect
                          name="reward-workplace"
                          placeholder="Workplace Group"
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={false}
                        />
                        <FormikSelect
                          name="reward-designation"
                          placeholder="Designation"
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={false}
                        />
                        <FormikSelect
                          name="reward-employee"
                          placeholder="Employee"
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={false}
                        />
                      </div>
                      <div className="form-bottom d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-cancle"
                          style={{
                            marginRight: "15px",
                            color: " #34A853",
                          }}
                        >
                          Cancel
                        </button>
                        <PrimaryButton
                          type="button"
                          className="btn btn-default flex-center"
                          label={"Apply"}
                        />
                      </div>
                    </div>
                    <hr />
                  </div>
                  <div className="row mt-1">
                    <div className="col-md-6">
                      <FormikRadio
                        name="action"
                        label="Punishment"
                        value={"punishment"}
                        color={greenColor}
                        onChange={(e) => {
                          setFieldValue("action", e.target.value);
                        }}
                        checked={values?.action === "punishment"}
                      />
                      <FormikRadio
                        name="action"
                        label="Reward"
                        value={"reward"}
                        color="green !important"
                        onChange={(e) => {
                          setFieldValue("action", e.target.value);
                        }}
                        checked={values?.action === "reward"}
                        disabled={false}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-5">
                      <FormikInput
                        classes="search-input"
                        inputClasses="search-inner-input"
                        /* value={} */
                        name="from"
                        type="text"
                        placeholder="Type"
                        errors={{}}
                        touched={{}}
                      />
                      <FormikInput
                        classes="input-sm"
                        placeholder="End Date"
                        value="End Date"
                        name="monthYear"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("date", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                      {/* File Upload */}
                      <p onClick={onButtonClick} style={{ width: "100px" }}>
                        <input
                          onChange={(e) => {}}
                          type="file"
                          id="file"
                          ref={inputFile}
                          style={{ display: "none" }}
                        />
                        <div style={{ fontSize: "12px" }}>
                          <>
                            <AttachmentIcon
                              sx={{
                                marginRight: "5px",
                                fontSize: "16px",
                              }}
                            />{" "}
                            Attachment
                          </>
                        </div>
                      </p>
                      <button
                        type="button"
                        style={{
                          marginTop: "10px",
                          width: "100%",
                          border: "2px solid #34A853",
                          borderRadius: "4px",
                          background: "#E4F8DD",
                          color: "#34A853",
                        }}
                      >
                        Save
                      </button>
                    </div>
                    <div className="col-md-5">
                      <FormikInput
                        classes="input-sm"
                        placeholder="Effective Date"
                        value="Effective Date"
                        name="monthYear"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("date", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                      <FormikInput
                        classes="search-input"
                        inputClasses="search-inner-input"
                        /* value={} */
                        name="from"
                        type="text"
                        placeholder="Description"
                        errors={{}}
                        touched={{}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default RewardsAndPunishmentAdd;
