import { Col, Form, Row } from "antd";
import { ModalFooter } from "Components/Modal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "common/loading/Loading";
import { PInput } from "Components";

const CreateEditInvestmentType = ({
  data,
  setOpenEdit,
  createInvestmentType,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onCancel = () => {
    setOpenEdit({ open: false, data: {}, create: false });
  };

  useEffect(() => {
    if (data?.investmentName) {
      form.setFieldsValue({
        investmentName: data?.investmentName,
        remark: data?.remark,
      });
    } else {
      form.setFieldsValue({
        investmentName: "",
        remark: "",
      });
    }
  }, [data, form]);

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const payload = {
          investmentName: values.investmentName,
          remark: values.remark,
        };
        await createInvestmentType(payload, setLoading, () => {
          form.resetFields();
          setOpenEdit({ open: false, data: {}, create: false });
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
          <Col md={12} sm={24} xs={24}>
            <PInput
              name="investmentName"
              label="Investment Name"
              placeholder="Enter Investment Name"
              onChange={(value) => {
                form.setFieldsValue({ investmentName: value });
              }}
              rules={[
                { required: true, message: "Investment Name Is Required" },
              ]}
            />
          </Col>
          <Col md={12} sm={24} xs={24}>
            <PInput
              name="remark"
              label="Comment"
              placeholder="Enter Remark"
              onChange={(value) => {
                form.setFieldsValue({ remark: value });
              }}
            />
          </Col>
        </Row>
      </Form>
      <ModalFooter onCancel={onCancel} onSubmit={onSubmit} />
    </>
  );
};

export default CreateEditInvestmentType;
