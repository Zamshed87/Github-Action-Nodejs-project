import { FormInstance } from "antd";

export const formatFilterValue = (
  value: { value: number | string }[] | null | undefined
): string | number => {
  console.log(value);

  if (!value || value.length === 0) {
    return 0; // Return 0 if value is null, undefined, or an empty array
  } else if (Array.isArray(value)) {
    // Extract the 'value' property and join as a comma-separated string
    const extractedValues = value.map((item) => item.value);
    return extractedValues.length > 0 ? extractedValues.join(",") : 0;
  } else {
    return 0; // Fallback for unsupported input types
  }
};

export const setCustomFieldsValue = (
  form: FormInstance<any>,
  field: any,
  value: any
) => {
  console.log(value);
  const lastValue = value[value.length - 1]?.value;
  if (lastValue === "") {
    // If the last value is 0, set the field to only 0
    form.setFieldsValue({
      [field]: [{ label: "All", value: "" }],
    });
    return;
  } else if (value.includes("")) {
    // If 0 is present but it's not the last value, remove it
    const filteredValues = value.filter((v: any) => v?.value !== "");
    form.setFieldsValue({
      [field]: filteredValues,
    });
    return;
  }

  if (lastValue === 0) {
    // If the last value is 0, set the field to only 0
    form.setFieldsValue({
      [field]: [{ label: "All", value: 0 }],
    });
  } else if (value.some((v: any) => v?.value === 0)) {
    // If 0 is present but it's not the last value, remove it
    const filteredValues = value.filter((v: any) => v?.value !== 0);
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

export const formatFilterValueList = (
  value: { value: number | string }[] | null | undefined
): any[] => {
  if (!value || value.length === 0) {
    return [0]; // Return 0 if value is null, undefined, or an empty array
  } else if (Array.isArray(value)) {
    // Extract the 'value' property and join as a comma-separated string
    return value.map((item) => item.value);
  } else {
    return [0]; // Fallback for unsupported input types
  }
};
