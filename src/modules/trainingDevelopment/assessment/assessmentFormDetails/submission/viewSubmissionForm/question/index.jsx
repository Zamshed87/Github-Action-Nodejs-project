import Option from "./option";

const Question = ({ questions = [] }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        margin: "10px 32px",
      }}
    >
      {questions.map((question, index) => (
        <div
          className=""
          key={index}
          style={{
            width: "100%",
            borderBottom: "1px solid #D9D9D9",
            paddingBottom: "10px",
            fontSize: "14px !important",
          }}
        >
          <div
            className="d-flex"
            style={{
              width: "100%",
              color: "#101828",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            <p className="pr-2" style={{ fontWeight: 600, color: "#101828" }}>
              {index + 1}.
            </p>
            <p className="" style={{ fontWeight: 600, color: "#101828" }}>
              {question.strQuestion}
            </p>
          </div>
          <div
            className=""
            style={{ display: "flex", flexDirection: "column", gap: "3px" }}
          >
            {question?.options?.map((option, index) => (
              <Option key={index} option={option} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Question;
