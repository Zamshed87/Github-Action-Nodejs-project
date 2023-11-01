import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import AntTable from "../../../../../common/AntTable";
import MasterFilter from "../../../../../common/MasterFilter";
import NoResult from "../../../../../common/NoResult";
import ViewModal from "../../../../../common/ViewModal";
import TrainingDetailsCard from "../../../common/TrainingDetailsCard";
import { employeeListColumn, getSubmissionLanding } from "./helper";
import ViewSubmissionForm from "./viewSubmissionForm/viewSubmissionForm";

const SubmissionDetails = ({ data }) => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [isShowAssessmentDetails, setIsShowAssessmentDetails] = useState(false);
  const [apiParams, setApiParams] = useState(0);
  const [rowDto, setRowDto] = useState([]);

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.strEmployeeName?.toLowerCase()) ||
          regex.test(item?.strDesignationName?.toLowerCase()) ||
          regex.test(item?.strDepartmentName?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  useEffect(() => {
    getSubmissionLanding(
      data?.intScheduleId,
      orgId,
      buId,
      setRowDto,
      setAllData,
      setLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <div className="table-card-body mt-2">
        <TrainingDetailsCard
          data={{
            trainingName: data?.strTrainingName,
            resourcePerson: data?.strResourcePersonName,
            requestedBy: data?.strEmployeeName,
            batchSize: data?.intBatchSize,
            batchNo: data?.strBatchNo,
            fromDate: data?.dteFromDate,
            toDate: data?.dteToDate,
            duration: data?.numTotalDuration,
            venue: data?.strVenue,
            remark: data?.strRemarks,
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
                  Batch Size <span>{data?.intBatchSize}</span>
                </p>
                <p
                  style={{
                    borderRight: "1px solid #667085",
                    paddingRight: "7px",
                    marginRight: "7px",
                  }}
                >
                  Assigned <span>{data?.totalRequisition}</span>
                </p>
                <p>
                  Available{" "}
                  <span>{data?.intBatchSize - data?.totalRequisition}</span>
                </p>
              </div>
            </div>
            <div className="table-header-right">
              <ul className="d-flex flex-wrap">
                <li>
                  <MasterFilter
                    styles={{
                      marginRight: "0px",
                    }}
                    inputWidth="200px"
                    width="200px"
                    value={searchKey}
                    setValue={(value) => {
                      setSearchKey(value);
                      filterData(value);
                    }}
                    isHiddenFilter
                    cancelHandler={() => {
                      setSearchKey("");
                      setRowDto(allData);
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
                        setIsShowAssessmentDetails,
                        setApiParams,
                        setAssessmentTitle,
                        page,
                        // 1,
                        paginationSize
                        // 15
                      )}
                      onRowClick={(item) => {
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
                <>{!loading && <NoResult title="No Result Found" para="" />}</>
              )}
            </div>
          </div>
        </div>
      </div>
      <ViewModal
        show={isShowAssessmentDetails}
        title={assessmentTitle}
        onHide={() => setIsShowAssessmentDetails(false)}
        size="lg"
        backdrop="static"
        classes="default-modal form-modal"
      >
        {/* <AddEditForm getData={getLanding} setIsAddEditForm={setIsAddEditForm} /> */}
        <ViewSubmissionForm
          obj={{
            ...apiParams,
          }}
          setIsShowAssessmentDetails={setIsShowAssessmentDetails}
        />
      </ViewModal>
    </>
  );
};

export default SubmissionDetails;
