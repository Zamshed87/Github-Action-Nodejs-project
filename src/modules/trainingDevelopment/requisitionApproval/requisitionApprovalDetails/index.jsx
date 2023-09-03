import { useState } from "react";
// import { shallowEqual, useSelector } from "react-redux";
// import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import AntTable from "../../../../common/AntTable";
import BackButton from "../../../../common/BackButton";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import TrainingDetailsCard from "../../common/TrainingDetailsCard";
import { employeeListColumn } from "./helper";

const RequisitionApprovalDetails = () => {
  // const params = useParams();

  // const { orgId, buId, employeeId, intAccountId } = useSelector(
  //   (state) => state?.auth?.profileData,
  //   shallowEqual
  // );

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [rowDto, setRowDto] = useState([
    {
      strEmployeeCode: "110",
      strEmployeeName: "Floyd Miles [32165498]",
      strDesignation: "Product Designer",
      strDepartment: "Development",
      strEmail: "debbie.baker@example.com",
      strPhone: "0984603663",
      Status: "Pending",
    },
    {
      strEmployeeCode: "110",
      strEmployeeName: "Floyd Miles [32165498]",
      strDesignation: "Product Designer",
      strDepartment: "Development",
      strEmail: "debbie.baker@example.com",
      strPhone: "0984603663",
      Status: "Approved",
    },
    {
      strEmployeeCode: "110",
      strEmployeeName: "Floyd Miles [32165498]",
      strDesignation: "Product Designer",
      strDepartment: "Development",
      strEmail: "debbie.baker@example.com",
      strPhone: "0984603663",
      Status: "Approved",
    },
    {
      strEmployeeCode: "110",
      strEmployeeName: "Floyd Miles [32165498]",
      strDesignation: "Product Designer",
      strDepartment: "Development",
      strEmail: "debbie.baker@example.com",
      strPhone: "0984603663",
      Status: "Pending",
    },
  ]);

  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  let permission = {
    isCreate: true,
  };

  return (
    <>
      {loading && <Loading />}
      {permission?.isCreate ? (
        <div className="table-card">
          <div className="table-card-heading mb-2">
            <div className="d-flex align-items-center">
              <BackButton />
              <h2>Design Thinking and Innovation</h2>
            </div>
          </div>

          <div className="table-card-body">
            <TrainingDetailsCard
              data={{
                trainingName: "Design Thinking and Innovation",
                resourcePerson: "Mahadi Hasan Mridul",
                requestedBy: "Imran Uddin",
                batchSize: 40,
                batchNo: "B01",
                fromDate: "23 Sep, 2022",
                toDate: "24 Sep, 2022",
                duration: 7,
                venue: "AKIJ House",
                remark: null,
              }}
            />

            <div className="">
              <div className="table-card-heading mt-3 pt-1">
                <div className="d-flex align-items-start justify-content-center">
                  <div className="">
                    <h2 className="ml-1">Employee List</h2>
                    <p className="ml-1 mt-2">
                      Total Selected <span>3</span>
                    </p>
                  </div>
                  <div className="d-flex ml-4" style={{ marginTop: "2px" }}>
                    <p
                      style={{
                        borderRight: "1px solid #667085",
                        paddingRight: "7px",
                        marginRight: "7px",
                      }}
                    >
                      Batch Size <span>40</span>
                    </p>
                    <p
                      style={{
                        borderRight: "1px solid #667085",
                        paddingRight: "7px",
                        marginRight: "7px",
                      }}
                    >
                      Assigned <span>37</span>
                    </p>
                    <p>
                      Available <span>3</span>
                    </p>
                  </div>
                </div>
                <div className="table-header-right">
                  <ul className="d-flex flex-wrap" style={{ gap: "10px" }}>
                    <li className="">
                      <button
                        type="button"
                        className="btn btn-default flex-center"
                      >
                        Approve
                      </button>
                    </li>
                    <li className="">
                      <button
                        type="button"
                        className="btn btn-default flex-center"
                      >
                        Reject
                      </button>
                    </li>
                    <li>
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

export default RequisitionApprovalDetails;
