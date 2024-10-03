import { PButton } from "Components";
import { PForm, PInput } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";

import { shallowEqual, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";

export default function ExpenseTypeCreate({ getData }) {
  const createExpenseType = useApiRequest({});

  const { orgId, employeeId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [form] = Form.useForm();

  const viewHandler = async () => {
    const cb = () => {
      form.resetFields();
      getData();
    };

    await form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue(true);
        const payload = {
          intExpenseTypeId: 0,
          strExpenseType: values?.expenseType,
          isActive: true,
          intAccountId: orgId,
          intCreatedBy: employeeId,
          dteCreatedAt: todayDate(),
          intWorkplaceId: wId,
        };
        createExpenseType.action({
          urlKey: "SaveEmpExpenseType",
          method: "POST",
          payload: payload,
          toast: true,
          onSuccess: () => {
            cb();
          },
        });
      })
      .catch(() => {
        console.error("Validate Failed:");
      });
  };
  return (
    <>
      <PForm form={form} initialValues={{}}>
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="expenseType"
              label="Expense Name"
              min={0}
              placeholder="Expense Name"
              rules={[
                {
                  required: true,
                  message: "Expense Name is required",
                },
              ]}
            />
          </Col>
          <Col span={3} className="my-3 pt-1">
            <PButton
              type="secondary"
              action="button"
              content="Cancel"
              onClick={() => getData()}
            />
          </Col>
          <Col span={2} className="my-3 pt-1">
            <PButton
              type="primary"
              onClick={() => {
                viewHandler();
              }}
              content="Add"
            />
          </Col>
        </Row>
      </PForm>
    </>
  );
}
