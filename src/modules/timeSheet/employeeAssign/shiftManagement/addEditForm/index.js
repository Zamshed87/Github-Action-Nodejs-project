import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import DefaultInput from "../../../../../common/DefaultInput";
import {
  monthFirstDate,
  monthLastDate,
} from "../../../../../utility/dateFormatter";
import { createShiftManagement, getCalenderDDL } from "../helper";
import FormikSelect from "./../../../../../common/FormikSelect";
import Loading from "./../../../../../common/loading/Loading";
import { customStyles } from "./../../../../../utility/selectCustomStyle";

const initData = {
  shiftName: "",
  fromDate: monthFirstDate(),
  toDate: monthLastDate(),
};
const validationSchema = Yup.object().shape({
  shiftName: Yup.object()
    .shape({
      label: Yup.string().required("Shift is required"),
      value: Yup.string().required("Shift is required"),
    })
    .typeError("Shift is required"),
  fromDate: Yup.string().required("From Date is required"),
  toDate: Yup.string().required("To Date is required"),
});

export default function AddEditFormComponent({
  id,
  show,
  onHide,
  size,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  shiftData,
  setCreateModal,
  setSingleAssign,
  getData,
  pages
}) {
  const [loading, setLoading] = useState(false);

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [rosterDDL, setRosterDDL] = useState([]);

  useEffect(() => {
    getCalenderDDL(
      `/Employee/GetCalenderDdl?intAccountId=${orgId}&intBusinessUnitId=${buId}`,
      "intCalenderId",
      "strCalenderName",
      setRosterDDL
    );
  }, [orgId, buId]);

  const saveHandler = (values, cb) => {
    const modifyFilterRowDto = shiftData.filter(
      (itm) => itm.isAssigned === true
    );
    const emplist = modifyFilterRowDto.map((item) => item?.EmployeeId);
    const payload = {
      intEmployeeId: emplist,
      shifts: [
        {
          intCalenderId: values?.shiftName?.value,
          strCalenderName: values?.shiftName?.strCalenderName,
          dteStartTime: values?.shiftName?.dteStartTime,
          dteExtendedStartTime: values?.shiftName?.dDteExtendedStartTime,
          dteLastStartTime: values?.shiftName?.dteLastStartTime,
          dteEndTime: values?.shiftName?.dteEndTime,
          numMinWorkHour: values?.shiftName?.numMinWorkHour,
          dteBreakStartTime: values?.shiftName?.dteBreakStartTime,
          dteBreakEndTime: values?.shiftName?.dteBreakEndTime,
          dteOfficeStartTime: values?.shiftName?.dteOfficeStartTime,
          dteOfficeCloseTime: values?.shiftName?.dteOfficeCloseTime,
          isNightShift: values?.shiftName?.isNightShif,
          fromdate: values.fromDate,
          todate: values.toDate,
        },
      ],
      IntActionBy: employeeId,
    };
    const callBack = () => {
      setSingleAssign(false);
      setCreateModal(false);
      getData(pages);
    };

    //    console.log(payload)
    createShiftManagement(payload, setLoading, callBack);

    // rosterGenerateAction(payload, setLoading, callBack);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
            {loading && <Loading />}
            <div className="">
              {/* <Modal
                show={show}
                onHide={onHide}
                size={size}
                backdrop={backdrop}
                aria-labelledby="example-modal-sizes-title-xl"
                className={classes}
                fullscreen={fullscreen && fullscreen}
              > */}
              <Form>
                {/* <Modal.Body id="example-modal-sizes-title-xl"> */}
                <div className="businessUnitModal">
                  <div className="modalBody p-0">
                    <div className="row mx-0">
                      <div className="col-12">
                        <label>Shift</label>
                        <FormikSelect
                          placeholder=" "
                          classes="input-sm"
                          styles={customStyles}
                          name="shiftName"
                          options={rosterDDL || []}
                          isClearable={false}
                          value={values?.shiftName}
                          onChange={(valueOption) => {
                            setFieldValue("shiftName", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="row mx-0">
                      <div className="col-12">
                        <label>From Date</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.fromDate}
                          name="fromDate"
                          type="date"
                          min={values?.fromDate}
                          max={values?.toDate}
                          placeholder=" "
                          onChange={(e) => {
                            setFieldValue("fromDate", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="row mx-0">
                      <div className="col-12">
                        <label>To date</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.toDate}
                          name="toDate"
                          type="date"
                          min={values?.fromDate}
                          max={values?.toDate}
                          placeholder=" "
                          onChange={(e) => {
                            setFieldValue("toDate", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* </Modal.Body> */}
                {loading && <Loading />}
                {/* <Modal.Footer className="form-modal-footer"> */}
                  <div className="d-flex justify-content-end p-2">
            <ul className="d-flex flex-wrap">
              <li>
                <button
                  onClick={() => {
                    setCreateModal(false);
                    setSingleAssign(false);
                  }}
                  type="button"
                  className="btn btn-cancel mr-2"
                >
                  Cancel
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSubmit()}
                  type="button"
                  className="btn btn-green flex-center"
                >
                  Save
                </button>
              </li>
            </ul>
          </div>
                {/* <div className="master-filter-btn-group">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    style={{
                      marginRight: "15px",
                    }}
                    onClick={() => {
                      onHide();
                      resetForm(initData);
                      setCreateModal(false);
                      setSingleAssign(false);
                      //   getData();
                      //   setFieldValueParent("search", "");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-green"
                    type="submit"
                    onSubmit={() => handleSubmit()}
                  >
                    Save
                  </button>
                </div> */}
                {/* </Modal.Footer> */}
              </Form>
              {/* </Modal> */}
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
