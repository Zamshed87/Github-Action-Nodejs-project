import { FilePdfOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Descriptions, Tooltip, Typography } from "antd";
import { APIUrl } from "App";
import moment from "moment";
import { getPDFAction } from "utility/downloadFile";

const { Title } = Typography;

export default function EmployeeDetails({ employee, loading, singleFinalSettlementData, setLoading }) {
  return (
    <Card
      style={{
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      }}
      loading={loading}
      title={<b>Employee Details</b>}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        {/* Left side: Avatar and employee name + code */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {employee?.imageId ? (
            <Avatar
              size={40}
              src={`${APIUrl}/Document/DownloadFile?id=${employee?.imageId}`}
            />
          ) : (
            <Avatar size={40} icon={<UserOutlined />} />
          )}
          <div>
            <Title level={5} style={{ margin: 0 }}>
              {employee.strEmployeeName} [{employee.strEmployeeCode}]
            </Title>
          </div>
        </div>

        {/* PDF Button */}
        <div>
          {singleFinalSettlementData?.finalSettlementId && (
            <Tooltip title="PDF" arrow>
              <button
                className="iconButton"
                type="button"
                style={{
                  height: "28px",
                  width: "28px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() => {
                  getPDFAction(
                    `/PdfAndExcelReport/GetFinalSettlementReport?separationId=${singleFinalSettlementData?.intSeparationId}&format=PDF`,
                    setLoading
                  );
                }}
              >
                <FilePdfOutlined style={{ fontSize: 24, color: "#34a853" }} />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Employee Details in two columns like the screenshot */}
      <Descriptions
        column={2}
        bordered
        size="small"
        labelStyle={{ fontSize: 12, fontWeight: "600" }}
        contentStyle={{ fontSize: 12, fontWeight: "500" }}
      >
        <Descriptions.Item label="Employee Name">
          {employee.strEmployeeName ? (
            <>
              {employee.strEmployeeName} [{employee.strEmployeeCode || "N/A"}]
            </>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Workplace Group">
          {employee.strEmployeeWorkplaceGroupName || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Designation">
          {employee.strEmployeeDesignation || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Workplace">
          {employee.strEmployeeWorkplaceName || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Department">
          {employee.strEmployeeDepartment || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Separation Type">
          {employee.strSeparationType || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Employment Type">
          {employee.StrEmployeeTypeName || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Separation Application">
          {employee.dateofResign || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Joining Date">
          {employee.dteJoiningDate
            ? moment(employee.dteJoiningDate).format("DD MMM YYYY")
            : "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Last Working Date">
          {employee.lastWorkingDate
            ? employee.lastWorkingDate
            : "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Length of Service">
          {employee.lengthofService || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          {employee.strStatus || "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
