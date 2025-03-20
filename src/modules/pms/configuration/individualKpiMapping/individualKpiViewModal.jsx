import React from "react";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { useEffect } from "react";
import Loading from "../../../../common/loading/Loading";
import AntTable from "../../../../common/AntTable";
import {
  kpiColumnDataForDepartment,
  kpiColumnDataForIndividual,
} from "../kpimapping/modal/helper";
// import NoResult from "../../../../common/NoResult";

const IndividualKpiViewModal = ({ selectedData }) => {
  const [allKpiList, getAllKpiList, allKpiListLoader] = useAxiosGet();
  useEffect(() => {
    if (selectedData?.employeeId) {
      getAllKpiList(
        `/PMS/GetKpiMappingById?accountId=${selectedData?.accountId}&businessUnitId=${selectedData?.businessUnitId}&departmentId=${selectedData?.departmentId}&employeeId=${selectedData?.employeeId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedData]);

  return (
    <>
      {allKpiListLoader && <Loading />}
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
            <h2 className="mb-2">Employee Wise KPI</h2>
            {allKpiList?.employeeWise?.length > 0 ? (
              <div className="table-card-styled table-responsive tableOne mb-2">
                <AntTable
                  data={allKpiList?.employeeWise || []}
                  removePagination={true}
                  columnsData={kpiColumnDataForIndividual()}
                />
              </div>
            ) : (
              <div className="text-center mb-4">
                <h3 className="text-secondary">No Employee Wise KPI found</h3>
              </div>
            )}
          </div>
          {/* may be have to change later 😒 */}

          {/* <div className="col-md-12">
            <h2 className="mb-2">Department Wise KPI</h2>
            {allKpiList?.departmentWise?.length > 0 ? (
              <div className="table-card-styled table-responsive tableOne mb-2">
                <AntTable
                  data={allKpiList?.departmentWise || []}
                  removePagination={true}
                  columnsData={kpiColumnDataForDepartment()}
                />
              </div>
            ) : (
              <div className="text-center mb-4">
                <h3 className="text-secondary">No Department Wise KPI found</h3>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default IndividualKpiViewModal;
