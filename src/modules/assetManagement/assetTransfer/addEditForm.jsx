/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getSearchEmployeeList } from "../../../common/api";
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
import AsyncFormikSelect from "../../../common/AsyncFormikSelect";

const initData = {
  employeeFromName: "",
  employeeToName: "",
  item: "",
  quantity: "",
  transferDate: todayDate(),
  Remarks: "",
};

const validationSchema = Yup.object().shape({
  employeeFromName: Yup.object().shape({
    label: Yup.string().required("Employee from name is required"),
    value: Yup.string().required("Employee from name is required"),
  }),
  employeeToName: Yup.object().shape({
    label: Yup.string().required("Employee to name is required"),
    value: Yup.string().required("Employee to name is required"),
  }),
  item: Yup.object().shape({
    label: Yup.string().required("Item name is required"),
    value: Yup.string().required("Item name is required"),
  }),
  quantity: Yup.number()
    .min(1, "Quantity must be greater than zero")
    .required("Quantity is required"),
  transferDate: Yup.date().required("Assign date is required"),
});

const AssetTransferCreate = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [itemTypeDDL, getItemType, , setItemTypeDDL] = useAxiosGet([]);
  const [employeeFromDDL, getEmployeeFromDDL, , setEmployeeFromDDL] =
    useAxiosGet([]);
  const [, getAssetAssignDetail, assetAssignDetailLoading] = useAxiosGet([]);
  const [, saveAssetDirectAssign, assetAssignLoading] = useAxiosPost({});
  const [singleData, setSingleData] = useState([]);

  const saveHandler = (values, cb) => {
    const callback = () => {
      cb && cb();
      history.push("/assetManagement/assetAssign/assetTransfer");
    };
    const payload = {
      assetTransferId: params?.id || 0,
      businessUnitId: buId,
      fromEmployeeId: values?.employeeFromName?.value,
      itemId: values?.item?.value,
      transferQuantity: +values?.quantity,
      toEmployeeId: values?.employeeToName?.value,
      transferDate: values?.transferDate,
      remarks: values?.remarks,
      isActive: true,
      createdAt: todayDate(),
      createdBy: employeeId,
    };
    saveAssetDirectAssign(
      `/AssetManagement/SaveAssetTransfer`,
      payload,
      callback,
      true
    );
  };

  const getData = () => {
    if (!params?.id) return;
    const assetUrl = `AssetManagement/GetAssetTransferById?assetTransferId=${params.id}`;
    getAssetAssignDetail(assetUrl, (data) => {
      const modifiedData = {
        ...data,
        employeeFromName: {
          value: data?.fromEmployeeId,
          label: data?.fromEmployeeName,
        },
        employeeToName: {
          value: data?.toEmployeeId,
          label: data?.toEmployeeName,
        },
        item: {
          value: data?.itemId,
          label: data?.itemName,
        },
        quantity: data?.transferQuantity,
        transferDate: dateFormatterForInput(data?.transferDate),
        remarks: data?.remarks,
      };
      setSingleData(modifiedData);
      getItemType(
        `/AssetManagement/AssetTransferItemDDL?accountId=${orgId}&businessUnitId=${buId}&employeeId=${data?.fromEmployeeId}`,
        (data) => setItemTypeDDL(data)
      );
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
    getEmployeeFromDDL(
      `AssetManagement/AssetTransferFromEmployeeDDL?accountId=${orgId}&businessUnitId=${buId}`,
      (data) => setEmployeeFromDDL(data)
    );
  }, [orgId]);

  // useEffect(() => {
  //   getPeopleDeskAllDDL(
  //     `/Employee/EmployeeListBySupervisorORLineManagerNOfficeadmin?EmployeeId=${employeeId}&WorkplaceGroupId=${wgId}`,
  //     "intEmployeeBasicInfoId",
  //     "strEmployeeName",
  //     setEmployeeToDDL
  //   );
  // }, [employeeId]);

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
                        ? `Edit Asset Transfer`
                        : `Create Asset Transfer`}
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
                        Transfer
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="card-style">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Select From Employee</label>
                      </div>
                      <FormikSelect
                        menuPosition="fixed"
                        name="employeeFromName"
                        options={employeeFromDDL || []}
                        value={values?.employeeFromName}
                        onChange={(valueOption) => {
                          setFieldValue("item", "");
                          setFieldValue("employeeFromName", valueOption);
                          getItemType(
                            `/AssetManagement/AssetTransferItemDDL?accountId=${orgId}&businessUnitId=${buId}&employeeId=${valueOption?.value}`,
                            (data) => setItemTypeDDL(data)
                          );
                        }}
                        styles={customStyles}
                        errors={errors}
                        placeholder=""
                        touched={touched}
                        isDisabled={params?.id}
                      />
                    </div>
                    <div className="col-12"></div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Select Available Item</label>
                      </div>
                      <FormikSelect
                        isDisabled={!values?.employeeFromName?.value}
                        menuPosition="fixed"
                        name="item"
                        options={itemTypeDDL || []}
                        value={values?.item}
                        onChange={(valueOption) => {
                          setFieldValue("item", valueOption);
                          getItemType(
                            `/AssetManagement/AssetTransferItemDDL?accountId=${orgId}&businessUnitId=${buId}&employeeId=${values?.employeeFromName?.value}`,
                            (data) => setItemTypeDDL(data)
                          );
                        }}
                        styles={customStyles}
                        errors={errors}
                        placeholder=""
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main mt-2">
                        <div className="d-flex justify-content-between">
                          <label>Quantity</label>
                          <label className="bold">
                            Available Quantity:{" "}
                            {values?.item?.quantity ||
                              itemTypeDDL.find(
                                (item) => item?.value === values?.item?.value
                              )?.quantity}
                          </label>
                        </div>
                        <FormikInput
                          placeholder=""
                          classes="input-sm"
                          name="quantity"
                          max={values?.item?.quantity}
                          value={values?.quantity}
                          type="number"
                          onChange={(e) => {
                            if (
                              values?.item?.quantity >= e.target.value ||
                              itemTypeDDL.find(
                                (item) => item?.value === values?.item?.value
                              )?.quantity >= e.target.value
                            ) {
                              setFieldValue("quantity", e.target.value);
                            } else {
                              toast.warn(
                                `Quantity can not be greater than ${values?.item?.quantity}`
                              );
                            }
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Select To Employee</label>
                        {/* <FormikSelect
                          menuPosition="fixed"
                          name="employeeToName"
                          options={employeeToDDL || []}
                          value={values?.employeeToName}
                          onChange={(valueOption) => {
                            setFieldValue("employeeToName", valueOption);
                          }}
                          styles={customStyles}
                          errors={errors}
                          placeholder=""
                          touched={touched}
                        /> */}
                        <AsyncFormikSelect
                          selectedValue={values?.employeeToName}
                          isSearchIcon={true}
                          handleChange={(valueOption) => {
                            setFieldValue("employeeToName", valueOption);
                          }}
                          placeholder="Search (min 3 letter)"
                          loadOptions={(v) =>
                            getSearchEmployeeList(buId, wgId, v)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Transfer Date</label>
                        <FormikInput
                          placeholder=" "
                          classes="input-sm"
                          name="date"
                          value={values?.transferDate}
                          type="date"
                          onChange={(e) => {
                            setFieldValue("transferDate", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <label>Remarks</label>
                      <FormikTextArea
                        classes="textarea-with-label"
                        value={values?.remarks}
                        onChange={(e) => {
                          setFieldValue("Remarks", e.target.value);
                        }}
                        name="Remarks"
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

export default AssetTransferCreate;
