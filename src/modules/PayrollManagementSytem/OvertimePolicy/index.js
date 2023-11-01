import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Alert } from "@mui/material";
import { useFormik } from "formik";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import DefaultInput from "../../../common/DefaultInput";
import FormikCheckBox from "../../../common/FormikCheckbox";
import FormikRadio from "../../../common/FormikRadio";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray900, greenColor } from "../../../utility/customColor";
import { getOverTimeConfig, saveOvertimePolicy } from "./helper";

let initialValues = {
  overtimeDependOn: "1",
  fixedAmount: "",
  overtimeCountingFrom: "0",
  fixedTime: "",
  overtimeBenifit: "",
  maxOvertimeDaily: "",
  maxOvertimeMonthly: "",
  overTime: "1",
  overTimeAmount: "1",
  isOvertimeAutoCalculate: false,
};

const validationSchema = Yup.object().shape({
  overtimeDependOn: Yup.string().required("This field is required"),
  fixedAmount: Yup.string().when("overtimeDependOn", {
    is: "3",
    then: Yup.string().required("This field required"),
  }),
  overtimeCountingFrom: Yup.string().required("This field is required"),
  fixedTime: Yup.string().when("overtimeCountingFrom", {
    is: "2",
    then: Yup.string().required("This field required"),
  }),
  // overtimeBenifit: Yup.object().shape({
  //   label: Yup.string().required("This field is required"),
  //   value: Yup.string().required("This field is required"),
  // }),
  overtimeBenifit: Yup.string().required("This Field is Required"),
  maxOvertimeDaily: Yup.string().required("This Field is Required"),
  maxOvertimeMonthly: Yup.string().required("This Field is Required"),
  overTime: Yup.string().required("This field is required"),
  overTimeAmount: Yup.string().required("This field is required"),
});

