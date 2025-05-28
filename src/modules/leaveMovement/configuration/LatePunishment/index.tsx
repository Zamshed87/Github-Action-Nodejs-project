import {
  DataTable,
  Flex,
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PSelect,
} from "Components";
import { PModal } from "Components/Modal";
import { Col, Form, Row, Switch, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import View from "./view";
import { getPeopleDeskAllDDL } from "common/api";

interface LatePunishmentConfigProps {
  config: string;
}

const LatePunishmentConfig = ({ config }: LatePunishmentConfigProps) => {
  const [latePunishment, getlatePunishment, latePunishmentLoader] =
    useAxiosGet();
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  let url = "";
  if (config === "ELP") {
    url = "earlyLeavePunishmentpolicy";
  } else {
    url = "LatePunishmentpolicy";
  }

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
      `/${url}?accountId=${intAccountId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&workplaceId=${wId}&pageId=1&pageNo=10`
    );
  };
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Late Punishment";
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkplaceDDL
    );
    () => {
      document.title = "PeopleDesk";
    };
    landingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wgId]);
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
                history.push(`/administration/${url}/view/` + rec?.id);
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
                history.push(`/administration/${url}/extend/` + rec?.id);
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
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            buttonList={[
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  history.push(`/administration/${url}/create/1`);
                },
              },
            ]}
          />
          <Row gutter={[10, 2]}>
            <Col md={6} sm={24}>
              <PSelect
                options={[{ label: "All", value: 0 }, ...(workplaceDDL || [])]}
                name="workplace"
                label="workplace"
                placeholder="Workplace"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    workplace: op,
                  });
                }}
                rules={[
                  {
                    required: true,
                    message: "Workplace is required",
                  },
                ]}
              />
            </Col>
            <Col md={6} sm={24}>
              <PSelect
                options={[
                  {
                    label: "Active",
                    value: "active",
                  },
                  {
                    label: "Inactive",
                    value: "inactive",
                  },
                ]}
                name="status"
                label="status"
                placeholder="status"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    status: op,
                  });
                }}
                rules={[
                  {
                    required: true,
                    message: "status is required",
                  },
                ]}
              />
            </Col>
            <Col md={4} sm={24}>
              <PButton
                style={{ marginTop: "23px" }}
                type="primary"
                content={"View"}
                onClick={() => {
                  form
                    .validateFields([""])
                    .then(() => {
                      const values = form.getFieldsValue(true);
                    })
                    .catch(() => {});
                }}
              />
            </Col>
          </Row>
          <div className="mt-3">
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
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default LatePunishmentConfig;
