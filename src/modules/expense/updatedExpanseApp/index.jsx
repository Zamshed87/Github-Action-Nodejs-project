import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { monthFirstDate, monthLastDate } from "../../../utility/dateFormatter";
import {
  expenseLandingTableColumn,
  onGetExpenseApplicationLanding,
} from "./helper";
import PeopleDeskTable, {
  paginationSize,
} from "../../../common/peopleDeskTable";
import DefaultInput from "../../../common/DefaultInput";

const initData = {
  search: "",
  filterFromDate: monthFirstDate(),
  filterToDate: monthLastDate(),
};

const UpdateExpenseApplication = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const debounce = useDebounce();

  const { buId, wgId, employeeId, intWorkplaceId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // const [, getExpenseApplication, loading] = useAxiosGet([]);

  const [, setfilterAnchorEl] = useState(null);
  // row data
  const [rowDto, setRowDto] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // const [page, setPage] = useState(1);
  // const [paginationSize, setPaginationSize] = useState(15);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Expense Application";
  }, []);

  // const getData = (
  //   orgId,
  //   buId,
  //   search = "",
  //   docType = "",
  //   fromDate,
  //   toDate
  // ) => {
  //   let searchTxt = search ? `&strSearchTxt=${search}` : "";
  //   let docTypeTxt = docType ? `&strDocFor=${docType}` : "";
  //   const filterDate = `&dteFromDate=${fromDate}&dteToDate=${toDate}`;

  //   getExpenseApplication(
  //     `/Employee/ExpenseApplicationLanding?strPartName=Landing&intAccountId=${orgId}&intWorkplaceGroupId=${wgId}&intBusinessUnitId=${buId}&intEmployeeId=${employeeId}${filterDate}${searchTxt}${docTypeTxt}`,
  //     (data) => {
  //       setRowDto([...data]);
  //     }
  //   );
  // };

  const { values, setFieldValue } = useFormik({
    initialValues: initData,
  });

  const getData = (pagination) => {
    onGetExpenseApplicationLanding(
      buId,
      wgId,
      values?.filterFromDate || "",
      values?.filterToDate || "",
      "",
      setRowDto,
      setLoading,
      pagination?.current,
      pagination?.pageSize,
      setPages,
      employeeId,
      intWorkplaceId
    );
  };

  useEffect(() => {
    onGetExpenseApplicationLanding(
      buId,
      wgId,
      values?.filterFromDate || "",
      values?.filterToDate || "",
      "",
      setRowDto,
      setLoading,
      1,
      paginationSize,
      setPages,
      employeeId,
      intWorkplaceId
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, intWorkplaceId]);

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData({
      current: newPage,
      pageSize: pages?.pageSize,
      total: pages?.total,
    });
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData({
      current: 1,
      pageSize: +event.target.value,
      total: pages?.total,
    });
  };

  return (
    <>
      {loading && <Loading />}
      <div className="table-card">
        <div className="table-card-heading">
          <div className="d-flex align-items-center"></div>
          <ul className="d-flex flex-wrap">
            {(isFilter || status) && (
              <li>
                <ResetButton
                  classes="btn-filter-reset"
                  title="reset"
                  icon={
                    <SettingsBackupRestoreOutlined
                      sx={{ marginRight: "10px", fontSize: "16px" }}
                    />
                  }
                  styles={{
                    marginRight: "16px",
                  }}
                  onClick={() => {
                    setIsFilter(false);
                    setFieldValue("search", "");
                    setStatus("");
                    getData(pages);
                  }}
                />
              </li>
            )}
            <li>
              <MasterFilter
                styles={{
                  marginRight: "10px",
                }}
                inputWidth="200px"
                width="200px"
                value={values?.search}
                setValue={(value) => {
                  setFieldValue("search", value);
                  debounce(() => {
                    getData(pages);
                  }, 500);
                }}
                cancelHandler={() => {
                  setFieldValue("search", "");
                  getData(pages);
                }}
                isHiddenFilter
                handleClick={(e) => setfilterAnchorEl(e.currentTarget)}
              />
            </li>
            <li>
              <PrimaryButton
                type="button"
                className="btn btn-default flex-center"
                label="Request Expense"
                icon={
                  <AddOutlined
                    sx={{
                      marginRight: "0px",
                      fontSize: "15px",
                    }}
                  />
                }
                onClick={() => {
                  history.push(
                    `/SelfService/expense/expenseApplication/create`
                  );
                }}
              />
            </li>
          </ul>
        </div>
        <div className="table-card-body">
          <div className="card-style pb-0 mb-2" style={{ marginTop: "12px" }}>
            <div className="row">
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>From Date</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.filterFromDate}
                    placeholder="Month"
                    name="toDate"
                    max={values?.filterToDate}
                    type="date"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("filterFromDate", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>To Date</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.filterToDate}
                    placeholder="Month"
                    name="toDate"
                    min={values?.filterFromDate}
                    type="date"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("filterToDate", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <button
                  className="btn btn-green btn-green-disable mt-4"
                  type="button"
                  disabled={!values?.filterFromDate || !values?.filterToDate}
                  onClick={() => {
                    onGetExpenseApplicationLanding(
                      buId,
                      wgId,
                      values?.filterFromDate || "",
                      values?.filterToDate || "",
                      values?.search || "",
                      setRowDto,
                      setLoading,
                      1,
                      paginationSize,
                      setPages,
                      employeeId,
                      intWorkplaceId
                    );
                  }}
                >
                  View
                </button>
              </div>
            </div>
          </div>

          {rowDto?.length > 0 ? (
            <PeopleDeskTable
              columnData={expenseLandingTableColumn(
                pages?.current,
                pages?.pageSize,
                history
              )}
              pages={pages}
              rowDto={rowDto}
              setRowDto={setRowDto}
              handleChangePage={(e, newPage) =>
                handleChangePage(e, newPage, values?.search)
              }
              handleChangeRowsPerPage={(e) =>
                handleChangeRowsPerPage(e, values?.search)
              }
              uniqueKey="expenseId"
              isCheckBox={false}
              isScrollAble={true}
              onRowClick={(item) => {
                history.push(
                  `/SelfService/expense/expenseApplication/view/${item?.expenseId}`
                );
              }}
            />
          ) : (
            <>
              {!loading && (
                <div className="col-12">
                  <NoResult title={"No Data Found"} para={""} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateExpenseApplication;

// old table
/*   <table className="table">
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>SL</th>
                              <th style={{ width: "150px" }}>
                                <div
                                  className="d-flex align-items-center pointer"
                                  onClick={() => {
                                    setExpenseTypeOrder(
                                      expenseTypeOrder === "desc"
                                        ? "asc"
                                        : "desc"
                                    );
                                    commonSortByFilter(
                                      expenseTypeOrder,
                                      "strExpenseType"
                                    );
                                  }}
                                >
                                  Expense Type
                                  <div>
                                    <SortingIcon
                                      viewOrder={expenseTypeOrder}
                                    ></SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th style={{ width: "150px" }}>
                                <div
                                  className="d-flex align-items-center pointer"
                                  onClick={() => {
                                    setDateOrder(
                                      dateOrder === "desc" ? "asc" : "desc"
                                    );
                                    commonSortByFilter(
                                      dateOrder,
                                      "dteExpenseDate"
                                    );
                                  }}
                                >
                                  To Date
                                  <div>
                                    <SortingIcon
                                      viewOrder={dateOrder}
                                    ></SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th style={{ width: "150px" }}>
                                <div
                                  className="d-flex align-items-center pointer  text-right"
                                  onClick={() => {
                                    setExpenseAmountOrder(
                                      expenseAmountOrder === "desc"
                                        ? "asc"
                                        : "desc"
                                    );
                                    commonSortByFilter(
                                      expenseAmountOrder,
                                      "numExpenseAmount"
                                    );
                                  }}
                                >
                                  Expense Amount
                                  <div>
                                    <SortingIcon
                                      viewOrder={expenseAmountOrder}
                                    ></SortingIcon>
                                  </div>
                                </div>
                              </th>

                              <th style={{ width: "120px" }}></th>
                              <th>
                                <div className="d-flex align-items-center">
                                  Reason
                                </div>
                              </th>

                              <th style={{ width: "150px" }}>
                                <div className="table-th d-flex align-items-center">
                                  Status
                                  <span>
                                    <Select
                                      sx={{
                                        "& .MuiOutlinedInput-notchedOutline": {
                                          border: "none !important",
                                        },
                                        "& .MuiSelect-select": {
                                          paddingRight: "22px !important",
                                          marginTop: "-15px",
                                        },
                                      }}
                                      className="selectBtn"
                                      name="status"
                                      IconComponent={ArrowDropDown}
                                      value={values?.status}
                                      onChange={(e) => {
                                        setFieldValue("status", "");
                                        setStatus(e.target.value?.label);
                                        statusTypeFilter(e.target.value?.label);
                                      }}
                                    >
                                      {statusDDL?.length > 0 &&
                                        statusDDL?.map((item, index) => {
                                          return (
                                            <MenuItem key={index} value={item}>
                                              {item?.label}
                                            </MenuItem>
                                          );
                                        })}
                                    </Select>
                                  </span>
                                </div>
                              </th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((item, index) => {
                              return (
                                <>
                                  <tr
                                    key={index}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      history.push(
                                        `/SelfService/expense/expenseApplication/view/${item?.ExpenseId}`
                                      );
                                    }}
                                    style={{
                                      cursor: "pointer",
                                    }}
                                  >
                                    <td>
                                      <p className="tableBody-title pl-1">
                                        {index + 1}
                                      </p>
                                    </td>
                                    <td>
                                      <div className="content tableBody-title">
                                        {item?.strExpenseType}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="content tableBody-title">
                                        {dateFormatter(item?.dteExpenseDate)}
                                      </div>
                                    </td>
                                    <td>
                                      <div
                                        className="content tableBody-title text-right"
                                        style={{ width: "110px" }}
                                      >
                                        {numberWithCommas(
                                          item?.numExpenseAmount
                                        )}
                                      </div>
                                    </td>
                                    <td></td>
                                    <td>
                                      <div className="content tableBody-title text-left">
                                        {item?.strDiscription}
                                      </div>
                                    </td>
                                    <td>
                                      {item?.Status === "Approved" && (
                                        <Chips
                                          label="Approved"
                                          classess="success p-2"
                                        />
                                      )}
                                      {item?.Status === "Pending" && (
                                        <Chips
                                          label="Pending"
                                          classess="warning p-2"
                                        />
                                      )}
                                      {item?.Status === "Process" && (
                                        <Chips
                                          label="Process"
                                          classess="primary p-2"
                                        />
                                      )}
                                      {item?.Status === "Rejected" && (
                                        <>
                                          <Chips
                                            label="Rejected"
                                            classess="danger p-2 mr-2"
                                          />
                                          {item?.RejectedBy && (
                                            <LightTooltip
                                              title={
                                                <div className="p-1">
                                                  <div className="mb-1">
                                                    <p
                                                      className="tooltip-title"
                                                      style={{
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                      }}
                                                    >
                                                      Rejected by{" "}
                                                      {item?.RejectedBy}
                                                    </p>
                                                  </div>
                                                </div>
                                              }
                                              arrow
                                            >
                                              <InfoOutlined
                                                sx={{
                                                  color: gray900,
                                                }}
                                              />
                                            </LightTooltip>
                                          )}
                                        </>
                                      )}
                                    </td>
                                    <td width="60px">
                                      <div className="d-flex">
                                        {item?.Status === "Pending" && (
                                          <Tooltip title="Edit" arrow>
                                            <button
                                              className="iconButton"
                                              type="button"
                                            >
                                              <EditOutlined
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  history.push(
                                                    `/SelfService/expense/expenseApplication/edit/${item?.ExpenseId}`
                                                  );
                                                }}
                                              />
                                            </button>
                                          </Tooltip>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              );
                            })}
                          </tbody>
                        </table> */
