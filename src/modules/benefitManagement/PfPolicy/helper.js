import { PButton } from "Components";

export const getHeader = (pages, history) => [
  {
    title: "SL",
    render: (_, __, index) =>
      (pages?.current - 1) * pages?.pageSize + index + 1,
    width: 25,
    align: "center",
  },
  {
    title: "Policy Name",
    dataIndex: "strPolicyName",
    sorter: true,
    width: 100,
  },
  {
    title: "Workplace Group",
    dataIndex: "strWorkPlaceGroupName",
    sorter: true,
    width: 120,
  },
  {
    title: "Workplace",
    dataIndex: "strWorkPlaceName",
    sorter: true,
    width: 100,
  },
  {
    title: "Employment Type",
    dataIndex: "strEmploymentTypeName",
    sorter: true,
    width: 120,
  },
  {
    title: "PF Eligibility Depend on",
    dataIndex: "strPFEligibilityDepandOn",
    sorter: true,
    width: 150,
  },
  {
    title: "Status",
    dataIndex: "strStatus",
    sorter: true,
    width: 80,
  },
  {
    title: "Action",
    dataIndex: "",
    align: "center",
    render: (_, record) => (
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <PButton
          content="View"
          type="primary-outline"
          onClick={() => {
            history?.push({
              pathname: `/pfpolicy/view/${record.intId}`,
              state: { policyInfo: record },
            });
          }}
        />
        <PButton
          content="Extend"
          type="primary"
          onClick={() => {
            history?.push({
              pathname: `/pfpolicy/extend/${record.intId}`,
              state: { policyInfo: record },
            });
          }}
        />
      </div>
    ),
    width: 120,
  },
];
