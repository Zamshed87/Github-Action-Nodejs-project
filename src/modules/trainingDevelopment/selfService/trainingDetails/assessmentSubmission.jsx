import { useFormik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormikRadio from "../../../../common/FormikRadio";
import PrimaryButton from "../../../../common/PrimaryButton";
import { greenColor } from "../../../../utility/customColor";
import { createTrainingAssesmentAnswer } from "./helper";
import moment from "moment";

const AssessmentSubmission = ({
  state,
  questions = [],
  setQuestions,
  setLoading,
  isSubmit,
  getData,
  lastSubmission
}) => {
  const { employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: "",
    onSubmit: (values) => {
      // const answeredQuestions = questions.filter(item=>item?.options?.filter(op=>op?.IsSelected))

      const payload = questions.map((item) => {
        return {
          ...item,
          options: item.options.filter((op) => op?.IsSelected),
        };
      });
      const requiredAnswered = payload.filter((item) => item?.isRequired && item?.options[0]?.IsSelected);
      const requiredQuestions = questions.filter((item) => item?.isRequired);
      if (requiredQuestions.length > requiredAnswered.length) {
        return toast.warn("Answer All required Questions");
      }
      const callback = () => {
        getData();
      };
      createTrainingAssesmentAnswer(
        state,
        payload,
        employeeId,
        setLoading,
        callback
      );
    },
  });
  return (
    <form onSubmit={handleSubmit} className="mt-2 ml-3">
      <div className="d-flex" style={{ flexDirection: "column", gap: "15px" }}>
        {questions.map((question, index) => (
          <div>
            <div
              className="d-flex"
              style={{
                width: "100%",
                color: "#101828",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              <p className="pr-2" style={{ fontWeight: 600, color: "#101828" }}>
                {index + 1}
              </p>
              <p className="" style={{ fontWeight: 600, color: "#101828" }}>
                {question?.strQuestion}
                <span
                  style={{
                    color: "#f94449",
                    fontWeight: "bold",
                    padding: "2px",
                  }}
                >
                  {question?.isRequired ? "*" : null}
                </span>
              </p>
            </div>
            <div className="">
              {question?.options?.map((option, idx) => (
                <div className="input-field-main">
                  <FormikRadio
                    styleobj={{
                      iconWidth: "15px",
                      icoHeight: "15px",
                      padding: "0px 8px 0px 10px",
                      checkedColor: greenColor,
                    }}
                    name={question?.strQuestion}
                    label={option?.strOption}
                    value={idx}
                    onChange={(e) => {
                      // setFieldValue("summary", e.target.value);
                      const temp = [...questions];

                      const optionList = temp[index].options;
                      const update = optionList?.map((opt, optIndex) => {
                        if (optIndex === idx) {
                          return {
                            ...opt,
                            isChecked: idx,
                            IsSelected: true,
                          };
                        } else {
                          return {
                            ...opt,
                            isChecked: idx + 5,
                            IsSelected: false,
                          };
                        }
                      });
                      temp[index].options = update;
                      // temp[index].options[idx].isChecked = e?.target?.checked;
                      setQuestions(temp);
                    }}
                    // checked={values?.summary === "1"}
                    checked={
                      option?.isAnswer
                        ? option?.isAnswer === true
                        : option?.isChecked === idx
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {(isSubmit && questions?.length > 0) && moment().format() <= moment(lastSubmission).format() ?(
        <PrimaryButton
          type="submit"
          className="btn btn-green flex-center mt-3 "
          label={"Save"}
        />
      ) : (
        ""
      )}
    </form>
  );
};

export default AssessmentSubmission;
