/*
 * Title: Exit interview add and edit
 * Author: Khurshida Meem
 * Date: 12-11-2024
 *
 */
import { Col, Divider, Form, Row } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  Flex,
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getWorkplaceDDL, getWorkplaceGroupDDL } from "common/api/commonApi";
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

const validationSchema = yup.object({
  questions: yup.array().of(
    yup.object().shape({
      questionTitle: yup.string().required("Question is required!"),
      questionType: yup.object().required("Question type is required"),
    })
  ),
  answers: yup.array().of(
    yup.object().shape({
      answerDescription: yup.string().required("Please write the option!"),
    })
  ),
});

const QuestionCreationAddEdit = () => {
  // Router state
  const { quesId }: any = useParams();

  const dispatch = useDispatch();

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
    const temp = values.questions;
    const draged = temp.splice(source.index, 1);
    temp.splice(destination.index, 0, draged[0]);
  };

  const formData: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      questions: [],
      answers: [],
      keyWordList: [],
    },
    // initialValues: initialData(),
    // validationSchema,
    onSubmit: () => {
      // saveHandler(values, () => {
      //   setIsDraft(false);
      // });
    },
  });
  const {
    values,
    setFieldValue,
    handleSubmit,
    handleBlur,
    resetForm,
    setValues,
  } = formData;

  console.log(values);

  return letterConfigPermission?.isCreate ? (
    <form onSubmit={handleSubmit}>
      <PForm>
        <PCard>
          <PCardHeader
            title={quesId ? "Edit Question" : "Create Question"}
            backButton={true}
            buttonList={[
              {
                type: "primary",
                content: "Save",
                icon: "plus",
                disabled: loading,
                onClick: () => {
                  // const values = form.getFieldsValue(true);
                },
              },
            ]}
          />
          <Row gutter={[10, 2]}>
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
          </Row>
          <Row gutter={[10, 2]}>
            <Col md={6} sm={24}>
              <PSelect
                options={[]}
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
                rules={[{ required: true, message: "Required Field" }]}
              />
            </Col>
            <Col md={6} sm={24}>
              <PInput
                type="text"
                name="survayDescription"
                placeholder="Survay Description"
                label="Survay Description"
                rules={[{ required: true, message: "Required Field" }]}
              />
            </Col>
          </Row>
          <div>
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
                      {/* @ts-ignore */}
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
                                const newQuestion = `questions[${index}].questionTitle`;
                                const newQuestionType = `questions[${index}].questionType`;
                                const newRequired = `questions[${index}].isRequired`;

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
                                        // {...queProvided.dragHandleProps}
                                      >
                                        <div
                                          style={{
                                            backgroundColor: "white",
                                            padding: "15px",
                                            margin: "8px 8px 8px 0",
                                            width: "80%",
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
                                            newQuestion={newQuestion}
                                            newQuestionType={newQuestionType}
                                            newRequired={newRequired}
                                            ansDragEnd={ansDragEnd}
                                            handleQuestionDelete={remove}
                                            values={form.values}
                                            setFieldValue={form.setFieldValue}
                                            errors={form.errors}
                                            touched={form.touched}
                                            setValues={form.setValues}
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
                              questionType: "",
                            });
                          }}
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
    </form>
  ) : (
    <NotPermittedPage />
  );
};

export default QuestionCreationAddEdit;
