import {
  CheckboxProps,
  FormItemProps,
  InputNumberProps,
  InputProps,
} from "antd";
import { FormInstance } from "antd/es/form";
import { PickerProps } from "antd/lib/date-picker/generatePicker";
import { Moment } from "moment";
import React from "react";

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
  onFinishFailed?: ({
    values,
    errorFields,
    outOfDate,
  }: onFinishFailedParams) => void;
  autoComplete?: "on" | "off" | string;
  form?: FormInstance;
  layout?: "horizontal" | "vertical" | "inline";
  onValuesChange?: (changedValues: any, allValues: any) => void;
  onFieldsChange?: (changedValues: any, allValues: any) => void;
  children?: any;
};

// export type InputType =
//   | "text"
//   | "password"
//   | "email"
//   | "number"
//   | "date"
//   | "checkbox"
//   | "textarea"
//   | "search";

// type picker = InputType extends "date"
//   ? "date" | "week" | "month" | "quarter" | "year"
//   : never;

// type format = InputType extends "date"
//   ?
//       | string
//       | ((value: moment.Moment) => string)
//       | (string | ((value: moment.Moment) => string))[]
//   : never;

// // Make checked optional for non-"checkbox" InputType
// type checked = InputType extends "checkbox" ? boolean : undefined;

// // On Change types
// export type onDateChange = (value?: Moment | any, dateString?: string) => void;
// export type onCheckBoxChange = (e?: CheckboxChangeEvent) => void | any;
// export type onTextAreaChange = (e?: ChangeEvent<HTMLTextAreaElement>) => void;
// export type onChange = (e?: ChangeEvent<HTMLInputElement>) => void | any;
// export type onSearch = (value: any, event: any) => void;
// export type onPressEnter = (event: any) => void;
// type autoSize = boolean | { minRows: number; maxRows: number };
// type InputTypeMapping = {
//   text: onChange;
//   password: onChange;
//   email: onChange;
//   number: onChange;
//   date: onDateChange;
//   checkbox: onCheckBoxChange;
//   textarea: onTextAreaChange;
//   search: onChange;
// };

// export type InputProperty<T extends InputType> = {
//   placeholder?: string;
//   defaultValue?: string;
//   disabled?: boolean;
//   suffix?: React.ReactNode;
//   value?: any;
//   hasFeedback?: boolean;
//   rules?: any[];
//   name?: string;
//   label?: string;
//   valuePropName?: string;
//   allowClear?: boolean;
//   type?: T;
//   // Additional properties based on InputType
//   onChange?: T extends keyof InputTypeMapping ? InputTypeMapping[T] : never;
//   prefix?: React.ReactNode;
//   picker?: picker;
//   format?: format;
//   checked?: checked;
//   onSearch?: T extends "search" ? onSearch : never;
//   onPressEnter?: onPressEnter;
//   showCount?: T extends "textarea" ? boolean : never;
//   minLength?: T extends "textarea" ? number : never;
//   maxLength?: T extends "textarea" ? number : never;
//   autoSize?: T extends "textarea" ? autoSize : never;
// };

// All comments from above will be removed after testing

type BaseProps = FormItemProps & {
  placeholder?: string;
  suffix?: React.ReactNode;
  defaultValue?: string;
  checked?: boolean;
  onSearch?: (
    value: string,
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement, MouseEvent>
  ) => void;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  showCount?: boolean;
  minLength?: number;
  maxLength?: number;
  allowClear?: boolean;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  picker?: string;
  prefix?: React.ReactNode;
  layout?: "horizontal" | "vertical";
  min?: number;
  max?: number;
  format?: string;
  addOnBefore?: string;
  disabledDate?: (currentDate: Moment) => boolean;
};

type InputTypeMapping = {
  text: InputProps & BaseProps;
  password: InputProps & BaseProps;
  email: InputProps & BaseProps;
  number: InputNumberProps & BaseProps;
  date: PickerProps<Moment> & BaseProps;
  checkbox: CheckboxProps & BaseProps;
  textarea: InputProps & BaseProps;
  search: InputProps & BaseProps;
  time: InputProps & BaseProps;
};

export type InputType = keyof InputTypeMapping;

export type InputProperty<T extends InputType> = {
  type: T;
} & InputTypeMapping[T];
