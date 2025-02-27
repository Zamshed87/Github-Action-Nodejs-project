import { Col, Drawer, Row } from "antd";
import { PButton, PForm, PInput } from "Components";
import React from "react";
import CommonFilterField from "./commonFIlterField";
const PFilter = ({
  form,
  landingApiCall,
  resetApiCall,
  ishideDate,
  children,
}: any) => {
  const [openFilter, setOpenFilter] = React.useState(false);

  return (
    <div style={{ float: "right", marginRight: "10px" }}>
      <PButton
        style={{ marginBottom: "15px" }}
        size="small"
        type="primary"
        content={"Filter"}
        icon={<i className="fas fa-filter mr-1"></i>}
        onClick={() => {
          setOpenFilter(true);
        }}
      />
      <Drawer
        title="Filter"
        onClose={() => setOpenFilter(false)}
        open={openFilter}
      >
        <PForm
          form={form}
          initialValues={{
            bUnit: { label: "All", value: 0 },
            workplaceGroup: { label: "All", value: 0 },
            workplace: { label: "All", value: 0 },
            department: { label: "All", value: 0 },
            designation: { label: "All", value: 0 },
          }}
        >
          <Row gutter={[10, 2]}>
            {!ishideDate && (
              <>
                <Col md={12} sm={24}>
                  <PInput
                    type="date"
                    name="fromDate"
                    label="From Date"
                    onChange={(value) => {
                      form.setFieldsValue({
                        fromDate: value,
                      });
                    }}
                    rules={[
                      {
                        required: true,
                        message: "From Date is required",
                      },
                    ]}
                  />
                </Col>
                <Col md={12} sm={24}>
                  <PInput
                    type="date"
                    name="toDate"
                    label="To Date"
                    onChange={(value) => {
                      form.setFieldsValue({
                        toDate: value,
                      });
                    }}
                    rules={[
                      {
                        required: true,
                        message: "To Date is required",
                      },
                    ]}
                  />
                </Col>
              </>
            )}

            <CommonFilterField
              form={form}
              col={12}
              isDepartment={true}
              isDesignation={true}
              // mode="multiple"
            />

            {children}
            <Col md={6} sm={24}>
              <PButton
                style={{ marginTop: "20px" }}
                type="primary"
                content={"View"}
                onClick={() => {
                  const values = form.getFieldsValue(true);
                  form
                    .validateFields()
                    .then(() => {
                      console.log(values);
                      landingApiCall();
                    })
                    .catch(() => {});
                }}
              />
            </Col>
            <Col md={6} sm={24}>
              <PButton
                style={{ marginTop: "20px" }}
                type="secondary"
                content="Reset"
                onClick={() => {
                  const values = form.getFieldsValue(true);
                  form.resetFields();
                  form.setFieldsValue({
                    ...values,
                    bUnit: { label: "All", value: 0 },
                    bUnitId: [0],
                    workplaceGroup: { label: "All", value: 0 },
                    workplaceGroupId: [0],
                    workplace: { label: "All", value: 0 },
                    workplaceId: [0],
                    department: { label: "All", value: 0 },
                    departmentId: [0],
                    designation: { label: "All", value: 0 },
                    designationId: [0],
                  });
                  resetApiCall && resetApiCall();
                }}
              />
            </Col>
          </Row>
        </PForm>
      </Drawer>
    </div>
  );
};

export default PFilter;
