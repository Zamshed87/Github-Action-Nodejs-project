import React from "react";
import { Form, Select, SelectProps } from "antd";

type SelectProperty = {
  label?: string | React.ReactNode;
  name?: string;
  rules?: any[];
  valuePropName?: string;
  hasFeedback?: boolean;
};
type PSelectProps = SelectProps & SelectProperty;

export const PSelectWithOutForm: React.FC<PSelectProps> = (props) => {
  const { showSearch } = props;
  return (
    <div className="PeopleDeskSelectWrapper">
      <Select
        style={{ width: "100%" }}
        {...props}
        popupClassName="PeopleDeskSelectPopup"
        dropdownStyle={{
          zIndex: 9999,
        }}
        filterOption={
          showSearch
            ? (input, option: any) => {
                return (
                  option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }
            : undefined
        }
        showSearch={showSearch || false}
      />
    </div>
  );
};
