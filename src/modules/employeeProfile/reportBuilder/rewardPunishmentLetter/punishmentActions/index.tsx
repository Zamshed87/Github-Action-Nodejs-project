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
import { useLocation, useParams } from "react-router-dom";
import { getLetterTypeDDL } from "../../letterConfiguration/letterConfigAddEdit.tsx/helper";
import { SaveRewardPunishmentAction } from "./helper";
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
import { modules } from "../../letterConfiguration/utils";
import { postPDFAction } from "utility/downloadFile";
import { useHistory } from "react-router-dom";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
const PunishmentAction = () => {
  // Router state
  // const { letterId }: any = useParams();
  const location = useLocation();
  const { recordData, letterData }: any = location?.state;
  const params = useParams<{ recordId: string }>();

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
        explanation: recordData?.explanation || "",

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
          title={"Punishment Action"}
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
                    if (!values?.explanation || !values?.action) {
                      return toast.warning("Please add letter template");
                    }
                    SaveRewardPunishmentAction(
                      form,
                      setLoading,
                      params?.recordId
                    );
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
              <PInput
                type="textarea"
                disabled={true}
                maxLength={250}
                showCount={true}
                name="explanation"
                label="Explanation"
                // rules={[{ required: true, message: "Explanation is required" }]}
              />
            </Col>
            <Col md={4} sm={24}>
              <PSelect
                options={[
                  { label: "Verbal Warning", value: 1 },
                  { label: "Written Warning", value: 2 },
                  { label: "Final Written Warning", value: 3 },
                  { label: "Suspension", value: 4 },
                  { label: "Demotion", value: 5 },
                  { label: "Termination", value: 6 },
                  { label: "Probation", value: 7 },
                  { label: "Coaching or Counseling", value: 8 },
                  { label: "Performance Improvement Plan (PIP)", value: 9 },
                ]}
                rules={[{ required: true, message: "Action is required" }]}
                name="action"
                label="Action"
                placeholder="Action"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    action: op,
                  });
                }}
              />
            </Col>
            <Col md={6} sm={24}>
              <PInput
                type="textarea"
                name="remarks"
                label="Remarks"
                placeholder="Remarks"
                rules={[{ required: true, message: "Remarks is required" }]}
              />
            </Col>
            <div className="mt-2">
              <h2>Punishment Letter </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: recordData?.letterBody,
                }}
              />
            </div>
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
        </Row>
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default PunishmentAction;
