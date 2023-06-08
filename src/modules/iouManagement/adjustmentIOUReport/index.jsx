/* eslint-disable react-hooks/exhaustive-deps */

import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import DefaultInput from "../../../common/DefaultInput";
import FilterBadgeComponent from "../../../common/FilterBadgeComponent";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import PopOverMasterFilter from "../../../common/PopoverMasterFilter";
import ResetButton from "../../../common/ResetButton";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PeopleDeskTable, { paginationSize } from "../../../common/peopleDeskTable";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { monthFirstDate, monthLastDate } from "../../../utility/dateFormatter";
import {
  iouLandingTableColumn
} from "../mgtIOUApplication/helper";
import SelfIOUFilterModal from "./component/SelfIOUFilterModal";
import { getAllIOULanding } from "./helper";

// status DDL

// adjustment status DDL

const initData = {
  search: "",

  // master filter
  applicationDate: "",
  filterFromDate: monthFirstDate(),
  filterToDate: monthLastDate(),
  status: "",
  adjustmentStatus: "",
};

export default function AdjustmentIOUReport() {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();

  // redux
  const { buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // state
  const [loading, setLoading] = useState(false);

  // landing table
  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const getData = (pagination) => {
    getAllIOULanding(
      "IOULandingForAccounts",
      buId,
      wgId,
      0,
      values?.filterFromDate || "",
      values?.filterToDate || "",
      values?.search || "",
      "",
      setRowDto,
      setLoading,
      pagination?.current,
      pagination?.pageSize,
    );
  };

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      }
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      }
    );
  };

  useEffect(() => {
    getAllIOULanding(
      "IOULandingForAccounts",
      buId,
      wgId,
      0,
      values?.filterFromDate || "",
      values?.filterToDate || "",
      values?.search || "",
      "",
      setRowDto,
      setLoading,
      1,
      paginationSize
    );
  }, [buId, wgId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // filter
  const [status, setStatus] = useState("");
  const [isFilter, setIsFilter] = useState(false);

  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const debounce = useDebounce();
  const openFilter = Boolean(filterAnchorEl);
  const id = openFilter ? "simple-popover" : undefined;

  const handleSearch = (values) => {
    getData(values);
    setFilterBages(values);
    setfilterAnchorEl(null);
  };
  const clearBadge = (values, name) => {
    const data = values;
    data[name] = "";
    setFilterBages(data);
    setFilterValues(data);
    handleSearch(data);
  };
  const clearFilter = () => {
    setFilterBages({});
    setFilterValues("");
    getAllIOULanding(
      "IOULandingForAccounts",
      buId,
      wgId,
      0,
      "",
      "",
      "",
      "",
      setRowDto,
      setLoading,
      1,
      paginationSize
    );
  };
  const getFilterValues = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  // useFormik
  const { resetForm, values, errors, touched, setFieldValue, dirty } =
    useFormik({
      initialValues: initData
    });

  // menu permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30275) {
      permission = item;
    }
  });

  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <>
          <div className="table-card">
            <div
              className="table-card-heading"
              style={{ marginBottom: "2px" }}
            >
              <div className="d-flex align-items-center">
                {rowDto?.length > 0 ? (
                  <>
                    <h6 className="count">
                      Total {rowDto?.length} employees
                    </h6>
                  </>
                ) : (
                  <>
                    <h6 className="count">Total result 0</h6>
                  </>
                )}
              </div>
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
                        setFieldValue("adjustmentStatus", "");
                        setStatus("");
                        getAllIOULanding(
                          "IOULandingForAccounts",
                          buId,
                          wgId,
                          0,
                          "",
                          "",
                          "",
                          "",
                          setRowDto,
                          setLoading,
                          1,
                          paginationSize
                        );
                      }}
                    />
                  </li>
                )}
                <li>
                  <MasterFilter
                    styles={{
                      marginRight: "0",
                    }}
                    isHiddenFilter
                    inputWidth="200px"
                    width="200px"
                    value={values?.search}
                    setValue={(value) => {
                      setFieldValue("search", value);
                      debounce(() => {
                        getAllIOULanding(
                          "IOULandingForAccounts",
                          buId,
                          wgId,
                          0,
                          values?.filterFromDate || "",
                          values?.filterToDate || "",
                          value || "",
                          "",
                          setRowDto,
                          setLoading,
                          1,
                          paginationSize,
                        );
                      }, 500);
                    }}
                    cancelHandler={() => {
                      setFieldValue("search", "");
                      getAllIOULanding(
                        "IOULandingForAccounts",
                        buId,
                        wgId,
                        0,
                        values?.filterFromDate || "",
                        values?.filterToDate || "",
                        "",
                        "",
                        setRowDto,
                        setLoading,
                        1,
                        paginationSize,
                      );
                    }}
                    handleClick={(e) => setfilterAnchorEl(e.currentTarget)}
                  />
                </li>
              </ul>
            </div>
            <FilterBadgeComponent
              propsObj={{
                filterBages,
                setFieldValue,
                clearBadge,
                values: filterValues,
                resetForm,
                initData,
                clearFilter,
              }}
            />
            <div
              className="card-style pb-0 mb-2"
              style={{ marginTop: "12px" }}
            >
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
                    disabled={
                      !values?.filterFromDate || !values?.filterToDate
                    }
                    onClick={() => {
                      getData({
                        current: 1,
                        pageSize: paginationSize
                      });
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            {rowDto.length > 0 ? (
              <PeopleDeskTable
                columnData={iouLandingTableColumn(
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
                uniqueKey="strEmployeeCode"
                isCheckBox={false}
                isScrollAble={false}
                onRowClick={(res) => {
                  history.push(
                    `/profile/iOU/adjustmentReport/${res?.intIOUId}`
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

          <PopOverMasterFilter
            propsObj={{
              id,
              open: openFilter,
              anchorEl: filterAnchorEl,
              handleClose: () => setfilterAnchorEl(null),
              handleSearch,
              values: filterValues,
              dirty,
              initData,
              resetForm,
              clearFilter,
              sx: {},
              size: "lg",
            }}
          >
            <SelfIOUFilterModal
              propsObj={{
                getFilterValues,
                setFieldValue,
                values,
                errors,
                touched,
              }}
            />
          </PopOverMasterFilter>
        </>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
}
