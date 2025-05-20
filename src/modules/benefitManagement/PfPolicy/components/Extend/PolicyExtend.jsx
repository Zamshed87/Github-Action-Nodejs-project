import { Col, Form, Row } from "antd";
import { PSelect } from "Components";
import { ModalFooter } from "Components/Modal";
// import useConfigSelectionHook from "../PfPolicyConfiguration/useConfigSelectionHook";
import PSelectWithAll from "Components/PForm/Select/PSelectWithAll";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "common/loading/Loading";
import { createPFPolicy } from "../../PfPolicyCreate/helper";

const PolicyExtend = ({ data, setOpenExtend }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // const {
  //   workplaceDDL,
  //   employmentTypeDDL,
  //   empDesignationDDL,
  //   getEmploymentTypeDDL,
  //   getEmployeeDesignation,
  // } = useConfigSelectionHook(form);
  const onCancel = () => {
    setOpenExtend({ extend: false, data: {} });
  };

  const onSubmit = () => {
    form.validateFields().then(async (values) => {
      const payload = {
        workplaceId: values?.workplaceId,
        employmentTypeList: values?.employmentTypeList,
        designationList: values?.designationList,
      };
      await createPFPolicy(payload, setLoading);
      setOpenExtend({ extend: false, data: {} });
    }).catch((error) => { 
      toast.error("Please fill the form correctly");
    });
  };

  return (
    <>
      {loading && <Loading />}
      <Form form={form} layout="vertical">
        {/* <Row gutter={[10, 2]}>
          <Col md={24} sm={24} xs={24}>
            <PSelect
              options={workplaceDDL.data}
              name="workplaceId"
              label="Workplace"
              placeholder="Select Workplace"
              onChange={(value) => {
                form.setFieldsValue({ workplace: value });
                getEmploymentTypeDDL();
                getEmployeeDesignation();
              }}
              loading={workplaceDDL.loading}
              rules={[{ required: true, message: "Workplace Is Required" }]}
            />
          </Col>
          <Col md={24} sm={24} xs={24}>
            <PSelectWithAll
              form={form}
              name="employmentTypeList"
              label="Employment Type"
              placeholder="Select Employment Type"
              options={employmentTypeDDL.data}
              loading={employmentTypeDDL.loading}
              advanceAllOption={true}
              rules={[
                { required: true, message: "Employment Type is required" },
              ]}
            />
          </Col>
         
        </Row> */}
      </Form>
      <ModalFooter onCancel={onCancel} onSubmit={onSubmit} />
    </>
  );
};

export default PolicyExtend;
