import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { Switch } from "antd";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { updateUerAndEmpNameAction } from "../../../../commonRedux/auth/actions";
// import { createEditEmpAction, userExistValidation } from "../helper";
// import { submitHandler } from "./helper";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  pages,
}) {
  const dispatch = useDispatch();
  // const debounce = useDebounce();

  const { orgId, buId, employeeId, intUrlId, wgId, wId, intAccountId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  const [loading, setLoading] = useState(false);

  // states

  const [isUserCheckMsg, setIsUserCheckMsg] = useState("");

  // Pages Start From Here code from above will be removed soon

  // Form Instance
  const [form] = Form.useForm();

  useEffect(() => {
    if (singleData?.empId) {
      form.setFieldsValue(singleData);
    }
  }, [orgId, buId, singleData, employeeId]);

  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          // submitHandler({
          //   values,
          //   getData,
          //   // empBasic,
          //   resetForm: form.resetFields,
          //   pages,
          //   setIsAddEditForm,
          //   employeeId,
          //   dispatch,
          //   // updateUerAndEmpNameAction,
          //   isUserCheckMsg,
          //   createEditEmpAction,
          //   isEdit,
          //   orgId,
          //   buId,
          //   intUrlId,
          //   setLoading,
          // });
        }}
        initialValues={{}}
        onValuesChange={(changedFields, allFields) => {}}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="leaveType"
              label="Leave Type"
              placeholder="Leave Type"
              rules={[{ required: true, message: "Leave Type is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="leaveTypeCode"
              label="Leave Type Code"
              placeholder="Leave Type Code"
              rules={[
                { required: true, message: "Leave Type Code is required" },
              ]}
            />
          </Col>
          {isEdit && (
            <div className="col-12" style={{ marginLeft: "-0.5rem" }}>
              <div className="input-main position-group-select mt-4">
                <h6 className="title-item-name">Leave Type Activation</h6>
                <p className="subtitle-p">
                  Activation toggle indicates to the particular Leave Type
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
          }}
          submitAction="submit"
          loading={loading}
        />
      </PForm>
    </>
  );
}
