import {
  AttachmentOutlined,
  Close,
  FileUpload,
  VisibilityOutlined
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { getDownlloadFileView_Action } from "../../../../commonRedux/auth/actions";
import { todayDate } from "../../../../utility/todayDate";
import { getControlPanelAllLanding } from "../../helper";
import { getPeopleDeskAllDDL } from "./../../../../common/api/index";
import FormikInput from "./../../../../common/FormikInput";
import FormikSelect from "./../../../../common/FormikSelect";
import FormikToggle from "./../../../../common/FormikToggle";
import Loading from "./../../../../common/loading/Loading";
import { blackColor80, greenColor } from "./../../../../utility/customColor";
import { customStyles } from "./../../../../utility/newSelectCustomStyle";
import {
  attachment_action,
  createBusinessUnit,
  getBusinessUnitById
} from "./../helper";

const initData = {
  businessUnit: "",
  code: "",
  address: "",
  district: " ",
  baseCurrency: "",
  websiteUrl: "",
  email: "",
  isActive: true,
};
const validationSchema = Yup.object().shape({
  businessUnit: Yup.string().required("Business Unit is required"),
  code: Yup.string().required("Code is required"),
  address: Yup.string().required("Address is required"),
  email: Yup.string().email("Enter a valid email address"),
  district: Yup.object()
    .shape({
      label: Yup.string().required("District is required"),
      value: Yup.string().required("District is required"),
    })
    .typeError("District is required"),
});

export default function AddEditFormComponent({
  propsObj,
  fullscreen,
  isVisibleHeading,
}) {
  const {
    show,
    title,
    onHide,
    size,
    backdrop,
    classes,
    setRowDto,
    // setAllData,
    businessUnitId,
    setBusinessUnitId,
    imageFile,
    setImageFile,
    // rowFileId,
    setRowFileId,
  } = propsObj;
  const [loading, setLoading] = useState(false);

  // image
  const inputFile = useRef(null);

  const [currencyDDL, setCurrencyDDL] = useState([]);
  const [districtDDL, setDistrictDDL] = useState([]);
  const [modifySingleData, setModifySingleData] = useState("");
  const [singleData, setSingleData] = useState("");

  const { employeeId, orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Currency&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
      "CurrencyId",
      "CurrencyName",
      setCurrencyDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=District&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
      "DistrictId",
      "DistrictName",
      setDistrictDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId]);
  useEffect(() => {
    if (businessUnitId) {
      getBusinessUnitById({
        businessUnitId,
        setter: setSingleData,
        setLoading,
      });
    }
  }, [businessUnitId]);
  useEffect(() => {
    if (singleData?.intBusinessUnitId) {
      const newRowData = {
        businessUnit: singleData?.strBusinessUnit,
        code: singleData?.strShortCode,
        address: singleData?.strAddress,
        baseCurrency: {
          value: singleData?.BaseCurrencyId || 0,
          label: singleData?.strCurrency || " ",
          CurrencyCode: singleData?.BaseCurrencyCode || " ",
        },
        district: {
          value: singleData?.intDistrictId || 0,
          label: singleData?.strDistrict || " ",
        },
        websiteUrl: singleData?.strWebsiteUrl,
        email: singleData?.strEmail || "",
        isActive: singleData?.isActive,
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);
  const saveHandler = (values, cb) => {
    let payload = {
      strBusinessUnit: values?.businessUnit,
      strShortCode: values?.code,
      strAddress: values?.address,
      strLogoUrlId: imageFile ? imageFile : singleData?.LogoURL,
      intDistrictId: values?.district?.value || 0,
      strDistrict: values?.district?.label || " ",
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: singleData?.intBusinessUnitId ? 0 : employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: singleData?.intBusinessUnitId ? employeeId : 0,
      isActive: values?.isActive,
      strEmail: values.email,
      strWebsiteUrl: values.websiteUrl || " ",
      strCurrency: values.baseCurrency?.label || " ",
    };
    const callback = () => {
      cb();
      setImageFile("");
      setRowFileId("");
      onHide();
      getControlPanelAllLanding({
        apiUrl: `/SaasMasterData/GetAllBusinessUnit?accountId=${orgId}`,
        setLoading,
        setter: setRowDto,
      });
    };

    if (businessUnitId) {
      createBusinessUnit(
        { ...payload, intBusinessUnitId: singleData?.intBusinessUnitId },
        setLoading,
        callback
      );
    } else {
      createBusinessUnit(
        { ...payload, intBusinessUnitId: 0 },
        setLoading,
        callback
      );
    }
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const dispatch = useDispatch();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={businessUnitId ? modifySingleData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (businessUnitId) {
              resetForm(modifySingleData);
            } else {
              resetForm(initData);
            }
            setSingleData("");
            setBusinessUnitId(null);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {loading && <Loading />}
            <div className="viewModal">
              <Modal
                show={show}
                onHide={onHide}
                size={size}
                backdrop={backdrop}
                aria-labelledby="example-modal-sizes-title-xl"
                className={classes}
                fullscreen={fullscreen && fullscreen}
              >
                <Form>
                  {isVisibleHeading && (
                    <Modal.Header className="bg-custom">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <Modal.Title className="text-center">
                          {title}
                        </Modal.Title>
                        <div>
                          <IconButton
                            onClick={() => {
                              if (businessUnitId) {
                                resetForm(modifySingleData);
                              } else {
                                resetForm(initData);
                              }
                              onHide();
                              setImageFile("");
                              setSingleData("");
                              setBusinessUnitId(null);
                            }}
                          >
                            <Close />
                          </IconButton>
                        </div>
                      </div>
                    </Modal.Header>
                  )}

                  <Modal.Body id="example-modal-sizes-title-xl">
                    <div className="businessUnitModal">
                      <div className="modalBody pt-0 px-0">
                        <div className="row mx-0">
                          <div className="col-6">
                            <label>Business Unit </label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.businessUnit}
                              name="businessUnit"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("businessUnit", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>Code</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.code}
                              name="code"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("code", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>Address </label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.address}
                              name="address"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("address", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>District </label>
                            <FormikSelect
                              name="district"
                              options={districtDDL || []}
                              value={values?.district}
                              onChange={(valueOption) => {
                                setFieldValue("district", valueOption);
                              }}
                              placeholder=" "
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                              menuPosition="fixed"
                            />
                          </div>
                          <div className="col-6">
                            <label>Base Currency</label>
                            <FormikSelect
                              name="baseCurrency"
                              options={currencyDDL || []}
                              value={values?.baseCurrency}
                              onChange={(valueOption) => {
                                setFieldValue("baseCurrency", valueOption);
                              }}
                              placeholder=" "
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                              menuPosition="fixed"
                            />
                          </div>
                          <div className="col-6">
                            <label>Website URL</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.websiteUrl}
                              name="websiteUrl"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("websiteUrl", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>Email</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.email}
                              name="email"
                              type="email"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("email", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>

                          <div className="col-6 mt-3">
                            <div className="input-main position-group-select">
                              {imageFile ? (
                                <>
                                  <label className="lebel-bold mr-2">
                                    Upload Image
                                  </label>
                                  <VisibilityOutlined
                                    sx={{
                                      color: "rgba(0, 0, 0, 0.6)",
                                      fontSize: "16px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      dispatch(
                                        getDownlloadFileView_Action(imageFile)
                                      );
                                    }}
                                  />
                                </>
                              ) : ''}
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
                                        setImageFile(
                                          data?.[0]?.globalFileUrlId
                                        );
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
                                ) : ""}
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
                              ) : ""}
                            </div>
                          </div>

                          {businessUnitId ? (
                            <div className="col-12">
                              <div className="input-main position-group-select mt-2 d-flex justify-content-between align-items-between">
                                <div>
                                  <h6 className="title-item-name">
                                    Business Unit Activation
                                  </h6>
                                  <p className="subtitle-p">
                                    Activation toggle indicates to the
                                    particular Business Unit status
                                    (Active/Inactive)
                                  </p>
                                </div>
                                <div className="pt-2">
                                  <FormikToggle
                                    name="isActive"
                                    color={
                                      values?.isActive
                                        ? greenColor
                                        : blackColor80
                                    }
                                    checked={values?.isActive}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "isActive",
                                        e.target.checked
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : ""}
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="form-modal-footer">
                    <div className="master-filter-btn-group">
                      <button
                        type="button"
                        className="btn btn-cancel"
                        style={{
                          marginRight: "15px",
                        }}
                        onClick={() => {
                          if (setSingleData) {
                            resetForm(modifySingleData);
                          } else {
                            resetForm(initData);
                          }
                          setImageFile("");
                          onHide();
                          setSingleData("");
                          setBusinessUnitId(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-green btn-green-disable"
                        style={{ width: "auto" }}
                        type="submit"
                        onSubmit={() => handleSubmit()}
                      >
                        Save
                      </button>
                    </div>
                  </Modal.Footer>
                </Form>
              </Modal>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
