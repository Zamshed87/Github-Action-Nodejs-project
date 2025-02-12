import React from "react";
import { Form, Input, Select, Row, Col } from "antd";
import { PInput, PSelect } from "Components";

const CommonForm = ({ formConfig, form, children }) => {
  const renderField = (field) => {
    if (field.type === "ddl") {
      return (
        <PSelect
          {...field}
          options={field.ddl || []}
          name={field.varname}
          label={field.label}
          placeholder={field.placeholder}
          onChange={(value, op) => {
            form.setFieldsValue({
              [field.varname]: op,
            });
            field?.onChange && field.onChange(value, op);
          }}
          allowClear
          rules={field.rules}
        />
      );
    } else {
      return (
        <PInput
          {...field}
          type={field.type}
          placeholder={field.placeholder}
          name={field.varname}
          label={field.label}
          rules={field.rules}
          disabled={field.disabled}
        />
      );
    }
  };

  return (
    <Row gutter={16} className="mb-3">
      {formConfig.map((field, index) => (
        <Col span={field.col || 6} key={index}>
          {renderField(field)}
        </Col>
      ))}
      {children}
    </Row>
  );
};

export default CommonForm;
