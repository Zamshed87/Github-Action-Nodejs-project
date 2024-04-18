import React from "react";
import AntTable from "../../../../../common/AntTable";
import { employeeListColumn } from "../helper";

export default function NotAssigned({
  rowDto,
  index,
  tabIndex,
  setRowDto,
  page,
  paginationSize,
  setFilterData,
  setPage,
  setPaginationSize,
  filterData,
}) {
  return (
    index === tabIndex && (
      <>
        <AntTable
          data={rowDto}
          columnsData={employeeListColumn(
            rowDto,
            filterData,
            setFilterData,
            setRowDto,
            page,
            paginationSize
            // 15
          )}
          setColumnsData={(dataRow) => {
            if (dataRow?.length === rowDto?.length) {
              const temp = dataRow?.map((item) => {
                return {
                  ...item,
                  selectCheckbox: false,
                };
              });
              setFilterData(temp);
              setRowDto(temp);
            } else {
              setFilterData(dataRow);
            }
          }}
          onRowClick={() => {
            // history.push(
            //   `/profile/iOU/application/${item?.intIOUId}`
            // );
          }}
          rowClassName="pointer"
          setPage={setPage}
          setPaginationSize={setPaginationSize}
        />
      </>
    )
  );
}
