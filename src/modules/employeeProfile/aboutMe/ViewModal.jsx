import { Modal, Tabs, Descriptions, List, Empty, Typography } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Avatar } from "@material-ui/core";
import { Folder } from "@mui/icons-material";
import { APIUrl } from "App";
import NocSlider from "../employeeOverview/components/documents/NocSlider";
import { gray900 } from "utility/customColor";

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
      if (!modified?.hasOwnProperty(key) && !original?.hasOwnProperty(key))
        diffMap[key] = false;
      else if (!modified?.hasOwnProperty(key) || !original?.hasOwnProperty(key))
        diffMap[key] = true;
      else diffMap[key] = modified[key] !== original[key];
    }
  }
  return diffMap;
}

function contactInformationTitle(key) {
  let result = "Contact";
  switch (key) {
    case "Emergency":
      result = "Emergency Contact";
      break;
    case "Nominee":
      result = "Nominee Information";
      break;
    case "Grantor":
      result = "Father/Mother Information";
      break;
    case "Reference":
      result = "Guarantor/Reference Information";
      break;
    default:
      break;
  }
  return result;
}

const EmployeeViewModal = ({ visible, onClose, empData, originalData }) => {
  if (!empData) return null;

  const {
    employeeProfileLandingView,
    empEmployeeAddress = [],
    empEmployeeEducation = [],
    empJobExperience = [],
    empEmployeeTraining = [],
    empEmployeeRelativesContact = [],
    empSocialMedia = [],
    empDocumentManagement = [],
    empEmployeePhotoIdentity,
    userVm,
  } = empData;

  const {
    employeeProfileLandingView: originalEmployeeProfileLandingView = {},
    empEmployeePhotoIdentity: originalEmpEmployeePhotoIdentity = {},
    empSocialMedia: originalEmpSocialMedia = [],
  } = originalData || {};

  const diffMap = getDiffMap(
    originalEmployeeProfileLandingView,
    employeeProfileLandingView
  );
  const diffMapPI = getDiffMap(
    originalEmpEmployeePhotoIdentity,
    empEmployeePhotoIdentity
  );
  const diffSocialMedia = !(
    empSocialMedia?.length === originalEmpSocialMedia?.length &&
    empSocialMedia[0]?.strSocialMedialLink ===
      originalEmpSocialMedia[0]?.strSocialMedialLink
  );

  const descriptionItemStyle = { paddingBottom: 12, fontSize: 14 };
  const labelStyle = { fontWeight: 600, fontSize: 14 };

  const highlightStyle = { backgroundColor: "#fff8e1" }; // light yellow highlight
  const empContactInfoGroups =
    empEmployeeRelativesContact == null
      ? []
      : [
          ...new Map(
            empEmployeeRelativesContact.map((item) => [
              item.strGrantorNomineeType,
              item.strGrantorNomineeType,
            ])
          ).values(),
        ];

  return (
    <Modal
      title="Approval Data"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      bodyStyle={{ maxHeight: "75vh", overflowY: "auto", paddingTop: 0 }}
    >
      <Tabs
        defaultActiveKey="1"
        type="card"
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
        <TabPane tab="General Info" key="1">
          <Descriptions
            bordered
            column={1}
            size="middle"
            labelStyle={labelStyle}
            contentStyle={{ fontSize: 14, paddingBottom: 12 }}
            style={{ background: "#fafafa", borderRadius: 6, padding: 16 }}
          >
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
              label="Employee Signature"
              style={{
                ...descriptionItemStyle,
                ...(diffMapPI?.intSignatureFileUrlId ? highlightStyle : {}),
              }}
            >
              {empEmployeePhotoIdentity?.intSignatureFileUrlId ? (
                <div
                  style={{
                    width: "100px",
                    objectFit: "cover",
                  }}
                >
                  <img
                    src={`${APIUrl}/Document/DownloadFile?id=${empEmployeePhotoIdentity?.intSignatureFileUrlId}`}
                    alt="Profile"
                    width="60px"
                    height="40px"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <>N/A</>
              )}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Contact & Places" key="2">
          <>
            <Descriptions
              bordered
              column={1}
              size="middle"
              labelStyle={labelStyle}
              contentStyle={{ fontSize: 14, paddingBottom: 12 }}
              style={{ background: "#fafafa", borderRadius: 6, padding: 16 }}
            >
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
                label="Office Mobile"
                style={{
                  ...descriptionItemStyle,
                  ...(diffMap?.strOfficeMobile ? highlightStyle : {}),
                }}
              >
                <PhoneOutlined style={{ marginRight: 8 }} />
                {employeeProfileLandingView?.strOfficeMobile || "N/A"}
              </Descriptions.Item>
              {empEmployeeAddress?.length === 0 ? (
                <Descriptions.Item
                  label="Address"
                  style={{
                    ...descriptionItemStyle,
                    ...highlightStyle,
                  }}
                >
                  No addresses found
                </Descriptions.Item>
              ) : (
                empEmployeeAddress?.map((addr, indexAddr) => (
                  <Descriptions.Item
                    key={indexAddr}
                    label={`${addr?.strAddressType} Address`}
                    style={{
                      ...descriptionItemStyle,
                      ...highlightStyle,
                    }}
                  >
                    <Paragraph style={{ marginBottom: 4 }}>
                      {addr?.strAddressDetails}
                    </Paragraph>
                    <Paragraph style={{ marginBottom: 4 }}>
                      {addr?.strPostOffice}
                    </Paragraph>
                    <Paragraph style={{ marginBottom: 4 }}>
                      {addr?.strThana}, {addr?.strDistrictOrState},{" "}
                      {addr?.strDivision}, {addr?.strCountry}
                    </Paragraph>
                    <Paragraph>
                      Zip/Post Code: {addr?.strZipOrPostCode}
                    </Paragraph>
                  </Descriptions.Item>
                ))
              )}
            </Descriptions>
          </>
        </TabPane>
        <TabPane tab="Identification" key="3">
          <Descriptions
            bordered
            column={1}
            size="middle"
            labelStyle={labelStyle}
            contentStyle={{ fontSize: 14, paddingBottom: 12 }}
            style={{ background: "#fafafa", borderRadius: 6, padding: 16 }}
          >
            <Descriptions.Item
              label="NID"
              style={{
                ...descriptionItemStyle,
                ...(diffMapPI?.strNid ? highlightStyle : {}),
              }}
            >
              {empEmployeePhotoIdentity?.strNid || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Birth ID"
              style={{
                ...descriptionItemStyle,
                ...(diffMapPI?.strBirthId ? highlightStyle : {}),
              }}
            >
              {empEmployeePhotoIdentity?.strBirthId || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Nationality"
              style={{
                ...descriptionItemStyle,
                ...(diffMapPI?.strNationality ? highlightStyle : {}),
              }}
            >
              {empEmployeePhotoIdentity?.strNationality || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Passport"
              style={{
                ...descriptionItemStyle,
                ...(diffMapPI?.strPassport ? highlightStyle : {}),
              }}
            >
              {empEmployeePhotoIdentity?.strPassport || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Driving License No."
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.drivingLicenseNo ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.drivingLicenseNo || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="TIN No."
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.tinNo ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.tinNo || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Card No"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strCardNumber ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.strCardNumber || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Work Experience" key="4">
          {empJobExperience?.length === 0 ? (
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
                    title={
                      <Text strong>{job?.strJobTitle || "Job Title"}</Text>
                    }
                    description={job?.strCompanyName || "Company"}
                  />
                  <div>Location: {job?.strLocation || "N/A"}</div>
                  <div>
                    Duration: {formatDate(job?.dteFromDate)} -{" "}
                    {job?.dteToDate ? formatDate(job?.dteToDate) : "Present"}
                  </div>
                  <div>Description: {job?.strDescription || "N/A"}</div>
                  <div>
                    {job?.intNocUrlId > 0 && (
                      <div className="common-slider">
                        <div className="slider-main" style={{ height: "auto" }}>
                          <NocSlider
                            item={{ intFileUrlId: job?.intNocUrlId }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </List.Item>
              )}
            />
          )}
        </TabPane>
        <TabPane tab="Training & Development" key="5">
          {empEmployeeTraining?.length === 0 ? (
            <Empty description="No training records found" />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={empEmployeeTraining}
              renderItem={(train) => (
                <List.Item
                  key={train?.intTrainingId}
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
                        {train?.strTrainingTitle || "Training Title"}
                      </Text>
                    }
                    description={train?.strInstituteName || "Institute"}
                  />
                  <div>
                    Duration: {formatDate(train?.dteStartDate)} -{" "}
                    {formatDate(train?.dteEndDate)}
                  </div>
                  <div>Expiry Date: {formatDate(train?.dteExpiryDate)}</div>
                  <div>
                    {train?.intTrainingFileUrlId > 0 && (
                      <div className="common-slider">
                        <div className="slider-main" style={{ height: "auto" }}>
                          <NocSlider
                            item={{ intFileUrlId: train?.intTrainingFileUrlId }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </List.Item>
              )}
            />
          )}
        </TabPane>
        <TabPane tab="Education" key="6">
          {empEmployeeEducation?.length === 0 ? (
            <Empty description="No education records found" />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={empEmployeeEducation}
              renderItem={(edu) => (
                <List.Item
                  key={edu?.intEmployeeEducationId}
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
                        {edu?.strEducationDegree || "Education Degree"}
                      </Text>
                    }
                    description={
                      (edu?.strInstituteName || "Institute") +
                      (edu?.isForeign ? " (Foreign)" : "")
                    }
                  />
                  <div>
                    Field of Study: {edu?.strEducationFieldOfStudy || "N/A"}
                  </div>
                  <div>
                    CGPA: {edu?.strCgpa || "N/A"} / {edu?.strOutOf || "N/A"}
                  </div>
                  <div>
                    Duration: {formatDate(edu?.dteStartDate)} -{" "}
                    {formatDate(edu?.dteEndDate)}
                  </div>
                  <div>
                    {edu?.intCertificateFileUrlId > 0 && (
                      <div className="common-slider">
                        <div className="slider-main" style={{ height: "auto" }}>
                          <NocSlider
                            item={{
                              intFileUrlId: edu?.intCertificateFileUrlId,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </List.Item>
              )}
            />
          )}
        </TabPane>
        <TabPane tab="Contact Information" key="7">
          {empEmployeeRelativesContact?.length === 0 ? (
            <Empty description="No contact information was found" />
          ) : (
            <>
              {empContactInfoGroups.map((groupTitle, groupKey) => (
                <>
                  <h1 className="mt-2 mb-1" style={{ fontSize: "18px" }}>
                    {contactInformationTitle(groupTitle)}
                  </h1>
                  <List
                    key={groupKey}
                    itemLayout="vertical"
                    dataSource={empEmployeeRelativesContact.filter(
                      (rc) => rc.strGrantorNomineeType === groupTitle
                    )}
                    renderItem={(rel) => (
                      <List.Item
                        key={
                          rel?.intEmployeeRelativesContactId ||
                          rel?.intEmployeeRelativeId
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
                          title={<Text>{rel?.strRelativesName || "Name"}</Text>}
                          description={
                            <Text>
                              Relation: {rel?.strRelationship || "N/A"}
                            </Text>
                          }
                        />
                        <div>Contact: {rel?.strPhone || "N/A"}</div>
                        {rel?.strEmail && <div>Email: {rel?.strEmail}</div>}
                        {rel?.strAddress && (
                          <div>Address: {rel?.strAddress}</div>
                        )}
                        {rel?.strNid && <div>NID: {rel?.strNid}</div>}
                        {rel?.strBirthId && (
                          <div>Birth Certificate Id: {rel?.strBirthId}</div>
                        )}
                        {rel?.strRemarks && (
                          <div>Remarks: {rel?.strRemarks}</div>
                        )}
                        {rel?.dteDateOfBirth && (
                          <div>
                            Date of Birth:{" "}
                            {new Date(rel?.dteDateOfBirth).toLocaleDateString()}
                          </div>
                        )}
                      </List.Item>
                    )}
                  />
                </>
              ))}
            </>
          )}
        </TabPane>
        <TabPane tab="Documents" key="8">
          {empDocumentManagement?.length === 0 ? (
            <Empty description="No document records found" />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={empDocumentManagement}
              renderItem={(edm, edmIndex) => (
                <List.Item
                  key={edmIndex}
                  style={{
                    marginBottom: 16,
                    border: "1px solid #f0f0f0",
                    borderRadius: 6,
                    padding: 16,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <div className="row row-exp-details">
                    <div className="col-lg-1">
                      <Avatar className="overviewAvatar">
                        <Folder
                          sx={{
                            color: gray900,
                            fontSize: "18px",
                          }}
                        />
                      </Avatar>
                    </div>
                    <div className="col-lg-10 exp-info">
                      <h4>{edm?.strDocumentType}</h4>
                      {edm?.intFileUrlId > 0 && (
                        <div className="common-slider">
                          <div
                            className="slider-main"
                            style={{ height: "auto" }}
                          >
                            <NocSlider item={edm} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </TabPane>
        <TabPane tab="Others" key="9">
          <Descriptions
            bordered
            column={1}
            size="middle"
            labelStyle={labelStyle}
            contentStyle={{ fontSize: 14, paddingBottom: 12 }}
            style={{ background: "#fafafa", borderRadius: 6, padding: 16 }}
          >
            <Descriptions.Item
              label="Biography"
              style={{
                ...descriptionItemStyle,
                ...(diffMapPI?.strBiography ? highlightStyle : {}),
              }}
            >
              {empEmployeePhotoIdentity?.strBiography
                ? empEmployeePhotoIdentity?.strBiography
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Social Media"
              style={{
                ...descriptionItemStyle,
                ...(diffSocialMedia ? highlightStyle : {}),
              }}
            >
              {empSocialMedia?.length > 0
                ? empSocialMedia[0]?.strSocialMedialLink
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Hobbies"
              style={{
                ...descriptionItemStyle,
                ...(diffMapPI?.strHobbies ? highlightStyle : {}),
              }}
            >
              {empEmployeePhotoIdentity?.strHobbies
                ? empEmployeePhotoIdentity?.strHobbies
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Vehicle No."
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.vehicleNo ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.vehicleNo || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Remarks"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.remarks ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.remarks || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Salary Type"
              style={{
                ...descriptionItemStyle,
                ...(diffMap?.strSalaryTypeName ? highlightStyle : {}),
              }}
            >
              {employeeProfileLandingView?.strSalaryTypeName || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default EmployeeViewModal;
