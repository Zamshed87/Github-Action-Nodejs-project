import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import Loading from "../../../../common/loading/Loading";
import { getBarAssessmentColumn } from "./helper";
import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { Form } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import useBarAssessmentLanding from "./hooks/useBarAssessmentLanding";
import AssessmentFilters from "./AssessmentFilters";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";

const BarAssessmentLanding = () => {
  // 30496
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const firstSegment = location.pathname.split("/")[1];
  const selfService = firstSegment === "SelfService";
  const {
    permissionList,
    profileData: { buId, wgId, wId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const [form] = Form.useForm();

  const year = Form.useWatch("year", form);
  const assessmentPeriod = Form.useWatch("assessmentPeriod", form);
  const assessmentTime = Form.useWatch("assessmentTime", form);

  const { data, getBarAssessmentLanding, loading } = useBarAssessmentLanding({
    buId,
    wgId,
    wId,
  });

  useEffect(() => {
    dispatch(
      setFirstLevelNameAction(
        selfService
          ? "Employee Self Service"
          : "Performance Management System"
      )
    );
  }, []);

  let permission = null;

  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30496 || item?.menuReferenceId === 30565) {
      permission = item;
    }
  });
  return permission?.isView ? (
    <PForm
      form={form}
      initialValues={{}}
      onFinish={(values) => {
        getBarAssessmentLanding({
          year: values?.year?.value,
          assessmentPeriod: values?.assessmentPeriod?.value,
          assessmentTime: values?.assessmentTime?.value,
          pages,
          isSelfService:selfService
        });
      }}
    >
      {loading && <Loading />}
      <PCard>
        <PCardHeader
          title={`Total Bar Assessment ${data?.totalCount || 0}`}
          // onSearch={(e) => {
          //   form.setFieldsValue({
          //     search: e?.target?.value,
          //   });
          //   fetchKpiMismatchReport({ pages, search: e.target.value });
          // }}
        />
        <PCardBody className="mb-3">
          <AssessmentFilters form={form} />
        </PCardBody>
        <DataTable
          header={getBarAssessmentColumn({
            pages,
            history,
            yearId: year?.value,
            assessmentPeriod,
            assessmentTime,
          })}
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
                assessmentPeriod: assessmentPeriod?.value,
                assessmentTime: assessmentTime?.value,
                pages: pagination,
                isSelfService:selfService
              });
              setPages(pagination);
            }
          }}
        />
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default BarAssessmentLanding;
