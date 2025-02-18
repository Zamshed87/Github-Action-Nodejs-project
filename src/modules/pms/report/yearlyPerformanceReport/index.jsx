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
import useYearlyPerformanceReport from "./hooks/useYearlyPerformanceReport";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { downloadFile } from "utility/downloadFile";
import { toast } from "react-toastify";
import { PModal } from "Components/Modal";
import DetailsYearlyPerformanceReport from "./DetailsYearlyPerformanceReport";
import useReportFilters from "../common/useReportFilters";
import ReportFilters from "../common/ReportFilters";

const YearlyPerformanceReport = () => {
  const [excelLoading, setExcelLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, data: {} });
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
    // permissionList,
    profileData: { orgId, buId, wgId, wId, employeeId, isOfficeAdmin },
  } = useSelector((store) => store?.auth, shallowEqual);
  const dispatch = useDispatch();

  const {
    supervisorDDL,
    getSuperVisors,
    departmentDDL,
    designationDDL,
    yearDDL,
    levelOfLeadershipDDL,
  } = useReportFilters({
    orgId,
    buId,
    wgId,
    wId,
    employeeId,
    includeLeadership: true,
  });

  const { reportData, fetchYearlyPerformanceReport, loading } =
    useYearlyPerformanceReport({
      buId,
      wgId,
      wId,
    });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PForm
        form={form}
        initialValues={{
          supervisor: isOfficeAdmin ? { value: 0, label: "All" } : undefined,
          department: { value: 0, label: "All" },
          designation: { value: 0, label: "All" },
          levelOfLeadershipId: { value: 0, label: "All" },
        }}
        onFinish={(values) => {
          fetchYearlyPerformanceReport({
            supervisorId: values?.supervisor?.value,
            departmentId: values?.department?.value,
            designationId: values?.designation?.value,
            year: values?.year?.value,
            levelOfLeadershipId: values?.levelOfLeadershipId?.value,
            pages,
          });
        }}
      >
        {loading || (excelLoading && <Loading />)}
        <PCard>
          <PCardHeader
            title={`Total Report ${reportData?.totalCount || 0}`}
            // onSearch={(e) => {
            //   form.setFieldsValue({
            //     search: e?.target?.value,
            //   });
            //   fetchKpiMismatchReport({ pages, search: e.target.value });
            // }}
            exportIcon
            onExport={() => {
              const missingFields = [];

              if (supervisor?.value == null) missingFields.push("Supervisor");
              if (department?.value == null) missingFields.push("Department");
              if (designation?.value == null) missingFields.push("Designation");
              if (year?.value == null) missingFields.push("Year");
              if (levelOfLeadershipId?.value == null)
                missingFields.push("Level of Leadership");

              if (missingFields.length > 0) {
                toast.warn(
                  `Missing required fields: ${missingFields.join(", ")}`
                );
              } else {
                const url = `/PdfAndExcelReport/PMS/YearlyPerformanceReportExcel?BusinessUnitId=${buId}&WorkplaceId=${wId}&WorkplaceGroupId=${wgId}&SupervisorId=${supervisor?.value}&DepartmentId=${department?.value}&DesignationId=${designation?.value}&Year=${year?.value}&LevelOfLeadershipId=${levelOfLeadershipId?.value}`;

                downloadFile(
                  url,
                  `YearlyPerformanceReport`,
                  "xlsx",
                  setExcelLoading
                );
              }
            }}
          />
          <PCardBody className="mb-3">
            <ReportFilters
              form={form}
              supervisorDDL={supervisorDDL}
              getSuperVisors={getSuperVisors}
              departmentDDL={departmentDDL}
              designationDDL={designationDDL}
              yearDDL={yearDDL}
              levelOfLeadershipDDL={levelOfLeadershipDDL}
              showLevelOfLeadership={true}
            />
          </PCardBody>
          <DataTable
            header={getHeader(pages, setModal)}
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
                fetchYearlyPerformanceReport({
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
      <PModal
        title="Details Yearly Performance Report"
        open={modal.open}
        onCancel={() => {
          setModal({ open: false, data: {} });
        }}
        components={<DetailsYearlyPerformanceReport record={modal.data} />}
        width={1500}
      />
    </>
  );
};

export default YearlyPerformanceReport;
