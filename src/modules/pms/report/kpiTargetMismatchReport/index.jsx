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
import useReportFilters from "../common/useReportFilters";
import { useHistory } from "react-router-dom";

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
    // permissionList,
    profileData: { orgId, buId, wgId, wId, employeeId,isOfficeAdmin },
  } = useSelector((store) => store?.auth, shallowEqual);


  const {
    supervisorDDL,
    getSuperVisors,
    departmentDDL,
    designationDDL,
    yearDDL,
  } = useReportFilters({
    orgId,
    buId,
    wgId,
    wId,
    employeeId,
    includeLeadership: false,
  });

  const { reportData, fetchKpiMismatchReport, loading } = useKpiMismatchReport({
    buId,
    wgId,
    wId,
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PForm
      form={form}
      initialValues={{
        supervisor: { value: 0, label: "All" },
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
            isAdmin={isOfficeAdmin}
            supervisorDDL={supervisorDDL}
            getSuperVisors={getSuperVisors}
            departmentDDL={departmentDDL}
            designationDDL={designationDDL}
            yearDDL={yearDDL}
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
  );
};

export default KpiTargetMismatchReport;
