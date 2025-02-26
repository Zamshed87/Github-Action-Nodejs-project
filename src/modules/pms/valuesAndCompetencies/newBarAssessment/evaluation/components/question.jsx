import { Radio } from "antd";
const Question = ({
  scales,
  question,
  questionNo,
  handleSelectOption,
  getSelectedAnswer
}) => { 
  return (
    <div className="col-6">
      <div
        className={` card mb-2 border border-2 ${getSelectedAnswer(question) ? "bg-light":""}`}
      >
        <div className="card-body">
          <h5 className="mb-2">
            {questionNo}. {question.name}
          </h5>
          <div>
            <Radio.Group
              onChange={(e) => {
                handleSelectOption({
                  id:question?.id,
                  answer:e.target?.value
                })
              }}
            >
              {scales?.length &&
                scales?.map((value,index) => (
                  <Radio key={index + 1} value={value}>
                    {value}
                  </Radio>
                ))}
            </Radio.Group>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
