import { gray600 } from "../../../../../../utility/customColor";

export const roleWiseSpecificationLandingTable = () => {
  return [
    {
      title: () => <div style={{ color: gray600 }}>Sl</div>,
      render: (_, record, index) => <>{record?.sl || "N/A"}</>,
      className: "text-center",
      width: "30px",
    },
    {
      title: () => <div style={{ color: gray600 }}>Role ID</div>,
      render: (_, record) => <>{record?.strEmpRoleCode || "N/A"}</>,
      width: "70px",
      className: "text-center",
    },
    {
      title: "Educational Qualification",
      dataIndex: "strEducationalQualifications",
      render: (_, record) => (
        <>{record?.strEducationalQualifications || "N/A"}</>
      ),
      filter: true,
    },
    {
      title: "Subject",
      dataIndex: "strSubject",
      render: (_, record) => <>{record?.strSubject || "N/A"}</>,
      filter: true,
    },
    {
      title: () => <div style={{ color: gray600 }}>Experience</div>,
      render: (_, record) => <>{record?.strExperience || "N/A"}</>,
    },
    {
      title: () => (
        <div style={{ color: gray600 }}>
          Functional skill required to execute the role
        </div>
      ),
      render: (_, record) => <>{record?.strFunctionalSkills || "N/A"}</>,
    },
    {
      title: () => <div style={{ color: gray600 }}>Age</div>,
      render: (_, record) => <>{record?.strAge || "N/A"}</>,
      width: "100px",
    },
  ];
};
