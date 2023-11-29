import { Radio, Form } from "antd";

export type RadioType = "radio" | "group";

export type RadioProperty = {
  type?: RadioType;
  options?: { label: string; value: number }[];
  onChange?: (e: any) => void;
  value?: any;
  defaultValue?: any;
  disabled?: boolean;
  name?: string;
  label?: string;
  rules?: any[];
  valuePropName?: string;
  hasFeedback?: boolean;
};

export const PRadio = (property: RadioProperty) => {
  const {
    type = "radio",
    options,
    onChange,
    value,
    defaultValue,
    disabled,
    name,
    label,
    rules,
    valuePropName,
    hasFeedback,
  } = property;

  const radioComponent =
    type === "group" ? (
      <Radio.Group
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        name={name}
      >
        {options?.map((option, index) => (
          <Radio key={index} value={option.value}>
            {option.label}
          </Radio>
        ))}
      </Radio.Group>
    ) : (
      <Radio onChange={onChange} value={value} disabled={disabled} name={name}>
        {options?.[0]?.label}
      </Radio>
    );

  return (
    <div className={`PeopleDeskRadioWrapper`}>
      <Form.Item
        label={label}
        name={name}
        rules={rules}
        valuePropName={valuePropName}
        hasFeedback={hasFeedback}
        style={{ marginBottom: 0 }}
      >
        {radioComponent}
      </Form.Item>
    </div>
  );
};
