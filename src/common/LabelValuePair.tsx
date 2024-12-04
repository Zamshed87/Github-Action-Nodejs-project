const LabelValuePair = ({ label, value, className }: any) => {
  return (
    <div className={className} style={{ fontSize: "12px" }}>
      {label}: <span style={{ fontWeight: "500" }}>{value}</span>
    </div>
  );
};

export default LabelValuePair;
