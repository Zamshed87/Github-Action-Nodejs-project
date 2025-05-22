import EmployeeContribution from "./EmployeeContribution";
import PfPolicyConfig from "./PfPolicyConfig";
import EmployeeContributionPfPayment from "./EmployeeContributionPfPayment";
import PfInvestment from "./PfInvestment";
import { toast } from "react-toastify";

const PfPolicyConfiguration = ({ form, saveData, setSaveData }) => {
  const removeData = (index, company) => {
    if (company) {
      const newData = saveData?.companyContributions?.filter(
        (_, i) => i !== index
      );
      setSaveData((prev) => ({ ...prev, companyContributions: newData }));
    } else {
      const newData = saveData?.employeeContributions?.filter(
        (_, i) => i !== index
      );
      setSaveData((prev) => ({ ...prev, employeeContributions: newData }));
    }
  };
  const addData = (company) => {
    const commonFields = [
      "strPolicyName",
      "strPolicyCode",
      "intWorkPlaceId",
      "intEmploymentTypeIds",
      "intPfEligibilityDependOn",
    ];
  
    const employeeFields = [
      "consecutiveDay",
      "intRangeFrom",
      "intRangeTo",
      "intContributionDependOn",
      "numAppraisalValue",
    ];
  
    const employerFields = [
      "CconsecutiveDay",
      "CintRangeFrom",
      "CintRangeTo",
      "CintContributionDependOn",
      "CnumAppraisalValue",
    ];
  
    const validateFields = [
      ...commonFields,
      ...(company ? employerFields : employeeFields),
    ];
  
    form
      .validateFields(validateFields)
      .then((values) => {
        let contributionData = {};
        let newFrom, newTo, existingContributions;
  
        if (company) {
          newFrom = values.CintRangeFrom;
          newTo = values.CintRangeTo;
          existingContributions = saveData?.companyContributions || [];
        } else {
          newFrom = values.intRangeFrom;
          newTo = values.intRangeTo;
          existingContributions = saveData?.employeeContributions || [];
        }
  
        // 🔍 Check for overlapping ranges within the same contribution type
        const isOverlapping = existingContributions.some(
          (item) =>
            Math.max(item.intRangeFrom, newFrom) <=
            Math.min(item.intRangeTo, newTo)
        );
  
        if (isOverlapping) {
          toast.error("Overlapping range detected. Please adjust the values.");
          return;
        }
  
        // ✅ Prepare contributionData
        if (company) {
          contributionData = {
            strPfConfigurationPart: "Employee",
            intRangeFrom: newFrom,
            intRangeTo: newTo,
            strContributionDependOn: values.CintContributionDependOn.label,
            intContributionDependOn: values.CintContributionDependOn.value,
            numAppraisalValue: values.CnumAppraisalValue,
          };
          setSaveData((prev) => ({
            ...prev,
            companyContributions: [...existingContributions, contributionData],
          }));
        } else {
          contributionData = {
            strPfConfigurationPart: "Company",
            intRangeFrom: newFrom,
            intRangeTo: newTo,
            strContributionDependOn: values.intContributionDependOn.label,
            intContributionDependOn: values.intContributionDependOn.value,
            numAppraisalValue: values.numAppraisalValue,
          };
          setSaveData((prev) => ({
            ...prev,
            employeeContributions: [...existingContributions, contributionData],
          }));
        }
      })
      .catch(() => {
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
        data={saveData?.companyContributions}
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
