import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TablePagination,
} from "@mui/material";

export default function LandingTable({
  headers,
  body,
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  rowsPerPageOptions,
  isPaginatable = true,
  tableStyle,
  values,
  setPaginationHandler,
  count,
}) {
  const [_pageNo, _setPageNo] = useState(0);
  const [_pageSize, _setPageSize] = useState(15);
  // handleChangePage
  const handleChangePage = (event, newPage) => {
    setPageNo ? setPageNo(newPage) : _setPageNo(newPage);
    setPaginationHandler &&
      setPaginationHandler(newPage + 1, pageSize || _pageSize, values);
  };
  //handleChangeRowsPerPage
  const handleChangeRowsPerPage = (event) => {
    setPageSize
      ? setPageSize(+event.target.value)
      : _setPageSize(+event.target.value);
    setPageNo ? setPageNo(0) : _setPageNo(0);
    setPaginationHandler &&
      setPaginationHandler(1, parseInt(event.target.value), values);
  };

  return (
    <>
      <TableContainer className="landing-global-table">
        <Table sx={tableStyle} aria-label="simple table">
          <TableHead>{headers}</TableHead>
          <TableBody>{body}</TableBody>
        </Table>
      </TableContainer>
      {isPaginatable && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions || [5, 10, 15, 25, 100]}
          component="div"
          count={count}
          rowsPerPage={pageSize || _pageSize}
          page={pageNo || _pageNo}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </>
  );
}
