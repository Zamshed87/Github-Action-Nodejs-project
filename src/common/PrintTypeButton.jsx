import { PCardHeader, PSelect } from "Components";
import React from "react";

const PrintTypeButton = ({ title = "", form, onClick }) => {
  return (
    <PCardHeader
      title={title}
      buttonList={[
        {
          type: "primary",
          content: "Print",
          onClick: onClick,
        },
      ]}
    >
      <PSelect
        options={[
          { label: "Excel", value: 1 },
          { label: "PDF", value: 2 },
        ]}
        name="printType"
        label={""}
        placeholder="Select Print Type"
        onChange={(value, op) => {
          form.setFieldsValue({ printType: op });
        }}
      />
    </PCardHeader>
  );
};

export default PrintTypeButton;
