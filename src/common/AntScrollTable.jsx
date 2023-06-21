import { Table } from "antd";
import _ from "lodash";
import React, { useState } from "react";
import { antFilterData } from "../utility/AntFIlterData";
import { dateFormatter } from "../utility/dateFormatter";
import { AntPageSize } from "./AntTable";

const AntScrollTable = ({
  data,
  columnsData,
  setColumnsData,
  removePagination = false,
  x,
  y,
  onRowClick,
  rowClassName,
  setPage,
  setPaginationSize,
  handleTableChange,
  pages,
  pagination,
}) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [filterList, setFIlterList] = useState([...data]);

  // const [sortedInfo, setSortedInfo] = useState({});

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
          : (a, b) => a?.[item?.dataIndex].length - b?.[item?.dataIndex].length
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
      filteredValue: filteredInfo?.[item?.dataIndex] || null,
      onFilter: (value, record) =>
        item?.isDate
          ? dateFormatter(record?.[item?.dataIndex]) === value
          : record?.[item?.dataIndex] === value,
      filterSearch: true,
    };
  });

  const handleChange = (pagination, filters, sorter, newRowDto) => {
    setFilteredInfo(filters);
    // setSortedInfo(sorter);
    setColumnsData?.(newRowDto?.currentDataSource);
    setFIlterList?.(newRowDto?.currentDataSource);
    handleTableChange?.({ pagination, filters, sorter, newRowDto });
  };

  return (
    <div>
      <Table
        rowKey={(record, index) => index + 1}
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
                pageSizeOptions: ["25", "100", "500"],
              }
            : {
                onChange(current, pageSize) {
                  setPage && setPage(current);
                  setPaginationSize && setPaginationSize(pageSize);
                },
                defaultPageSize: pages ? pages : AntPageSize,
                showSizeChanger: true,
                pageSizeOptions: ["25", "100", "500"],
              }
        }
        scroll={{
          y: y || 500,
          x: x || 1000,
        }}
        onRow={(dataRow, index) => {
          return {
            onClick: (e) => {
              e.stopPropagation();
              onRowClick?.(dataRow, index);
            },
          };
        }}
        rowClassName={rowClassName || ""}
      />
    </div>
  );
};

export default AntScrollTable;
