/*
 * Title: Reward & Punishment Letter Generate add and edit
 * Author: Adel Md. Adnan
 * Date: 11-11-2024
 *
 */

import { Col, Form, Row } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import {
  Flex,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";

import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { useApiRequest } from "Hooks";
// import { modules } from "../../letterConfiguration/utils";
import { postPDFAction } from "utility/downloadFile";
import { useHistory } from "react-router-dom";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
import { modules } from "modules/employeeProfile/reportBuilder/letterConfiguration/utils";
import {
  getLetterPreview,
  SaveRewardPunishmentExplanation,
} from "./letterGenAddEdit/helper";
import FormikTextArea from "common/FormikTextArea";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PunishmentExplantion = ({ punishmentData }: any) => {
  // Router state
  // const { letterId }: any = useParams();
  const location = useLocation();
  const letterData: any = location?.state;

  console.log(letterData, "letterData");
  // state
  const [isOpen, setIsOpen] = useState(false);
  const [attachmentList, setAttachmentList] = useState([]);
  // Form Instance
  const [form] = Form.useForm();
  const history = useHistory();

  const dispatch = useDispatch();

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  // menu permission
  let letterGenPermission: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30441) {
      letterGenPermission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   states
  const [loading, setLoading] = useState(false);

  return letterGenPermission?.isCreate ? (
    <PForm
      formName="tempCreate"
      form={form}
      initialValues={{
        letter: punishmentData?.letterBody || "",
      }}
    >
      <PCard>
        <PCardHeader
          buttonList={[
            {
              type: "primary",
              content: "Save",
              disabled: loading,
              onClick: () => {
                const values = form.getFieldsValue(true);

                form
                  .validateFields()
                  .then(() => {
                    if (!values?.explanation) {
                      return toast.warning("Please add explanation");
                    }
                    SaveRewardPunishmentExplanation(
                      form,
                      profileData,
                      setLoading,
                      punishmentData,
                      attachmentList
                    );
                  })
                  .catch(() => {
                    console.log();
                  });
              },
            },
          ]}
          title={""}
          backButton={false}
        />
        <PCardBody>
          <Row gutter={[10, 2]}>
            <Col md={24} sm={24}>
              <PInput
                type="textarea"
                maxLength={250}
                showCount={true}
                name="explanation"
                label="Explanation"
                placeholder="...explanation"
                rules={[{ required: true, message: "Explanation is required" }]}
              />
            </Col>
            <Col
              style={{
                marginTop: "23px",
              }}
            >
              <PButton
                type="primary"
                action="submit"
                content="View"
                onClick={() => {
                  getLetterPreview(profileData, setLoading, form);
                }}
              />
            </Col>
            <Col md={24} style={{ marginTop: "1.4rem" }}>
              <div>
                <>
                  <FileUploadComponents
                    propsObj={{
                      isOpen,
                      setIsOpen,
                      destroyOnClose: false,
                      attachmentList,
                      setAttachmentList,
                      accountId: profileData?.orgId,
                      tableReferrence: "REWARD_PUNISHMENT_EXPLANATION",
                      documentTypeId: 24,
                      userId: profileData?.employeeId,
                      buId: profileData?.buId,
                      maxCount: 20,
                      isIcon: true,
                      isErrorInfo: true,
                      subText:
                        "Recommended file formats are: PDF, JPG and PNG. Maximum file size is 2 MB",
                    }}
                  />
                </>
              </div>
            </Col>
          </Row>
        </PCardBody>

        <Row gutter={[10, 2]}>
          {/* <Form.Item shouldUpdate noStyle>
            {() => {
              const { letter } = form.getFieldsValue(true);

              return (
                <>
                  <Col className="custom_quill quilJob" md={24} sm={24}>
                    <ReactQuill
                      preserveWhitespace={true}
                      readOnly={true}
                      placeholder="letter body..."
                      value={letter}
                      modules={{
                        toolbar: modules.toolbar,
                        clipboard: modules.clipboard,
                      }}
                      onChange={(value) => form.setFieldValue("letter", value)}
                    />
                  </Col>
                </>
              );
            }}
          </Form.Item> */}
          <div className="mt-2">
            <h2>Punishment Letter </h2>
            <div
              dangerouslySetInnerHTML={{
                __html: punishmentData?.letterBody,
              }}
            />
          </div>
        </Row>
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default PunishmentExplantion;
