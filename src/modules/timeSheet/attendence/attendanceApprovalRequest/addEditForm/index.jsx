/* eslint-disable no-unused-vars */
import { CheckCircle, Close, Info } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelectWithIcon from "../../../../../common/FormikSelectWithIcon";
import Loading from "../../../../../common/loading/Loading";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../../utility/todayDate";
import {
  editManualAttendance,
  getManualAttendanceApprovalList,
} from "../helper";
import { currentYear } from "../utilities/currentYear";
import useDebounce from "utility/customHooks/useDebounce";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import ChangedInOutTimeEmpListModal from "../component/ChangedInOutTime";
import moment from "moment";
import { toast } from "react-toastify";

const initData = {
  businessUnit: "",
  code: "",
  address: "",
  baseCurrency: "",
  websiteUrl: "",
  email: "",
  isActive: false,
  inputFieldType: "",
  inTime: "09:00",
  outTime: "17:00",
};
const validationSchema = Yup.object().shape({
  inputFieldType: Yup.object()
    .shape({
      label: Yup.string().required("Status is required"),
      value: Yup.string().required("Status is required"),
    })
    .typeError("Status is required"),
  // code: Yup.string().required("Remarks is required"),
});

export default function AddEditFormComponent({
  show,
  title,
  onHide,
  size,
  backdrop,
  classes,
  id,
  setTableData,
  setOpenModal,
  singleRowData,
  tableData,
  isMulti,
  setIsMulti,
  fullscreen,
  isVisibleHeading,
  ddlMonth,
  ddlYear,
  selectTableData,
  selectedData,
  setSelectedData,
  setSelectedPayloadState,
  selectedPayloadState,
}) {
  const [loading, setLoading] = useState(false);

  const [modifySingleData, setModifySingleData] = useState("");
  const debounce = useDebounce();
  const [, getExistingCalenderByTime] = useAxiosGet();

  const { buId, employeeId, orgId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const currentMonth = new Date().getMonth() + 1;

  const saveHandler = (values, cb) => {
    if (loading) {
      return toast.warning("Please wait while we are processing your request");
    }
    if (isMulti) {
      const payload = [];

      const dataToProcess =
        selectedPayloadState?.length > 0 ? selectedPayloadState : tableData;

      dataToProcess.forEach((item) => {
        const inTImeStr =
          item?.inDateUpdate +
          "T" +
          moment(item?.intimeUpdate).format("HH:mm:ss");
        const outTimeStr =
          item?.outDateUpdate +
          "T" +
          moment(item?.outtimeUpdate).format("HH:mm:ss");
        if (item?.selectCheckbox) {
          payload.push({
            id: item?.strRequestStatus ? item?.intId : 0,
            attendanceSummaryId: item?.AttendanceSummaryId,
            employeeId: employeeId,
            attendanceDate: item?.dteAttendanceDate,
            inTime: values?.inputFieldType?.value == 1 ? values?.inTime : "",
            outTime: values?.inputFieldType?.value == 1 ? values?.outTime : "",
            currentStatus:
              item?.isPresent === true
                ? "Present"
                : item?.isLate === true
                ? "Late"
                : item?.isLeave === true
                ? "Leave"
                : item?.isMovement === true
                ? "Movement"
                : item?.isAbsent === true
                ? "Absent"
                : "",
            requestStatus: values?.inputFieldType?.label,
            remarks: item?.reasonUpdate || values?.code,
            isApproved: item?.isApproved || false,
            isActive: item?.isActive || true,
            intCreatedBy: employeeId,
            dteCreatedAt: todayDate(),
            isManagement: false,
            accountId: orgId,
            workPlaceGroup: buId,
            businessUnitId: wgId,
            inDateTime: item?.isChanged ? inTImeStr : null,
            outDateTime: item?.isChanged ? outTimeStr : null,
            isAdditionalCalendar: item?.isAdditionalCalendar ? true : false,
            additionalCalendarId: item?.isAdditionalCalendar
              ? item?.additionalCalendarId
              : 0,
          });
        }
      });
      editManualAttendance(payload, setLoading, cb);
      // console.log("payload multi", payload);
    } else {
      const inTImeStr =
        selectedPayloadState[0]?.inDateUpdate +
        "T" +
        moment(selectedPayloadState[0]?.intimeUpdate).format("HH:mm:ss");
      const outTimeStr =
        selectedPayloadState[0]?.outDateUpdate +
        "T" +
        moment(selectedPayloadState[0]?.outtimeUpdate).format("HH:mm:ss");
      const status =
        singleRowData?.isPresent === true
          ? "Present"
          : singleRowData?.isLate === true
          ? "Late"
          : singleRowData?.isLeave === true
          ? "Leave"
          : singleRowData?.isMovement === true
          ? "Movement"
          : singleRowData?.isAbsent === true
          ? "Absent"
          : "";

      const payload = [
        {
          id: singleRowData?.strRequestStatus ? singleRowData?.intId : 0,
          attendanceSummaryId: singleRowData?.AttendanceSummaryId,
          employeeId: employeeId,
          attendanceDate: singleRowData?.dteAttendanceDate,
          inTime: values?.inputFieldType?.value == 1 ? values?.inTime : "",
          outTime: values?.inputFieldType?.value == 1 ? values?.outTime : "",
          currentStatus: status,
          requestStatus: values?.inputFieldType?.label,
          remarks: values?.code,
          isApproved: singleRowData?.isApproved || false,
          isActive: true,
          intCreatedBy: employeeId,
          dteCreatedAt: todayDate(),
          isManagement: false,
          accountId: orgId,
          inDateTime: inTImeStr,
          outDateTime: outTimeStr,
          workPlaceGroup: buId,
          businessUnitId: wgId,
          isAdditionalCalendar: selectedPayloadState[0]?.isAdditionalCalendar
            ? true
            : false,
          additionalCalendarId: selectedPayloadState[0]?.isAdditionalCalendar
            ? selectedPayloadState[0]?.additionalCalendarId
            : 0,
        },
      ];
      editManualAttendance(payload, setLoading, cb);
      // console.log("payload", payload);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={id ? modifySingleData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            getManualAttendanceApprovalList(
              "MonthlyAttendanceSummaryByEmployeeId",
              buId,
              employeeId,
              ddlYear ? ddlYear : currentYear(),
              ddlMonth ? ddlMonth : currentMonth,
              setLoading,
              setTableData
            );
            setOpenModal(false);
            resetForm(initData);
            setIsMulti(false);
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
            <div className="viewModal">
              <Modal
                show={show}
                onHide={onHide}
                size={size}
                backdrop={backdrop}
                aria-labelledby="example-modal-sizes-title-xl"
                className={classes}
                fullscreen={fullscreen && fullscreen}
              >
                <Form>
                  {isVisibleHeading && (
                    <Modal.Header className="bg-custom">
                      <div className="d-flex w-100 justify-content-between">
                        <Modal.Title className="text-center">
                          {title}
                        </Modal.Title>
                        <div>
                          <div
                            className="crossIcon"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              if (id) {
                                resetForm(modifySingleData);
                              } else {
                                resetForm(initData);
                              }
                              onHide();
                            }}
                          >
                            <Close />
                          </div>
                        </div>
                      </div>
                    </Modal.Header>
                  )}

                  <Modal.Body id="example-modal-sizes-title-xl">
                    <div className="businessUnitModal">
                      <div className="modalBody">
                        <div className="row">
                          <div className="col-12">
                            <label>Change Status</label>
                            <FormikSelectWithIcon
                              menuPosition="fixed"
                              name="inputFieldType"
                              options={
                                [
                                  {
                                    value: 1,
                                    label: "Present",
                                    icon: (
                                      <CheckCircle sx={{ fontSize: "18px" }} />
                                    ),
                                  },
                                  {
                                    value: 3,
                                    label: "Late",
                                    icon: <Info sx={{ fontSize: "18px" }} />,
                                  },
                                  {
                                    value: 2,
                                    label: "Changed In/Out Time",
                                    icon: <Info sx={{ fontSize: "18px" }} />,
                                  },
                                ] || []
                              }
                              value={values?.inputFieldType}
                              onChange={(valueOption) => {
                                setFieldValue("inputFieldType", valueOption);
                              }}
                              placeholder=" "
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {/* {values?.inputFieldType?.value == 1 && (
                            <>
                              <div className="col-6">
                                <label>In Time </label>
                                <FormikInput
                                  classes="input-sm"
                                  value={values?.inTime}
                                  onChange={(e) => {
                                    setFieldValue("inTime", e.target.value);
                                    setFieldValue("strCalenderName", "");
                                    if (e.target.value) {
                                      debounce(
                                        () =>
                                          getExistingCalenderByTime(
                                            `/Employee/ManualAttendanceShiftTracing?InTime=${e.target.value}&WorkPlaceGroupId=${wgId}`,
                                            (res) => {
                                              setFieldValue(
                                                "strCalenderName",
                                                res?.strCalenderName
                                              );
                                            }
                                          ),
                                        500
                                      );
                                    }
                                  }}
                                  name="inTime"
                                  type="time"
                                  className="form-control"
                                  placeholder=""
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                              <div className="col-6">
                                <label>Out Time </label>
                                <FormikInput
                                  classes="input-sm"
                                  value={values?.outTime}
                                  onChange={(e) => {
                                    setFieldValue("outTime", e.target.value);
                                  }}
                                  name="outTime"
                                  type="time"
                                  className="form-control"
                                  placeholder=""
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </>
                          )} */}
                          {values?.inputFieldType?.value == 2 && (
                            <>
                              <ChangedInOutTimeEmpListModal
                                selectedData={selectedData}
                                rowDto={selectedPayloadState}
                                setRowDto={setSelectedPayloadState}
                              />
                            </>
                          )}
                          {values?.inputFieldType?.value !== 2 && (
                            <div className="col-12">
                              <label>Remarks</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.code}
                                name="code"
                                type="text"
                                className="form-control"
                                placeholder=" "
                                onChange={(e) => {
                                  setFieldValue("code", e.target.value);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          )}
                        </div>
                        <div className="col-12"></div>
                      </div>
                    </div>
                    {/* </div> */}
                  </Modal.Body>
                  <Modal.Footer className="form-modal-footer">
                    <button
                      type="button"
                      className="btn btn-cancel"
                      sx={{
                        marginRight: "10px",
                      }}
                      onClick={() => {
                        if (id) {
                          resetForm(modifySingleData);
                        } else {
                          resetForm(initData);
                        }
                        onHide();
                        setIsMulti(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-green btn-green-disable"
                      type="submit"
                      disabled={loading}
                      onSubmit={() => handleSubmit()}
                    >
                      Save
                    </button>
                  </Modal.Footer>
                </Form>
              </Modal>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
