import ClearIcon from "@mui/icons-material/Clear";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { InputAdornment, Stack, TextField } from "@mui/material";
import { Col, Row } from "antd";
import { PButton, PInput } from "Components";
import { ErrorMessage, Field, FieldArray } from "formik";
import { Draggable, Droppable } from "react-beautiful-dnd";
import uuid from "utility/uuid";

const SingleAnswer = ({ question, handleBlur, touched }: any) => {
  return (
    <Stack direction="column">
      <FieldArray name="answers">
        {({ push, remove, form }) => (
          <Stack direction="column" spacing={2}>
            <Droppable droppableId="AllAnswers">
              {(provided) => (
                <Stack
                  direction="column"
                  spacing={2}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {form.values.answers.map((answer: any, index: number) => {
                    const newAnswer = `answers[${index}].answerDescription`;

                    if (answer.queId === question.id) {
                      return (
                        <Draggable
                          key={answer.id}
                          draggableId={answer.id.toString()}
                          index={index}
                        >
                          {(dragProvided) => (
                            <div
                              className="pb-1 mb-1"
                              key={answer.id}
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                            >
                              {/* <Row>
                                <Col>
                                  <DragIndicatorIcon
                                    style={{
                                      cursor: "move",
                                    }}
                                    fontSize="small"
                                  />
                                </Col>
                                <Col>
                                  <PInput
                                    type="text"
                                    name={newAnswer}
                                    value={answer.answerDescription}
                                    onBlur={handleBlur}
                                    placeholder={`Option ${index + 1}`}
                                    // onChange={(value: any) =>
                                    //   setFieldValue(`${newQuestion}`, value)
                                    // }
                                    rules={[
                                      {
                                        required: true,
                                        message: "Required Field",
                                      },
                                    ]}
                                  />
                                </Col>
                              </Row> */}
                              <Field
                                as={TextField}
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                name={newAnswer}
                                value={answer.answerDescription}
                                onBlur={handleBlur}
                                touched={touched}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <DragIndicatorIcon
                                        style={{
                                          cursor: "move",
                                        }}
                                        fontSize="small"
                                      />
                                    </InputAdornment>
                                  ),
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <ClearIcon
                                        style={{
                                          cursor: "pointer",
                                        }}
                                        onClick={() => remove(index)}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                              />

                              <ErrorMessage
                                name={newAnswer}
                                component={"Required Field"}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    } else {
                      return null;
                    }
                  })}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>

            <PButton
              type="primary"
              content="Add Option"
              onClick={() =>
                push({
                  id: uuid(),
                  queId: question.id,
                  answerDescription: "",
                })
              }
            />
          </Stack>
        )}
      </FieldArray>
    </Stack>
  );
};

export default SingleAnswer;
