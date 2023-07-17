/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { ArrowBack, DeleteOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import DemoImg from "../../../assets/images/demo.png";
import FormikInput from "../../../common/FormikInput";
import FormikSelect from "../../../common/FormikSelect";
import Loading from "../../../common/loading/Loading";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { customStyles } from "../../../utility/selectCustomStyle";
import { todayDate } from "./../../../utility/todayDate";
import { isUniq } from "./../../../utility/uniqChecker";

const initData = {
  employee: "",
  remarks: "",
  assetName: "",
  reqQuantity: "",
};

const validationSchema = Yup.object().shape({});

export default function AssetRequisitionForm() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [assetRowDto, setAssetRowDto] = useState([]);

  const { userName, employeeId, designationName, strProfileImageUrl } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  const setter = (values) => {
    if (+values?.reqQuantity <= 0) {
      return toast.warn("Req. Quantity must be greater than 0");
    }
    const payload = {
      assetItemId: values?.assetName?.value,
      assetName: values?.assetName?.label,
      assetCode: values?.assetName?.code,
      assetType: values?.assetName?.type,
      assetReqQty: +values?.reqQuantity,
    };

    if (isUniq("assetItemId", payload?.assetItemId, assetRowDto)) {
      setAssetRowDto([...assetRowDto, { ...payload }]);
    }
  };

  const remover = (payload) => {
    const filterArr = assetRowDto.filter((itm) => itm?.assetItemId !== payload);
    setAssetRowDto([...filterArr]);
  };

  const saveHandler = (values, cb) => {
    if (assetRowDto?.length <= 0) {
      return toast.warn("At least one item asset has been added!");
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employee: { value: employeeId, label: userName },
        }}
        validationSchema={validationSchema}
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
              {loading && <Loading />}
              <div className="table-card">
                <div className="table-card-heading">
                  <div>
                    <ResetButton
                      title="back"
                      icon={
                        <ArrowBack
                          sx={{ marginRight: "10px", fontSize: "18px" }}
                        />
                      }
                      onClick={() => {
                        history.goBack();
                        resetForm();
                      }}
                    />
                  </div>
                  <ul className="d-flex flex-wrap">
                    <li>
                      <button
                        type="button"
                        onClick={() => resetForm(initData)}
                        className="btn btn-green btn-green-disabled mr-2"
                      >
                        Reset
                      </button>
                    </li>
                    <li>
                      <button
                        onSubmit={handleSubmit}
                        type="submit"
                        className="btn btn-green btn-green-disabled"
                      >
                        Save
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="table-card-body">
                  <div className="leave-movement-FormCard col-md-12 pl-0">
                    <div className="card policy-attachment">
                      <div
                        className="card-body"
                        style={{ padding: "0.5rem 0 0.75rem 0" }}
                      >
                        <div className="row m-lg-1 m-0">
                          <div className="col-xl-12">
                            <div className="employeeInfo d-flex align-items-center">
                              <img
                                src={
                                  strProfileImageUrl
                                    ? `https://emgmt.peopledesk.io/emp/Document/DownloadFile?id=${strProfileImageUrl}`
                                    : DemoImg
                                }
                                alt="Profile"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                              <div className="employeeTitle ml-2">
                                <p className="employeeName">{userName}</p>
                                <p className="employeePosition">
                                  {designationName}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row m-lg-1 m-0">
                          <div className="col-xl-2 col-lg-3">
                            <div className="input-field-main">
                              <label>Asset Name</label>
                              <div className="policy-category-ddl-wrapper">
                                <FormikSelect
                                  placeholder="Select Asset Name"
                                  classes="input-sm"
                                  styles={customStyles}
                                  name="assetName"
                                  options={[
                                    {
                                      value: 1,
                                      label: "Laptop",
                                      code: "10BA20D",
                                      type: "Electronics",
                                    },
                                    {
                                      value: 2,
                                      label: "Mouse",
                                      code: "10BA20E",
                                      type: "Electronics",
                                    },
                                  ]}
                                  value={values?.assetName}
                                  onChange={(valueOption) => {
                                    setFieldValue("assetName", valueOption);
                                  }}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-2 col-lg-3">
                            <div className="input-field-main">
                              <label>Request Quantity</label>
                              <div className="policy-category-ddl-wrapper">
                                <FormikInput
                                  type="number"
                                  placeholder="Request Quantity"
                                  classes="input-sm"
                                  name="reqQuantity"
                                  value={values?.reqQuantity}
                                  onChange={(e) => {
                                    setFieldValue(
                                      "reqQuantity",
                                      e.target.value
                                    );
                                  }}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-2 col-lg-3">
                            <div className="input-field-main">
                              <label>Remarks</label>
                              <div className="policy-category-ddl-wrapper">
                                <FormikInput
                                  placeholder="Remarks"
                                  classes="input-sm"
                                  name="remarks"
                                  value={values?.remarks}
                                  onChange={(e) => {
                                    setFieldValue("remarks", e.target.value);
                                  }}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-1">
                            <div className="d-flex justify-content-between">
                              <button
                                type="button"
                                className="btn btn-green btn-green-less border mt-4"
                                onClick={() => {
                                  setter(values);
                                }}
                                disabled={
                                  !values?.assetName || !values?.reqQuantity
                                }
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="row m-lg-1 m-0">
                          <div className="col-12 mt-2">
                            <div className="table-card-styled tableOne">
                              <table className="table">
                                {assetRowDto?.length >= 0 && (
                                  <>
                                    <thead>
                                      <tr>
                                        <th>Date</th>
                                        <th>Asset Code</th>
                                        <th>Asset Name</th>
                                        <th>Asset Type</th>
                                        <th style={{ width: "80px" }}>Qty</th>
                                        <th style={{ width: "80px" }}></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {assetRowDto?.map((item, index) => {
                                        return (
                                          <tr key={index}>
                                            <td>{todayDate()}</td>
                                            <td>{item?.assetCode}</td>
                                            <td>
                                              <div className="d-flex align-items-center">
                                                {item?.assetName}
                                                {/* <p style={{
                                                                                       fontSize: "12px",
                                                                                       fontWeight: "500",
                                                                                       color: "#0072E5",
                                                                                       textDecoration: "underline",
                                                                                       marginLeft: "5px"
                                                                                    }}>
                                                                                       {"8 pcs"}
                                                                                    </p> */}
                                              </div>
                                            </td>
                                            <td>{item?.assetType}</td>
                                            <td>{item?.assetReqQty}</td>
                                            <td>
                                              <div className="d-flex align-items-center">
                                                <button
                                                  type="button"
                                                  className="iconButton mt-0 mt-md-2 mt-lg-0"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    remover(item?.assetItemId);
                                                  }}
                                                >
                                                  <DeleteOutlined />
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </>
                                )}
                              </table>
                            </div>
                          </div>
                        </div>
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
}
