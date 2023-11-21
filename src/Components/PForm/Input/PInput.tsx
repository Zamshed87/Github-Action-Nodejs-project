import { Checkbox, DatePicker, Form, Input } from "antd";
import {
  InputProperty,
  InputType,
  onChange,
  onCheckBoxChange,
  onDateChange,
  onSearch,
  onTextAreaChange,
} from "../TForm";
import "../styles.scss";

export const PInput = <T extends InputType>(property: InputProperty<T>) => {
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
    onPressEnter,
    onSearch,
    showCount,
    minLength,
    maxLength,
    allowClear,
    autoSize,
  } = property;

  const renderInput = (type?: InputType) => {
    return type === "date" ? (
      <DatePicker
        placeholder={placeholder || "DD/MM/YYYY"}
        onChange={onChange as onDateChange}
        disabled={disabled}
        suffixIcon={suffix}
        value={value}
        style={{ width: "100%" }}
        format={"DD/MM/YYYY"}
        allowClear={allowClear}
      />
    ) : type === "checkbox" ? (
      <Checkbox
        onChange={onChange as onCheckBoxChange}
        disabled={disabled}
        value={value}
        checked={checked}
      />
    ) : type === "search" ? (
      <Input.Search
        placeholder={placeholder}
        onChange={onChange as onChange}
        defaultValue={defaultValue}
        disabled={disabled}
        prefix={prefix}
        suffix={suffix}
        value={value}
        onSearch={onSearch as onSearch}
        allowClear={allowClear}
      />
    ) : type === "textarea" ? (
      <Input.TextArea
        placeholder={placeholder}
        onChange={onChange as onTextAreaChange}
        onPressEnter={onPressEnter}
        showCount={showCount}
        defaultValue={defaultValue}
        disabled={disabled}
        value={value}
        minLength={minLength}
        maxLength={maxLength}
        allowClear={allowClear}
        autoSize={autoSize}
      />
    ) : (
      <Input
        placeholder={placeholder}
        onChange={onChange as onChange}
        onPressEnter={onPressEnter}
        defaultValue={defaultValue}
        disabled={disabled}
        prefix={prefix}
        suffix={suffix}
        allowClear={allowClear}
        value={value}
        type={type || "text"}
      />
    );
  };

  return (
    <div className="PeopleDeskInputWrapper">
      <Form.Item
        label={label}
        name={name}
        rules={rules}
        valuePropName={type === "checkbox" ? "checked" : valuePropName}
        hasFeedback={hasFeedback}
        style={{ marginBottom: 0 }}
      >
        {renderInput(type)}
      </Form.Item>
    </div>
  );
};

const CheckboxS = () => {
  return (
    <>
      <PInput type="search" onChange={(e) => {}} />
    </>
  );
};

export default CheckboxS;
