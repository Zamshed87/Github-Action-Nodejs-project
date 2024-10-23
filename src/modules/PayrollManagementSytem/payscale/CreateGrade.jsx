import { PButton } from "Components";
import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect } from "react";

import { shallowEqual, useSelector } from "react-redux";

export default function CreateGrade({
  getData,
  modalFooter = false,
  setOpen = {},
  singleData = {},
}) {
  const createGrade = useApiRequest({});
  const jobClassDDL = useApiRequest({});

  const getJobClassDDL = () => {
    jobClassDDL?.action({
      urlKey: "GetJobClassDdl",
      method: "get",
      params: {
        accountId: orgId,
        businessUnitId: buId,
      },

      // onSuccess: () => {},
    });
  };
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
          jobGradeName: values?.grade,
          jobClassId: values?.jobClass?.value,
          accountId: orgId,
          businessunitId: buId,
          actionBy: employeeId,
        };
        createGrade.action({
          urlKey: "CreateJobGrade",
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
    getJobClassDDL();
  }, []);
  useEffect(() => {
    if (singleData?.id) {
      form.setFieldsValue({
        jobClass: {
          value: singleData?.jobClassName,
          label: singleData?.jobClassName,
        },
        grade: singleData?.jobGradeName,
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
      jobGradeName: values?.grade,
      jobClassId: values?.jobClass?.value,
      accountId: orgId,
      businessunitId: buId,
      actionBy: employeeId,
    };
    createGrade.action({
      urlKey: singleData?.id ? "UpdateJobGrade" : "CreateJobGrade",
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
          <Col md={24} sm={24}>
            <PSelect
              name="jobClass"
              label="Job Class"
              placeholder="Select Job Class "
              options={jobClassDDL?.data?.length > 0 ? jobClassDDL?.data : []}
              loading={jobClassDDL?.loading}
              disabled={singleData?.id}
              onChange={(value, op) => {
                form.setFieldsValue({
                  jobClass: op,
                });
              }}
              filterOption={false}
              rules={[
                {
                  required: true,
                  message: "Job Class is required",
                },
              ]}
            />
          </Col>
          <Col md={modalFooter ? 24 : 14} sm={24}>
            <PInput
              type="text"
              name="grade"
              label="Grade Name"
              min={0}
              placeholder="Grade Name"
              rules={[
                {
                  required: true,
                  message: "Grade Name is required",
                },
              ]}
            />
          </Col>
          {!modalFooter && (
            <>
              <Col span={3} className="my-3 pt-1">
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
            loading={createGrade?.loading}
            onCancel={() => {
              setOpen(false);
            }}
          />
        )}
      </PForm>
    </>
  );
}
