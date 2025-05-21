import PfPolicyConfig from "./PfInvestmentConfig";
import PfInvestment from "./PfInvestment";

const PfPolicyConfiguration = ({ form }) => {

  return (
    <>
      <PfPolicyConfig form={form} />
      <PfInvestment form={form} />
    </>
  );
};

export default PfPolicyConfiguration;
