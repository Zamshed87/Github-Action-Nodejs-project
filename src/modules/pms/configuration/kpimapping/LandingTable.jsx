import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AntTable from "../../../../common/AntTable";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import {
  deptKpiMappingTable,
  designationKpiMappingTable,
  employeeeKpiMappingTable,
  getKPIsMappingLanding,
} from "./helper";
import ViewModal from "../../../../common/ViewModal";
import KpiViewModal from "./modal";

const LandingTable = ({ component, rowDto, setRowDto, setAllData }) => {
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [pages, setPages] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  // const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const getData = (pages, srcText) => {
    getKPIsMappingLanding(
      component === "dept" ? 1 : component === "designation" ? 2 : 3,
      buId,
      orgId,
      0,
      0,
      0,
      setRowDto,
      setAllData,
      setLoading,
      pages,
      setPages
    );
  };

  useEffect(() => {
    getData(pages, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

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

  const [selectedData, setSelectedData] = useState(null);
  const [showKpiViewModal, setShowKpiViewModal] = useState(false);

  return (
    <div className="table-card-styled employee-table-card tableOne table-responsive mt-3">
      {loading && <Loading />}
      {rowDto?.length > 0 ? (
        <AntTable
          data={rowDto?.length > 0 ? rowDto : []}
          columnsData={
            component === "employee"
              ? employeeeKpiMappingTable(
                  pages?.current,
                  pages?.pageSize,
                  history,
                  setSelectedData,
                  setShowKpiViewModal
                )
              : component === "dept"
              ? deptKpiMappingTable(pages?.current, pages?.pageSize, history)
              : designationKpiMappingTable(
                  pages?.current,
                  pages?.pageSize,
                  history
                )
          }
          rowKey={(record) => record?.intKpisId}
          pages={pages?.pageSize}
          pagination={pages}
          handleTableChange={handleTableChange}
        />
      ) : (
        <NoResult />
      )}

      {/* add modal for view all KPIs */}

      <ViewModal
        size="lg"
        title="KPI Details"
        backdrop="static"
        classes="default-modal preview-modal"
        show={showKpiViewModal}
        onHide={() => {
          setShowKpiViewModal(false);
        }}
      >
        <KpiViewModal selectedData={selectedData} />
        {/* <CoreValuesView buId={buId} coreValueId={coreValueId} /> */}
      </ViewModal>
    </div>
  );
};

export default LandingTable;
