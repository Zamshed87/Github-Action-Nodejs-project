/* eslint-disable react-hooks/exhaustive-deps */
import { Edit } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { getPeopleDeskAllLanding } from "../../../../../common/api";
import BackButton from "../../../../../common/BackButton";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "../../../../../common/FormikSelect";
import Loading from "../../../../../common/loading/Loading";
import PrimaryButton from "../../../../../common/PrimaryButton";
import SortingIcon from "../../../../../common/SortingIcon";
import ViewModal from "../../../../../common/ViewModal";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { isUniq } from "../../../../../utility/uniqChecker";
import { createTimeSheetAction } from "../../../helper";
import { weekdayDDL } from "../../outsideDuty/helper";
import RosterSetupCreate from "../addEditForm";
import "./styles.css";
const initData = {
  calendarName: "",
  noOfChangeDays: "",
  nextCalendar: "",
};

export default function UnderCreateOffdaySetup() {
  // hooks
  const params = useParams();

  // redux
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [isRosterSetup, setIsRosterSetup] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  const saveHandler = (values, cb) => {
    if (rowDto?.length < 1) return toast.warn("Please add offday calender");

    const firstRowCalId = rowDto[0]?.calendarId;
    const lastRowNextCalId = rowDto[rowDto?.length - 1]?.nextCalenderId;

    // firstRowCalId and lastRowNextCalId should be equal
    if (firstRowCalId !== lastRowNextCalId) return toast.warn("Invalid circle");

    const payload = {
      partType: "Offday",
      timeSheetOffdayJsons: [...rowDto],
    };

    createTimeSheetAction(payload, setLoading, cb);
  };

  const setter = (values, setFieldValue) => {
    // offdayId means edit, user must clear all row data for editing
    // if (rowDto[0]?.offdayId)
    //   return toast.warn("Please clear data , then add again");

    if (values?.noOfChangeDays <= 0) {
      return toast.warn("No. of change days should be grater than 0");
    }
    if (values?.noOfChangeDays >= 7) {
      return toast.warn("No. of change days should be less than 7");
    }

    const payload = {
      offdayGroupId: +params?.id,
      weekdayId: +values?.calendarName?.value,
      weekdayName: values?.calendarName?.label,
      noOfDaysChange: +values?.noOfChangeDays,
      nextWeekdayId: +values?.nextCalendar?.value,
      nextWeekdayName: values?.nextCalendar?.label,
      intCreatedBy: employeeId,
    };

    if (isUniq("weekdayId", payload?.weekdayId, rowDto)) {
      setRowDto([...rowDto, payload]);
      setFieldValue("calendarName", "");
      setFieldValue("noOfChangeDays", "");
      setFieldValue("nextCalendar", "");
    }
  };

  const filterCalenderListFunc = () => {
    // let filterCalenderList = weekdayDDL?.filter(
    //   (item) => item?.value !== values?.calendarName?.value
    // );
    const filterCalenderList = [...weekdayDDL];
    return filterCalenderList;
  };

  const getData = () => {
    getPeopleDeskAllLanding(
      "OffdayByOffdayGroupId",
      orgId,
      buId,
      params?.id,
      null,
      setRowDto
    );
  };

  useEffect(() => {
    getData();
  }, [orgId, buId, params]);

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
  // })

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            // don't reset form, not use ful for the purpose
            resetForm(initData);
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
                              <label>Offday</label>
                              <FormikSelect
                                name="calendarName"
                                options={weekdayDDL}
                                value={values?.calendarName}
                                onChange={(valueOption) => {
                                  setFieldValue("nextCalendar", "");
                                  setFieldValue("calendarName", valueOption);
                                }}
                                placeholder=" "
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                                // offdayId means edit, if edit, don't need to disabled this
                                // isDisabled={
                                //   rowDto[0]?.offdayId
                                //     ? false
                                //     : rowDto?.length > 0
                                // }
                              />
                            </div>
                          </div>
                          <div className="col-12 p-0">
                            <div className="input-field">
                              <label>No. of change days </label>
                              <FormikInput
                                classes="input-sm"
                                label=" "
                                value={values?.noOfChangeDays}
                                name="noOfChangeDays"
                                type="number"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue(
                                    "noOfChangeDays",
                                    e.target.value
                                  );
                                }}
                                errors={errors}
                                touched={touched}
                                min={1}
                                max={6}
                              />
                            </div>
                          </div>
                          <div className="col-12 p-0">
                            <div className="input-field">
                              <label>Next Offday</label>
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
                              setter(values, setFieldValue);
                              // setFieldValue(
                              //   "calendarName",
                              //   values?.nextCalendar
                              // );
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
                          <h4>Offday Cycle</h4>
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
                                        "weekdayName"
                                      );
                                    }}
                                  >
                                    <span>Offday</span>
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
                                <th>Next Offday</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.length > 0 &&
                                rowDto?.map((item, index) => (
                                  <tr key={index}>
                                    <td>
                                      <div className="content tableBody-title">
                                        {item?.weekdayName}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="content tableBody-title text-center">
                                        {item?.noOfDaysChange}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="content tableBody-title text-start">
                                        {item?.nextWeekdayName}
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
