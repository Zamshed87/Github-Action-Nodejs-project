import { PButton } from "Components";

export const detailsHeader = ({
  removeData,
  intPfEligibilityDependOn,
  intContributionDependOn,
  action = true,
}) => {
  const PEDO = intContributionDependOn?.value && intContributionDependOn?.value !== "0";
   
  const getDependOnTitle = (value) => {
    switch (value?.value) {
      case "1":
        return "Service Length";
      case "2":
        return "Service Length";
      case "3":
        return "Salary Range";
      default:
        return "N/A";
    }
  };
  const getEmpContributionTitle = (value) => {
    let label = "";
    switch (value?.value) {
      case "1":
        label = "% of Gross";
        break;
      case "2":
        label = "Basic Salary";
        break;
      case "3":
        label = "Amount";
        break;
      default:
        return "N/A";
    }
    return `Employee Contribution (${label})`;
  };
  return [
    {
      title: "SL",
      render: (value, row, index) => index + 1,
      align: "center",
    },
    ...(PEDO
      ? [
          {
            title: getDependOnTitle(intPfEligibilityDependOn),
            dataIndex: "intContributionDependOn",
            render: (val) => val ?? "-",
          },
        ]
      : []),
    {
      title: "Employee Contribution Depend On",
      dataIndex: "amountDeductionTypeName",
      render: (val) => val ?? "-",
    },
    {
      title: getEmpContributionTitle(intContributionDependOn),
      dataIndex: "consecutiveDay",
      render: (val) => val ?? "-",
    },
    ...(action
      ? [
          {
            title: "Action",
            render: (_, row, index) => (
              <PButton
                type="danger"
                content="Remove"
                onClick={() => {
                  removeData?.(index);
                }}
              />
            ),
          },
        ]
      : []),
  ];
};
