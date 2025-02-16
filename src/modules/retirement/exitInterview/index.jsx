import { FilterAltOutlined } from "@mui/icons-material";
import { Col, Drawer, Form, Row } from "antd";
import { paginationSize } from "common/peopleDeskTable";
import { PButton, PForm, PInput, PSelect } from "Components";
import moment from "moment";
import { useState } from "react";
import { formatDate, SearchFilter } from "./helper";

export default function ExitInterviewLanding() {
  const defaultFromDate = moment();
  const defaultToDate = moment().endOf("month");

  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const [openFilter, setOpenFilter] = useState(false);
  const [form] = Form.useForm();

  const getData = (pagination, searchText) => {
    const fromDate = formatDate(
      form.getFieldValue("fromDate") || defaultFromDate
    );
    const toDate = formatDate(form.getFieldValue("toDate") || defaultToDate);
    // Fetch data logic here
  };

  return (
    <div className="table-card businessUnit-wrapper dashboard-scroll">
      <div className="d-flex justify-content-between">
        <PButton
          size="small"
          type="primary"
          icon={<FilterAltOutlined />}
          content={"Filter"}
          onClick={() => {
            setOpenFilter(true);
          }}
        />
        <SearchFilter form={form} pages={pages} getData={getData} />
      </div>
      <Drawer
        title="Filter"
        onClose={() => setOpenFilter(false)}
        open={openFilter}
      >
        <PForm
          form={form}
          initialValues={{
            fromDate: defaultFromDate,
            toDate: defaultToDate,
            status: 0,
          }}
        >
          <Row gutter={[10, 2]}>
            <Col md={24} sm={12} xs={24}>
              <PSelect
                style={{ marginBottom: "5px" }}
                options={[]}
                name="status"
                label={"Status"}
                showSearch
                placeholder="Status"
                onChange={(value) => {
                  form.setFieldValue({
                    status: value,
                  });
                }}
                rules={[
                  {
                    required: true,
                    message: "Status is required",
                  },
                ]}
              />
            </Col>
            <Col md={12} sm={24}>
              <PInput
                type="date"
                name="fromDate"
                label="From Date"
                placeholder="From Date"
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
                placeholder="To Date"
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
            <Col md={6} sm={24}>
              <PButton
                style={{ marginTop: "15px" }}
                type="primary"
                content={"Filter"}
                onClick={() => {
                  const values = form.getFieldsValue(true);
                  form
                    .validateFields()
                    .then(() => {
                      getData(pages, values?.search);
                    })
                    .catch(() => {});
                }}
              />
            </Col>
            <Col md={6} sm={24}>
              <PButton
                style={{ marginTop: "15px" }}
                type="secondary"
                content="Reset"
                onClick={() => {
                  form.resetFields();
                }}
              />
            </Col>
          </Row>
        </PForm>
      </Drawer>
    </div>
  );
}
