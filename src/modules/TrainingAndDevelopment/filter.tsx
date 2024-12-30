import { Col, Drawer, Row } from "antd";
import { PButton, PCard, PCardHeader, PForm, PInput } from "Components";
import React from "react";
import UserInfoCommonField from "./reports/userInfoCommonField";

const Filter = ({ form, children }: any) => {
  const [openFilter, setOpenFilter] = React.useState(false);
  return (
    <div>
      <PButton
        style={{ marginBottom: "15px" }}
        type="primary"
        content={"Filter"}
        onClick={() => {
          const values = form.getFieldsValue(true);
          setOpenFilter(true);
        }}
      />
      <Drawer
        title="Filter"
        onClose={() => setOpenFilter(false)}
        open={openFilter}
      >
        <PForm form={form} initialValues={{}}>
          {children}
        </PForm>
      </Drawer>
    </div>
  );
};

export default Filter;
