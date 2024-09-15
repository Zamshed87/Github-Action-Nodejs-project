/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import {
  getPeopleDeskAllDDL,
  getPeopleDeskAllLanding,
} from "../../../../../common/api";
import BackButton from "../../../../../common/BackButton";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "../../../../../common/FormikSelect";
import Loading from "../../../../../common/loading/Loading";
import PrimaryButton from "../../../../../common/PrimaryButton";
import SortingIcon from "../../../../../common/SortingIcon";
import ViewModal from "../../../../../common/ViewModal";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { createTimeSheetAction } from "../../../helper";
import RosterSetupCreate from "../addEditForm";
import "./styles.css";
const initData = {
  calendarName: "",
  noOfChangeDays: "",
  nextCalendar: "",
};

export default function UnderCreateRosterSetup() {
  const history = useHistory();
  const params = useParams();
  const location = useLocation();

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [calendarDDL, setCalendarDDL] = useState([]);

  const [isRosterSetup, setIsRosterSetup] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  const saveHandler = (values, cb) => {
    if (rowDto?.length < 2)
      return toast.warn("Please add atleast two calender");

    const firstRowCalId = rowDto[0]?.calendarId;
    const lastRowNextCalId = rowDto[rowDto?.length - 1]?.nextCalenderId;

    // firstRowCalId and lastRowNextCalId should be equal
    if (firstRowCalId !== lastRowNextCalId) return toast.warn("Invalid circle");
    const temp = rowDto?.map((item) => {
      return {
        calenderName: item?.calendarName || item?.calenderName,
        rosterGroupId: item?.rosterGroupId,
        calendarId: +item?.calendarId,
        noOfDaysChange: item?.noOfDaysChange,
        nextCalenderId: +item?.nextCalenderId,
        nextCalendarName: item?.nextCalendarName,
        IntCreatedBy: item?.insertByUserId || employeeId,
      };
    });
    const payload = {
      partType: "Roster",
      businessUnitId: buId,
      timeSheetRosterJsons: [...temp],
    };
    // if(params?.id){
    //   let payload = {
    //     partType: "Roster",
    //     businessUnitId: buId,
    //     timeSheetRosterJsons: [...rowDto],

    //   };

    createTimeSheetAction(payload, setLoading, cb);
  };
  const setter = (values) => {
    // rosterGroup id means edit, user must clear all row data for editing
    if (rowDto?.[0]?.rosterId) {
      return toast.warn("Please clear data , then add again");
    }
    if (values?.noOfChangeDays < 0) {
      return toast.warn("No. of change days must be positive");
    }
    const payload = {
      // =======
      calenderName: values?.calendarName?.label,
      rosterGroupId: +params?.id,
      calendarId: +values?.calendarName?.value,
      noOfDaysChange: values?.noOfChangeDays,
      nextCalenderId: +values?.nextCalendar?.value,
      nextCalendarName: values?.nextCalendar?.label,
      IntCreatedBy: employeeId,
    };

    // if (params?.id) {
    //   console.log({ params });
    //   let temp = rowDto?.map((item) => {
    //     return {
    //       calenderName: item?.calendarName || values?.calendarName?.label,
    //       rosterGroupId: item?.rosterGroupId,
    //       calendarId: +item?.calendarId,
    //       noOfDaysChange: item?.noOfDaysChange
    //         ? item?.noOfDaysChange
    //         : values?.noOfChangeDays,
    //       nextCalenderId: +item?.nextCalenderId,
    //       nextCalendarName: item?.nextCalendarName,
    //       IntCreatedBy: item?.insertByUserId
    //         ? item?.insertByUserId
    //         : employeeId,
    //     };
    //   });
    //   console.log({ temp });
    //   setRowDto([...temp, payload]);
    // } else {
    setRowDto([...rowDto, payload]);
    // }
  };

  const filterCalenderListFunc = (values) => {
    const filterCalenderList = calendarDDL?.filter(
      (item) => item?.value !== values?.calendarName?.value
    );
    return filterCalenderList;
  };

  const getData = () => {
    getPeopleDeskAllLanding(
      "RosterByRosterGroupId",
      orgId,
      buId,
      params?.id,
      null,
      setRowDto,
      null,
      null,
      null,
      wgId,
      wId
    );
  };

  useEffect(() => {
    getData();
  }, [orgId, buId, params, wgId]);

  useEffect(() => {
    if (location?.state !== wgId) {
      history.push(`/administration/timeManagement/rosterSetup`);
    }
  }, [wgId]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Calender&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}`,
      "CalenderId",
      "CalenderName",
      setCalendarDDL
    );
  }, [orgId, buId, wgId, wId]);
  // for sorting the row
  const [calendarOrder, setCalendarOrder] = useState("desc");
  const commonSortByFilter = (filterType, property) => {
    filterType === "asc"
      ? setRowDto((prev) => [
          ...prev?.sort((a, b) => (a[property] > b[property] ? -1 : 1)),
        ])
      : setRowDto((prev) => [
          ...prev?.sort((a, b) => (b[property] > a[property] ? -1 : 1)),
        ]);
  };
  // const {permissionList} = useSelector(
  //   (state) => state?.auth,
  //   shallowEqual
  // );

  // let permission = null;
  // permissionList.forEach(item => {
  //   if(item?.menuReferenceId === 42){
  //     permission = item;
  //   }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {
          saveHandler(values, () => {
            // don't reset form, not use ful for the purpose
            // resetForm(initData);
            history.push(`/administration/timeManagement/rosterSetup`);
          });
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}

              <div className="UnderCreateRosterSetup row">
                {/* {permission?.isEdit ? ( */}
                <div className="col-md-12">
                  <div className="container-UnderCreateRosterSetup">
                    <div className="header-UnderCreateRosterSetup mt-5">
                      <div className="header-left">
                        <BackButton />
                        <h4>{params?.rosterName}</h4>
                        <button
                          type="button"
                          onClick={() => setIsRosterSetup(true)}
                          className="border-icon holiday-icon-edit"
                        >
                          <Edit sx={{ fontSize: "1rem" }} />
                        </button>
                      </div>
                      <div>
                        <PrimaryButton
                          type="submit"
                          className="btn btn-green btn-green-disable"
                          label="Save"
                        />
                      </div>
                    </div>
                    <div
                      className="body-UnderCreateRosterSetup"
                      style={{ marginTop: "-25px" }}
                    >
                      <div className="col-md-6 p-0">
                        <div
                          className="card-style"
                          style={{ padding: "4px 12px 12px" }}
                        >
                          <div className="col-12 p-0">
                            <div className="input-field">
                              <label htmlFor="">Calendar </label>
                              <FormikSelect
                                name="calendarName"
                                options={calendarDDL}
                                value={values?.calendarName}
                                onChange={(valueOption) => {
                                  setFieldValue("nextCalendar", "");
                                  setFieldValue("calendarName", valueOption);
                                }}
                                placeholder=" "
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                                // roster id means edit, if edit, don't need to disabled this
                                isDisabled={
                                  rowDto?.[0]?.rosterId
                                    ? false
                                    : rowDto?.length > 0
                                }
                              />
                            </div>
                          </div>
                          <div className="col-12 p-0">
                            <div className="input-field">
                              <label htmlFor="">No. of change days </label>
                              <FormikInput
                                classes="input-sm"
                                label=" "
                                value={values?.noOfChangeDays}
                                name="noOfChangeDays"
                                type="number"
                                min={0}
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue(
                                    "noOfChangeDays",
                                    e.target.value
                                  );
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-12 p-0">
                            <div className="input-field">
                              <label htmlFor="">Next Calendar</label>
                              <FormikSelect
                                name="nextCalendar"
                                options={filterCalenderListFunc(values)}
                                value={values?.nextCalendar}
                                onChange={(valueOption) => {
                                  setFieldValue("nextCalendar", valueOption);
                                }}
                                placeholder=" "
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setter(values);
                              setFieldValue(
                                "calendarName",
                                values?.nextCalendar
                              );
                              setFieldValue("nextCalendar", "");
                            }}
                            disabled={
                              !values?.noOfChangeDays ||
                              !values?.nextCalendar ||
                              !values?.calendarName
                            }
                            type="button"
                            className="btn btn-green"
                            style={{ marginTop: "12px" }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="table-UnderCreateRosterSetup-main">
                      <div className="d-flex justify-content-between align-items-center">
                        <div
                          className="d-flex align-items-end justify-content-end"
                          style={{ margin: "12px 0px" }}
                        >
                          <h4>Roster Cycle</h4>
                        </div>
                        <div>
                          <PrimaryButton
                            type="button"
                            className="btn btn-green btn-green-disable"
                            label="Clear"
                            onClick={() => setRowDto([])}
                          />
                        </div>
                      </div>

                      <div className="table-card-body">
                        <div className="table-card-styled tableOne">
                          <table className="table">
                            <thead style={{ color: "#212529" }}>
                              <tr>
                                <th>
                                  <div
                                    className="sortable"
                                    onClick={() => {
                                      setCalendarOrder((prev) =>
                                        prev === "desc" ? "asc" : "desc"
                                      );
                                      commonSortByFilter(
                                        calendarOrder,
                                        "calenderName"
                                      );
                                    }}
                                  >
                                    <span>Calendar</span>
                                    <div>
                                      <SortingIcon
                                        viewOrder={calendarOrder}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                                <th className="text-center">
                                  No. of change days
                                </th>
                                <th>Next Calendar</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.length > 0 &&
                                rowDto?.map((item, index) => (
                                  <tr key={index}>
                                    <td>
                                      <div className="content tableBody-title">
                                        {item?.calenderName}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="content tableBody-title text-center">
                                        {item?.noOfDaysChange}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="content tableBody-title text-start">
                                        {item?.nextCalendarName}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ) : (
                      <NotPermittedPage />
                    )} */}
              </div>
            </Form>
          </>
        )}
      </Formik>

      <ViewModal
        show={isRosterSetup}
        title={"Edit Roster Setup"}
        onHide={() => setIsRosterSetup(false)}
        size="lg"
        backdrop="static"
        classes="default-modal form-modal"
      >
        <RosterSetupCreate
          id={params?.id}
          rosterName={params?.rosterName}
          setIsRosterSetup={setIsRosterSetup}
          // getData={getData}
        />
      </ViewModal>
    </>
  );
}
