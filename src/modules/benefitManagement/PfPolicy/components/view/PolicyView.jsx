import { DataTable } from "Components";
import { detailsHeader } from "../../PfPolicyCreate/components/PfPolicyConfiguration/helper";

const PolicyView = ({ data }) => {
  let intPfEligibilityDependOn = { value: data?.intPfEligibilityDependOn };
  return (
    <>
      {data && (
        <>
          <p>
            <strong>Policy Name:</strong> {data?.strPolicyName || "N/A"}
          </p>
          <p>
            <strong>Workplace Group:</strong> {data?.strWorkPlaceGroup || "N/A"}
          </p>
          <p>
            <strong>Workplace:</strong> {data?.strWorkPlace || "N/A"}
          </p>
          <p>
            <strong>Employment Types:</strong>{" "}
            {data?.isForAllEmploymentType
              ? "ALL"
              : data?.employmentTypes?.map((type) => type?.label)?.join(", ") ||
                "N/A"}
          </p>
          {data?.strPfEligibilityDependOn && (
            <p>
              <strong>Pf Eligibility Depend On:</strong>{" "}
              {data?.strPfEligibilityDependOn}
            </p>
          )}
          {data?.strEmployeeContributionPaidAfter && (
            <p>
              <strong>Employee Contribution Paid After:</strong>{" "}
              {data?.strEmployeeContributionPaidAfter}
            </p>
          )}
          <p>
            <strong>Monthly Investment With:</strong>{" "}
            {data?.strMonthlyInvestmentWith || "N/A"}
          </p>
          <div style={{ marginBottom: "20px" }}></div>
          {data?.employees?.length > 0 && (
            <DataTable
              bordered
              data={data?.employees}
              rowKey={(row, idx) => idx}
              header={detailsHeader({
                removeData: () => {},
                intPfEligibilityDependOn,
                intContributionDependOn: {
                  value: data?.intContributionDependOn,
                },
                action: false,
              }
              )}
            />
          )}
          <div style={{ marginBottom: "20px" }}></div>
          {data?.companies?.length > 0 && (
            <DataTable
              bordered
              data={data?.companies}
              rowKey={(row, idx) => idx}
              header={detailsHeader({
                removeData: () => {},
                intPfEligibilityDependOn,
                intContributionDependOn: {
                  value: data?.intContributionDependOn,
                },
                action: false,
              })}
            />
          )}
        </>
      )}
    </>
  );
};

export default PolicyView;
