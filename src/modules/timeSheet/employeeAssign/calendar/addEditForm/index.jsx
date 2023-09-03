import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { rosterGenerateAction } from "../helper";
import { getPeopleDeskAllDDL } from "./../../../../../common/api/index";
import FormikInput from "./../../../../../common/FormikInput";
import FormikSelect from "./../../../../../common/FormikSelect";
import Loading from "./../../../../../common/loading/Loading";
import { customStyles } from "./../../../../../utility/selectCustomStyle";
import { todayDate } from "./../../../../../utility/todayDate";

const initData = {
  generateDate: todayDate(),
  calenderType: "",
  calender: "",
  startingCalender: "",
  nextChangeDate: "",
};
const validationSchema = Yup.object().shape({
  generateDate: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(100, "Maximum 100 symbols")
    .required("Date of Joining is required")
    .typeError("Date of Joining is required"),
  calenderType: Yup.object()
    .shape({
      label: Yup.string().required("Calendar Type is required"),
      value: Yup.string().required("Calendar Type is required"),
    })
    .typeError("Calendar Type is required"),
  calender: Yup.object()
    .shape({
      label: Yup.string().required("Calendar is required"),
      value: Yup.string().required("Calendar is required"),
    })
    .typeError("Calendar is required"),
  // nextChangeDate: Yup.string()
  // 	.min(1, "Minimum 1 symbols")
  // 	.max(100, "Maximum 100 symbols")
  // 	.required("Next Change Date is required")
  // 	.typeError("Next Change Date is required"),
  // startingCalender: Yup.object().when("calenderType", {
  // 	is: (val) => val?.value === 2,
  // 	then: Yup.object()
  // 		.shape({
  // 			label: Yup.string().required("Starting calender is required"),
  // 			value: Yup.string().required("Starting calender is required"),
  // 		})
  // 		.typeError("Starting calender is required"),
  // }),
});

