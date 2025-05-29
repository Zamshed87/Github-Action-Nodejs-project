import { DataTable, Flex, PCard, PCardHeader, PForm } from "Components";
import { Form, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const GratuityPolicy = () => {
  const [gratuityPolicy, getgratuityPolicy, gratuityPolicyLoader] =
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
    getgratuityPolicy(`/GratuityPolicy`);
  };
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Benefits Management"));
    document.title = "Benefits Management";
    () => {
      document.title = "PeopleDesk";
    };
    landingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30599),
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
      dataIndex: "strPolicyName",
    },
    {
      title: "Workplace Group",
      dataIndex: "strWorkplaceName",
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplaceName",
    },
    {
      title: "Employment Type",
      dataIndex: "strEmploymentTypeName",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title="View">
            <button
              style={{
                color: "var(--primary-color)",
                fontSize: "12px",
                cursor: "pointer",
                margin: "0 5px",
                border: "none",
              }}
              onClick={() => {
                history.push(
                  "/BenefitsManagement/gratuity/gratuityPolicy/view/" +
                    rec?.intPolicyId
                );
              }}
            >
              View
            </button>
          </Tooltip>
          |
          <Tooltip placement="bottom" title="Edit">
            <button
              style={{
                color: "var(--primary-color)",
                fontSize: "12px",
                cursor: "pointer",
                margin: "0 5px",
                border: "none",
              }}
              onClick={() => {
                history.push(
                  "/BenefitsManagement/gratuity/gratuityPolicy/edit/" +
                    rec?.intPolicyId
                );
              }}
            >
              Edit
            </button>
          </Tooltip>
          |
          <Tooltip placement="bottom" title="Extend">
            <button
              style={{
                color: "var(--primary-color)",
                fontSize: "12px",
                cursor: "pointer",
                margin: "0 5px",
                border: "none",
              }}
              onClick={() => {
                history.push(
                  "/BenefitsManagement/gratuity/gratuityPolicy/extend/" +
                    rec?.intPolicyId
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
      {/* {gratuityPolicyLoader && <Loading />} */}

      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            title={`Gratuity Policy`}
            buttonList={[
              {
                type: "primary",
                content: "Create Policy",
                icon: "plus",
                onClick: () => {
                  history.push(
                    "/BenefitsManagement/gratuity/gratuityPolicy/create/0"
                  );
                },
              },
            ]}
          />

          <div className="mb-3">
            <DataTable
              bordered
              data={gratuityPolicy || []}
              loading={gratuityPolicyLoader}
              header={header}
              pagination={{
                pageSize: gratuityPolicy?.pageSize,
                total: gratuityPolicy?.totalCount,
              }}
              filterData={gratuityPolicy?.data?.filters}
              onChange={(pagination, filters) => {
                landingApi();
              }}
            />
          </div>
        </PCard>
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default GratuityPolicy;
