import { DeleteOutlined, DragIndicator } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { Col, Divider, Row, Switch } from "antd";
import { Flex, PButton, PInput, PSelect } from "Components";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { PlusOutlined } from "@ant-design/icons";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const SingleQuestionnaire = ({
  index,
  queProvided,
  field,
  ansDragEnd,
  handleQuestionDelete,
  Form,
  questionTypeDDL,
  antForm,
}: any) => {
  return (
    <Stack direction="column">
      <div>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack
            style={{ marginTop: "-20px" }}
            direction="row"
            alignItems="center"
          >
            <span {...queProvided.dragHandleProps}>
              <DragIndicator
                style={{
                  cursor: "move",
                  marginRight: "5px",
                }}
                fontSize="small"
              />
            </span>

            <div>
              <p
                style={{
                  border: "1px solid black",
                  borderRadius: "50px",
                  padding: "4px 10px",
                }}
              >
                {index + 1}
              </p>
            </div>
          </Stack>
          <div className="d-flex justify-content-center align-items-center ">
            <IconButton
              style={{ marginTop: "-25px" }}
              onClick={() => {
                handleQuestionDelete(field.name);
              }}
            >
              <DeleteOutlined />
            </IconButton>

            <div className="mr-3" style={{ marginTop: "-20px" }}>
              <div style={{ border: "1px solid rgba(0, 0, 0, 0.12)" }}>
                <hr style={{ margin: "12px 0" }} />
              </div>
            </div>

            <Flex>
              <div>
                <Form.Item
                  name={[field.name, "isRequired"]}
                  valuePropName="checked"
                  shouldUpdate
                >
                  <Switch size="small" />
                </Form.Item>
              </div>
              <p style={{ margin: "8px 0 0 4px" }}>Required</p>
            </Flex>

            {/*  */}
            <div className="mx-3" style={{ marginTop: "-20px" }}>
              <div style={{ border: "1px solid rgba(0, 0, 0, 0.12)" }}>
                <hr style={{ margin: "12px 0" }} />
              </div>
            </div>

            <Form.Item
              name={[field.name, "isDraft"]}
              valuePropName="checked"
              shouldUpdate
            >
              <PInput
                label="Save as Template?"
                type="checkbox"
                layout="horizontal"
              />
            </Form.Item>
          </div>
        </Stack>
        <Divider style={{ margin: "-10px 0 0 0" }} />
      </div>

      <div className="row pl-3">
        <div className="col-12 col-md-4 py-0 my-0 pl-0">
          <Form.Item name={[field.name, "questionType"]} shouldUpdate>
            <PSelect
              placeholder="Question Type"
              label="Question type"
              options={questionTypeDDL || []}
            />
          </Form.Item>
        </div>
        <div className="col-12 col-md-4 py-0 my-0 pl-0">
          <Form.Item name={[field.name, "questionTitle"]} shouldUpdate>
            <PInput
              type="text"
              placeholder="Question Title"
              label="Question Title"
            />
          </Form.Item>
        </div>

        <div className="col-12 col-md-4 py-0 my-0 pl-0 md-pr-0">
          <Form.Item name={[field.name, "expectedAns"]} shouldUpdate>
            <PInput
              type="text"
              placeholder="Expected Answer"
              label="Expected Answer"
            />
          </Form.Item>
        </div>
      </div>

      <Form.Item shouldUpdate noStyle>
        {() => {
          const quesData = antForm.getFieldValue(`questions`);
          const questionType = quesData[index]?.questionType;
          return ["0", "1", "2"].includes(questionType) ? (
            <Form.List name={[field.name, "answers"]}>
              {(subFields: any, subOpt: any) => (
                <DragDropContext
                  onDragEnd={(result) =>
                    ansDragEnd(result, quesData[index]?.answers)
                  }
                >
                  <Stack direction="column">
                    <Droppable droppableId="AllAnswers">
                      {(provided) => (
                        <Stack
                          direction="column"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {subFields?.map((subField: any, subIdx: number) => (
                            <Draggable
                              key={subIdx}
                              draggableId={subIdx.toString()}
                              index={subIdx}
                            >
                              {(dragProvided) => (
                                <div
                                  key={subIdx}
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                >
                                  <Row>
                                    <Col>
                                      <span {...dragProvided.dragHandleProps}>
                                        <DragIndicator
                                          style={{
                                            cursor: "move",
                                          }}
                                          fontSize="small"
                                        />
                                      </span>
                                    </Col>
                                    <Col md={12}>
                                      <Form.Item
                                        name={[
                                          subField.name,
                                          "answerDescription",
                                        ]}
                                        shouldUpdate
                                      >
                                        <PInput
                                          type="text"
                                          placeholder={`Option ${subIdx + 1}`}
                                          rules={[
                                            {
                                              required: true,
                                              message: "Required Field",
                                            },
                                          ]}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col md={4}>
                                      <RemoveCircleIcon
                                        sx={{
                                          marginLeft: "8px",
                                          mt: 1,
                                          fontSize: "20px",
                                          color: "var(--error)",
                                        }}
                                        className="pointer"
                                        onClick={() => subOpt.remove(subIdx)}
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Stack>
                      )}
                    </Droppable>

                    <PButton
                      onClick={() => {
                        subOpt.add();
                      }}
                      type="primary"
                      content="Add Option"
                      icon={<PlusOutlined />}
                    />
                  </Stack>
                </DragDropContext>
              )}
            </Form.List>
          ) : (
            ["3", "4"].includes(questionType) && (
              <Row>
                <Col md={8}>
                  <Form.Item name={[field.name, "ansTextLength"]} shouldUpdate>
                    <PInput
                      type="number"
                      placeholder="Max length"
                      label="Maximum length of answer"
                      rules={[
                        {
                          required: true,
                          message: "Required Field",
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )
          );
        }}
      </Form.Item>
    </Stack>
  );
};

export default SingleQuestionnaire;
