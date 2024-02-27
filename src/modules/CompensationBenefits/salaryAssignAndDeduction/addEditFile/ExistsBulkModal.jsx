import React from "react";
import { assignedBulkTbleCol, saveBulkUploadAction } from "./helperNew";
import AntTable from "common/AntTable";


const ExistsBulkModal = ({
  assignedBulkEmp,
  bulkLandingRowDto,
  setShowExistModal,
  setAssignedBulkEmp,
  setIsLoadingBulk,
  setIsBulkAssign
}) => {
  return (
    <div className="px-2">
      <ul className="d-flex flex-wrap px-1">
        <button
          type="button"
          className="btn btn-green btn-green-disable btn-sm"
          style={{ width: "auto" }}
          onClick={() => {
            saveBulkUploadAction(
              bulkLandingRowDto,
              setIsLoadingBulk,
              setShowExistModal,
              setAssignedBulkEmp,
              true,
              false,
              ()=>{
                setShowExistModal(false);
                // setAssignedBulkEmp([]);
                // setIsBulkAssign(false);
              }
            );
          }}
        >
          Forced Assign
        </button>

        <button
          type="button"
          className="btn btn-green btn-green-disable ml-2 btn-sm"
          style={{ width: "auto" }}
          onClick={() => {
            saveBulkUploadAction(
              bulkLandingRowDto,
              setIsLoadingBulk,
              setShowExistModal,
              setAssignedBulkEmp,
              false,
              true,
              () => {
                setShowExistModal(false);
                // setAssignedBulkEmp([]);
                // setIsBulkAssign(false);
              }
            );
          }}
        >
          Skip & Assign
        </button>
      </ul>
      <div className="table-card-body py-2">
        <div className="table-card-styled employee-table-card tableOne  table-responsive mt-3">
          <AntTable
            data={assignedBulkEmp}
            columnsData={assignedBulkTbleCol()}
            removePagination={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ExistsBulkModal;
