import { Form } from "antd";
import Loading from "common/loading/Loading";
import { PCard, PCardHeader, PForm } from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { toast } from "react-toastify";
import TdsChallanCreateForm from "./components/TdsChallanCreateForm";
import { createTdsChallan, getTaxChallan } from "./helper";
import { useHistory, useLocation } from "react-router-dom";

const TdsChallanCreate = () => {
  const history = useHistory();
  const location = useLocation();
  let headerId = location.state?.record?.intId;
  const path = location.pathname?.split('/')[4];
  const view = path == "view";
  const edit = path == "edit";
  const [form] = Form.useForm();
  const [saveData, setSaveData] = useState([]);
  // redux
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState(null);
  useEffect(() => {

    if (headerId && (view || edit)) {
      getTaxChallan(headerId, setLoading, setSaveData, form);
    }
  }, [headerId, view, edit]);
  useEffect(() => {
    setPermission(
      permissionList.find((item) => item?.menuReferenceId === 30621)
    );
  }, [permissionList]);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Benefits Management - TDS CHALLAN Create";
    return () => {
      document.title = "PeopleDesk";
    };
  }, []);
  console.log(saveData)
  return permission?.isCreate ? (
    <div>
      {loading && <Loading />}
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            backButton
            title={`Tax Challan ${path}`}
            buttonList={!view && [
              {
                type: "primary",
                content: "Save",
                onClick: () => {
                  const commonFields = ["ListOfFiscalYear", "ListOfWorkplace"];
                  form
                    .validateFields(commonFields)
                    .then((values) => {
                      if (saveData.length < 1) {
                        toast.error("Please add at least one Challan.");
                        return;
                      }

                      const payload = {
                        ...values,
                        ListOfTaxChallanDetail: saveData,
                      };
                      createTdsChallan(payload, setLoading, () => {
                        setSaveData([]);
                        form.resetFields();
                        history.push(
                          `/compensationAndBenefits/incometaxmgmt/taxChallan`
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
            edit={edit}
            view={view}
          />
        </PCard>
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default TdsChallanCreate;
