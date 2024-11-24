import React, { useEffect } from "react";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import AntTable from "../../../../../common/AntTable";
import Loading from "../../../../../common/loading/Loading";
import { allKpiColumnData } from "./helper";
import NoResult from "../../../../../common/NoResult";

const KpiViewModal = ({ selectedData }) => {
  const [allKpi, getAllKpi, allKpiLoader] = useAxiosGet();
  useEffect(() => {
    if (selectedData?.employeeId) {
      getAllKpi(
        `/PMS/GetKpiMappingById?typeId=3&accountId=${selectedData?.accountId}&businessUnitId=${selectedData?.businessUnitId}&departmentId=0&designationId=0&employeeId=${selectedData?.employeeId}&viewType=1`
      );
      // viewTypeId=1 is for view all KPI including individual and departmental
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedData]);

  return (
    <>
      {allKpiLoader && <Loading />}
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <p>
              Employee Name: <strong>{selectedData?.employeeName}</strong>{" "}
            </p>
            <p>
              Department: <strong>{selectedData?.departmentName}</strong>{" "}
            </p>
            <p>
              Designation: <strong>{selectedData?.designationName}</strong>{" "}
            </p>
            <br />
          </div>
          <div className="col-md-12">
            {allKpi?.length > 0 ? (
              <div className="table-card-styled table-responsive tableOne mb-2">
                <AntTable
                  data={allKpi || []}
                  removePagination={true}
                  columnsData={allKpiColumnData()}
                />
              </div>
            ) : (
              <NoResult />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default KpiViewModal;
