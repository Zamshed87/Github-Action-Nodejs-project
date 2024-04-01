import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  TimePicker,
} from "antd";
import { InputProperty, InputType } from "../TForm";
import "../styles.scss";

export const PInput = <T extends InputType>(property: InputProperty<T>) => {
  const renderInput = <T extends InputType>(property: InputProperty<T>) => {
    const {
      type,
      placeholder,
      onChange,
      disabled,
      suffix,
      value,
      defaultValue,
      checked,
      onSearch,
      onPressEnter,
      showCount,
      minLength,
      maxLength,
      allowClear,
      autoSize,
      picker,
      label,
      name,
      rules,
      valuePropName,
      hasFeedback,
      prefix,
      layout,
      min,
      max,
      format,
      disabledDate,
    } = property;

    const Components =
      type === "date" ? (
        <DatePicker
          placeholder={placeholder || "DD/MM/YYYY"}
          onChange={onChange as (date: any, dateString: string) => void}
          disabled={disabled}
          suffixIcon={suffix}
          value={value}
          style={{ width: "100%" }}
          format={format || "DD/MM/YYYY"}
          // showTime={{ use12Hours: true }}
          allowClear={allowClear}
          disabledDate={disabledDate}
          picker={picker as "date" | "week" | "month" | "year"}
        />
      ) : type === "checkbox" ? (
        <Checkbox
          onChange={onChange as (e: any) => void}
          disabled={disabled}
          value={value}
          checked={checked}
        />
      ) : type === "time" ? (
        <TimePicker 
          value={value}
          disabled={disabled}
          onChange={onChange as (time: any) => void}  
          format={format || "HH:mm:ss"}
          style={{ width: "100%" }}
          />
          
      ) : type === "search" ? (
        <Input.Search
          placeholder={placeholder}
          onChange={onChange as (e: any) => void}
          defaultValue={defaultValue}
          disabled={disabled}
          prefix={prefix}
          suffix={suffix}
          value={value}
          onSearch={onSearch as (value: string) => void}
          allowClear={allowClear}
        />
      ) : type === "textarea" ? (
        <Input.TextArea
          placeholder={placeholder}
          onChange={onChange as (e: any) => void}
          onPressEnter={onPressEnter as (e: any) => void}
          showCount={showCount}
          defaultValue={defaultValue}
          disabled={disabled}
          value={value}
          minLength={minLength}
          maxLength={maxLength}
          allowClear={allowClear}
          autoSize={autoSize}
        />
      ) : type === "number" ? (
        <InputNumber
          placeholder={placeholder}
          onChange={onChange as (e: any) => void}
          onPressEnter={onPressEnter}
          defaultValue={defaultValue}
          disabled={disabled}
          prefix={prefix}
          value={value}
          type={"number"}
          min={min}
          max={max}
        />
      ) : type === "password" ? (
        <Input.Password
          placeholder={placeholder}
          onChange={onChange as (e: any) => void}
          onPressEnter={onPressEnter}
          defaultValue={defaultValue}
          disabled={disabled}
          prefix={prefix}
          suffix={suffix}
          allowClear={allowClear}
          value={value}
        />
      ) : (
        <Input
          placeholder={placeholder}
          onChange={onChange as (e: any) => void}
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

    return (
      <div
        className={`PeopleDeskInputWrapper ${
          type === "checkbox" ? "checkbox" : ""
        } ${layout ? layout : ""}`}
      >
        <Form.Item
          label={label}
          name={name}
          rules={rules}
          valuePropName={type === "checkbox" ? "checked" : valuePropName}
          hasFeedback={hasFeedback}
          style={{ marginBottom: 0 }}
          className={disabled ? "peopledesk_input_disabled" : ""}
        >
          {Components}
        </Form.Item>
      </div>
    );
  };
  return renderInput(property);
};

const CheckboxS = () => {
  return (
    <>
      <PInput type="checkbox" />
    </>
  );
};

export default CheckboxS;
