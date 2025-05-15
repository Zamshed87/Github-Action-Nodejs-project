import { Form } from "antd";
import Loading from "common/loading/Loading";
import {
  DataTable,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
} from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import ConfigSelection from "./ConfigSelection";
import { detailsHeader } from "./helper";

const AbsentPunishmentConfiguration = () => {
  const [form] = Form.useForm();
  const [detailList, setDetailList] = useState([]);

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
    document.title = "Absent Punishment";
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
          <ConfigSelection form={form} setDetailList={setDetailList} />
        </PCard>
        {detailList.length > 0 && (
          <PCardBody>
            <DataTable
              bordered
              data={detailList}
              rowKey={(row, idx) => idx}
              header={detailsHeader(setDetailList)}
            />
          </PCardBody>
        )}
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default AbsentPunishmentConfiguration;
