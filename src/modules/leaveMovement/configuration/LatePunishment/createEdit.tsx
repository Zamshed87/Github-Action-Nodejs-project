import { Col, Form } from "antd";
import Loading from "common/loading/Loading";
import { PButton, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import CommonForm from "modules/pms/CommonForm/commonForm";
import { LatePunishment } from "./helper";
import { getPeopleDeskAllDDL } from "common/api";

const CreateEditLatePunishmentConfig = () => {
  const [form] = Form.useForm();
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const params = useParams();
  // redux
  const { profileData } = useSelector(
    (state: { auth: { profileData: any } }) => state?.auth,
    shallowEqual
  );
  const { permissionList } = useSelector(
    (store: { auth: { permissionList: any[] } }) => store?.auth,
    shallowEqual
  );

  const { buId, wgId, wId, orgId, intAccountId, employeeId } = profileData;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  type Permission = {
    isCreate?: boolean;
    [key: string]: any;
  };

  let permission: Permission = {};
  permissionList.forEach((item) => {
    permission = item;
  });

  const addHandler = () => {};

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Late Punishment";
    () => {
      document.title = "PeopleDesk";
    };
    // have a need new useEffect to set the title

    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkplaceDDL
    );
  }, []);

  return permission?.isCreate ? (
    <div>
      {loading && <Loading />}
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            backButton
            title={`Late Punishment Configuration`}
            buttonList={[
              {
                type: "primary",
                content: "Save",
                // icon:
                //   type === "create" ? <SaveOutlined /> : <EditOutlined />,
                onClick: () => {
                  // const values = form.getFieldsValue(true);

                  form
                    .validateFields()
                    .then(() => {})
                    .catch(() => {});
                },
              },
            ]}
          />
          <PCardBody>
            {" "}
            <CommonForm formConfig={LatePunishment(workplaceDDL)} form={form}>
              {/* Add appropriate children here */}
              <Col md={6} sm={24}>
                <PButton
                  style={{ marginTop: "22px" }}
                  type="primary"
                  content={"Add"}
                  onClick={() => {
                    const values = form.getFieldsValue(true);
                    form
                      .validateFields()
                      .then(() => {
                        const values = form.getFieldsValue(true);

                        addHandler();
                      })
                      .catch(() => {});
                  }}
                />
              </Col>
            </CommonForm>
          </PCardBody>
        </PCard>
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default CreateEditLatePunishmentConfig;
