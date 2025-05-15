import { Switch, Tooltip } from "antd";
import { Flex, PButton } from "Components";

export const getHeader = (pages, history) => [
  {
    title: "SL",
    render: (_, __, index) =>
      (pages?.current - 1) * pages?.pageSize + index + 1,
    width: 50,
    align: "center",
  },
  {
    title: "Policy Name",
    dataIndex: "policyName",
    sorter: true,
    width: 150,
  },
  {
    title: "Workplace",
    dataIndex: "workplaceName",
    sorter: true,
    width: 150,
  },
  {
    title: "Employment Type",
    dataIndex: "employmentTypeList",
    sorter: true,
    width: 120,
  },
  {
    title: "Designation",
    dataIndex: "designationList",
    sorter: true,
    width: 120,
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (_, rec) => (
      <Flex justify="center">
        <Tooltip
          placement="bottom"
          title={rec?.isActive ? "Active" : "Inactive"}
        >
          <Switch size="small" checked={rec?.isActive} onChange={() => {}} />
        </Tooltip>
      </Flex>
    ),
    align: "center",
    width: 40,
  },
  {
    title: "Action",
    dataIndex: "",
    align: "center",
    render: (_, record) => (
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <PButton content="View" type="primary-outline" onClick={() => {}} />
        <PButton
          content="Extend"
          type="primary"
          onClick={() => {
            history?.push({
              pathname: `/administration/punishmentConfiguration/absentPunishment/configuration/extend/${record.policyId}`,
              state: { policyInfo: record },
            });
          }}
        />
      </div>
    ),
    width: 140,
  },
];
