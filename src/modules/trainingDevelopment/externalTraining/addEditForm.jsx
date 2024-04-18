/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { getPeopleDeskAllDDL } from "../../../common/api";
import BackButton from "../../../common/BackButton";
import FormikInput from "../../../common/FormikInput";
import FormikSelect from "../../../common/FormikSelect";
import Loading from "../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../utility/customHooks/useAxiosPost";
import { customStyles } from "../../../utility/selectCustomStyle";
import { todayDate } from "../../../utility/todayDate";

const initData = {
  trainingName: "",
  trainerName: "",
  department: "",
  categoryOfOrganization: "",
  expectedParticipant: "",
  presentParticipant: "",
  purpose: "",
};

const validationSchema = Yup.object().shape({
  trainingName: Yup.string().required("Training name is required"),
  department: Yup.object().shape({
    label: Yup.string().required("Department name is required"),
    value: Yup.string().required("Department name is required"),
  }),
  expectedParticipant: Yup.number().min(
    0,
    "Expected participants cannot be negative"
  ),
  presentParticipant: Yup.number().min(
    0,
    "Present participants cannot be negative"
  ),
});

const ExternalTrainingCreate = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [, getExternalTrainingDetail, loading1] = useAxiosGet([]);
  const [, saveExternalTraining, loading2] = useAxiosPost({});

  const [singleData, setSingleData] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);

  const saveHandler = (values, cb) => {
    const payload = {
      intExternalTrainingId: +params?.id || 0,
      strTrainingName: values?.trainingName,
      strResourcePersonName: values?.trainerName,
      dteDate: todayDate(),
      intDepartmentId: values?.department?.value,
      strDepartmentName: values?.department?.label,
      strOrganizationCategory: values?.categoryOfOrganization,
      intBatchSize: +values?.expectedParticipant,
      intPresentParticipant: +values?.presentParticipant,
      strRemarks: values?.purpose,
      intAccountId: orgId,
      intBusinessUnitId: buId,
      isActive: true,
      intActionBy: employeeId,
      dteActionDate: todayDate(),
      intUpdatedBy: employeeId,
      dteUpdatedDate: todayDate(),
    };
    saveExternalTraining(`/Training/ExternalTraining`, payload, cb, true);
  };

  const getData = () => {
    if (!params?.id) return;
    const assetUrl = `/Training/GetExternalTrainingLanding?intExternalTrainingId=${params?.id}&intAccountId=${orgId}&intBusinessUnitId=${buId}`;
    getExternalTrainingDetail(assetUrl, (data) => {
      const modifiedData = {
        ...data[0],
        trainingName: data?.[0]?.strTrainingName,
        trainerName: data?.[0]?.strResourcePersonName,
        department: {
          value: data?.[0]?.intDepartmentId,
          label: data?.[0]?.strDepartmentName,
        },
        categoryOfOrganization: data?.[0]?.strOrganizationCategory,
        expectedParticipant: +data?.[0]?.intBatchSize,
        presentParticipant: +data?.[0]?.intPresentParticipant,
        purpose: data?.[0]?.strRemarks,
      };
      setSingleData(modifiedData);
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    params?.id && getData();
  }, [orgId, buId, params?.id]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&BusinessUnitId=${buId}&intId=${employeeId}&WorkplaceGroupId=${wgId}&intWorkplaceId=${wId}`,
      "DepartmentId",
      "DepartmentName",
      setDepartmentDDL
    );
  }, [employeeId, wgId, wId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={params?.id ? singleData : initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (params?.id) {
              getData();
              resetForm();
            } else {
              setSubmitting(false);
              resetForm();
            }
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {(loading2 || loading1) && <Loading />}
              <div className="table-card">
                <div className="table-card-heading mb12">
                  <div className="d-flex align-items-center">
                    <BackButton />
                    <h2>
                      {params?.id
                        ? `Edit External Training`
                        : `Create External Training`}
                    </h2>
                  </div>
                  <ul className="d-flex flex-wrap">
                    <li>
                      <button
                        type="button"
                        className="btn btn-cancel mr-2"
                        onClick={() => {
                          resetForm(initData);
                        }}
                      >
                        Reset
                      </button>
                    </li>
                    <li>
                      <button
                        type="submit"
                        className="btn btn-default flex-center"
                      >
                        Save
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="card-style">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Training Name</label>
                        <FormikInput
                          placeholder=""
                          classes="input-sm"
                          name="trainingName"
                          value={values?.trainingName}
                          type="text"
                          onChange={(e) => {
                            setFieldValue("trainingName", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>

                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Trainer Name</label>
                        <FormikInput
                          placeholder=""
                          classes="input-sm"
                          name="trainerName"
                          value={values?.trainerName}
                          type="text"
                          onChange={(e) => {
                            setFieldValue("trainerName", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>

                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Department</label>
                      </div>
                      <FormikSelect
                        menuPosition="fixed"
                        name="department"
                        options={departmentDDL || []}
                        value={values?.department}
                        onChange={(valueOption) => {
                          setFieldValue("department", valueOption);
                        }}
                        styles={customStyles}
                        errors={errors}
                        placeholder=""
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Category Of Organization</label>
                        <FormikInput
                          placeholder=""
                          classes="input-sm"
                          name="categoryOfOrganization"
                          value={values?.categoryOfOrganization}
                          type="text"
                          onChange={(e) => {
                            setFieldValue(
                              "categoryOfOrganization",
                              e.target.value
                            );
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>

                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Expected Participant</label>
                        <FormikInput
                          placeholder=""
                          classes="input-sm"
                          name="expectedParticipant"
                          value={values?.expectedParticipant}
                          type="number"
                          onChange={(e) => {
                            setFieldValue(
                              "expectedParticipant",
                              e.target.value
                            );
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>

                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Present Participant</label>
                        <FormikInput
                          placeholder=""
                          classes="input-sm"
                          name="presentParticipant"
                          value={values?.presentParticipant}
                          type="number"
                          onChange={(e) => {
                            setFieldValue("presentParticipant", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>

                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Purpose</label>
                        <FormikInput
                          placeholder=""
                          classes="input-sm"
                          name="purpose"
                          value={values?.purpose}
                          type="text"
                          onChange={(e) => {
                            setFieldValue("purpose", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
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

export default ExternalTrainingCreate;
