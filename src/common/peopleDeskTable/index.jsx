import { useState } from "react";
import { MenuItem, Pagination, Select } from "@mui/material";
import PopoverDropdown from "./popoverDropdown";
import ScrollablePeopleDeskTable from "./scrollablePeopleDeskTable";
import TableContent from "./tableContent";

export const paginationSize = 25;

const PeopleDeskTable = ({
  columnData,
  pages,
  rowDto,
  setRowDto,
  checkedList = [],
  setCheckedList = null,
  checkedHeaderList = {},
  setCheckedHeaderList = null,
  handleChangePage = null,
  handleChangeRowsPerPage = null,
  filterOrderList = [],
  setFilterOrderList = null,
  uniqueKey,
  getFilteredData = null,
  onRowClick = null,
  isCheckBox = false,
  isScrollAble = false,
  isPagination = true,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentFilterSelection, setCurrentFilterSelection] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <div className="table-card-body">
        {isScrollAble ? (
          <ScrollablePeopleDeskTable
            classes="salary-process-table"
            secondClasses="table-card-styled tableOne scroll-table-height"
          >
            <TableContent
              pages={pages}
              columnData={columnData}
              rowDto={rowDto}
              setRowDto={setRowDto}
              checkedList={checkedList}
              setCheckedList={setCheckedList}
              checkedHeaderList={checkedHeaderList}
              filterOrderList={filterOrderList}
              currentFilterSelection={currentFilterSelection}
              onRowClick={onRowClick}
              uniqueKey={uniqueKey}
              isCheckBox={isCheckBox}
              setAnchorEl={setAnchorEl}
              setCurrentFilterSelection={setCurrentFilterSelection}
            />
          </ScrollablePeopleDeskTable>
        ) : (
          <div className="table-card-styled employee-table-card tableOne">
            <table className="table">
              <TableContent
                pages={pages}
                columnData={columnData}
                rowDto={rowDto}
                setRowDto={setRowDto}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
                checkedHeaderList={checkedHeaderList}
                filterOrderList={filterOrderList}
                currentFilterSelection={currentFilterSelection}
                onRowClick={onRowClick}
                uniqueKey={uniqueKey}
                isCheckBox={isCheckBox}
                setAnchorEl={setAnchorEl}
                setCurrentFilterSelection={setCurrentFilterSelection}
              />
            </table>
          </div>
        )}

        {isPagination && rowDto?.length > 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <Select
              value={pages?.pageSize}
              onChange={handleChangeRowsPerPage}
              variant="outlined"
              size="small"
              sx={{ marginRight: "16px", fontSize: "14px" }}
            >
              <MenuItem value={25}>25 per page</MenuItem>
              <MenuItem value={50}>50 per page</MenuItem>
              <MenuItem value={100}>100 per page</MenuItem>
              <MenuItem value={500}>500 per page</MenuItem>
            </Select>
            <Pagination
              count={Math.ceil(pages?.total / pages?.pageSize)}
              page={pages.current}
              onChange={handleChangePage}
              size="small"
            />
          </div>
        ) : null}
      </div>

      <PopoverDropdown
        id={id}
        open={open}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        currentFilterSelection={currentFilterSelection}
        columnData={columnData}
        checkedHeaderList={checkedHeaderList}
        setCheckedHeaderList={setCheckedHeaderList}
        filterOrderList={filterOrderList}
        setFilterOrderList={setFilterOrderList}
        getFilteredData={getFilteredData}
      />
    </>
  );
};

export default PeopleDeskTable;
