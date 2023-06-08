import AddOutlined from "@mui/icons-material/AddOutlined";
import { FieldArray, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import BackButton from "../../../../common/BackButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import TrainingDetailsCard from "../../common/TrainingDetailsCard";
import {
  createAssessment,
  editAssessment,
  getAssessmentQuestions,
  getSingleSchedule
} from "./helper/helper";
import uuid from "./helper/uuid";
import CreateQuestion from "./question";

const initialValues = {
  questions: [],
  answers: [],
};

const validationSchema = Yup.object({
  questions: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("Question is required!"),
    })
  ),
  answers: Yup.array().of(
    Yup.object().shape({
      ansTitle: Yup.string().required("Please write the option!"),
      mark: Yup.number().required("Mark required!"),
    })
  ),
});

const AssessmentCreateEdit = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState({});
  const [scheduleDetails, getScheduleDetails] = useState({});

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission;

  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30356) {
      permission = item;
    }
  });

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const isInvalid = (values) => {
    if (!values?.questions?.length) return true;
    if (!values?.answers?.length) return true;
    values?.questions?.forEach((question) => {
      const queId = question?.queId;
      let flag = true;
      values?.answers?.forEach((answer) => {
        if (answer?.queId === queId) {
          flag = false;
        }
      });
      if (flag) return true;
    });
    return false;
  };

  const modifiedPayload = (values) => {
    const payload = values?.questions?.map((question) => {
      const options = [];
      values?.answers?.forEach((answer) => {
        if (answer?.queId === question.queId) {
          options.push({
            intOptionId: +answer?.optionId || 0,
            strOption: answer?.ansTitle,
            intQuestionId: +question.queId || 0,
            numPoints: +answer?.mark,
            dteLastAction: new Date(),
            intActionBy: +employeeId,
            intOrder: 1,
          });
        }
      });

      return {
        intQuestionId: +question?.queId || 0,
        strQuestion: question?.title,
        intScheduleId: +params?.scheduleId,
        isPreAssesment: params?.status === "pre" ? true : false,
        isActive: true,
        dteLastActionDate: new Date(),
        intActionBy: +employeeId,
        isRequired: question?.isRequired,
        strInputType: "radio",
        intOrder: +0,
        options: [...options],
      };
    });

    return payload;
  };

  const handleSubmit = (values, cb) => {
    const payload = modifiedPayload(values);

    const callback = () => {
      cb?.();
      if (params?.crudStatus === "edit") {
        getAssessmentQuestions(
          params?.scheduleId,
          params?.status,
          setLoading,
          setRowDto
        );
      }
    };

    if (params?.crudStatus === "create") {
      createAssessment(payload, setLoading, callback);
    } else if (params?.crudStatus === "edit") {
      editAssessment(payload, setLoading, callback);
    }
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getSingleSchedule(
      getScheduleDetails,
      setLoading,
      orgId,
      buId,
      params?.scheduleId
    );
    if (params?.crudStatus === "edit") {
      getAssessmentQuestions(
        params?.scheduleId,
        params?.status,
        setLoading,
        setRowDto
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.scheduleId]);

  return (
    <>
      {loading && <Loading />}
      {permission?.isCreate ? (
        <Formik
          enableReinitialize={true}
          initialValues={params?.crudStatus === "edit" ? rowDto : initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values, () => resetForm(initialValues));
          }}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            isValid,
            setValues,
            setFieldValue,
          }) => (
            <Form>
              <div className="table-card">
                <div className="table-card-heading mb-2">
                  <div className="d-flex align-items-center">
                    <BackButton />
                    <h2>
                      Create{" "}
                      {params?.status.charAt(0).toUpperCase() +
                        params?.status.slice(1)}{" "}
                      Assessment
                    </h2>
                  </div>
                  <ul className="d-flex flex-wrap">
                    <li>
                      <button
                        type="submit"
                        className="btn btn-default flex-center mr-2"
                        disabled={
                          Object.keys(errors)?.length || isInvalid(values)
                        }
                      >
                        Save
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="table-card-body">
                  <TrainingDetailsCard
                    data={{
                      trainingName: scheduleDetails?.strTrainingName,
                      resourcePerson: scheduleDetails?.strResourcePersonName,
                      requestedBy: scheduleDetails?.strEmployeeName,
                      batchSize: scheduleDetails?.intBatchSize,
                      batchNo: scheduleDetails?.strBatchNo,
                      fromDate: scheduleDetails?.dteFromDate,
                      toDate: scheduleDetails?.dteToDate,
                      duration: scheduleDetails?.numTotalDuration,
                      venue: scheduleDetails?.strVenue,
                      remark: scheduleDetails?.strRemarks,
                    }}
                  />

                  <div className="mt-4">
                    <p
                      className=""
                      style={{ fontSize: "14px", fontWeight: "600" }}
                    >
                      {params?.status.charAt(0).toUpperCase() +
                        params?.status.slice(1)}{" "}
                      Assessment
                    </p>
                    <p className="mt-1">
                      Set your {params?.status} assessment, you can mark each
                      question.
                    </p>
                  </div>

                  <FieldArray name="questions">
                    {({ push, remove, form }) => (
                      <>
                        {form?.values?.questions?.map((question, index) => {
                          const newQuestion = `questions[${index}].title`;
                          const questionRequired = `questions[${index}].isRequired`;
                          return (
                            <CreateQuestion
                              values={values}
                              newQuestion={newQuestion}
                              questionRequired={questionRequired}
                              errors={errors}
                              touched={touched}
                              handleBlur={handleBlur}
                              index={index}
                              remove={remove}
                              question={question}
                              setFieldValue={setFieldValue}
                              setValues={setValues}
                            />
                          );
                        })}

                        <div className="mt-4">
                          <PrimaryButton
                            type="button"
                            className="btn btn-default flex-center"
                            label={"Add"}
                            icon={
                              <AddOutlined
                                sx={{
                                  marginRight: "0px",
                                  fontSize: "15px",
                                }}
                              />
                            }
                            onClick={() =>
                              push({
                                queId: uuid(),
                                title: "",
                                isRequired: false,
                              })
                            }
                          />
                        </div>
                      </>
                    )}
                  </FieldArray>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default AssessmentCreateEdit;
