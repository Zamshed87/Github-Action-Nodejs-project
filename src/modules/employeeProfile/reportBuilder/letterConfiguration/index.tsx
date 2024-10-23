/*
 * Title: Letter Config Landing
 * Author: Khurshida Meem
 * Date: 23-10-2024
 *
 */

import { Form } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { PCard, PCardHeader, PForm } from "Components";
import { debounce } from "lodash";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const LetterConfigLanding = () => {
  // router states
  const history = useHistory();

  // Form Instance
  const [form] = Form.useForm();

  //   Data from redux state
  const dispatch = useDispatch();

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  // menu permission
  let letterConfigPermission: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30440) {
      letterConfigPermission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchFunc = debounce((value) => {
    // landingApiCall({
    //   filerList: filterList,
    //   searchText: value,
    // });
  }, 500);

  return (
    <PForm form={form}>
      <PCard>
        <PCardHeader
          title={`Total *** templates`}
          onSearch={(e) => {
            searchFunc(e?.target?.value);
            form.setFieldsValue({
              search: e?.target?.value,
            });
          }}
          buttonList={[
            {
              type: "primary",
              content: "Configure Letter",
              icon: "plus",
              onClick: () => {
                if (letterConfigPermission?.isCreate) {
                  history.push(
                    "/profile/customReportsBuilder/letterConfiguration/createLetter"
                  );
                } else {
                  toast.warn("You don't have permission");
                }
              },
            },
          ]}
        ></PCardHeader>
      </PCard>
    </PForm>
  );
};

export default LetterConfigLanding;
