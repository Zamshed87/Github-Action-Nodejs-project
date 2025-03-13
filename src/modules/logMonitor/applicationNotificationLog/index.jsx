import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { getHeader } from "./helper";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import Loading from "common/loading/Loading";
import LogFilters from "./components/LogFilters";
import useNotificationLogs from "./hooks/useNotificationLogs";
import LogFiltersSidebar from "./components/LogFiltersSidebar";
import { useState } from "react";
import { Form } from "antd";
import useNotificationLogFilters from "./hooks/useNotificationLogFilters";

const ApplicationNotificationLog = () => {
  const [form] = Form.useForm();
  const [openFilter, setOpenFilter] = useState(false);
  const { pages, setPages, data, fetchNotificationLogs, loading, permission } = useNotificationLogs({form});
  const {initialValues} = useNotificationLogFilters({form});
  return permission?.isView ? (
    <PForm
      id="logFiltersForm"
      form={form}
      initialValues={initialValues}
      onFinish={() => {
        fetchNotificationLogs(pages);
      }}
    >
      {loading && <Loading />}
      <PCard>
        <PCardHeader
          title={`Total Report ${data?.TotalCount || 0}`}
          onSearch={(e) => {
            form.setFieldsValue({
              search: e?.target?.value,
            });
            fetchNotificationLogs(pages);
          }}
          buttonList={[
            {
              type: "primary",
              content: "Filter",
              onClick: () => {
                setOpenFilter(!openFilter);
              },
              icon: <i className="fas fa-filter mr-1"></i>,
            },
          ]}
        />
        <PCardBody className="mb-3">
          <LogFiltersSidebar
            form={form}
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
          />
          <LogFilters form={form} />
        </PCardBody>
        <DataTable
          header={getHeader(pages)}
          bordered
          data={data?.Data || []}
          loading={loading}
          pagination={{
            pageSize: pages?.pageSize,
            total: data?.TotalCount,
            pageSizeOptions: ["25", "50", "100"],
          }}
          onChange={(pagination, _, __, extra) => {
            if (extra.action === "paginate") {
              setPages(pagination);
              fetchNotificationLogs(pagination);
            }
          }}
        />
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default ApplicationNotificationLog;
