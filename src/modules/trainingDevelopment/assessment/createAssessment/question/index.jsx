import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { blackColor80, greenColor } from "../../../../../utility/customColor";
import AddIcon from "@mui/icons-material/Add";
import { ErrorMessage, FieldArray } from "formik";
import TextError from "../error";
import { Switch } from "@mui/material";
import FormikInput from "../../../../../common/FormikInput";
import CreateOptions from "../option";
import uuid from "../helper/uuid";
import IConfirmModal from "../../../../../common/IConfirmModal";

const CreateQuestion = ({
  values,
  newQuestion,
  questionRequired,
  errors,
  touched,
  handleBlur,
  index,
  remove,
  question,
  setFieldValue,
  setValues,
}) => {
  const handleCopy = (question) => {
    if (question?.queId) {
      const prevQueId = question?.queId;
      const newId = uuid();
      const copiedQuestion = { ...question, queId: newId };
      let copiedAnswer = [];
      values?.answers?.forEach((ans) => {
        if (ans.queId === prevQueId) {
          copiedAnswer.push({
            ...ans,
            queId: newId,
          });
        }
      });
      setValues((prev) => {
        return {
          questions: [...prev.questions, { ...copiedQuestion }],
          answers: [...prev.answers, ...copiedAnswer],
        };
      });
    }
  };

  const demoPopup = () => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to Delete ? `,
      yesAlertFunc: () => {
        remove(index);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <div
        className=""
        style={{
          maxWidth: "60%",
          marginTop: "30px",
          border: "1px solid #D0D5DD",
          borderRadius: "5px",
        }}
      >
        <div
          className="d-flex justify-content-between"
          style={{
            height: "fit-content",
            padding: "10px 15px",
            borderBottom: "1px solid #D0D5DD",
          }}
        >
          <div
            className=""
            style={{
              border: "1px solid black",
              borderRadius: "50%",
              width: "25px",
              height: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {index + 1}
          </div>
          <div className="d-flex">
            <div
              className="d-flex"
              style={{
                borderRight: "1px solid black",
                gap: "5px",
                marginRight: "10px",
                paddingRight: "10px",
              }}
            >
              <ContentCopyIcon
                sx={{
                  width: "22px",
                  height: "22px",
                  color: "#323232",
                  cursor: "pointer",
                  marginTop: "2px",
                }}
                onClick={() => handleCopy(question)}
              />
              <DeleteOutlineOutlinedIcon
                sx={{
                  width: "25px",
                  height: "25px",
                  color: "#323232",
                  cursor: "pointer",
                }}
                onClick={demoPopup}
              />
            </div>
            <div className="d-flex align-items-center" style={{ gap: "8px" }}>
              <p className="">Required</p>
              <Switch
                onChange={(e) =>
                  setFieldValue(questionRequired, e.target.checked)
                }
                checked={question?.isRequired}
                name={questionRequired}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: question?.isRequired ? greenColor : blackColor80,
                    "&.Mui-disabled": {
                      color: question?.isRequired ? greenColor : blackColor80,
                      opacity: 0.38,
                    },
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: question?.isRequired
                      ? greenColor
                      : blackColor80,
                  },
                  "& .MuiSwitch-thumb": {
                    color: `${
                      question?.isRequired ? greenColor : blackColor80
                    }!important`,
                  },
                }}
                size="small"
              />
            </div>
          </div>
        </div>

        <div className="" style={{ padding: "20px" }}>
          <div className="">
            <div className="input-field-main">
              <label>Write a question</label>
              <FormikInput
                classes="input-sm"
                placeholder=" "
                value={question?.title}
                name={newQuestion}
                type="text"
                onChange={(e) => {
                  setFieldValue(newQuestion, e.target.value);
                }}
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
              <ErrorMessage name={newQuestion} component={TextError} />
            </div>
          </div>

          <FieldArray name="answers">
            {({ push, remove, form }) => (
              <>
                {form.values.answers.map((answer, index) => {
                  if (answer.queId === question.queId) {
                    const newOption = `answers[${index}].ansTitle`;
                    const newMark = `answers[${index}].mark`;

                    return (
                      <CreateOptions
                        answer={answer}
                        newOption={newOption}
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        errors={errors}
                        touched={touched}
                        newMark={newMark}
                        remove={remove}
                        index={index}
                      />
                    );
                  } else return null;
                })}
                <p
                  className=""
                  style={{
                    color: greenColor,
                    fontWeight: "600",
                    fontSize: "12px",
                    width: "fit-content",
                    marginTop: "10px",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    push({
                      optionId: uuid(),
                      queId: question.queId,
                      ansTitle: "",
                      mark: 0,
                    })
                  }
                >
                  <AddIcon sx={{ width: "16px", height: "16px" }} /> Add other
                </p>
              </>
            )}
          </FieldArray>
        </div>
      </div>
    </>
  );
};

export default CreateQuestion;
