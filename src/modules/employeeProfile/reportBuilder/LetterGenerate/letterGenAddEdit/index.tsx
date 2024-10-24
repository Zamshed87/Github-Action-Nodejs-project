/*
 * Title: Letter Generate add and edit
 * Author: Khurshida Meem
 * Date: 24-10-2024
 *
 */

import { Col, Form, Row } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { getLetterTypeDDL } from "../../letterConfiguration/letterConfigAddEdit.tsx/helper";
import { createNEditLetterGenerate, getLetterNameDDL } from "./helper";
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
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";

const LetterGenAddEdit = () => {
  // Router state
  const { letterId }: any = useParams();
  const location = useLocation();
  const letterData: any = location?.state;

  console.log(letterData);

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
        letterName: letterData?.letterName || "",
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
          title={letterId ? "Edit Template" : "Create Template"}
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
                    createNEditLetterGenerate(form, profileData, setLoading);
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
          <PButton
            type="primary"
            action="button"
            content="Preview"
            onClick={(e: any) => {
              e.stopPropagation();
              dispatch(getDownlloadFileView_Action(24275));
            }}
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

export default LetterGenAddEdit;
