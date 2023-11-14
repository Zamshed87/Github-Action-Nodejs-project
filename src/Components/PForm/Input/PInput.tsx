import { Checkbox, DatePicker, Form, Input } from "antd";
import {
  InputProperty,
  InputType,
  onChange,
  onCheckBoxChange,
  onDateChange,
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
  } = property;

  const renderInput = (type?: InputType) => {
    return type === "date" ? (
      <DatePicker
        placeholder={placeholder || "DD/MM/YYYY"}
        onChange={onChange as onDateChange}
        className="rounded"
        disabled={disabled}
        suffixIcon={suffix}
        value={value}
        style={{ width: "100%" }}
        format={"DD/MM/YYYY"}
      />
    ) : type === "checkbox" ? (
      <Checkbox
        onChange={onChange as onCheckBoxChange}
        className="rounded"
        disabled={disabled}
        value={value}
        checked={checked}
      />
    ) : type === "search" ? (
      <Input.Search
        placeholder={placeholder}
        onChange={onChange as onChange}
        className="rounded"
        defaultValue={defaultValue}
        disabled={disabled}
        prefix={prefix}
        suffix={suffix}
        value={value}
      />
    ) : (
      <Input
        placeholder={placeholder}
        onChange={onChange as onChange}
        className="rounded"
        defaultValue={defaultValue}
        disabled={disabled}
        prefix={prefix}
        suffix={suffix}
        value={value}
        type={type}
      />
    );
  };

  return (
    <div className="PeopleDeskInputWrapper">
      <Form.Item
        label={label}
        name={name}
        rules={rules}
        valuePropName={valuePropName || "checked"}
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
      <PInput type="text" onChange={(e) => {}} />
    </>
  );
};

export default CheckboxS;
