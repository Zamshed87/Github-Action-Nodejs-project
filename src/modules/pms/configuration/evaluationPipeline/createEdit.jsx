import { Col, Form } from "antd";
import Loading from "common/loading/Loading";
import { PButton, PForm } from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { ModalFooter } from "Components/Modal";
import CommonForm from "modules/pms/CommonForm/commonForm";
import { toast } from "react-toastify";
import { EvaluationPipelineForm, StakeholderForm } from "./helper";
import { levelOfLeaderApiCall } from "../evaluationCriteria/helper";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const EPCreateEdit = ({ modal, setmodal, data, cb }) => {
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
  const [
    stakeholderApi,
    getStakeholderApi,
    loaderStakeholder,
    setStakeholderApi,
  ] = useAxiosGet([]);

  let permission = {};
  permissionList.forEach((item) => {
    permission = item;
  });

  const [form] = Form.useForm();
  const params = useParams();
  const { type } = params;

  const getStakeholderType = (type) => {
    form.setFieldsValue({
      stakeholder: undefined,
    });
    // getStakeholderApi(`/pms/GetStakeholderTypeDDL`);
    if (type?.label === "Individual Employee") {
      setStakeholderApi([{ value: 1, label: "Manager" }]);
    } else if (type?.label === "Self") {
      setStakeholderApi([]);
      form.setFieldsValue({
        stakeholder: undefined,
      });
    }
  };

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
        <CommonForm
          formConfig={EvaluationPipelineForm(levelofLeaderShip, modal?.type)}
          form={form}
        />
        <CommonForm
          formConfig={StakeholderForm(
            getStakeholderType,
            stakeholderApi,
            modal?.type,
            form
          )}
          form={form}
        >
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
                    console.log(values);
                  })
                  .catch(() => {});
              }}
            />
          </Col>
        </CommonForm>

        <ModalFooter
          onCancel={() => {
            setmodal(() => ({ open: false, type: "" }));
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
                // handleEvaluationCriteriaScoreSetting(
                //   form,
                //   profileData,
                //   setLoading,
                //   () => {
                //     cb && cb();
                //     setmodal(() => ({ open: false, type: "" }));
                //   }
                // );
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

export default EPCreateEdit;
