import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PSelect,
} from "Components";
import { Col, Form, Row } from "antd";
import { getHeader } from "./helper";
import useKpiMismatchFilters from "./hooks/useKpiMismatchFilters";
import useKpiMismatchReport from "./hooks/useKpiMismatchReport";

const KpiTargetMismatchReport = () => {
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const [form] = Form.useForm();

  const supervisor = Form.useWatch("supervisor", form);
  const department = Form.useWatch("department", form);
  const designation = Form.useWatch("designation", form);
  const year = Form.useWatch("year", form);

  const {
    // permissionList,
    profileData: { orgId, buId, wgId, wId, employeeId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const {
    supervisorDDL,
    getSuperVisors,
    departmentDDL,
    designationDDL,
    yearDDL,
  } = useKpiMismatchFilters({
    orgId,
    buId,
    wgId,
    wId,
    employeeId,
  });

  const { reportData, fetchKpiMismatchReport, loading } = useKpiMismatchReport({
    buId,
    wgId,
    wId,
  });

  return (
    <PForm
      form={form}
      initialValues={{
        isEnglish: true,
      }}
      onFinish={(values) => {
        fetchKpiMismatchReport({
          supervisorId:values?.supervisor?.value,
          departmentId:values?.department?.value,
          designationId:values?.designation?.value,
          year:values?.year?.value,
          pages,
        });
      }}
    >
      {loading && <Loading />}
      <PCard>
        <PCardHeader
          title={`Total Report ${reportData?.totalCount || 0}`}
          // onSearch={(e) => {
          //   form.setFieldsValue({
          //     search: e?.target?.value,
          //   });
          //   fetchKpiMismatchReport({ pages, search: e.target.value });
          // }}
        />
        <PCardBody className="mb-3">
          <Row gutter={[10, 2]}>
            <Col md={5} sm={12} xs={24}>
              <PSelect
                options={supervisorDDL.data || []}
                name="supervisor"
                label="Supervisor"
                placeholder="Search minimum 2 character"
                showSearch
                onChange={(value, op) => {
                  form.setFieldsValue({
                    supervisor: op,
                  });
                }}
                loading={supervisorDDL.loading}
                onSearch={(value) => {
                  getSuperVisors(value);
                }}
                // rules={[{ required: true, message: "Workplace is required" }]}
              />
            </Col>
            <Col md={5} sm={12} xs={24}>
              <PSelect
                options={departmentDDL.data || []}
                name="department"
                label="Department"
                placeholder="Department"
                showSearch
                onChange={(value, op) => {
                  form.setFieldsValue({
                    department: op,
                  });
                }}
                // rules={[{ required: true, message: "Workplace is required" }]}
              />
            </Col>
            <Col md={5} sm={12} xs={24}>
              <PSelect
                options={designationDDL.data || []}
                name="designation"
                label="Designation"
                placeholder="Designation"
                showSearch
                onChange={(value, op) => {
                  form.setFieldsValue({
                    designation: op,
                  });
                }}
                // rules={[{ required: true, message: "Workplace is required" }]}
              />
            </Col>
            <Col md={3} sm={12} xs={24}>
              <PSelect
                options={yearDDL || []}
                name="year"
                label="Year"
                showSearch
                placeholder="Year"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    year: op,
                  });
                }}
                // rules={[{ required: true, message: "Workplace is required" }]}
              />
            </Col>
            <Col
              style={{
                marginTop: "23px",
              }}
            >
              <PButton type="primary" action="submit" content="View" />
            </Col>
          </Row>
        </PCardBody>

        <DataTable
          header={getHeader(pages)}
          bordered
          data={reportData?.data || []}
          loading={loading}
          pagination={{
            pageSize: reportData?.pageSize,
            total: reportData?.totalCount,
            pageSizeOptions: ["25", "50", "100"],
          }}
          onChange={(pagination, _, __, extra) => {
            if (extra.action === "paginate"){
              fetchKpiMismatchReport({
                supervisorId:supervisor?.value,
                departmentId:department?.value,
                designationId:designation?.value,
                year:year?.value,
                pages:pagination,
              });
              setPages(pagination)
            }
          }}
        />
      </PCard>
    </PForm>
  );
};

export default KpiTargetMismatchReport;
