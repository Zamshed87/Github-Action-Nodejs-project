import { Form } from "antd";
import Loading from "common/loading/Loading";
import { PCard, PCardHeader, PForm } from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { toast } from "react-toastify";
import PfPolicyConfiguration from "./components/PfPolicyConfiguration";
import { createPFPolicy } from "./helper";
import { useHistory } from "react-router-dom";

const TdsChallanCreate = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [saveData, setSaveData] = useState({
    employeeContributions: [],
    companyContributions: [],
  });
  // redux
  const {
    permissionList,
    profileData: { buId, wgId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    setPermission(
      permissionList.find((item) => item?.menuReferenceId === 30597)
    );
  }, [permissionList]);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Benefits Management"));
    document.title = "Benefits Management - PF Policy Create";
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
            title={`PF Policy`}
            buttonList={[
              {
                type: "primary",
                content: "Save",
                onClick: () => {
                  const commonFields = [
                    "strPolicyName",
                    "strPolicyCode",
                    "intWorkPlaceId",
                    "intEmploymentTypeIds",
                    "intPfEligibilityDependOn",
                    "intEmployeeContributionPaidAfter",
                    "isPFInvestment",
                    "intMonthlyInvestmentWith",
                    "intEmployeeContributionInFixedMonth",
                  ];
                  form
                    .validateFields(commonFields)
                    .then((values) => {
                
                      if (saveData.employeeContributions.length < 1 && saveData.companyContributions.length < 1) {
                        toast.error("Please add at least one employee or company contribution.");
                        return;
                      }

                      const payload = {
                        intBusinessUnitId: buId,
                        intWorkPlaceGroupId: wgId,
                        strPolicyName: values?.strPolicyName,
                        strPolicyCode: values?.strPolicyCode,
                        intWorkPlaceId: values?.intWorkPlaceId,
                        intEmploymentTypeIds: values?.intEmploymentTypeIds,
                        intPfEligibilityDependOn:
                          values?.intPfEligibilityDependOn?.value,
                        employeeContributions: saveData?.employeeContributions,
                        ...saveData,
                        intEmployeeContributionPaidAfter:
                          values?.intEmployeeContributionPaidAfter?.value,
                        intEmployeeContributionInFixedMonth:
                          values?.intEmployeeContributionInFixedMonth ?? 0,
                        isPFInvestment: values?.isPFInvestment,
                        intMonthlyInvestmentWith:
                          values?.intMonthlyInvestmentWith,
                      };
                      createPFPolicy(payload, setLoading, () => {
                        setSaveData({
                          employeeContributions: [],
                          companyContributions: [],
                        });
                        form.resetFields();
                        history.push(
                          `/BenefitsManagement/providentFund/pfPolicy`
                        );
                      });
                    })
                    .catch(() => {
                      toast.error("Please fill all required fields.");
                    });
                },
              },
            ]}
          />
          <PfPolicyConfiguration
            form={form}
            saveData={saveData}
            setSaveData={setSaveData}
          />
        </PCard>
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default TdsChallanCreate;
