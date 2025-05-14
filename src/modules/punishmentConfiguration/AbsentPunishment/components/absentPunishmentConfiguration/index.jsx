import { Col, Form, Row } from "antd";
import Loading from "common/loading/Loading";
import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PSelect,
} from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import ConfigSelection from "./ConfigSelection";

const AbsentPunishmentConfiguration = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  // redux
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    setPermission(
      permissionList.find((item) => item?.menuReferenceId === 30590)
    );
  }, [permissionList]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Late Punishment";
    return () => {
      document.title = "PeopleDesk";
    };
  }, []);

  return permission?.isCreate ? (
    <div>
      {loading && <Loading />}
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            backButton
            title={`Absent Punishment Configuration`}
            buttonList={[
              {
                type: "primary",
                content: "Save",
                onClick: () => {
                  form
                    .validateFields()
                    .then(() => {})
                    .catch(() => {});
                },
              },
            ]}
          />
            <ConfigSelection form={form} />
        </PCard>
        {data?.length > 0 &&
          {
            /* <DataTable
                        bordered
                        data={leaveDeductionData || []}
                        loading={false}
                        header={headerLeaveDeduction}
                      /> */
          }}
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default AbsentPunishmentConfiguration;
