import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { Switch } from "antd";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";
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
  const getSingleData = useApiRequest({});
  const saveLeaveType = useApiRequest({});

  const { orgId, buId, employeeId, intUrlId, wgId, wId, intAccountId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  const [loading, setLoading] = useState(false);

  // states

  const [isUserCheckMsg, setIsUserCheckMsg] = useState("");

  // Pages Start From Here code from above will be removed soon

  // Form Instance
  const [form] = Form.useForm();

  useEffect(() => {
    if (singleData?.intLeaveTypeId) {
      // getLeaveTypeById(setSingleData, id, setLoading);
      getSingleData.action({
        urlKey: "GetAllLveLeaveTypeById",
        method: "GET",
        params: {
          id: singleData?.intLeaveTypeId,
        },
        onSuccess: (res) => {
          form.setFieldsValue({
            leaveType: res?.strLeaveType,
            leaveTypeCode: res?.strLeaveTypeCode,
            isActive: res?.isActive,
          });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData?.intLeaveTypeId]);
  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      console.log("callback calling...");
      resetForm();
      setIsAddEditForm(false);
      getData();
    };
    let payload = {
      intParentId: singleData?.intParentId || 0,
      strLeaveType: values?.leaveType,
      strLeaveTypeCode: values?.leaveTypeCode,
      intAccountId: orgId,
      isActive: values?.isActive,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
      intLeaveTypeId: singleData?.intLeaveTypeId || 0,
    };

    saveLeaveType.action({
      urlKey: "SaveLveLeaveType",
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
            <Col md={12} style={{ marginLeft: ".3rem" }}>
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
            </Col>
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
