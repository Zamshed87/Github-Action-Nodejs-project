/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutline, Edit, EditOutlined } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import BackButton from "../../../../../common/BackButton";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import FormikTextArea from "../../../../../common/FormikTextArea";
import IConfirmModal from "../../../../../common/IConfirmModal";
import Loading from "../../../../../common/loading/Loading";
import SortingIcon from "../../../../../common/SortingIcon";
import { gray900, greenColor } from "../../../../../utility/customColor";
import { dateFormatterForInput } from "../../../../../utility/dateFormatter";
import { createTimeSheetAction } from "../../../helper";
import { getHolidaySetupLanding } from "../helper";
import FormikInput from "./../../../../../common/FormikInput";
import NoResult from "./../../../../../common/NoResult";
import ViewModal from "./../../../../../common/ViewModal";
import { dateFormatter } from "./../../../../../utility/dateFormatter";
import { todayDate } from "./../../../../../utility/todayDate";
import HolidayGroupModal from "./../addEditForm/index";
import "./styles.css";

const initData = {
  fromDate: "",
  toDate: "",
  description: "",
  isConfirm: false,
};

const validationSchema = Yup.object({
  fromDate: Yup.string().required("Form date is required"),
  toDate: Yup.string().required("To date is required"),
  description: Yup.string().required("Description is required"),
});

