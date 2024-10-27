import { PButton } from "Components";
import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect } from "react";

import { shallowEqual, useSelector } from "react-redux";

export default function CreateJobLevel({
  getData,
  modalFooter = false,
  setOpen = {},
  singleData = {},
}) {
  const createJobLevel = useApiRequest({});
  const jobClassDDL = useApiRequest({});
  const gradeDDL = useApiRequest({});

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
  const getGradeDDL = () => {
    const { jobClass } = form.getFieldsValue(true);
    gradeDDL?.action({
      urlKey: "GetJobGradeDdl",
      method: "get",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        jobClassId: jobClass?.value,
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
          jobLevelName: values?.joblevel,
          jobGradeId: values?.grade?.value,
          jobClassId: values?.jobClass?.value,
          accountId: orgId,
          businessunitId: buId,
          actionBy: employeeId,
        };
        createJobLevel.action({
          urlKey: "CreateJobLevel",
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
        grade: {
          value: singleData?.jobGradeName,
          label: singleData?.jobGradeName,
        },
        joblevel: singleData?.jobLevelName,
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
      jobLevelName: values?.joblevel,
      jobGradeId: values?.grade?.value,
      jobClassId: values?.jobClass?.value,
      accountId: orgId,
      businessunitId: buId,
      actionBy: employeeId,
    };
    createJobLevel.action({
      urlKey: singleData?.id ? "UpdateJobLevel" : "CreateJobLevel",
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
          <Col md={12} sm={24}>
            <PSelect
              name="jobClass"
              label="Payscale Class"
              placeholder="Select Payscale Class "
              options={jobClassDDL?.data?.length > 0 ? jobClassDDL?.data : []}
              loading={jobClassDDL?.loading}
              disabled={singleData?.id}
              onChange={(value, op) => {
                form.setFieldsValue({
                  jobClass: op,
                  grade: undefined,
                });
                getGradeDDL();
              }}
              filterOption={false}
              rules={[
                {
                  required: true,
                  message: "Payscale Class is required",
                },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              name="grade"
              label="Payscale Grade "
              placeholder="Select Payscale Grade"
              disabled={singleData?.id}
              options={gradeDDL?.data?.length > 0 ? gradeDDL?.data : []}
              loading={gradeDDL?.loading}
              onChange={(value, op) => {
                form.setFieldsValue({
                  grade: op,
                });
              }}
              filterOption={false}
              rules={[
                {
                  required: true,
                  message: "Payscale Grade is required",
                },
              ]}
            />
          </Col>
          <Col md={modalFooter ? 24 : 14} sm={24}>
            <PInput
              type="text"
              name="joblevel"
              label="Payscale Level"
              min={0}
              placeholder="Payscale Level"
              rules={[
                {
                  required: true,
                  message: "Payscale Level is required",
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
            loading={createJobLevel?.loading}
            onCancel={() => {
              setOpen(false);
            }}
          />
        )}
      </PForm>
    </>
  );
}
