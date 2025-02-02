import { Form } from "antd";
import Loading from "common/loading/Loading";
import { PForm } from "Components";
import { useApiRequest } from "Hooks";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { makerFormConfig } from "./helper";

import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { ModalFooter } from "Components/Modal";
import CommonForm from "modules/pms/CommonForm/commonForm";
import { toast } from "react-toastify";

const Clone = ({ isScoreSettings, setIsScoreSettings }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location?.state?.data;
  const firstSegment = location.pathname.split("/")[1];
  const [loading, setLoading] = useState(false);
  // redux
  const { permissionList, profileData } = useSelector(
    (state) => state?.auth,
    shallowEqual
  );

  const { buId, wgId, wId, orgId } = profileData;

  let permission = {};
  permissionList.forEach((item) => {
    permission = item;
  });

  const [form] = Form.useForm();
  const params = useParams();
  const { type } = params;
  // Api Instance
  const levelOfLeaderApi = useApiRequest([]);

  const levelOfLeaderApiCall = () => {
    levelOfLeaderApi.action({
      urlKey: "GetAllPosition",
      method: "GET",
      params: {
        accountId: orgId,
        workplaceId: wId,
        businessUnitId: buId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strPositionGroupName;
          res[i].value = item?.intPositionGroupId;
        });
      },
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    levelOfLeaderApiCall();
  }, []);

  return permission?.isCreate ? (
    <div>
      {(loading || levelOfLeaderApi?.loading) && <Loading />}
      <PForm
        form={form}
        initialValues={
          type === "create"
            ? {
                employee: {
                  label: null,
                  value:
                    firstSegment === "SelfService"
                      ? profileData?.intEmployeeId
                      : null,
                },
              }
            : {
                reqId: data?.id,
                reasonForRequisition: data?.reasonForRequisition,
                employee: {
                  label: data?.employmentName,
                  value: data?.employmentTypeId,
                },
                trainingType: {
                  label: data?.trainingTypeName,
                  value: data?.trainingTypeId,
                },
                objectivesToAchieve: data?.objectivesToAchieve,
                remarks: data?.remarks,
                requisitionStatus: {
                  label: data?.status?.label,
                  value: data?.status?.value,
                },
                upcommingTraining: {
                  label: data?.upcommingTraining?.label,
                  value: data?.upcommingTraining?.value,
                },
                comments: data?.comments,
              }
        }
      >
        <CommonForm
          formConfig={makerFormConfig(levelOfLeaderApi?.data)}
          form={form}
        />

        <ModalFooter
          onCancel={() => {
            setIsScoreSettings(false);
          }}
          submitText="Clone"
          submitAction="submit"
          onSubmit={() => {
            const values = form.getFieldsValue(true);
            form
              .validateFields()
              .then(() => {
                // if (values?.barScore + values?.kpiScore !== 100) {
                //   return toast.error("Sum of KPI and BAR must be 100");
                // }
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

export default Clone;
