import { Col, Form, Row } from "antd";
import { ModalFooter } from "Components/Modal";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { PInput } from "Components";

const CreateInvestmentToOrganization = ({
  data,
  setOpenEdit,
  create,
  update,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!data?.typeId;

  const onCancel = () => {
    setOpenEdit({ open: false, data: {}, create: false });
  };

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({
        organizationName: data?.organizationName ?? "",
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
          await update(payload, callback);
        } else {
          await create(payload, callback);
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
              name="organizationName"
              label="Organization Name"
              placeholder="Enter Organization Name"
              rules={[
                { required: true, message: "Organization Name is required" },
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

export default CreateInvestmentToOrganization;