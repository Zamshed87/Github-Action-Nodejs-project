import { AddOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import DefaultInput from "../../../common/DefaultInput";
import FilterBadgeComponent from "../../../common/FilterBadgeComponent";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PopOverMasterFilter from "../../../common/PopoverMasterFilter";
import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { monthFirstDate, monthLastDate } from "../../../utility/dateFormatter";
import SelfIOUFilterModal from "./component/SelfIOUFilterModal";
import {
  getAllIOULanding,
  iouLandingTableColumn
} from "./helper";
import PeopleDeskTable, { paginationSize } from "../../../common/peopleDeskTable";

const initData = {
  search: "",

  // master filter
  applicationDate: "",
  filterFromDate: monthFirstDate(),
  filterToDate: monthLastDate(),
  status: "",
  adjustmentStatus: "",
};

export default function MgtIOUApplication() {
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
      "Landing",
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
      setPages
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

  // filter
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
      "Landing",
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
      setPages
    );
  };
  const getFilterValues = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  // formik
  const { resetForm, values, errors, touched, setFieldValue, dirty } =
    useFormik({
      initialValues: initData,
    });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllIOULanding(
      "Landing",
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
      paginationSize,
      setPages
    );
  }, [buId, values, wgId]);

  // menu permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30268) {
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
                        getAllIOULanding(
                          "Landing",
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
                          setPages
                        );
                      }, 500);
                    }}
                    isHiddenFilter
                    cancelHandler={() => {
                      setFieldValue("search", "");
                      getAllIOULanding(
                        "Landing",
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
                        setPages
                      );
                    }}
                    handleClick={(e) => setfilterAnchorEl(e.currentTarget)}
                  />
                </li>
                <li>
                  <PrimaryButton
                    type="button"
                    className="btn btn-default flex-center"
                    label="Request IOU"
                    icon={
                      <AddOutlined
                        sx={{
                          marginRight: "0px",
                          fontSize: "15px",
                        }}
                      />
                    }
                    onClick={() => {
                      if (!permission?.isCreate) {
                        return toast.warning(
                          "Your are not allowed to access"
                        );
                      }
                      history.push(`/profile/iOU/application/create`);
                    }}
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
                customClass="iouManagementTable"
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
                    `/profile/iOU/application/${res?.iouId}`
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
