import React from "react";
import { Modal, Tabs, Descriptions, List, Empty } from "antd";

const { TabPane } = Tabs;

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return "N/A";
  }
};

const EmployeeViewModal = ({ visible, onClose, empData }) => {
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

  return (
    <Modal
      title="Employee Profile Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      bodyStyle={{ maxHeight: "75vh", overflowY: "auto", paddingTop: 0 }}
    >
      <div style={{ marginTop: 0, paddingTop: 0 }}>
        <Tabs
          defaultActiveKey="1"
          type="line"
          size="middle"
          tabBarStyle={{
            position: "sticky",
            top: 0,
            background: "white",
            zIndex: 10,
            borderBottom: "1px solid #f0f0f0",
            marginTop: 0,
            paddingTop: 0,
          }}
        >
          {/* Basic Info */}
          <TabPane tab="Basic Info" key="1">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Name">
                {employeeProfileLandingView?.strEmployeeName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Employee Code">
                {employeeProfileLandingView?.strEmployeeCode || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Designation">
                {employeeProfileLandingView?.strDesignation || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                {employeeProfileLandingView?.strDepartment || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                {formatDate(employeeProfileLandingView?.dteDateOfBirth)}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {employeeProfileLandingView?.strGender || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Religion">
                {employeeProfileLandingView?.strReligion || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Marital Status">
                {employeeProfileLandingView?.strMaritalStatus || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Blood Group">
                {employeeProfileLandingView?.strBloodGroup || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Joining Date">
                {formatDate(employeeProfileLandingView?.dteJoiningDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Employment Type">
                {employeeProfileLandingView?.strEmploymentType || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Office Email">
                {employeeProfileLandingView?.strOfficeMail || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Personal Email">
                {employeeProfileLandingView?.strPersonalMail || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Personal Mobile">
                {employeeProfileLandingView?.strPersonalMobile || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {employeeProfileLandingView?.strEmployeeStatus || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Workplace">
                {employeeProfileLandingView?.strWorkplaceName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Business Unit">
                {employeeProfileLandingView?.strBusinessUnitName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Payroll Group">
                {employeeProfileLandingView?.strPayrollGroupName || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>

          {/* Addresses */}
          <TabPane tab="Addresses" key="2">
            {empEmployeeAddress.length === 0 ? (
              <Empty description="No addresses found" />
            ) : (
              <List
                itemLayout="vertical"
                dataSource={empEmployeeAddress}
                renderItem={(addr) => (
                  <List.Item key={addr.intEmployeeAddressId}>
                    <List.Item.Meta
                      title={`${addr.strAddressType || "Address"} Address`}
                      description={
                        <>
                          <div>{addr.strAddressDetails}</div>
                          <div>{addr.strPostOffice}</div>
                          <div>
                            {addr.strThana}, {addr.strDistrictOrState},{" "}
                            {addr.strDivision}, {addr.strCountry}
                          </div>
                          <div>Zip/Post Code: {addr.strZipOrPostCode}</div>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </TabPane>

          {/* Bank Details */}
          <TabPane tab="Bank Details" key="3">
            {empEmployeeBankDetail &&
            Object.keys(empEmployeeBankDetail).length > 0 ? (
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Account Name">
                  {empEmployeeBankDetail.strAccountName || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Account No">
                  {empEmployeeBankDetail.strAccountNo || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Bank/Wallet Name">
                  {empEmployeeBankDetail.strBankWalletName || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Branch Name">
                  {empEmployeeBankDetail.strBranchName || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Routing No">
                  {empEmployeeBankDetail.strRoutingNo || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="No bank details available" />
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
                  <List.Item key={edu.intEmployeeEducationId}>
                    <List.Item.Meta
                      title={edu.strEducationDegree || "Education Degree"}
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
          <TabPane tab="Job Experience" key="5">
            {empJobExperience.length === 0 ? (
              <Empty description="No job experience found" />
            ) : (
              <List
                itemLayout="vertical"
                dataSource={empJobExperience}
                renderItem={(job) => (
                  <List.Item key={job.intJobExperienceId}>
                    <List.Item.Meta
                      title={job.strJobTitle || "Job Title"}
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
          <TabPane tab="Training" key="6">
            {empEmployeeTraining.length === 0 ? (
              <Empty description="No training records found" />
            ) : (
              <List
                itemLayout="vertical"
                dataSource={empEmployeeTraining}
                renderItem={(train) => (
                  <List.Item key={train.intTrainingId}>
                    <List.Item.Meta
                      title={train.strTrainingTitle || "Training Title"}
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

          {/* Relatives Contact */}
          <TabPane tab="Relatives Contact" key="7">
            {empEmployeeRelativesContact.length === 0 ? (
              <Empty description="No relatives contact found" />
            ) : (
              <List
                dataSource={empEmployeeRelativesContact}
                renderItem={(rel) => (
                  <List.Item
                    key={
                      rel.intEmployeeRelativeId ||
                      rel.intEmployeeRelativesContactId
                    }
                  >
                    <List.Item.Meta
                      title={rel.strRelativeName || "Name"}
                      description={rel.strRelation || "Relation"}
                    />
                    <div>Contact: {rel.strContactNumber || "N/A"}</div>
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
                  <List.Item key={sm.intSocialMediaId}>
                    <List.Item.Meta
                      title={sm.strSocialMediaType}
                      description={sm.strSocialMediaLink}
                    />
                  </List.Item>
                )}
              />
            )}
          </TabPane>

          {/* Photo Identity */}
          <TabPane tab="Photo Identity" key="9">
            {empEmployeePhotoIdentity ? (
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Nationality">
                  {empEmployeePhotoIdentity.strNationality || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Biography">
                  {empEmployeePhotoIdentity.strBiography || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Hobbies">
                  {empEmployeePhotoIdentity.strHobbies || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Active">
                  {empEmployeePhotoIdentity.isActive ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {formatDate(empEmployeePhotoIdentity.dteCreatedAt)}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="No photo identity info available" />
            )}
          </TabPane>

          {/* Holiday Assignment */}
          <TabPane tab="Holiday Assignment" key="10">
            {holidayassignviewmodel ? (
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Holiday Group Name">
                  {holidayassignviewmodel.strHolidayGroupName || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Effective Date">
                  {formatDate(holidayassignviewmodel.dteEffectiveDate)}
                </Descriptions.Item>
                <Descriptions.Item label="Year">
                  {holidayassignviewmodel.intYear || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Active">
                  {holidayassignviewmodel.isActive ? "Yes" : "No"}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="No holiday assignment info" />
            )}
          </TabPane>

          {/* Offday Assignment */}
          <TabPane tab="Offday Assignment" key="11">
            {offdayassignviewmodel ? (
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Effective Date">
                  {formatDate(offdayassignviewmodel.dteEffectiveDate)}
                </Descriptions.Item>
                <Descriptions.Item label="Saturday">
                  {offdayassignviewmodel.isSaturday ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Sunday">
                  {offdayassignviewmodel.isSunday ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Monday">
                  {offdayassignviewmodel.isMonday ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Tuesday">
                  {offdayassignviewmodel.isTuesday ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Wednesday">
                  {offdayassignviewmodel.isWednesday ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Thursday">
                  {offdayassignviewmodel.isThursday ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Friday">
                  {offdayassignviewmodel.isFriday ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Active">
                  {offdayassignviewmodel.isActive ? "Yes" : "No"}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="No offday assignment info" />
            )}
          </TabPane>

          {/* User Info */}
          <TabPane tab="User Info" key="12">
            {userVm ? (
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Login ID">
                  {userVm.loginId || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="User Type">
                  {userVm.strUserType || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Office Mail">
                  {userVm.officeMail || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Personal Mobile">
                  {userVm.strPersonalMobile || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="User Status">
                  {userVm.userStatus ? "Active" : "Inactive"}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="No user info available" />
            )}
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default EmployeeViewModal;
