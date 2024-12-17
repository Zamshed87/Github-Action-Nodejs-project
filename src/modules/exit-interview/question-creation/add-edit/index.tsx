/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/*
 * Title: Exit interview add and edit
 * Author: Khurshida Meem
 * Date: 12-11-2024
 *
 */
import { Col, Form, Row, Tag } from "antd";
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
import { getEnumData } from "common/api/commonApi";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import SingleQuestionnaire from "./SingleQuestionnaire";
import { PlusOutlined } from "@ant-design/icons";
import { initDataForEdit, saveQuestionnaire } from "./helper";
import { toast } from "react-toastify";
import { getChipData, getSingleQuestionnaire } from "../helper";
import Loading from "common/loading/Loading";

const QuestionCreationAddEdit = () => {
  // Router state
  const { quesId }: any = useParams();

  const dispatch = useDispatch();

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

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

  const [survayTypeDDL, setSurvayTypeDDL] = useState([]);
  const [questionTypeDDL, setQuestionTypeDDL] = useState([]);
  const [singleData, setSingleData] = useState<any>({});

  const [antForm] = Form.useForm();

  const ansDragEnd = (result: DropResult, values: any) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    // const temp = values?.answers;
    const draged = values.splice(source.index, 1);
    values.splice(destination.index, 0, draged[0]);
  };

  const queDragEnd = (result: DropResult, values: any) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const reorderedQuestions = Array.from(values);
    const [removed] = reorderedQuestions.splice(source.index, 1);
    reorderedQuestions.splice(destination.index, 0, removed);

    // Update Formik values with the new reordered questions
    antForm.setFieldValue("questions", reorderedQuestions);
  };

  useEffect(() => {
    getEnumData("QuestionnaireType", setSurvayTypeDDL);
    getEnumData("QuestionnaireQuestionType", setQuestionTypeDDL);
    quesId && getSingleQuestionnaire(quesId, setSingleData, setLoading);
  }, []);
  useEffect(() => {
    if (quesId) {
      const initData = initDataForEdit(singleData);
      antForm.setFieldsValue(initData);
    }
  }, [singleData]);

  return letterConfigPermission?.isCreate ? (
    <PForm
      form={antForm}
      initialValues={{
        survayType: null,
        survayTitle: "",
        survayDescription: "",
        questions: [],
      }}
    >
      {loading && <Loading />}
      <PCard>
        <PCardHeader
          title={
            <Flex align="center">
              <div>{quesId ? "Edit Question" : "Create Question"}</div>
              {quesId && !loading && (
                <Tag
                  style={{
                    borderRadius: "50px",
                    fontWeight: 600,
                    marginLeft: "8px",
                  }}
                  className={`${getChipData(singleData?.status)?.class}`}
                >
                  {getChipData(singleData?.status)?.label}
                </Tag>
              )}
            </Flex>
          }
          // title={quesId ? "Edit Question" : "Create Question"}
          backButton={true}
          buttonList={[
            {
              action: "submit",
              type: "primary",
              content: "Save",
              disabled: loading,
              onClick: () => {
                const values = antForm.getFieldsValue(true);
                antForm
                  .validateFields()
                  .then(() => {
                    saveQuestionnaire(
                      quesId,
                      values,
                      profileData,
                      setLoading,
                      () => {
                        antForm.resetFields();
                      }
                    );
                  })
                  .catch(() => {
                    toast.warning("Please fill the required fields");
                  });
              },
            },
          ]}
        />
        <Row gutter={[10, 2]}>
          <Col md={6} sm={24}>
            <PSelect
              options={survayTypeDDL || []}
              name="survayType"
              label="Survey Type"
              placeholder="Survey Type"
              onChange={(_: number, op) => {
                antForm.setFieldValue("survayType", op);
              }}
              rules={[{ required: true, message: "Required Field" }]}
            />
          </Col>

          <Col md={6} sm={24}>
            <PInput
              type="text"
              name="survayTitle"
              placeholder="Survey Title"
              label="Survey Title"
              onChange={(e) => {
                antForm.setFieldValue("survayTitle", e.target.value);
              }}
              rules={[{ required: true, message: "Required Field" }]}
            />
          </Col>
          <Col md={6} sm={24}>
            <PInput
              type="text"
              name="survayDescription"
              placeholder="Survey Description"
              label="Survey Description"
              onChange={(e) => {
                antForm.setFieldValue("survayDescription", e.target.value);
              }}
              rules={[{ required: true, message: "Required Field" }]}
            />
          </Col>
        </Row>
        <div style={{ marginTop: "16px" }}>
          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <DragDropContext
                onDragEnd={(result) =>
                  queDragEnd(result, antForm.getFieldValue("questions"))
                }
              >
                <Droppable droppableId="AllQuestion">
                  {(queDropProvided) => (
                    <div
                      ref={queDropProvided.innerRef}
                      {...queDropProvided.droppableProps}
                    >
                      {fields.map((field, index) => (
                        <Draggable
                          key={index}
                          draggableId={index.toString()}
                          index={index}
                        >
                          {(queProvided) => (
                            <div
                              className="mt-3"
                              key={index}
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
                                  field={field}
                                  ansDragEnd={ansDragEnd}
                                  handleQuestionDelete={remove}
                                  Form={Form}
                                  questionTypeDDL={questionTypeDDL}
                                  antForm={antForm}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {queDropProvided.placeholder}
                    </div>
                  )}
                </Droppable>
                <div className="mt-3">
                  <PButton
                    type="primary"
                    content="Add Question"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      add();
                    }}
                    icon={<PlusOutlined />}
                  />
                </div>
              </DragDropContext>
            )}
          </Form.List>
        </div>
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default QuestionCreationAddEdit;
