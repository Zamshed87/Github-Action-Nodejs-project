import { Col, Form, Row } from "antd";
import { ModalFooter } from "Components/Modal";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { PInput } from "Components";

const CreateEditInvestmentType = ({
  data,
  setOpenEdit,
  createInvestmentType,
  updateInvestmentType,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!data?.typeId;

  const onCancel = () => {
    setOpenEdit({ open: false, data: {}, create: false });
  };

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({
        investmentName: data?.investmentName ?? "",
        remark: data?.remark ?? "",
      });
    } else {
      form.resetFields();
    }
  }, [data, form, isEdit]);

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const payload = {
          ...values,
          ...(isEdit && {
            typeId: data?.typeId,
            businessUnitId: data?.businessUnitId,
            workplaceGroupId: data?.workplaceGroupId,
          }),
        };

        const callback = () => {
          form.resetFields();
          setOpenEdit({ open: false, data: {}, create: false });
        };

        if (isEdit) {
          await updateInvestmentType(payload, callback);
        } else {
          await createInvestmentType(payload, callback);
        }
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
              name="investmentName"
              label="Investment Name"
              placeholder="Enter Investment Name"
              rules={[
                { required: true, message: "Investment Name is required" },
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

export default CreateEditInvestmentType;