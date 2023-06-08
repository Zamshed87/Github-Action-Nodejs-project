import { useFormik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import NoResult from "../../../../common/NoResult";
import DefaultInput from "../../../../common/DefaultInput";
import {
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import ResetButton from "../../../../common/ResetButton";
import Loading from "../../../../common/loading/Loading";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { useHistory } from "react-router-dom";
import {
  monthFirstDate,
  monthLastDate,
} from "../../../../utility/dateFormatter";
import AntTable from "../../../../common/AntTable";
import { attendanceProcessLandingColumn, empListColum } from "./utils";
import { useState } from "react";
import ViewModal from "../../../../common/ViewModal";

const AttendanceProcessLanding = () => {
  const history = useHistory();
  const [singleData, setSingleData] = useState("");
  const [viewModal, setViewModal] = useState(false);

  const dispatch = useDispatch();
  const [attendanceProcessLanding, getAttendanceProcessAPI, loadingLanding] =
    useAxiosGet();
  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      filterFromDate: monthFirstDate(),
      filterToDate: monthLastDate(),
    },
    onSubmit: (values) => {},
  });

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30374) {
      permission = item;
    }
  });

  const getLanding = () => {
    getAttendanceProcessAPI(
      `/TimeSheet/GetTimeAttendanceProcess?FromDate=${values?.filterFromDate}&ToDate=${values?.filterToDate}`
    );
  };

  useEffect(() => {
    getLanding();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, [dispatch]);
  return (
    <>
      <form onSubmit={handleSubmit}>
        {loadingLanding && <Loading />}
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading justify-content-between align-items-center">
              <h2>Attendance Auto Process</h2>
              <ul className="d-flex flex-wrap">
                {values?.search && (
                  <li>
                    <ResetButton
                      classes="btn-filter-reset"
                      title="reset"
                      icon={
                        <SettingsBackupRestoreOutlined
                          sx={{
                            marginRight: "10px",
                            fontSize: "16px",
                          }}
                        />
                      }
                      styles={{
                        marginRight: "16px",
                      }}
                      onClick={() => {
                        //   setRowDto(allData);
                        setFieldValue("search", "");
                      }}
                    />
                  </li>
                )}
                <li>
                  <DefaultInput
                    classes="search-input"
                    inputClasses="search-inner-input"
                    placeholder="Search"
                    value={values?.search}
                    name="search"
                    type="text"
                    trailicon={
                      <SearchOutlined
                        sx={{
                          color: "#323232",
                          fontSize: "18px",
                        }}
                      />
                    }
                    onChange={(e) => {
                      // filterData(e.target.value);
                      setFieldValue("search", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </li>
                <li>
                  <button
                    type="button"
                    style={{
                      padding: "0px 10px",
                      marginLeft: "16px",
                    }}
                    className="btn btn-default"
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push(
                        "/profile/timeManagement/attendanceAutoProcess/generate"
                      );
                    }}
                  >
                    Create
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-style pb-0 mt-3 mb-2">
              <div className="row">
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>From Date</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.filterFromDate}
                      placeholder="Month"
                      name="toDate"
                      max={values?.filterToDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("filterFromDate", e.target.value);
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
                    disabled={!values?.filterFromDate || !values?.filterToDate}
                    onClick={(e) => {
                      e.stopPropagation();
                      getLanding();
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
            <div className="table-card-body">
              <div className="table-card-styled employee-table-card tableOne mt-3">
                {attendanceProcessLanding?.length > 0 ? (
                  <AntTable
                    data={attendanceProcessLanding}
                    columnsData={attendanceProcessLandingColumn()}
                    rowClassName="pointer"
                    rowKey={(record) => record?.intHeaderRequestId}
                    onRowClick={(item) => {
                      if (!item?.isAll) {
                        setSingleData([]);
                        setViewModal(true);
                        setSingleData(item?.processEmployees);
                      }
                    }}
                  />
                ) : (
                  <NoResult title="No result found" />
                )}
              </div>
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
        <ViewModal
          size="lg"
          title="Attendance Auto Process Employee List"
          backdrop="static"
          classes="default-modal preview-modal"
          show={viewModal}
          onHide={() => setViewModal(false)}
        >
          <div className="px-3 pb-5">
            <div className="table-card-heading">
              <h2>Employee List</h2>
            </div>
            <div className="table-card-body">
              <div className="table-card-styled employee-table-card tableOne">
                <AntTable
                  data={singleData}
                  columnsData={empListColum}
                  rowClassName="pointer"
                  removePagination
                  rowKey={(record) => record?.intEmployeeId}
                />
              </div>
            </div>
          </div>
        </ViewModal>
      </form>
    </>
  );
};

export default AttendanceProcessLanding;
