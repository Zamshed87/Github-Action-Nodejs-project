import { Col, Form, Row } from "antd";
import { ModalFooter } from "Components/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "common/loading/Loading";
import { createPFPolicy } from "../../PfInvestmentCreate/helper";
import { PInput } from "Components";

const CreateInvestmentType = ({ data, setOpenEdit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onCancel = () => {
    setOpenEdit({ open: false, data: {} });
  };

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const payload = {
        
        };
        await createPFPolicy(payload, setLoading, () => {
          form.resetFields();
          setOpenEdit({ open: false, data: {} });
        });
      })
      .catch((error) => {
        toast.error("Please fill the form correctly");
      });
  };

  return (
    <>
      {loading && <Loading />}
      <Form form={form} layout="vertical">
        <Row gutter={[10, 2]}>
          <Col md={24} sm={24} xs={24}>
            <PInput
              name="intWorkPlaceId"
              label="Workplace"
              placeholder="Select Workplace"
              onChange={(value) => {
                form.setFieldsValue({ intWorkPlaceId: value });
              }}
              rules={[{ required: true, message: "Workplace Is Required" }]}
            />
          </Col>
        </Row>
      </Form>
      <ModalFooter onCancel={onCancel} onSubmit={onSubmit} />
    </>
  );
};

export default CreateInvestmentType;
