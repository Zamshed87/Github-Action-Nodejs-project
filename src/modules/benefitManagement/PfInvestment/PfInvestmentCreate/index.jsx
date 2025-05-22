import { Form } from "antd";
import Loading from "common/loading/Loading";
import { PCard, PCardHeader, PForm } from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { toast } from "react-toastify";
import { createPFInvestment } from "./helper";
import PfInvestmentConfiguration from "./components/PfInvestmentConfig";
import { useHistory } from "react-router-dom";

const PfInvestmentCreate = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [saveData, setSaveData] = useState({
    employeeContributions: [],
    companyContributions: [],
  });
  // redux
  const {
    permissionList,
    profileData: { buId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    setPermission(
      permissionList.find((item) => item?.menuReferenceId === 30598)
    );
  }, [permissionList]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Benefits Management"));
    document.title = "PF Investment Creation";
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
            title={`PF Investment Create`}
            buttonList={[
              {
                type: "primary",
                content: "Save",
                onClick: () => {
                  form
                    .validateFields()
                    .then((values) => {
                      const payload = {
                        businessUnitId: buId,
                        investmentTypeId: values.investmentTypeId,
                        investmentOrganizationId:
                          values.investmentOrganizationId,
                        investmentDate: values.investmentDate,
                        investmentAmount: values.investmentAmount,
                        expectedROI: values.expectedROI,
                        investmentDuration: values.investmentDuration,
                        maturityDate: values.maturityDate,
                        remark: values.remark ?? "",
                      };
                      createPFInvestment(payload, setLoading, () => {
                        history.push("/BenefitsManagement/providentFund/pfInvestment");
                        form.resetFields();
                      });
                    })
                    .catch(() => {
                      toast.error("Please fill all required fields.");
                    });
                },
              },
            ]}
          />
          <PfInvestmentConfiguration
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

export default PfInvestmentCreate;
