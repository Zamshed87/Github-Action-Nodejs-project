import { ModalFooter } from "Components/Modal";
import { PForm, PInput } from "Components/PForm";
import { Col, Form, Row } from "antd";
import { useState } from "react";

import { shallowEqual, useSelector } from "react-redux";
import { createBonusSetup } from "../../helper";

export default function AddEditForm({ setOpen, getBounsList }) {
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  // Form Instance
  const [form] = Form.useForm();

  // submit
  const saveHandler = (values, cb) => {
    const payload = {
      strPartName: "BonusNameCreate",
      intBonusSetupId: 0,
      intBonusId: 0,
      strBonusName: values?.bonusName,
      strBonusDescription: "",
      intAccountId: orgId,
      intBusinessUnitId: buId,
      intReligion: 0,
      strReligionName: "",
      intEmploymentTypeId: 0,
      strEmploymentType: "",
      intMinimumServiceLengthMonth: 0,
      strBonusPercentageOn: "",
      numBonusPercentage: 0,
      intCreatedBy: employeeId,
      isActive: true,
    };

    const callBack = () => {
      cb();
      getBounsList();
      setOpen(false);
    };

    createBonusSetup(payload, setLoading, callBack);
  };

  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          saveHandler(values, () => {
            setOpen(false);
          });
        }}
        initialValues={{}}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="bonusName"
              label="Bonus Name"
              placeholder="Bonus Name"
              rules={[{ required: true, message: "Bonus Name is required" }]}
            />
          </Col>
        </Row>
        <ModalFooter
          onCancel={() => {
            setOpen(false);
          }}
          submitAction="submit"
          loading={loading}
        />
      </PForm>
    </>
  );
}
