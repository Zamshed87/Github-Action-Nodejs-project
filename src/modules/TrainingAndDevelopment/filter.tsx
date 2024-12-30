import { Drawer } from "antd";
import { PButton, PForm } from "Components";
import React from "react";

const Filter = ({ form, children }: any) => {
  const [openFilter, setOpenFilter] = React.useState(false);
  return (
    <div>
      <PButton
        style={{ marginBottom: "15px" }}
        type="primary"
        content={"Filter"}
        onClick={() => {
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
