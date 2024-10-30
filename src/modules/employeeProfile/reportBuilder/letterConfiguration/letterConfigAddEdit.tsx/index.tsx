/*
 * Title: Letter Config Add and Edits
 * Author: Khurshida Meem
 * Date: 23-10-2024
 *
 */

import { Col, Divider, Form, Row, Space } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
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
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { customFields, modules } from "../utils";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import {
  createLetterType,
  createNEditLetterTemplate,
  getLetterTypeDDL,
} from "./helper";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import FileUploadComponents from "utility/Upload/FileUploadComponents";

const LetterConfigAddEdit = () => {
  // Router state
  const { letterId }: any = useParams();
  const location = useLocation();
  const letterData: any = location?.state;
  const quillRef: any = useRef(null);

  // Form Instance
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { orgId, buId, employeeId } = profileData;

  // menu permission
  let letterConfigPermission: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30440) {
      letterConfigPermission = item;
    }
  });

  console.log();

  useEffect(() => {
    getLetterTypeDDL(profileData, setLoading, setLetterTypeDDL);
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   states
  const [loading, setLoading] = useState(false);
  const [letterTypeDDL, setLetterTypeDDL] = useState([]);
  const [empSignature, setEmpAuthSignature] = useState<any>([]);
  const [fields, setFields] = useState(customFields);

  const handleInsertField = (fieldValue: any) => {
    const quill = quillRef?.current?.getEditor();

    const cursorPosition = quill?.getSelection()?.index;
    // const currentContent = quill.getText();
    // Insert the field value at the cursor position
    cursorPosition >= 0 && quill.insertText(cursorPosition, `@${fieldValue}`);
  };

  const handleSearch = (e: any) => {
    const keyword = e.target.value;
    // Filter fields based on the search term
    const filteredFields = customFields.filter((field) =>
      field.label.toLowerCase().includes(keyword.toLowerCase())
    );

    setFields(filteredFields);
  };

  return letterConfigPermission?.isCreate ? (
    <PForm
      formName="tempCreate"
      form={form}
      initialValues={{
        letterType: letterData?.letterType
          ? { label: letterData?.letterType, value: letterData?.letterTypeId }
          : "",
        letterName: letterData?.letterName || "",
        letter: letterData?.letterBody || "",
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
              icon: "plus",
              disabled: loading,
              onClick: () => {
                const values = form.getFieldsValue(true);

                form
                  .validateFields()
                  .then(() => {
                    if (!values?.letter) {
                      return toast.warning("Please add letter template");
                    }
                    const transformedHTML = document.createElement("div");
                    transformedHTML.innerHTML = values?.letter;
                    const mentions =
                      transformedHTML.querySelectorAll("span.mention");
                    mentions.forEach((mention) => {
                      const mentionElement = mention as HTMLElement;
                      mention.outerHTML = `@${mentionElement.dataset.value}`;
                    });
                    const modifiedLetter = transformedHTML.innerHTML;
                    form.setFieldValue("letter", modifiedLetter);
                    form.setFieldValue(
                      "backgroudImageId",
                      empSignature?.[0]?.response?.[0]?.globalFileUrlId || 0
                    );

                    createNEditLetterTemplate(
                      form,
                      profileData,
                      setLoading,
                      letterData
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
              <PSelect
                options={letterTypeDDL}
                name="letterType"
                label="Letter Type"
                placeholder="Letter Type"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    letterType: op,
                  });
                }}
                rules={[
                  {
                    required: true,
                    message: "Letter Type is required",
                  },
                ]}
                dropdownRender={(menu: any) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Space style={{ padding: "0 8px 4px" }}>
                      <PInput
                        type="text"
                        name="newLetterName"
                        placeholder="New Letter"
                      />
                      <PButton
                        type="primary-text"
                        content={"Add New"}
                        icon={<PlusOutlined />}
                        onClick={() => {
                          if (!form.getFieldValue("newLetterName")) {
                            return toast.error("Please provide a type");
                          }
                          createLetterType(
                            form.getFieldsValue(true),
                            profileData,
                            setLoading,
                            setLetterTypeDDL
                          );
                          form.setFieldValue("newLetterName", "");
                        }}
                      />
                    </Space>
                  </>
                )}
              />
            </Col>
            <Col md={6} sm={24}>
              <PInput
                type="text"
                name="letterName"
                label="Letter Name"
                placeholder="Letter Name"
                rules={[{ required: true, message: "Letter Name is required" }]}
              />
            </Col>
            <Col className="mt-2" md={6} sm={24}>
              <div className="mt-3">
                <FileUploadComponents
                  propsObj={{
                    title: "Background Image",
                    attachmentList: empSignature,
                    setAttachmentList: setEmpAuthSignature,
                    accountId: orgId,
                    tableReferrence: "LeaveAndMovement",
                    documentTypeId: 15,
                    userId: employeeId,
                    buId,
                    maxCount: 1,
                    accept: "image/png, image/jpeg, image/jpg",
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row gutter={[10, 2]}>
            <Form.Item shouldUpdate noStyle>
              {() => {
                const { letter } = form.getFieldsValue(true);

                return (
                  <>
                    <Col className="custom_quill quil_template" md={20} sm={24}>
                      <label>
                        <span style={{ color: "red" }}>*</span>{" "}
                        <span style={{ fontSize: "12px", fontWeight: 500 }}>
                          Letter Body
                        </span>
                      </label>
                      <ReactQuill
                        ref={quillRef}
                        preserveWhitespace={true}
                        placeholder="Write your letter body..."
                        value={letter}
                        modules={modules}
                        onChange={(value) => {
                          form.setFieldValue("letter", value);
                        }}
                      />
                    </Col>
                    <Col md={4} sm={24}>
                      <div
                        style={{
                          marginTop: "21px",
                          backgroundColor: "#F4F9F5",
                          height: "350px",
                          overflow: "scroll",
                        }}
                      >
                        <Flex
                          justify="space-between"
                          align="center"
                          style={{
                            backgroundColor: "darkgray",
                            padding: "5px",
                            position: "sticky",
                            top: 0,
                          }}
                        >
                          <p style={{ color: "white" }}>Field Lists</p>
                          <input
                            style={{
                              maxWidth: "150px",
                              border: "none",
                              padding: "1px 4px",
                              fontSize: "13px",
                            }}
                            type="search"
                            placeholder="Search..."
                            onChange={handleSearch}
                          />
                        </Flex>
                        <div style={{ padding: "0 5px" }}></div>
                        {fields?.map((dto: any, index: number) => (
                          <div key={index}>
                            <button
                              type="button"
                              style={{
                                cursor: "pointer",
                                backgroundColor: "#DDF7E1",
                                borderRadius: "50px",
                                margin: "5px",
                                padding: "2px 6px",
                                fontSize: "12px",
                              }}
                              onClick={() => {
                                handleInsertField(dto?.value);
                              }}
                            >
                              {dto?.label}
                            </button>
                          </div>
                        ))}
                      </div>
                    </Col>
                  </>
                );
              }}
            </Form.Item>
          </Row>
        </PCardBody>
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default LetterConfigAddEdit;
