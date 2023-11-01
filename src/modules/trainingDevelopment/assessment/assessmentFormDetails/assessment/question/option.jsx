const Option = ({ option = {} }) => {
  return (
    <div className="d-flex justify-content-between" style={{ width: "100%" }}>
      <div className="d-flex align-items-start" style={{ width: "80%" }}>
        <div
          className=""
          style={{
            border: "2px solid #98A2B3",
            borderRadius: "100%",
            width: "12px",
            height: "12px",
            marginRight: "10px",
            marginTop: "2px",
            flexShrink: 0,
          }}
        ></div>
        <p className="">{option?.strOption}</p>
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
            padding: "2px 15px",
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
