import HRPosition from "./HRPosition";

const DesignationWiseSalaryDisburse = ({ data }) => {
  return (
    <div>
      <h3 className="pb-3 pt-3">{`${
        data?.reportType ?? "N/A"
      } wise Salary Disburse`}</h3>
      {data?.hrPosDesigWiseSalaryDisburse?.map((item, index) => (
        <HRPosition key={index+1} reportType={data?.reportType} data={item} />
      ))}
    </div>
  );
};

export default DesignationWiseSalaryDisburse;
