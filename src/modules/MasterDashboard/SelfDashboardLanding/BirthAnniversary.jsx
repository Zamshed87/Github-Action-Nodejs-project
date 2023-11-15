import React from "react";
import AntTable from "../../../common/AntTable";
import { workannivarsayList } from "../../dashboard/helper";


export default function BirthAnnivarsay({
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
          removePagination={true}
          columnsData={workannivarsayList(
            rowDto,
            filterData,
            setFilterData,
            setRowDto,
  
          )}
          setColumnsData={(dataRow) => {
            if (dataRow?.length === rowDto?.length) {
              let temp = dataRow?.map((item) => {
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
        />
      </>
    )
  );
}
