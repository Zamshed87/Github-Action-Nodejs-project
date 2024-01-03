import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Switch } from "antd";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
// import { updateUerAndEmpNameAction } from "../../../../commonRedux/auth/actions";
// import { createEditEmpAction, userExistValidation } from "../helper";
// import { submitHandler } from "./helper";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  pages,
  setId,
}) {
  const dispatch = useDispatch();
  // const debounce = useDebounce();
  const getCurrencyDDL = useApiRequest({});
  const getDistrictDDL = useApiRequest({});
  const getSingleData = useApiRequest({});
  const saveLeaveType = useApiRequest({});

  const { orgId, buId, employeeId, intUrlId, wgId, wId, intAccountId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  const [loading, setLoading] = useState(false);

  // states

  useEffect(() => {
    getCurrencyDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        id: singleData?.intLeaveTypeId,
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
        id: singleData?.intLeaveTypeId,
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

  useEffect(() => {
    if (singleData?.intLeaveTypeId) {
      // getLeaveTypeById(setSingleData, id, setLoading);
      getSingleData.action({
        urlKey: "GetAllLveLeaveTypeById",
        method: "GET",
        params: {
          id: singleData?.intLeaveTypeId,
        },
        onSuccess: (res) => {
          form.setFieldsValue({
            leaveType: res?.strLeaveType,
            leaveTypeCode: res?.strLeaveTypeCode,
            isActive: res?.isActive,
          });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData?.intLeaveTypeId]);
  // const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
  //   const cb = () => {
  //     console.log("callback calling...");
  //     resetForm();
  //     setIsAddEditForm(false);
  //     getData();
  //   };
  //   let payload = {
  //     intParentId: singleData?.intParentId || 0,
  //     strLeaveType: values?.leaveType,
  //     strLeaveTypeCode: values?.leaveTypeCode,
  //     intAccountId: orgId,
  //     isActive: values?.isActive,
  //     dteCreatedAt: todayDate(),
  //     intCreatedBy: employeeId,
  //     dteUpdatedAt: todayDate(),
  //     intUpdatedBy: employeeId,
  //     intLeaveTypeId: singleData?.intLeaveTypeId || 0,
  //   };

  //   saveLeaveType.action({
  //     urlKey: "SaveLveLeaveType",
  //     method: "POST",
  //     payload: payload,
  //     onSuccess: () => {
  //       cb();
  //     },
  //   });
  // };

  // image
  const inputFile = useRef(null);

  const [modifySingleData, setModifySingleData] = useState("");
  // const [singleData, setSingleData] = useState("");

  // useEffect(() => {
  //   if (businessUnitId) {
  //     getBusinessUnitById({
  //       businessUnitId,
  //       setter: setSingleData,
  //       setLoading,
  //     });
  //   }
  // }, [businessUnitId]);
  // useEffect(() => {
  //   if (singleData?.intBusinessUnitId) {
  //     const newRowData = {
  //       businessUnit: singleData?.strBusinessUnit,
  //       code: singleData?.strShortCode,
  //       address: singleData?.strAddress,
  //       baseCurrency: {
  //         value: singleData?.BaseCurrencyId || 0,
  //         label: singleData?.strCurrency || " ",
  //         CurrencyCode: singleData?.BaseCurrencyCode || " ",
  //       },
  //       district: {
  //         value: singleData?.intDistrictId || 0,
  //         label: singleData?.strDistrict || " ",
  //       },
  //       websiteUrl: singleData?.strWebsiteUrl,
  //       email: singleData?.strEmail || "",
  //       isActive: singleData?.isActive,
  //     };
  //     setModifySingleData(newRowData);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [singleData]);
  // const saveHandler = (values, cb) => {
  //   let payload = {
  //     strBusinessUnit: values?.businessUnit,
  //     strShortCode: values?.code,
  //     strAddress: values?.address,
  //     strLogoUrlId: imageFile ? imageFile : singleData?.LogoURL,
  //     intDistrictId: values?.district?.value || 0,
  //     strDistrict: values?.district?.label || " ",
  //     intAccountId: orgId,
  //     dteCreatedAt: todayDate(),
  //     intCreatedBy: singleData?.intBusinessUnitId ? 0 : employeeId,
  //     dteUpdatedAt: todayDate(),
  //     intUpdatedBy: singleData?.intBusinessUnitId ? employeeId : 0,
  //     isActive: values?.isActive,
  //     strEmail: values.email,
  //     strWebsiteUrl: values.websiteUrl || " ",
  //     strCurrency: values.baseCurrency?.label || " ",
  //   };
  //   const callback = () => {
  //     cb();
  //     setImageFile("");
  //     setRowFileId("");
  //     onHide();
  //     getControlPanelAllLanding({
  //       apiUrl: `/SaasMasterData/GetAllBusinessUnit?accountId=${orgId}`,
  //       setLoading,
  //       setter: setRowDto,
  //     });
  //   };

  //   if (businessUnitId) {
  //     createBusinessUnit(
  //       { ...payload, intBusinessUnitId: singleData?.intBusinessUnitId },
  //       setLoading,
  //       callback
  //     );
  //   } else {
  //     createBusinessUnit(
  //       { ...payload, intBusinessUnitId: 0 },
  //       setLoading,
  //       callback
  //     );
  //   }
  // };

  // const onButtonClick = () => {
  //   inputFile.current.click();
  // };

  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          // submitHandler({
          //   values,
          //   getData,
          //   resetForm: form.resetFields,
          //   setIsAddEditForm,
          //   isEdit,
          // })
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
                  intQuotaFrequency: op,
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
                  intQuotaFrequency: op,
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

          {/* <Col md={6} style={{ marginTop: "2rem" }}>
            <div className="input-main position-group-select">
              {singleData?.strLogoUrlId ? (
                <>
                  <label className="lebel-bold mr-2">Upload Image</label>
                  <VisibilityOutlined
                    sx={{
                      color: "rgba(0, 0, 0, 0.6)",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      dispatch(
                        getDownlloadFileView_Action(singleData?.strLogoUrlId)
                      );
                    }}
                  />
                </>
              ) : (
                ""
              )}
            </div>
            <div
              className={imageFile ? " mt-0 " : "mt-3"}
              onClick={onButtonClick}
              style={{ cursor: "pointer" }}
              // style={{ cursor: "pointer", position: "relative" }}
            >
              <input
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    attachment_action(
                      orgId,
                      "account",
                      1,
                      buId,
                      employeeId,
                      e.target.files,
                      setLoading
                    )
                      .then((data) => {
                        setImageFile(data?.[0]?.globalFileUrlId);
                      })
                      .catch((error) => {
                        setImageFile("");
                      });
                  }
                }}
                type="file"
                id="file"
                ref={inputFile}
                style={{ display: "none" }}
              />
              <div style={{ fontSize: "14px" }}>
                {!imageFile ? (
                  <>
                    <FileUpload
                      sx={{
                        marginRight: "5px",
                        fontSize: "18px",
                      }}
                    />{" "}
                    Click to upload
                  </>
                ) : (
                  ""
                )}
              </div>
              {imageFile ? (
                <div
                  className="d-flex align-items-center"
                  onClick={() => {
                    // dispatch(getDownlloadFileView_Action(imageFile?.globalFileUrlId));
                  }}
                >
                  <AttachmentOutlined
                    sx={{
                      marginRight: "5px",
                      color: "#0072E5",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#0072E5",
                      cursor: "pointer",
                    }}
                  >
                    {imageFile?.fileName || "Attachment"}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </Col>
          {isEdit && (
            <Col md={12} style={{ marginLeft: "-0.5rem", display: "flex" }}>
              <div className="input-main position-group-select mt-4">
                <h6 className="title-item-name">Business Unit Activation</h6>
                <p className="subtitle-p">
                  Activation toggle indicates to the particular Business Unit
                  status (Active/Inactive)
                </p>
                <Form.Item name="isActive" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </div>
            </Col>
          )} */}
        </Row>
        <ModalFooter
          onCancel={() => {
            setIsAddEditForm(false);
            setId({});
          }}
          submitAction="submit"
          loading={loading}
        />
      </PForm>
    </>
  );
}
