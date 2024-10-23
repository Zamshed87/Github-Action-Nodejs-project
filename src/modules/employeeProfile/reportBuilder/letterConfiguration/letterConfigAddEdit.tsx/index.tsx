import { Col, Form, Row } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
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

const atValues = [
  { id: "", value: "[First Name]" },
  { id: 2, value: "[Last Name]" },
  { id: 3, value: "[Position Name]" },
  { id: 4, value: "[Company Name]" },
];
const modules = {
  mention: {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
    mentionDenotationChars: ["@"],
    source: function (searchTerm: any, renderList: any, mentionChar: any) {
      let values;

      if (mentionChar === "@") {
        values = atValues;
      }

      if (searchTerm.length === 0) {
        renderList(values, searchTerm);
      } else {
        const matches = [];
        //@ts-ignore
        for (let i = 0; i < values.length; i++)
          if (
            //@ts-ignore
            ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
          )
            //@ts-ignore
            //@ts-ignore
            matches.push(values[i]);
        renderList(matches, searchTerm);
      }
    },
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
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   states
  const [loading, selLoading] = useState(false);

  return (
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
              onClick: () => {},
            },
          ]}
        />
        <PCardBody>
          <Row gutter={[10, 2]}>
            <Col md={6} sm={24}>
              <PSelect
                options={[]}
                name="letterType"
                label="Letter Type"
                placeholder="Letter Type"
                rules={[
                  {
                    required: true,
                    message: "Letter Type is required",
                  },
                ]}
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
            <Col className="custom_quill quilJob" md={24} sm={24}>
              <ReactQuill
                placeholder="Write your mail body..."
                value={form.getFieldValue("letter")}
                modules={modules}
                onChange={(value) => form.setFieldValue("letter", value)}
              />
            </Col>
          </Row>
        </PCardBody>
      </PCard>
    </PForm>
  );
};

export default LetterConfigAddEdit;
