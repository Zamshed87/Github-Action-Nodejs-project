import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { getPeopleDeskAllDDL } from "../../../../../common/api";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "../../../../../common/FormikSelect";
import FormikTextArea from "../../../../../common/FormikTextArea";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { createExtraSide } from "../helper";

const style = {
  width: "100%",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const initData = {
  date: "",
  employee: "",
  dutyCount: "",
  remarks: "",
};
const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  employee: Yup.object()
    .shape({
      label: Yup.string().required("Employee is required"),
      value: Yup.string().required("Employee is required"),
    })
    .typeError("Employee is required"),
  dutyCount: Yup.string().required("Extra Side Duty is required"),
  remarks: Yup.string().required("Remarks are required"),
});
const OutsideDutyEntryModal = ({
  onHide,
  setLoading,
  getData,
  handleClose,
}) => {
  const { wgId, buId, userId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [empDDL, setEmpDDL] = useState([]);

  const saveHandler = (values, cb) => {
    let payload = {
      partId: 1,
      extraSideDutyId: 0,
      businessUnitId: buId,
      employeeId: values?.employee?.value,
      employeeName: values?.employee?.EmployeeOnlyName,
      dutyCount: +values?.dutyCount,
      dutyDate: values?.date,
      remarks: values?.remarks,
      isActive: true,
      insertBy: userId,
    };

    createExtraSide(payload, setLoading, () => {
      cb();
      getData();
    });
  };
  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfo&BusinessUnitId=${buId}&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
      "EmployeeId",
      "EmployeeName",
      setEmpDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            handleClose();
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
            <Box sx={style} className="holidayGroupModal">
              <Form>
                <div className="modalBody">
                  <div className="input-field-main">
                    <label>Date</label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.date}
                      name="date"
                      type="date"
                      className="form-control"
                      placeholder="Date"
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div>
                    <label>Employee </label>
                    <FormikSelect
                      name="employee"
                      options={empDDL}
                      value={values?.employee}
                      onChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={false}
                      menuPosition="fixed"
                    />
                  </div>
                  <div>
                    <label>Extra Side Duty</label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.dutyCount}
                      name="dutyCount"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("dutyCount", e.target.value);
                      }}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div>
                    <label>Remarks</label>
                    {/* <FormikInput
                      classes="input-sm"
                      value={values?.remarks}
                      name="remarks"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("remarks", e.target.value);
                      }}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                    /> */}

                    <FormikTextArea
                      // classes="input-sm"
                      value={values?.remarks}
                      name="remarks"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("remarks", e.target.value);
                      }}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      style={{ height: "60px" }}
                    />
                  </div>
                </div>
                <div className="modal-footer form-modal-footer">
                  <button
                    type="button"
                    className="modal-btn modal-btn-cancel"
                    onClick={() => onHide()}
                  >
                    Cancel
                  </button>
                  <button
                    className="modal-btn modal-btn-save"
                    type="submit"
                    onSubmit={() => handleSubmit()}
                  >
                    Save
                  </button>
                </div>
              </Form>
            </Box>
          </>
        )}
      </Formik>
    </>
  );
};

export default OutsideDutyEntryModal;
