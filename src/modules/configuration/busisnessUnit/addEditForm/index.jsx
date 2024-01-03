import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Switch } from "antd";
import { ImAttachment } from "react-icons/im";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
// import { updateUerAndEmpNameAction } from "../../../../commonRedux/auth/actions";
// import { createEditEmpAction, userExistValidation } from "../helper";
// import { submitHandler } from "./helper";

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
  const getCurrencyDDL = useApiRequest({});
  const getDistrictDDL = useApiRequest({});
  const getSingleData = useApiRequest({});
  const saveBU = useApiRequest({});

  const { orgId, buId, employeeId, intUrlId, wgId, wId, intAccountId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  const [loading, setLoading] = useState(false);

  // states
  const [isOpen, setIsOpen] = useState(false);
  const [attachmentList, setAttachmentList] = useState([]);

  // ddls
  useEffect(() => {
    getCurrencyDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        id: singleData?.intBusinessUnitId,
        DDLType: "Currency",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.CurrencyName;
          res[i].value = item?.CurrencyId;
        });
      },
    });
    getDistrictDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        id: singleData?.intBusinessUnitId,
        DDLType: "District",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.DistrictName;
          res[i].value = item?.DistrictId;
        });
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId]);
  // Pages Start From Here code from above will be removed soon

  // Form Instance
  const [form] = Form.useForm();

  // submit
  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      console.log("callback calling...");
      resetForm();
      setIsAddEditForm(false);
      getData();
    };
    let payload = {
      intBusinessUnitId: singleData?.intBusinessUnitId
        ? singleData?.intBusinessUnitId
        : 0,
      strBusinessUnit: values?.strBusinessUnit,
      strShortCode: values?.strShortCode,
      strAddress: values?.strAddress,
      strLogoUrlId:
        attachmentList[0]?.response.length > 0
          ? attachmentList[0]?.response[0]?.globalFileUrlId
          : singleData?.LogoURL,
      intDistrictId: values?.strDistrict?.value || 0,
      strDistrict: values?.strDistrict?.label || " ",
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: singleData?.intBusinessUnitId ? 0 : employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: singleData?.intBusinessUnitId ? employeeId : 0,
      isActive: values?.isActive,
      strEmail: values?.strEmail,
      strWebsiteUrl: values.strWebsiteUrl || " ",
      strCurrency: values?.strCurrency?.label || " ",
    };

    saveBU.action({
      urlKey: "SaveBusinessUnit",
      method: "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
    });
  };
  useEffect(() => {
    if (singleData?.intBusinessUnitId) {
      // getLeaveTypeById(setSingleData, id, setLoading);
      console.log("calling");
      getSingleData.action({
        urlKey: "GetBusinessUnitById",
        method: "GET",
        params: {
          Id: singleData?.intBusinessUnitId,
        },
        onSuccess: (res) => {
          // console.log({ res });

          form.setFieldsValue({
            strDistrict: res?.intDistrictId
              ? { value: res?.intDistrictId, label: res?.strDistrict }
              : undefined,
            strCurrency: res?.strCurrency
              ? getCurrencyDDL?.data?.find(
                  (itm) => itm?.label === res?.strCurrency
                )
              : undefined,
            strBusinessUnit: res?.strBusinessUnit
              ? res?.strBusinessUnit
              : undefined,
            strShortCode: res?.strShortCode ? res?.strShortCode : undefined,
            strWebsiteUrl: res?.strWebsiteUrl ? res?.strWebsiteUrl : undefined,
            strEmail: res?.strEmail ? res?.strEmail : undefined,
            strAddress: res?.strAddress ? res?.strAddress : undefined,
            isActive: res?.isActive ? res?.isActive : false,
          });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);
  console.log({ singleData });
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
            <PInput
              type="text"
              name="strBusinessUnit"
              label="Business Unit"
              placeholder="Business Unit"
              rules={[{ required: true, message: "Business Unit is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strShortCode"
              label="Code"
              placeholder="Code"
              rules={[{ required: true, message: "Code is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strAddress"
              label="Address"
              placeholder="Address"
              rules={[{ required: true, message: "Address is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={
                getDistrictDDL?.data?.length > 0 ? getDistrictDDL?.data : []
              }
              name="strDistrict"
              label="District"
              showSearch
              filterOption={true}
              placeholder="District"
              onChange={(value, op) => {
                form.setFieldsValue({
                  strDistrict: op,
                });
              }}
              rules={[{ required: true, message: "District is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={
                getCurrencyDDL?.data?.length > 0 ? getCurrencyDDL?.data : []
              }
              name="strCurrency"
              label="Base Currency"
              showSearch
              filterOption={true}
              placeholder="Base Currency"
              onChange={(value, op) => {
                form.setFieldsValue({
                  strCurrency: op,
                });
              }}
              rules={[{ required: true, message: "Base Currency is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strWebsiteUrl"
              label="Website URL"
              placeholder="Website URL"
              // rules={[{ required: true, message: "Website URL is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strEmail"
              label="Email"
              placeholder="Email"
              // rules={[{ required: true, message: "Email is required" }]}
            />
          </Col>

          <Col md={12} style={{ marginTop: "1.4rem" }}>
            <div className="input-main position-group-select">
              {singleData?.strLogoUrlId ? (
                <>
                  <FileUploadComponents
                    propsObj={{
                      isOpen,
                      setIsOpen,
                      destroyOnClose: false,
                      attachmentList,
                      setAttachmentList,
                      accountId: orgId,
                      tableReferrence: "account",
                      documentTypeId: 1,
                      userId: employeeId,
                      buId,
                      maxCount: 1,
                    }}
                  />
                  {attachmentList?.length === 0 && singleData?.strLogoUrlId ? (
                    <div
                      style={{
                        color: "rgb(0, 114, 229)",
                        cursor: "pointer",
                        marginTop: "0.5rem",
                      }}
                      onClick={() => {
                        dispatch(
                          getDownlloadFileView_Action(singleData?.strLogoUrlId)
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
                {!singleData?.strLogoUrlId ? (
                  <>
                    <FileUploadComponents
                      propsObj={{
                        isOpen,
                        setIsOpen,
                        destroyOnClose: false,
                        attachmentList,
                        setAttachmentList,
                        accountId: orgId,
                        tableReferrence: "account",
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
                <div className="input-main position-group-select mt-4">
                  <h6 className="title-item-name">Business Unit Activation</h6>
                  <p className="subtitle-p">
                    Activation toggle indicates to the particular Business Unit
                    status (Active/Inactive)
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
