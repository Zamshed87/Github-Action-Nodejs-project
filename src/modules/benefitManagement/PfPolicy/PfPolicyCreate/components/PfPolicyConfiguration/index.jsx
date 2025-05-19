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
        console.log("values", values);
        let contributionData = {};

        if (company) {
          contributionData = {
            strPfConfigurationPart: "Employee",
            intRangeFrom: values.CintRangeFrom,
            intRangeTo: values.CintRangeTo,
            strContributionDependOn: values.CintContributionDependOn.label,
            intContributionDependOn: values.CintContributionDependOn.value,
            numAppraisalValue: values.CnumAppraisalValue,
          };
          setSaveData((prev) => ({
            ...prev,
            employerContributions: [
              ...(prev.employerContributions || []),
              contributionData,
            ],
          }));
        } else {
          contributionData = {
            strPfConfigurationPart: "Company",
            intRangeFrom: values.intRangeFrom,
            intRangeTo: values.intRangeTo,
            strContributionDependOn: values.intContributionDependOn.label,
            intContributionDependOn: values.intContributionDependOn.value,
            numAppraisalValue: values.numAppraisalValue,
          };
          setSaveData((prev) => ({
            ...prev,
            employeeContributions: [
              ...(prev.employeeContributions || []),
              contributionData,
            ],
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
