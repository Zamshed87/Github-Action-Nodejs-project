import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
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
  const [payrollDDL, setPayrollDDL] = useState([]);
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
  const getPayroll = () => {
    const { salaryType } = form.getFieldsValue(true);
    payrollElementDDL.action({
      urlKey: "GetAllPayrollElementType",
      method: "GET",
      params: {
        accountId: orgId,
        workplaceGroupId: wgId,
        workplaceId: wId,
        businessUnitId: buId,
      },
      onSuccess: (res) => {
        const additionDDL = res
          ?.filter((item) => item?.isAddition && !item?.isPrimarySalary)
          .map((itm) => {
            return {
              ...itm,
              value: itm?.intPayrollElementTypeId,
              label: itm?.strPayrollElementName,
            };
          });
        const deductionDDL = res
          ?.filter((item) => item?.isDeduction)
          .map((itm) => {
            return {
              ...itm,
              value: itm?.intPayrollElementTypeId,
              label: itm?.strPayrollElementName,
            };
          });
        if (salaryType?.value === 1) {
          setPayrollDDL(additionDDL);
        } else {
          setPayrollDDL(deductionDDL);
        }
      },
    });
  };

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
      isAddition: values?.salaryType?.value === 1 ? true : false,
    };

    saveApi.action({
      urlKey: singleData?.id
        ? "UpdatePayrollElementConfig"
        : "CreatePayrollElementConfig",
      method: singleData?.id ? "PUT" : "POST",
      payload: payload,
      toast: true,

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
        salaryType: {
          value: singleData?.salaryType === "Addition" ? 1 : 2,
          label: singleData?.salaryType,
        },
        days: singleData?.dividedByDays,

        divideBy:
          singleData?.dividedBy === "Fix Days"
            ? divideByDDL[0]
            : divideByDDL[1],
      });

      getPayroll();
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
              options={[
                {
                  value: 1,
                  label: "Addition",
                },
                {
                  value: 2,
                  label: "Deduction",
                },
              ]}
              name="salaryType"
              label="Salary Type"
              showSearch
              filterOption={true}
              placeholder="Salary Type"
              onChange={(value, op) => {
                form.setFieldsValue({
                  salaryType: op,
                  payrollElement: undefined,
                });
                getPayroll();
              }}
              rules={[{ required: true, message: "Salary Type is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={payrollDDL || []}
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
                    days: null,
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
                            message: "Range is between 0 to 31",
                            pattern: new RegExp(
                              /^(30(\.[0-9])?|[12]?[0-9](\.[0-9])?|31)$/
                            ),
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
          loading={saveApi?.loading}
        />
      </PForm>
    </>
  );
}
