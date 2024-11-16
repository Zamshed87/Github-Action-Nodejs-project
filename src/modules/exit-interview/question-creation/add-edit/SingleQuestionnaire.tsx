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
  questionType,
  questionTitle,
  isRequired,
  isDraft,
  ansType,
  ansDragEnd,
  handleQuestionDelete,
  values,
  setFieldValue,
  touched,
  setValues,
  questionSet,
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

            <div className="mr-3">
              <div style={{ border: "1px solid rgba(0, 0, 0, 0.12)" }}>
                <hr />
              </div>
            </div>

            <Flex>
              <Switch
                size="small"
                checked={question?.isRequired}
                onChange={(value: any) => setFieldValue(`${isRequired}`, value)}
              />
              <p className="ml-2">Required</p>
            </Flex>

            <div className="mx-3">
              <div style={{ border: "1px solid rgba(0, 0, 0, 0.12)" }}>
                <hr />
              </div>
            </div>
            <PInput
              checked={question?.isDraft}
              label="Save as draft?"
              type="checkbox"
              name={question?.isDraft}
              layout="horizontal"
              onChange={(e) => {
                setFieldValue(`${isDraft}`, e.target.checked);
              }}
            />
          </div>
        </Stack>
        <Divider style={{ margin: 0 }} />
      </div>

      <div className="row">
        <div className="col-12 col-md-4 py-0 my-0 pl-0">
          <PSelect
            placeholder="Question Type"
            name={`questions[${index}].questionType`}
            label="Question type"
            value={question.questionType}
            options={[
              { value: "exit", label: "Exit Interview" },
              { value: "training", label: "Training Assessment" },
            ]}
            onChange={(value: any) => {
              setFieldValue(`questions[${index}].questionType`, value);
            }}
          />
        </div>
        <div className="col-12 col-md-4 py-0 my-0 pl-0">
          <PInput
            type="text"
            value={question?.questionTitle}
            name={question?.questionTitle}
            placeholder="Question Title"
            label="Question Title"
            onChange={(value: any) => setFieldValue(`${questionTitle}`, value)}
            rules={[{ required: true, message: "Required Field" }]}
          />
        </div>

        <div className="col-12 col-md-4 py-0 my-0 pl-0 md-pr-0">
          <PSelect
            placeholder="Answer Type"
            name={question.ansType}
            label="Answer type"
            value={question.ansType}
            options={[
              { value: "select", label: "Dropdown List" },
              { value: "text", label: "Text Box" },
              { value: "radio", label: "Radio Button" },
              { value: "checkbox", label: "Checkbox" },
            ]}
            onChange={(value: any) => {
              setFieldValue(`${question.ansType}`, value);
            }}
            rules={[{ required: true, message: "Required Field" }]}
          />
        </div>
      </div>

      {question.ansType &&
        (question.ansType === "checkbox" ||
          question.ansType === "radio" ||
          question.ansType === "select") && (
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
