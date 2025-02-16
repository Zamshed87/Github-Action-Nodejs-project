import { Form } from "antd";
import Loading from "common/loading/Loading";
import { PForm } from "Components";
import { useApiRequest } from "Hooks";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { handleBehavouralFactorClone, makerFormConfig } from "./helper";

import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { ModalFooter } from "Components/Modal";
import CommonForm from "modules/pms/CommonForm/commonForm";
import { toast } from "react-toastify";
import { levelOfLeaderApiCall } from "../evaluationCriteria/helper";

const Clone = ({ data, isScoreSettings, setIsScoreSettings }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const firstSegment = location.pathname.split("/")[1];
  const [loading, setLoading] = useState(false);
  const [levelofLeaderShip, setLevelofLeaderShip] = useState([]);

  // redux
  const { permissionList, profileData } = useSelector(
    (state) => state?.auth,
    shallowEqual
  );

  const { buId, wgId, wId, orgId, intAccountId } = profileData;

  let permission = {};
  permissionList.forEach((item) => {
    permission = item;
  });

  const [form] = Form.useForm();
  const params = useParams();
  const { type } = params;
  // Api Instance

  const filterLeadershipDDL = (items) => {
    console.log("items", items);
    const list = [];
    items?.forEach((item, i) => {
      if (item?.label !== data?.label)
        list.push({
          label: item?.label,
          value: item?.value,
        });
    });
    setLevelofLeaderShip(list);
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    const fetchData = async () => {
      const data = await levelOfLeaderApiCall(
        intAccountId,
        setLevelofLeaderShip,
        setLoading
      );
      filterLeadershipDDL(data);
    };
    fetchData();
  }, []);

  return permission?.isCreate ? (
    <div>
      {loading && <Loading />}
      <PForm
        form={form}
        initialValues={{
          fromLeadership: {
            label: data?.label,
            value: data?.value,
          },
        }}
      >
        <CommonForm
          formConfig={makerFormConfig(levelofLeaderShip)}
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
                handleBehavouralFactorClone(
                  values,
                  profileData,
                  setLoading,
                  () => {
                    setIsScoreSettings(false);
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

export default Clone;
