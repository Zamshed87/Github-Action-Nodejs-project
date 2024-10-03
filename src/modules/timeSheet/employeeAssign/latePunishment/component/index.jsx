import { Form } from "antd";
import { PForm, PSelect } from "Components";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";

const AddEditForm = ({
  setIsAddEditForm,
  getData,
  empIDString,
  setCheckedList,
}) => {
  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      resetForm();
      setIsAddEditForm(false);
      getData();
      setCheckedList([]);
    };
    const payload = {
      latePunishmentPolicyId: values?.policy?.value,
      employeeList: empIDString,
      actionBy: employeeId,
    };
    PolicyAssignApi.action({
      urlKey: "AssignEmployeeToLatePunishmentPolicy",
      method: "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
    });
  };

  const [form] = Form.useForm();

  const policyDDLApi = useApiRequest({});

  const PolicyAssignApi = useApiRequest({});

  const PolicyDDLApiCall = () => {
    policyDDLApi.action({
      urlKey: "GetLatePunishmentPoliciesDdl",
      method: "GET",
      params: {
        AccountId: orgId,
        BusinessUnitId: buId,
      },
    });
  };

  useEffect(() => {
    PolicyDDLApiCall();
  }, [buId, wgId]);

  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          submitHandler({
            values,
            getData,
            resetForm: form.resetFields,
            setIsAddEditForm,
          });
        }}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PSelect
              options={policyDDLApi?.data?.length > 0 ? policyDDLApi?.data : []}
              name="policy"
              label="Late Policy"
              placeholder="Late Policy"
              onChange={(value, op) => {
                form.setFieldsValue({
                  policy: op,
                });
              }}
              rules={[
                {
                  required: true,
                  message: "Late Policy is required",
                },
              ]}
            />
          </Col>
        </Row>

        <ModalFooter
          onCancel={() => {
            setIsAddEditForm(false);
            getData();
            setCheckedList([]);
          }}
          submitAction="submit"
          //loading={loading}
        />
      </PForm>
    </>
  );
};

export default AddEditForm;
