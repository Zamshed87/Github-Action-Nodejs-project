import React, { useEffect, useMemo, useState } from "react";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useFormik } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import {
  calculateTotalAmountForFinalSattlement,
  getFinalSettlement,
  getFinalSettlementById,
  getPeopleDeskAllDDL,
  initData,
  mapPayrollElementPaymentForFinalSattlement,
  saveEmpFinalSettlement,
} from "../utility/utils";
import { todayDate } from "utility/todayDate";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import BackButton from "common/BackButton";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import FinalSettlementCard from "./FinalSettlementCard";
import { Divider } from "@mui/material";
import ComputationPayement from "./ComputationPayement";
import { numberWithCommas } from "utility/numberWithCommas";
import { gray700 } from "utility/customColor";
import ClearanceFromHr from "./ClearanceFromHr";
import DefaultInput from "common/DefaultInput";

const CreateEditFinalSettlement = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  //   states
  const [loading, setLoading] = useState(false);
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [finalSettlement, setFinalSettlement] = useState({});
  const [employee, setEmployee] = useState({});
  const [singleData, setSingleData] = useState({});
  const [, getPayrollElement, loadingElement] = useAxiosGet([]);
  const [additionPayroll, setAdditionPayroll] = useState([]);
  const [deductionPayroll, setDeductionPayroll] = useState([]);
  const [primaryPayroll, setPrimaryPayroll] = useState([]);

  // useFormik hooks
  const formData = useFormik({
    enableReinitialize: true,
    initialValues: params?.id
      ? {
          cardNumber: singleData?.strIdCard || "",
          healthCard: singleData?.strHealthCard || "",
          salaryDues: singleData?.strSalaryDues || "",
          lastDrawnMonth: singleData?.strLastDrawnMonth || "",
          dueMonth: singleData?.strDueMonth || "",
          advanceDues: singleData?.strAdvanceDues || "",
          taDaOtDues: singleData?.strTaDaOtDues || "",
          otherDues: singleData?.strOtherDues || "",
          remarksHr: singleData?.strRemarksForHr || "",
          remarksStore: singleData?.strRemarksForStore || "",
        }
      : initData,
    onSubmit: (values) => {
      saveHandler(values);
    },
  });
  const { resetForm, handleSubmit, errors, touched, values, setFieldValue } =
    formData;

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30398) {
      permission = item;
    }
  });

  const saveHandler = (values) => {
    const payload = {
      intFinalSettlementId: parseInt(params?.id) || 0,
      intEmployeeId: employee?.value,
      intSeparationId: finalSettlement?.separationId || 0,
      strIdCard: values?.cardNumber,
      strHealthCard: values?.healthCard,
      strSalaryDues: values?.salaryDues,
      strLastDrawnMonth: values?.lastDrawnMonth,
      strDueMonth: values?.dueMonth,
      strAdvanceDues: values?.advanceDues,
      strTaDaOtDues: values?.taDaOtDues,
      strOtherDues: values?.otherDues,
      strRemarksForHr: values?.remarksHr,
      strRemarksForStore: values?.remarksStore,
      intAccountId: orgId,
      intBusinessUnitId: buId,
      intActionBy: employeeId,
      dteCreatedAt: todayDate(),
      dteUpdatedAt: todayDate(),
      isActive: true,
      numTotalAmount:
        totalPrimaryAmount + totalAdditionAmount - totalDeductionAmount || 0,
      payrollElementPayment: [
        ...(primaryPayroll || []).map(
          mapPayrollElementPaymentForFinalSattlement(1, "primary")
        ), // primary-> 1 value
        ...(additionPayroll || []).map(
          mapPayrollElementPaymentForFinalSattlement(2, "addition")
        ), //  addition-> 2 value
        ...(deductionPayroll || []).map(
          mapPayrollElementPaymentForFinalSattlement(3, "deduction")
        ), //  deduction-> 3 value
      ],
    };
    saveEmpFinalSettlement(payload, setLoading, () => {
      params?.id
        ? getFinalSettlementById(
            orgId,
            buId,
            params?.id,
            setSingleData,
            setLoading,
            setEmployee
          )
        : resetForm();
    });
  };

  useEffect(() => {
    if (params?.id) {
      getFinalSettlementById(
        orgId,
        buId,
        params?.id,
        setSingleData,
        setLoading,
        setEmployee,
        (res) => {
          setPrimaryPayroll(res.primary || []);
          setAdditionPayroll(res.addition || []);
          setDeductionPayroll(res.deduction || []);
        }
      );
      getFinalSettlement(
        orgId,
        buId,
        location?.state?.employeeId,
        setFinalSettlement,
        setLoading
      );
    } else {
      getPeopleDeskAllDDL(
        `/SaasMasterData/GetEmployeeSeparationDDl?AccountId=${orgId}`,
        "employeeId",
        "employeeName",
        setEmployeeDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, params?.id, buId, location?.state?.employeeId]);

  const totalAdditionAmount = useMemo(
    () => calculateTotalAmountForFinalSattlement(additionPayroll),
    [additionPayroll]
  );
  const totalDeductionAmount = useMemo(
    () => calculateTotalAmountForFinalSattlement(deductionPayroll),
    [deductionPayroll]
  );
  const totalPrimaryAmount = useMemo(
    () => calculateTotalAmountForFinalSattlement(primaryPayroll),
    [primaryPayroll]
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, [dispatch]);

  return permission.isView ? (
    <>
      {(loading || loadingElement) && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="table-card">
          <div className="table-card-heading mb12">
            <div className="d-flex align-items-center">
              <BackButton />
              <h2>Employee Clearance {params?.id && "Edit"}</h2>
            </div>
            {employee?.value && finalSettlement?.employeeName && (
              <ul
                className={`${
                  params?.type === "view" ? "d-none" : "d-flex flex-wrap"
                }`}
              >
                {!params?.id && (
                  <li>
                    <button
                      type="button"
                      className="btn btn-cancel mr-2"
                      onClick={(e) => {
                        e.preventDefault();
                        resetForm();
                      }}
                    >
                      Reset
                    </button>
                  </li>
                )}
                <li>
                  <button type="submit" className="btn btn-green flex-center">
                    Save
                  </button>
                </li>
              </ul>
            )}
          </div>
          <div className="table-card-body">
            <div className="card-style">
              <div className="row">
                <div className="col-lg-3 mt-2">
                  <div className="input-field-main">
                    <label>Employee</label>
                    <FormikSelect
                      classes="input-sm"
                      name="employee"
                      options={employeeDDL || []}
                      value={employee}
                      onChange={(valueOption) => {
                        setEmployee(valueOption);
                        getFinalSettlement(
                          orgId,
                          buId,
                          valueOption?.value,
                          setFinalSettlement,
                          setLoading
                        );
                        getPayrollElement(
                          `/SaasMasterData/GetEmpPyrPayrollElementType?AccountId=${orgId}`,
                          (res) => {
                            const modify = (item) => ({
                              ...item,
                              strRemarks: "",
                              numAmount: null,
                            });
                            setAdditionPayroll(
                              res?.addition?.map(modify) || []
                            );
                            setDeductionPayroll(
                              res?.deduction.map(modify) || []
                            );
                            setPrimaryPayroll(res?.primary.map(modify) || []);
                          }
                        );
                      }}
                      placeholder="Select Employee"
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isClearable={false}
                      isDisabled={params?.id && true}
                    />
                  </div>
                </div>
              </div>

              {employee?.value && finalSettlement?.employeeName && (
                <div className="mt-2">
                  <FinalSettlementCard finalSettlement={finalSettlement} />
                  <div className="px-4 mb-3">
                    <h2 className="mb-2" style={{ fontSize: "16px" }}>
                      Computation of Final Payment (To be filled by HR)
                    </h2>
                    <Divider className="mb-2" />
                    <ComputationPayement
                      key={primaryPayroll}
                      propsObj={{
                        rowDto: primaryPayroll,
                        setRowDto: setPrimaryPayroll,
                        title: "Earning",
                        footerTitle: "Total Earning (BDT)",
                        total: totalPrimaryAmount,
                        showHeader: true,
                        isDisabled: params?.type === "view",
                      }}
                    />
                    <ComputationPayement
                      key={additionPayroll}
                      propsObj={{
                        rowDto: additionPayroll,
                        setRowDto: setAdditionPayroll,
                        title: "Benefits",
                        footerTitle: "Total Benefits (BDT)",
                        total: totalAdditionAmount,
                        showHeader: false,
                        isDisabled: params?.type === "view",
                      }}
                    />
                    <div className="d-flex justify-content-end my-2">
                      <p>
                        <span className="mr-3">
                          <b>Total (Earning + Benefits) (BDT)</b>
                        </span>
                        <span>
                          <b>
                            {numberWithCommas(
                              totalPrimaryAmount + totalAdditionAmount
                            )}
                          </b>
                        </span>
                      </p>
                    </div>
                    <ComputationPayement
                      key={deductionPayroll}
                      propsObj={{
                        rowDto: deductionPayroll,
                        setRowDto: setDeductionPayroll,
                        title: "Deductions",
                        footerTitle: "Total Deductions (BDT)",
                        total: totalDeductionAmount,
                        showHeader: false,
                        isDisabled: params?.type === "view",
                      }}
                    />
                    <Divider className="mb-2" />
                    <div className="d-flex justify-content-end my-2">
                      <p>
                        <span className="mr-3">
                          <b>Employee Will Get (BDT)</b>
                        </span>
                        <span>
                          <b>
                            {numberWithCommas(
                              totalPrimaryAmount +
                                totalAdditionAmount -
                                totalDeductionAmount
                            )}
                          </b>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="d-none">
                    <h2 className="mb-2" style={{ fontSize: "16px" }}>
                      Clearance From HR
                    </h2>
                    <div className="d-flex align-items-center">
                      <div className="single-info">
                        <p
                          className="text-single-info mr-4"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Remaining Casual Leave -
                          </small>{" "}
                          {finalSettlement?.remainCasualLeave || "N/A"}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Remaining Sick Leave -
                          </small>{" "}
                          {finalSettlement?.remainSickLeave || "N/A"}
                        </p>
                      </div>
                    </div>
                    <Divider className="mb-2" />
                    <ClearanceFromHr formData={formData} />
                  </div>
                  <div className="d-none">
                    <h2 className="mb-2" style={{ fontSize: "16px" }}>
                      Clearance From Store
                    </h2>
                    <div className="single-info">
                      <p
                        className="text-single-info"
                        style={{ fontWeight: "500", color: gray700 }}
                      >
                        <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                          Assets -
                        </small>{" "}
                        {finalSettlement?.assetAssign?.length > 0
                          ? finalSettlement?.assetAssign
                              .map((obj) => obj.assetName)
                              .join(",")
                          : "N/A"}
                      </p>
                    </div>
                    <Divider className="mb-2" />
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="input-field-main">
                          <label>Remarks(Store)</label>
                          <DefaultInput
                            classes="input-sm"
                            placeholder=" "
                            value={values?.remarksStore}
                            name="remarksStore"
                            type="text"
                            onChange={(e) => {
                              setFieldValue("remarksStore", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default CreateEditFinalSettlement;
