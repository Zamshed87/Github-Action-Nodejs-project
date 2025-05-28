import { Form } from "antd";
import Loading from "common/loading/Loading";
import { PCard, PCardHeader, PForm } from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { toast } from "react-toastify";
import { createInvestmentCollection, getInvestmentCollection } from "./helper";
import PfInvestmentCollectionForm from "./components/PfInvestmentCollectionForm";
import { useHistory, useLocation } from "react-router-dom";

const PfInvestmentCollection = () => {
  const [form] = Form.useForm();
  const [saveData, setSaveData] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const isViewMode = location.pathname.includes("view");
  const record = location.state?.state?.data || {};
  // redux
  const {
    permissionList,
    profileData: { buId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    if (record?.investmentHeaderId) {
      getInvestmentCollection(
        record?.investmentHeaderId,
        setLoading,
        setSaveData
      );
    }
  }, [record?.investmentHeaderId]);

  useEffect(() => {
    setPermission(
      permissionList.find((item) => item?.menuReferenceId === 30598)
    );
  }, [permissionList]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Benefits Management"));
    document.title = `PF Investment ${isViewMode ? "View" : "Collection"}`;
    return () => {
      document.title = "PeopleDesk";
    };
  }, [isViewMode]);
  return permission?.isCreate ? (
    <div>
      {loading && <Loading />}
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            backButton
            title={`PF Investment ${isViewMode ? "View" : "Collection"}`}
            buttonList={[
              !isViewMode && {
                type: "primary",
                content: "Save",
                onClick: () => {
                  form
                    .validateFields(["isCollectionComplete"])
                    .then((values) => {
                      if (saveData.length < 1) {
                        toast.error(
                          "Please add at least one PF Investment Tracking."
                        );
                        return;
                      }
                      const payload = {
                        businessUnitId: buId,
                        investmentId: record?.investmentHeaderId,
                        isCollectionComplete: values?.isCollectionComplete,
                        rowData: saveData,
                      };
                      createInvestmentCollection(payload, setLoading, () => {
                        setSaveData([]);
                        form.resetFields();
                        history.push(
                          "/BenefitsManagement/providentFund/pfInvestment"
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
          <PfInvestmentCollectionForm
            form={form}
            saveData={saveData}
            setSaveData={setSaveData}
            isViewMode={isViewMode}
          />
        </PCard>
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default PfInvestmentCollection;
