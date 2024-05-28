import { PForm, PInput, PSelect } from "Components";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  getEmployeDepartment,
  getEmployeDesignation,
  getEmploymentType,
  getWorkplace,
} from "../utility/utils";
import moment from "moment";
import { toast } from "react-toastify";

type TCreateEditForm = {
  setOpen: any;
  landingApi: () => void;
  data: any;
  setData: any;
};
const CreateEditForm: React.FC<TCreateEditForm> = ({
  setOpen,
  landingApi,
  data,
  setData,
}) => {
  // Data From Store
  const { buId, wgId, wId, employeeId, intAccountId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const [form] = Form.useForm();

  // Api Actions
  const createEditSeparationSetupApi = useApiRequest({});
  const workplaceDDLApi = useApiRequest([]);
  const empDepartmentDDLApi = useApiRequest([]);
  const empDesignationDDLApi = useApiRequest([]);
  const employmentTypeDDLApi = useApiRequest([]);

  // Life Cycle Hooks
  useEffect(() => {
    getWorkplace({ workplaceDDLApi, buId, wgId, employeeId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  useEffect(() => {
    if (data?.intSeparationPolicyTypeId) {
      const modifyData = {
        workplace: data?.intWorkplaceId && {
          label: data?.strWorkplaceName,
          value: data?.intWorkplaceId,
        },
        department: {
          label: data?.strDepartmentName,
          value: data?.intDepartmentId,
        },
        designation: {
          label: data?.strDesignationName,
          value: data?.intDesignationId,
        },
        days: data?.intNoticePeriodDayId,
        employeeType: data?.intEmploymentType && {
          label: data?.strEmploymentTypeName,
          value: data?.intEmploymentType,
        },
      };
      form.setFieldsValue(modifyData);
      getEmployeDepartment({ form, empDepartmentDDLApi, buId, wgId });
      getEmployeDesignation({
        form,
        empDesignationDDLApi,
        intAccountId,
        buId,
        wgId,
      });
      getEmploymentType({ form, employmentTypeDDLApi, buId, wgId });
    }
  }, [data?.intSeparationPolicyTypeId]);

  return (
    <PForm
      form={form}
      onFinish={() => {
        const values = form.getFieldsValue();
        if (values?.days < 0)
          return toast.warn("Periods In Days Must Be Positive", {
            toastId: "PeriodsInDays",
          });
        createEditSeparationSetupApi.action({
          method: "post",
          urlKey: "SaveSeparationSetup",
          payload: {
            intSeparationPolicyTypeId: data?.intSeparationPolicyTypeId || 0,
            intAccountId: intAccountId,
            intWorkplaceId: values?.workplace?.value,
            intDesignationId: values?.designation?.value || 0,
            intDepartmentId: values?.department?.value || 0,
            intNoticePeriodDayId: values?.days,
            isActive: true,
            intCreatedBy: employeeId,
            dteUpdatedAt: moment().format("YYYY-MM-DD"),
            intUpdatedBy: employeeId,
            intEmploymentType: values?.employeeType?.value,
          },
          toast: true,
          onSuccess: (res) => {
            if (res) {
              setOpen(false);
              landingApi();
              setData({});
            }
          },
        });
      }}
    >
      <Row gutter={[10, 2]}>
        <Col md={8} sm={24}>
          <PSelect
            name="workplace"
            placeholder="Workplace"
            allowClear={true}
            rules={[{ required: true, message: "Workplace Is Required" }]}
            options={workplaceDDLApi?.data}
            label="Workplace"
            showSearch={true}
            onChange={(value: any, option: any) => {
              form.setFieldsValue({
                workplace: option,
                department: undefined,
                designation: undefined,
                hrPosition: undefined,
                employeeType: undefined,
              });
              if (value) {
                getEmployeDepartment({ form, empDepartmentDDLApi, buId, wgId });
                getEmployeDesignation({
                  form,
                  empDesignationDDLApi,
                  intAccountId,
                  buId,
                  wgId,
                });
                getEmploymentType({ form, employmentTypeDDLApi, buId, wgId });
              } else {
                empDepartmentDDLApi.reset();
                empDesignationDDLApi.reset();
                employmentTypeDDLApi.reset();
              }
            }}
            disabled={data?.isView}
          />
        </Col>
        <Col md={8} sm={24}>
          <PSelect
            options={employmentTypeDDLApi?.data || []}
            name="employeeType"
            label="Employment Type"
            placeholder="Employment Type"
            onChange={(value, op) => {
              form.setFieldsValue({
                employeeType: op,
              });
            }}
            rules={[{ required: true, message: "Employment Type is required" }]}
            disabled={data?.isView}
          />
        </Col>
        <Col md={8} sm={24}>
          <PSelect
            options={empDepartmentDDLApi?.data || []}
            name="department"
            showSearch
            filterOption={true}
            label="Department"
            allowClear
            placeholder="Department"
            onChange={(value, op) => {
              form.setFieldsValue({
                department: op,
              });
            }}
            rules={[{ required: true, message: "Department is required" }]}
            disabled={data?.isView}
          />
        </Col>
        <Col md={8} sm={24}>
          <PSelect
            options={empDesignationDDLApi.data || []}
            showSearch
            filterOption={true}
            name="designation"
            label="Designation"
            placeholder="Designation"
            onChange={(value, op) => {
              form.setFieldsValue({
                designation: op,
              });
              console.log(op);
            }}
            rules={[{ required: true, message: "Designation is required" }]}
            disabled={data?.isView}
          />
        </Col>
        <Col md={8} sm={24}>
          <PInput
            type="number"
            name="days"
            label="Periods In Days"
            placeholder="Periods In Days"
            rules={[
              {
                required: true,
                message: "Period In Days is required",
              },
            ]}
            onChange={(e: any) => {
              if (e && e.target && e.target.value !== undefined) {
                const inputValue = parseFloat(e.target.value);
                if (!isNaN(inputValue) && inputValue >= 0) {
                  // Set the field value only if it's a non-negative number
                  if (form) {
                    form.setFieldsValue({
                      days: inputValue,
                    });
                  }
                } else {
                  // Handle the case when the input is not a non-negative number
                  if (form) {
                    form.setFieldsValue({
                      days: 0,
                    });
                  }
                }
              }
            }}
            disabled={data?.isView}
          />
        </Col>
      </Row>
      <ModalFooter
        submitText={data?.isView && false}
        submitAction="submit"
        onCancel={() => {
          setOpen(false);
          setData({});
        }}
        loading={createEditSeparationSetupApi?.loading}
      />
    </PForm>
  );
};

export default CreateEditForm;
