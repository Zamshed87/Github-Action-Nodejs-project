import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FilterBadgeComponent from "../../../common/FilterBadgeComponent";
import IConfirmModal from "../../../common/IConfirmModal";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import PopOverMasterFilter from "../../../common/PopoverMasterFilter";
import ResetButton from "../../../common/ResetButton";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PeopleDeskTable, {
  paginationSize,
} from "../../../common/peopleDeskTable";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { getDateOfYear } from "../../../utility/dateFormatter";
import SelfIOUFilterModal from "./component/SelfIOUFilterModal";
import {
  getAllIOULanding,
  iouReportDtoCol,
  saveIOUApplication,
} from "./helper";
import DefaultInput from "../../../common/DefaultInput";

const initData = {
  search: "",

  // master filter
  applicationDate: "",
  fromDate: getDateOfYear("first"),
  toDate: getDateOfYear("last"),
  status: "",
  adjustmentStatus: "",
};

export default function SupervisorIOUReport() {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();
  const debounce = useDebounce();

  // redux
  const { buId, employeeId, isSupNLMORManagement, wgId, intWorkplaceId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  // state
  const [loading, setLoading] = useState(false);

  // useFormik
  const { resetForm, values, errors, touched, setFieldValue, dirty } =
    useFormik({
      enableReinitialize: true,
      initialValues: {
        ...initData,
        fromDate: getDateOfYear("first"),
        toDate: getDateOfYear("last"),
      },
    });

  // landing table
  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const getData = (pagination) => {
    getAllIOULanding(
      intWorkplaceId,
      "IOULandingBySupervisorId",
      buId,
      wgId,
      0,
      values?.fromDate || "",
      values?.toDate || "",
      values?.search || "",
      "",
      setRowDto,
      setLoading,
      pagination?.current,
      pagination?.pageSize,
      setPages,
      employeeId
    );
  };

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

  // filter
  const [isFilter, setIsFilter] = useState(false);
  const [status, setStatus] = useState("");
  const [adjustmentStatus] = useState("");

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllIOULanding(
      intWorkplaceId,
      "IOULandingBySupervisorId",
      buId,
      wgId,
      0,
      values?.fromDate || "",
      values?.toDate || "",
      values?.search || "",
      "",
      setRowDto,
      setLoading,
      1,
      paginationSize,
      setPages,
      employeeId
    );
  }, [wgId, buId, values, employeeId, intWorkplaceId]);

  // filter
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
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
      intWorkplaceId,
      "IOULandingBySupervisorId",
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
      paginationSize,
      setPages,
      employeeId
    );
  };
  const getFilterValues = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const acknowledgedPopup = (data) => {
    const payload = {
      strEntryType: "IsAcknowledge",
      intIOUId: data?.intIOUAdjustmentId || 0,
      intEmployeeId: employeeId,
      intUpdatedBy: employeeId,
    };

    const callback = () => {
      getAllIOULanding(
        intWorkplaceId,
        "IOULandingBySupervisorId",
        buId,
        wgId,
        0,
        values?.fromDate || "",
        values?.toDate || "",
        values?.search || "",
        "",
        setRowDto,
        setLoading,
        1,
        paginationSize,
        setPages,
        employeeId
      );
    };

    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to acknowledged ? `,
      yesAlertFunc: () => {
        saveIOUApplication(payload, setLoading, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <form>
        {loading && <Loading />}
        {isSupNLMORManagement ? (
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
                  {(isFilter || status || adjustmentStatus) && (
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
                            intWorkplaceId,
                            "IOULandingBySupervisorId",
                            buId,
                            wgId,
                            0,
                            values?.fromDate || "",
                            values?.toDate || "",
                            values?.search || "",
                            "",
                            setRowDto,
                            setLoading,
                            1,
                            paginationSize,
                            setPages,
                            employeeId
                          );
                        }}
                      />
                    </li>
                  )}
                  <li>
                    <MasterFilter
                      isHiddenFilter
                      styles={{
                        marginRight: "10px",
                      }}
                      inputWidth="200px"
                      width="200px"
                      value={values?.search}
                      setValue={(value) => {
                        setFieldValue("search", value);
                        debounce(() => {
                          getAllIOULanding(
                            intWorkplaceId,
                            "IOULandingBySupervisorId",
                            buId,
                            wgId,
                            0,
                            values?.fromDate || "",
                            values?.toDate || "",
                            value || "",
                            "",
                            setRowDto,
                            setLoading,
                            1,
                            paginationSize
                          );
                        }, 500);
                      }}
                      cancelHandler={() => {
                        setFieldValue("search", "");
                        getAllIOULanding(
                          intWorkplaceId,
                          "IOULandingBySupervisorId",
                          buId,
                          wgId,
                          0,
                          values?.fromDate || "",
                          values?.toDate || "",
                          "",
                          "",
                          setRowDto,
                          setLoading,
                          1,
                          paginationSize,
                          setPages,
                          employeeId
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
              <div className="table-card-body">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>From Date</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.fromDate}
                        placeholder=""
                        name="fromDate"
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>To Date</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.toDate}
                        placeholder="Month"
                        name="toDate"
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-lg-1">
                    <button
                      type="button"
                      disabled={!values?.toDate || !values?.fromDate}
                      style={{ marginTop: "21px" }}
                      className="btn btn-green"
                      onClick={() => {
                        getAllIOULanding(
                          intWorkplaceId,
                          "IOULandingByEmployeeId",
                          buId,
                          wgId,
                          0,
                          values?.fromDate || "",
                          values?.toDate || "",
                          "",
                          "",
                          setRowDto,
                          setLoading,
                          1,
                          paginationSize,
                          setPages,
                          employeeId
                        );
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>

                {rowDto.length > 0 ? (
                  <PeopleDeskTable
                    columnData={iouReportDtoCol(
                      pages?.current,
                      pages?.pageSize,
                      history,
                      acknowledgedPopup
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
                      history.push(`/SelfService/iOU/report/${res?.iouId}`);
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
      </form>
    </>
  );
}
