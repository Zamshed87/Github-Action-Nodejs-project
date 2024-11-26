import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
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

const ValuesForSupervisorAssessment = ({
  tabValue,
  EmployeeInfo: { employeeID, employeeName },
}) => {
  // eslint-disable-next-line no-unused-vars
  const [planList, setPlanList] = useState();
  const [valuesNameDDL, getValuesNameDDL, valuesLoading, setValuesNameDDL] =
    useAxiosGet();
  const [
    valuesDetailsData,
    getValuesDetailsData,
    vDetailsLoading,
    setValuesDetailsData,
  ] = useAxiosGet();
  // const [commonDDL, setCommonDDL] = useState([]);

  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();

  const formikRef = useRef();
  const { buId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      initData.yearDDLgroup = theYearData;
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
              {(vDetailsLoading || valuesLoading || fiscalYearDDLloader) && (
                <Loading />
              )}
              <div className="table-card-body">
                <div className="card-style with-form-card pb-0 mb-3 ">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-4 mt-2">
                          <div>
                            <p>
                              <span className="font-weight-bold">Name :</span>{" "}
                              <span>{employeeName}</span>
                            </p>
                          </div>
                          <div>
                            <p>
                              <span className="font-weight-bold">Enroll :</span>{" "}
                              <span>{employeeID}</span>
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div>
                            <p>
                              <span className="font-weight-bold">
                                Designation :
                              </span>{" "}
                              <span>{""}</span>
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
                          setFieldValue("yearDDLgroup", valueOption);
                          setFieldValue("quarterDDLgroup", "");
                          setPlanList([]);
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
                        name="quarterDDLgroup"
                        options={quarterDDL}
                        value={values?.quarterDDLgroup}
                        label="Quarter"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("quarterDDLgroup", valueOption);
                            getValuesNameDDL(
                              `/PMS/GetValueList?accountId=${orgId}&businessUnitId=${buId}&yearId=${values?.yearDDLgroup?.value}&quarterId=${valueOption?.value}&employeeID=${employeeID}`
                            );
                          } else {
                            setFieldValue("quarterDDLgroup", "");
                            setValuesNameDDL([]);
                            setFieldValue("valuesName", "");
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
                        isDisabled={
                          !values?.yearDDLgroup || !values?.quarterDDLgroup
                        }
                      />
                    </div>
                  </div>
                  <hr />

                  <div className="row">
                    <div className="col-lg-12">
                      {values?.valuesName ? (
                        <>
                          <MeasuringDetails
                            tabValue={tabValue}
                            previousData={values}
                            detailsData={valuesDetailsData}
                            getValuesAndCompetencyNameDDL={getValuesNameDDL}
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
    </>
  );
};

export default ValuesForSupervisorAssessment;
