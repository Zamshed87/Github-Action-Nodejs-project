import { Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import { customStyles } from "../../../../utility/selectCustomStyle";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import MeasuringDetails from "./measuringDetails";
import { getFiscalYearForNowOnLoad } from "../../../../utility/getFiscalYearOnLoade";
import { quarterDDL } from "../../../../utility/quaterDDL";

const initData = {
  year: "",
  quater: "",
  competencyName: "",
};

const validationSchema = Yup.object().shape({
  quater: Yup.object()
    .shape({
      label: Yup.string().required("Quarter is required"),
      value: Yup.string().required("Quarter is required"),
    })
    .typeError("Quarter is required"),
  year: Yup.object()
    .shape({
      label: Yup.string().required("Priority is required"),
      value: Yup.string().required("Priority is required"),
    })
    .typeError("Year is required"),
});

const CompetenciesForSupervisorAssessment = ({ tabValue }) => {
  const formikRef = useRef();
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const { buId, orgId, userName, employeeId, strDesignation } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [
    competenciesDetailsData,
    getCompetenciesDetailsData,
    competenciesDetailsDataLoading,
    setCompetenciesDetailsData,
  ] = useAxiosGet();

  const [
    competenciesDDL,
    getCompetenciesDDL,
    competenciesLoading,
    setCompetenciesDDL,
  ] = useAxiosGet();

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      initData.year = theYearData;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb, confirm) => {};

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
      innerRef={formikRef}
    >
      {({ handleSubmit, values, errors, touched, setFieldValue }) => (
        <>
          <Form onSubmit={handleSubmit}>
            {(fiscalYearDDLloader ||
              competenciesDetailsDataLoading ||
              competenciesLoading) && <Loading />}
            <div className="table-card-body">
              <div className="card-style with-form-card pb-0 mb-3 ">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-4 mt-2">
                        <div>
                          <p>
                            <span className="font-weight-bold">Name :</span>{" "}
                            <span>{userName}</span>
                          </p>
                        </div>
                        <div>
                          <p>
                            <span className="font-weight-bold">Enroll :</span>{" "}
                            <span>{employeeId}</span>
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div>
                          <p>
                            <span className="font-weight-bold">
                              Designation :
                            </span>{" "}
                            <span>{strDesignation || ""}</span>
                          </p>
                        </div>
                        <div>
                          <p>
                            <span className="font-weight-bold">Location :</span>{" "}
                            <span>{""}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />
                  <br />
                  <div className="input-field-main col-lg-3">
                    <FormikSelect
                      classes="input-sm"
                      label="Year"
                      name="year"
                      options={fiscalYearDDL}
                      value={values?.year}
                      onChange={(valueOption) => {
                        setFieldValue("year", valueOption);
                        setFieldValue("quater", "");
                      }}
                      placeholder=" "
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      menuPosition="fixed"
                    />
                  </div>
                  <div className="input-field-main col-lg-3">
                    <FormikSelect
                      classes="input-sm"
                      name="quater"
                      options={quarterDDL}
                      value={values?.quater}
                      label="Quarter"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("quater", valueOption);
                          getCompetenciesDDL(
                            `/PMS/GetCompetencyList?accountId=${orgId}&businessUnitId=${buId}&yearId=${values?.year?.value}&quarterId=${valueOption?.value}&employeeId=${employeeId}`
                          );
                        } else {
                          setFieldValue("quater", "");
                          setCompetenciesDDL([]);
                          setFieldValue("competencyName", "");
                        }
                      }}
                      placeholder=" "
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      menuPosition="fixed"
                      isDisabled={!values?.year}
                    />
                  </div>
                  <div className="input-field-main col-lg-3">
                    <FormikSelect
                      classes="input-sm"
                      name="competencyName"
                      options={competenciesDDL?.competencyList || []}
                      value={values?.competencyName}
                      label="Competency Name"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("competencyName", valueOption);
                          getCompetenciesDetailsData(
                            `/PMS/GetCompetencyDetailsPopUp?competencyId=${valueOption?.value}&businessUnitId=${buId}`
                          );
                        } else {
                          setFieldValue("competencyName", "");
                          setCompetenciesDetailsData([]);
                        }
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      menuPosition="fixed"
                      isDisabled={!values?.year || !values?.quater}
                    />
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-lg-12">
                    {values?.competencyName ? (
                      <>
                        <MeasuringDetails
                          tabValue={tabValue}
                          previousData={values}
                          detailsData={competenciesDetailsData}
                          getValuesAndCompetencyNameDDL={getCompetenciesDDL}
                        />
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default CompetenciesForSupervisorAssessment;
