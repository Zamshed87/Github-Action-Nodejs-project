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
      label: Yup.string().required("Year is required"),
      value: Yup.string().required("Year is required"),
    })
    .typeError("Year is required"),
});

const ValuesForSelfAssessment = ({ tabValue }) => {
  const [valuesNameDDL, getValuesNameDDL, valuesLoading] = useAxiosGet();
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const formikRef = useRef();
  const { buId, orgId, userName, employeeId, strDesignation } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [
    valuesDetailsData,
    getValuesDetailsData,
    vDetailsLoading,
    setValuesDetailsData,
  ] = useAxiosGet();

  const [
    valuesReportData,
    getValuesReportData,
    valuesReportLoading,
    setValuesReportData,
  ] = useAxiosGet();

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      initData.yearDDLgroup = theYearData;
      getValuesNameDDL(
        `/PMS/GetValueList?accountId=${orgId}&businessUnitId=${buId}&yearId=${theYearData?.value}&employeeId=${employeeId}`,
        (res) => {
          if (res?.isPreviewEnable) {
            getValuesReportData(
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
              {(vDetailsLoading ||
                valuesReportLoading ||
                valuesLoading ||
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
                            getValuesNameDDL(
                              `/PMS/GetValueList?accountId=${orgId}&businessUnitId=${buId}&yearId=${values?.yearDDLgroup?.value}&employeeId=${employeeId}`,
                              (res) => {
                                if (res?.isPreviewEnable) {
                                  getValuesReportData(
                                    `/PMS/GetCoreValuesAndCompetencyPreview?businessUnitId=${buId}&employeeId=${employeeId}&yearId=${values?.yearDDLgroup?.value}&typeId=2`
                                  );
                                }
                              }
                            );
                            setFieldValue("yearDDLgroup", valueOption);
                            setFieldValue("quarterDDLgroup", "");
                            setFieldValue("valuesName", "");
                            setValuesDetailsData([]);
                            setValuesReportData([]);
                          } else {
                            setFieldValue("yearDDLgroup", "");
                            setFieldValue("quarterDDLgroup", "");
                            setFieldValue("valuesName", "");
                            setValuesDetailsData([]);
                            setValuesReportData([]);
                          }
                        }}
                        placeholder=" "
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        menuPosition="fixed"
                      />
                    </div>
                    {!valuesNameDDL?.isPreviewEnable ? (
                      <>
                        <div className="input-field-main col-lg-3">
                          <FormikSelect
                            classes="input-sm"
                            name="valuesName"
                            options={valuesNameDDL?.valuesList || []}
                            value={values?.valuesName}
                            label="Values Name"
                            onChange={(valueOption) => {
                              if (valueOption) {
                                setFieldValue("valuesName", valueOption);
                                getValuesDetailsData(
                                  `/PMS/GetValueDetailsPopUp?coreValueId=${valueOption?.value}&businessUnitId=${buId}`
                                );
                              } else {
                                setFieldValue("valuesName", "");
                                setValuesDetailsData([]);
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
                  {valuesNameDDL?.isPreviewEnable && values?.yearDDLgroup ? (
                    <>
                      <div className="row">
                        <div className="col-lg-12">
                          <AssessmentReport
                            selfAssessmentReportData={valuesReportData}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="row">
                        <div className="col-lg-12">
                          {values?.valuesName ? (
                            <>
                              <MeasuringDetails
                                tabValue={tabValue}
                                detailsData={valuesDetailsData}
                                getValuesAndCompetencyNameDDL={getValuesNameDDL}
                                getValuesReportData={getValuesReportData}
                                values={values}
                                setFieldValue={setFieldValue}
                                errors={errors}
                                touched={touched}
                              />
                            </>
                          ) : null}
                        </div>
                      </div>
                    </>
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

export default ValuesForSelfAssessment;
