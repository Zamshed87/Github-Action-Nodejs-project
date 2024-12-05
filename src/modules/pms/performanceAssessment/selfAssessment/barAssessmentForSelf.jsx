import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import { setBarAssesmentInitialValuesAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { quarterDDL } from "../../../../utility/quaterDDL";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { getFiscalYearForNowOnLoad } from "../../performancePlanning/individualKpiEntry/helper";
import BarAssessmentEvaluationForSelf from "./barAssessmentEvaluationForSelf";

const intData = {
  assessmentToDDL: { value: "self", label: "Self" },
  employeeDDL: "",
  yearDDL: "",
  quarterDDL: "",
};

const BarAssessmentForSelf = () => {
  const dispatch = useDispatch();

  const {
    profileData: { intEmployeeId },
  } = useSelector((state) => state.auth);
  const [
    fiscalYearDDL,
    getFiscalYearDDL,
    fiscalYearDDLloader,
    setFiscalYearDDL,
  ] = useAxiosGet();

  //load the yearDDl data
  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      let yearDDLOptions = data.map(({ value, label }) => ({ value, label }));
      const currYear = getFiscalYearForNowOnLoad();
      const currYearOption = yearDDLOptions.find(
        (item) => item?.label === currYear
      );
      dispatch(
        setBarAssesmentInitialValuesAction({
          ...values,
          yearDDL: currYearOption,
        })
      );
      setFiscalYearDDL(yearDDLOptions);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Form handling (Formik)
  const { setFieldValue, handleSubmit, errors, touched, values } = useFormik({
    initialValues: intData,
    onSubmit: (formValue) => {},
  });

  return (
    <>
      {fiscalYearDDLloader && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div>
            <h2 style={{ color: "#344054" }}>BAR Assesment</h2>
          </div>
        </div>
        <div className="card-style pb-0 mb-2">
          <div className="row">
            <div className="input-field-main col-lg-3">
              <FormikSelect
                classes="input-sm"
                label="Year"
                name="yearDDL"
                options={fiscalYearDDL || []}
                value={values?.yearDDL}
                onChange={(valueOption) => {
                  if (valueOption) {
                    setFieldValue("yearDDL", valueOption);
                  } else {
                    setFieldValue("yearDDL", "");
                  }
                }}
                placeholder="Select Year"
                styles={customStyles}
                errors={errors}
                touched={touched}
                menuPosition="fixed"
              />
            </div>
            <div className="input-field-main col-lg-3">
              <FormikSelect
                classes="input-sm"
                label="Quarter"
                name="quarterDDL"
                options={quarterDDL}
                value={values?.quarterDDL}
                onChange={(valueOption) => {
                  if (valueOption) {
                    setFieldValue("quarterDDL", valueOption);
                  } else {
                    setFieldValue("quarterDDL", "");
                  }
                }}
                styles={customStyles}
                errors={errors}
                touched={touched}
                menuPosition="fixed"
              />
            </div>
          </div>
        </div>
        <div>
          {values?.yearDDL && values?.quarterDDL && (
            <BarAssessmentEvaluationForSelf
              id={intEmployeeId}
              yearId={values?.yearDDL?.value}
              quarterId={values?.quarterDDL?.value}
              assessmentType={values?.assessmentToDDL?.value}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default BarAssessmentForSelf;
