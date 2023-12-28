/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  getPeopleDeskAllDDL,
  getPeopleDeskAllLanding,
} from "../../../../../common/api";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import FormikInput from "../../../../../common/FormikInput";
import { greenColor } from "../../../../../utility/customColor";
import { createTimeSheetActionForCalender } from "../../../helper";
import {
  getTimeSheetCalenderById,
  onCreateCalendarSetupWithValidation,
} from "./helper";
import FormikSelect from "../../../../../common/FormikSelect";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { isUniq } from "../../../../../utility/uniqChecker";
import { IconButton, Tooltip } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
const style = {
  width: "100%",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const initData = {
  calendarName: "",
  startTime: "",
  endTime: "",
  minWork: "",
  lastStartTime: "",
  allowedStartTime: "",
  breakStartTime: "",
  breakEndTime: "",
  officeStartTime: "",
  officeCloseTime: "",
  nightShift: false,
};

const validationSchema = Yup.object({
  calendarName: Yup.string().required("Calendar Name is required"),
  startTime: Yup.string().required("Start Time is required"),
  endTime: Yup.string().required("End Time is required"),
  minWork: Yup.number()
    .min(0, "Min Working is invalid")
    .required("Min Working is required"),
  lastStartTime: Yup.string().required("Last Start Time is required"),
  allowedStartTime: Yup.string().required("Allowed Start Time is required"),
  officeStartTime: Yup.string().required("Office Open Time is required"),
  officeCloseTime: Yup.string().required("Office Close Time is required"),
});

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
  const [loading, setLoading] = useState(false);

  const [modifySingleData, setModifySingleData] = useState("");
  const [workPlaceDDL, setWorkPlaceDDL] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [deleteRowData, setDeleteRowData] = useState([]);

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
    let deleteRow = [];
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
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={id ? modifySingleData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (id) {
              resetForm(modifySingleData);
            } else {
              resetForm(initData);
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
                      <label>Start Time </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.startTime}
                        onChange={(e) => {
                          setFieldValue("startTime", e.target.value);
                          // if (singleData?.length > 0) {
                          //   let duration = parseInt(format_ms(moment.duration(values?.endTime) - moment.duration(values?.startTime)))
                          //   if (duration > 12) {
                          //     setFieldValue('minWork', duration - 12)

                          //   } else {
                          //     setFieldValue('minWork', duration)

                          //   }
                          // }
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
                      <label>Extended Start Time </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.allowedStartTime}
                        onChange={(e) => {
                          setFieldValue("allowedStartTime", e.target.value);
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
                      <label>Last Start Time </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.lastStartTime}
                        onChange={(e) =>
                          setFieldValue("lastStartTime", e.target.value)
                        }
                        name="lastStartTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>Break Start Time</label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.breakStartTime}
                        onChange={(e) =>
                          setFieldValue("breakStartTime", e.target.value)
                        }
                        name="breakStartTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>Break End Time</label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.breakEndTime}
                        onChange={(e) =>
                          setFieldValue("breakEndTime", e.target.value)
                        }
                        name="breakEndTime"
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
                          setFieldValue("endTime", e.target.value);
                          // if (singleData?.length > 0) {
                          //   let duration = parseInt(format_ms(moment.duration(values?.endTime) - moment.duration(values?.startTime)))
                          //   if (duration > 12) {
                          //     setFieldValue('minWork', duration - 12)

                          //   } else {
                          //     setFieldValue('minWork', duration)

                          //   }
                          // }
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
                      <label>Office Closing Time </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.officeCloseTime}
                        onChange={(e) => {
                          setFieldValue("officeCloseTime", e.target.value);
                        }}
                        name="officeCloseTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-12">
                      <hr
                        style={{
                          borderTop: "1px solid #ccc",
                          margin: "10px 0",
                        }}
                      />
                    </div>
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
                    <div className="col-3 mt-3">
                      <FormikCheckBox
                        name="nightShift"
                        styleObj={{
                          color: greenColor,
                        }}
                        label="Is Night Shift"
                        checked={values?.nightShift}
                        onChange={(e) => {
                          setFieldValue("nightShift", e.target.checked);
                        }}
                      />
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
