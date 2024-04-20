import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AntTable from "../../../../common/AntTable";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { assessmentColumn, assessmentList } from "./helper";

const AssessmentFormLanding = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  // eslint-disable-next-line
  const [allData, setAllData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      const newDta = allData?.filter(
        (item) =>
          regex.test(item?.strTrainingName?.toLowerCase()) ||
          regex.test(item?.strTrainingCode?.toLowerCase()) ||
          regex.test(item?.strResourcePersonName?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  let permission = null;
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30356) {
      permission = item;
    }
  });

  useEffect(() => {
    assessmentList(orgId, buId, setLoading, setRowDto, setAllData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex align-items-center"> </div>
            <div className="table-header-right" style={{ marginRight: "-8px" }}>
              <ul className="d-flex flex-wrap">
                <li>
                  <MasterFilter
                    styles={{
                      marginRight: "10px",
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
                  <div className="table-card-styled employee-table-card tableOne ">
                    <AntTable
                      data={rowDto}
                      columnsData={assessmentColumn("", page, paginationSize)}
                      onRowClick={(item) => {
                        history.push(
                          `/trainingAndDevelopment/assessment/assessmentForm/view/${item?.intScheduleId}`
                        );
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
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default AssessmentFormLanding;
