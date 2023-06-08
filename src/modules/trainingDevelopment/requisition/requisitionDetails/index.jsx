import { useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import BackButton from "../../../../common/BackButton";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import TrainingDetailsCard from "../../common/TrainingDetailsCard";
import { createRequisitionData, getRequisitionData } from "./helper";
import NotAssigned from "./components/notAssigned";
import AssignPending from "./components/AssignPending";
import Assigned from "./components/Assigned";
import { toast } from "react-toastify";
import moment from "moment";

export default function RequisitionDetails() {
  // hook
  const dispatch = useDispatch();

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // redux state
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const { state } = useLocation();
  // state
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [paginationSize, setPaginationSize] = useState(15);
  const [filterIndex, setFilterIndex] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const [checked, setCheckedData] = useState([]);
  const [pending, setPending] = useState(0);
  const [hideBtn, setHideBtn] = useState(true);

  // eslint-disable-next-line
  const [allData, setAllData] = useState({});

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30353) {
      permission = item;
    }
  });
  const tabName = [
    { name: "Not Assigned", noLeftRadius: false, noRadius: false },
    { name: "Pending Assign", noLeftRadius: false, noRadius: true },
    { name: "Assigned", noLeftRadius: true, noRadius: false },
  ];
  useEffect(() => {
    const result = filterData?.filter((item) => item?.selectCheckbox);
    setCheckedData(result);
  }, [filterData]);
  // useEffect
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getData = () => {
    getRequisitionData(
      orgId,
      buId,
      state?.intScheduleId,
      "Not Assigned",
      setRowDto,
      setAllData,
      setFilterData,
      setLoading
    );
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, state?.intScheduleId]);
  useEffect(() => {
    setPending(allData?.data?.filter((item) => item?.strStatus === "Pending"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allData]);
  useEffect(() => {
    if (
      checked?.length + pending?.length >
      state?.intBatchSize - state?.totalRequisition
    ) {
      setHideBtn(true);
      toast.warn("Selected More Than Capacity");
    } else {
      setHideBtn(false);
    }
  }, [checked, pending, state]);
  return (
    <>
      {loading && <Loading />}
      {permission?.isCreate ? (
        <div className="table-card">
          <div className="table-card-heading mb-2">
            <div className="d-flex align-items-center">
              <BackButton />
              <h2>Requisition Details</h2>
            </div>
            <ul className="d-flex flex-wrap">
              {moment().format() < moment(state?.dteCourseCompletionDate).format() &&
              <li>
                <button
                  type="button"
                  className="btn btn-default flex-center mr-2"
                  disabled={checked.length === 0 || hideBtn}
                  onClick={() => {
                    const callback = () => {
                      getData();
                    };
                    createRequisitionData(
                      orgId,
                      employeeId,
                      checked,
                      setLoading,
                      state,
                      callback
                    );
                  }}
                >
                  Save
                </button>
              </li>
}
            </ul>
          </div>

          <div className="table-card-body">
            <TrainingDetailsCard
              data={{
                trainingName: state?.strTrainingName,
                resourcePerson: state?.strResourcePersonName,
                requestedBy: state?.strEmployeeName,
                batchSize: state?.intBatchSize,
                batchNo: state?.strBatchNo,
                fromDate: state?.dteFromDate,
                toDate: state?.dteToDate,
                duration: state?.numTotalDuration,
                venue: state?.strVenue,
                remark: state?.strRemarks,
              }}
            />

            <div className="">
              <div className="table-card-heading mt-3 pt-1">
                <div className="d-flex align-items-start justify-content-center">
                  <div className="">
                    <h2 className="ml-1">Employee List</h2>
                    <p className="ml-1 mt-2">
                      Total Selected <span>{checked.length}</span>
                    </p>
                  </div>
                  <div className="d-flex ml-4">
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
                    <p
                      style={{
                        borderRight: "1px solid #667085",
                        paddingRight: "7px",
                        marginRight: "7px",
                      }}
                    >
                      Available{" "}
                      <span>
                        {state?.intBatchSize - state?.totalRequisition}
                      </span>
                    </p>

                    <p>
                      Pending <span>{pending?.length}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="table-card-body">
                <div className="custom-button-group">
                  {tabName.map((item, i) => {
                    return (
                      <button
                        key={i}
                        type="button"
                        className={`btn-single-groupe ${
                          i === filterIndex && "btn-single-groupe-active"
                        } ${item?.noRadius && "not-radius"} ${
                          item?.noLeftRadius && "no-left-radius"
                        }`}
                        onClick={() => {
                          setFilterIndex(i);
                          getRequisitionData(
                            orgId,
                            buId,
                            state?.intScheduleId,
                            item?.name,
                            setRowDto,
                            setAllData,
                            setFilterData,
                            setLoading
                          );
                        }}
                      >
                        {item?.name}
                      </button>
                    );
                  })}
                </div>
                <div className="table-card-styled tableOne">
                  {rowDto?.length > 0 ? (
                    <>
                      <NotAssigned
                        index={filterIndex}
                        tabIndex={0}
                        rowDto={rowDto}
                        setRowDto={setRowDto}
                        page={page}
                        paginationSize={paginationSize}
                        filterData={filterData}
                        setFilterData={setFilterData}
                        setPage={setPage}
                        setPaginationSize={setPaginationSize}
                      />
                      <AssignPending
                        index={filterIndex}
                        tabIndex={1}
                        rowDto={rowDto}
                        setRowDto={setRowDto}
                        page={page}
                        paginationSize={paginationSize}
                        filterData={filterData}
                        setFilterData={setFilterData}
                        setPage={setPage}
                        setPaginationSize={setPaginationSize}
                        setEdit={setEdit}
                        setEditIndex={setEditIndex}
                        edit={edit}
                        editIndex={editIndex}
                        orgId={orgId}
                        employeeId={employeeId}
                        setLoading={setLoading}
                        state={state}
                      />
                      <Assigned
                        index={filterIndex}
                        tabIndex={2}
                        rowDto={rowDto}
                        setRowDto={setRowDto}
                        page={page}
                        paginationSize={paginationSize}
                        setFilterData={setFilterData}
                        filterData={filterData}
                        setPage={setPage}
                        setPaginationSize={setPaginationSize}
                      />
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
}
