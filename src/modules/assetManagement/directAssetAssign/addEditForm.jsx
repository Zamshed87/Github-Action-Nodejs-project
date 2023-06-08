/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import * as Yup from "yup";
import { getSearchEmployeeList } from "../../../common/api";
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
import AsyncFormikSelect from "../../../common/AsyncFormikSelect";

const initData = {
  employeeName: "",
  itemName: "",
  quantity: "",
  assignDate: todayDate(),
};

const validationSchema = Yup.object().shape({
  employeeName: Yup.object().shape({
    label: Yup.string().required("Employee name is required"),
    value: Yup.string().required("Employee name is required"),
  }),
  itemName: Yup.object().shape({
    label: Yup.string().required("Item name is required"),
    value: Yup.string().required("Item name is required"),
  }),
  quantity: Yup.number()
    .min(1, "Quantity must be greater than zero")
    .required("Quantity is required"),
  assignDate: Yup.date().required("Assign date is required"),
});

const DirectAssetAssignCreate = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [itemTypeDDL, getItemType, , setItemTypeDDL] = useAxiosGet([]);
  const [, getAssetAssignDetail, assetAssignDetailLoading] = useAxiosGet([]);
  const [, saveAssetDirectAssign, assetAssignLoading] = useAxiosPost({});

  const [singleData, setSingleData] = useState([]);

  const saveHandler = (values, cb) => {
    const payload = {
      assetDirectAssignId: params?.id || 0,
      accountId: orgId,
      businessUnitId: buId,
      employeeId: values?.employeeName?.value,
      employeeName: values?.employeeName?.label,
      itemId: values?.itemName?.value,
      itemName: values?.itemName?.label,
      itemQuantity: values?.quantity,
      assignDate: values?.assignDate,
      active: true,
      createAt: todayDate(),
      createdBy: employeeId,
      updatedAt: todayDate(),
      updatedBy: employeeId,
    };
    saveAssetDirectAssign(
      `/AssetManagement/SaveDirectAssetAssign`,
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
    const assetUrl = `/AssetManagement/GetDirectAssetAssignById?accountId=${orgId}&businessUnitId=${buId}&assetId=${params.id}`;
    getAssetAssignDetail(assetUrl, (data) => {
      const modifiedData = {
        ...data,
        employeeName: {
          value: data?.employeeId,
          label: data?.employeeName,
        },
        itemName: {
          value: data?.itemId,
          label: data?.itemName,
        },
        quantity: data?.itemQuantity,
        assignDate: dateFormatterForInput(data?.assignDate),
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
                        ? `Edit Direct Asset Assign`
                        : `Create Direct Asset Assign`}
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
                        <label>Select Employee</label>
                      </div>
                      {/* <FormikSelect
                        menuPosition="fixed"
                        name="employeeName"
                        options={employeeDDL || []}
                        value={values?.employeeName}
                        onChange={(valueOption) => {
                          setFieldValue("employeeName", valueOption);
                        }}
                        styles={customStyles}
                        errors={errors}
                        placeholder=""
                        touched={touched}
                        isDisabled={params?.id}
                      /> */}
                      <AsyncFormikSelect
                        selectedValue={values?.employeeName}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          setFieldValue("employeeName", valueOption);
                        }}
                        placeholder="Search (min 3 letter)"
                        loadOptions={(v) =>
                          getSearchEmployeeList(buId, wgId, v)
                        }
                        isDisabled={params?.id}
                      />
                    </div>
                    <div className="col-12"></div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Select Item</label>
                      </div>
                      <FormikSelect
                        menuPosition="fixed"
                        name="employeeName"
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
                        <label>Assign Date</label>
                        <FormikInput
                          placeholder=" "
                          classes="input-sm"
                          name="date"
                          value={values?.assignDate}
                          type="date"
                          onChange={(e) => {
                            setFieldValue("assignDate", e.target.value);
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

export default DirectAssetAssignCreate;
