import { Col, Divider, Form, Row, Space } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { customFields } from "../utils";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import { createLetterType, getLetterTypeDDL } from "./helper";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";

const modules = {
  mention: {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
    mentionDenotationChars: ["@"],
    source: function (searchTerm: any, renderList: any, mentionChar: any) {
      let MentionValue: any[] = [];

      if (mentionChar === "@") {
        MentionValue = customFields;
      }

      if (searchTerm.length === 0) {
        renderList(MentionValue, searchTerm);
      } else {
        const matches = [];
        for (let i = 0; i < MentionValue.length; i++)
          if (
            ~MentionValue[i].value
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase())
          )
            matches.push(MentionValue[i]);
        renderList(matches, searchTerm);
      }
    },
  },
  toolbar: [
    { header: [1, 2, 3, false] },
    "bold",
    "italic",
    "underline",
    "blockquote",
    { list: "ordered" },
    { list: "bullet" },
    { indent: "-1" },
    { indent: "+1" },
    { color: [] },
    { background: [] },
    { align: [] },
    "link",
    "",
    "",
  ],
  clipboard: {
    matchVisual: true,
  },
};

const LetterConfigAddEdit = () => {
  // Router state
  const { letterId }: any = useParams();

  // Form Instance
  const [form] = Form.useForm();

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
    getLetterTypeDDL(profileData, setLoading, setLetterTypeDDL);
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   states
  const [loading, setLoading] = useState(false);
  const [letterTypeDDL, setLetterTypeDDL] = useState([]);

  return letterConfigPermission?.isCreate ? (
    <PForm
      formName="tempCreate"
      form={form}
      initialValues={{ letterType: "", letterName: "", letter: "" }}
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

                    console.log(modifiedLetter);
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
          </Row>
          <Row gutter={[10, 2]}>
            <Form.Item shouldUpdate noStyle>
              {() => {
                const { letter } = form.getFieldsValue(true);

                return (
                  <>
                    <Col className="custom_quill quilJob" md={18} sm={24}>
                      <label>
                        <span style={{ color: "red" }}>*</span>{" "}
                        <span style={{ fontSize: "12px", fontWeight: 500 }}>
                          Letter Body
                        </span>
                      </label>
                      <ReactQuill
                        preserveWhitespace={true}
                        placeholder="Write your letter body..."
                        value={letter}
                        modules={modules}
                        onChange={(value) =>
                          form.setFieldValue("letter", value)
                        }
                      />
                    </Col>
                    <Col md={6} sm={24}>
                      <div
                        style={{
                          marginTop: "21px",
                          backgroundColor: "var(--secondary-bg)",
                          height: "350px",
                          overflow: "scroll",
                        }}
                      >
                        {customFields?.map((dto: any, index: number) => (
                          <div key={index}>
                            <div
                              style={{
                                cursor: "pointer",
                                backgroundColor: "greenyellow",
                                margin: "5px",
                                padding: "3px",
                              }}
                              onClick={() => {
                                const text = `${form.getFieldValue(
                                  "letter"
                                )} @${dto?.value}`;
                                form.setFieldValue("letter", text);
                              }}
                            >
                              {dto?.label}
                            </div>
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
