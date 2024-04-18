import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import moment from "moment";

import AntTable from "../../../../common/AntTable";
import BackButton from "../../../../common/BackButton";
import DefaultInput from "../../../../common/DefaultInput";
import Loading from "../../../../common/loading/Loading";
// import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { todayDate } from "../../../../utility/todayDate";
import TrainingDetailsCard from "../../common/TrainingDetailsCard";
import {
  employeeListColumn,
  trainingAbsentPresent,
  trainingAttendanceList,
} from "./helper";

const initData = {
  search: "",
  initDate: todayDate(),
};

const AttendanceView = () => {
  const { orgId, buId, employeeId } = useSelector(
    // const { orgId, buId, buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // const history = useHistory();
  const { state } = useLocation();

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [rowDto, setRowDto] = useState([]);
  // const [rowDto, setRowDto] =useState([])

  const [allData, setAllData] = useState([]);
  const [payload, setPayload] = useState([]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30354) {
      permission = item;
    }
  });
  const { values, setFieldValue } = useFormik({
    initialValues: initData,
  });
  // const getData = () => {
  //   trainingAttendanceList(setLoading, setRowDto, setAllData);
  // };

  const handleSubmit = (date) => {
    const modifiedPayload = payload?.map((item) => {
      return {
        ...item,
        intAccountId: orgId,
        intBusinessUnitId: buId,
        dteAttendanceDate: date,
        strAttendanceStatus: "Present",
        dteActionDate: date,
        intActionBy: employeeId,
        intScheduleId: state?.intScheduleId,
      };
    });

    trainingAbsentPresent(
      orgId,
      buId,
      modifiedPayload,
      setLoading,
      setRowDto,
      allData
    );
  };
  useEffect(() => {
    const array = [];
    rowDto?.forEach((data) => {
      if (data?.isModified) {
        array.push({ ...data });
      }
      setPayload(array);
    });
  }, [rowDto]);
  useEffect(() => {
    trainingAttendanceList(
      orgId,
      buId,
      state?.intScheduleId,
      setLoading,
      setRowDto,
      setAllData,
      initData?.initDate
    );
  }, [orgId, buId, state?.intScheduleId]);
  return (
    <>
      {loading && <Loading />}
      {permission?.isCreate ? (
        <div className="table-card">
          <div className="table-card-heading mb-2">
            <div className="d-flex align-items-center">
              <BackButton />
              <h2>Attendance Details</h2>
            </div>
            <div className="table-card-head-right">
              {moment().format() <
                moment(state?.dteCourseCompletionDate).format() && (
                <button
                  type="submit"
                  className="btn btn-green btn-green-disable"
                  disabled={payload?.length === 0}
                  onClick={() => handleSubmit(values?.initDate)}
                >
                  {/* {isEdit ? "Update" : "Save"} */}
                  {"Save"}
                </button>
              )}
              {/* <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center"
                  label={"Save"}
                  icon={
                    <AddOutlined
                      sx={{ marginRight: "0px", fontSize: "15px" }}
                    />
                  }
                  onClick={() => {
                    if (!permission?.isCreate){
                      return toast.warn("You don't have permission");
                    }
                  }}
                /> */}
            </div>
          </div>

          <div className="table-card-body">
            <TrainingDetailsCard
              data={{
                trainingName: state?.strTrainingName,
                resourcePerson: state?.strResourcePersonName,
                requestedBy: state?.strEmployeeName || "N/A",
                batchSize: state?.intBatchSize,
                batchNo: state?.strBatchNo,
                fromDate: state?.dteFromDate,
                toDate: state?.dteToDate,
                duration: state?.numTotalDuration,
                venue: state?.strVenue,
                remark: state?.strRemarks || "N/A",
              }}
            />

            <div className="">
              <div className="table-card-heading mt-3 pt-1">
                <div className="d-flex align-items-start justify-content-center">
                  <div className="">
                    <h2 className="ml-1">Employee List</h2>
                  </div>
                  <div className="d-flex ml-4" style={{ marginTop: "2px" }}>
                    <p
                      style={{
                        borderRight: "1px solid #667085",
                        paddingRight: "7px",
                        marginRight: "7px",
                      }}
                    >
                      Batch Size <span>{state?.intBatchSize}</span>
                    </p>
                    <p
                      style={{
                        borderRight: "1px solid #667085",
                        paddingRight: "7px",
                        marginRight: "7px",
                      }}
                    >
                      Assigned <span>{state?.totalRequisition}</span>
                    </p>
                    <p>
                      Available{" "}
                      <span>
                        {state?.intBatchSize - state?.totalRequisition}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="table-header-right">
                  <ul className="d-flex flex-wrap">
                    {/* <li>
                      <MasterFilter
                        styles={{
                          marginRight: "0px",
                        }}
                        inputWidth="200px"
                        width="200px"
                        //   value={values?.search}
                        value={""}
                        setValue={(value) => {
                          // setFieldValue("search", value);
                          // debounce(() => {
                          //   searchFromIouLanding(value, allData, setRowDto);
                          // }, 500);
                        }}
                        isHiddenFilter
                        cancelHandler={() => {
                          // setFieldValue("search", "");
                          // setRowDto(allData);
                        }}
                        //   handleClick={(e) => setfilterAnchorEl(e.currentTarget)}
                      />
                    </li> */}
                    <li className="input-field-main">
                      <DefaultInput
                        classes="input-sm"
                        value={values?.initDate}
                        placeholder="Month"
                        name="toDate"
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("initDate", e.target.value);
                          trainingAttendanceList(
                            orgId,
                            buId,
                            state?.intScheduleId,
                            setLoading,
                            setRowDto,
                            setAllData,
                            e.target.value
                          );
                        }}
                      />
                    </li>
                  </ul>
                </div>
              </div>

              <div className="table-card-body">
                <div className="table-card-styled tableOne">
                  {rowDto?.length > 0 ? (
                    <>
                      <div className="table-card-styled employee-table-card tableOne mt-2">
                        <AntTable
                          data={rowDto}
                          columnsData={employeeListColumn(
                            // history,
                            "",
                            rowDto,
                            setRowDto,
                            page,
                            // 1,
                            paginationSize,
                            setFieldValue
                            // 15
                          )}
                          onRowClick={() => {
                            // history.push(
                            //   `/profile/iOU/application/${item?.intIOUId}`
                            // );
                          }}
                          rowClassName="pointer"
                          setPage={setPage}
                          setPaginationSize={setPaginationSize}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {!loading && <NoResult title="No Result Found" para="" />}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default AttendanceView;
