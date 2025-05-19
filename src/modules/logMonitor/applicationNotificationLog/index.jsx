import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { getHeader } from "./helper";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import Loading from "common/loading/Loading";
import LogFilters from "./components/LogFilters";
import useNotificationLogs from "./hooks/useNotificationLogs";
import LogFiltersSidebar from "./components/LogFiltersSidebar";
import { useState } from "react";
import { Form } from "antd";
import { PModal } from "Components/Modal";
import ReactJson from "react-json-view";

const ApplicationNotificationLog = () => {
  const [modal, setModal] = useState({ open: false, data: {} });
  const [form] = Form.useForm();
  const [openFilter, setOpenFilter] = useState(false);
  const { pages, setPages, data, fetchNotificationLogs, loading, permission } = useNotificationLogs({ form });
  return permission?.isView ? (
    <PForm
      id="logFiltersForm"
      form={form}
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
          <LogFilters form={form} />
          <LogFiltersSidebar
            form={form}
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
          />
        </PCardBody>
        <DataTable
          header={getHeader(pages, setModal)}
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
      <PModal
        title=""
        open={modal.open}
        onCancel={() => {
          setModal({ open: false, data: {} });
        }}
        components={<div>{modal?.data && renderData(modal?.data)}</div>}
        width={1000}
      />
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default ApplicationNotificationLog;

const isJson = (data) => {
  try {
    JSON.parse(data);
    return true;
  } catch (e) {
    return false;
  }
};

const renderData = (data) => {
  if (isJson(data)) {
    // If it's valid JSON, render it with react-json-view
    return <ReactJson src={JSON.parse(data)} />;
  } else {
    // Otherwise, render as plain text
    return <div>{data}</div>;
  }
};
