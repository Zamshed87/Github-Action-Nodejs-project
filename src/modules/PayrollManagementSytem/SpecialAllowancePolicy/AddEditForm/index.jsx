import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect } from "react";
import { Switch } from "antd";

import { shallowEqual, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  // const debounce = useDebounce();
  const payrollElementDDL = useApiRequest({});
  const saveApi = useApiRequest({});
  const divideByDDL = [
    { value: "Fix Days", label: "Fix Days" },

    { value: "Month Days", label: "Month Days" },
  ];
  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // states

  // ddls
  useEffect(() => {
    payrollElementDDL.action({
      urlKey: "GetAllSalaryElementByAccountIdDDL",
      method: "GET",
      params: {
        accountId: orgId,
        workplaceGroupId: wgId,
        workplaceId: wId,
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId]);
  // Pages Start From Here code from above will be removed soon

  // Form Instance
  const [form] = Form.useForm();

  // submit
  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      resetForm();
      setIsAddEditForm(false);
      getData();
      setId("");
    };
    const payload = {
      id: singleData?.id || 0,

      accountId: orgId,
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      payrollElementTypeId: values?.payrollElement?.value,
      dividedBy: values?.divideBy?.value,
      dividedByDays: values?.days,
      actionBy: employeeId,
    };

    saveApi.action({
      urlKey: singleData?.id
        ? "UpdatePayrollElementConfig"
        : "CreatePayrollElementConfig",
      method: singleData?.id ? "PUT" : "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
    });
  };
  useEffect(() => {
    if (singleData?.id) {
      form.setFieldsValue({
        payrollElement: {
          value: singleData?.payrollElementTypeId,
          label: singleData?.payrollElementType,
        },
        days: singleData?.dividedByDays,
        divideBy:
          singleData?.dividedBy === "Fix Days"
            ? divideByDDL[0]
            : divideByDDL[1],
      });
    }
  }, [singleData]);
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
            isEdit,
          });
        }}
        initialValues={{}}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PSelect
              options={
                payrollElementDDL?.data?.length > 0
                  ? payrollElementDDL?.data
                  : []
              }
              name="payrollElement"
              label="Payroll Element"
              showSearch
              filterOption={true}
              placeholder="Payroll Element"
              onChange={(value, op) => {
                form.setFieldsValue({
                  payrollElement: op,
                });
              }}
              rules={[
                { required: true, message: "Payroll Element is required" },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={divideByDDL}
              name="divideBy"
              label="Divide Based On"
              placeholder="Divide Based On"
              onChange={(value, op) => {
                if (op?.value === "Fix Days") {
                  form.setFieldsValue({
                    divideBy: op,
                    days: 0,
                  });
                } else {
                  form.setFieldsValue({
                    divideBy: op,
                    days: 30,
                  });
                }
              }}
              rules={[
                { required: true, message: "Divide Based On is required" },
              ]}
            />
          </Col>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { divideBy } = form.getFieldsValue();

              return (
                <>
                  {divideBy?.value === "Fix Days" ? (
                    <Col md={12} sm={24}>
                      <PInput
                        type="number"
                        name="days"
                        label="Divided By Days"
                        placeholder="Divided By Days"
                        rules={[
                          {
                            required: divideBy?.value === "Fix Days",
                            message: "Divided By Days is required",
                          },
                          {
                            message: "Range is between 1 to 31",
                            pattern: new RegExp(/^([1-9]|[12][0-9]|3[01])$/),
                          },
                        ]}
                      />
                    </Col>
                  ) : null}
                </>
              );
            }}
          </Form.Item>
        </Row>
        <ModalFooter
          onCancel={() => {
            setId("");
            setIsAddEditForm(false);
          }}
          submitAction="submit"
        />
      </PForm>
    </>
  );
}
