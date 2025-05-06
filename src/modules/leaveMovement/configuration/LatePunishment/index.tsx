import { DataTable, Flex, PCard, PCardHeader, PForm } from "Components";
import { PModal } from "Components/Modal";
import { Form, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const LatePunishmentConfig = () => {
  const [latePunishment, getlatePunishment, latePunishmentLoader] =
    useAxiosGet();
  const [form] = Form.useForm();
  const { profileData } = useSelector(
    (state: { auth: { profileData: any } }) => state?.auth,
    shallowEqual
  );
  const { permissionList } = useSelector(
    (store: { auth: { permissionList: any[] } }) => store?.auth,
    shallowEqual
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const landingApi = () => {
    getlatePunishment(
      `/PMS/GetAllEvaluationCriteriaScoreSettingData?accountId=${profileData?.intAccountId}`
    );
  };
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Late Punishment";
    () => {
      document.title = "PeopleDesk";
    };
    landingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30469),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const header = [
    {
      title: "SL",
      render: (_: any, __: any, index: number) => index + 1,
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
      render: (rec: any) => (
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
                // setRowData(rec);
                // setIsScoreSettings(() => ({ open: true, type: "EC" }));
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
    <div>
      {latePunishmentLoader && <Loading />}

      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            title={`Total ${latePunishment?.totalCount || 0} Late Punishment`}
            buttonList={[
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  history.push("/administration/latePunishmentPolicy/create");
                },
              },
            ]}
          />

          <div className="mb-3">
            <DataTable
              bordered
              data={latePunishment?.data || []}
              loading={latePunishmentLoader}
              header={header}
              pagination={{
                pageSize: latePunishment?.pageSize,
                total: latePunishment?.totalCount,
              }}
              filterData={latePunishment?.data?.filters}
              onChange={(pagination, filters) => {
                landingApi();
              }}
            />
          </div>
        </PCard>
      </PForm>
      {/* Modal */}
      <PModal
        open={false} // have to change
        title={"Training Requisition View"}
        width={1000}
        onCancel={() => {
          //   setViewModalModal(false);
        }}
        maskClosable={false}
        components={<></>}
      />
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default LatePunishmentConfig;
