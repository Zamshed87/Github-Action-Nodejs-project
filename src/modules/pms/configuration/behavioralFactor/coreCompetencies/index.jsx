import { AddOutlined } from "@mui/icons-material";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import AntTable from "../../../../../common/AntTable";
import NoResult from "../../../../../common/NoResult";
import PrimaryButton from "../../../../../common/PrimaryButton";
import ViewModal from "../../../../../common/ViewModal";
import Loading from "../../../../../common/loading/Loading";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import CoreCompetencyView from "./CoreCompetencyView";
import CreateCompetency from "./CreateCompetency";
import {
  coreCompetencyLandingTableColumn,
  onGetCoreCompetencyLanding,
  resetClusterList,
} from "./helper";
import AntScrollTable from "../../../../../common/AntScrollTable";

const CoreCompetencies = () => {
  const {
    permissionList,
    profileData: { buId, orgId, employeeId, intAccountId },
  } = useSelector((state) => state?.auth, shallowEqual);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [
    competencyList,
    getCompetencyList,
    loadingOnGetCompetencyList,
    setCompetencyList,
  ] = useAxiosGet();
  const [competencyId, setCompetencyId] = useState(null);
  const [clusterList, getClusterList, loadingOnGetClusterList, setClusterList] =
    useAxiosGet();
  const [allMasterPositionDDL, getAllMasterPositionDDL] = useAxiosGet([]);

  useEffect(() => {
    onGetCoreCompetencyLanding({
      getCompetencyList,
      setCompetencyList,
      pagination,
      setPagination,
      buId,
      orgId,
    });
    getClusterList(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PostionGroupDDL&AccountId=${orgId}&BusinessUnitId=${buId}&intId=${
        employeeId || 0
      }`
    );
    getAllMasterPositionDDL(
      `/SaasMasterData/GetAllMasterPosition?accountId=${intAccountId}`,
      (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strPositionGroupName;
          res[i].value = item?.intPositionGroupId;
        });
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, orgId]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const permission = useMemo(
    () => permissionList?.find((item) => item?.menuReferenceId === 30438),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <>
      {(loadingOnGetCompetencyList || loadingOnGetClusterList) && <Loading />}
      <>
        <div>
          <div className="table-card-heading d-flex justify-content-end">
            <ul>
              <li>
                <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center"
                  label="Create"
                  icon={
                    <AddOutlined
                      sx={{
                        marginRight: "0px",
                        fontSize: "15px",
                      }}
                    />
                  }
                  onClick={() => {
                    setShowCreateModal(true);
                  }}
                />
              </li>
            </ul>
          </div>
          {competencyList?.length > 0 ? (
            <div className="table-card-body">
              <div className="table-card-styled table-responsive tableOne">
                <AntScrollTable
                  rowClassName="pointer"
                  pagination={pagination}
                  onRowClick={(record) => {
                    setCompetencyId(record?.competencyId);
                    setShowViewModal(true);
                  }}
                  handleTableChange={({ pagination: newPagination }) => {
                    const { current, pageSize, total } = newPagination;
                    setPagination((prev) => ({
                      ...prev,
                      current,
                      pageSize,
                      total,
                    }));
                    if (
                      (pagination?.current === current &&
                        pagination?.pageSize !== pageSize) ||
                      pagination?.current !== current
                    ) {
                      onGetCoreCompetencyLanding({
                        getCompetencyList,
                        setCompetencyList,
                        pagination: newPagination,
                        setPagination,
                        buId,
                        orgId,
                      });
                    }
                  }}
                  data={Array.isArray(competencyList) ? competencyList : []}
                  columnsData={coreCompetencyLandingTableColumn({
                    setShowCreateModal,
                    permission,
                    setCompetencyId,
                    pagination,
                  })}
                />
              </div>
            </div>
          ) : (
            <NoResult />
          )}
        </div>
        <ViewModal
          size="lg"
          title="Create New Competency"
          backdrop="static"
          classes="default-modal preview-modal"
          show={showCreateModal}
          onHide={() => {
            setShowCreateModal(false);
            setCompetencyId(null);
            resetClusterList({ clusterList, setClusterList });
            onGetCoreCompetencyLanding({
              getCompetencyList,
              setCompetencyList,
              pagination,
              setPagination,
              buId,
              orgId,
            });
          }}
        >
          <CreateCompetency
            competencyId={competencyId}
            orgId={orgId}
            buId={buId}
            intAccountId={intAccountId}
            employeeId={employeeId}
            clusterList={clusterList}
            setClusterList={setClusterList}
            allMasterPositionDDL={allMasterPositionDDL}
            onHide={() => {
              setShowCreateModal(false);
              setCompetencyId(null);
              resetClusterList({ clusterList, setClusterList });
              onGetCoreCompetencyLanding({
                getCompetencyList,
                setCompetencyList,
                pagination,
                setPagination,
                buId,
                orgId,
              });
            }}
            permission={permission}
          />
        </ViewModal>
        <ViewModal
          size="lg"
          title="Core Competency Details"
          backdrop="static"
          classes="default-modal preview-modal"
          show={showViewModal}
          onHide={() => {
            setShowViewModal(false);
            setCompetencyId(null);
            resetClusterList({ clusterList, setClusterList });
          }}
        >
          <CoreCompetencyView
            buId={buId}
            competencyId={competencyId}
            clusterList={clusterList}
            setClusterList={setClusterList}
          />
        </ViewModal>
      </>
    </>
  );
};

export default CoreCompetencies;
