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
import { getLetterTypeDDL } from "../../letterConfiguration/letterConfigAddEdit.tsx/helper";
import {
  CreateRewardPunishmentRecord,
  editRewardPunishmentRecord,
  getLetterNameDDL,
  getLetterPreview,
} from "./helper";
import {
  Flex,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PSelect,
} from "Components";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { useApiRequest } from "Hooks";
import { modules } from "../../letterConfiguration/utils";
import { postPDFAction } from "utility/downloadFile";
import { useHistory } from "react-router-dom";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
const RewardPunishmentLetterGenAddEdit = () => {
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
    getLetterTypeDDL(profileData, setLoading, setLetterTypeDDL);
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   states
  const [loading, setLoading] = useState(false);
  const [letterTypeDDL, setLetterTypeDDL] = useState([]);
  const [letterNameDDL, setLetterNameDDL] = useState([]);

  //   api calls
  const CommonEmployeeDDL = useApiRequest([]);
  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: profileData?.buId,
        workplaceGroupId: profileData?.wgId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };

  return letterGenPermission?.isCreate ? (
    <PForm
      formName="tempCreate"
      form={form}
      initialValues={{
        letterType: letterData?.letterType
          ? { label: letterData?.letterType, value: letterData?.letterTypeId }
          : "",
        letterName: letterData?.letterName
          ? { label: letterData?.letterName, value: letterData?.letterName }
          : "",
        letter: letterData?.generatedLetterBody || "",
        employee: letterData?.issuedEmployeeId
          ? {
              label: letterData?.issuedEmployeeName,
              value: letterData?.issuedEmployeeId,
            }
          : "",
      }}
    >
      <PCard>
        <PCardHeader
          title={"Create Template"}
          backButton={true}
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
                    if (!values?.letter) {
                      return toast.warning("Please add letter template");
                    }
                    CreateRewardPunishmentRecord(
                      form,
                      profileData,
                      setLoading,
                      letterData,
                      attachmentList
                    );
                  })
                  .catch(() => {
                    console.log();
                  });
              },
            },
            {
              type: "primary",
              content: "Save & Send",
              disabled: loading,
              onClick: () => {
                const values = form.getFieldsValue(true);

                form
                  .validateFields()
                  .then(() => {
                    if (!values?.letter) {
                      return toast.warning("Please add letter template");
                    }
                    // createNEditLetterGenerate(
                    //   form,
                    //   profileData,
                    //   setLoading,
                    //   letterData
                    // );
                  })
                  .catch(() => {
                    console.log();
                  });
              },
            },
          ]}
        />
        <PCardBody>
          <Row gutter={[10, 2]}>
            <Col md={4} sm={24}>
              <PSelect
                options={[
                  { label: "Reward", value: 1 },
                  { label: "Punishment", value: 2 },
                ]}
                name="issuedType"
                label="Issued Type"
                placeholder="Issued Type"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    issuedType: op,
                  });
                  // getLetterNameDDL(
                  //   profileData,
                  //   setLoading,
                  //   setLetterNameDDL,
                  //   value
                  // );
                }}
              />
            </Col>
            <Col md={6} sm={24}>
              <PSelect
                options={letterTypeDDL}
                name="letterType"
                label="Letter Type"
                placeholder="Letter Type"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    letterType: op,
                  });
                  getLetterNameDDL(
                    profileData,
                    setLoading,
                    setLetterNameDDL,
                    value
                  );
                }}
              />
            </Col>
            <Col md={6} sm={24}>
              <PSelect
                options={letterNameDDL}
                name="letterName"
                label="Letter Name"
                placeholder="Letter Name"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    letterName: op,
                  });
                  // getLetterPreview(profileData, setLoading, form);
                }}
              />
            </Col>
            <Col md={6} sm={24}>
              <PSelect
                name="employee"
                label="Employee"
                placeholder="Search Min 2 char"
                options={CommonEmployeeDDL?.data || []}
                loading={CommonEmployeeDDL?.loading}
                onChange={(value, op) => {
                  form.setFieldsValue({
                    employee: op,
                  });
                  getLetterPreview(profileData, setLoading, form);
                }}
                onSearch={(value) => {
                  getEmployee(value);
                }}
                showSearch
                filterOption={false}
                allowClear={true}
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
                      tableReferrence: "REWARD_PUNISHMENT_LETTER",
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
        <Flex className="my-3 mr-2" gap="large" justify="flex-end">
          <PButton
            type="primary"
            action="button"
            content="Edit"
            onClick={(e: any) => {
              e.stopPropagation();

              editRewardPunishmentRecord(
                form,
                profileData,
                setLoading,
                letterData,
                () =>
                  history.push("/profile/customReportsBuilder/rewardPunishment")
              );
            }}
            disabled={form.getFieldValue("letterId") ? false : true}
          />
          <PButton
            className="ml-2"
            type="primary"
            action="button"
            content="Preview"
            onClick={(e: any) => {
              const { employee, letterId, letter } = form.getFieldsValue(true);
              e.stopPropagation();
              const payload = {
                isForPreview: true,
                issuedEmployeeId: employee?.value || 0,
                templateId: letterId,
                letterGenerateId: letterId || 0,
                letterBody: letter,
              };
              postPDFAction(
                "/PdfAndExcelReport/GetGeneratedLetterPreviewPDF",
                payload,
                setLoading
              );
            }}
            disabled={form.getFieldValue("letterId") ? false : true}
          />
        </Flex>
        <Row gutter={[10, 2]}>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { letter } = form.getFieldsValue(true);

              return (
                <>
                  <Col className="custom_quill quilJob" md={24} sm={24}>
                    <ReactQuill
                      preserveWhitespace={true}
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
          </Form.Item>
        </Row>
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default RewardPunishmentLetterGenAddEdit;
