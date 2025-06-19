import TdsChallanFormFields from "./TdsChallanFormFields";
import { toast } from "react-toastify";
import { detailsHeader } from "./helper";
import { DataTable, PCardBody } from "Components";
import { useDispatch } from "react-redux";

const TdsChallanCreateForm = ({ form, saveData, setSaveData }) => {
  const dispatch = useDispatch();
  const removeData = (index) => {
    const newData = saveData?.filter((_, i) => i !== index);
    setSaveData(newData);
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
  let data = [];

  return (
    <>
      <TdsChallanFormFields form={form} addData={() => addData(false)} />
      {!data?.length > 0 && (
        <PCardBody className="mb-4">
          <DataTable
            bordered
            data={data || []}
            rowKey={(row, idx) => idx}
            header={detailsHeader({
              removeData,
              dispatch
            })}
          />
        </PCardBody>
      )}
    </>
  );
};

export default TdsChallanCreateForm;
