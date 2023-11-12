import { Table } from "antd";
import React from "react";
import { TDataTableProps } from "./types";
import {
  compareValues,
  generateColumnWidth,
  generateFilters,
  generateOnFilter,
} from "./Utils";
import type { ColumnsType } from "antd/es/table";
import "./SDataTable.scss";
import NoResult from "common/NoResult";
import { paginationSize } from "common/AntTable";
export const DataTable: React.FC<TDataTableProps> = (property) => {
  const {
    wrapperClassName,
    customScrollBar,
    title,
    headerTitle,
    header,
    rowClassName,
    rowSelection,
    onHeaderRow,
    onRow,
    onChange,
    scroll,
    data,
    loading,
    bordered,
    components,
    pagination,
    summary,
    expandable,
    footer,
  } = property;
  // Pagination Default Value
  const pageSize = paginationSize || 25;

  // Adding Functionality
  const columnsModify: ColumnsType<any> = header.map((column: any) => {
    const modifiedColumn: any = {
      ...column,
    };
    // Adding width by title that provided by header
    if (column.title && !column.width) {
      modifiedColumn.width = generateColumnWidth(
        column.title,
        column.sorter,
        column.filter
      );
    }
    // Adding sorter functionality
    if (column.sorter) {
      modifiedColumn.sorter = (a: any, b: any) =>
        compareValues(
          a[column.dataIndex],
          b[column.dataIndex],
          column.dataType
        );
    }
    // Adding filter functionality
    if (column.filter) {
      modifiedColumn.filters = column.dataIndex
        ? generateFilters(column.dataIndex, data)
        : undefined;
      modifiedColumn.onFilter = generateOnFilter(column.dataIndex);

      // Adding search filter functionality
      if (column.searchFilter) modifiedColumn.filterSearch = true;
    }
    return modifiedColumn;
  });

  return (
    <>
      <div
        className={`data_table ${wrapperClassName ? wrapperClassName : ""} ${
          customScrollBar === "thin" ? "scroll_bar_thin" : ""
        }${!data?.length ? "hidden_scroolbar" : ""}`}
      >
        {title ? <h6 className="table_title">{title}</h6> : ""}
        {data?.length ? (
          <Table
            bordered={bordered}
            title={headerTitle}
            columns={columnsModify}
            dataSource={data}
            loading={loading}
            rowClassName={rowClassName}
            rowSelection={
              rowSelection &&
              (rowSelection?.isActive || rowSelection?.isActive === undefined)
                ? rowSelection
                : undefined
            }
            scroll={scroll ? scroll : { y: 465, x: "100%" }}
            onHeaderRow={onHeaderRow}
            onRow={onRow}
            pagination={
              pagination
                ? {
                    ...pagination,
                    size: pagination.size || "small",
                    showSizeChanger:
                      pagination.showSizeChanger === undefined ||
                      pagination.showSizeChanger ||
                      true,
                    pageSize: pagination.pageSize || pageSize,

                    pageSizeOptions: pagination.pageSizeOptions || [
                      "25",
                      "100",
                      "500",
                    ],
                    total: pagination.total,
                    defaultCurrent: pagination.defaultCurrent || 1,
                  }
                : false
            }
            components={components}
            onChange={onChange}
            summary={summary}
            footer={footer}
            expandable={expandable}
            rowKey={(record) => record?.key}
          />
        ) : (
          <NoResult title={"No Data Found"} para={""} />
        )}
      </div>
    </>
  );
};

export default DataTable;
