import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  DataTable,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
} from "Components";
import { Form } from "antd";
import { getHeader } from "./helper";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { downloadFile } from "utility/downloadFile";
import { toast } from "react-toastify";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import Loading from "common/loading/Loading";
import LogFilters from "./components/LogFilters";
import useNotificationLogs from "./hooks/useNotificationLogs";

const ApplicationNotificationLog = () => {
  const [excelLoading, setExcelLoading] = useState(false);
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
  const levelOfLeadershipId = Form.useWatch("levelOfLeadershipId", form);

  const {
    permissionList,
    profileData: { buId, wgId, wId },
  } = useSelector((store) => store?.auth, shallowEqual);
  const dispatch = useDispatch();

  const { reportData, fetchNotificationLogs, loading } =
    useNotificationLogs({
      buId,
      wgId,
      wId,
    });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30543) {
      permission = item;
    }
  });
  return (permission?.isView || true) ? (
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
        {loading || (excelLoading && <Loading/>)}
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
            <LogFilters
              form={form}
            />
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
  )
  :
  (
    <NotPermittedPage/>
  )
};

export default ApplicationNotificationLog;
