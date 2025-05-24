import PfPolicyConfig from "./PfPolicyConfig";
import ProfitShareCalculation from "./ProfitShareCalculation";

const PfProfitShareConfiguration = ({ form }) => {

  return (
    <>
      <PfPolicyConfig form={form} />
     <ProfitShareCalculation form={form} />
    </>
  );
};

export default PfProfitShareConfiguration;
