import HRPositionExecutive from "./HRPositionExecutive";
import HRPositionStaff from "./HRPositionStaff";
import HRPositionWorker from "./HRPositionWorker";

const DesignationWiseSalaryDisburse = ({ data }) => {
  return (
    <div>
      <h3 className="pb-3 pt-3">{`${data?.reportType ?? "N/A"} wise Salary Disburse`}</h3>
      <HRPositionStaff data={data}/>
      <HRPositionWorker data={data}/>
      <HRPositionExecutive data={data}/>
    </div>
  );
};

export default DesignationWiseSalaryDisburse;
