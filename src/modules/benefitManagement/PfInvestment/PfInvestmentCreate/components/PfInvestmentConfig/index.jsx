import PfInvestmentConfig from "./PfInvestmentConfig";
import PfInvestmentDetails from "./PfInvestmentDetails";

const PfInvestmentConfiguration = ({ form }) => {

  return (
    <div className="d-flex">
      <div style={{ flex: "70%", marginRight: "1rem" }}>
      <PfInvestmentConfig form={form} />
      </div>
      <div style={{ flex: "20%" }}>
          <PfInvestmentDetails form={form} />
        </div>
      </div>
  );
};

export default PfInvestmentConfiguration;
