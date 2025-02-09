import { EditOutlined } from "@ant-design/icons";
import { AddOutlined } from "@mui/icons-material";
import { DataTable, Flex, PForm } from "Components";
import { PModal } from "Components/Modal";
import { Form, Tooltip } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import PrimaryButton from "../../../../common/PrimaryButton";
import Loading from "../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import ViewModal from "common/ViewModal";
import Clone from "./Clone";
// import CreateEdit from "./createEdit";

const BehavioralFactor = () => {
  const [criteriaList, getCriteriaList, criteriaListLoader] = useAxiosGet();
  const [behavioralFactorCloneModal, setBehavioralFactorCloneModal] =
    useState(false);
  const [isScoreSettings, setIsScoreSettings] = useState({
    open: false,
    type: "",
  });
  const [form] = Form.useForm();
  // const [rowDto, getRowData, rowDataLoader] = useAxiosGet();
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
      `/PMS/GetEvaluationCriteria?accountId=${profileData?.intAccountId}`
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
      title: "Leadership Position",
      dataIndex: "participantName",
    },
    {
      title: "Action",
      dataIndex: "letterGenerateId",
      render: (generateId, rec) => (
        <Flex justify="center" gap={10}>
          <Tooltip placement="bottom" title={"Add Questionnaires"}>
            <button
              style={{
                height: "24px",
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
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
              }}
              className="btn btn-secondary"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setBehavioralFactorCloneModal(true);
              }}
            >
              Clone
            </button>
          </Tooltip>
        </Flex>
      ),
      align: "center",
    },
  ];
  const demoData = [
    {
      key: "1",
      participantName: "John Doe",
      letterGenerateId: "12345",
    },
    {
      key: "2",
      participantName: "Jane Smith",
      letterGenerateId: "67890",
    },
    {
      key: "3",
      participantName: "Alice Johnson",
      letterGenerateId: "11223",
    },
    {
      key: "4",
      participantName: "Bob Brown",
      letterGenerateId: "44556",
    },
  ];
  return permission?.isView ? (
    <div className="table-card">
      <div className="table-card-heading justify-content-end">
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
      </div>
      {criteriaListLoader && <Loading />}
      <PForm form={form}>
        <div className="mt-2">
          <DataTable
            bordered
            data={demoData || []}
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
