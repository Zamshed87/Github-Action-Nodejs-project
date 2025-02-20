import { DataTable, Flex, PCard, PCardHeader, PForm } from "Components";
import { PModal } from "Components/Modal";
import { Form, Tooltip } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import ATCreateEdit from "./createEdit";

const AssessmentTimeline = () => {
  const [criteriaList, getCriteriaList, criteriaListLoader] = useAxiosGet();
  const [modal, setModal] = useState(false);
  const [form] = Form.useForm();
  const [rowData, setRowData] = useState({});
  const { profileData } = useSelector((state) => state?.auth, shallowEqual);
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const dispatch = useDispatch();
  const history = useHistory();

  const landingApi = () => {
    getCriteriaList(
      `/PMS/GetAllEvaluationCriteriaScoreSettingData?accountId=${profileData?.intAccountId}`
    );
  };
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    landingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30469),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const evaluationCriteriaHeader = [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Level of Leadership",
      dataIndex: "levelOfLeadershipName",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "letterGenerateId",
      render: (generateId, rec) => (
        <Flex justify="center" gap="10px">
          <Tooltip placement="bottom" title={"View"}>
            <button
              style={{
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
                backgroundColor: "var(--green)",
                color: "white",
              }}
              className="btn"
              type="button"
            >
              Start
            </button>
          </Tooltip>
          <Tooltip placement="bottom" title={"Details"}>
            <button
              style={{
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
                backgroundColor: "var(--green)",
                color: "white",
              }}
              className="btn"
              type="button"
              onClick={() => setModal(true)}
            >
              Log Details
            </button>
          </Tooltip>
        </Flex>
      ),
      align: "center",
    },
  ];

  return permission?.isView ? (
    <div>
      {criteriaListLoader && <Loading />}
      <PForm form={form}>
        <PCard>
          <PCardHeader />
          <div className="mt-2">
            <DataTable
              bordered
              data={criteriaList || []}
              header={evaluationCriteriaHeader}
            />
          </div>
          <PModal
            title="Assesment Timeline Setup Log Details"
            open={modal}
            onCancel={() => {
              setModal(false);
              landingApi();
            }}
            components={
              <ATCreateEdit
                modal={modal}
                setModal={setModal}
                data={rowData}
                cb={landingApi}
              />
            }
            width={1000}
          />
        </PCard>
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default AssessmentTimeline;
