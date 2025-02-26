/* eslint-disable react-hooks/exhaustive-deps */
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import BackButton from "../../../../../common/BackButton";
import Loading from "../../../../../common/loading/Loading";
import EmployeeInfo from "./components/employeeInfo";
import QuestionsGroup from "./components/questionsGroup";
import { useEffect } from "react";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { PCard, PCardBody, PCardHeader, PForm } from "Components";
import { Form } from "antd";
import useBarAssessmentLanding from "./hooks/useBarAssessmentLanding";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";

const BarAssessmentEvaluation = () => {
  const { id, yearId } = useParams();
  const dispatch = useDispatch();

  const {
    permissionList,
    profileData: { buId, wgId, wId },
  } = useSelector((store) => store?.auth, shallowEqual);
  const [form] = Form.useForm();

  const assessmentPeriod = Form.useWatch("assessmentPeriod", form);
  const assessmentTime = Form.useWatch("assessmentTime", form);

  const { data, getBarAssessmentLanding, loading } = useBarAssessmentLanding({
    buId,
    wgId,
    wId,
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
  }, []);

  let permission = null;

  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30496) {
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
        });
      }}
    >
      {loading && <Loading />}
      <PCard>
        <PCardHeader
          // title={`Total Bar Assessment ${data?.totalCount || 0}`}
          // onSearch={(e) => {
          //   form.setFieldsValue({
          //     search: e?.target?.value,
          //   });
          //   fetchKpiMismatchReport({ pages, search: e.target.value });
          // }}
        />
        <PCardBody className="mb-3">
          <EmployeeInfo employeeInfo={{}} />
        </PCardBody>
         {/* {modifiedEvaluationData?.length > 0 &&
            modifiedEvaluationData.map((group, groupIdx) => (
              <QuestionsGroup
                key={groupIdx + 1}
                group={group}
                groupNo={groupIdx + 1}
                options={evaluationScale?.scaleList}
                handleSelectOption={handleSelectOption}
                disabled={isDisableInput}
              />
            ))} */}
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage/>
  );
  return (
    <>
      {false && <Loading />}
      <div className="table-card mb-2">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div className="d-flex align-items-center">
            <BackButton />
            <h2>BAR Assessment Evaluation</h2>
          </div>
          
        </div>
        <div className="card-style pb-1 mb-4">
          <EmployeeInfo employeeInfo={{}} />
        </div>
        <div className="mx-3">
          {/* {modifiedEvaluationData?.length > 0 &&
            modifiedEvaluationData.map((group, groupIdx) => (
              <QuestionsGroup
                key={groupIdx + 1}
                group={group}
                groupNo={groupIdx + 1}
                options={evaluationScale?.scaleList}
                handleSelectOption={handleSelectOption}
                disabled={isDisableInput}
              />
            ))} */}
        </div>
        <div></div>
      </div>
    </>
  );
};

export default BarAssessmentEvaluation;
