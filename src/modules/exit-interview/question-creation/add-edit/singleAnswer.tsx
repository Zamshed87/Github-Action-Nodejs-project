import { PlusOutlined } from "@ant-design/icons";
import ClearIcon from "@mui/icons-material/Clear";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { InputAdornment, Stack, TextField } from "@mui/material";
import { Col, Row } from "antd";
import { PButton, PInput } from "Components";
import { ErrorMessage, Field, FieldArray } from "formik";
import { Draggable, Droppable } from "react-beautiful-dnd";
import uuid from "utility/uuid";

const SingleAnswer = ({ antForm, Form, subFields, subOpt }: any) => {
  return (
    <Stack direction="column" spacing={2}>
      <Droppable droppableId="AllAnswers">
        {(provided) => (
          <Stack
            direction="column"
            spacing={2}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {subFields?.map((subField: any, subIdx: number) => {
              <Draggable
                key={subIdx}
                draggableId={subIdx.toString()}
                index={subIdx}
              >
                {(dragProvided) => (
                  <div
                    className="pb-1 mb-1"
                    key={subIdx}
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    <Row>
                      <Col>
                        <DragIndicatorIcon
                          style={{
                            cursor: "move",
                          }}
                          fontSize="small"
                        />
                      </Col>
                      <Col>
                        <Form.Item name={[subFields.name, "answerDescription"]}>
                          <PInput
                            type="text"
                            placeholder="Option"
                            label=""
                            rules={[
                              { required: true, message: "Required Field" },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )}
              </Draggable>;
            })}
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
  );
};

export default SingleAnswer;
