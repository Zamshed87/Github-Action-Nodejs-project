import { Form, Row } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { PCard, PCardBody, PCardHeader, PForm } from "Components";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";

const QuestionCreationAddEdit = () => {
  // Router state
  const { quesId }: any = useParams();
  const location = useLocation();
  const letterData: any = location?.state;
  const history = useHistory();

  // Form Instance
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  //   states
  const [loading, setLoading] = useState(false);

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

  return letterConfigPermission?.isCreate ? (
    <PForm
      formName="tempCreate"
      form={form}
      initialValues={{
        letterType: letterData?.letterType
          ? { label: letterData?.letterType, value: letterData?.letterTypeId }
          : "",
        letterName: letterData?.letterName || "",
        backgroudImageId: letterData?.backgroudImageId || 0,
        letter: (
          letterData?.letterBody?.match(/<body>([\s\S]*?)<\/body>/i)?.[1] ||
          letterData?.letterBody ||
          ""
        ).trim(),
      }}
    >
      <PCard>
        <PCardHeader
          title={quesId ? "Edit Question" : "Create Question"}
          backButton={true}
          buttonList={[
            {
              type: "primary",
              content: "Save",
              icon: "plus",
              disabled: loading,
              onClick: () => {
                const values = form.getFieldsValue(true);
              },
            },
          ]}
        />
        <PCardBody>
          <Row gutter={[10, 2]}></Row>
        </PCardBody>
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default QuestionCreationAddEdit;
