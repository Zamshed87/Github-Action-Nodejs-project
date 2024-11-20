import { QuestionCircleOutlined, QuestionOutlined } from "@ant-design/icons";
import SingleInfo from "common/SingleInfo";
import { PInput, PRadio, PSelect } from "Components";
import React from "react";
import ReactQuill from "react-quill";

const QuestionaireView = ({ singleData }: any) => {
  const { type, title, description, questions } = singleData;

  const getValueLabel = (dataArr: any) => {
    return dataArr?.map((item: any) => ({
      value: item.optionName,
      label: item.optionName,
    }));
  };
  return (
    <div>
      <>
        <SingleInfo label={"Questionaire Type"} value={type || "N/A"} />
        <SingleInfo label={"Questionaire Title"} value={title || "N/A"} />
        <SingleInfo
          label={"Questionaire Description"}
          value={description || "N/A"}
        />
      </>
      <div style={{ marginTop: "10px" }}>
        <h2>
          <QuestionCircleOutlined style={{ fontSize: "16px" }} /> Application
          Questions
        </h2>
        {questions?.map((data: any, index: number) => (
          <div className="mt-2" key={index}>
            <h1>
              {index + 1}. {data?.title}
            </h1>
            {data?.typeId === 0 && (
              <PRadio type="group" options={getValueLabel(data?.options)} />
            )}
            {data?.typeId === 1 &&
              getValueLabel(data?.options)?.map((checkDto: any) => (
                <PInput
                  key={checkDto?.label}
                  type="checkbox"
                  layout="horizontal"
                  label={checkDto?.label}
                />
              ))}
            {data?.typeId === 2 && (
              <PSelect
                style={{ maxWidth: "250px" }}
                options={getValueLabel(data?.options) || []}
                placeholder="Select"
              />
            )}
            {data?.typeId === 3 && (
              <div style={{ maxWidth: "250px" }}>
                <PInput type="text" placeholder="Text" />
              </div>
            )}
            {data?.typeId === 4 && (
              <ReactQuill preserveWhitespace={true} placeholder="Write..." />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionaireView;
