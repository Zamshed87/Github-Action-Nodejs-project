import EmployeeContribution from "./EmployeeContribution";
import PfPolicyConfig from "./PfPolicyConfig";
import EmployeeContributionPfPayment from "./EmployeeContributionPfPayment";
import PfInvestment from "./PfInvestment";
import { toast } from "react-toastify";

const PfPolicyConfiguration = ({ form, saveData, setSaveData }) => {
  const removeData = (index, company) => {
    if (company) {
      const newData = saveData?.employerContributions?.filter(
        (_, i) => i !== index
      );
      setSaveData((prev) => ({ ...prev, employerContributions: newData }));
    } else {
      const newData = saveData?.employeeContributions?.filter(
        (_, i) => i !== index
      );
      setSaveData((prev) => ({ ...prev, employeeContributions: newData }));
    }
  };
console.log("saveData", saveData);
  const addData = (company) => {
    form
      .validateFields()
      .then((values) => {
        const contributionData = {
          ...values,
        };

        if (company) {
          setSaveData((prev) => ({
            ...prev,
            employerContributions: [
              ...(prev.employerContributions || []),
              contributionData,
            ],
          }));
        } else {
          setSaveData((prev) => ({
            ...prev,
            employeeContributions: [
              ...(prev.employeeContributions || []),
              contributionData,
            ],
          }));
        }
      })
      .catch((err) => {
        toast.error("Please fill all required fields.");
      });
  };
  return (
    <>
      <PfPolicyConfig form={form} />
      <EmployeeContribution
        form={form}
        data={saveData?.employeeContributions}
        addData={() => addData(false)}
        removeData={(index) => removeData(index, false)}
      />
      <EmployeeContribution
        form={form}
        data={saveData?.employerContributions}
        addData={() => addData(true)}
        removeData={(index) => removeData(index, true)}
        company={true}
      />
      <EmployeeContributionPfPayment form={form} />
      <PfInvestment form={form} />
    </>
  );
};

export default PfPolicyConfiguration;
