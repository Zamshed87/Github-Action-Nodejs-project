import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import BackButton from "../../../../common/BackButton";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { useFormik } from "formik";
import DefaultInput from "../../../../common/DefaultInput";
import { gray600, success500 } from "../../../../utility/customColor";
import { useEffect } from "react";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import axios from "axios";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import {
  dateFormatterForInput,
  lastDayOfMonth,
  monthFirstDate,
  monthLastDate,
} from "../../../../utility/dateFormatter";
import moment from "moment";

const AttendanceGenerateProcessForm = () => {
  const [lastDateOfMonth, setLastDateMonth] = React.useState("");
  const [, generateAttendanceProcessAPI, loadingProcess] = useAxiosPost();
  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();
  const { setFieldValue, values, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      filterFromDate: monthFirstDate(),
      filterToDate: monthLastDate(),
      userName: [],
    },
    onSubmit: (values) => {},
  });
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    const isAllExist = values?.userName?.some(
      (element) => element.level === "All" || element.value === 0
    );
    if (isAllExist) return [];
    return axios
      .get(
        `/Auth/GetUserList?businessUnitId=${buId}&workplaceGroupId=${wgId}&workplaceId=${wId}&Search=${v}`
      )
      .then((res) => {
        // add all at the position 0
        res?.data?.splice(0, 0, {
          value: 0,
          label: "All",
          name: "All",
        });
        return res?.data;
      })
      .catch((err) => []);
  };
  const autoGenerateProcessHandeler = (values) => {
    const isAllExist = values?.userName?.some(
      (element) => element.level === "All" || element.value === 0
    );
    const payload = {
      // intHeaderRequestId: 0,
      intAccountId: orgId,
      intBusinessUnitId: buId,
      dteFromDate: values?.filterFromDate,
      dteToDate: values?.filterToDate,
      intTotalEmployee: isAllExist ? 1 : values?.userName?.length,
      status: true,
      isAll: isAllExist ? true : false,
      isActive: true,
      // dteCreateDate: "2023-06-01T03:52:25.248Z",
      intCreateBy: employeeId,
      // dteUpdateDate: "2023-06-01T03:52:25.248Z",
      // intUpdateBy: 0,
      processRequestRowVMs: [
        // {
        //   // intRowRequestId: 0,
        //   // intHeaderRequestId: 0,
        //   intEmployeeId: 0,
        //   // isActive: true,
        //   // dteCreateDate: "2023-06-01T03:52:25.248Z",
        //   // intCreateBy: 0,
        //   // dteUpdateDate: "2023-06-01T03:52:25.248Z",
        //   // intUpdateBy: 0,
        // },
      ],
    };
    if (values?.userName?.length > 0 && !isAllExist) {
      values?.userName?.forEach((item) => {
        payload.processRequestRowVMs.push({
          intEmployeeId: item?.value,
        });
      });
    }
    generateAttendanceProcessAPI(
      `/TimeSheet/TimeAttendanceProcess`,
      payload,
      () => {},
      true
    );
  };
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, [dispatch]);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30374) {
      permission = item;
    }
  });
  return (
    <>
      <form onSubmit={handleSubmit}>
        {loadingProcess && <Loading />}
        {permission?.isCreate ? (
          <div className="table-card">
            <div className="table-card-heading">
              <div className="d-flex align-items-center">
                <BackButton />
                <h2>{`Attendance Auto Process Generate`}</h2>
              </div>
            </div>
            <div className="table-card-body">
              <div
                className="card-style"
                style={{ margin: "14px 0px 12px 0px" }}
              >
                <div className="row">
                  <div className="col-lg-12">
                    <div className="input-field-main">
                      <label>Employee Names</label>
                      <AsyncFormikSelect
                        styleMode="medium"
                        styles={{
                          ...customStyles,
                          control: (provided, state) => ({
                            ...provided,
                            minHeight: "auto!important",
                            height: "auto!important",
                            borderRadius: "4px",
                            boxShadow: `${success500}!important`,
                            ":hover": {
                              borderColor: `${gray600}!important`,
                            },
                            ":focus": {
                              borderColor: `${gray600}!important`,
                            },
                          }),
                          valueContainer: (provided, state) => ({
                            ...provided,
                            height: "auto!important",
                            padding: "0 0px",
                          }),
                          multiValue: (styles) => {
                            return {
                              ...styles,
                              position: "relative",
                              top: "-1px",
                            };
                          },
                          multiValueLabel: (styles) => ({
                            ...styles,
                            padding: "0",
                            position: "relative",
                            top: "-1px",
                          }),
                        }}
                        name="userName"
                        selectedValue={values?.userName}
                        onChange={(valueOption) => {
                          setFieldValue("userName", valueOption);
                        }}
                        loadOptions={loadUserList}
                        placeholder=""
                        isMulti
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>From Date</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.filterFromDate}
                        placeholder="Month"
                        name="toDate"
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("filterFromDate", e.target.value);
                          setFieldValue("filterToDate", "");
                          const month = moment(e.target.value).month();
                          const year = moment(e.target.value).year();
                          const lastDay = dateFormatterForInput(
                            lastDayOfMonth(month + 1, year)
                          );
                          setLastDateMonth(lastDay);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>To Date</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.filterToDate}
                        placeholder="Month"
                        name="toDate"
                        min={values?.filterFromDate}
                        max={lastDateOfMonth}
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("filterToDate", e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <button
                      className="btn btn-green btn-green-disable mt-4"
                      type="button"
                      disabled={
                        !values?.filterFromDate ||
                        !values?.filterToDate ||
                        values?.userName?.length < 1
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        autoGenerateProcessHandeler(values);
                      }}
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
        {/* addEdit form Modal */}
      </form>
    </>
  );
};

export default AttendanceGenerateProcessForm;
