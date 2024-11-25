import Title from "antd/lib/typography/Title";
import React from "react";
import Question from "./question";

const QuestionsGroup = ({
  group,
  options,
  groupNo,
  handleSelectOption,
  disabled,
}) => {
  const { groupName, questions } = group;

  return (
    <div className=" mb-4">
      <Title level={5}>{groupName}</Title>
      <div className="container overflow-hidden ml-4">
        <div className="row mx-auto">
          {questions?.length > 0 &&
            questions.map((question, quesIdx) => (
              <Question
                key={quesIdx + 1}
                question={question}
                options={options}
                questionNo={quesIdx + 1}
                handleSelectOption={handleSelectOption}
                disabled={disabled}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsGroup;
