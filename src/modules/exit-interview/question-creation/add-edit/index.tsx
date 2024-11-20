/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/*
 * Title: Exit interview add and edit
 * Author: Khurshida Meem
 * Date: 12-11-2024
 *
 */
import { Col, Divider, Row } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  getEnumData,
  getWorkplaceDDL,
  getWorkplaceGroupDDL,
} from "common/api/commonApi";
import { useApiRequest } from "Hooks";
import { FieldArray, FormikProvider, useFormik } from "formik";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Stack } from "@mui/material";
import * as yup from "yup";
import SingleQuestionnaire from "./SingleQuestionnaire";
import uuid from "utility/uuid";
import { PlusOutlined } from "@ant-design/icons";
import { saveQuestionnaire } from "./helper";
import { toast } from "react-toastify";
import { getSingleQuestionnaire } from "../helper";

const validationSchema = yup.object({
  buDDL: yup.object().shape({
    label: yup.string().required("Business unit is required"),
    value: yup.string().required("Business unit is required"),
  }),
  wgDDL: yup.object().shape({
    label: yup.string().required("Workplace group is required"),
    value: yup.string().required("Workplace group is required"),
  }),
  wDDL: yup.object().shape({
    label: yup.string().required("Workplace is required"),
    value: yup.string().required("Workplace is required"),
  }),
  survayType: yup.object().shape({
    label: yup.string().required("survayType is required"),
    value: yup.string().required("survayType is required"),
  }),
  survayTitle: yup.string().required("Required Field"),
  survayDescription: yup.string().required("Required Field"),
  questions: yup.array().of(
    yup.object().shape({
      questionTitle: yup.string().required("Required Field"),
      questionType: yup.string().required("Required Field"),
      expectedAns: yup.string().required("Required Field"),
      ansTextLength: yup
        .string()
        .nullable()
        .when("questionType", {
          is: "text",
          then: yup.string().required("Length is required"),
          otherwise: yup.string().nullable(),
        }),
    })
  ),

  answers: yup.array().of(
    yup.object().shape({
      queId: yup.string().required("Question ID for answer is required"),
      answerDescription: yup.string().when("queId", {
        is: (queId: string) => queId && queId.length > 0,
        then: yup.string().required("Required Field"),
        otherwise: yup.string().nullable(),
      }),
    })
  ),
});

