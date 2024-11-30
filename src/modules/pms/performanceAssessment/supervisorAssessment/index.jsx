import { useFormik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import AntTable from "../../../../common/AntTable";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { quarterDDL } from "../../../../utility/quaterDDL";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { getFiscalYearForNowOnLoad } from "../../performancePlanning/individualKpiEntry/helper";
import { barAssesmentColumn } from "./helper";
import { setBarAssesmentInitialValuesAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import AntScrollTable from "../../../../common/AntScrollTable";

const SupervisorAssessmentLanding = () => {
  // 30494
  const history = useHistory();
  const dispatch = useDispatch();
  const ASSESMENTTYPE = "subordinate";
  const { barAssesmentInitialValues } = useSelector(
    (state) => state?.localStorage || {},
    shallowEqual
  );
  const {
    profileData: { intEmployeeId },
  } = useSelector((state) => state.auth);
  const [
    fiscalYearDDL,
    getFiscalYearDDL,
    fiscalYearDDLloader,
    setFiscalYearDDL,
  ] = useAxiosGet();
  const [
    barAssessmentData,
    getBarAssessmentData,
    getBarAssessmentDataLoader,
    setBarAssessmentData,
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

  useEffect(() => {
    const year = barAssesmentInitialValues?.yearDDL?.value;
    const quarter = barAssesmentInitialValues?.quarterDDL?.value || 0;

    //bar assessment url
    const url = `/PMS/GetBarAssesmentEmployee?AccountID=1&AssesmentType=${ASSESMENTTYPE}&EmployeeID=${intEmployeeId}&Year=${year}&Quater=${quarter}`;

    //fetch table data
    getBarAssessmentData(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barAssesmentInitialValues]);

  //Form handling (Formik)
  const { setFieldValue, handleSubmit, errors, touched, values } = useFormik({
    initialValues: barAssesmentInitialValues,
    onSubmit: (formValue) => {
      dispatch(setBarAssesmentInitialValuesAction({ ...values }));
    },
  });

  return (
    <>
      {(fiscalYearDDLloader || getBarAssessmentDataLoader) && <Loading />}
      <div className="table-card">
        <div
          className="table-card-heading"
          style={{ marginBottom: "12px" }}
        ></div>
        <div className="card-style pb-0 mb-2">
          <div className="row py-3 py-lg-0">
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
                    setBarAssessmentData([]);
                  } else {
                    setFieldValue("yearDDL", "");
                    setBarAssessmentData([]);
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
                  console.log({ valueOption });
                  if (valueOption) {
                    setFieldValue("quarterDDL", valueOption);
                    setBarAssessmentData([]);
                  } else {
                    setFieldValue("quarterDDL", "");
                    setBarAssessmentData([]);
                  }
                }}
                styles={customStyles}
                errors={errors}
                touched={touched}
                menuPosition="fixed"
              />
            </div>
            <div className="d-flex align-items-center mb-n2 col-lg-3">
              <button
                className="btn btn-green btn-green-disabled"
                type="submit"
                style={{ cursor: "pointer" }}
                disabled={!values?.yearDDL || !values?.quarterDDL?.value}
                onClick={handleSubmit}
              >
                View
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="table-card-styled employee-table-card tableOne table-responsive">
            <AntScrollTable
              data={barAssessmentData || []}
              columnsData={barAssesmentColumn({
                history,
                yearId: values?.yearDDL?.value,
                quarterId: values?.quarterDDL?.value,
                assessmentType: ASSESMENTTYPE,
              })}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SupervisorAssessmentLanding;
