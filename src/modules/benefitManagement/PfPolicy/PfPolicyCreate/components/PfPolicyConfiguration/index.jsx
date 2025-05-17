import EmployeeContribution from "./EmployeeContribution";
import PfPolicyConfig from "./PfPolicyConfig";
import EmployerContribution from "./EmployerContribution";

const PfPolicyConfiguration = ({ form, saveData, setSaveData }) => {
  return (
    <>
      <PfPolicyConfig form={form} setSaveData={setSaveData} />
      <EmployeeContribution form={form} saveData={saveData} setSaveData={setSaveData} />
      <EmployerContribution form={form} saveData={saveData} setSaveData={setSaveData} />
    </>
  );
};

export default PfPolicyConfiguration;
