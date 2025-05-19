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
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // distribute space
            marginBottom: 5,
          }}
        >
          {/* Left side: Avatar and employee details */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {employee?.imageId ? (
              <Avatar
                size={35}
                src={`${APIUrl}/Document/DownloadFile?id=${employee?.imageId}`}
              />
            ) : (
              <Avatar size={35} icon={<UserOutlined />} />
            )}
            <div>
              <Title style={{ fontSize: "14px", marginBottom: 0 }}>
                {employee.strEmployeeName} [{employee.strEmployeeCode}]
              </Title>
              <Typography.Text type="secondary">
                {employee.strEmployeeDesignation} -{" "}
                {employee.strEmployeeDepartment}
              </Typography.Text>
            </div>
          </div>

          {/* Right side: Add your icon here */}
          <div>
            {singleFinalSettlementData?.finalSettlementId && (
              <Tooltip title="PDF" arrow>
                <button
                  className="iconButton"
                  type="button"
                  style={{
                    height: "25px",
                    width: "25px",
                  }}
                >
                  <FilePdfOutlined
                    sx={{ color: "#34a853" }}
                    onClick={(e) => {
                      getPDFAction(
                        `/PdfAndExcelReport/GetFinalSettlementReport?separationId=${singleFinalSettlementData?.intSeparationId}&format=PDF`,
                        setLoading
                      );
                    }}
                  />
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        <Descriptions
          column={4}
          bordered
          size="small"
          labelStyle={{ fontSize: "12px" }}
          contentStyle={{ fontWeight: "500", fontSize: "12px" }}
        >
          <Descriptions.Item label="Employee ID">
            <Typography.Text>
              {employee.strEmployeeCode || "N/A"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Designation">
            <Typography.Text>
              {employee.strEmployeeDesignation || "N/A"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Department">
            <Typography.Text>
              {employee.strEmployeeDepartment || "N/A"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Joining Date">
            <Typography.Text>
              {employee?.dteJoiningDate
                ? moment(employee?.dteJoiningDate).format("YYYY-MM-DD")
                : "N/A"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Length of Service">
            <Typography.Text>
              {employee.lengthofService || "N/A"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Last Working Date">
            <Typography.Text>
              {employee.lastWorkingDate || "N/A"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Mobile (Official)">
            <Typography.Text>{employee.mobileNumber || "N/A"}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Business Unit">
            <Typography.Text>
              {employee.strEmployeeBusinessUnit || "N/A"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Workplace">
            <Typography.Text>
              {employee.strEmployeeWorkplaceGroupName || "N/A"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Date of Application">
            <Typography.Text>{employee.dateofResign || "N/A"}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Notice Period">
            <Typography.Text>
              {employee?.noticePeriod
                ? `${employee?.noticePeriod} Days`
                : "N/A"}
            </Typography.Text>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Card>
  );
}
