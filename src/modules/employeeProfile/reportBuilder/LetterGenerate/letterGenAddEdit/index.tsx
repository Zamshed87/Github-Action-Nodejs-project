/*
 * Title: Letter Generate add and edit
 * Author: Khurshida Meem
 * Date: 24-10-2024
 *
 */

import { Col, Form, Row } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getLetterTypeDDL } from "../../letterConfiguration/letterConfigAddEdit.tsx/helper";
import {
  createNEditLetterGenerate,
  getLetterNameDDL,
  getLetterPreview,
  getLetterPreviewAndTransform,
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
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { useApiRequest } from "Hooks";
import { postPDFAction } from "utility/downloadFile";
import RichTextEditor from "common/RichTextEditor/RichTextEditor";
import Loading from "common/loading/Loading";

import html2pdf from 'html2pdf.js';
const LetterGenAddEdit = () => {
  // Router state
  // const { letterId }: any = useParams();
  const location = useLocation();
  const letterData: any = location?.state;

  // Form Instance
  const [form] = Form.useForm();

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
  const templateRef = useRef<string>(""); // 👈 Holds unmodified letter template

  //   api calls
  const CommonEmployeeDDL = useApiRequest([]);
  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "EmployeeCommonDDL",
      method: "GET",
      params: {
        businessUnitId: profileData?.buId,
        workplaceGroupId: profileData?.wgId,
        searchText: value,
        workplaceId: profileData?.wId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    }).then();
  };

  return letterGenPermission?.isCreate ? (
    <PForm
      formName="tempCreate"
      form={form}
      initialValues={{
        letterId: "",
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
      {loading && <Loading />}
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
                    createNEditLetterGenerate(
                      form,
                      profileData,
                      setLoading,
                      letterData
                    ).then();
                  })
                  .catch(() => {
                    console.log('');
                  });
              },
            },
          ]}
        />
        <PCardBody>
          <Row gutter={[10, 2]}>
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
                  form.resetFields(["letterName", "employee"]);
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
                  getLetterPreview(profileData, setLoading, form, templateRef);
                  form.resetFields(["employee"]);
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
                  getLetterPreviewAndTransform(profileData, setLoading, form, templateRef);
                }}
                onSearch={(value) => {
                  getEmployee(value);
                }}
                showSearch
                filterOption={false}
                allowClear={true}
              />
            </Col>
          </Row>
        </PCardBody>
        <Flex className="my-2" justify="flex-end">
          {/* <PButton
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
              handleDownload();
              return;
              postPDFAction(
                "/PdfAndExcelReport/GetGeneratedLetterPreviewPDF",
                payload,
                setLoading
              ).then();
            }}
            disabled={!form.getFieldValue("letterId")}
          /> */}
        </Flex>
        <Row gutter={[10, 2]}>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { letter } = form.getFieldsValue(true);
              return (
                <>
                  <Col className="custom_quill quilJob" md={24} sm={24}>
                    <RichTextEditor
                      height={800}
                      value={letter}
                      onChange={(data) => {
                        form.setFieldValue("letter", data);
                      }}
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

export default LetterGenAddEdit;
