import { DataTable, Flex, PForm } from "Components";
import { PModal } from "Components/Modal";
import { Form, Tooltip } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import CreateEdit from "./createEdit";

const EvaluationCriteria = () => {
  const [criteriaList, getCriteriaList, criteriaListLoader] = useAxiosGet();
  const [isScoreSettings, setIsScoreSettings] = useState({
    open: false,
    type: "",
  });
  const [form] = Form.useForm();
  const [rowData, setRowData] = useState({});
  const { profileData } = useSelector((state) => state?.auth, shallowEqual);
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getCriteriaList(
      `/PMS/GetAllEvaluationCriteriaScoreSettingData?accountId=${profileData?.intAccountId}`
    );
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
      title: "KPI Score",
      dataIndex: "percentageOfKPI",
    },
    {
      title: "BAR Score",
      dataIndex: "percentageOfBAR",
    },
    {
      title: "Action",
      dataIndex: "letterGenerateId",
      render: (generateId, rec) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title={"Edit"}>
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
              onClick={() => {
                setRowData(rec);
                setIsScoreSettings(() => ({ open: true, type: "EC" }));
              }}
            >
              Score Setup
            </button>
          </Tooltip>
        </Flex>
      ),
      align: "center",
    },
  ];

  return permission?.isView ? (
    <div className="table-card">
      {/* <div className="table-card-heading justify-content-end">
        <ul className="d-flex flex-wrap">
          <ul className="d-flex flex-wrap">
            <li>
              <PrimaryButton
                type="button"
                className="btn btn-default flex-center"
                label={"Create"}
                icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  // history.push("/pms/configuration/EvaluationCriteria/create");
                  setIsScoreSettings(() => ({ open: true, type: "EC" }));
                }}
              />
            </li>
          </ul>
        </ul>
      </div> */}
      {criteriaListLoader && <Loading />}
      <PForm form={form}>
        <div className="mt-2">
          <DataTable
            bordered
            data={criteriaList || []}
            header={evaluationCriteriaHeader}
          />
        </div>
        <PModal
          title="Evaluation Criteria Score Settings"
          open={isScoreSettings?.open}
          onCancel={() => {
            setIsScoreSettings(() => ({ open: false, type: "EC" }));
          }}
          components={
            <CreateEdit
              isScoreSettings={isScoreSettings}
              setIsScoreSettings={setIsScoreSettings}
              data={rowData}
            />
          }
          width={1000}
        />
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default EvaluationCriteria;
