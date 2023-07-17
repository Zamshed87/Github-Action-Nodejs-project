import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getPeopleDeskAllDDL } from "../../../../../common/api";
import FormikSelect from "../../../../../common/FormikSelect";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { getEncashmentBalanceByEmployeeId, getLeaveEncashmenApplication } from "../../helper";

const EditLeaveEncashmentModal = ({ objProps }) => {
  // eslint-disable-next-line no-unused-vars
  const {setFieldValue, touched, errors, values, resetForm, setShow, rowDto, setRowDto, allData, setAllData, setLoading, getData, singleData, setSingleData, initData} = objProps;
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [totalBalanceDDL, setTotalBalanceDDL] = useState([]);

  const makeDropdown = (totalBalance) => {
    const ddl = [];
    for (let i = 1; i <= totalBalance; i++) {
      ddl.push({ value: i, label: i });
    }
    setTotalBalanceDDL(ddl);
  };

  const { orgId, buId, userId } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  const handleSubmit = () => {
    const callback = () => {
      getData();
      setShow(false);
      setSingleData("");
      resetForm(initData);
    }
    const payload = {
      leaveNencashmentApplicationId: singleData?.leaveNencashmentApplication?.intLeaveNencashmentApplicationId || 0,
      employeeId: values?.employee?.value,
      requestDays: values?.leaveType?.value,
      isEncash: singleData?.leaveNencashmentApplication?.isEncash === false ? false : true,
      insertUserId: singleData?.employeeBasicInfo?.intEmployeeId ? "" : userId,
      updateUserId: singleData?.employeeBasicInfo?.intEmployeeId ? userId : "",
      approverEmployeeId: 0,
      isReject: false,
    }
    getLeaveEncashmenApplication(payload, callback);
  }

  useEffect(() => {
    getPeopleDeskAllDDL("EmployeeBasicInfo", orgId, buId, setEmployeeDDL, "EmployeeId", "EmployeeName");
  }, [orgId, buId]);

  useEffect(() => {
    if (singleData?.employeeBasicInfo?.intEmployeeId) {
      getEncashmentBalanceByEmployeeId(singleData?.employeeBasicInfo?.intEmployeeId, makeDropdown);
    }
  }, [singleData?.employeeBasicInfo?.intEmployeeId]);

  

  return (
    <>
      <div className="application-modal">
        <div className="modal-body2" style={{ paddingRight: "17px" }}>
          <div style={{ marginRight: "10px" }}>
            <label>Employee</label>
            <FormikSelect
              name="employee"
              options={employeeDDL || []}
              value={values?.employee}
              label=""
              onChange={(valueOption) => {
                setFieldValue("employee", valueOption);
                setFieldValue("leaveType", "");
                getEncashmentBalanceByEmployeeId(valueOption?.value, makeDropdown);
              }}
              placeholder=""
              styles={customStyles}
              errors={errors}
              touched={touched}
              isDisabled={false}
              menuPosition="fixed"
            />
          </div>
          <div style={{ marginRight: "10px" }}>
            <label>Leave Days</label>
            <FormikSelect
              name="leaveType"
              options={totalBalanceDDL || []}
              value={values?.leaveType}
              label=""
              onChange={(valueOption) => {
                setFieldValue("leaveType", valueOption);
              }}
              placeholder=""
              styles={customStyles}
              errors={errors}
              touched={touched}
              isDisabled={false}
              menuPosition="fixed"
            />
          </div>
        </div>
        <div className="modal-footer form-modal-footer">
          <button
            onClick={(e) => {
              setShow(false);
              resetForm(initData);
              setSingleData("");
            }}
            className="btn btn-cancel"
            color="secondary"
            type="button"
          >
            Cancel
          </button>
          <button className="modal-btn modal-btn-save" color="success" type="submit"
            onClick={() => {
              if(values?.employee?.label && values?.leaveType?.label){
                handleSubmit();
              }else{
                toast.warn("Please fill up all the field");
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default EditLeaveEncashmentModal;
