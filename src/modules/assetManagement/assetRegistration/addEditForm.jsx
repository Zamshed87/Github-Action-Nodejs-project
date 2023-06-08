/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import * as Yup from "yup";
import BackButton from "../../../common/BackButton";
import FormikInput from "../../../common/FormikInput";
import FormikSelect from "../../../common/FormikSelect";
import FormikTextArea from "../../../common/FormikTextArea";
import Loading from "../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../utility/customHooks/useAxiosPost";
import { dateFormatterForInput } from "../../../utility/dateFormatter";
import { customStyles } from "../../../utility/selectCustomStyle";
import { todayDate } from "../../../utility/todayDate";

const initData = {
  itemName: "",
  supplierName: "",
  supplierMobileNo: "",
  acquisitionDate: "",
  acquisitionValue: "",
  invoiceValue: "",
  depreciationValue: "",
  depreciationDate: "",
  warrantyDate: "",
  description: "",
};

const validationSchema = Yup.object().shape({
  itemName: Yup.object().shape({
    label: Yup.string().required("Item name is required"),
    value: Yup.string().required("Item name is required"),
  }),
  acquisitionDate: Yup.date().required("Acquisition date is required"),
});

const AssetApplicationCreate = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [itemTypeDDL, getItemType, , setItemTypeDDL] = useAxiosGet([]);
  const [, getAssetDetail, assetDetailsLoading] = useAxiosGet([]);
  const [, saveAsset, assetLoading] = useAxiosPost({});
  const [singleData, setSingleData] = useState([]);

  const saveHandler = (values, cb) => {
    const payload = {
      assetId: params?.id || 0,
      accountId: orgId,
      businessUnitId: buId,
      assetCode: "",
      itemId: values?.itemName?.value,
      itemName: values?.itemName?.label,
      supplierName: values?.supplierName || null,
      supplierMobileNo: values?.supplierMobileNo || null,
      acquisitionDate: values?.acquisitionDate || null,
      acquisitionValue: values?.acquisitionValue || null,
      invoiceValue: values?.invoiceValue || null,
      depreciationValue: values?.depreciationValue || null,
      depreciationDate: values?.depreciationDate || null,
      warrantyDate: values?.warrantyDate || null,
      description: values?.description || null,
      active: true,
      createdAt: todayDate(),
      createdBy: employeeId,
      updatedAt: todayDate(),
      updatedBy: employeeId,
    };
    saveAsset(`/AssetManagement/SaveAsset`, payload, cb, true);
  };

  const getItemTypeDDL = (orgId, buId) => {
    getItemType(
      `/AssetManagement/ItemDDL?accountId=${orgId}&businessUnitId=${buId}`,
      (data) => setItemTypeDDL(data)
    );
  };

  const getData = () => {
    if (!params?.id) return;
    const assetUrl = `/AssetManagement/GetAssetById?accountId=${orgId}&businessUnitId=${buId}&assetId=${params.id}`;
    getAssetDetail(assetUrl, (data) => {
      const modifiedData = {
        ...data,
        itemName: {
          value: data?.itemId,
          label: data?.itemName,
        },
        acquisitionDate: data?.acquisitionDate
          ? dateFormatterForInput(data?.acquisitionDate)
          : "",
        depreciationDate: data?.depreciationDate
          ? dateFormatterForInput(data?.depreciationDate)
          : null,
        warrantyDate: data?.warrantyDate
          ? dateFormatterForInput(data?.warrantyDate)
          : null,
      };
      setSingleData(modifiedData);
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Asset Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    params?.id && getData();
  }, [orgId, buId, params?.id]);

  useEffect(() => {
    getItemTypeDDL(orgId, buId);
  }, [orgId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={params?.id ? singleData : initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (params?.id) {
              getData();
              resetForm();
            } else {
              setSubmitting(false);
              resetForm();
            }
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
          setValues,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {(assetLoading || assetDetailsLoading) && <Loading />}
              <div className="table-card">
                <div className="table-card-heading mb12">
                  <div className="d-flex align-items-center">
                    <BackButton />
                    <h2>
                      {params?.id
                        ? `Edit Asset Registration`
                        : `Create Asset Registration`}
                    </h2>
                  </div>
                  <ul className="d-flex flex-wrap">
                    <li>
                      <button
                        type="button"
                        className="btn btn-cancel mr-2"
                        onClick={() => {
                          resetForm(initData);
                        }}
                      >
                        Reset
                      </button>
                    </li>
                    <li>
                      <button
                        type="submit"
                        className="btn btn-default flex-center"
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
                        <label>Select Item</label>
                      </div>
                      <FormikSelect
                        menuPosition="fixed"
                        name="itemName"
                        options={itemTypeDDL || []}
                        value={values?.itemName}
                        onChange={(valueOption) => {
                          setFieldValue("itemName", valueOption);
                        }}
                        styles={customStyles}
                        errors={errors}
                        placeholder=""
                        touched={touched}
                        isDisabled={params?.id}
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Supplier Name</label>
                        <FormikInput
                          placeholder=" "
                          classes="input-sm"
                          name="supplierName"
                          value={values?.supplierName}
                          type="text"
                          onChange={(e) => {
                            setFieldValue("supplierName", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Supplier Mobile No.</label>
                        <FormikInput
                          placeholder=""
                          classes="input-sm"
                          name="supplierMobileNo"
                          value={values?.supplierMobileNo}
                          type="text"
                          onChange={(e) => {
                            setFieldValue("supplierMobileNo", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <label>Acquisition Date</label>
                      <div className="policy-category-ddl-wrapper">
                        <FormikInput
                          placeholder=" "
                          classes="input-sm"
                          name="acquisitionDate"
                          value={values?.acquisitionDate}
                          type="date"
                          onChange={(e) => {
                            setFieldValue("acquisitionDate", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Acquisition Value</label>
                        <FormikInput
                          placeholder=" "
                          classes="input-sm"
                          name="acquisitionValue"
                          value={values?.acquisitionValue}
                          type="acquisitionValue"
                          onChange={(e) => {
                            setFieldValue("acquisitionValue", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Invoice Value</label>
                        <FormikInput
                          placeholder=" "
                          classes="input-sm"
                          name="text"
                          value={values?.invoiceValue}
                          type="invoiceValue"
                          onChange={(e) => {
                            setFieldValue("invoiceValue", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Depreciation Value</label>
                        <FormikInput
                          placeholder=" "
                          classes="input-sm"
                          name="text"
                          value={values?.depreciationValue}
                          type="depreciationValue"
                          onChange={(e) => {
                            setFieldValue("depreciationValue", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Depreciation Date</label>
                        <FormikInput
                          placeholder=" "
                          classes="input-sm"
                          name="depreciationDate"
                          value={values?.depreciationDate}
                          type="date"
                          onChange={(e) => {
                            setFieldValue("depreciationDate", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Warranty Date (If available)</label>
                        <FormikInput
                          placeholder=" "
                          classes="input-sm"
                          name="warrantyDate"
                          value={values?.warrantyDate}
                          type="date"
                          onChange={(e) => {
                            setFieldValue("warrantyDate", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-9"></div>
                    <div className="col-lg-6">
                      <label>Description</label>
                      <FormikTextArea
                        classes="textarea-with-label"
                        value={values?.description}
                        onChange={(e) => {
                          setFieldValue("description", e.target.value);
                        }}
                        name="description"
                        type="text"
                        placeholder=" "
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default AssetApplicationCreate;
