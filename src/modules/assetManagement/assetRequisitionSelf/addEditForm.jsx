/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import * as Yup from "yup";
import BackButton from "../../../common/BackButton";
import FormikInput from "../../../common/FormikInput";
import FormikSelect from "../../../common/FormikSelect";
import Loading from "../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../utility/customHooks/useAxiosPost";
import { dateFormatterForInput } from "../../../utility/dateFormatter";
import { customStyles } from "../../../utility/selectCustomStyle";
import { todayDate } from "../../../utility/todayDate";

const initData = {
  itemName: "",
  quantity: "",
  requisitionDate: todayDate(),
  remarks: "",
};

const validationSchema = Yup.object().shape({
  itemName: Yup.object().shape({
    label: Yup.string().required("Item name is required"),
    value: Yup.string().required("Item name is required"),
  }),
  quantity: Yup.number()
    .min(1, "Quantity must be greater than zero")
    .required("Quantity is required"),
  requisitionDate: Yup.date().required("Requisition date is required"),
});

const AssetRequisitionSelfCreate = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [itemTypeDDL, getItemType, , setItemTypeDDL] = useAxiosGet([]);
  const [, getAssetAssignDetail, assetAssignDetailLoading] = useAxiosGet([]);
  const [, saveAssetDirectAssign, assetAssignLoading] = useAxiosPost({});
  const [singleData, setSingleData] = useState([]);

  const saveHandler = (values, cb) => {
    const payload = {
      assetRequisitionId: params?.id || 0,
      accountId: orgId,
      businessUnitId: buId,
      itemId: values?.itemName?.value,
      employeeId: employeeId,
      reqisitionQuantity: values?.quantity,
      reqisitionDate: values?.requisitionDate,
      remarks: values?.remarks,
      active: true,
      createdAt: todayDate(),
      createdBy: employeeId,
      updatedAt: todayDate(),
      updatedBy: employeeId,
    };
    saveAssetDirectAssign(
      `/AssetManagement/SaveAssetRequisition`,
      payload,
      cb,
      true
    );
  };

  const getItemTypeDDL = (orgId) => {
    getItemType(
      `/AssetManagement/ItemDDL?accountId=${orgId}&businessUnitId=${buId}`,
      (data) => setItemTypeDDL(data)
    );
  };

  const getData = () => {
    if (!params?.id) return;
    const assetUrl = `/AssetManagement/GetAssetRequisitionById?accountId=${orgId}&businessUnitId=${buId}&assetRequisitionId=${params.id}`;
    getAssetAssignDetail(assetUrl, (data) => {
      const modifiedData = {
        itemName: {
          value: data?.itemId,
          label: data?.itemName,
        },
        quantity: data?.reqisitionQuantity,
        requisitionDate: dateFormatterForInput(data?.reqisitionDate),
        remarks: data?.remarks,
      };
      setSingleData(modifiedData);
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    params?.id && getData();
  }, [orgId, buId, params?.id]);

  useEffect(() => {
    getItemTypeDDL(orgId);
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
              {(assetAssignLoading || assetAssignDetailLoading) && <Loading />}
              <div className="table-card">
                <div className="table-card-heading mb12">
                  <div className="d-flex align-items-center">
                    <BackButton />
                    <h2>
                      {params?.id
                        ? `Edit Asset Requisition`
                        : `Create Asset Requisition`}
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
                    <div className="col-12"></div>
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
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Quantity</label>
                        <FormikInput
                          placeholder=""
                          classes="input-sm"
                          name="quantity"
                          value={values?.quantity}
                          type="number"
                          onChange={(e) => {
                            setFieldValue("quantity", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Requisition Date</label>
                        <FormikInput
                          placeholder=" "
                          classes="input-sm"
                          name="date"
                          value={values?.requisitionDate}
                          type="date"
                          onChange={(e) => {
                            setFieldValue("requisitionDate", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Remarks</label>
                        <FormikInput
                          placeholder=""
                          classes="input-sm"
                          name="remarks"
                          value={values?.remarks}
                          type="text"
                          onChange={(e) => {
                            setFieldValue("remarks", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
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

export default AssetRequisitionSelfCreate;
