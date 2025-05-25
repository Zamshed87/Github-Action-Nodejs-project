import React, { useEffect, useState } from "react";
import { FormInstance } from "antd/es/form";
import { PSelect } from "./PSelect";
import { useWatch } from "antd/lib/form/Form";

type OptionType = {
  label: string;
  value: string | number;
};

interface PSelectWithAllProps {
  form: FormInstance;
  name: string;
  options: OptionType[];
  label: string;
  placeholder?: string;
  loading?: boolean;
  rules?: any[];
  returnFullObject?: boolean;
  AllValueZero?: boolean;
}

const RAW_ALL_VALUE = "All";
const ADVANCED_ALL_VALUE = 0;

const PSelectWithAll: React.FC<PSelectWithAllProps> = ({
  form,
  name,
  options = [],
  label,
  placeholder = "Select options",
  loading = false,
  rules = [],
  returnFullObject = false,
  AllValueZero = false,
}) => {
  const allValues = options.map((opt) => opt.value);
  const allOption: OptionType = AllValueZero
    ? { label: RAW_ALL_VALUE, value: ADVANCED_ALL_VALUE }
    : { label: RAW_ALL_VALUE, value: RAW_ALL_VALUE };

  const fullOptions: OptionType[] = [allOption, ...options];

  const [selectedValues, setSelectedValues] = useState<(string | number)[]>([]);
  const watchedValue = useWatch(name, form);

  useEffect(() => {
    let selected = selectedValues;

    if (!AllValueZero && selected.includes(RAW_ALL_VALUE)) {
      selected = allValues;
    }

    const formValue = returnFullObject
    ? options.filter((opt) => selected.includes(opt.value))
    : selected;

    form.setFieldsValue({ [name]: formValue });
  }, [selectedValues, allValues, form, name, options, returnFullObject, AllValueZero]);

  useEffect(() => {
    if (!watchedValue || watchedValue.length === 0) {
      setSelectedValues([]);
    }
  }, [watchedValue]);
  
  
  const handleChange = (selected: (string | number)[]) => {
    if (AllValueZero) {
      if (selected.includes(ADVANCED_ALL_VALUE)) {
        setSelectedValues([ADVANCED_ALL_VALUE]);
      } else {
        setSelectedValues(selected);
      }
    } else {
      const hasAll = selected.includes(RAW_ALL_VALUE);
      const prevHasAll = selectedValues.includes(RAW_ALL_VALUE);

      if (hasAll && !prevHasAll) {
        setSelectedValues([RAW_ALL_VALUE, ...allValues]);
      } else if (hasAll && prevHasAll) {
        setSelectedValues([]);
      } else {
        setSelectedValues(selected.filter((val) => val !== RAW_ALL_VALUE));
      }
    }
  };

  const getDisplayValue = (): (string | number)[] => {
    if (!AllValueZero && selectedValues.includes(RAW_ALL_VALUE)) {
      return allValues;
    }
    return selectedValues;
  };

  const getOptionDisabled = (value: string | number): boolean => {
    if (AllValueZero) {
      return selectedValues.includes(ADVANCED_ALL_VALUE) && value !== ADVANCED_ALL_VALUE;
    }
    return selectedValues.includes(RAW_ALL_VALUE) && value !== RAW_ALL_VALUE;
  };

  const disabledOptions = fullOptions.map((opt) => ({
    ...opt,
    disabled: getOptionDisabled(opt.value),
  }));

  return (
    <PSelect
      mode="multiple"
      maxTagCount="responsive"
      name={name}
      label={label}
      placeholder={placeholder}
      options={disabledOptions}
      onChange={handleChange}
      value={getDisplayValue()}
      loading={loading}
      rules={rules}
      allowClear
    />
  );
};

export default PSelectWithAll;