const QuestionCreationAddEdit = () => {
  // Router state
  const { quesId }: any = useParams();

  const dispatch = useDispatch();
  const history = useHistory();

  const { permissionList, profileData, businessUnitDDL } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { orgId } = profileData;

  const addLabelValue = (
    ddlArray: any[],
    labelField: string,
    valueField: string
  ) => {
    return ddlArray.map((item) => ({
      ...item,
      label: item[labelField],
      value: item[valueField],
    }));
  };

  //   states
  const [loading, setLoading] = useState(false);

  // menu permission
  let letterConfigPermission: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30444) {
      letterConfigPermission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // api states
  const workplaceGroupDDL: any = useApiRequest([]);
  const workplaceDDL = useApiRequest([]);

  const [survayTypeDDL, setSurvayTypeDDL] = useState([]);
  const [questionTypeDDL, setQuestionTypeDDL] = useState([]);
  const [singleData, setSingleData] = useState({});

  const ansDragEnd = (result: DropResult, values: any) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const temp = values.answers;
    const draged = temp.splice(source.index, 1);
    temp.splice(destination.index, 0, draged[0]);
  };

  const queDragEnd = (result: DropResult, values: any) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const reorderedQuestions = Array.from(values.questions);
    const [removed] = reorderedQuestions.splice(source.index, 1);
    reorderedQuestions.splice(destination.index, 0, removed);

    // Update Formik values with the new reordered questions
    setFieldValue("questions", reorderedQuestions);
  };

  const formData: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      survayDescription: "hi",
      questions: [],
      answers: [],
    },
    onSubmit: () => {},
  });
  const { values, setFieldValue, handleBlur, resetForm } = formData;

  useEffect(() => {
    getEnumData("QuestionnaireType", setSurvayTypeDDL);
    getEnumData("QuestionnaireQuestionType", setQuestionTypeDDL);
    quesId && getSingleQuestionnaire(quesId, setSingleData, setLoading);
  }, []);

  console.log(quesId);

  return letterConfigPermission?.isCreate ? (
    <PForm>
      <PCard>
        <PCardHeader
          title={quesId ? "Edit Question" : "Create Question"}
          backButton={true}
          buttonList={[
            {
              action: "submit",
              type: "primary",
              content: "Save",
              disabled: loading,
              onClick: () => {
                validationSchema
                  .validate(values)
                  .then(() => {
                    saveQuestionnaire(values, profileData, setLoading, () => {
                      resetForm();
                      history.push("/profile/exitInterview/questionCreation");
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    toast.warning("Please fill the required fields");
                  });
              },
            },
          ]}
        />
        {/* <Row gutter={[10, 2]}>
          <Col md={6} sm={24}>
            <PSelect
              options={
                addLabelValue(
                  businessUnitDDL,
                  "BusinessUnitName",
                  "BusinessUnitId"
                ) || []
              }
              name="buDDL"
              value={values?.buDDL}
              label="Business Unit"
              placeholder="Business Unit"
              onChange={(value: number, op) => {
                setFieldValue("buDDL", op);
                setFieldValue("wgDDL", null);
                setFieldValue("wDDL", null);
                getWorkplaceGroupDDL({
                  workplaceGroupDDL,
                  orgId,
                  buId: value,
                });
              }}
              rules={[{ required: true, message: "Required Field" }]}
            />
          </Col>

          <Col md={6} sm={24}>
            <PSelect
              options={workplaceGroupDDL?.data || []}
              name="wgDDL"
              label="Workplace Group"
              placeholder="Workplace Group"
              onChange={(value, op) => {
                setFieldValue("wgDDL", op);
                setFieldValue("wDDL", null);
                getWorkplaceDDL({
                  workplaceDDL,
                  orgId,
                  buId: values?.buId?.value,
                  wgId: value,
                });
              }}
              rules={[{ required: true, message: "Required Field" }]}
            />
          </Col>
          <Col md={6} sm={24}>
            <PSelect
              options={workplaceDDL?.data || []}
              name="wDDL"
              label="Workplace"
              placeholder="Workplace"
              onChange={(value, op) => {
                setFieldValue("wDDL", op);
              }}
              rules={[{ required: true, message: "Required Field" }]}
            />
          </Col>
        </Row> */}
        <Row gutter={[10, 2]}>
          <Col md={6} sm={24}>
            <PSelect
              options={survayTypeDDL || []}
              name="survayType"
              label="Survay Type"
              placeholder="Survay Type"
              onChange={(_: number, op) => {
                setFieldValue("survayType", op);
              }}
              rules={[{ required: true, message: "Required Field" }]}
            />
          </Col>

          <Col md={6} sm={24}>
            <PInput
              type="text"
              name="survayTitle"
              placeholder="Survay Title"
              label="Survay Title"
              onChange={(e) => {
                setFieldValue("survayTitle", e.target.value);
              }}
              rules={[{ required: true, message: "Required Field" }]}
            />
          </Col>
          <Col md={6} sm={24}>
            <PInput
              type="text"
              value={values?.survayDescription}
              name="survayDescription"
              placeholder="Survay Description"
              label="Survay Description"
              onChange={(e) => {
                setFieldValue("survayDescription", e.target.value);
              }}
              rules={[{ required: true, message: "Required Field" }]}
            />
          </Col>
        </Row>
        <div style={{ marginTop: "16px" }}>
          <FormikProvider value={formData}>
            <FieldArray name="questions">
              {({ push, remove, form }) => (
                <DragDropContext
                  onDragEnd={(result) => queDragEnd(result, values)}
                >
                  <Stack
                    direction="column"
                    spacing={2}
                    style={{ marginBottom: "20px" }}
                  >
                    <Droppable droppableId="AllQuestion">
                      {(queDropProvided) => (
                        <Stack
                          direction="column"
                          spacing={2}
                          ref={queDropProvided.innerRef}
                          {...queDropProvided.droppableProps}
                        >
                          {form.values.questions.map(
                            (question: any, index: number) => {
                              const questionType = `questions[${index}].questionType`;
                              const questionTitle = `questions[${index}].questionTitle`;
                              const expectedAns = `questions[${index}].expectedAns`;
                              const isRequired = `questions[${index}].isRequired`;
                              const isDraft = `questions[${index}].isDraft`;
                              const ansTextLength = `questions[${index}].ansTextLength`;

                              return (
                                <Draggable
                                  key={question.id}
                                  draggableId={question.id.toString()}
                                  index={index}
                                >
                                  {(queProvided) => (
                                    <div
                                      key={question.id}
                                      ref={queProvided.innerRef}
                                      {...queProvided.draggableProps}
                                    >
                                      <div
                                        style={{
                                          backgroundColor: "white",
                                          padding: "15px",
                                          width: "75%",
                                          border: `1px solid rgba(0, 0, 0, 0.12)`,
                                          boxShadow:
                                            "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12)",
                                          borderRadius: "4px",
                                        }}
                                      >
                                        <SingleQuestionnaire
                                          index={index}
                                          queProvided={queProvided}
                                          question={question}
                                          handleBlur={handleBlur}
                                          questionType={questionType}
                                          questionTitle={questionTitle}
                                          isRequired={isRequired}
                                          isDraft={isDraft}
                                          ansTextLength={ansTextLength}
                                          expectedAns={expectedAns}
                                          ansDragEnd={ansDragEnd}
                                          handleQuestionDelete={remove}
                                          values={form.values}
                                          setFieldValue={form.setFieldValue}
                                          errors={form.errors}
                                          touched={form.touched}
                                          setValues={form.setValues}
                                          questionTypeDDL={questionTypeDDL}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            }
                          )}

                          {queDropProvided.placeholder}
                        </Stack>
                      )}
                    </Droppable>
                    <div>
                      <PButton
                        type="primary"
                        content="Add Question"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          push({
                            id: uuid(),
                            questionTitle: "",
                            questionType: null,
                            ansType: null,
                            isRequired: false,
                            isDraft: false,
                            ansTextLength: "",
                          });
                        }}
                        icon={<PlusOutlined />}
                      />
                    </div>
                  </Stack>
                  {values.questions?.length > 0 && <Divider />}
                </DragDropContext>
              )}
            </FieldArray>
          </FormikProvider>
        </div>
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default QuestionCreationAddEdit;
