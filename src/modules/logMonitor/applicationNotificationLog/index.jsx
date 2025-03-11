import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { getHeader } from "./helper";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import Loading from "common/loading/Loading";
import LogFilters from "./components/LogFilters";
import useNotificationLogs from "./hooks/useNotificationLogs";

const ApplicationNotificationLog = () => {

  const { form, pages, setPages, data, fetchNotificationLogs, loading, permission } = useNotificationLogs();

  return permission?.isView ? (
    <PForm
      form={form}
      initialValues={{
        search:""
      }}
      onFinish={() => {
        fetchNotificationLogs();
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
            fetchNotificationLogs();
          }}
        />
        <PCardBody className="mb-3">
          <LogFilters form={form} />
        </PCardBody>
        <DataTable
          header={getHeader(pages)}
          bordered
          data={data?.Data || []}
          loading={loading}
          pagination={{
            pageSize: data?.PageSize,
            total: data?.TotalCount,
            pageSizeOptions: ["25", "50", "100"],
          }}
          onChange={(pagination, _, __, extra) => {
            if (extra.action === "paginate") {
              fetchNotificationLogs();
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