const OvertimePolicy = () => {
  const scrollRef = useRef();
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState(null);
  const dispatch = useDispatch();

  const { orgId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  // window.location.reload(true)

  useEffect(() => {
    getOverTimeConfig(setLoading, setSingleData, orgId);
  }, [orgId]);

  const { values, touched, errors, handleSubmit, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: singleData?.intOtdependOn
      ? {
          overtimeDependOn: `${singleData?.intOtdependOn}` || "",
          fixedAmount: singleData?.numFixedAmount || "",
          overtimeCountingFrom: `${singleData?.intOverTimeCountFrom}` || "",
          fixedTime:
            singleData?.intOverTimeCountFrom === 0
              ? ""
              : singleData?.intOverTimeCountFrom,
          // overtimeBenifit:
          //   {
          //     label:
          //       singleData?.intOtbenefitsHour === 1 ? "At Actual" : "Double",
          //     value: singleData?.intOtbenefitsHour,
          //   } || "",
          overtimeBenifit: singleData?.intOtbenefitsHour || "",
          maxOvertimeDaily: singleData?.intMaxOverTimeDaily || "",
          maxOvertimeMonthly: singleData?.intMaxOverTimeMonthly || "",
          overTime: `${singleData?.intOtcalculationShouldBe}` || "",
          overTimeAmount: `${singleData?.intOtAmountShouldBe}` || "",
          isOvertimeAutoCalculate: singleData?.isOvertimeAutoCalculate
            ? true
            : false,
        }
      : initialValues,
    validationSchema,
    onSubmit: (values) => {
      saveHandler(values, () => {
        getOverTimeConfig(setLoading, setSingleData, orgId);
      });
    },
  });
  const saveHandler = (values, cb) => {
    const payload = {
      intOtconfigId: singleData?.intOtconfigId || 0,
      intAccountId: orgId,
      intOtdependOn: +values?.overtimeDependOn,
      numFixedAmount: +values?.fixedAmount || 0,
      intOverTimeCountFrom:
        values?.overtimeCountingFrom === "0" ? 0 : +values?.fixedTime,
      intOtbenefitsHour: +values?.overtimeBenifit,
      intMaxOverTimeDaily: +values?.maxOvertimeDaily,
      intMaxOverTimeMonthly: +values?.maxOvertimeMonthly,
      intOtcalculationShouldBe: +values?.overTime,
      intOtAmountShouldBe: +values?.overTimeAmount,
      isActive: true,
      dteCreateAt: new Date(),
      intCreatedBy: employeeId,
      dteUpdatedDate: new Date(),
      intUpdatedBy: employeeId,
      isOvertimeAutoCalculate: values?.isOvertimeAutoCalculate,
    };
    saveOvertimePolicy(payload, setLoading, cb);
  };

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30330) {
      permission = item;
    }
  });

  const varifyNumber = (e) => {
    return (
      e.nativeEvent.data === "." ||
      e.target.value.includes(".") ||
      e.nativeEvent.data === "-" ||
      e.target.value.includes("-")
    );
  };

  return (
    <>
      {loading && <Loading />}
      <div className="table-card ml-3">
        <div className="table-card-heading mt-2" ref={scrollRef}>
          <h2>Overtime Policy</h2>
        </div>
        <div>
          {/* permission?.isView */}
          {permission?.isView ? (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-12">
                  <div className="input-field-main">
                    <label>1. Overtime Depend On</label>
                    <div>
                      <FormikRadio
                        styleobj={{
                          iconWidth: "15px",
                          icoHeight: "15px",
                          padding: "0px 8px 0px 10px",
                          checkedColor: greenColor,
                        }}
                        name="overtimeDependOn"
                        label="Basic"
                        value={"1"}
                        onChange={(e) => {
                          setFieldValue("overtimeDependOn", e.target.value);
                        }}
                        checked={values?.overtimeDependOn === "1"}
                      />
                      <FormikRadio
                        styleobj={{
                          iconWidth: "15px",
                          icoHeight: "15px",
                          padding: "0px 8px 0px 10px",
                        }}
                        name="overtimeDependOn"
                        label="Gross"
                        value={"2"}
                        onChange={(e) => {
                          setFieldValue("overtimeDependOn", e.target.value);
                        }}
                        checked={values?.overtimeDependOn === "2"}
                      />
                      <div>
                        <FormikRadio
                          styleobj={{
                            iconWidth: "15px",
                            icoHeight: "15px",
                            padding: "0px 8px 0px 10px",
                          }}
                          name="overtimeDependOn"
                          label="Fixed Amount"
                          value={"3"}
                          onChange={(e) => {
                            setFieldValue("overtimeDependOn", e.target.value);
                          }}
                          checked={values?.overtimeDependOn === "3"}
                        />
                        {values?.overtimeDependOn === "3" && (
                          <DefaultInput
                            classes="input-sm w-25"
                            value={values?.fixedAmount}
                            name="fixedAmount"
                            type="number"
                            placeholder="Enter Amount"
                            onChange={(e) => {
                              setFieldValue("fixedAmount", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 mt-1">
                  <Alert
                    icon={<InfoOutlinedIcon fontSize="inherit" />}
                    severity="success"
                  >
                    <h5 style={{ fontSize: "14px" }}>Calculation Process</h5>

                    <p style={{ fontSize: "12px" }}>
                      ((
                      {values?.overtimeDependOn === "1"
                        ? "Basic"
                        : values?.overtimeDependOn === "2"
                        ? "Gross"
                        : values?.fixedAmount
                        ? values?.fixedAmount
                        : "Fixed Amount"}
                      /Working days)/8) *{" "}
                      {values?.overtimeBenifit
                        ? values?.overtimeBenifit
                        : "Overtime Benifit"}
                    </p>
                  </Alert>
                </div>
                <div className="col-lg-12 mt-1">
                  <div className="input-field-main">
                    <label>2. Overtime Count from</label>
                    <div>
                      <FormikRadio
                        styleobj={{
                          iconWidth: "15px",
                          icoHeight: "15px",
                          padding: "0px 8px 0px 10px",
                        }}
                        name="overtimeCountingFrom"
                        label="Assign Calender"
                        value={"0"}
                        onChange={(e) => {
                          setFieldValue("overtimeCountingFrom", e.target.value);
                        }}
                        checked={values?.overtimeCountingFrom === "0"}
                      />
                      <div>
                        <FormikRadio
                          styleobj={{
                            iconWidth: "15px",
                            icoHeight: "15px",
                            padding: "0px 8px 0px 10px",
                          }}
                          name="overtimeCountingFrom"
                          label="Count Minimum Overtime Start Time (Minutes)"
                          value={"1"}
                          onChange={(e) => {
                            setFieldValue(
                              "overtimeCountingFrom",
                              e.target.value
                            );
                          }}
                          checked={values?.overtimeCountingFrom !== "0"}
                        />
                        {values?.overtimeCountingFrom !== "0" && (
                          <DefaultInput
                            classes="input-sm w-25"
                            value={values?.fixedTime}
                            name="fixedTime"
                            type="number"
                            placeholder="Enter Value"
                            onChange={(e) => {
                              if (e.target.value < 0 || e.target.value === -0) {
                                setFieldValue("fixedTime", 0);
                                return toast.warn("Value can't be negative");
                              }
                              setFieldValue("fixedTime", e.target.value);
                            }}
                            min={0}
                            errors={errors}
                            touched={touched}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 mt-1">
                  <label>3. Overtime Benefit (Hours)</label>
                  <div className="input-field-main">
                    {/* <FormikSelect
                      name="overtimeBenifit"
                      options={[
                        { label: "At Actual", value: 1 },
                        { label: "Double", value: 2 },
                      ]}
                      value={values?.overtimeBenifit}
                      onChange={(value) => {
                        setFieldValue("overtimeBenifit", value);
                      }}
                      placeholder=" "
                      styles={customStyles}
                      isSearchable={false}
                      isClearable={false}
                      errors={errors}
                      touched={touched}
                    /> */}
                    <DefaultInput
                      classes="input-sm w-25"
                      value={values?.overtimeBenifit}
                      name="overtimeBenifit"
                      placeholder="Enter Hour"
                      onChange={(e) => {
                        if (varifyNumber(e)) {
                          return toast.warn(
                            `Overtime Benefit must be a valid number`
                          );
                        } else {
                          setFieldValue("overtimeBenifit", e.target.value);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <label>4. Maximum Overtime Daily (Hour)</label>
                  <DefaultInput
                    classes="input-sm w-25"
                    value={values?.maxOvertimeDaily}
                    name="maxOvertimeDaily"
                    placeholder="Enter Hour"
                    onChange={(e) => {
                      if (varifyNumber(e)) {
                        return toast.warn(
                          `Daily Overtime must be a valid number`
                        );
                      } else if (e.target.value > 24) {
                        return toast.warn(
                          `Daily Overtime can't be more than 24
                           hours`
                        );
                      } else {
                        setFieldValue("maxOvertimeDaily", e.target.value);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-12">
                  <label>5. Maximum Overtime Monthly (Hour)</label>
                  <DefaultInput
                    classes="input-sm w-25"
                    value={values?.maxOvertimeMonthly}
                    name="maxOvertimeMonthly"
                    placeholder="Enter Hour"
                    onChange={(e) => {
                      if (varifyNumber(e)) {
                        return toast.warn(
                          `Maximum Overtime Monthly must be a valid number`
                        );
                      } else if (e.target.value > 672) {
                        return toast.warn(
                          `Maximum Overtime Monthly can't be more than 672
                           hours`
                        );
                      } else {
                        setFieldValue("maxOvertimeMonthly", e.target.value);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-12">
                  <div className="input-field-main w-25">
                    <label>6. Overtime (Minute/Hour)</label>
                    <div>
                      <FormikRadio
                        styleobj={{
                          iconWidth: "15px",
                          icoHeight: "15px",
                          padding: "0px 8px 0px 10px",
                          checkedColor: greenColor,
                        }}
                        name="overTime"
                        label="At Actual"
                        value={"1"}
                        onChange={(e) => {
                          setFieldValue("overTime", e.target.value);
                        }}
                        checked={values?.overTime === "1"}
                      />
                      <FormikRadio
                        styleobj={{
                          iconWidth: "15px",
                          icoHeight: "15px",
                          padding: "0px 8px 0px 10px",
                        }}
                        name="overTime"
                        label="Round Down"
                        value={"2"}
                        onChange={(e) => {
                          setFieldValue("overTime", e.target.value);
                        }}
                        checked={values?.overTime === "2"}
                      />
                      <FormikRadio
                        styleobj={{
                          iconWidth: "15px",
                          icoHeight: "15px",
                          padding: "0px 8px 0px 10px",
                        }}
                        name="overTime"
                        label="Round Up"
                        value={"3"}
                        onChange={(e) => {
                          setFieldValue("overTime", e.target.value);
                        }}
                        checked={values?.overTime === "3"}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="input-field-main w-25">
                    <label>7. Overtime Amount</label>
                    <div>
                      <FormikRadio
                        styleobj={{
                          iconWidth: "15px",
                          icoHeight: "15px",
                          padding: "0px 8px 0px 10px",
                          checkedColor: greenColor,
                        }}
                        name="overTimeAmount"
                        label="At Actual"
                        value={"1"}
                        onChange={(e) => {
                          setFieldValue("overTimeAmount", e.target.value);
                        }}
                        checked={values?.overTimeAmount === "1"}
                      />
                      <FormikRadio
                        styleobj={{
                          iconWidth: "15px",
                          icoHeight: "15px",
                          padding: "0px 8px 0px 10px",
                        }}
                        name="overTimeAmount"
                        label="Round Down"
                        value={"2"}
                        onChange={(e) => {
                          setFieldValue("overTimeAmount", e.target.value);
                        }}
                        checked={values?.overTimeAmount === "2"}
                      />
                      <FormikRadio
                        styleobj={{
                          iconWidth: "15px",
                          icoHeight: "15px",
                          padding: "0px 8px 0px 10px",
                        }}
                        name="overTimeAmount"
                        label="Round Up"
                        value={"3"}
                        onChange={(e) => {
                          setFieldValue("overTimeAmount", e.target.value);
                        }}
                        checked={values?.overTimeAmount === "3"}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 mt-2">
                  <div className="input-field-main w-25 d-flex">
                    <label>
                      8. Do you want to calculate overtime automatically from
                      attendance?
                    </label>
                    <div>
                      <FormikCheckBox
                        height="15px"
                        styleObj={{
                          color: gray900,
                          checkedColor: greenColor,
                          padding: "0px 0px 0px 5px",
                        }}
                        name="isOvertimeAutoCalculate"
                        value={values?.isOvertimeAutoCalculate}
                        checked={values?.isOvertimeAutoCalculate}
                        onChange={(e) => {
                          setFieldValue(
                            "isOvertimeAutoCalculate",
                            e.target.checked
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <PrimaryButton
                type="submit"
                className="btn btn-green flex-center my-2 "
                label={singleData?.intOtconfigId ? "Update" : "Save"}
              />
            </form>
          ) : (
            <NotPermittedPage />
          )}
        </div>
      </div>
    </>
  );
};

export default OvertimePolicy;
