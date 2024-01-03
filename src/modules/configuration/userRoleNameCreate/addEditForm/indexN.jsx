import { ModalFooter } from "Components/Modal";
import { PForm, PInput } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { Switch } from "antd";

import { shallowEqual, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  isEdit,
  id,
  setId,
}) {
  console.log("getData",getData)
  const getSingleData = useApiRequest({});
  const saveUserRole = useApiRequest({});

  const { orgId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  // states
  // Form Instance
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      getSingleData.action({
        urlKey: "GetUserRoleById",
        method: "GET",
        params: {
          id: id,
        },
        onSuccess: (res) => {
          form.setFieldsValue({
            userRole: res?.strRoleName,
            isActive: res?.isActive,
          });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const submitHandler = ({ values, getData, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      // resetForm();
      setIsAddEditForm(false);
      getData();
      console.log("calling...");
    };
    let payload = {
      intRoleId: id || 0,
      strRoleName: values?.userRole,
      isActive: values?.isActive,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
    };

    saveUserRole.action({
      urlKey: "SaveUserRole",
      method: "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
    });
  };

  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          submitHandler({
            values,
            getData,
            resetForm: form.resetFields,
            setIsAddEditForm,
            isEdit,
          });
        }}
        initialValues={{}}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="userRole"
              label="User Role Name"
              placeholder="User Role Name"
              rules={[
                { required: true, message: "User Role Name is required" },
              ]}
            />
          </Col>

          {isEdit && (
            <div className="col-12" style={{ marginLeft: "-0.5rem" }}>
              <div className="input-main position-group-select mt-4">
                <h6 className="title-item-name">User Role Type Activation</h6>
                <p className="subtitle-p">
                  Activation toggle indicates to the particular user role type
                  status (Active/Inactive)
                </p>
                <Form.Item name="isActive" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </div>
            </div>
          )}
        </Row>
        <ModalFooter
          onCancel={() => {
            setIsAddEditForm(false);
            setId({});
          }}
          submitAction="submit"
          loading={loading}
        />
      </PForm>
    </>
  );
}
