import { TablePaginationConfig } from "antd";
import type { ColumnsType } from "antd/es/table";

export type TDataTableProps = {
  wrapperClassName?: string;
  customScrollBar?: "thin";
  title?: string | JSX.Element;
  headerTitle?: (pageData: any) => JSX.Element | string;
  header: ColumnsType<any>;
  data: any[];
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
      originNode: React.ReactNode
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
    onClick: (event: any) => {}; // click row
    onDoubleClick: (event: any) => {}; // double click row
    onContextMenu: (event: any) => {}; // right button click row
    onMouseEnter: (event: any) => {}; // mouse enter row
    onMouseLeave: (event: any) => {}; // mouse leave row
    className?: string; // className for this row
  };
  components?: any;
  scroll?: {
    scrollToFirstRowOnChange?: boolean;
    x?: number | string | true;
    y?: number | string;
  };
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => any;
  summary?: (pageData: any) => JSX.Element | string;
  footer?: (pageData: any) => JSX.Element | string;
  expandable?: {
    expandedRowRender?: (record: any, index: number) => JSX.Element;
    rowExpandable?: (record: any) => boolean;
    expandRowByClick?: boolean;
    expandIcon?: (props: any) => JSX.Element;
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
