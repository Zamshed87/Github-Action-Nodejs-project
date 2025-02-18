import { Flex } from "Components";
import React, { useEffect, useState } from "react";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Divider } from "antd";
import moment from "moment";
import { getQuestionaireById } from "../helper";

export default function ExitInterviewDataView({ id, empId, questionId }) {
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState({});
  useEffect(() => {
    getQuestionaireById(questionId, setSingleData, setLoading);
  }, [id, empId]);

  const isExistForCheckbox = (op, opArr) => {
    for (let i = 0; i < opArr?.length; i++) {
      if (opArr[i] === op) {
        return true;
      }
    }
    return false;
  };

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
    <div>
      <div style={{ fontSize: "12px" }}>
        <div>
          Interview Type :{" "}
          <span style={{ fontWeight: "500" }}>{singleData?.typeName}</span>
        </div>
        <div>
          Interview Title :{" "}
          <span style={{ fontWeight: "500" }}>{singleData?.title}</span>
        </div>
        <div>
          Description :{" "}
          <span style={{ fontWeight: "500" }}>{singleData?.description}</span>
        </div>
        <div>
          Start Time :{" "}
          <span style={{ fontWeight: "500" }}>
            {moment(singleData?.startDateTime).format("hh:mm:ss A")}
          </span>
        </div>
        <div>
          End Time :{" "}
          <span style={{ fontWeight: "500" }}>
            {moment(singleData?.endDateTime).format("hh:mm:ss A")}
          </span>
        </div>
      </div>
      <Divider style={{ margin: 0 }}>Answers</Divider>
      <div className="mt-2 mx-3">
        <ol>
          {singleData?.questions?.map((ques, index) => (
            <li className="mt-2" key={index}>
              <p style={{ fontSize: "14px" }}>
                {ques?.title}
                {ques?.isRequired && <span style={{ color: "red" }}> *</span>}
              </p>
              <small className="mb-2" style={{ fontSize: "12px" }}>
                {QuesType(ques?.typeName)}
              </small>
              {ques?.typeName === "Radio Button" &&
                ques?.options?.map((op, index) => (
                  <Flex align="center" key={index}>
                    <div>
                      {ques?.responseAnswer[0] === op?.optionName ? (
                        <RadioButtonCheckedIcon
                          sx={{ fontSize: "12px", color: "green" }}
                        />
                      ) : (
                        <RadioButtonUncheckedIcon
                          sx={{ fontSize: "12px", color: "green" }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        fontWeight:
                          ques?.responseAnswer[0] === op?.optionName ? 500 : "",
                        color:
                          ques?.responseAnswer[0] === op?.optionName
                            ? "green"
                            : "",
                      }}
                      className="ml-2"
                    >
                      {op.optionName}
                    </div>
                  </Flex>
                ))}
              {ques?.typeName === "Textbox" && (
                <div className="mt-1">{ques?.responseAnswer[0]}</div>
              )}
              {ques?.typeName === "Checkbox" &&
                ques?.options?.map((op, index) => (
                  <Flex align="center" key={index}>
                    <div>
                      {isExistForCheckbox(
                        op?.optionName,
                        ques?.responseAnswer
                      ) ? (
                        <CheckBoxIcon
                          sx={{ fontSize: "12px", color: "green" }}
                        />
                      ) : (
                        <CheckBoxOutlineBlankIcon
                          sx={{ fontSize: "14px", color: "green" }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        fontWeight: isExistForCheckbox(
                          op?.optionName,
                          ques?.responseAnswer
                        )
                          ? 500
                          : "",
                        color: isExistForCheckbox(
                          op?.optionName,
                          ques?.responseAnswer
                        )
                          ? "green"
                          : "",
                      }}
                      className="ml-2"
                    >
                      {op.optionName}
                    </div>
                  </Flex>
                ))}
              {ques?.typeName === "Drop-Down List" &&
                ques?.options?.map((op, index) => (
                  <Flex align="center" key={index}>
                    <div>
                      <KeyboardArrowDownIcon
                        sx={{
                          fontSize: "12px",
                          color:
                            ques?.responseAnswer[0] === op?.optionName
                              ? "green"
                              : "",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontWeight:
                          ques?.responseAnswer[0] === op?.optionName ? 500 : "",
                        color:
                          ques?.responseAnswer[0] === op?.optionName
                            ? "green"
                            : "",
                      }}
                      className="ml-2"
                    >
                      {op.optionName}
                    </div>
                  </Flex>
                ))}
              {ques?.typeName === "Rich Textbox" && (
                <div style={{ overflow: "scroll" }} className="mt-1 w-100">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: ques?.responseAnswer[0],
                    }}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
