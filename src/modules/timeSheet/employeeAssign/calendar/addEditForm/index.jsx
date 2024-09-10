import { Close, DeleteOutline } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
import { monthLastDate } from "utility/dateFormatter";
import { isUniq } from "utility/uniqChecker";
import { Tag } from "antd";
import { useApiRequest } from "Hooks";
import IConfirmModal from "common/IConfirmModal";
import { is } from "date-fns/locale";

const ifPrevousDateSelected = (date) => {
  const selectedDate = new Date(date);
  const currentDate = new Date();
  const selectedMonth = selectedDate.getMonth(); // getMonth() returns month index (0-11)
  const currentMonth = currentDate.getMonth();
  const selectedYear = selectedDate.getFullYear();
  const currentYear = currentDate.getFullYear();
  if (
    selectedYear < currentYear ||
    (selectedYear === currentYear && selectedMonth < currentMonth)
  ) {
    return true;
  }
  return false;
};

const initData = {
  generateDate: todayDate(),
  generateEndDate: monthLastDate(),
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
  // calender: Yup.object()
  //   .shape({
  //     label: Yup.string().required("Calendar is required"),
  //     value: Yup.string().required("Calendar is required"),
  //   })
  //   .typeError("Calendar is required"),
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

  const { orgId, buId, employeeId, wgId, wId, intAccountId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [calenderDDL, setCalenderDDL] = useState([]);
  const [calenderRoasterDDL, setCalenderRoasterDDL] = useState([]);
  const [startingCalenderDDL, setStartingCalenderDDL] = useState([]);
  const [isPrevousDate, setIsPrevousDate] = useState(false);
  const [tableData, setTableData] = useState([]);

  const getDDL = (value) => {
    const ddlType = value === 1 ? "Calender" : "RosterGroup";
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=${ddlType}&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}`,
      value === 1 ? "CalenderId" : "RosterGroupId",
      value === 1 ? "CalenderName" : "RosterGroupName",
      value === 1 ? setCalenderDDL : setCalenderRoasterDDL
    );
  };

  const setter = (payload) => {
    if (isUniq("intCalendarId", payload?.intCalendarId, tableData)) {
      setTableData([...tableData, payload]);
    }
  };

  const remover = (payload) => {
    const filterArr = tableData.filter((itm) => itm.intCalendarId !== payload);
    setTableData(filterArr);
  };

  const saveHandler = (values, cb) => {
    if (values?.calenderType?.value === 1 && tableData.length === 0)
      return toast.warn("Please add calendar");

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
    const empIdList = modifyFilterRowDto.map((data) => {
      return data?.employeeId;
    });
    const payload = {
      employeeList: isAssignAll ? empIDString : empIdList.join(","),
      generateStartDate: values?.generateDate,
      intCreatedBy: employeeId,
      // runningCalendarId:
      //   values?.calenderType?.value === 2
      //     ? values?.startingCalender?.value
      //     : values?.calender?.value,
      // calendarType: values?.calenderType?.label,
      nextChangeDate: values?.nextChangeDate || null,
      // runningCalendarId: tableData?.[0]?.intCalendarId || 0,
      runningCalendarId:
        values?.calenderType?.value === 2
          ? values?.startingCalender?.value
          : tableData?.[0]?.intCalendarId,
      calendarType: values?.calenderType?.label || "",
      strCalendarName: tableData?.[0]?.strCalendarName || "",
      rosterGroupId:
        values?.calenderType?.value === 2 ? values?.calender?.value : 0,
      generateEndDate: values?.generateEndDate ? values?.generateEndDate : null,
      isAutoGenerate: false,
      // extendedEmployeeCalendarList: tableData.slice(1) || [],
      extendedEmployeeCalendarList: tableData,
    };
    if (
      values?.calenderType?.value === 1 &&
      orgId === 6 &&
      (checked?.length > 1 || isAssignAll)
    ) {
      demoPopup(() => {
        rosterGenerateAction(payload, setLoading, cb);
      });
    } else {
      rosterGenerateAction(payload, setLoading, cb);
    }
  };
  const CommonCalendarDDL = useApiRequest([]);
  const getCalendarDefault = () => {
    CommonCalendarDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "MultiCalendarByEmployeeIdDDL",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: checked[0]?.employeeId,
      },
      onSuccess: (res) => {
        // res.forEach((item, i) => {
        //   res[i].label = item?.strCalendarName;
        //   res[i].value = item?.intCalendarId;
        // });
        setTableData([
          {
            strCalendarName: checked[0]?.calendarName,
            intCalendarId: checked[0]?.calendarAssignId,
          },
          ...res,
        ]);
      },
    });
  };
  useEffect(() => {
    if (checked?.length === 1 && !isAssignAll && orgId === 6) {
      getCalendarDefault();
    }
  }, [checked, isAssignAll]);
  const demoPopup = (cb) => {
    const confirmObject = {
      closeOnClickOutside: false,
      message: `There might be multiple calendar assigned to these employees
Are you sure ? You want to assign Calendar again?
`,
      yesAlertFunc: () => {
        cb();
      },
      noAlertFunc: () => null,
    };
    IConfirmModal(confirmObject);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tableData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTableData(items);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
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
            setTableData([]);
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
                            <label>Generate From Date</label>
                            <FormikInput
                              classes="input-sm"
                              type="date"
                              // label="Generate Date"
                              value={values?.generateDate}
                              name="generateDate"
                              onChange={(e) => {
                                if (ifPrevousDateSelected(e.target.value)) {
                                  setIsPrevousDate(true);
                                } else {
                                  setIsPrevousDate(false);
                                }
                                setFieldValue("generateDate", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className={isPrevousDate ? "row mx-0" : "d-none"}>
                          <div className="col-12">
                            <label>Generate End Date</label>
                            <FormikInput
                              classes="input-sm"
                              type="date"
                              // label="Generate Date"
                              value={values?.generateEndDate}
                              name="generateEndDate"
                              onChange={(e) => {
                                setFieldValue(
                                  "generateEndDate",
                                  e.target.value
                                );
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
                          <div
                            className={`${
                              values?.calenderType?.value === 1
                                ? "col-6"
                                : "col-12"
                            }`}
                          >
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
                          {values?.calenderType?.value === 1 && (
                            <div
                              className="col-3 d-flex ml-1 row"
                              style={{ marginTop: "26px" }}
                            >
                              <button
                                type="button"
                                className="btn btn-green btn-green-disable"
                                onClick={() => {
                                  const obj = {
                                    intAutoId: 0,
                                    intEmployeeId: employeeId || 0,
                                    intCalendarId: values?.calender?.value || 0,
                                    strCalendarName:
                                      values?.calender?.label || "",
                                    isDefault: false,
                                  };

                                  if (intAccountId === 6) {
                                    if (tableData.length === 0) {
                                      obj.isDefault = true;
                                    }
                                    setter(obj);
                                  } else {
                                    const existingItems = tableData;
                                    if (existingItems.length === 0) {
                                      setter(obj);
                                    } else {
                                      toast.warn(
                                        "You are allowed to add only one calendar name."
                                      );
                                    }
                                  }

                                  setFieldValue("calender", "");
                                }}
                                disabled={!values?.calender}
                              >
                                Add
                              </button>
                            </div>
                          )}
                        </div>

                        {values?.calenderType?.value === 1 && (
                          <div className="table-card-body pt-3">
                            <div
                              className="table-card-styled tableOne"
                              style={{ padding: "0px 12px" }}
                            >
                              <table className="table align-middle">
                                <thead style={{ color: "#212529" }}>
                                  <tr>
                                    <th>
                                      <div className="d-flex align-items-center">
                                        Calendar name
                                      </div>
                                    </th>
                                    <th>
                                      <div className="d-flex align-items-center justify-content-end">
                                        Action
                                      </div>
                                    </th>
                                  </tr>
                                </thead>
                                <DragDropContext onDragEnd={handleOnDragEnd}>
                                  <Droppable droppableId="tableData">
                                    {(provided) => (
                                      <tbody
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                      >
                                        {tableData?.length > 0 &&
                                          tableData.map((item, index) => {
                                            const {
                                              strCalendarName,
                                              intCalendarId,
                                            } = item;

                                            return (
                                              <Draggable
                                                key={intCalendarId}
                                                draggableId={String(
                                                  intCalendarId
                                                )}
                                                index={index}
                                              >
                                                {(provided) => (
                                                  <tr
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                  >
                                                    <td>
                                                      {index === 0 ? (
                                                        <>
                                                          {strCalendarName}{" "}
                                                          <Tag
                                                            color="green"
                                                            style={{
                                                              borderRadius:
                                                                "16px",
                                                              padding: "0 8px",
                                                            }}
                                                          >
                                                            Default
                                                          </Tag>
                                                        </>
                                                      ) : (
                                                        strCalendarName
                                                      )}
                                                    </td>
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
                                                            remover(
                                                              intCalendarId
                                                            );
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
                                                )}
                                              </Draggable>
                                            );
                                          })}
                                        {provided.placeholder}
                                      </tbody>
                                    )}
                                  </Droppable>
                                </DragDropContext>
                              </table>
                            </div>
                          </div>
                        )}

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
                          setTableData([]);
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
