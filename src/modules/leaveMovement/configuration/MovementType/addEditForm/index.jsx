import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { Switch } from "antd";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";
import { quotaFrequencyDDL } from "../helper";
// import { updateUerAndEmpNameAction } from "../../../../commonRedux/auth/actions";
// import { createEditEmpAction, userExistValidation } from "../helper";
// import { submitHandler } from "./helper";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
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
    if (singleData) {
      // getLeaveTypeById(setSingleData, id, setLoading);
      form.setFieldsValue({ ...singleData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);
  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      console.log("callback calling...");
      resetForm();
      setIsAddEditForm(false);
      getData();
    };
    let payload = {
      intMovementTypeId: singleData?.intMovementTypeId
        ? singleData?.intMovementTypeId
        : 0,
      strMovementType: values?.strMovementType,
      strMovementTypeCode: values?.strMovementTypeCode,
      intQuotaHour: values?.intQuotaHour,
      intQuotaFrequency: values?.intQuotaFrequency?.value,
      isActive: true,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
    };

    saveLeaveType.action({
      urlKey: "SaveLveMovementType",
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
              name="strMovementType"
              label="Movement Type Name"
              placeholder="Movement Type Name"
              rules={[
                { required: true, message: "Movement Type Name is required" },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strMovementTypeCode"
              label="Movement Type Code"
              placeholder="Movement Type Code"
              rules={[
                { required: true, message: "Movement Type Code is required" },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="number"
              name="intQuotaHour"
              label="Quota Hour"
              placeholder="Quota Hour"
              rules={[
                { required: true, message: "Quota Hour is required" },
                {
                  message: "Quota Hour must be positive",
                  pattern: new RegExp(/^[+]?([.]\d+|\d+([.]\d+)?)$/),
                },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={quotaFrequencyDDL || []}
              name="intQuotaFrequency"
              label="Quota Frequency"
              placeholder="Quota Frequency"
              onChange={(value, op) => {
                form.setFieldsValue({
                  intQuotaFrequency: op,
                });
              }}
              rules={[
                { required: true, message: "Quota Frequency is required" },
              ]}
            />
          </Col>
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
