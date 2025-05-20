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
import { EyeOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { EditOutlined } from "@mui/icons-material";
import EPCreateEdit from "./createEdit";
import { ViewEvaluationPipeline } from "./helper";
// import CreateEdit from "./createEdit";

const EvaluationPipeline = () => {
  const [criteriaList, getCriteriaList, criteriaListLoader] = useAxiosGet();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    type: "",
  });
  const [form] = Form.useForm();
  const [rowData, setRowData] = useState({});
  const { profileData } = useSelector((state) => state?.auth, shallowEqual);
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const dispatch = useDispatch();
  const history = useHistory();

  const landingApi = () => {
    getCriteriaList(
      `/PMS/GetEvaluationPipelineSetupLanding?accountId=${profileData?.intAccountId}`
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
      dataIndex: "positionGroupName",
    },
    {
      title: "Evaluation Criteria",
      dataIndex: "evaluationCriteriaName",
    },
    {
      title: "Action",
      dataIndex: "letterGenerateId",
      render: (generateId, rec) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title={"View"}>
            <EyeOutlined
              style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
              onClick={() => {
                ViewEvaluationPipeline(
                  rec?.evaluationHeaderId,
                  setLoading,
                  setRowData,
                  () => {
                    setModal(() => ({ open: true, type: "view" }));
                  }
                );
              }}
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"Edit"}>
            <EditOutlined
              style={{
                color: "var(--primary-color)",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                if (!permission?.isEdit) {
                  toast.warning("You don't have permission to edit");
                  return;
                }
                ViewEvaluationPipeline(
                  rec?.evaluationHeaderId,
                  setLoading,
                  setRowData,
                  () => {
                    setModal(() => ({ open: true, type: "edit" }));
                  }
                );
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
    },
  ];

  return permission?.isView ? (
    <div>
      {(criteriaListLoader || loading) && <Loading />}
      <PForm form={form}>
        <PCard>
          <PCardHeader
            buttonList={[
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  setModal(() => ({ open: true, type: "create" }));
                },
              },
            ]}
          />
          <div className="mt-2">
            <DataTable
              bordered
              data={criteriaList || []}
              header={evaluationCriteriaHeader}
            />
          </div>
          <PModal
            title="Evaluation pipeline Settings"
            open={modal?.open}
            onCancel={() => {
              setModal(() => ({ open: false, type: "EC" }));
              landingApi();
            }}
            components={
              <EPCreateEdit
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

export default EvaluationPipeline;
