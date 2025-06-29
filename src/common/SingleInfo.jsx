import { gray700 } from "utility/customColor";

const SingleInfo = ({ label, value }) => {
  return (
    <div className="single-info">
      <p
        className="text-single-info"
        style={{ fontWeight: "500", color: gray700 }}
      >
        <small style={{ fontSize: "12px", lineHeight: "1.5" }}>{label} -</small>{" "}
        {value}
      </p>
    </div>
  );
};

export default SingleInfo;
