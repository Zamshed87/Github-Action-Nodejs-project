import { useState, useEffect } from "react";
import AllSelect from "./allSelect";
import { sortDataList, uuid } from "./helper";
import {
  gray300,
  gray50,
  greenColor,
  successColor,
} from "../../utility/customColor";
import SingleSelect from "./singleSelect";
import { AiFillFilter } from "react-icons/ai";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { Fragment } from "react";

const TableContent = ({
  pages,
  columnData,
  rowDto,
  setRowDto,
  checkedList,
  setCheckedList,
  checkedHeaderList,
  filterOrderList,
  onRowClick,
  uniqueKey,
  isCheckBox,
  setAnchorEl,
  setCurrentFilterSelection,
}) => {
  const [currentSortValue, setCurrentSortValue] = useState({
    current: undefined,
    dataType: "",
    clickCount: 0,
  });

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
      else sortDataList(rowDto, "initialSerialNumber", "number", "asc");
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
      <thead>
        <tr>
          {columnData?.map((data, index) => {
            return (
              <Fragment>
                {isCheckBox && index === 1 && (
                  <th style={{ width: "15px" }} key={uuid()}>
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
                  key={uuid()}
                  style={{
                    minWidth: `${data?.width}px`,
                  }}
                  className={`${data?.sort ? "peopledeskTableHover" : ""}`}
                  onClick={() => {
                    if (data?.sort) {
                      handleSorting(data, data?.fieldType);
                    }
                  }}
                >
                  {filterOrderList?.length &&
                  filterOrderList[filterOrderList?.length - 1] ===
                    data?.dataIndex ? (
                    <div
                      style={{
                        width: "0",
                        height: "0",
                        borderLeft: "5px solid transparent",
                        borderRight: "5px solid transparent",
                        borderBottom: "5px solid #f76565",
                        transform: "rotate(45deg)",
                        position: "absolute",
                        top: "0",
                        right: "-4px",
                      }}
                    ></div>
                  ) : (
                    <></>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: `${data?.sort ? "pointer" : "default"}`,
                    }}
                  >
                    <div
                      className={`${data?.className ? data?.className : ""}`}
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
                          <IoMdArrowDropup
                            style={{
                              width: "14px",
                              height: "14px",
                              color: `${
                                currentSortValue.clickCount === 1 &&
                                currentSortValue.current === data?.dataIndex
                                  ? greenColor
                                  : gray300
                              }`,
                            }}
                          />
                          <IoMdArrowDropdown
                            style={{
                              width: "14px",
                              height: "14px",
                              marginTop: "-6px",
                              color: `${
                                currentSortValue.clickCount === 2 &&
                                currentSortValue.current === data?.dataIndex
                                  ? greenColor
                                  : gray300
                              }`,
                            }}
                          />
                        </div>
                      )}

                      {data?.filter && (
                        <div>
                          <AiFillFilter
                            style={{
                              width: "14px",
                              height: "14px",
                              color: `${
                                checkedHeaderList[`${data?.dataIndex}List`]
                                  ?.length > 0
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
              </Fragment>
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
                if (typeof onRowClick === "function") onRowClick(rowDto[index]);
              }}
              key={uuid()}
            >
              {columnData?.map((columnItem, index1) => {
                return (
                  <Fragment key={uuid()}>
<<<<<<< HEAD
                    {/* {isCheckBox && index1 === 1 && (
=======
                    {isCheckBox && index1 === 1 && (
>>>>>>> c852bc5c0f4378629a443fa17736951a8dc44ec5
                      <td
                        style={{
                          width: `${columnItem?.width}px`,
                          padding: "0px 3px",
                        }}
                        key={uuid()}
                      >
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
                        padding: "0px 3px",
                        backgroundColor: `${
                          currentSortValue?.current === columnItem?.dataIndex &&
                          index1 !== 0
                            ? gray50
                            : ""
                        }`,
                      }}
                      key={uuid()}
                    >
                      <div
                        className={`content tableBody-title ${columnItem?.className}`}
                      >
                        {columnItem?.render
                          ? columnItem.render(rowDto[index], index)
                          : rowDto[index][columnItem.dataIndex]}
                      </div>
                    </td>
                  </Fragment>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </>
  );
};

export default TableContent;
