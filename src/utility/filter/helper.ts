import { FormInstance } from "antd";

export const formatFilterValue = (
  value: number | string | (number | string)[] | null | undefined
): string | number => {
  console.log(value);
  if (value === null || value === undefined) {
    return 0;
  } else if (Array.isArray(value)) {
    return value.length > 0 ? value.join(",") : 0;
  } else if (
    (typeof value === "number" || typeof value === "string") &&
    value !== 0
  ) {
    return value;
  } else {
    return 0;
  }
};

export const setCustomFieldsValue = (
  form: FormInstance<any>,
  field: any,
  value: any
) => {
  const lastValue = value[value.length - 1];
  if (lastValue === "") {
    // If the last value is 0, set the field to only 0
    form.setFieldsValue({
      [field]: [""],
    });
    return;
  } else if (value.includes("")) {
    // If 0 is present but it's not the last value, remove it
    const filteredValues = value.filter((v: any) => v !== "");
    form.setFieldsValue({
      [field]: filteredValues,
    });
    return;
  }

  if (lastValue === 0) {
    // If the last value is 0, set the field to only 0
    form.setFieldsValue({
      [field]: [0],
    });
  } else if (value.includes(0)) {
    // If 0 is present but it's not the last value, remove it
    const filteredValues = value.filter((v: any) => v !== 0);
    form.setFieldsValue({
      [field]: filteredValues,
    });
  } else {
    // Otherwise, set the field to the given value
    form.setFieldsValue({
      [field]: value,
    });
  }
};
