import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import {
  DataTable,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
} from "Components";
import { Form } from "antd";
import { getHeader } from "./helper";
import useKpiMismatchReport from "./hooks/useKpiMismatchReport";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import ReportFilters from "../common/ReportFilters";
import { useHistory } from "react-router-dom";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";

const KpiTargetMismatchReport = () => {
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  const supervisor = Form.useWatch("supervisor", form);
  const department = Form.useWatch("department", form);
  const designation = Form.useWatch("designation", form);
  const year = Form.useWatch("year", form);

  const {
    permissionList,
    profileData: { buId, wgId, wId,employeeId,userName,isOfficeAdmin },
  } = useSelector((store) => store?.auth, shallowEqual);

  const { reportData, fetchKpiMismatchReport, loading } = useKpiMismatchReport({
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
    if (item?.menuReferenceId === 30541) {
      permission = item;
    }
  });

  return permission?.isView ? (
    <PForm
      form={form}
      initialValues={{
        supervisor: isOfficeAdmin ? { value: 0, label: "All" }:{value:employeeId,label:userName},
        department: { value: 0, label: "All" },
        designation: { value: 0, label: "All" },
      }}
      onFinish={(values) => {
        fetchKpiMismatchReport({
          supervisorId: values?.supervisor?.value,
          departmentId: values?.department?.value,
          designationId: values?.designation?.value,
          year: values?.year?.value,
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
          <ReportFilters
            form={form}
            showLevelOfLeadership={false}
          />
        </PCardBody>
        <DataTable
          header={getHeader(pages,history,year)}
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
              fetchKpiMismatchReport({
                supervisorId: supervisor?.value,
                departmentId: department?.value,
                designationId: designation?.value,
                year: year?.value,
                pages: pagination,
              });
              setPages(pagination);
            }
          }}
        />
      </PCard>
    </PForm>
  )
  :
  (
    <NotPermittedPage/>
  )
};

export default KpiTargetMismatchReport;
