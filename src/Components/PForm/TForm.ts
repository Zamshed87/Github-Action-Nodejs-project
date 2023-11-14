import { FormInstance } from "antd/es/form";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { Moment } from "moment";
import { ChangeEvent } from "react";

type onFinishFailedParams = {
  values: any;
  errorFields: any[];
  outOfDate: boolean;
};
// Form Properties type
export type FormProperty = {
  initialValues?: { [key: string]: any };
  formName?: string;
  onFinish?: (values: any) => void;
  onFinishFailed: ({
    values,
    errorFields,
    outOfDate,
  }: onFinishFailedParams) => void;
  autoComplete?: "on" | "off" | string;
  form?: FormInstance;
  layout?: "horizontal" | "vertical" | "inline";
  onValuesChange?: (changedValues: any, allValues: any) => void;
  onFieldsChange?: (changedValues: any, allValues: any) => void;
  children?: React.ReactNode;
};

export type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "date"
  | "checkbox"
  | "textarea";

type picker = InputType extends "date"
  ? "date" | "week" | "month" | "quarter" | "year"
  : never;

type format = InputType extends "date"
  ?
      | string
      | ((value: moment.Moment) => string)
      | (string | ((value: moment.Moment) => string))[]
  : never;

// Make checked optional for non-"checkbox" InputType
type checked = InputType extends "checkbox" ? boolean : undefined;

// On Change types
export type onDateChange = (value?: Moment | any, dateString?: string) => void;

export type onChange = (e?: ChangeEvent<HTMLInputElement>) => void | any;
export type onCheckBoxChange = (e?: CheckboxChangeEvent) => void | any;

export type InputProperty<T extends InputType> = {
  type?: T;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  suffix?: React.ReactNode;
  value?: any;
  hasFeedback?: boolean;
  rules?: any[];
  name?: string;
  label?: string;
  valuePropName?: string;
  // Additional properties based on InputType
  onChange?: T extends "date"
    ? onDateChange
    : T extends "checkbox"
    ? onCheckBoxChange
    : onChange;
  prefix?: React.ReactNode;
  picker?: picker;
  format?: format;
  checked?: checked;
};


// --------------

// type InputType =
//   | "text"
//   | "password"
//   | "email"
//   | "number"
//   | "date"
//   | "checkbox"
//   | "textarea";

// type onDateChange = (value?: Moment | any, dateString?: string) => void;

// type onChange = (e?: ChangeEvent<HTMLInputElement>) => void | any;
// type onCheckBoxChange = (e?: CheckboxChangeEvent) => void | any;

// type FuncType<T extends InputType> = {
//   type: T;
//   onChange?: T extends "checkbox" ? onCheckBoxChange : onChange;
// };

// const func = <T extends InputType>({ type, onChange }: FuncType<T>) => {
//   // Your function logic here
// };

// // Example usage:
// const example1: FuncType<"text"> = {
//   type: "text",
//   onChange: (e) => console.log(e),
// };
// const example2: FuncType<"checkbox"> = {
//   type: "checkbox",
//   onChange: (e) => console.log(e),
// }; // onChange is of type onCheckBoxChange
