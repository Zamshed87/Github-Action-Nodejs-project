/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import placeholderImg from "../../assets/images/placeholderImg.png";
import { getPeopleDeskAllDDL } from "../../common/api";
import BackButton from "../../common/BackButton";
import FormikInput from "../../common/FormikInput";
import FormikSelect from "../../common/FormikSelect";
import Loading from "../../common/loading/Loading";
import NotPermittedPage from "../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../utility/customHooks/useAxiosPost";
import { customStyles } from "../../utility/selectCustomStyle";
import { APIUrl } from './../../App';
import { attachment_action, getAccountById } from "./helper";

const initData = {
  accountName: "",
  shortCode: "",
  ownerName: "",
  address: "",
  mobile: "",
  nid: "",
  bin: "",
  email: "",
  website: "",
  domain: "",
  country: "",
  currency: "",
  package: "",
  minEmployee: "",
  maxEmployee: "",
  fileStoryQuaota: "",
  price: "",
};

export default function AccountCreateForm() {
  const dispatch = useDispatch();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [countryDDL, setCountryDDL] = useState([]);
  const [currencyDDL, setCurrencyDDL] = useState([]);
  const [packageDDL, setPackageDDL] = useState([]);
  const [domainDDL, setDomainDDL] = useState([]);
  const [packageData, getPackageData, apiLoading] = useAxiosGet();
  const [profileImgFile, setProfileImgFile] = useState("");
  const [creatAccount, postData] = useAxiosPost();
  const [fileQuaota, setFileQuaota] = useState("");
  const [singleData, setSingleData] = useState("");
  const [modifyInitData, setModifyInitData] = useState("");

  const { employeeId, buId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const makeDDL = (ddlArray, fieldName, value) => {
    return ddlArray?.find((item) => item[fieldName] === value);
  };

  useEffect(() => {
    if (params?.id) {
      getAccountById(params?.id, setSingleData);
    }
  }, [params?.id]);

  useEffect(() => {
    if (singleData) {
      let modifiedData = {
        accountName: singleData?.strAccountName,
        shortCode: singleData?.strShortCode,
        ownerName: singleData?.strOwnerName,
        address: singleData?.strAddress,
        mobile: singleData?.strMobileNumber,
        nid: singleData?.strNid,
        bin: singleData?.strBin,
        email: singleData?.strEmail,
        website: singleData?.strWebsite,
        domain: makeDDL(domainDDL, "value", singleData?.intUrlId),
        country: makeDDL(countryDDL, "value", singleData?.intCountryId),
        currency: makeDDL(currencyDDL, "label", singleData?.strCurrency),
        package: makeDDL(packageDDL, "value", singleData?.intAccountPackageId),
        minEmployee: singleData?.intMinEmployee,
        maxEmployee: singleData?.intMaxEmployee,
        fileStoryQuaota: singleData?.numPackageFileStorageQuaota,
        price: singleData?.numPrice,
      };
      setProfileImgFile({ globalFileUrlId: singleData?.intLogoUrlId });
      setModifyInitData(modifiedData);
    }
  }, [singleData, packageDDL, countryDDL, currencyDDL, domainDDL]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Accounts"));
    getPeopleDeskAllDDL(
      `/MasterData/GetAllCountry`,
      "intCountryId",
      "strCountry",
      setCountryDDL
    );

    getPeopleDeskAllDDL(
      `/MasterData/GetAllCurrency`,
      "intCurrencyId",
      "strCurrency",
      setCurrencyDDL
    );

    getPeopleDeskAllDDL(
      `/MasterData/GetAllAccountPackage`,
      "intAccountPackageId",
      "strAccountPackageName",
      setPackageDDL
    );

    getPeopleDeskAllDDL(
      `/MasterData/GetAllURLs`,
      "intUrlId",
      "strDomainName",
      setDomainDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    postData(
      `/Auth/AccountCreateUpdate`,
      {
        intUrlId: values?.domain?.value,
        strDomainName: values?.domain?.label,
        intAccountPackageId: values?.package?.value,
        strAccountPackageName: values?.package?.label,
        intMinEmployee: +values?.minEmployee,
        intMaxEmployee: +values?.maxEmployee,
        numPrice: +values?.price,
        numFileStorageQuaota: +singleData?.numFileStorageQuaota || +fileQuaota,
        intAccountId: params?.id || 0,
        strAccountName: values?.accountName,
        strShortCode: values?.shortCode,
        strOwnerName: values?.ownerName,
        strAddress: values?.address,
        strMobileNumber: values?.mobile,
        strNid: values?.nid,
        strBin: values?.bin,
        strEmail: values?.email,
        strWebsite: values?.website,
        intLogoUrlId: profileImgFile?.globalFileUrlId,
        intCountryId: values?.country?.value,
        strCurrency: values?.currency?.label,
        isBlock: false,
        isActive: true,
        numPackageFileStorageQuaota: +values?.fileStoryQuaota,
        intCreatedBy: employeeId,
      },
      "",
      true
    );
  };

  // image
  const inputFile = useRef(null);

  const onButtonClick = () => {
    inputFile.current.click();
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30277) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          modifyInitData
            ? modifyInitData
            : { ...initData, currency: { value: 1, label: "Taka" } }
        }
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
            <Form onSubmit={handleSubmit}>
              {(loading || apiLoading) && <Loading />}
              {permission?.isCreate ? (
                <>
                  <div className="table-card">
                    <div
                      className="table-card-heading"
                      style={{ marginBottom: "12px" }}
                    >
                      <div className="d-flex align-items-center">
                        <BackButton />
                        <h2>
                          {params?.id ? "Account Edit" : "Account Create"}
                        </h2>
                      </div>
                      <ul className="d-flex flex-wrap">
                        <li>
                          <button
                            type="button"
                            onClick={() => resetForm(initData)}
                            className="btn btn-cancel mr-2"
                          >
                            Reset
                          </button>
                        </li>
                        <li>
                          <button
                            onSubmit={handleSubmit}
                            type="submit"
                            className="btn btn-green w-100"
                          >
                            Save
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className="card-style">
                      <div className="row">
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Account Name</label>
                            <FormikInput
                              placeholder="Account Name"
                              classes="input-sm"
                              name="accountName"
                              value={values?.accountName}
                              onChange={(e) => {
                                setFieldValue(
                                  "accountName",
                                  e.target.value
                                );
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Short Code</label>
                            <FormikInput
                              placeholder="Short Code"
                              classes="input-sm"
                              name="shortCode"
                              value={values?.shortCode}
                              onChange={(e) => {
                                setFieldValue("shortCode", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Owner Name</label>
                            <FormikInput
                              placeholder="Owner Name"
                              classes="input-sm"
                              name="ownerName"
                              value={values?.ownerName}
                              onChange={(e) => {
                                setFieldValue("ownerName", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Address</label>
                            <FormikInput
                              placeholder="Address"
                              classes="input-sm"
                              name="address"
                              value={values?.address}
                              onChange={(e) => {
                                setFieldValue("address", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Mobile</label>
                            <FormikInput
                              placeholder="Mobile"
                              classes="input-sm"
                              name="mobile"
                              value={values?.mobile}
                              onChange={(e) => {
                                setFieldValue("mobile", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>NID</label>
                            <FormikInput
                              placeholder="NID"
                              classes="input-sm"
                              name="nid"
                              value={values?.nid}
                              onChange={(e) => {
                                setFieldValue("nid", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>BIN</label>
                            <FormikInput
                              placeholder="BIN"
                              classes="input-sm"
                              name="bin"
                              value={values?.bin}
                              onChange={(e) => {
                                setFieldValue("bin", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Email</label>
                            <FormikInput
                              placeholder="Email"
                              classes="input-sm"
                              name="email"
                              value={values?.email}
                              onChange={(e) => {
                                setFieldValue("email", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Website</label>
                            <FormikInput
                              placeholder="Website"
                              classes="input-sm"
                              name="website"
                              value={values?.website}
                              onChange={(e) => {
                                setFieldValue("website", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Domain</label>
                            <FormikSelect
                              classes="input-sm"
                              styles={customStyles}
                              name="domain"
                              options={domainDDL || []}
                              value={values?.domain}
                              onChange={(valueOption) => {
                                setFieldValue("domain", valueOption);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Country</label>
                            <FormikSelect
                              classes="input-sm"
                              styles={customStyles}
                              name="country"
                              options={countryDDL || []}
                              value={values?.country}
                              onChange={(valueOption) => {
                                setFieldValue("country", valueOption);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Currency</label>
                            <FormikSelect
                              classes="input-sm"
                              styles={customStyles}
                              name="currency"
                              options={currencyDDL || []}
                              value={values?.currency}
                              onChange={(valueOption) => {
                                setFieldValue("currency", valueOption);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Package</label>
                            <FormikSelect
                              classes="input-sm"
                              styles={customStyles}
                              name="package"
                              options={packageDDL || []}
                              value={values?.package}
                              onChange={(valueOption) => {
                                setFieldValue("package", valueOption);
                                getPackageData(
                                  `/MasterData/GetAccountPackageById?id=${valueOption?.value}`,
                                  (data) => {
                                    setFieldValue(
                                      "minEmployee",
                                      data?.intMinEmployee
                                    );
                                    setFieldValue(
                                      "maxEmployee",
                                      data?.intMaxEmployee
                                    );
                                    setFieldValue(
                                      "fileStoryQuaota",
                                      data?.numFileStorageQuaota
                                    );
                                    setFieldValue("price", data?.numPrice);
                                    setFileQuaota(
                                      data?.numFileStorageQuaota
                                    );
                                  }
                                );
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-main position-group-select">
                            <label className="lebel-bold mr-2">
                              Upload Logo Image
                            </label>
                          </div>
                          <div
                            className={
                              profileImgFile
                                ? "image-upload-box with-img"
                                : "image-upload-box"
                            }
                            onClick={onButtonClick}
                            style={{
                              cursor: "pointer",
                              position: "relative",
                              height: "35px",
                            }}
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
                                      setProfileImgFile(data?.[0]);
                                    })
                                    .catch((error) => {
                                      setProfileImgFile("");
                                    });
                                }
                              }}
                              type="file"
                              ref={inputFile}
                              id="file"
                              style={{ display: "none" }}
                            />
                            <div>
                              {!profileImgFile && (
                                <img
                                  style={{ maxWidth: "50px" }}
                                  src={placeholderImg}
                                  className="img-fluid"
                                  alt="Drag or browse"
                                />
                              )}
                            </div>
                            {profileImgFile && (
                              <img
                                src={`${APIUrl}/Document/DownloadFile?id=${profileImgFile?.globalFileUrlId}`}
                                alt="Upload"
                                style={{
                                  position: "absolute",
                                  top: "0px",
                                  left: "0px",
                                  width: "40px",
                                  height: "40px",
                                }}
                              ></img>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <>
                            {(packageData?.intAccountPackageId ||
                              singleData?.intAccountPackageId) && (
                                <div className="table-card-body">
                                  <div className="table-card-styled tableOne">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>
                                            <div className="sortable">
                                              <span>Min-Employee</span>
                                            </div>
                                          </th>
                                          <th>
                                            <div className="sortable">
                                              <span>Max-Employee</span>
                                            </div>
                                          </th>
                                          <th>
                                            <div className="sortable">
                                              <span>File Storage Quaota</span>
                                            </div>
                                          </th>
                                          <th>
                                            <div className="sortable">
                                              <span>Price</span>
                                            </div>
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {[1]?.map((data, i) => (
                                          <tr key={i}>
                                            <td>
                                              <FormikInput
                                                placeholder="Min-Employee"
                                                classes="input-sm"
                                                name="minEmployee"
                                                value={values?.minEmployee}
                                                onChange={(e) => {
                                                  setFieldValue(
                                                    "minEmployee",
                                                    e.target.value
                                                  );
                                                }}
                                                errors={errors}
                                                touched={touched}
                                              />
                                            </td>
                                            <td>
                                              <FormikInput
                                                placeholder="Max-Employee"
                                                classes="input-sm"
                                                name="maxEmployee"
                                                value={values?.maxEmployee}
                                                onChange={(e) => {
                                                  setFieldValue(
                                                    "maxEmployee",
                                                    e.target.value
                                                  );
                                                }}
                                                errors={errors}
                                                touched={touched}
                                              />
                                            </td>
                                            <td>
                                              {values?.fileStoryQuaota > 0 ? (
                                                <>
                                                  <FormikInput
                                                    placeholder="File Story Quaota"
                                                    classes="input-sm"
                                                    name="fileStoryQuaota"
                                                    value={values?.fileStoryQuaota}
                                                    onChange={(e) => {
                                                      setFieldValue(
                                                        "fileStoryQuaota",
                                                        e.target.value
                                                      );
                                                    }}
                                                    errors={errors}
                                                    touched={touched}
                                                  />
                                                </>
                                              ) : (
                                                <>
                                                  <FormikInput
                                                    placeholder="File Story Quaota"
                                                    classes="input-sm"
                                                    name="fileStoryQuaota"
                                                    value={values?.fileStoryQuaota || "0"}
                                                    onChange={(e) => {

                                                      setFieldValue(
                                                        "fileStoryQuaota",
                                                        +e.target.value
                                                      );
                                                    }}
                                                    errors={errors}
                                                    touched={touched}
                                                  />
                                                </>
                                              )}
                                            </td>
                                            <td>
                                              <FormikInput
                                                placeholder="Price"
                                                classes="input-sm"
                                                name="price"
                                                value={values?.price}
                                                onChange={(e) => {
                                                  setFieldValue("price", e.target.value);
                                                }}
                                                errors={errors}
                                                touched={touched}
                                              />
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                          </>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
