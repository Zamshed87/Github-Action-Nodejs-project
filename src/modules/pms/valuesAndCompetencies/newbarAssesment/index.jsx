import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Loading from "../../../../common/loading/Loading";
import { getBarAssessmentColumn } from "./helper";
import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { Form } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import useBarAssessmentLanding from "./hooks/useBarAssessmentLanding";
import AssessmentFilters from "./AssessmentFilters";

const BarAssessmentLanding = () => {
  // 30496
  const [pages, setPages] = useState({
      current: 1,
      pageSize: 20,
      total: 0,
    });
  const history = useHistory();
  const {
    permissionList,
    profileData: { buId, wgId, wId,employeeId,userName,isOfficeAdmin },
  } = useSelector((store) => store?.auth, shallowEqual);


  const [form] = Form.useForm();

  const year = Form.useWatch("year", form);

  const { data, getBarAssessmentLanding, loading } = useBarAssessmentLanding({
    buId,
    wgId,
    wId,
  });
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30496) {
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
        getBarAssessmentLanding({
          year: values?.year?.value,
          pages,
        });
      }}
    >
      {loading && <Loading />}
      <PCard>
        <PCardHeader
          // title={`Total Report ${reportData?.totalCount || 0}`}
          // onSearch={(e) => {
          //   form.setFieldsValue({
          //     search: e?.target?.value,
          //   });
          //   fetchKpiMismatchReport({ pages, search: e.target.value });
          // }}
        />
        <PCardBody className="mb-3">
          <AssessmentFilters
            form={form}
          />
        </PCardBody>
        <DataTable
          header={getBarAssessmentColumn({pages,history,yearId:year?.value,quarterId:"",assessmentType:""})}
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
              getBarAssessmentLanding({
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

export default BarAssessmentLanding;
