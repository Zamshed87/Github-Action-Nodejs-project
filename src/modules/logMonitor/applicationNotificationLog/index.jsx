import { useState } from "react";
import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { Form } from "antd";
import { getHeader } from "./helper";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import Loading from "common/loading/Loading";
import LogFilters from "./components/LogFilters";
import useNotificationLogs from "./hooks/useNotificationLogs";

const ApplicationNotificationLog = () => {
  const { form, pages, setPages, data, fetchNotificationLogs, loading, permission } = useNotificationLogs();

  const supervisor = Form.useWatch("supervisor", form);
  const department = Form.useWatch("department", form);
  const designation = Form.useWatch("designation", form);
  const year = Form.useWatch("year", form);
  const levelOfLeadershipId = Form.useWatch("levelOfLeadershipId", form);
  
  return permission?.isView || true ? (
    <PForm
      form={form}
      initialValues={{
        supervisor: { value: 0, label: "All" },
        department: { value: 0, label: "All" },
        designation: { value: 0, label: "All" },
        levelOfLeadershipId: { value: 0, label: "All" },
      }}
      onFinish={(values) => {
        fetchNotificationLogs({
          supervisorId: values?.supervisor?.value,
          departmentId: values?.department?.value,
          designationId: values?.designation?.value,
          year: values?.year?.value,
          levelOfLeadershipId: values?.levelOfLeadershipId?.value,
          pages,
        });
      }}
    >
      {loading && <Loading />}
      <PCard>
        <PCardHeader
          title={`Total Report ${data?.totalCount || 0}`}
          onSearch={(e) => {
            form.setFieldsValue({
              search: e?.target?.value,
            });
            fetchNotificationLogs({ pages, search: e.target.value });
          }}
        />
        <PCardBody className="mb-3">
          <LogFilters form={form} />
        </PCardBody>
        <DataTable
          header={getHeader(pages)}
          bordered
          data={data?.data || []}
          loading={loading}
          pagination={{
            pageSize: data?.pageSize,
            total: data?.totalCount,
            pageSizeOptions: ["25", "50", "100"],
          }}
          onChange={(pagination, _, __, extra) => {
            if (extra.action === "paginate") {
              fetchNotificationLogs({
                supervisorId: supervisor?.value,
                departmentId: department?.value,
                designationId: designation?.value,
                year: year?.value,
                levelOfLeadershipId: levelOfLeadershipId?.value,
                pages: pagination,
              });
              setPages(pagination);
            }
          }}
          scroll={{ x: "2200px" }}
        />
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default ApplicationNotificationLog;
