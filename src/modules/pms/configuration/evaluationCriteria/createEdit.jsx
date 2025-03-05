import { Form } from "antd";
import Loading from "common/loading/Loading";
import { PForm } from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  handleEvaluationCriteriaScoreSetting,
  levelOfLeaderApiCall,
  makerFormConfig,
} from "./helper";

import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { ModalFooter } from "Components/Modal";
import CommonForm from "modules/pms/CommonForm/commonForm";
import { toast } from "react-toastify";

const CreateEdit = ({ isScoreSettings, setIsScoreSettings, data, cb }) => {
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
          leadership: data?.levelOfLeadershipName,
          positionGroupId: data?.levelOfLeadershipId,
          kpiScore: data?.percentageOfKPI,
          barScore: data?.percentageOfBAR,
          id: data?.scoreScaleId,
        }}
      >
        <CommonForm formConfig={makerFormConfig(form)} form={form} />

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
                    cb && cb();
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
