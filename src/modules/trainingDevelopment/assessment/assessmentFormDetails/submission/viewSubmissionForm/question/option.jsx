const Option = ({ option = [] }) => {
  return (
    <div className="d-flex justify-content-between" style={{ width: "100%" }}>
      <div
        className="d-flex align-items-start justify-content-start"
        style={{ width: "80%" }}
      >
        {option?.isAnswer ? (
          <div
            className=""
            style={{
              border: "2px solid #34A853",
              width: "12px",
              height: "12px",
              borderRadius: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <p
              className=""
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "#34A853",
                borderRadius: "100%",
                flexShrink: 0,
              }}
            ></p>
          </div>
        ) : (
          <div
            className=""
            style={{
              border: "2px solid #98A2B3",
              borderRadius: "100%",
              width: "12px",
              height: "12px",
              flexShrink: 0,
            }}
          ></div>
        )}
        <p className="pl-2" style={{ marginTop: "-2px" }}>
          {option?.strOption}
        </p>
      </div>
      <div
        className=""
        style={{
          width: "20%",
          display: "flex",
          justifyContent: "end",
        }}
      >
        <p
          className=""
          style={{
            backgroundColor: "#EAECF0",
            padding: "1px 15px",
            borderRadius: "20px",
            height: "fit-content",
          }}
        >
          (Mark: <span>{option?.numPoints}</span>)
        </p>
      </div>
    </div>
  );
};

export default Option;
