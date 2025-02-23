import {
  KeyboardArrowDown as ArrowDownIcon,
  CheckBoxOutlineBlank as BlankCheckboxIcon,
  CheckBox as CheckedCheckboxIcon,
  RadioButtonChecked as CheckedIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from "@mui/icons-material";
import { Descriptions, Divider, List, Space, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { getQuestionaireById } from "../helper";

const { Title, Text } = Typography;

export default function ExitInterviewDataView({ id, empId, questionId }) {
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState({});

  useEffect(() => {
    getQuestionaireById(questionId, setSingleData, setLoading);
  }, [id, empId]);

  const isExistForCheckbox = (op, opArr) => opArr?.includes(op);

  const QuesType = (qType) => {
    switch (qType) {
      case "Radio Button":
        return "Single Choice";
      case "Textbox":
        return "Short Answer";
      case "Checkbox":
        return "Multiple Choice (Select All That Apply)";
      case "Drop-Down List":
        return "Selected From the List";
      default:
        return "Detailed Response (Rich Text)";
    }
  };

  return (
    <>
      {/* Interview Details */}
      <Descriptions column={2} bordered size="small">
        <Descriptions.Item label="Interview Type">
          {singleData?.typeName}
        </Descriptions.Item>
        <Descriptions.Item label="Interview Title">
          {singleData?.title}
        </Descriptions.Item>
        <Descriptions.Item label="Description" span={3}>
          {singleData?.description}
        </Descriptions.Item>
        <Descriptions.Item label="Start Time">
          {moment(singleData?.startDateTime).format("hh:mm:ss A")}
        </Descriptions.Item>
        <Descriptions.Item label="End Time">
          {moment(singleData?.endDateTime).format("hh:mm:ss A")}
        </Descriptions.Item>
      </Descriptions>

      <Divider>Answers</Divider>

      {/* Questions & Answers */}
      <List
        dataSource={singleData?.questions || []}
        renderItem={(ques, index) => (
          <List.Item key={index}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text strong>
                {index + 1}. {ques?.title}{" "}
                {ques?.isRequired && <Text type="danger"> *</Text>}
              </Text>
              <Text type="secondary">{QuesType(ques?.typeName)}</Text>

              {/* Handle Different Question Types */}
              {ques?.typeName === "Radio Button" &&
                ques?.options?.map((op, idx) => (
                  <Space key={idx} align="center">
                    {ques?.responseAnswer[0] === op?.optionName ? (
                      <CheckedIcon style={{ color: "green" }} />
                    ) : (
                      <UncheckedIcon style={{ color: "gray" }} />
                    )}
                    <Text
                      style={{
                        fontWeight:
                          ques?.responseAnswer[0] === op?.optionName
                            ? 500
                            : "normal",
                        color:
                          ques?.responseAnswer[0] === op?.optionName
                            ? "green"
                            : "black",
                      }}
                    >
                      {op.optionName}
                    </Text>
                  </Space>
                ))}

              {ques?.typeName === "Textbox" && (
                <Text>{ques?.responseAnswer[0]}</Text>
              )}

              {ques?.typeName === "Checkbox" &&
                ques?.options?.map((op, idx) => (
                  <Space key={idx} align="center">
                    {isExistForCheckbox(
                      op?.optionName,
                      ques?.responseAnswer
                    ) ? (
                      <CheckedCheckboxIcon style={{ color: "green" }} />
                    ) : (
                      <BlankCheckboxIcon style={{ color: "gray" }} />
                    )}
                    <Text
                      style={{
                        fontWeight: isExistForCheckbox(
                          op?.optionName,
                          ques?.responseAnswer
                        )
                          ? 500
                          : "normal",
                        color: isExistForCheckbox(
                          op?.optionName,
                          ques?.responseAnswer
                        )
                          ? "green"
                          : "black",
                      }}
                    >
                      {op.optionName}
                    </Text>
                  </Space>
                ))}

              {ques?.typeName === "Drop-Down List" &&
                ques?.options?.map((op, idx) => (
                  <Space key={idx} align="center">
                    <ArrowDownIcon
                      style={{
                        color:
                          ques?.responseAnswer[0] === op?.optionName
                            ? "green"
                            : "gray",
                      }}
                    />
                    <Text
                      style={{
                        fontWeight:
                          ques?.responseAnswer[0] === op?.optionName
                            ? 500
                            : "normal",
                        color:
                          ques?.responseAnswer[0] === op?.optionName
                            ? "green"
                            : "black",
                      }}
                    >
                      {op.optionName}
                    </Text>
                  </Space>
                ))}

              {ques?.typeName === "Rich Textbox" && (
                <div style={{ overflow: "auto", width: "100%" }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: ques?.responseAnswer[0],
                    }}
                  />
                </div>
              )}
            </Space>
          </List.Item>
        )}
      />
    </>
  );
}
