import { Col, Form } from "antd";
import Loading from "common/loading/Loading";
import { PButton, PForm } from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import CommonForm from "modules/pms/CommonForm/commonForm";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { levelOfLeaderApiCall } from "../evaluationCriteria/helper";
import {
  EvaluationPipelineForm,
  getLeadershipDDL,
  handleEvaluationPipelineSetting,
  StakeholderForm,
} from "./helper";
import StakeholderTable from "./StakeholderTable";
import { getEnumData } from "common/api/commonApi";

const EPCreateEdit = ({ modal, setModal, data, cb }) => {
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
  const [userGrp, getUserGrp, loadingUserGrp, setUserGrp] = useAxiosGet([]);
  const [stakeholderField, setStakeholderField] = useState([]);
  const [stakeholderTypeDDL, setStakeholderTypeDDL] = useState([]);
  const [evaluationCriteriaDDL, setEvaluationCriteriaDDL] = useState([]);

  let permission = {};
  permissionList.forEach((item) => {
    permission = item;
  });
  const CommonEmployeeDDL = useApiRequest([]);

  const [form] = Form.useForm();
  const params = useParams();
  const { type } = params;

  const doUserGrp = () => {
    const api = `/Auth/GetAllUserGroupByAccountId?PageNo=1&PageSize=125&searchTxt=`;
    getUserGrp(api, (res) => {
      const list = [];
      res?.data?.forEach((item, i) => {
        list.push({
          label: item?.strUserGroup,
          value: item?.intUserGroupHeaderId,
        });
      });
      setUserGrp(list);
    });
  };

  const getEmployee = (value) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: profileData?.buId,
        workplaceGroupId: profileData?.wgId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };

  const addHandler = (values) => {
    // const isDuplicate = stakeholderField.some(
    //   (org) => org.idx === values?.stakeholder?.label
    // );

    // if (isDuplicate) {
    //   toast.error("Stakeholder already exists");
    //   return;
    // }

    setStakeholderField([
      ...stakeholderField,
      {
        idx: values?.scoreWeight + stakeholderField?.length,
        stakeholderName: values?.stakeholder?.label,
        stakeholderId: values?.stakeholder?.value,
        stakeholderTypeName: values?.stakeholderType?.label,
        stakeholderTypeId: values?.stakeholderType?.value,
        scoreWeight: values?.scoreWeight,
      },
    ]);
    // form.resetFields(["stakeholder", "stakeholderType", "scoreWeight"]);
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    if (modal?.type !== "view") {
      levelOfLeaderApiCall(
        intAccountId,
        setLevelofLeaderShip,
        setLoading,
        true
      ); // Call the API

      getEnumData("StakeholderType", setStakeholderTypeDDL, setLoading);
      getEnumData("EvaluationCriteria", setEvaluationCriteriaDDL, setLoading);
    }
    if (modal?.type === "edit" || modal?.type === "view") {
      if (data?.rowDto) {
        const updatedRowDto = data.rowDto.map((item) => ({
          ...item,
          idx: item.rowId,
        }));

        setStakeholderField(updatedRowDto);
      }
    }
  }, []);
  const st = Form.useWatch("stakeholderType", form);

  return permission?.isCreate ? (
    <div>
      {loading && <Loading />}
      <PForm
        form={form}
        initialValues={
          modal?.type === "edit" || modal?.type === "view"
            ? {
                comments: data?.remarks,
                evaluationCriteria: {
                  label: data?.evaluationCriteriaName,
                  value: data?.evaluationCriteriaId,
                },
                positionGroupId: data?.levelOfLeadershipId,
                leadership: getLeadershipDDL(data?.positionGroupIdList),
                evaluationHeaderId: data?.evaluationHeaderId,
              }
            : {}
        }
      >
        <CommonForm
          formConfig={EvaluationPipelineForm(
            evaluationCriteriaDDL,
            levelofLeaderShip,
            modal?.type,
            form
          )}
          form={form}
        />
        {modal?.type !== "view" && (
          <CommonForm
            formConfig={StakeholderForm(
              st,
              modal?.type,
              form,
              getEmployee,
              CommonEmployeeDDL,
              doUserGrp,
              userGrp,
              stakeholderTypeDDL
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
                      const values = form.getFieldsValue(true);

                      addHandler(values);
                    })
                    .catch(() => {});
                }}
              />
            </Col>
          </CommonForm>
        )}
        {modal?.type !== "view" && (
          <ModalFooter
            onCancel={() => {
              setModal(() => ({ open: false, type: "" }));
            }}
            submitAction="submit"
            onSubmit={() => {
              const values = form.getFieldsValue(true);
              form
                .validateFields(["evaluationCriteria", "leadership"])
                .then(() => {
                  console.log("values", levelofLeaderShip);
                  handleEvaluationPipelineSetting(
                    form,
                    profileData,
                    stakeholderField,
                    levelofLeaderShip,
                    setLoading,
                    () => {
                      cb && cb();
                      setModal(() => ({ open: false, type: "" }));
                    }
                  );
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
          />
        )}
      </PForm>
      {stakeholderField?.length > 0 && (
        <StakeholderTable
          data={stakeholderField}
          setStakeholderField={setStakeholderField}
          type={modal?.type}
        />
      )}
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default EPCreateEdit;
