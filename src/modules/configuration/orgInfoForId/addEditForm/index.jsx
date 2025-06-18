import { ModalFooter } from "Components/Modal";
import { PForm, PInput } from "Components/PForm";
import PSelectWithAll from "Components/PForm/Select/PSelectWithAll";
import { useApiRequest } from "Hooks";
import { Col, Form, Row, Switch } from "antd";
import axios from "axios";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { useEffect, useState } from "react";
import { ImAttachment } from "react-icons/im";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import FileUploadComponents from "utility/Upload/FileUploadComponents";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  const dispatch = useDispatch();
  // const debounce = useDebounce();
  const workplaceDDL = useApiRequest([]);

  const saveExtraInfo = useApiRequest({});
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [attachmentList2, setAttachmentList2] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);
  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  // Pages Start From Here code from above will be removed soon

  // Form Instance
  const [form] = Form.useForm();
  // submit
  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      resetForm();
      setIsAddEditForm(false);
      getData();
    };
    let payload = {
      ...values,
      intEmpIdCardExternalInfoId: singleData?.intEmpIdCardExternalInfoId
        ? singleData?.intEmpIdCardExternalInfoId
        : 0,
      intAccountId: orgId,
      authorizedSignatureUrlId:
        attachmentList2[0]?.response.length > 0
          ? attachmentList2[0]?.response[0]?.globalFileUrlId
          : singleData?.authorizedSignatureUrlId,
      orgLogoUrlId:
        attachmentList[0]?.response.length > 0
          ? attachmentList[0]?.response[0]?.globalFileUrlId
          : singleData?.orgLogoUrlId,
      isActive: values?.isActive,
    };
    saveExtraInfo.action({
      urlKey: "CreateOrUpdateEmpIdCardExternalInfo",
      method: "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
    });
  };

  useEffect(() => {
    if (singleData?.id) {
      const getExtraInfo = async () => {
        setLoading && setLoading(true);
        try {
          const res = await axios.get(
            `/SaasMasterData/GetEmpIdCardExternalInfoDetail?id=${singleData?.id}`
          );
          console.log(res?.data);
          form.setFieldsValue({
            ...res?.data,
            workplaceIds: res?.data?.workplaces?.map((item) => item?.id),
          });
        } catch (error) {
          console.log(error);
        } finally {
          setLoading && setLoading(false);
        }
      };
      getExtraInfo();
    }
    workplaceDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  }, [singleData]);
  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          submitHandler({
            values,
            getData,
            resetForm: form.resetFields,
            setIsAddEditForm,
            isEdit,
          });
        }}
        initialValues={{}}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PSelectWithAll
              form={form}
              name="workplaceIds"
              label="Workplace"
              placeholder="Select Workplace"
              options={workplaceDDL.data}
              loading={workplaceDDL.loading}
              rules={[{ required: true, message: "Workplace is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="orgEmail"
              label="Organization Email"
              placeholder="Organization Email"
              rules={[
                { required: true, message: "Organization Email is required" },
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="orgAddress"
              label="Organization Address"
              placeholder="Organization Address"
              rules={[
                { required: true, message: "Organization Address is required" },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="orgAddressBn"
              label="Organization Address Bangla"
              placeholder="Organization Address Bangla"
              rules={[
                {
                  required: true,
                  message: "Organization Address Bangla is required",
                },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="orgDomainAddress"
              label="Organization Domain Address"
              placeholder="Organization Domain Address"
              //   rules={[
              //     {
              //       required: true,
              //       message: "Organization Domain Address is required",
              //     },
              //   ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="orgTelephone"
              label="Organization Telephone"
              placeholder="Organization Telephone"
              //   rules={[
              //     {
              //       required: true,
              //       message: "Organization Telephone is required",
              //     },
              //   ]}
            />
          </Col>

          <Col md={12} style={{ marginTop: "1.4rem" }}>
            <div className="input-main position-group-select">
              {singleData?.orgLogoUrlId ? (
                <>
                  <FileUploadComponents
                    propsObj={{
                      title: "Upload Logo",
                      isOpen,
                      setIsOpen,
                      destroyOnClose: false,
                      attachmentList,
                      setAttachmentList,
                      accountId: orgId,
                      tableReferrence: "EmpIdCardExternalInfo",
                      documentTypeId: 1,
                      userId: employeeId,
                      buId,
                      maxCount: 1,
                    }}
                  />
                  {attachmentList?.length === 0 && singleData?.orgLogoUrlId ? (
                    <div
                      style={{
                        color: "rgb(0, 114, 229)",
                        cursor: "pointer",
                        marginTop: "0.5rem",
                      }}
                      onClick={() => {
                        dispatch(
                          getDownlloadFileView_Action(singleData?.orgLogoUrlId)
                        );
                      }}
                    >
                      <ImAttachment /> Attachment
                    </div>
                  ) : null}
                </>
              ) : (
                ""
              )}
            </div>
            <div
              // onClick={onButtonClick}
              style={{ cursor: "pointer" }}
              // style={{ cursor: "pointer", position: "relative" }}
            >
              <div style={{ fontSize: "" }}>
                {!singleData?.orgLogoUrlId ? (
                  <>
                    <FileUploadComponents
                      propsObj={{
                        title: "Upload Logo",
                        isOpen,
                        setIsOpen,
                        destroyOnClose: false,
                        attachmentList,
                        setAttachmentList,
                        accountId: orgId,
                        tableReferrence: "EmpIdCardExternalInfo",
                        documentTypeId: 1,
                        userId: employeeId,
                        buId,
                        maxCount: 1,
                      }}
                    />
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Col>

          {/* -----------------
           */}
          <Col md={12} style={{ marginTop: "1.4rem" }}>
            <div className="input-main position-group-select">
              {singleData?.authorizedSignatureUrlId ? (
                <>
                  <FileUploadComponents
                    propsObj={{
                      title: "Upload Signature",
                      isOpen2,
                      setIsOpen2,
                      destroyOnClose: false,
                      attachmentList: attachmentList2,
                      setAttachmentList: setAttachmentList2,
                      accountId: orgId,
                      tableReferrence: "EmpIdCardExternalInfo",
                      documentTypeId: 1,
                      userId: employeeId,
                      buId,
                      maxCount: 1,
                    }}
                  />
                  {attachmentList2?.length === 0 &&
                  singleData?.authorizedSignatureUrlId ? (
                    <div
                      style={{
                        color: "rgb(0, 114, 229)",
                        cursor: "pointer",
                        marginTop: "0.5rem",
                      }}
                      onClick={() => {
                        dispatch(
                          getDownlloadFileView_Action(
                            singleData?.authorizedSignatureUrlId
                          )
                        );
                      }}
                    >
                      <ImAttachment /> Attachment
                    </div>
                  ) : null}
                </>
              ) : (
                ""
              )}
            </div>
            <div
              // onClick={onButtonClick}
              style={{ cursor: "pointer" }}
              // style={{ cursor: "pointer", position: "relative" }}
            >
              <div style={{ fontSize: "" }}>
                {!singleData?.orgLogoUrlId ? (
                  <>
                    <FileUploadComponents
                      propsObj={{
                        title: "Upload Signature",
                        isOpen2,
                        setIsOpen2,
                        destroyOnClose: false,
                        attachmentList: attachmentList2,
                        setAttachmentList: setAttachmentList2,
                        accountId: orgId,
                        tableReferrence: "EmpIdCardExternalInfo",
                        documentTypeId: 1,
                        userId: employeeId,
                        buId,
                        maxCount: 1,
                      }}
                    />
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Col>

          {isEdit && (
            <Col
              md={12}
              style={{
                marginLeft: "-0.5rem",
              }}
            >
              <div
                className=""
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  className="input-main position-group-select "
                  style={{ margin: "3rem 0 0 0.7rem" }}
                >
                  <h6 className="title-item-name">
                    Org Info For Id Activation
                  </h6>
                  <p className="subtitle-p">
                    Activation toggle indicates to the particular Org Info For
                    Id status (Active/Inactive)
                  </p>
                </div>
                <div
                  style={{
                    margin: "2.7rem -25rem -1.5rem -15rem",
                    padding: "5rem -2rem 0 -15rem",
                  }}
                >
                  <Form.Item name="isActive" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </div>
              </div>
            </Col>
          )}
        </Row>
        <ModalFooter
          onCancel={() => {
            setId("");
            setIsAddEditForm(false);
          }}
          submitAction="submit"
          loading={loading}
        />
      </PForm>
    </>
  );
}
