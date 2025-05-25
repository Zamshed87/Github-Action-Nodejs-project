import React from "react";
import { Modal, Tabs, Descriptions, List, Empty, Typography } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Text, Paragraph } = Typography;

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return "N/A";
  }
};

// Helper to get diff map between two objects (for shallow & nested objects)
function getDiffMap(original = {}, modified = {}) {
  const diffMap = {};
  for (const key in modified) {
    if (
      modified[key] &&
      typeof modified[key] === "object" &&
      !Array.isArray(modified[key])
    ) {
      const nestedDiff = getDiffMap(original[key], modified[key]);
      diffMap[key] = Object.values(nestedDiff).some(Boolean)
        ? nestedDiff
        : false;
    } else {
      diffMap[key] = modified[key] !== original[key];
    }
  }
  return diffMap;
}

const EmployeeViewModal = ({ visible, onClose, empData, originalData }) => {
  if (!empData) return null;

  const {
    employeeProfileLandingView,
    empEmployeeAddress = [],
    empEmployeeBankDetail,
    empEmployeeEducation = [],
    empJobExperience = [],
    empEmployeeTraining = [],
    empEmployeeRelativesContact = [],
    empSocialMedia = [],
    empEmployeePhotoIdentity,
    holidayassignviewmodel,
    offdayassignviewmodel,
    userVm,
  } = empData;

  const {
    employeeProfileLandingView: originalEmployeeProfileLandingView = {},
  } = originalData || {};

  const diffMap = getDiffMap(
    originalEmployeeProfileLandingView,
    employeeProfileLandingView
  );

  const descriptionItemStyle = { paddingBottom: 12, fontSize: 14 };
  const labelStyle = { fontWeight: 600, fontSize: 14 };

  const highlightStyle = { backgroundColor: "#fff8e1" }; // light yellow highlight

  return (
    <Modal
      title="Employee Profile Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      bodyStyle={{ maxHeight: "75vh", overflowY: "auto", paddingTop: 0 }}
    >
      <Tabs
        defaultActiveKey="1"
        type="line"
        size="middle"
        tabBarStyle={{
          position: "sticky",
          top: 0,
          background: "white",
          zIndex: 10,
          borderBottom: "1px solid #e8e8e8",
          boxShadow: "0 2px 6px -2px rgba(0,0,0,0.1)",
          marginBottom: 0,
        }}
      >
        {/* Basic Info */}
        <TabPane tab="Basic Info" key="1">
          <Descriptions
            bordered
            column={1}
            size="middle"
            labelStyle={labelStyle}
            contentStyle={{ fontSize: 14, paddingBottom: 12 }}
            style={{ background: "#fafafa", borderRadius: 6, padding: 16 }}
          >
            <Descriptions.Item
              label="Name"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strEmployeeName ? highlightStyle : {}),
              }}
            >
              <Text strong>
                {employeeProfileLandingView?.strEmployeeName || "N/A"}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item
              label="Employee Code"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strEmployeeCode ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.strEmployeeCode || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Designation"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strDesignation ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.strDesignation || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Department"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strDepartment ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.strDepartment || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Date of Birth"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.dteDateOfBirth ? highlightStyle : {}),
              }}
            >
              <CalendarOutlined style={{ marginRight: 8 }} />
              {formatDate(employeeProfileLandingView?.dteDateOfBirth)}
            </Descriptions.Item>
            <Descriptions.Item
              label="Gender"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strGender ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.strGender || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Religion"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strReligion ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.strReligion || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Marital Status"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strMaritalStatus ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.strMaritalStatus || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Blood Group"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strBloodGroup ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.strBloodGroup || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Joining Date"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.dteJoiningDate ? highlightStyle : {}),
              }}
            >
              <CalendarOutlined style={{ marginRight: 8 }} />
              {formatDate(employeeProfileLandingView?.dteJoiningDate)}
            </Descriptions.Item>
            <Descriptions.Item
              label="Employment Type"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strEmploymentType ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.strEmploymentType || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Office Email"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strOfficeMail ? highlightStyle : {}),
              }}
            >
              <MailOutlined style={{ marginRight: 8 }} />
              {employeeProfileLandingView?.strOfficeMail || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Personal Email"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strPersonalMail ? highlightStyle : {}),
              }}
            >
              <MailOutlined style={{ marginRight: 8 }} />
              {employeeProfileLandingView?.strPersonalMail || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Office Mobile"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strOfficeMobile ? highlightStyle : {}),
              }}
            >
              <PhoneOutlined style={{ marginRight: 8 }} />
              {employeeProfileLandingView?.strOfficeMobile || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Personal Mobile"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strPersonalMobile ? highlightStyle : {}),
              }}
            >
              <PhoneOutlined style={{ marginRight: 8 }} />
              {employeeProfileLandingView?.strPersonalMobile || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Status"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strEmployeeStatus ? highlightStyle : {}),
              }}
            >
              <Text
                type={
                  employeeProfileLandingView?.strEmployeeStatus === "Active"
                    ? "success"
                    : "danger"
                }
              >
                {employeeProfileLandingView?.strEmployeeStatus || "N/A"}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item
              label="Workplace"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strWorkplaceName ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.strWorkplaceName || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Business Unit"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strBusinessUnitName ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.strBusinessUnitName || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Payroll Group"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strPayrollGroupName ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.strPayrollGroupName || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>

        {/* Other tabs remain unchanged */}

        {/* Addresses */}
        <TabPane tab="Addresses" key="2">
          {empEmployeeAddress.length === 0 ? (
            <Empty description="No addresses found" />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={empEmployeeAddress}
              renderItem={(addr) => (
                <List.Item
                  key={addr.intEmployeeAddressId}
                  style={{
                    marginBottom: 16,
                    border: "1px solid #f0f0f0",
                    borderRadius: 6,
                    padding: 16,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <List.Item.Meta
                    title={
                      <Text strong>{`${
                        addr.strAddressType || "Address"
                      } Address`}</Text>
                    }
                    description={
                      <>
                        <Paragraph style={{ marginBottom: 4 }}>
                          {addr.strAddressDetails}
                        </Paragraph>
                        <Paragraph style={{ marginBottom: 4 }}>
                          {addr.strPostOffice}
                        </Paragraph>
                        <Paragraph style={{ marginBottom: 4 }}>
                          {addr.strThana}, {addr.strDistrictOrState},{" "}
                          {addr.strDivision}, {addr.strCountry}
                        </Paragraph>
                        <Paragraph>
                          Zip/Post Code: {addr.strZipOrPostCode}
                        </Paragraph>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </TabPane>


        {/* Education */}
        <TabPane tab="Education" key="4">
          {empEmployeeEducation.length === 0 ? (
            <Empty description="No education records found" />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={empEmployeeEducation}
              renderItem={(edu) => (
                <List.Item
                  key={edu.intEmployeeEducationId}
                  style={{
                    marginBottom: 16,
                    border: "1px solid #f0f0f0",
                    borderRadius: 6,
                    padding: 16,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <List.Item.Meta
                    title={
                      <Text strong>
                        {edu.strEducationDegree || "Education Degree"}
                      </Text>
                    }
                    description={edu.strInstituteName || "Institute"}
                  />
                  <div>
                    Field of Study: {edu.strEducationFieldOfStudy || "N/A"}
                  </div>
                  <div>
                    CGPA: {edu.strCgpa || "N/A"} / {edu.strOutOf || "N/A"}
                  </div>
                  <div>
                    Duration: {formatDate(edu.dteStartDate)} -{" "}
                    {formatDate(edu.dteEndDate)}
                  </div>
                </List.Item>
              )}
            />
          )}
        </TabPane>

        {/* Job Experience */}
        <TabPane tab="Work Experience" key="5">
          {empJobExperience.length === 0 ? (
            <Empty description="No work experience found" />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={empJobExperience}
              renderItem={(job) => (
                <List.Item
                  key={job.intJobExperienceId}
                  style={{
                    marginBottom: 16,
                    border: "1px solid #f0f0f0",
                    borderRadius: 6,
                    padding: 16,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <List.Item.Meta
                    title={<Text strong>{job.strJobTitle || "Job Title"}</Text>}
                    description={job.strCompanyName || "Company"}
                  />
                  <div>Location: {job.strLocation || "N/A"}</div>
                  <div>
                    Duration: {formatDate(job.dteFromDate)} -{" "}
                    {job.dteToDate ? formatDate(job.dteToDate) : "Present"}
                  </div>
                  <div>Description: {job.strDescription || "N/A"}</div>
                </List.Item>
              )}
            />
          )}
        </TabPane>

        {/* Training */}
        <TabPane tab="Training And Development" key="6">
          {empEmployeeTraining.length === 0 ? (
            <Empty description="No training records found" />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={empEmployeeTraining}
              renderItem={(train) => (
                <List.Item
                  key={train.intTrainingId}
                  style={{
                    marginBottom: 16,
                    border: "1px solid #f0f0f0",
                    borderRadius: 6,
                    padding: 16,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <List.Item.Meta
                    title={
                      <Text strong>
                        {train.strTrainingTitle || "Training Title"}
                      </Text>
                    }
                    description={train.strInstituteName || "Institute"}
                  />
                  <div>
                    Duration: {formatDate(train.dteStartDate)} -{" "}
                    {formatDate(train.dteEndDate)}
                  </div>
                  <div>Expiry Date: {formatDate(train.dteExpiryDate)}</div>
                </List.Item>
              )}
            />
          )}
        </TabPane>

        <TabPane tab="Relatives Contact" key="7">
          {empEmployeeRelativesContact.length === 0 ? (
            <Empty description="No relatives contact found" />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={empEmployeeRelativesContact}
              renderItem={(rel) => (
                <List.Item
                  key={
                    rel.intEmployeeRelativesContactId ||
                    rel.intEmployeeRelativeId
                  }
                  style={{
                    marginBottom: 16,
                    border: "1px solid #f0f0f0",
                    borderRadius: 6,
                    padding: 16,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <List.Item.Meta
                    title={
                      <Text strong>
                        {rel.strGrantorNomineeType || "Contact"}
                      </Text>
                    }
                    description={<Text>{rel.strRelativesName || "Name"}</Text>}
                  />
                  <div>Relation: {rel.strRelationship || "N/A"}</div>
                  <div>Contact: {rel.strPhone || "N/A"}</div>
                  {rel.strEmail && <div>Email: {rel.strEmail}</div>}
                  {rel.strAddress && <div>Address: {rel.strAddress}</div>}
                  {rel.strNid && <div>NID: {rel.strNid}</div>}
                  {rel.strRemarks && <div>Remarks: {rel.strRemarks}</div>}
                  {rel.dteDateOfBirth && (
                    <div>
                      Date of Birth:{" "}
                      {new Date(rel.dteDateOfBirth).toLocaleDateString()}
                    </div>
                  )}
                </List.Item>
              )}
            />
          )}
        </TabPane>

        {/* Social Media */}
        <TabPane tab="Social Media" key="8">
          {empSocialMedia.length === 0 ? (
            <Empty description="No social media info found" />
          ) : (
            <List
              dataSource={empSocialMedia}
              renderItem={(sm) => (
                <List.Item
                  key={sm.intSocialMediaId}
                  style={{
                    marginBottom: 16,
                    border: "1px solid #f0f0f0",
                    borderRadius: 6,
                    padding: 16,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <List.Item.Meta
                    title={<Text strong>{sm.strSocialMediaType}</Text>}
                    description={
                      <a
                        href={sm.strSocialMediaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {sm.strSocialMediaLink}
                      </a>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </TabPane>

        {/* Photo Identity */}
        <TabPane tab="Identity" key="9">
          {empEmployeePhotoIdentity ? (
            <Descriptions
              bordered
              column={1}
              size="small"
              labelStyle={labelStyle}
              contentStyle={{ fontSize: 14, paddingBottom: 12 }}
              style={{ background: "#fafafa", borderRadius: 6, padding: 16 }}
            >
              <Descriptions.Item label="NID" style={descriptionItemStyle}>
                {empEmployeePhotoIdentity.strNid || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Birth ID" style={descriptionItemStyle}>
                {empEmployeePhotoIdentity.strBirthId || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Passport" style={descriptionItemStyle}>
                {empEmployeePhotoIdentity.strPassport || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label="Nationality"
                style={descriptionItemStyle}
              >
                {empEmployeePhotoIdentity.strNationality || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Biography" style={descriptionItemStyle}>
                {empEmployeePhotoIdentity.strBiography || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Hobbies" style={descriptionItemStyle}>
                {empEmployeePhotoIdentity.strHobbies || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Active" style={descriptionItemStyle}>
                {empEmployeePhotoIdentity.isActive ? "Yes" : "No"}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Empty description="No photo identity info available" />
          )}
        </TabPane>
        {/* User Info */}
        <TabPane tab="User Info" key="12">
          {userVm ? (
            <Descriptions
              bordered
              column={1}
              size="small"
              labelStyle={labelStyle}
              contentStyle={{ fontSize: 14, paddingBottom: 12 }}
              style={{ background: "#fafafa", borderRadius: 6, padding: 16 }}
            >
              <Descriptions.Item label="Login ID" style={descriptionItemStyle}>
                {userVm.loginId || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="User Type" style={descriptionItemStyle}>
                {userVm.strUserType || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label="Office Mail"
                style={descriptionItemStyle}
              >
                <MailOutlined style={{ marginRight: 8 }} />
                {userVm.officeMail || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label="Personal Mobile"
                style={descriptionItemStyle}
              >
                <PhoneOutlined style={{ marginRight: 8 }} />
                {userVm.strPersonalMobile || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label="User Status"
                style={descriptionItemStyle}
              >
                <Text type={userVm.userStatus ? "success" : "danger"}>
                  {userVm.userStatus ? "Active" : "Inactive"}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Empty description="No user info available" />
          )}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default EmployeeViewModal;
