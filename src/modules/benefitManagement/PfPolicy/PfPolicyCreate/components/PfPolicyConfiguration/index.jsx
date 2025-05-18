import EmployeeContribution from "./EmployeeContribution";
import PfPolicyConfig from "./PfPolicyConfig";
import EmployerContribution from "./EmployerContribution";
import EmployeeContributionPfPayment from "./EmployeeContributionPfPayment";
import PfInvestment from "./PfInvestment";
import { PCardBody } from "Components";

const PfPolicyConfiguration = ({ form, saveData, setSaveData }) => {
  return (
    <>
      <PfPolicyConfig form={form} />
      <EmployeeContribution form={form} saveData={saveData} setSaveData={setSaveData} />
      <EmployerContribution form={form} saveData={saveData} setSaveData={setSaveData} />
      <EmployeeContributionPfPayment form={form} />
      <PfInvestment form={form} />
    </>
  );
};

export default PfPolicyConfiguration;
