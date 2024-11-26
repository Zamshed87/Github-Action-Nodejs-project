
const EmployeeShortDetails = ({ DesignationName, DepartmentName }) => {
  return (
    <div
      style={{
        fontSize: "12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "start",
      }}
    >
      <div className="w-100">
        <div className="">
          Designation :{" "}
          <span style={{ fontWeight: "500" }}>{DesignationName}</span>
        </div>
        <div>
          Department :{" "}
          <span style={{ fontWeight: "500" }}>{DepartmentName}</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeShortDetails;