export default function AddEditFormComponent({
  show,
  onHide,
  size,
  backdrop,
  singleData,
  setSingleData,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  checked,
  getData,
  setChecked,
  setFieldValueParent,
  isAssignAll,
  setIsAssignAll,
  empIDString,
  setRowDto,
  rowDto,
}) {
  const [loading, setLoading] = useState(false);

  const { buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [calenderDDL, setCalenderDDL] = useState([]);
  const [calenderRoasterDDL, setCalenderRoasterDDL] = useState([]);
  const [startingCalenderDDL, setStartingCalenderDDL] = useState([]);

  const getDDL = (value) => {
    let ddlType = value === 1 ? "Calender" : "RosterGroup";
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=${ddlType}&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`,
      value === 1 ? "CalenderId" : "RosterGroupId",
      value === 1 ? "CalenderName" : "RosterGroupName",
      value === 1 ? setCalenderDDL : setCalenderRoasterDDL
    );
  };

  const saveHandler = (values, cb) => {
    if (values?.calenderType?.value === 2) {
      if (!values?.nextChangeDate)
        return toast.warn("Next change date is required");
      if (!values?.startingCalender)
        return toast.warn("Starting calender is required");
    }

    const modifyFilterRowDto =
      singleData.length > 0
        ? singleData
        : checked.filter((itm) => itm.isSelected === true);
    setRowDto(rowDto?.map((item) => ({ ...item, isSelected: false })));
    // const payload = modifyFilterRowDto.map((item) => {
    //   return {
    //     employeeId: item?.employeeId,
    //     generateStartDate: values?.generateDate,
    //     IntCreatedBy: employeeId,
    //     runningCalendarId:
    //       values?.calenderType?.value === 2
    //         ? values?.startingCalender?.value
    //         : values?.calender?.value,
    //     nextChangeDate: values?.nextChangeDate || null,
    //     calendarType: values?.calenderType?.label,
    //     rosterGroupId:
    //       values?.calenderType?.value === 2 ? values?.calender?.value : 0,
    //     isAutoGenerate: false,
    //   };
    // });
    const empIdList = modifyFilterRowDto.map((data) => {
      return data?.employeeId;
    });
    const payload = {
      employeeList: isAssignAll ? empIDString : empIdList.join(","),
      generateStartDate: values?.generateDate,
      intCreatedBy: employeeId,
      runningCalendarId:
        values?.calenderType?.value === 2
          ? values?.startingCalender?.value
          : values?.calender?.value,
      nextChangeDate: values?.nextChangeDate || null,
      calendarType: values?.calenderType?.label,
      rosterGroupId:
        values?.calenderType?.value === 2 ? values?.calender?.value : 0,
      generateEndDate: null,
      isAutoGenerate: false,
    };
    rosterGenerateAction(payload, setLoading, cb);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (
            values?.calenderType?.value === 2 &&
            !values?.startingCalender?.label
          )
            return toast.warning("Starting calender is required");
          saveHandler(values, () => {
            setIsAssignAll(false);
            setChecked([]);
            setSingleData([]);
            getData([]);
            onHide();
            setFieldValueParent("search", "");
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
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <Modal.Title className="text-center">
                          {title}
                        </Modal.Title>
                        <div>
                          <IconButton
                            onClick={() => {
                              onHide();
                              getData(checked);
                            }}
                          >
                            <Close />
                          </IconButton>
                        </div>
                      </div>
                    </Modal.Header>
                  )}

                  <Modal.Body id="example-modal-sizes-title-xl">
                    <div className="businessUnitModal">
                      <div className="modalBody p-0">
                        <div className="row mx-0">
                          <div className="col-12">
                            <label>Generate Date</label>
                            <FormikInput
                              classes="input-sm"
                              type="date"
                              // label="Generate Date"
                              value={values?.generateDate}
                              name="generateDate"
                              onChange={(e) => {
                                setFieldValue("generateDate", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="row mx-0">
                          <div className="col-12">
                            <label>Calendar Type</label>
                            <FormikSelect
                              name="calenderType"
                              options={[
                                {
                                  value: 1,
                                  label: "Calendar",
                                },
                                { value: 2, label: "Roster" },
                              ]}
                              value={values?.calenderType}
                              onChange={(valueOption) => {
                                getDDL(valueOption?.value);
                                setFieldValue("calender", "");
                                setFieldValue("startingCalender", "");
                                setFieldValue("nextChangeDate", "");
                                setFieldValue("calenderType", valueOption);
                              }}
                              placeholder="Calendar Type"
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                              isDisabled={false}
                            />
                          </div>
                        </div>
                        <div className="row mx-0">
                          <div className="col-12">
                            <label>
                              {values?.calenderType?.value === 2
                                ? `Roster Name`
                                : `Calendar Name`}
                            </label>
                            <FormikSelect
                              name="calender"
                              options={
                                values?.calenderType?.value === 2
                                  ? calenderRoasterDDL
                                  : calenderDDL
                              }
                              value={values?.calender}
                              onChange={(valueOption) => {
                                setFieldValue("calender", valueOption);
                                if (values?.calenderType?.value === 2) {
                                  getPeopleDeskAllDDL(
                                    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=CalenderByRosterGroup&intId=${valueOption?.value}&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}`,
                                    "CalenderId",
                                    "CalenderName",
                                    setStartingCalenderDDL
                                  );
                                }
                              }}
                              placeholder={
                                values?.calenderType?.value === 2
                                  ? `Roster Name`
                                  : `Calendar Name`
                              }
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                              isDisabled={!values?.calenderType}
                            />
                          </div>
                        </div>
                        {values?.calenderType?.value === 2 && (
                          <>
                            <div className="row mx-0">
                              <div className="col-12">
                                <label>Starting Calendar</label>
                                <FormikSelect
                                  name="startingCalender"
                                  options={startingCalenderDDL || []}
                                  value={values?.startingCalender}
                                  onChange={(valueOption) => {
                                    setFieldValue(
                                      "startingCalender",
                                      valueOption
                                    );
                                  }}
                                  placeholder="Starting Calender"
                                  styles={customStyles}
                                  errors={errors}
                                  touched={touched}
                                  isDisabled={false}
                                />
                              </div>
                            </div>
                            <div className="row mx-0">
                              <div className="col-12">
                                <label>Next Calendar Change</label>
                                <FormikInput
                                  classes="input-sm"
                                  type="date"
                                  label=""
                                  value={values?.nextChangeDate}
                                  name="nextChangeDate"
                                  onChange={(e) => {
                                    setFieldValue(
                                      "nextChangeDate",
                                      e.target.value
                                    );
                                  }}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Modal.Body>
                  {loading && <Loading />}
                  <Modal.Footer className="form-modal-footer">
                    <div className="master-filter-btn-group">
                      <button
                        type="button"
                        className="btn btn-cancel"
                        style={{
                          marginRight: "15px",
                        }}
                        onClick={() => {
                          onHide();
                          resetForm(initData);
                          getData(checked);
                          setFieldValueParent("search", "");
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
                    </div>
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
