/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { todayDate } from "../../../../utility/todayDate";
import { Row, Col, Form } from "antd";
import { createUser } from "../helper";
import { getPeopleDeskAllDDL } from "../../../../common/api/index";
import { PForm, PInput, PSelect } from "Components";
import { ModalFooter } from "Components/Modal";
import { Avatar } from "@mui/material";

type AddEditFormComponentNType = {
  singelUser: any;
  isCreate: any;
  onHide: any;
  getData: any;
};

const AddEditFormComponentN: React.FC<AddEditFormComponentNType> = ({
  singelUser,
  isCreate,
  onHide,
  getData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userTypeDDL, setUserTypeDDL] = useState([]);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const { employeeId, orgId, buId, intUrlId, wgId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=UserType&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}`,
      "intUserTypeId",
      "strUserType",
      setUserTypeDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (singelUser) {
      form.setFieldsValue({
        loginUserId: singelUser?.strLoginId || "",
        password: singelUser?.strPassword || "",
        confirmPassword: singelUser?.strPassword || "",
        email: singelUser?.strOfficeMail || "",
        phone: singelUser?.strPersonalMobile || "",
        isEdit: !isCreate,
        userType: {
          value: singelUser?.intUserTypeId || "",
          label: singelUser?.strUserType || "",
        },
        isActive: singelUser?.userStatus || false,
      });
    }
  }, [singelUser]);

  const onSubmit = () => {
    const { loginUserId, password, userType, isActive, email, phone } =
      form.getFieldsValue(true);
    const payload = {
      intUserId: isCreate ? 0 : singelUser?.intUserId,
      strLoginId: loginUserId,
      strPassword: password,
      strDisplayName: singelUser?.strEmployeeName,
      intUserTypeId: userType?.value,
      intRefferenceId: singelUser?.intEmployeeBasicInfoId, // empId
      isOfficeAdmin: userType?.value === 7 ? true : false,
      isSuperuser: false,
      intUrlId: intUrlId,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      intUpdatedBy: employeeId,
      strOldPassword: password,
      dteLastLogin: todayDate(),
      isOwner: false,
      isActive: isCreate ? true : isActive,
      dteUpdatedAt: todayDate(),
      intOfficeMail: email,
      strContactNo: phone,
    };
    createUser(payload, setLoading, () => {
      getData();
      onHide(true);
    });
  };

  return (
    <PForm onFinish={onSubmit} form={form}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center modal-body-title">
          <div className="py-1 px-0">
            <Avatar
              alt={"avatar"}
              src={""}
              sx={{
                backgroundColor: "#5BABEF",
                width: "40px",
                height: "40px",
                mr: 0,
              }}
            />
          </div>
          <div className="pl-2 ">
            <h6 className="title-item-name">
              {singelUser?.strEmployeeName} [{singelUser?.strEmployeeCode}]
            </h6>
            <p className="subtitle-p">{singelUser?.strEmploymentType}</p>
          </div>
        </div>
        {!isCreate && (
          <>
            {/* <div className="col-6 d-flex justify-content-end align-items-center "> */}
            <Col
              md={12}
              sm={24}
              // style={{ marginTop: "20px" }}
              className="d-flex justify-content-end align-items-center "
            >
              <PInput
                label="Is Active"
                type="checkbox"
                name="isActive"
                layout="horizontal"
              />
            </Col>
            {/* </div> */}
          </>
        )}
      </div>
      <Row gutter={[10, 2]}>
        <Col md={12} sm={24}>
          <PInput
            type="text"
            name="loginUserId"
            label="Login User ID"
            placeholder="Write Login User ID"
            rules={[{ required: true, message: "Login User ID is required" }]}
          />
        </Col>
        <Col md={12} sm={24}>
          <PInput
            type="email"
            name="email"
            label="Office Email"
            placeholder="Write Office Email"
            rules={[{ required: true, message: "Email is required" }]}
          />
        </Col>
        <Col md={12} sm={24}>
          <PInput
            type="password"
            name="password"
            label="Password"
            placeholder="Write Password"
            iconRender={() => <></>}
            rules={[{ required: true, message: "Password is required" }]}
          />
        </Col>
        <Col md={12} sm={24}>
          <PInput
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm Password"
            iconRender={() => <></>}
            rules={[
              { required: true, message: "Confirm Password is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          />
        </Col>

        <Col md={12} sm={24}>
          <PInput
            type="text"
            name="phone"
            label="Contact No."
            placeholder="Write Contact No"
            rules={[{ required: true, message: "Contact No is required" }]}
          />
        </Col>

        <Form.Item noStyle shouldUpdate>
          {() => {
            const values = form.getFieldsValue(true);
            return (
              <>
                <Col md={12} sm={24}>
                  <PSelect
                    allowClear
                    options={userTypeDDL || []}
                    name="userType"
                    label="User Type"
                    placeholder="Write userType"
                    rules={[
                      { required: true, message: "UserType is required" },
                    ]}
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        userType: op,
                      });
                    }}
                  />
                </Col>
              </>
            );
          }}
        </Form.Item>
      </Row>
      <ModalFooter
        submitAction="submit"
        onCancel={() => {
          onHide(false);
        }}
      />
    </PForm>
  );
};

export default AddEditFormComponentN;
