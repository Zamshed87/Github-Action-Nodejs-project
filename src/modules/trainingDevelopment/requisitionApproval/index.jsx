import React from "react";
import { useState } from "react";
import AntTable from "../../../common/AntTable";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import { requisitionApprovalColumn } from "./helper";

const RequisitionApprovalLanding = () => {
  // eslint-disable-next-line
  const [rowDto, setRowDto] = useState([
    {
      strTrainingCode: "TRA-0001",
      strScheduleName: "Leadership Principles",
      strResourcePerson: "Wade Warren",
      dteTrainingDate: "13 Sep, 2022 - 15 Sep, 2022",
      dteDuration: "72 Hrs",
      strVenue: "AKIJ House",
      strBatchNo: "B01 (40)",
      intAssignSize: 34,
      intPending: 10,
    },
    {
      strTrainingCode: "TRA-0001",
      strScheduleName: "Leadership Principles",
      strResourcePerson: "Wade Warren",
      dteTrainingDate: "13 Sep, 2022 - 15 Sep, 2022",
      dteDuration: "72 Hrs",
      strVenue: "AKIJ House",
      strBatchNo: "B01 (40)",
      intAssignSize: 34,
      intPending: 10,
    },
    {
      strTrainingCode: "TRA-0001",
      strScheduleName: "Leadership Principles",
      strResourcePerson: "Wade Warren",
      dteTrainingDate: "13 Sep, 2022 - 15 Sep, 2022",
      dteDuration: "72 Hrs",
      strVenue: "AKIJ House",
      strBatchNo: "B01 (40)",
      intAssignSize: 34,
      intPending: 10,
    },
  ]);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);

  return (
    <div className="table-card">
      <div className="table-card-heading mt-2 pt-1">
        <div className="d-flex align-items-center">
          <h2 className="ml-1">Requisition Approval</h2>
        </div>
        <div className="table-header-right">
          <ul className="d-flex flex-wrap">
            <li>
              <MasterFilter
                styles={{
                  marginRight: "10px",
                }}
                inputWidth="200px"
                width="200px"
                //   value={values?.search}
                value={""}
                setValue={() => {
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
                  columnsData={requisitionApprovalColumn(
                    "",
                    page,
                    paginationSize
                  )}
                  onRowClick={() => {
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
  );
};

export default RequisitionApprovalLanding;
