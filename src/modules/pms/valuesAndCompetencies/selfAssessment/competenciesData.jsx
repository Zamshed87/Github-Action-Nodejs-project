import { Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { customStyles } from "../../../../utility/selectCustomStyle";
import MeasuringDetails from "./measuringDetails";
import AssessmentReport from "./report";
import { getFiscalYearForNowOnLoad } from "../../../../utility/getFiscalYearOnLoade";

const initData = {
  yearDDLgroup: "",
};
const validationSchema = Yup.object().shape({
  quarterDDLgroup: Yup.object()
    .shape({
      label: Yup.string().required("Quarter is required"),
      value: Yup.string().required("Quarter is required"),
    })
    .typeError("Quarter is required"),
  yearDDLgroup: Yup.object()
    .shape({
      label: Yup.string().required("Priority is required"),
      value: Yup.string().required("Priority is required"),
    })
    .typeError("Year is required"),
});

const CompetenciesForSelfAssessment = ({ tabValue }) => {
  const [
    competenciesDDL,
    getCompetenciesDDL,
    competenciesLoading,
    setCompetenciesDDL,
  ] = useAxiosGet();
  const formikRef = useRef();
  const { buId, orgId, userName, employeeId, strDesignation } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [
    competenciesDetailsData,
    getCompetenciesDetailsData,
    cDetailsLoading,
    setCompetenciesDetailsData,
  ] = useAxiosGet();

  const [
    competencyReportData,
    getCompetencyReportData,
    competencyReportLoading,
    setCompetencyReportData,
  ] = useAxiosGet();

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      initData.yearDDLgroup = theYearData;

      getCompetenciesDDL(
        `/PMS/GetCompetencyList?accountId=${orgId}&businessUnitId=${buId}&yearId=${theYearData?.value}&employeeId=${employeeId}`,
        (res) => {
          if (res?.isPreviewEnable) {
            getCompetencyReportData(
              `/PMS/GetCoreValuesAndCompetencyPreview?businessUnitId=${buId}&employeeId=${employeeId}&yearId=${theYearData?.value}&typeId=2`
            );
          }
        }
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb, confirm) => {};

  return (
    <>
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
              {(competenciesLoading ||
                competencyReportLoading ||
                cDetailsLoading ||
                fiscalYearDDLloader) && <Loading />}
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
                              <span className="font-weight-bold">
                                Location :
                              </span>{" "}
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
                        name="yearDDLgroup"
                        options={fiscalYearDDL}
                        value={values?.yearDDLgroup}
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("yearDDLgroup", valueOption);
                            setFieldValue("quarterDDLgroup", "");
                            setCompetencyReportData([]);
                            setFieldValue("competencyName", "");
                            setCompetenciesDetailsData([]);
                          } else {
                            setFieldValue("yearDDLgroup", "");
                            setFieldValue("quarterDDLgroup", "");
                            setCompetenciesDDL([]);
                            setFieldValue("competencyName", "");
                            setCompetenciesDetailsData([]);
                            setCompetencyReportData([]);
                          }
                        }}
                        placeholder=" "
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        menuPosition="fixed"
                      />
                    </div>
                    {!competenciesDDL?.isPreviewEnable ? (
                      <>
                        <div className="input-field-main col-lg-3">
                          <FormikSelect
                            classes="input-sm"
                            name="competencyName"
                            options={competenciesDDL?.competencyList || []}
                            value={values?.competencyName}
                            label="Competencies Name"
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
                            placeholder=" "
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                            menuPosition="fixed"
                            isDisabled={!values?.yearDDLgroup}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                  <hr />

                  {competenciesDDL?.isPreviewEnable &&
                  values?.yearDDLgroup &&
                  values?.quarterDDLgroup ? (
                    <>
                      <div className="row">
                        <div className="col-lg-12">
                          <AssessmentReport
                            selfAssessmentReportData={competencyReportData}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="row">
                      <div className="col-lg-12">
                        {values?.competencyName ? (
                          <>
                            <MeasuringDetails
                              tabValue={tabValue}
                              detailsData={competenciesDetailsData}
                              getValuesAndCompetencyNameDDL={getCompetenciesDDL}
                              values={values}
                              setFieldValue={setFieldValue}
                              errors={errors}
                              touched={touched}
                            />
                          </>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default CompetenciesForSelfAssessment;
