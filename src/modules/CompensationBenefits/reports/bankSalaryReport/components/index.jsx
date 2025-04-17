import BankWiseSalaryDisburse from "./BankWiseSalaryDisburse";
import DesignationWiseSalaryDisburse from "./DesignationWiseSalaryDisburse";

const ReportLanding = ({ data }) => {
  return (
    <>
      <BankWiseSalaryDisburse data={data} />
      <DesignationWiseSalaryDisburse data={data} />
    </>
  );
};

export default ReportLanding;
