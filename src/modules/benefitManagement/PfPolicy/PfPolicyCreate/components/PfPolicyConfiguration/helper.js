import { PButton } from "Components";

export const detailsHeader = ({
  removeData,
  intPfEligibilityDependOn,
  intContributionDependOn,
  action = true,
}) => {
  console.log("int", intPfEligibilityDependOn);
  const PEDO =
  intPfEligibilityDependOn?.value && intPfEligibilityDependOn?.value !== "0";

  const getDependOnTitle = (value) => {
    switch (String(value?.value)) {
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
    switch (String(value?.value)) {
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
            dataIndex: "intPfEligibilityDependOn",
            render: (_, rec) => rec?.intRangeFrom ? `${rec.intRangeFrom} to ${rec.intRangeTo}` : "-",
          },
        ]
      : []),
    {
      title: "Employee Contribution Depend On",
      render: (_, rec) => rec?.strContributionDependOn ?? "-",
    },
    {
      title: getEmpContributionTitle(intContributionDependOn),
      dataIndex: "numAppraisalValue",
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
