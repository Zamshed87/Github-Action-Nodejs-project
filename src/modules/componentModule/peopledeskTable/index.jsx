import AllSelect from "./allSelect";
import PopoverDropdown from "./popoverDropdown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  gray300,
  gray50,
  greenColor,
  successColor,
} from "../../../utility/customColor";
import SingleSelect from "./singleSelect";
import { useEffect, useState } from "react";
import { sortDataList } from "./helper";
import { MenuItem, Pagination, Select } from "@mui/material";
import NoResult from "../../../common/NoResult";

const PeopleDeskTable = ({
  columnData,
  pages,
  rowDto,
  setRowDto,
  checkedList,
  setCheckedList,
  checkedHeaderList,
  setCheckedHeaderList,
  handleChangePage,
  handleChangeRowsPerPage,
  uniqueKey,
  getFilteredData,
  onRowClick,
  isCheckBox = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentFilterSelection, setCurrentFilterSelection] = useState(null);
  const [currentSortValue, setCurrentSortValue] = useState({
    current: undefined,
    dataType: "",
    clickCount: 0,
  });

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleSorting = (state, dataType = "string") => {
    if (state?.dataIndex !== currentSortValue.current) {
      setCurrentSortValue({
        current: state.dataIndex,
        dataType: dataType,
        clickCount: 1,
      });
      sortDataList(rowDto, state?.dataIndex, dataType);
    } else {
      const currentClickCount = (currentSortValue.clickCount + 1) % 3;
      setCurrentSortValue((prev) => ({
        ...prev,
        current: currentClickCount !== 0 ? state?.dataIndex : undefined,
        clickCount: currentClickCount,
      }));

      if (currentClickCount === 1)
        sortDataList(rowDto, state?.dataIndex, dataType);
      else if (currentClickCount === 2)
        sortDataList(rowDto, state?.dataIndex, dataType, "desc");
    }
  };

  useEffect(() => {
    if (currentSortValue?.current?.length > 0) {
      if (currentSortValue?.clickCount === 1)
        sortDataList(
          rowDto,
          currentSortValue?.current,
          currentSortValue?.dataType
        );
      else if (currentSortValue?.clickCount === 2)
        sortDataList(
          rowDto,
          currentSortValue?.current,
          currentSortValue?.dataType,
          "desc"
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, rowDto]);

  return (
    <>
      <div className="table-card-body">
        <div className="table-card-styled employee-table-card tableOne">
          <table className="table">
            <thead>
              <tr>
                {columnData?.map((data, index) => {
                  return (
                    <>
                      {isCheckBox && index === 1 && (
                        <th style={{ width: "15px" }}>
                          <AllSelect
                            rowDto={rowDto}
                            setRowDto={setRowDto}
                            checkedList={checkedList}
                            setCheckedList={setCheckedList}
                            uniqueKey={uniqueKey}
                          />
                        </th>
                      )}
                      <th
                        style={{
                          width: `${data?.width}px`,
                        }}
                        className={`${
                          data?.sort ? "peopledeskTableHover" : ""
                        }`}
                        onClick={() => {
                          if (data?.sort) {
                            handleSorting(data, data?.fieldType);
                          }
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: `${data?.sort ? "pointer" : "default"}`,
                          }}
                        >
                          <div
                            className={`${
                              data?.className ? data?.className : ""
                            }`}
                          >
                            {data?.title}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: "3px",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {data?.sort && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <ArrowDropUpIcon
                                  style={{
                                    width: "17px",
                                    height: "17px",
                                    color: `${
                                      currentSortValue.clickCount === 1 &&
                                      currentSortValue.current ===
                                        data?.dataIndex
                                        ? greenColor
                                        : gray300
                                    }`,
                                  }}
                                />
                                <ArrowDropDownIcon
                                  style={{
                                    width: "17px",
                                    height: "17px",
                                    marginTop: "-10px",
                                    color: `${
                                      currentSortValue.clickCount === 2 &&
                                      currentSortValue.current ===
                                        data?.dataIndex
                                        ? greenColor
                                        : gray300
                                    }`,
                                  }}
                                />
                              </div>
                            )}

                            {data?.filter && (
                              <div>
                                <FilterAltIcon
                                  style={{
                                    width: "17px",
                                    height: "17px",
                                    color: `${
                                      checkedHeaderList[
                                        `${data?.dataIndex}List`
                                      ]?.length > 0
                                        ? successColor
                                        : gray300
                                    }`,
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    setCurrentFilterSelection(index);
                                    setAnchorEl(e.currentTarget);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </th>
                    </>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {[...Array(rowDto?.length || 0)].map((_, index) => {
                return (
                  <tr
                    style={{
                      cursor: `${
                        typeof onRowClick === "function" ? "pointer" : "default"
                      }`,
                    }}
                    onClick={() => {
                      if (typeof onRowClick === "function")
                        onRowClick(rowDto[index]);
                    }}
                  >
                    {columnData?.map((columnItem, index1) => {
                      return (
                        <>
                          {isCheckBox && index1 === 1 && (
                            <td style={{ width: `${columnItem?.width}px` }}>
                              <SingleSelect
                                index={index}
                                rowDto={rowDto}
                                setRowDto={setRowDto}
                                checkedList={checkedList}
                                setCheckedList={setCheckedList}
                                uniqueKey={uniqueKey}
                              />
                            </td>
                          )}
                          <td
                            style={{
                              width: `${columnItem?.width}px`,
                              backgroundColor: `${
                                currentSortValue?.current ===
                                  columnItem?.dataIndex && index1 !== 0
                                  ? gray50
                                  : ""
                              }`,
                            }}
                          >
                            <p
                              className={`content tableBody-title ${columnItem?.className}`}
                            >
                              {columnItem?.render
                                ? columnItem.render(rowDto[index], index)
                                : rowDto[index][columnItem.dataIndex]}
                            </p>
                          </td>
                        </>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rowDto?.length === 0 && (
            <div className="col-12 mt-5">
              <NoResult title={"No Data Found"} para={" "} />
            </div>
          )}
        </div>

        {rowDto?.length > 0 ? (
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
        getFilteredData={getFilteredData}
      />
    </>
  );
};

export default PeopleDeskTable;
