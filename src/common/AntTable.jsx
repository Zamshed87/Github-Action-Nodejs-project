/* eslint-disable no-unused-vars */
import { Table } from "antd";
import _ from "lodash";
import React, { useState } from "react";
import { antFilterData } from "../utility/AntFIlterData";
import { dateFormatter } from "../utility/dateFormatter";

export const AntPageSize = 25;
export const paginationSize = 25;

const AntTable = ({
  data,
  columnsData,
  setColumnsData,
  removePagination = false,
  isScroll,
  y,
  x,
  onRowClick,
  rowClassName,
  rowKey,
  setPage,
  setPaginationSize,
  handleTableChange,
  pages,
  pagination,
}) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [filterList, setFIlterList] = useState([...data]);

  let columns = columnsData.map((item) => {
    return {
      ...item,
      sorter: item?.sorter
        ? item?.isNumber
          ? (a, b) => a?.[item?.dataIndex] - b?.[item?.dataIndex]
          : item?.isDate
          ? (a, b) => {
              return (
                new Date(dateFormatter(a?.[item?.dataIndex])) -
                new Date(dateFormatter(b?.[item?.dataIndex]))
              );
            }
          : (a, b) => a?.[item?.dataIndex]?.length - b?.[item?.dataIndex]?.length
        : "",
      filters: item?.filter
        ? item?.isDate
          ? _.uniqWith(
              antFilterData(filterList)((i) =>
                dateFormatter(i?.[item?.dataIndex])
              ),
              _.isEqual
            )
          : _.uniqWith(
              antFilterData(filterList)((i) => i?.[item?.dataIndex]),
              _.isEqual
            )
        : "",
      filteredValue: item?.resetFilter ? null : filteredInfo?.[item?.dataIndex] || null,
      onFilter: (value, record) =>
        item?.isDate
          ? dateFormatter(record?.[item?.dataIndex]) === value
          : record?.[item?.dataIndex] === value,
      filterSearch: true,
    };
  });

  const handleChange = (pagination, filters, sorter, newRowDto, action) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
    setColumnsData?.(newRowDto?.currentDataSource);
    setFIlterList?.(newRowDto?.currentDataSource);
    handleTableChange?.({ pagination, filters, sorter, newRowDto });
  };
  return (
    <div>
      <Table
        size="small"
        columns={columns}
        dataSource={data}
        onChange={handleChange}
        pagination={
          removePagination
            ? !removePagination
            : pagination
            ? {
                ...pagination,
                totalBoundaryShowSizeChanger: 25,
                pageSizeOptions: ["25", "100", "500", "1000"],
              }
            : {
                onChange(current, pageSize) {
                  setPage?.(current);
                  setPaginationSize?.(pageSize);
                },
                defaultPageSize: pages ? pages : AntPageSize,
                showSizeChanger: true,
                pageSizeOptions: ["25", "100", "500", "1000"],
              }
        }
        onRow={(dataRow, index) => {
          return {
            onClick: (e) => {
              e.stopPropagation();
              onRowClick?.(dataRow, index);
            },
          };
        }}
        rowKey={rowKey}
        rowClassName={rowClassName || ""}
      />
    </div>
  );
};

export default AntTable;
