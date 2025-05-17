import { Form } from "antd";
import Loading from "common/loading/Loading";
import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import ConfigSelection from "./components/PfPolicyConfiguration/ConfigSelection";
import { createAbsentPunishment, detailsHeader } from "./helper";
import { toast } from "react-toastify";

const AbsentPunishmentConfiguration = () => {
  const [form] = Form.useForm();
  const [saveData, setSaveData] = useState({
    employeeContributions: [],
    employerContributions: [],
  });
  // redux
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState(null);


  useEffect(() => {
    setPermission(
      permissionList.find((item) => item?.menuReferenceId === 30590)
    );
  }, [permissionList]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Absent Punishment";
    return () => {
      document.title = "PeopleDesk";
    };
  }, []);
  const absentCalculationType = Form.useWatch("absentCalculationType", form);
  return permission?.isCreate ? (
    <div>
      {loading && <Loading />}
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            backButton
            title={`Absent Punishment Configuration`}
            buttonList={[
              {
                type: "primary",
                content: "Save",
                onClick: () => {
                  form
                    .validateFields([
                      "workplaceId",
                      "employmentTypeList",
                      "designationList",
                      "policyName",
                      "policyDescription",
                      "absentCalculationType",
                    ])
                    .then((values) => {
                      // if (detailList.length < 1) {
                      //   toast.error("Please add at least one detail.");
                      //   return;
                      // }
                      const payload = {
                        workplaceId: values?.workplaceId,
                        employmentTypeList: values?.employmentTypeList,
                        designationList: values?.designationList,
                        policyName: values?.policyName,
                        policyDescription: values?.policyDescription,
                        absentCalculationType: values?.absentCalculationType,
                        // absentPunishmentElementDto: [...detailList],
                      };
                      createAbsentPunishment(
                        payload,
                        setLoading,
                        // setDetailList
                      );
                      form.resetFields();
                    })
                    .catch((_) => {
                      toast.error("Please fill all required fields.");
                    });
                },
              },
            ]}
          />
          {/* <ConfigSelection form={form} setDetailList={setDetailList} /> */}
        </PCard>
        {/* {detailList?.length > 0 && (
          <PCardBody>
            <DataTable
              bordered
              data={detailList}
              rowKey={(row, idx) => idx}
              header={detailsHeader(setDetailList, absentCalculationType)}
            />
          </PCardBody>
        )} */}
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default AbsentPunishmentConfiguration;
