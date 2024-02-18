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

export const PSelect: React.FC<PSelectProps> = (props) => {
  const { name, label, rules, showSearch, hasFeedback, getPopupContainer } =
    props;
  return (
    <div className="PeopleDeskSelectWrapper">
      <Form.Item
        label={label}
        name={name}
        rules={rules}
        hasFeedback={hasFeedback}
        style={{ marginBottom: 0 }}
      >
        <Select
          {...props}
          getPopupContainer={
            typeof getPopupContainer === "undefined"
              ? undefined
              : typeof getPopupContainer
              ? getPopupContainer
              : (triggerNode) => triggerNode.parentNode
          }
          popupClassName="PeopleDeskSelectPopup"
          dropdownStyle={{
            zIndex: 9999,
          }}
          filterOption={
            showSearch
              ? (input, option: any) => {
                  return (
                    option?.label?.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                  );
                }
              : undefined
          }
          showSearch={showSearch || false}
        />
      </Form.Item>
    </div>
  );
};
