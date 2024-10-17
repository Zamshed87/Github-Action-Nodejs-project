import { PButton } from "Components";
import { ModalFooter } from "Components/Modal";
import { PForm, PInput } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect } from "react";

import { shallowEqual, useSelector } from "react-redux";

export default function CreateJobClass({
  getData,
  modalFooter = false,
  setOpen = {},
  singleData = {},
}) {
  const createJobClass = useApiRequest({});

  const { orgId, employeeId, buId } = useSelector(
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
          id: 0,
          jobClassName: values?.jobclassName,
          accountId: orgId,
          businessunitId: buId,
          actionBy: employeeId,
        };
        createJobClass.action({
          urlKey: "CreateJobClass",
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
  useEffect(() => {
    if (singleData?.id) {
      form.setFieldsValue({
        jobclassName: singleData?.jobClassName,
      });
    }
  }, [singleData]);
  const onFinish = () => {
    const cb = () => {
      form.resetFields();
      getData();
      setOpen(false);
    };
    const values = form.getFieldsValue(true);
    const payload = {
      id: singleData?.id || 0,
      jobClassName: values?.jobclassName,
      accountId: orgId,
      businessunitId: buId,
      actionBy: employeeId,
    };
    createJobClass.action({
      urlKey: singleData?.id ? "UpdateJobClass" : "CreateJobClass",
      method: singleData?.id ? "PUT" : "POST",
      payload: payload,
      toast: true,
      onSuccess: () => {
        cb();
      },
    });
  };

  return (
    <>
      <PForm form={form} initialValues={{}} onFinish={onFinish}>
        <Row gutter={[10, 2]}>
          <Col md={modalFooter ? 24 : 12} sm={24}>
            <PInput
              type="text"
              name="jobclassName"
              label="Job Class"
              min={0}
              placeholder="Job Class Name"
              rules={[
                {
                  required: true,
                  message: "Job Class Name is required",
                },
              ]}
            />
          </Col>
          {!modalFooter && (
            <>
              <Col span={5} className="my-3 pt-1">
                <PButton
                  type="secondary"
                  action="button"
                  content="Cancel"
                  onClick={() => getData()}
                />
              </Col>
              <Col span={5} className="my-3 pt-1">
                <PButton
                  type="primary"
                  onClick={() => {
                    viewHandler();
                  }}
                  content="Add"
                />
              </Col>
            </>
          )}
        </Row>
        {modalFooter && (
          <ModalFooter
            submitAction="submit"
            loading={createJobClass?.loading}
            onCancel={() => {
              setOpen(false);
            }}
          />
        )}
      </PForm>
    </>
  );
}
