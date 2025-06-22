import { DeleteOutlined } from "@mui/icons-material";
import { Tooltip } from "antd";
import DeleteIcon from "common/DeleteIcon/DeleteIcon";
import { Flex } from "Components";

export const detailsHeader = ({
  removeData,
  intPfEligibilityDependOn,
  action = true,
}) => {
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
            render: (_, rec) =>
              rec?.intRangeFrom
                ? `${rec.intRangeFrom} to ${rec.intRangeTo}`
                : "-",
          },
        ]
      : []),
    {
      title: "Employee Contribution Depend On",
      render: (_, rec) => rec?.strContributionDependOn ?? "-",
    },
    {
      title: "Employee Contribution",
      dataIndex: "numAppraisalValue",
      render: (value, record) => {
        // Add % only if intContributionDependOn is 1 (Gross)
        console.log("intContributionDependOn", record.intContributionDependOn);
        if (record.intContributionDependOn == 1) {
          return `${value}%`;
        }
        return value;
      },
    },
    ...(action
      ? [
          {
            title: "Action",
            align: "center",
            render: (_, row, index) => (
              <DeleteIcon onClick={() => removeData?.(index)} />
            ),
          },
        ]
      : []),
  ];
};
