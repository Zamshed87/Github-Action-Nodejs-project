import React from "react";
import { Form } from "antd";
import { FormProperty } from "../TForm";
export const PForm: React.FC<FormProperty> = (property) => {
  const {
    formName,
    initialValues,
    onFinish,
    onFinishFailed,
    autoComplete,
    form,
    layout,
    onValuesChange,
    onFieldsChange,
    children,
  } = property;
  return (
    <Form
      name={formName || "PeopleDeskForm"}
      initialValues={initialValues || {}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete={autoComplete || "off"}
      form={form}
      layout={layout}
      size="small"
      className="RMGFromWrapper"
      onValuesChange={onValuesChange}
      onFieldsChange={onFieldsChange}
    >
      <>{children}</>
    </Form>
  );
};
