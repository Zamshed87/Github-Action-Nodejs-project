import { useState, useEffect } from "react";
import AllSelect from "./allSelect";
import { sortDataList } from "./helper";
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
  handleSortingData = null,
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
      if (handleSortingData !== null || typeof handleSortingData === "function")
        return;
      sortDataList(rowDto, state?.dataIndex, dataType);
    } else {
      const currentClickCount = (currentSortValue.clickCount + 1) % 3;
      setCurrentSortValue((prev) => ({
        ...prev,
        current: state?.dataIndex, // currentClickCount !== 0 ? state?.dataIndex : undefined,
        clickCount: currentClickCount,
      }));
      if (handleSortingData !== null || typeof handleSortingData === "function")
        return;
      if (currentClickCount === 1)
        sortDataList(rowDto, state?.dataIndex, dataType);
      else if (currentClickCount === 2)
        sortDataList(rowDto, state?.dataIndex, dataType, "desc");
      else sortDataList(rowDto, "initialSerialNumber", "number", "asc");
    }
  };

  useEffect(() => {
    if (
      currentSortValue?.current?.length > 0 &&
      (handleSortingData === null || typeof handleSortingData !== "function")
    ) {
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
              <Fragment key={index}>
                {/* {isCheckBox && index === 1 && (
                  // <th style={{ width: "15px" }}>
                  <AllSelect
                    rowDto={rowDto}
                    setRowDto={setRowDto}
                    checkedList={checkedList}
                    setCheckedList={setCheckedList}
                    uniqueKey={uniqueKey}
                  />
                  // </th>
                )} */}
                <th
                  style={{
                    minWidth: `${data?.width}px`,
                  }}
                  className={`${data?.sort ? "peopledeskTableHover" : ""}`}
                  onClick={() => {
                    if (data?.sort) {
                      handleSorting(data, data?.fieldType);
                      if (
                        handleSortingData !== null ||
                        typeof handleSortingData === "function"
                      ) {
                        const newIndex = !currentSortValue?.current
                          ? data.dataIndex
                          : currentSortValue.current;
                        const orderMapping = { 1: "desc", 2: "asc" };
                        const order =
                          orderMapping[currentSortValue?.clickCount] || "asc";

                        const obj = {
                          ...currentSortValue,
                          current: newIndex,
                          order,
                        };
                        handleSortingData?.(obj);
                      }
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
                      {isCheckBox && index === 1 && (
                        // <th style={{ width: "15px" }}>
                        <AllSelect
                          rowDto={rowDto}
                          setRowDto={setRowDto}
                          checkedList={checkedList}
                          setCheckedList={setCheckedList}
                          uniqueKey={uniqueKey}
                        />
                        // </th>
                      )}
                      <div
                        className={`${
                          isCheckBox && index === 1 ? "pl-2" : "pl-0"
                        }`}
                        style={{
                          display: "inline-block",
                        }}
                      >
                        {data?.title}
                      </div>
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
              key={index}
            >
              {columnData?.map((columnItem, index1) => {
                return (
                  <Fragment key={index1}>
                    {/* {isCheckBox && index1 === 1 && (
                      <td
                        style={{
                          width: `${columnItem?.width}px`,
                          padding: "0px 3px",
                        }}
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
                    )} */}
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
                    >
                      {isCheckBox && index1 === 1 && (
                        <div
                          style={{
                            display: "inline-block",
                            //   width: `${columnItem?.width}px`,
                            //   // padding: "0px 3px",
                          }}
                        >
                          <SingleSelect
                            index={index}
                            rowDto={rowDto}
                            setRowDto={setRowDto}
                            checkedList={checkedList}
                            setCheckedList={setCheckedList}
                            uniqueKey={uniqueKey}
                          />
                        </div>
                      )}
                      <div
                        className={`content tableBody-title ${
                          columnItem?.className
                        } ${isCheckBox && index1 === 1 ? "pl-2" : "pl-0"}`}
                        style={{
                          display: "inline-block",
                        }}
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
