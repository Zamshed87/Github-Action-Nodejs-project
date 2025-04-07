import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import PrimaryButton from "../../../../common/PrimaryButton";
import { AddOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import Loading from "../../../../common/loading/Loading";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { pmsObjectiveTableColumn } from "./helper";
import NoResult from "../../../../common/NoResult";
import RefreshIcon from "@mui/icons-material/Refresh";
import AntTable from "../../../../common/AntTable";
import ResetButton from "../../../../common/ResetButton";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import AntScrollTable from "../../../../common/AntScrollTable";
import BackButton from "common/BackButton";

const DeptKpiMapping = () => {
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
  const [
    departmentalKpiLanding,
    getDepartmentalKpiLanding,
    departmentalKpiLandingLoader,
  ] = useAxiosGet();
  const [objectiveTableData, setObjectiveTableData] = useState([]);
  const [, deletePMSObjective, loadingOnDelete] = useAxiosPost();
  const dispatch = useDispatch();
  const history = useHistory();
  const [search, setSearch] = useState("");
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getData = (pages, setPages) => {
    getDepartmentalKpiLanding?.(
      `/PMS/GetDepartmentAndSbuKPILanding?KPIForId=2&accountId=${orgId}&businessUnitId=${buId}&departmentId=0&SBUId=0&pageNo=${pages?.current}&pageSize=${pages?.pageSize}`,
      (data) => {
        setPages((prev) => ({
          ...prev,
          total: data?.totalCount,
        }));
        setObjectiveTableData?.(data?.data);
        setLoading(false);
      }
    );
  };
  useEffect(() => {
    getData(pages, setPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);
  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30462),
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
      return getData(pagination, setPages);
    }
  };

  return (
    <>
      {(departmentalKpiLandingLoader || loadingOnDelete || loading) && (
        <Loading />
      )}
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading justify-content-between">
            <BackButton title={"Departmental KPI Mapping"} />
            <ul className="d-flex flex-wrap">
              {search ? (
                <ResetButton
                  classes="btn-filter-reset"
                  title="Reset"
                  icon={<RefreshIcon sx={{ marginRight: "10px" }} />}
                  onClick={() => {
                    setSearch("");
                    setObjectiveTableData(departmentalKpiLanding);
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
                  label="Dept KPI Mapping"
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
                    history.push("/pms/configuration/deptkpimapping/create");
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
                  columnsData={pmsObjectiveTableColumn({
                    fromLanding: true,
                    history,
                    permission,
                    deletePMSObjective,
                    getObjectiveLanding: getDepartmentalKpiLanding,
                    orgId,
                    employeeId,
                    setObjectiveTableData,
                  })}
                  pages={pages?.pageSize}
                  pagination={pages}
                  handleTableChange={handleTableChange}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default DeptKpiMapping;
