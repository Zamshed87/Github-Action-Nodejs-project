import { Checkbox, DatePicker, Form, Input } from "antd";
import React from "react";
import {
  InputProperty,
  InputType,
  onChange,
  onCheckBoxChange,
  onDateChange,
} from "../TForm";
import "../styles.scss";

export const PInput: React.FC<InputProperty<'text'>> = (property) => {
  const {
    placeholder,
    onChange,
    defaultValue,
    disabled,
    suffix,
    prefix,
    value,
    label,
    name,
    rules,
    valuePropName,
    hasFeedback,
    type,
    checked,
  } = property;

  const renderInput = (type?: InputType) => {
    const renderDatePicker = (
      onChange: onDateChange | undefined
    ): React.ReactNode => (
      <DatePicker
        placeholder={placeholder}
        onChange={(date, dateString) => onChange && onChange(date, dateString)}
        className="rounded"
        disabled={disabled}
        suffixIcon={suffix}
        value={value}
      />
    );

    const renderCheckbox = (
      onChange: onCheckBoxChange | undefined
    ): React.ReactNode => (
      <Checkbox
        onChange={(e) => onChange && onChange(e)}
        className="rounded"
        disabled={disabled}
        value={value}
        checked={checked}
      />
    );

    const renderDefault = (onChange: onChange | undefined): React.ReactNode => (
      <Input
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e)}
        className="rounded"
        defaultValue={defaultValue}
        disabled={disabled}
        prefix={prefix}
        suffix={suffix}
        value={value}
        type=""
      />
    );

    switch (type) {
      case "date":
        return renderDatePicker(onChange as onDateChange);
      case "checkbox":
        return renderCheckbox(onChange as onCheckBoxChange);
      default:
        return renderDefault(onChange as onChange);
    }
  };

  return (
    <div className="PeopleDeskInputWrapper">
      <Form.Item
        label={label}
        name={name}
        rules={rules}
        valuePropName={valuePropName}
        hasFeedback={hasFeedback}
      >
        {renderInput(type)}
      </Form.Item>
    </div>
    // <Input
    //   placeholder={placeholder}
    //   onChange={onChange}
    //   className="rounded"
    //   defaultValue={defaultValue}
    //   disabled={disabled}
    //   prefix={prefix}
    //   suffix={suffix}
    //   value={value}
    // />
  );
};

const CheckboxS = () => {
  return (
    <>
      <PInput type="text" onChange={(e) => {}} />
    </>
  );
};

export default CheckboxS;

// export const PInput: React.FC<InputProperty<"text">> = (property) => {};
