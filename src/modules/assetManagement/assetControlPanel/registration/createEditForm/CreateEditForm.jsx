import React, { useEffect, useState } from "react";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { Form, Formik } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import {
  getById,
  initialValue,
  itemAddHandler,
  registrationColumn,
  saveHandler,
} from "../utils";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import PrimaryButton from "common/PrimaryButton";
import BackButton from "common/BackButton";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import FormikInput from "common/FormikInput";
import { gray900, greenColor } from "utility/customColor";
import FormikCheckBox from "common/FormikCheckbox";
import NoResult from "common/NoResult";
import PeopleDeskTable from "common/peopleDeskTable";
import Required from "common/Required";
import Loading from "common/loading/Loading";

const AssetRegistrationForm = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { orgId, buId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [itemDDL, getItem, , setItemDDL] = useAxiosGet([]);
  const [, saveRegistration, loading] = useAxiosPost([]);
  const [editLoading, setEditLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [itemCode, setItemCode] = useState(null);
  const [singleData, getSingleData, singleDataLoading, setSingleData] =
    useAxiosGet({});

  useEffect(() => {
    if (id) {
      getById(id, getSingleData, setSingleData, setRowDto);
    }
    getItem(
      `/AssetManagement/ItemDDL?accountId=${orgId}&businessUnitId=${buId}&workplaceId=${wId}&workplaceGroupId=${wgId}`,
      (res) => {
        setItemDDL(res);
      }
    );
  }, [orgId, buId, wId, wgId, id]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Asset Management"));
    document.title = "Registration";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? singleData : initialValue}
      // validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(
          id,
          values,
          rowDto,
          itemCode,
          saveRegistration,
          orgId,
          buId,
          wId,
          wgId,
          setEditLoading,
          () => {
            if (id) {
              history.goBack();
            } else {
              resetForm(initialValue);
              setRowDto([]);
              setItemCode(null);
            }
          }
        );
      }}
    >
      {({ handleSubmit, values, errors, touched, setFieldValue }) => (
        <>
          {(loading || singleDataLoading || editLoading) && <Loading />}
          <Form onSubmit={handleSubmit}>
            <div className="mb-2">
              <div className="table-card pb-2">
                <div className="table-card-heading">
                  <div className="d-flex align-items-center">
                    <BackButton
                      title={`${
                        !id ? "Create Registration" : "Edit Registration"
                      }`}
                    />
                  </div>
                  <div className="table-card-head-right">
                    <ul>
                      <li>
                        <PrimaryButton
                          className="btn btn-green btn-green-disable"
                          type="submit"
                          label="Save"
                          disabled={loading}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="table-card-body">
                <div className="card-style">
                  <div className="row py-2 px-1">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>
                              Item <Required />{" "}
                            </label>
                          </div>
                          <FormikSelect
                            menuPosition="fixed"
                            name="employeeName"
                            options={itemDDL || []}
                            value={values?.itemName}
                            onChange={(valueOption) => {
                              setFieldValue("itemName", valueOption);
                              if (valueOption) {
                                setItemCode(valueOption?.itemCode);
                              } else {
                                setItemCode(null);
                              }
                            }}
                            styles={customStyles}
                            errors={errors}
                            placeholder=""
                            touched={touched}
                            isDisabled={rowDto?.length}
                          />
                        </div>
                        <div className="col-lg-4">
                          <div className="d-flex">
                            <div className="mt-4">
                              <label>Depreciation</label>
                              <FormikCheckBox
                                height="15px"
                                styleobj={{
                                  color: gray900,
                                  checkedColor: greenColor,
                                  padding: "0px 0px 0px 10px",
                                }}
                                label=""
                                name="isDepreciation"
                                checked={values?.isDepreciation}
                                onChange={(e) => {
                                  setFieldValue(
                                    "isDepreciation",
                                    e.target.checked
                                  );
                                }}
                              />
                            </div>
                            {values?.isDepreciation ? (
                              <div>
                                <label>
                                  Percentage <Required />
                                </label>
                                <FormikInput
                                  classes="input-sm"
                                  placeholder=" "
                                  value={values?.percentage}
                                  name="percentage"
                                  type="number"
                                  onChange={(e) => {
                                    setFieldValue("percentage", e.target.value);
                                  }}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <label>
                        Identifier By <Required />
                      </label>
                      <FormikInput
                        classes="input-sm"
                        placeholder=" "
                        type="text"
                        value={values?.identifierBy}
                        name="identifierBy"
                        onChange={(e) => {
                          setFieldValue("identifierBy", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <div className="mt-4">
                        <label>Is Auto Value</label>
                        <FormikCheckBox
                          height="15px"
                          styleobj={{
                            color: gray900,
                            checkedColor: greenColor,
                            padding: "0px 0px 0px 10px",
                          }}
                          label=""
                          name="isAutoValue"
                          checked={values?.isAutoValue}
                          disabled={id}
                          onChange={(e) => {
                            setFieldValue("isAutoValue", e.target.checked);
                          }}
                        />
                      </div>
                    </div>
                    {values?.isAutoValue ? (
                      <div className="col-lg-2">
                        <label>
                          Start Number <Required />
                        </label>
                        <FormikInput
                          classes="input-sm"
                          placeholder=" "
                          value={values?.startNumber}
                          name="startNumber"
                          type="number"
                          onChange={(e) => {
                            if (e.target.value > 0) {
                              setFieldValue("startNumber", e.target.value);
                            } else {
                              setFieldValue("startNumber", "");
                            }
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    ) : null}
                    <div className="col-lg-2">
                      <label>
                        Qty <Required />{" "}
                      </label>
                      <FormikInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.qty}
                        name="qty"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value > 0) {
                            setFieldValue("qty", e.target.value);
                          } else {
                            setFieldValue("qty", "");
                          }
                        }}
                        errors={errors}
                        touched={touched}
                        disabled={rowDto?.length}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>
                        Rate <Required />{" "}
                      </label>
                      <FormikInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.rate}
                        name="rate"
                        type="number"
                        onChange={(e) => {
                          if (e.target.value > 0) {
                            setFieldValue("rate", e.target.value);
                          } else {
                            setFieldValue("rate", "");
                          }
                        }}
                        errors={errors}
                        touched={touched}
                        disabled={rowDto?.length}
                      />
                    </div>
                    <div className="col-lg-2 mt-4">
                      <div className="d-flex">
                        <div>
                          <PrimaryButton
                            type="button"
                            className="btn btn-default flex-center"
                            label={"Add"}
                            disabled={
                              !values?.itemName || !values?.qty || !values?.rate
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              itemAddHandler(values, setRowDto, () => {
                                setFieldValue("itemName", "");
                                setFieldValue("qty", "");
                                setFieldValue("rate", "");
                                setFieldValue("isAutoValue", false);
                                setFieldValue("startNumber", "");
                              });
                            }}
                          />
                        </div>
                        <div className="ml-2">
                          {rowDto?.length > 0 && !id ? (
                            <PrimaryButton
                              type="button"
                              className="btn btn-default flex-center"
                              label={"All Delete"}
                              onClick={(e) => {
                                e.stopPropagation();
                                setRowDto([]);
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-card-body">
                        {rowDto?.length > 0 ? (
                          <PeopleDeskTable
                            columnData={registrationColumn(
                              errors,
                              touched,
                              rowDto,
                              setRowDto
                            )}
                            rowDto={rowDto}
                            setRowDto={setRowDto}
                            uniqueKey="itemId"
                            isPagination={false}
                          />
                        ) : (
                          <>
                            {!loading && (
                              <div className="col-12">
                                <NoResult title={"No Data Found"} para={""} />
                              </div>
                            )}
                          </>
                        )}
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
  );
};

export default AssetRegistrationForm;
