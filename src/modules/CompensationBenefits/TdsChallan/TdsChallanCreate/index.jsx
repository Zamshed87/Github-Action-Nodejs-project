import { Form } from "antd";
import Loading from "common/loading/Loading";
import { PCard, PCardHeader, PForm } from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { toast } from "react-toastify";
import TdsChallanCreateForm from "./components/TdsChallanCreateForm";
import { createTdsChallan } from "./helper";
import { useHistory } from "react-router-dom";

const TdsChallanCreate = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [saveData, setSaveData] = useState([]);
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
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Benefits Management - TDS CHALLAN Create";
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
            title={`TDS Challan Create`}
            buttonList={[
              {
                type: "primary",
                content: "Save",
                onClick: () => {
                  const commonFields = [
                    "ListOfFiscalYear",
                    "ListOfWorkplace",
                  ];
                  form
                    .validateFields(commonFields)
                    .then((values) => {
                      if (
                        saveData.length < 1
                      ) {
                        toast.error(
                          "Please add at least one Challan."
                        );
                        return;
                      }

                      const payload = {
                        ...values,
                        ListOfTaxChallanDetail : saveData
                      };
                      createTdsChallan(payload, setLoading, () => {
                        setSaveData([]);
                        form.resetFields();
                        history.push(
                          `/compensationAndBenefits/incometaxmgmt/tdsChallan`
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
          <TdsChallanCreateForm
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
