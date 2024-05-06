import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";

import { getPeopleDeskAllDDL } from "../../../../../common/api";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import FormikInput from "../../../../../common/FormikInput";
import { gray900, greenColor } from "../../../../../utility/customColor";
import { createTimeSheetActionForCalender } from "../../../helper";
import {
  getTimeSheetCalenderById,
  initData,
  onCreateCalendarSetupWithValidation,
  validationSchema,
} from "./helper";
import FormikSelect from "../../../../../common/FormikSelect";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { isUniq } from "../../../../../utility/uniqChecker";
import { IconButton, Tooltip } from "@mui/material";
import { DeleteOutline, InfoOutlined } from "@mui/icons-material";
import { calculateNextDate } from "utility/dateFormatter";
import { toast } from "react-toastify";
import moment from "moment";
const style = {
  width: "100%",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const CalendarSetupModal = ({
  onHide,
  singleData,
  setSingleData,
  setRowDto,
  id,
  setAllData,
  getLanding,
}) => {
  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // eslint-disable-next-line no-unused-vars
  const [, setLoading] = useState(false);

  const [modifySingleData, setModifySingleData] = useState("");
  const [workPlaceDDL, setWorkPlaceDDL] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [deleteRowData, setDeleteRowData] = useState([]);
  const [next3daysForEmp, setNext3daysForEmp] = useState(null);

  useEffect(() => {
    if (id) {
      getTimeSheetCalenderById(buId, id, setSingleData, setAllData, setLoading);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    if (singleData) {
      const newRowData = {
        calendarName: singleData?.strCalenderName,
        isLunchBreakAsWorkingHour:
          singleData?.isLunchBreakCalculateAsWorkingHour || false,
        startTime: singleData?.dteStartTime,
        endTime: singleData?.dteEndTime,
        minWork: singleData?.numMinWorkHour,
        lastStartTime: singleData?.dteLastStartTime,
        allowedStartTime: singleData?.dteExtendedStartTime,
        breakStartTime: singleData?.dteBreakStartTime || "",
        breakEndTime: singleData?.dteBreakEndTime || "",
        officeStartTime: singleData?.dteOfficeStartTime || "",
        officeCloseTime: singleData?.dteOfficeCloseTime || "",
        nightShift: singleData?.isNightShift || "",
        isEmployeeUpdate: true,
      };
      const tableData = singleData?.timeSheetCalenderRows?.map((item) => ({
        intCalenderRowId: item?.intCalenderRowId,
        intWorkplaceId: item?.intWorkplaceId,
        strWorkplace: item?.strWorkplaceName,
      }));
      id && setTableData(tableData);
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData, id]);
  // DDL
  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkPlaceDDL
    );
  }, [buId, wgId, employeeId]);

  // setter function
  const setter = (payload) => {
    if (isUniq("intWorkplaceId", payload?.intWorkplaceId, tableData)) {
      setTableData([...tableData, payload]);
    }
  };

  // row remover
  const remover = (payload) => {
    const filterArr = tableData.filter((itm) => itm.intWorkplaceId !== payload);
    setTableData(filterArr);
  };

  const deleteRow = (payload) => {
    const deleteRow = [];
    if (payload > 0) {
      const filterArr = tableData.filter(
        (itm) => itm.intWorkplaceId === payload
      );
      deleteRow.push(filterArr[0]);
    }

    setDeleteRowData([...deleteRow, ...deleteRowData]);
  };

  const saveHandler = (values, cb) => {
    onCreateCalendarSetupWithValidation(
      values,
      employeeId,
      orgId,
      buId,
      id,
      cb,
      onHide,
      getLanding,
      setRowDto,
      setAllData,
      createTimeSheetActionForCalender,
      setLoading,
      wgId,
      tableData,
      deleteRowData,
      setDeleteRowData
    );
  };

  const timesState = (current, comparer) => {
    const time1 = moment(current, "HH:mm:ss");
    const time2 = moment(comparer, "HH:mm:ss");

    // Compare the two times
    if (time1.isBefore(time2)) {
      return "before";
    } else if (time1.isAfter(time2)) {
      return "after";
    } else {
      return "equal";
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={id ? modifySingleData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          if (id && !values?.isEmployeeUpdate) {
            return toast.warn("Please select is Employee Update Checkbox");
          }
          if (
            id &&
            values?.isEmployeeUpdate &&
            (!values?.dteEmployeeUpdateFromDate ||
              !values?.dteEmployeeUpdateToDate)
          ) {
            return toast.warn(
              "Please select Employee Generate From Date and Employee Generate To Date"
            );
          }
          saveHandler(values, () => {
            if (id) {
              resetForm(modifySingleData);
            } else {
              resetForm(initData);
            }
          });
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Box sx={style} className="calenderSetupModal">
              <Form>
                <div className="modalBody p-0">
                  <div className="row mx-0">
                    <div className="col-6">
                      <label>Calendar Name </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.calendarName}
                        onChange={(e) =>
                          setFieldValue("calendarName", e.target.value)
                        }
                        name="calendarName"
                        type="text"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>Minimum Working Hour </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.minWork}
                        onChange={(e) =>
                          setFieldValue("minWork", e.target.value)
                        }
                        name="minWork"
                        type="number"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-12">
                      <FormikCheckBox
                        name="nightShift"
                        styleObj={{
                          color: greenColor,
                        }}
                        label="Is Night Shift?"
                        checked={values?.nightShift}
                        onChange={(e) => {
                          setFieldValue("nightShift", e.target.checked);
                        }}
                      />
                    </div>
                    <div className="col-6">
                      <label>Office Opening Time </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.officeStartTime}
                        onChange={(e) => {
                          setFieldValue("officeStartTime", e.target.value);
                        }}
                        name="officeStartTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>Office Closing Time </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.officeCloseTime}
                        onChange={(e) => {
                          if (values.nightShift) {
                          } else {
                            if (
                              timesState(
                                e.target.value,
                                values?.officeStartTime
                              ) === "after"
                            ) {
                              setFieldValue("officeCloseTime", e.target.value);
                            } else {
                              setFieldValue("officeCloseTime", "");
                              return toast.warning("Given time is not valid");
                            }
                          }
                        }}
                        name="officeCloseTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>Start Time </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.startTime}
                        onChange={(e) => {
                          if (values.nightShift) {
                          } else {
                            if (
                              (timesState(
                                e.target.value,
                                values?.officeStartTime
                              ) === "after" ||
                                timesState(
                                  e.target.value,
                                  values?.officeStartTime
                                ) === "equal") &&
                              timesState(
                                e.target.value,
                                values?.officeCloseTime
                              ) === "before"
                            ) {
                              setFieldValue("startTime", e.target.value);
                            } else {
                              setFieldValue("startTime", "");
                              return toast.warning("Given time is not valid");
                            }
                          }
                        }}
                        name="startTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>End Time </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.endTime}
                        onChange={(e) => {
                          if (values.nightShift) {
                          } else {
                            if (
                              timesState(e.target.value, values?.startTime) ===
                                "after" &&
                              (timesState(
                                e.target.value,
                                values?.officeCloseTime
                              ) === "before" ||
                                timesState(
                                  e.target.value,
                                  values?.officeCloseTime
                                ) === "equal")
                            ) {
                              setFieldValue("endTime", e.target.value);
                            } else {
                              setFieldValue("endTime", "");
                              return toast.warning("Given time is not valid");
                            }
                          }
                        }}
                        name="endTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>
                        Extended Start Time
                        <small>
                          <span>
                            {" "}
                            <InfoOutlined
                              sx={{
                                color: gray900,
                                fontSize: "12px",
                                marginLeft: "5px",
                              }}
                            />{" "}
                            Late punishment policy will be applicable after
                            crossing this time limit.
                          </span>
                        </small>
                      </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.allowedStartTime}
                        onChange={(e) => {
                          if (values.nightShift) {
                          } else {
                            if (
                              (timesState(e.target.value, values?.startTime) ===
                                "after" ||
                                timesState(
                                  e.target.value,
                                  values?.startTime
                                ) === "equal") &&
                              timesState(e.target.value, values?.endTime) ===
                                "before"
                            ) {
                              setFieldValue("allowedStartTime", e.target.value);
                            } else {
                              setFieldValue("allowedStartTime", "");
                              return toast.warning("Given time is not valid");
                            }
                          }
                        }}
                        name="allowedStartTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>
                        Last Start Time
                        <small>
                          {" "}
                          <span>
                            {" "}
                            <InfoOutlined
                              sx={{
                                color: gray900,
                                fontSize: "12px",
                                marginLeft: "5px",
                              }}
                            />{" "}
                            Absent punishment policy will be applicable after
                            crossing this time limit.
                          </span>
                        </small>
                      </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.lastStartTime}
                        onChange={(e) => {
                          if (values.nightShift) {
                          } else {
                            if (
                              (timesState(
                                e.target.value,
                                values?.allowedStartTime
                              ) === "after" ||
                                timesState(
                                  e.target.value,
                                  values?.allowedStartTime
                                ) === "equal") &&
                              timesState(e.target.value, values?.endTime) ===
                                "before"
                            ) {
                              setFieldValue("lastStartTime", e.target.value);
                            } else {
                              setFieldValue("lastStartTime", "");
                              return toast.warning("Given time is not valid");
                            }
                          }
                        }}
                        name="lastStartTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>
                        {values?.nightShift ? "Dinner" : "Lunch"} Start Time
                      </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.breakStartTime}
                        onChange={(e) => {
                          if (values.nightShift) {
                          } else {
                            if (
                              (timesState(e.target.value, values?.startTime) ===
                                "after" ||
                                timesState(
                                  e.target.value,
                                  values?.startTime
                                ) === "equal") &&
                              timesState(e.target.value, values?.endTime) ===
                                "before"
                            ) {
                              setFieldValue("breakStartTime", e.target.value);
                            } else {
                              setFieldValue("breakStartTime", "");
                              return toast.warning("Given time is not valid");
                            }
                          }
                        }}
                        name="breakStartTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>
                        {values?.nightShift ? "Dinner" : "Lunch"} End Time
                      </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.breakEndTime}
                        onChange={(e) => {
                          if (values.nightShift) {
                          } else {
                            if (
                              (timesState(e.target.value, values?.startTime) ===
                                "after" ||
                                timesState(
                                  e.target.value,
                                  values?.startTime
                                ) === "equal") &&
                              timesState(e.target.value, values?.endTime) ===
                                "before"
                            ) {
                              setFieldValue("breakEndTime", e.target.value);
                            } else {
                              setFieldValue("breakEndTime", "");
                              return toast.warning("Given time is not valid");
                            }
                          }
                        }}
                        name="breakEndTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-12">
                      <FormikCheckBox
                        name="isLunchBreakAsWorkingHour"
                        styleObj={{
                          color: greenColor,
                        }}
                        label="Is lunch break is calculated as working hour?"
                        checked={values?.isLunchBreakAsWorkingHour}
                        onChange={(e) => {
                          setFieldValue(
                            "isLunchBreakAsWorkingHour",
                            e.target.checked
                          );
                        }}
                      />
                    </div>
                    {singleData?.strCalenderName ? (
                      <div className="col-12">
                        <FormikCheckBox
                          name="isEmployeeUpdate"
                          styleObj={{
                            color: greenColor,
                          }}
                          label={
                            <span>
                              Sync Employee Attendance Data{" "}
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          checked={values?.isEmployeeUpdate}
                          onChange={(e) => {
                            setFieldValue("isEmployeeUpdate", e.target.checked);
                          }}
                        />
                      </div>
                    ) : null}
                    {values?.isEmployeeUpdate ? (
                      <>
                        <div className="col-6 mt-3">
                          <label className="mr-2">
                            Employee Generate From Date
                          </label>
                          <FormikInput
                            classes="input-sm"
                            type="date"
                            value={values?.dteEmployeeUpdateFromDate}
                            name="dteEmployeeUpdateFromDate"
                            onChange={(e) => {
                              setFieldValue(
                                "dteEmployeeUpdateFromDate",
                                e.target.value
                              );
                              setNext3daysForEmp(
                                calculateNextDate(e?.target?.value, 35)
                              );
                              setFieldValue(
                                "dteEmployeeUpdateToDate",
                                e.target.value
                              );
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-6 mt-3">
                          <label className="mr-2">
                            Employee Generate To Date
                          </label>
                          <FormikInput
                            classes="input-sm"
                            type="date"
                            disabled={!values?.dteEmployeeUpdateFromDate}
                            min={values?.dteEmployeeUpdateFromDate}
                            max={next3daysForEmp}
                            value={values?.dteEmployeeUpdateToDate}
                            name="dteEmployeeUpdateToDate"
                            onChange={(e) => {
                              setFieldValue(
                                "dteEmployeeUpdateToDate",
                                e.target.value
                              );
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </>
                    ) : null}
                    <div className="col-6">
                      <label>Workplace </label>
                      <FormikSelect
                        name="year"
                        options={workPlaceDDL || []}
                        value={values?.workplace}
                        onChange={(valueOption) => {
                          setFieldValue("workplace", valueOption);
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={false}
                        menuPosition="fixed"
                      />
                    </div>
                    <div className="col-3 d-flex mt-4 ml-1 row">
                      <button
                        type="button"
                        className="btn btn-green btn-green-disable"
                        onClick={() => {
                          const obj = {
                            intWorkplaceId: values?.workplace?.value,
                            strWorkplace: values?.workplace?.label,
                          };
                          setter(obj);
                          setFieldValue("workplace", "");
                        }}
                        disabled={!values?.workplace}
                      >
                        Add
                      </button>
                    </div>

                    <div className="table-card-body pt-3">
                      <div
                        className=" table-card-styled tableOne"
                        style={{ padding: "0px 12px" }}
                      >
                        <table className="table align-middle">
                          <thead style={{ color: "#212529" }}>
                            <tr>
                              <th>
                                <div className="d-flex align-items-center">
                                  Workplace name
                                </div>
                              </th>
                              <th>
                                <div className="d-flex align-items-center justify-content-end">
                                  Action
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableData?.length > 0 && (
                              <>
                                {tableData.map((item, index) => {
                                  const { strWorkplace } = item;
                                  return (
                                    <tr key={index}>
                                      <td>{strWorkplace}</td>
                                      <td>
                                        <div className="d-flex align-items-end justify-content-end">
                                          <IconButton
                                            type="button"
                                            style={{
                                              height: "25px",
                                              width: "25px",
                                            }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              remover(item?.intWorkplaceId);
                                              deleteRow(item?.intWorkplaceId);
                                            }}
                                          >
                                            <Tooltip title="Delete">
                                              <DeleteOutline
                                                sx={{
                                                  height: "25px",
                                                  width: "25px",
                                                }}
                                              />
                                            </Tooltip>
                                          </IconButton>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer form-modal-footer">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => onHide()}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-green"
                    style={{ width: "auto" }}
                    onSubmit={() => handleSubmit()}
                    type="submit"
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

export default CalendarSetupModal;
