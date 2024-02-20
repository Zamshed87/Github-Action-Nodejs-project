import { TablePaginationConfig } from "antd";
import type { ColumnsType } from "antd/es/table";
import React from "react";

export type TDataTableProps = {
  customPaginationSize?: number;
  wrapperClassName?: string;
  customScrollBar?: "thin";
  title?: string | React.ReactElement;
  headerTitle?: (pageData: any) => React.ReactElement | string;
  header: ColumnsType<any> | any;
  data: any[];
  filterData?: Record<string, unknown>;
  rowClassName?: (record: any, index: number) => string;
  rowSelection?: {
    isActive?: boolean;
    type?: "checkbox" | "radio";
    hideSelectAll?: boolean;
    onChange?: (selectedRowKeys: any, selectedRows: any) => any;
    getCheckboxProps?: (record: any) => any;
    selectedRowKeys?: string[] | number[];
    onSelect?: (
      record: any,
      selected: any,
      selectedRows: any,
      nativeEvent: any
    ) => any;

    onSelectAll?: (selected: any, selectedRows: any, changeRows: any) => any;
    checkStrictly?: boolean;
    selections?: [] | boolean;
    render?: (
      checked: boolean,
      record: any,
      index: number,
      originNode: React.ReactElement
    ) => any;
  };
  onHeaderRow?: (
    record: any,
    rowIndex: any
  ) => {
    onClick?: (event: any) => any;
    onMouseEnter?: (event: any) => any;
    onMouseLeave?: (event: any) => any;
    className?: "lightBlue" | string;
  };
  onRow?: (
    record: any,
    rowIndex: any
  ) => {
    onClick?: (event: any) => any; // click row
    onDoubleClick?: (event: any) => any; // double click row
    onContextMenu?: (event: any) => any; // right button click row
    onMouseEnter?: (event: any) => any; // mouse enter row
    onMouseLeave?: (event: any) => any; // mouse leave row
    className?: string; // className for this row
  };
  components?: any;
  scroll?: {
    scrollToFirstRowOnChange?: boolean;
    x?: number | string | true;
    y?: number | string;
  };
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => any;
  summary?: (pageData: any) => React.ReactElement | string;
  footer?: (pageData: any) => React.ReactElement | string;
  expandable?: {
    expandedRowRender?: (record: any, index: number) => React.ReactElement;
    rowExpandable?: (record: any) => boolean;
    expandRowByClick?: boolean;
    expandIcon?: (props: any) => React.ReactElement;
    expandedRowClassName?: (record: any, index: number) => string;
    defaultExpandAllRows?: boolean;
    defaultExpandedRowKeys?: string[] | number[];
    expandedRowKeys?: string[] | number[];
    onExpand?: (expanded: boolean, record: any) => any;
    onExpandedRowsChange?: (expandedRows: any) => any;
    expandIconColumnIndex?: number;
  };
  pagination?: TablePaginationConfig;
  bordered?: boolean;
  loading?: boolean;
};

// Table Button Types
export type buttonType =
  | "edit"
  | "delete"
  | "view"
  | "info"
  | "plus"
  | "calender"
  | "reload"
  | "dollar";
export type buttonList = {
  isActive?: boolean;
  type: buttonType;
  onClick?: (e: any) => any;
  prompt?: string;
};
export type TableButtonType = {
  buttonsList: buttonList[];
  parentStyle?: React.CSSProperties;
};
