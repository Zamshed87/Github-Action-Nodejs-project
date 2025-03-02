import { UserOutlined } from "@ant-design/icons";
import { Card, Descriptions, Avatar, Typography } from "antd";
import { APIUrl } from "App";
import moment from "moment";
import React from "react";

const { Title } = Typography;

export default function EmployeeDetails({ employee, loading }) {
  return (
    <Card
      style={{
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      }}
      loading={loading}
    >
      <div style={{ width: "100%", maxWidth: "60vw" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 5,
          }}
        >
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

        <Descriptions
          column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 3 }}
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
              {employee.noticePeriod || "N/A"} Days
            </Typography.Text>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Card>
  );
}
