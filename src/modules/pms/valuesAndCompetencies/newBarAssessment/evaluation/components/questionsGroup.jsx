import Title from "antd/lib/typography/Title";
import Question from "./question";

const QuestionsGroup = ({
  group,
  scales,
  handleSelectOption,
  getSelectedAnswer
}) => {
  const { name, questions } = group;

  return (
    <div className=" mb-4">
      <Title level={5}>{name}</Title>
      <div className="container overflow-hidden ml-4">
        <div className="row mx-auto">
          {questions?.length > 0 &&
            questions.map((question, quesIdx) => (
              <Question
                key={quesIdx + 1}
                question={question}
                scales={scales}
                questionNo={quesIdx + 1}
                handleSelectOption={handleSelectOption}
                getSelectedAnswer={getSelectedAnswer}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsGroup;
