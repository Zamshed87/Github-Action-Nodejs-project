import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import {
  DataTable,
  PButton,
  PForm,
  PInput,
  PSelect,
  TableButton,
} from "Components";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddEditForm = ({
  setIsAddEditForm,
  getData,
  empIDString,
  singleData,
}) => {
  const dispatch = useDispatch();

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      resetForm();
      setIsAddEditForm(false);
      getData();
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

  const [loading, setLoading] = useState(false);

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
      onSuccess: (res) => {
        // res.forEach((item, i) => {
        //   res[i].label = item?.LeaveType;
        //   res[i].value = item?.LeaveTypeId;
        // });
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
          <Col md={4} sm={24}>
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
          }}
          submitAction="submit"
          //loading={loading}
        />
      </PForm>
    </>
  );
};

export default AddEditForm;
