const TextError = (props) => {
  return (
    <div style={{ color: "red", fontSize: "12px", marginTop: "-8px" }}>
      {props.children}
    </div>
  );
};

export default TextError;
