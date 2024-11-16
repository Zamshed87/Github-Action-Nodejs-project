import { DeleteOutlined, DragIndicator } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { Divider, Switch } from "antd";
import { Flex, PInput, PSelect } from "Components";
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import SingleAnswer from "./singleAnswer";

const SingleQuestionnaire = ({
  index,
  queProvided,
  question,
  handleBlur,
  newQuestion,
  newQuestionType,
  newRequired,
  ansDragEnd,
  handleQuestionDelete,
  values,
  setFieldValue,
  touched,
  setValues,
}: any) => {
  return (
    <Stack direction="column" spacing={2}>
      <div>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <span {...queProvided.dragHandleProps}>
              <DragIndicator
                style={{
                  cursor: "move",
                }}
                fontSize="small"
              />
            </span>

            <div className="circle_title">
              <IconButton className="circle_title_icon">
                <p className="para_sm">{index + 1}</p>
              </IconButton>
            </div>
          </Stack>
          <div className="d-flex justify-content-center align-items-center ">
            <IconButton
              className="circle_title_icon_borderless"
              onClick={() => {
                setValues({
                  ...values,
                  answers: values.answers.filter(
                    (item: any) =>
                      item.queId.toString() !== question.id.toString()
                  ),
                });
                handleQuestionDelete(index);
              }}
            >
              <DeleteOutlined />
            </IconButton>

            <div className="mr-4">
              <div style={{ border: "1px solid rgba(0, 0, 0, 0.12)" }}>
                <hr />
              </div>
            </div>

            <Flex>
              <Switch
                size="small"
                checked={question?.isRequired}
                onChange={(value: any) =>
                  setFieldValue(`${newRequired}`, value)
                }
              />
              <p>Required</p>
            </Flex>
          </div>
        </Stack>
        <Divider />
      </div>

      <div className="row">
        <div className="col-12 col-sm-12 col-md-8 py-0 my-0 pl-0">
          <PInput
            type="text"
            value={question?.questionTitle}
            name={newQuestion}
            placeholder="Write your question"
            label="Write your question"
            onChange={(value: any) => setFieldValue(`${newQuestion}`, value)}
            rules={[{ required: true, message: "Required Field" }]}
          />
        </div>

        <div className="col-12 col-sm-12 col-md-4 py-0 my-0 pl-0 md-pr-0">
          <PSelect
            placeholder="Survay Type"
            name={newQuestionType}
            label="Question type"
            value={question.questionType}
            options={[
              { value: "select", label: "Dropdown" },
              { value: "text", label: "Text" },
              { value: "radio", label: "Radio Button" },
              { value: "checkbox", label: "Checkbox" },
              { value: "file", label: "File" },
            ]}
            onChange={(value: any) => {
              setFieldValue(`${newQuestionType}`, value);
            }}
            rules={[{ required: true, message: "Required Field" }]}
          />
        </div>
      </div>

      {question.questionType &&
        (question.questionType === "checkbox" ||
          question.questionType === "radio" ||
          question.questionType === "select") && (
          <DragDropContext onDragEnd={(result) => ansDragEnd(result, values)}>
            <SingleAnswer
              question={question}
              handleBlur={handleBlur}
              touched={touched}
            />
          </DragDropContext>
        )}
    </Stack>
  );
};

export default SingleQuestionnaire;
