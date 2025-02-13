import { DataTable, Flex, PForm } from "Components";
import { PModal } from "Components/Modal";
import { Form, Tooltip } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { levelOfLeaderApiCall } from "../evaluationCriteria/helper";
import Clone from "./Clone";
// import CreateEdit from "./createEdit";

const BehavioralFactor = () => {
  const [levelofLeaderShip, setLevelofLeaderShip] = useState([]);
  const [behavioralFactorCloneModal, setBehavioralFactorCloneModal] =
    useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  // const [rowDto, getRowData, rowDataLoader] = useAxiosGet();
  const { profileData } = useSelector((state) => state?.auth, shallowEqual);
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    levelOfLeaderApiCall(
      profileData?.intAccountId,
      setLevelofLeaderShip,
      setLoading
    ); // Call the API
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
      title: "Leadership Position",
      dataIndex: "label",
    },
    {
      title: "Action",
      dataIndex: "letterGenerateId",
      render: (generateId, rec) => (
        <Flex justify="left" gap={10}>
          <Tooltip placement="bottom" title={"Add Questionnaires"}>
            <button
              style={{
                height: "22px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
                marginRight: "5px",
              }}
              className="btn btn-default"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                history.push(`/pms/configuration/BehavioralFactor/create`, {
                  data: rec,
                });
              }}
            >
              Add Questionnaires
            </button>
          </Tooltip>
          <Tooltip placement="bottom" title={"Clone"}>
            <button
              style={{
                height: "22px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
              }}
              className="btn btn-secondary"
              type="button"
              onClick={(e) => {
                setData(rec);
                e.stopPropagation();
                setBehavioralFactorCloneModal(true);
              }}
            >
              Clone
            </button>
          </Tooltip>
        </Flex>
      ),
      width: "40%",
      align: "center",
    },
  ];

  return permission?.isView ? (
    <div className="table-card">
      {loading && <Loading />}
      <PForm form={form}>
        <div className="mt-2">
          <DataTable
            bordered
            data={levelofLeaderShip || []}
            header={evaluationCriteriaHeader}
          />
        </div>
        <PModal
          title="Behavioral Factor Clone"
          open={behavioralFactorCloneModal}
          onCancel={() => {
            setBehavioralFactorCloneModal(false);
          }}
          components={
            <Clone
              data={data}
              isScoreSettings={behavioralFactorCloneModal}
              setIsScoreSettings={setBehavioralFactorCloneModal}
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

export default BehavioralFactor;
