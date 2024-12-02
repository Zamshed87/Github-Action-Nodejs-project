import { AddOutlined } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import AntTable from "../../../../common/AntTable";
// import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import PrimaryButton from "../../../../common/PrimaryButton";
import ResetButton from "../../../../common/ResetButton";
import Loading from "../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { onGetObjectiveLanding, pmsSBUKPITableColumn } from "./helper";
import AntScrollTable from "../../../../common/AntScrollTable";
const SbuKpiMapping = () => {
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const [loading, setLoading] = useState(false);
  const {
    permissionList,
    profileData: { buId, orgId, employeeId },
  } = useSelector((store) => store?.auth);
  const [objectiveLanding, getObjectiveLanding, loadingOnGetObjectiveLanding] =
    useAxiosGet();
  const [objectiveTableData, setObjectiveTableData] = useState([]);
  const [, deletePMSObjective, loadingOnDelete] = useAxiosPost();
  const dispatch = useDispatch();
  const history = useHistory();
  const [search, setSearch] = useState("");
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = (pages, srcText) => {
    onGetObjectiveLanding({
      getObjectiveLanding,
      orgId,
      buId,
      setObjectiveTableData,
      setLoading,
      pages,
      setPages,
    });
  };
  useEffect(() => {
    getData(pages, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);
  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30466),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleTableChange = ({ pagination }) => {
    setPages((prev) => ({ ...prev, ...pagination }));
    if (
      (pages?.current === pagination?.current &&
        pages?.pageSize !== pagination?.pageSize) ||
      pages?.current !== pagination?.current
    ) {
      return getData(pagination, "");
    }
  };
  return (
    <>
      {(loadingOnGetObjectiveLanding || loadingOnDelete || loading) && (
        <Loading />
      )}
      <div className="table-card">
        <div className="table-card-heading justify-content-between">
          <h2>SBU KPI Mapping</h2>
          <ul className="d-flex flex-wrap">
            {search ? (
              <ResetButton
                classes="btn-filter-reset"
                title="Reset"
                icon={<RefreshIcon sx={{ marginRight: "10px" }} />}
                onClick={() => {
                  setSearch("");
                  setObjectiveTableData(objectiveLanding);
                }}
                styles={{
                  height: "auto",
                  fontSize: "12px",
                  marginRight: "10px",
                  marginTop: "3px",
                  paddingTop: "0px",
                }}
              />
            ) : (
              <></>
            )}
            <li>
              <PrimaryButton
                type="button"
                className="btn btn-default flex-center"
                label="SBU KPI Mapping"
                icon={
                  <AddOutlined
                    sx={{
                      marginRight: "0px",
                      fontSize: "15px",
                    }}
                  />
                }
                onClick={() => {
                  if (!permission?.isCreate) {
                    return toast.warn("You don't have permission to create");
                  }
                  history.push("/pms/configuration/subkpimapping/create");
                }}
              />
            </li>
          </ul>
        </div>
        {objectiveTableData?.length <= 0 ? (
          <NoResult />
        ) : (
          <div className="table-card-body">
            <div className="table-card-styled table-responsive tableOne">
              <AntScrollTable
                data={objectiveTableData}
                columnsData={pmsSBUKPITableColumn({
                  fromLanding: true,
                  history,
                  permission,
                  deletePMSObjective,
                  getObjectiveLanding,
                  orgId,
                  employeeId,
                  setObjectiveTableData,
                })}
                removePagination
                pages={pages?.pageSize}
                pagination={pages}
                handleTableChange={handleTableChange}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SbuKpiMapping;
