/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AntTable from "../../../common/AntTable";
import DefaultInput from "../../../common/DefaultInput";
import FormikCheckBox from "../../../common/FormikCheckbox";
import FormikRadio from "../../../common/FormikRadio";
import IConfirmModal from "../../../common/IConfirmModal";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray500, gray900, greenColor } from "../../../utility/customColor";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import { todayDate } from "../../../utility/todayDate";
import {
  deletePayrollElementTypeById,
  getAllPayrollElementType,
  savePayrollElementType,
} from "./helper";

// Component Start
const PayrollElementCreate = () => {
  const dispatch = useDispatch();
  const scrollRef = useRef();

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [
    editPermission,
    getEditPermission,
    loadingPermission,
    setEditPermission,
  ] = useAxiosGet();
  const [permissionDisabled, setPermissionDisabled] = useState(false);

  const { orgId, buId, employeeId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const initData = {
    elementName: "",
    isBasic: false,
    isPrimarySalaryElement: false,
    additionDeduction: "",
    isTaxable: false,
  };

  const validationSchema = Yup.object().shape({
    additionDeduction: Yup.string().required("Addition/Deduction is required"),
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let payrollElement = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30259) {
      payrollElement = item;
    }
  });

  const {
    handleSubmit,
    resetForm,
    values,
    errors,
    touched,
    setFieldValue,
    setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      saveHandler(values, () => {
        setFieldValue("elementName", "");
        setFieldValue("isBasic", false);
        setFieldValue("isPrimarySalaryElement", false);
        setFieldValue("additionDeduction", "");
        setFieldValue("isTaxable", false);
      });
    },
  });

  useEffect(() => {
    getAllPayrollElementType(orgId, wId, setRowDto, setLoading);
    setEditPermission(null);
  }, [orgId, buId]);

  const saveHandler = (values, cb) => {
    const callback = () => {
      cb();
      setEditPermission(null);
      getAllPayrollElementType(orgId, wId, setRowDto, setLoading);
      setIsEdit(false);
      setSingleData("");
    };

    if (!values?.elementName) {
      return toast.warning(`Element Name is required!!!`);
    }

    if (values?.elementName?.length < 3) {
      return toast.warning(`ElementName must be at least 3 characters!!!`);
    }

    if (!values?.additionDeduction) {
      return toast.warning(`Addition/Deduction is required !!!`);
    }

    const payload = {
      intPayrollElementTypeId: singleData?.intPayrollElementTypeId || 0,
      intAccountId: orgId,
      intWorkplaceId: wId,
      strPayrollElementName: values?.elementName,
      strCode: " ",
      isBasicSalary: values?.isBasic || false,
      isPrimarySalary: values?.isPrimarySalaryElement || false,
      isAddition: values?.additionDeduction === "addition" ? true : false,
      isDeduction: values?.additionDeduction === "deduction" ? true : false,
      isTaxable: values?.isTaxable || false,
      isActive: true,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
    };
    savePayrollElementType(payload, setLoading, callback);
  };

  useEffect(() => {
    if (isEdit) {
      if (singleData?.isPrimarySalary && editPermission?.isSalary) {
        setPermissionDisabled(true);
      } else if (!singleData?.isPrimarySalary && editPermission?.isAllowance) {
        setPermissionDisabled(true);
      }
    }
  }, [isEdit, singleData, editPermission]);

  const demoPopup = (item, values) => {
    const callback = () => {
      setIsEdit(false);
      resetForm(initData);
      setSingleData("");
      getAllPayrollElementType(orgId, wId, setRowDto, setLoading);
    };
    let confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to delete ?`,
      yesAlertFunc: () => {
        deletePayrollElementTypeById(
          item?.intPayrollElementTypeId,
          setLoading,
          callback
        );
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const columns = (page, paginationSize) => {
    return [
      {
        title: "SL",
        render: (text, record, index) =>
          (page - 1) * paginationSize + index + 1,
        sorter: false,
        filter: false,
      },
      {
        title: "Element",
        dataIndex: "strPayrollElementName",
        sorter: false,
        filter: false,
      },
      {
        title: "Is Basic",
        dataIndex: "isBasicSalary",
        render: (data) => <div>{data ? "YES" : "NO"}</div>,
        sorter: false,
        filter: false,
      },
      {
        title: "Salary Element",
        dataIndex: "isPrimarySalary",
        render: (data) => <div>{data ? "YES" : "NO"}</div>,
        sorter: false,
        filter: false,
      },
      {
        title: "Element Type",
        dataIndex: "isAddition",
        render: (data) => <div>{data ? "Addition" : "Deduction"}</div>,
        sorter: false,
        filter: false,
      },
      {
        title: "Taxable",
        dataIndex: "isTaxable",
        render: (data) => <div>{data ? "YES" : "NO"}</div>,
        sorter: false,
        filter: false,
      },
      {
        title: "",
        dataIndex: "",
        render: (_, item) => (
          <div className="d-flex align-items-center justify-content-end">
            <Tooltip title="Edit" arrow>
              <button
                type="button"
                className="iconButton"
                onClick={(e) => {
                  e.preventDefault();
                  scrollRef.current.scrollIntoView({
                    behavior: "smooth",
                  });
                  setIsEdit(true);
                  setSingleData(item);
                  setPermissionDisabled(false);
                  setEditPermission(null);
                  getEditPermission(
                    `/Payroll/IsSalaryElementById?accountId=${orgId}&bussinessUnitId=${buId}&typeId=${item?.intPayrollElementTypeId}&workplaceId${wId}`
                  );
                  setValues({
                    ...values,
                    elementName: item?.strPayrollElementName,
                    isBasic: item?.isBasicSalary,
                    isPrimarySalaryElement: item?.isPrimarySalary,
                    additionDeduction: item?.isAddition
                      ? "addition"
                      : "deduction",
                    isTaxable: item?.isTaxable,
                  });
                }}
              >
                <EditOutlined sx={{ fontSize: "20px" }} />
              </button>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <button
                type="button"
                className="iconButton mt-0 mt-md-2 mt-lg-0"
                onClick={(e) => {
                  e.preventDefault();
                  setPermissionDisabled(false);
                  setEditPermission(null);
                  getEditPermission(
                    `/Payroll/IsSalaryElementById?accountId=${orgId}&bussinessUnitId=${buId}&typeId=${item?.intPayrollElementTypeId}&workplaceId${wId}`,
                    (res) => {
                      if (res?.isSalary || res?.isAllowance) {
                        toast.warning(
                          "This Payroll element is used in salary structure"
                        );
                      } else {
                        demoPopup(item, values);
                      }
                    }
                  );
                }}
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
          </div>
        ),
        sorter: false,
        filter: false,
      },
    ];
  };

  return (
    <>
      <>
        {(loading || loadingPermission) && <Loading />}
        <form onSubmit={handleSubmit}>
          <div className="table-card">
            {payrollElement?.isCreate ? (
              <>
                <div className="table-card-heading mt-2" ref={scrollRef}>
                  <h2>Payroll Element</h2>
                </div>
                <div className="card-style" style={{ marginTop: "16px" }}>
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Enter element name</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.elementName}
                          name="elementName"
                          type="text"
                          placeholder=" "
                          onChange={(e) => {
                            setFieldValue("elementName", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                          disabled={isEdit}
                        />
                      </div>
                    </div>
                    <div className="col-12"></div>
                    <div className="col-lg-3">
                      <FormikCheckBox
                        height="15px"
                        styleobj={{
                          color: gray900,
                          checkedColor: greenColor,
                          padding: "0px 0px 0px 5px",
                        }}
                        label="Is basic?"
                        name="isBasic"
                        checked={values?.isBasic}
                        onChange={(e) => {
                          if (e.target.checked === true) {
                            setFieldValue("isPrimarySalaryElement", true);
                            setFieldValue("additionDeduction", "addition");
                            setFieldValue("isTaxable", true);
                          } else {
                            setFieldValue("isPrimarySalaryElement", false);
                            setFieldValue("additionDeduction", "");
                            setFieldValue("isTaxable", false);
                          }
                          setFieldValue("isBasic", e.target.checked);
                        }}
                        disabled={permissionDisabled}
                      />
                    </div>
                    <div className="col-12"></div>
                    <div className="col-lg-3">
                      <FormikCheckBox
                        height="15px"
                        styleobj={{
                          color: gray900,
                          checkedColor: greenColor,
                          padding: "0px 0px 0px 5px",
                        }}
                        label="Is salary element?"
                        name="isPrimarySalaryElement"
                        checked={values?.isPrimarySalaryElement}
                        onChange={(e) => {
                          if (e.target.checked === true) {
                            setFieldValue("additionDeduction", "addition");
                            setFieldValue("isTaxable", true);
                          } else {
                            setFieldValue("isTaxable", false);
                          }
                          setFieldValue(
                            "isPrimarySalaryElement",
                            e.target.checked
                          );
                        }}
                        disabled={
                          permissionDisabled ||
                          values?.additionDeduction === "deduction" ||
                          values?.isBasic === true
                        }
                      />
                    </div>
                    <div className="col-12"></div>
                    <div className="col-lg-6">
                      <div className="input-feild-main">
                        <FormikRadio
                          styleobj={{
                            iconWidth: "15px",
                            icoHeight: "15px",
                            padding: "0px 8px 0px 10px",
                            checkedColor: greenColor,
                          }}
                          name="additionDeduction"
                          label="Addition"
                          value={"addition"}
                          onChange={(e) => {
                            setFieldValue("additionDeduction", e.target.value);
                          }}
                          checked={values?.additionDeduction === "addition"}
                        />
                        <FormikRadio
                          styleobj={{
                            iconWidth: "15px",
                            icoHeight: "15px",
                            padding: "0px 8px 0px 10px",
                          }}
                          name="additionDeduction"
                          label="Deduction"
                          value={"deduction"}
                          onChange={(e) => {
                            setFieldValue("isBasic", false);
                            setFieldValue("isPrimarySalaryElement", false);
                            setFieldValue("isTaxable", false);
                            setFieldValue("additionDeduction", e.target.value);
                          }}
                          checked={values?.additionDeduction === "deduction"}
                          disabled={editPermission?.isSalary}
                        />
                      </div>
                    </div>
                    <div className="col-12"></div>
                    <div className="col-lg-3">
                      <FormikCheckBox
                        height="15px"
                        styleobj={{
                          color: gray900,
                          checkedColor: greenColor,
                          padding: "0px 0px 0px 5px",
                        }}
                        label="Is taxable?"
                        name="isTaxable"
                        checked={values?.isTaxable}
                        onChange={(e) => {
                          setFieldValue("additionDeduction", "addition");
                          setFieldValue("isTaxable", e.target.checked);
                        }}
                        disabled={values?.additionDeduction === "deduction"}
                      />
                    </div>
                    <div className="col-12">
                      <div className="card-save-border"></div>
                    </div>
                    <div className="col-lg-3">
                      <div className="d-flex align-items-center">
                        <button
                          type="submit"
                          className="btn btn-green btn-green-disable"
                          disabled={
                            !values?.elementName || !values?.additionDeduction
                          }
                        >
                          {isEdit ? "Update" : "Save"}
                        </button>
                        {isEdit && (
                          <button
                            onClick={(e) => {
                              setIsEdit(false);
                              resetForm(initData);
                              setSingleData("");
                              setPermissionDisabled(false);
                              setEditPermission(null);
                            }}
                            className="btn btn-green ml-2"
                            type="button"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {rowDto?.length > 0 ? (
                  <>
                    <div className="table-card-body">
                      <div
                        className="table-card-heading"
                        style={{
                          marginBottom: "8px",
                          marginTop: "12px",
                        }}
                      >
                        <h2
                          style={{
                            color: gray500,
                            fontSize: "14px",
                          }}
                        >
                          Payroll Element List
                        </h2>
                      </div>
                      <div className="table-card-styled tableOne">
                        <AntTable
                          data={rowDto}
                          columnsData={columns(page, paginationSize)}
                          setPage={setPage}
                          setPaginationSize={setPaginationSize}
                          rowKey={(record) => record?.strPayrollElementName}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>{!loading && <NoResult title="No Data Found" para="" />}</>
                )}
              </>
            ) : (
              <>
                <NotPermittedPage />
              </>
            )}
          </div>
        </form>
      </>
    </>
  );
};

export default PayrollElementCreate;
