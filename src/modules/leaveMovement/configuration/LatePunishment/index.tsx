import { EyeFilled, EyeInvisibleOutlined } from "@ant-design/icons";
import { ExtensionRounded } from "@mui/icons-material";
import { DataTable, Flex, PCard, PCardHeader, PForm } from "Components";
import { PModal } from "Components/Modal";
import { Form, Switch, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import View from "./view";

const LatePunishmentConfig = () => {
  const [latePunishment, getlatePunishment, latePunishmentLoader] =
    useAxiosGet();
  const [form] = Form.useForm();
  const { profileData } = useSelector(
    (state: { auth: { profileData: any } }) => state?.auth,
    shallowEqual
  );
  const { buId, wgId, wId, orgId, intAccountId, employeeId } = profileData;

  const { permissionList } = useSelector(
    (store: { auth: { permissionList: any[] } }) => store?.auth,
    shallowEqual
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const landingApi = (
    pagination: { current: number; pageSize: number } = {
      current: 1,
      pageSize: 25,
    }
  ) => {
    getlatePunishment(
      `/LatePunishmentpolicy?accountId=${intAccountId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&workplaceId=${wId}&pageId=1&pageNo=10`
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
    () => permissionList.find((item) => item?.menuReferenceId === 30590),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const header = [
    {
      title: "SL",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Policy Name",
      dataIndex: "name",
    },
    {
      title: "Workplace",
      dataIndex: "workplace",
    },
    {
      title: "Employment Type",
      dataIndex: "employmentTypes",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Tooltip
            placement="bottom"
            title={rec?.isActive ? "Inactive" : "Active"}
          >
            <Switch size="small" checked={rec?.isActive} onChange={() => {}} />
          </Tooltip>
        </Flex>
      ),
      align: "center",
      width: 40,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title="View">
            <button
              style={{
                color: "green",
                fontSize: "12px",
                cursor: "pointer",
                margin: "0 5px",
                border: "none",
              }}
              onClick={() => {
                history.push(
                  "/administration/latePunishmentPolicy/view/" + rec?.id
                );
              }}
            >
              View
            </button>
          </Tooltip>
          |
          <Tooltip placement="bottom" title="Extend">
            <button
              style={{
                color: "green",
                fontSize: "12px",
                cursor: "pointer",
                margin: "0 5px",
                border: "none",
              }}
              onClick={() => {
                history.push(
                  "/administration/latePunishmentPolicy/extend/" + rec?.id
                );
              }}
            >
              Extend
            </button>
          </Tooltip>
        </Flex>
      ),
      align: "center",
      width: 30,
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
                  history.push("/administration/latePunishmentPolicy/create/1");
                },
              },
            ]}
          />

          <div className="mb-3">
            <DataTable
              bordered
              data={latePunishment || []}
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
        title={"View"}
        width={1000}
        onCancel={() => {
          // setViewModalModal(false);
        }}
        maskClosable={false}
        components={
          <>
            <View />
          </>
        }
      />
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default LatePunishmentConfig;
