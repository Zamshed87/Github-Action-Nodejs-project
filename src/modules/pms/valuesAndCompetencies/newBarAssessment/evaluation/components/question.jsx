import { Radio } from "antd";
import React, { useEffect, useState } from "react";

const Question = ({
  options,
  question,
  questionNo,
  handleSelectOption,
  disabled,
}) => {
  const [value, setValue] = useState(-1);
  const handleChange = (e) => {
    //get the scale id
    let intScaleId = options.find(
      (op) => op.scaleValue === e.target.value
    )?.scoreScaleId;

    //prepare the updated single question payload for database update
    let updatedPayload = {
      ...question,
      intScaleId,
      numMarks: e.target.value,
    };

    //handle select and modify the amin dataset
    handleSelectOption({
      quesId: question?.intQestionireRowId,
      updatedPayload,
    });
  };

  //loading the selected option is any
  useEffect(() => {
    if (question?.numMarks !== null && question?.numMarks > -1)
      setValue(question?.numMarks);
  }, [question]);

  return (
    <div className="col-6">
      <div
        className={` card mb-2 border border-2 ${
          value > -1 && value !== null && "bg-light"
        }`}
      >
        <div className="card-body">
          <h5 className="mb-2">
            {questionNo}. {question.strQuestion}
          </h5>
          <div>
            <Radio.Group
              onChange={(e) => {
                setValue(e.target.value);
                handleChange(e);
              }}
              disabled={disabled}
              value={value}
            >
              {options?.length &&
                options?.map((option) => (
                  <Radio key={option.scaleValue} value={option.scaleValue}>
                    {option.scaleName}
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
