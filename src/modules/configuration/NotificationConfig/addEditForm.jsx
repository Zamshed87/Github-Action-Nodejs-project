/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PeopleDeskSaasDDL } from "../../../common/api";
import BackButton from "../../../common/BackButton";
import FormikSelect from "../../../common/FormikSelect";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray600, success500 } from "../../../utility/customColor";
import { customStyles } from "../../../utility/selectCustomStyle";
import { createNotification, getNotificationCategoryLanding } from "./helper";

const initData = {
  account: "",
  allSelected: "",
  isChecked: "",
  notifyType: "",
};

export default function NotificationConfigCreate() {
  const dispatch = useDispatch();
  const params = useParams();
  const { state } = useLocation();

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [accountDDL, setAccountDDL] = useState([]);

  const { employeeId, buId, orgId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (params?.id) {
      getNotificationCategoryLanding(params?.id, setRowDto, setLoading);
    }
  }, [params?.id]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 138) {
      permission = item;
    }
  });

  const saveHandler = (values, cb) => {
    if (rowDto?.length <= 0) {
      return toast.warning("Notify category list empty!!!");
    }

    const callback = () => {
      cb();
      getNotificationCategoryLanding(
        values?.account?.value,
        setRowDto,
        setLoading
      );
    };

    const modifyArr = rowDto?.map((item) => {
      return {
        categoryId: item?.categoryId,
        categoryName: item?.categoryName,
        notificationCategoriesViewModelType: item[item?.levelVariable]?.map(
          (itm) => {
            return {
              categoryTypeId: itm?.categoryTypeId,
              categoryTypeName: itm?.typeName,
            };
          }
        ),
      };
    });

    const paylaod = {
      intAccountId: values?.account?.value,
      intCreateBy: employeeId,
      notificationCategoriesViewModel: modifyArr,
    };

    createNotification(paylaod, setLoading, callback);
  };

  useEffect(() => {
    PeopleDeskSaasDDL(
      "Account",
      wgId,
      buId,
      setAccountDDL,
      "intAccountId",
      "strAccountName"
    );
  }, [buId, wgId]);

  // const singleSelectHandler = (e, index) => {
  //   let data = [...rowDto];
  //   data[index].isChecked = e.target.checked;
  //   setRowDto([...data]);
  // };

  const rowDtoHandler = (name, index, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          account: {
            value: state?.companyId,
            label: state?.companyName,
          },
          notifyType: "",
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (params?.id) {
            } else {
              // resetForm(initData);
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
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isCreate ? (
                <>
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div className="table-card-head-left d-flex align-items-center">
                        <BackButton />
                        <h2>
                          {params?.id
                            ? "Edit Notification Setup"
                            : "Create Notification Setup"}
                        </h2>
                      </div>
                      <div className="table-card-head-right">
                        <ul className="d-flex flex-wrap">
                          <li style={{ marginRight: "10px" }}>
                            <button
                              onClick={(e) => {
                                if (params?.id) {
                                } else {
                                  resetForm(initData);
                                }
                              }}
                              type="button"
                              className="btn btn-cancel"
                            >
                              Reset
                            </button>
                          </li>
                          <li>
                            <PrimaryButton
                              type="submit"
                              className="btn btn-green btn-green-disable"
                              label="Save"
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div
                      className="card-style"
                      style={{ margin: "12px 0px", paddingBottom: "0px" }}
                    >
                      <div className="row align-items-center">
                        <div className="col-3">
                          <label>Account</label>
                          <FormikSelect
                            name="account"
                            options={accountDDL}
                            value={values?.account}
                            onChange={(valueOption) => {
                              getNotificationCategoryLanding(
                                valueOption?.value,
                                setRowDto,
                                setLoading
                              );
                              setFieldValue("account", valueOption);
                            }}
                            isClearable={false}
                            placeholder=" "
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                            isDisabled={params?.id}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="table-card-body">
                      <div className="tableOne table-card-styled noOverflowTable">
                        {rowDto?.length > 0 && (
                          <table className="table">
                            <thead>
                              <tr>
                                <th
                                  style={{ width: "30px", textAlign: "center" }}
                                >
                                  SL
                                </th>
                                {/* <th style={{ width: "60px" }} scope="col">
                                  <div className="d-flex align-items-center">
                                    <FormikCheckBox
                                      styleobj={{
                                        margin: "0 0 0 1px",
                                        padding: "0",
                                        color: gray900,
                                        checkedColor: greenColor
                                      }}
                                      name="allSelected"
                                      color={greenColor}
                                      checked={
                                        rowDto?.length > 0 &&
                                        rowDto?.every((item) => item?.isChecked)
                                      }
                                      onChange={(e) => {
                                        let newData = rowDto?.map(
                                          (item) => ({
                                            ...item,
                                            isChecked: e.target.checked,
                                          })
                                        );
                                        setRowDto(newData);
                                        setFieldValue(
                                          "allSelected",
                                          e.target.checked
                                        );
                                      }}
                                      label=""
                                    />
                                  </div>
                                </th> */}
                                <th>Notify category</th>
                                <th style={{ width: "250px" }}>Notify Types</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((item, index) => (
                                <tr key={index}>
                                  <td className="text-center">{index + 1}</td>
                                  {/* <td
                                    className="m-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <FormikCheckBox
                                      styleObj={{
                                        margin: "0 0 0 1px",
                                        padding: "0",
                                        color: gray900,
                                        checkedColor: greenColor,
                                      }}
                                      name="isChecked"
                                      color={greenColor}
                                      checked={rowDto[index]?.isChecked}
                                      onChange={(e) => {
                                        singleSelectHandler(e, index);
                                      }}
                                    />
                                  </td> */}
                                  <td>{item?.categoryName}</td>
                                  <td>
                                    <FormikSelect
                                      placeholder=" "
                                      classes="input-sm"
                                      styles={{
                                        ...customStyles,
                                        control: (provided, state) => ({
                                          ...provided,
                                          minHeight: "auto",
                                          height:
                                            item[item?.levelVariable]?.length >
                                            1
                                              ? "auto"
                                              : "30px",
                                          borderRadius: "4px",
                                          boxShadow: `${success500}!important`,
                                          ":hover": {
                                            borderColor: `${gray600}!important`,
                                          },
                                          ":focus": {
                                            borderColor: `${gray600}!important`,
                                          },
                                        }),
                                        valueContainer: (provided, state) => ({
                                          ...provided,
                                          height:
                                            item[item?.levelVariable]?.length >
                                            1
                                              ? "auto"
                                              : "30px",
                                          padding: "0 6px",
                                        }),
                                        multiValue: (styles) => {
                                          return {
                                            ...styles,
                                            position: "relative",
                                            top: "-1px",
                                          };
                                        },
                                        multiValueLabel: (styles) => ({
                                          ...styles,
                                          padding: "0",
                                          position: "relative",
                                          top: "-1px",
                                        }),
                                      }}
                                      options={
                                        item?.notificationCategoryTypes || []
                                      }
                                      value={item[item?.levelVariable]}
                                      name={item?.levelVariable}
                                      onChange={(valueOption) => {
                                        rowDtoHandler(
                                          `${item?.levelVariable}`,
                                          index,
                                          valueOption
                                        );
                                      }}
                                      isMulti
                                      errors={errors}
                                      touched={touched}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
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
