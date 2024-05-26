import { MovingOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { APIUrl } from "../../../../../App";
import profileImg from "../../../../../assets/images/profile.jpg";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import IConfirmModal from "../../../../../common/IConfirmModal";
import Loading from "../../../../../common/loading/Loading";
import {
  gray200,
  gray700,
  gray900,
  greenColor,
} from "../../../../../utility/customColor";
import { getEmployeeSalaryInfo, salaryHoldAction } from "../helper";
import DefaultSalary from "./DefaultSalary";

const DrawerBody = ({
  orgId,
  buId,
  wgId,
  employeeId,
  salaryInfoId,
  setAllData,
  setSingleData,
  singleData,
  payrollElementDDL,
  defaultPayrollElement,
  finalPayrollElement,
  breakDownList,
  setBreakDownList,
  policyData,
  status,
  defaultSalaryInitData,
  netGross,
  totalAmount,
  finalTotalAmount,
  setIsOpen,
  setOpenIncrement,
  loading,
  setLoading,
  setIsBulk,
  isBulk,
  setStep,
  step,
  selectedEmployee,
  setSelectedEmployee,
  addHandler,
  deleteHandler,
  wId,
  // formik
  rowDtoHandler,
  resetForm,
  setFieldValue,
  values,
  errors,
  touched,
  setOpenBank,
  bankDataHandler,
  bankId,
}) => {
  const [isHoldSalary, setIsHoldSalary] = useState(false);

  const modifyIsHold = singleData[0]?.IsHold === 1 ? true : false;

  useEffect(() => {
    const obj = {
      partType: "EmployeeSalaryInfoByEmployeeId",
      businessUnitId: buId,
      workplaceGroupId: wgId || 0,
      workplaceId: wId || 0,
      departmentId: 0,
      designationId: 0,
      supervisorId: 0,
      strStatus: status || "NotAssigned",
      employeeId: salaryInfoId || 0,
    };
    getEmployeeSalaryInfo(
      setAllData,
      setSingleData,
      obj,
      status || "NotAssigned",
      setLoading,
      setIsHoldSalary
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salaryInfoId, buId]);

  const holdSalaryHandler = (e) => {
    const confirmObject = {
      closeOnClickOutside: false,
      message: `Are your sure?`,
      yesAlertFunc: () => {
        const callback = () => {
          getEmployeeSalaryInfo(
            setAllData,
            setSingleData,
            {
              partType: "EmployeeSalaryInfoByEmployeeId",
              businessUnitId: buId,
              workplaceGroupId: wgId || 0,
              workplaceId: wId,
              departmentId: 0,
              designationId: 0,
              supervisorId: 0,
              employeeId: singleData[0]?.EmployeeId || 0,
              strStatus: status || "NotAssigned",
            },
            status || "NotAssigned",
            setLoading
          );
        };
        salaryHoldAction(
          e.target.checked,
          singleData[0]?.EmployeeId,
          setLoading,
          callback
        );
      },
      noAlertFunc: () => {
        setIsHoldSalary(modifyIsHold);
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      {loading && <Loading />}
      {singleData?.length > 0 ? (
        <div className="salary-assaign-drawer">
          <div className="card-style">
            <div
              className="d-flex justify-content-between align-items-center mt-2"
              style={{
                paddingBottom: "10px",
                marginBottom: "10px",
                borderBottom: `1px solid ${gray200}`,
              }}
            >
              <div className="d-flex">
                <div
                  style={{
                    width: singleData > 0 ? singleData && "auto" : "78px",
                  }}
                  className={
                    singleData > 0
                      ? singleData && "add-image-about-info-card height-auto"
                      : "add-image-about-info-card"
                  }
                >
                  <label
                    htmlFor="contained-button-file"
                    className="label-add-image"
                  >
                    {singleData[0]?.ProfileImageUrl ? (
                      <img
                        src={`${APIUrl}/Document/DownloadFile?id=${singleData[0]?.ProfileImageUrl}`}
                        alt=""
                        height="78px"
                        width="78px"
                        style={{ maxHeight: "78px", minWidth: "78px" }}
                      />
                    ) : (
                      <img
                        src={profileImg}
                        alt="iBOS"
                        height="78px"
                        width="78px"
                        style={{ maxHeight: "78px", minWidth: "78px" }}
                      />
                    )}
                  </label>
                </div>
                <div className="content-about-info-card ml-3">
                  <div className="d-flex justify-content-between">
                    <h4
                      className="name-about-info"
                      style={{ marginBottom: "5px" }}
                    >
                      {`${singleData[0]?.EmployeeName}  `}
                      <span style={{ fontWeight: "400", color: gray700 }}>
                        [{singleData[0]?.EmployeeCode}]
                      </span>{" "}
                    </h4>
                  </div>
                  <div className="single-info">
                    <p
                      className="text-single-info"
                      style={{ fontWeight: "500", color: gray700 }}
                    >
                      <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                        Department -
                      </small>{" "}
                      {`${singleData[0]?.DepartmentName}`}
                    </p>
                  </div>
                  <div className="single-info">
                    <p
                      className="text-single-info"
                      style={{ fontWeight: "500", color: gray700 }}
                    >
                      <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                        Designation -
                      </small>{" "}
                      {singleData[0]?.DesignationName}
                    </p>
                  </div>
                  <div className="single-info">
                    <p
                      className="text-single-info"
                      style={{ fontWeight: "500", color: gray700 }}
                    >
                      <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                        Employment Type -
                      </small>{" "}
                      {singleData[0]?.strEmploymentType}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <FormikCheckBox
                  height="15px"
                  styleObj={{
                    color: gray900,
                    checkedColor: greenColor,
                    padding: "0px 0px 0px 5px",
                  }}
                  label={"Hold Salary"}
                  name="isHoldSalary"
                  value={isHoldSalary}
                  checked={isHoldSalary}
                  onChange={(e) => {
                    setIsHoldSalary(e.target.checked);
                    holdSalaryHandler(e);
                  }}
                />
                <div>
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenIncrement(true);
                      setIsOpen(false);
                    }}
                    style={{ color: gray900 }}
                    className="d-inline-block mt-2 pointer uplaod-para"
                  >
                    <span style={{ fontSize: "12px" }}>
                      <MovingOutlined
                        sx={{
                          marginRight: "5px",
                          fontSize: "18px",
                          color: gray900,
                        }}
                      />{" "}
                      Increment History
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <DefaultSalary
              propsObj={{
                singleData,
                buId,
                orgId,
                defaultPayrollElement,
                finalPayrollElement,
                breakDownList,
                setBreakDownList,
                defaultSalaryInitData,
                loading,
                setLoading,
                setAllData,
                setSingleData,
                payrollElementDDL,
                employeeId,
                policyData,
                status,
                netGross,
                totalAmount,
                finalTotalAmount,
                setIsBulk,
                isBulk,
                setSelectedEmployee,
                selectedEmployee,
                wgId,
                wId,
                // formik
                rowDtoHandler,
                resetForm,
                setFieldValue,
                values,
                errors,
                touched,
                setOpenIncrement,
                setIsOpen,
                setOpenBank,
                bankDataHandler,
                bankId,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="salary-assaign-drawer">
          <div className="card-style">
            {/* heading */}
            <div
              className="d-flex justify-content-between align-items-center mt-2"
              style={{
                paddingBottom: "10px",
                marginBottom: "10px",
                borderBottom: `1px solid ${gray200}`,
              }}
            >
              <div className="d-flex">
                <div className="content-about-info-card">
                  <div className="d-flex justify-content-between">
                    <h4
                      className="name-about-info"
                      style={{ marginBottom: "5px" }}
                    >
                      Salary Assign
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            {/* body */}
            <DefaultSalary
              propsObj={{
                singleData,
                buId,
                orgId,
                wgId,
                wId,
                defaultPayrollElement,
                finalPayrollElement,
                breakDownList,
                setBreakDownList,
                defaultSalaryInitData,
                loading,
                setLoading,
                setAllData,
                setSingleData,
                payrollElementDDL,
                employeeId,
                policyData,
                status,
                netGross,
                totalAmount,
                finalTotalAmount,
                setIsBulk,
                isBulk,
                setStep,
                step,
                setSelectedEmployee,
                selectedEmployee,
                addHandler,
                deleteHandler,

                // formik
                rowDtoHandler,
                resetForm,
                setFieldValue,
                values,
                errors,
                touched,
                bankDataHandler,
                bankId,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DrawerBody;
