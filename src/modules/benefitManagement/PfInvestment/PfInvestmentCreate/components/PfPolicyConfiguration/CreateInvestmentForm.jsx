import { Col, Form, Row } from "antd";
import { toast } from "react-toastify";
import { ModalFooter } from "Components/Modal";
import { PInput } from "Components";

const CreateInvestmentForm = ({
  type = 1, // 1 = Investment Type, 2 = Organization
  onCreate,
  setOpen,
}) => {
  const [form] = Form.useForm();

  const onCancel = () => {
    setOpen({ open: false, type: 0 });
  };

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        await onCreate(values, () => {
          form.resetFields();
          onCancel();
        });
      })
      .catch(() => {
        toast.error("Please fill the form correctly");
      });
  };

  return (
    <>
      <Form form={form} layout="vertical">
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24} xs={24}>
            <PInput
              type="text"
              name={type === 1 ? "investmentName" : "organizationName"}
              label={type === 1 ? "Investment Name" : "Investment To Organization"}
              placeholder={
                type === 1
                  ? "Enter Investment Name"
                  : "Enter Investment To Organization"
              }
              rules={[
                {
                  required: true,
                  message:
                    type === 1
                      ? "Investment Name is required"
                      : "Organization Name is required",
                },
              ]}
            />
          </Col>
          <Col md={12} sm={24} xs={24}>
            <PInput
              type="text"
              name="remark"
              label="Comment"
              placeholder="Enter Remark"
            />
          </Col>
        </Row>
      </Form>
      <ModalFooter onCancel={onCancel} onSubmit={onSubmit} />
    </>
  );
};

export default CreateInvestmentForm;