export default function UnderCreateHolidaySetup() {
  const params = useParams();

  // modal
  const [isHolidayGroup, setIsHolidayGroup] = useState(false);

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [holidayList, setHolidayList] = useState([]);
  const [allHolidayList, setAllHolidayList] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [holidayId, setHolidayId] = useState("");
  const [holidaySingleData, setHolidaySingleData] = useState("");

  const { orgId, buId, employeeId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    if (params?.id) {
      getHolidaySetupLanding(
        "HolidayGroupById",
        orgId,
        buId,
        params?.id,
        setSingleData,
        null,
        null,
        wId,

      );
    }
  }, [orgId, buId, params?.id]);

  useEffect(() => {
    if (params?.id) {
      getHolidaySetupLanding(
        "HolidayByHolidayGroupId",
        orgId,
        buId,
        params?.id,
        setHolidayList,
        setAllHolidayList,
        setLoading,
        wId
      );
    }
  }, [orgId, buId, params?.id]);

  const saveHandler = (values, cb) => {
    let payload = {
      partType: "Holiday",
      employeeId: employeeId,
      autoId: holidayId ? holidayId : 0,
      value: "",
      IntCreatedBy: employeeId,
      isActive: true,
      businessUnitId: buId,
      accountId: orgId,
      holidayGroupName: singleData[0]?.HolidayGroupName || "",
      year: singleData[0]?.Year || 0,
      holidayGroupId: singleData[0]?.HolidayGroupId || 0,
      holidayName: values?.description || "",
      fromDate: values?.fromDate || todayDate(),
      toDate: values?.toDate || todayDate(),
      totalDays: 0,
      calenderCode: "",
      calendarName: "",
      startTime: "00:00:00",
      extendedStartTime: "00:00:00",
      lastStartTime: "00:00:00",
      endTime: "00:00:00",
      minWorkHour: 0,
      isConfirm: values?.isConfirm || false,
      exceptionOffdayName: "",
      isAlternativeDay: true,
      exceptionOffdayGroupId: 0,
      weekOfMonth: "",
      weekOfMonthId: 0,
      daysOfWeek: "",
      daysOfWeekId: 0,
      remarks: "",
      rosterGroupName: "",
      workplaceId: 0,
      workplaceGroupId: 0,
      overtimeDate: todayDate(),
      overtimeHour: 0,
      reason: "",
      breakStartTime: "00:00:00",
      breakEndTime: "00:00:00",
    };
    if (holidayId) {
      const callback = () => {
        cb();
        getHolidaySetupLanding(
          "HolidayGroupById",
          orgId,
          buId,
          params?.id,
          setSingleData
        );
        getHolidaySetupLanding(
          "HolidayByHolidayGroupId",
          orgId,
          buId,
          params?.id,
          setHolidayList,
          setAllHolidayList,
          setLoading
        );
        getHolidaySetupLanding(
          "HolidayGroup",
          orgId,
          buId,
          "",
          setRowDto,
          setAllData,
          setLoading
        );
        setHolidaySingleData("");
        setHolidayId("");
      };
      createTimeSheetAction(payload, setLoading, callback);
    } else {
      const callback = () => {
        cb();
        getHolidaySetupLanding(
          "HolidayGroupById",
          orgId,
          buId,
          params?.id,
          setSingleData
        );
        getHolidaySetupLanding(
          "HolidayByHolidayGroupId",
          orgId,
          buId,
          params?.id,
          setHolidayList,
          setAllHolidayList,
          setLoading
        );
        getHolidaySetupLanding(
          "HolidayGroup",
          orgId,
          buId,
          "",
          setRowDto,
          setAllData,
          setLoading
        );
      };
      createTimeSheetAction(payload, setLoading, callback);
    }
  };

  const deleteHandler = (item) => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: "Are you sure, you want to delete this holiday item?",
      yesAlertFunc: () => {
        const payload = {
          partType: "Holiday",
          employeeId: employeeId,
          autoId: item?.HolidayId,
          value: "",
          IntCreatedBy: employeeId,
          isActive: false,
          businessUnitId: buId,
          accountId: orgId,
          holidayGroupName: singleData[0]?.HolidayGroupName || "",
          year: singleData[0]?.Year || 0,
          holidayGroupId: singleData[0]?.HolidayGroupId || 0,
          holidayName: item?.HolidayName || "",
          fromDate: item?.FromDate || todayDate(),
          toDate: item?.ToDate || todayDate(),
          totalDays: 0,
          calenderCode: "",
          calendarName: "",
          startTime: "00:00:00",
          extendedStartTime: "00:00:00",
          lastStartTime: "00:00:00",
          endTime: "00:00:00",
          minWorkHour: 0,
          isConfirm: item?.isConfirm || false,
          exceptionOffdayName: "",
          isAlternativeDay: true,
          exceptionOffdayGroupId: 0,
          weekOfMonth: "",
          weekOfMonthId: 0,
          daysOfWeek: "",
          daysOfWeekId: 0,
          remarks: "",
          rosterGroupName: "",
          workplaceId: 0,
          workplaceGroupId: 0,
          overtimeDate: todayDate(),
          overtimeHour: 0,
          reason: "",
          breakStartTime: "00:00:00",
          breakEndTime: "00:00:00",
        };

        const callback = () => {
          getHolidaySetupLanding(
            "HolidayGroup",
            orgId,
            buId,
            "",
            setRowDto,
            setAllData
          );
          getHolidaySetupLanding(
            "HolidayGroupById",
            orgId,
            buId,
            params?.id,
            setSingleData
          );
          getHolidaySetupLanding(
            "HolidayByHolidayGroupId",
            orgId,
            buId,
            params?.id,
            setHolidayList,
            setAllHolidayList,
            setLoading
          );
          getHolidaySetupLanding(
            "HolidayGroup",
            orgId,
            buId,
            "",
            setRowDto,
            setAllData,
            setLoading
          );
        };
        createTimeSheetAction(payload, setLoading, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const handleClose = () => {
    setIsHolidayGroup(false);
  };

  const [holidayOrder, setHolidayOrder] = useState("desc");

  // ascending & descending
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...holidayList];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setHolidayList(modifyRowData);
  };

  // const { permissionList } = useSelector(
  //   (state) => state?.auth,
  //   shallowEqual
  // );

  // let permission = null;
  // permissionList.forEach(item => {
  //   if (item?.menuReferenceId === 39) {
  //     permission = item;
  //   }
  // });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          fromDate: holidaySingleData
            ? dateFormatterForInput(holidaySingleData[0]?.FromDate)
            : "",
          toDate: holidaySingleData
            ? dateFormatterForInput(holidaySingleData[0]?.ToDate)
            : "",
          description: holidaySingleData
            ? holidaySingleData[0]?.HolidayName
            : "",
          isConfirm: holidaySingleData ? holidaySingleData[0]?.IsConfirm : "",
        }}
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
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="create-holiday-setup-main row">
                {/* {permission?.isEdit ? ( */}
                <div className="col-md-12">
                  <div className="container-holiday-setup">
                    <div className="header-holiday-setup">
                      <div className="header-left mt-3">
                        <BackButton />
                        <h4>
                          {singleData.length > 0 &&
                            singleData[0]?.HolidayGroupName}
                        </h4>
                        <div
                          className="border-icon holiday-icon-edit"
                          onClick={() => {
                            setIsHolidayGroup(true);
                          }}
                        >
                          <Edit sx={{ fontSize: "1rem" }} />
                        </div>
                      </div>
                      <div className="header-right"></div>
                    </div>
                    <div
                      className="body-holiday-setup"
                      style={{ marginTop: "-35px" }}
                    >
                      <div className="col-md-6 p-0">
                        <div
                          className="card-style"
                          style={{ padding: "12px !important" }}
                        >
                          {singleData && singleData[0]?.InsertDateTime && (
                            <div className="col-12 p-0">
                              <div className="input-field">
                                <label htmlFor="">From Date</label>
                                <FormikInput
                                  classes="input-sm"
                                  type="date"
                                  // label="From Date"
                                  value={values?.fromDate}
                                  name="fromDate"
                                  min={`${singleData[0]?.Year}-01-01`}
                                  onChange={(e) => {
                                    setFieldValue("toDate", e.target.value);
                                    setFieldValue("fromDate", e.target.value);
                                  }}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>
                          )}

                          {singleData && singleData[0]?.InsertDateTime && (
                            <div className="col-12 p-0">
                              <div className="input-field">
                                <label htmlFor="">To Date</label>
                                <FormikInput
                                  type="date"
                                  // label="To Date"
                                  classes="input-sm"
                                  value={values?.toDate}
                                  name="toDate"
                                  min={values?.fromDate}
                                  onChange={(e) => {
                                    setFieldValue("toDate", e.target.value);
                                  }}
                                  errors={errors}
                                  touched={touched}
                                  disabled={!values?.fromDate}
                                />
                              </div>
                            </div>
                          )}

                          <div className="col-12 p-0">
                            <div className="input-field description-field holiday-description">
                              <label htmlFor="">Description</label>
                              <FormikTextArea
                                classes="input-sm"
                                className="form-control"
                                // label="Description"
                                value={values?.description}
                                onChange={(e) => {
                                  setFieldValue("description", e.target.value);
                                }}
                                name="description"
                                type="text"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-12 p-0">
                            <div className="input-field depend-on-moon-field">
                              <FormikCheckBox
                                name="isConfirm"
                                styleObj={{
                                  color: gray900,
                                  checkedColor: greenColor,
                                }}
                                checked={values?.isConfirm}
                                onChange={(e) => {
                                  setFieldValue("isConfirm", e.target.checked);
                                }}
                                label="Depend on moon?"
                              />
                            </div>
                          </div>
                          <button type="submit" className="btn btn-green">
                            {holidayId ? "Update" : "Add"}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="table-holiday-setup-main">
                      <div className="heading-holiday-list">
                        <h4>Holiday list</h4>
                        <small> . </small>
                        <div className="table-list-item-amount">
                          {holidayList?.length > 0 ? (
                            <>Total result {holidayList?.length}</>
                          ) : (
                            <>Total result 0</>
                          )}
                        </div>
                      </div>
                      <div className="table-card-body">
                        <div className="table-card-styled tableOne">
                          {holidayList?.length > 0 ? (
                            <>
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th>
                                      <div
                                        className="sortable"
                                        onClick={() => {
                                          setHolidayOrder(
                                            holidayOrder === "desc"
                                              ? "asc"
                                              : "desc"
                                          );
                                          commonSortByFilter(
                                            holidayOrder,
                                            "HolidayName"
                                          );
                                        }}
                                      >
                                        <span>Description</span>
                                        <div>
                                          <SortingIcon
                                            viewOrder={holidayOrder}
                                          ></SortingIcon>
                                        </div>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="sortable justify-content-center">
                                        <span>From Date</span>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="sortable justify-content-center">
                                        <span>To Date</span>
                                      </div>
                                    </th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {holidayList?.map((item, index) => {
                                    return (
                                      <tr key={index}>
                                        <td>
                                          <div className="tableBody-title">
                                            {`${item?.HolidayName}`}
                                            {item?.IsConfirm && (
                                              <p
                                                style={{
                                                  color: "#F78C12",
                                                  fontSize: "20px",
                                                  display: "inline-block",
                                                  marginLeft: "2px",
                                                }}
                                              >
                                                *
                                              </p>
                                            )}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="content tableBody-title text-center">
                                            {dateFormatter(item?.FromDate)}
                                          </div>
                                        </td>
                                        <td
                                          style={{
                                            textAlign: "center",
                                          }}
                                        >
                                          <div className="content tableBody-title">
                                            {dateFormatter(item?.ToDate)}
                                          </div>
                                        </td>
                                        <td width="10%">
                                          <div className="d-flex">
                                            <button
                                              type="button"
                                              className="iconButton"
                                              onClick={() => {
                                                getHolidaySetupLanding(
                                                  "HolidayById",
                                                  orgId,
                                                  buId,
                                                  item?.HolidayId,
                                                  setHolidaySingleData
                                                );
                                                setHolidayId(item?.HolidayId);
                                              }}
                                            >
                                              <Tooltip title="Edit">
                                                <EditOutlined
                                                  sx={{
                                                    fontSize: "20px",
                                                  }}
                                                />
                                              </Tooltip>
                                            </button>
                                            <button
                                              type="button"
                                              className="iconButton"
                                              onClick={() => {
                                                deleteHandler(item);
                                              }}
                                            >
                                              <Tooltip title="Delete">
                                                <DeleteOutline
                                                  sx={{
                                                    fontSize: "20px",
                                                  }}
                                                />
                                              </Tooltip>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </>
                          ) : (
                            <>
                              {!loading && (
                                <NoResult title="No Result Found" para="" />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ) : (
                      <NotPermittedPage />
                    )} */}
              </div>

              {/* addEditForm */}
              <ViewModal
                show={isHolidayGroup}
                title={"Create Holiday Group Name"}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                classes="default-modal form-modal"
              >
                <HolidayGroupModal
                  onHide={handleClose}
                  setRowDto={setRowDto}
                  setAllData={setAllData}
                  setLoading={setLoading}
                  singleData={singleData}
                  setSingleData={setSingleData}
                  id={params?.id}
                />
              </ViewModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
