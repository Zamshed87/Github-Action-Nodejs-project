import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Col, Form, Row } from "antd";
import Loading from "common/loading/Loading";
import {
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import {
  formConfig,
  handleEvaluationCriteriaScoreSetting,
  levelOfLeaderApiCall,
  makerFormConfig,
} from "./helper";

import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import CommonForm from "modules/pms/CommonForm/commonForm";
import { ModalFooter } from "Components/Modal";
import { toast } from "react-toastify";

const CreateEdit = ({ isScoreSettings, setIsScoreSettings, data }) => {
  // redux
  const { permissionList, profileData } = useSelector(
    (state) => state?.auth,
    shallowEqual
  );

  const { buId, wgId, wId, orgId, intAccountId } = profileData;
  const dispatch = useDispatch();
  const firstSegment = location.pathname.split("/")[1];
  const [loading, setLoading] = useState(false);
  const [levelofLeaderShip, setLevelofLeaderShip] = useState([]);

  let permission = {};
  permissionList.forEach((item) => {
    permission = item;
  });

  const [form] = Form.useForm();
  const params = useParams();
  const { type } = params;

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    levelOfLeaderApiCall(intAccountId, setLevelofLeaderShip, setLoading); // Call the API
  }, []);

  return permission?.isCreate ? (
    <div>
      {loading && <Loading />}
      <PForm
        form={form}
        initialValues={{
          leadership: "Management",
        }}
      >
        <CommonForm formConfig={makerFormConfig()} form={form} />

        <ModalFooter
          onCancel={() => {
            setIsScoreSettings(() => ({ open: false, type: "" }));
          }}
          submitAction="submit"
          onSubmit={() => {
            const values = form.getFieldsValue(true);
            form
              .validateFields()
              .then(() => {
                if (values?.barScore + values?.kpiScore !== 100) {
                  return toast.error("Sum of KPI and BAR must be 100");
                }
                handleEvaluationCriteriaScoreSetting(
                  form,
                  profileData,
                  setLoading,
                  () => {
                    setIsScoreSettings(() => ({ open: false, type: "" }));
                  }
                );
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        />
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default CreateEdit;
