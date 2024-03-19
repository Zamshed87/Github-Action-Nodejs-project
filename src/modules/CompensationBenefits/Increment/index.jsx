/* eslint-disable no-unused-vars */
import { MdPlaylistAddCircle, MdAddCircle, MdAdd } from "react-icons/md";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import BtnActionMenu from "../../../common/BtnActionMenu";
import DefaultInput from "../../../common/DefaultInput";
import FilterBadgeComponent from "../../../common/FilterBadgeComponent";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import {
  compensationBenefitsLSAction,
  setFirstLevelNameAction,
} from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../utility/customColor";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { getDateOfYear, monthFirstDate } from "../../../utility/dateFormatter";
import { todayDate } from "../../../utility/todayDate";
import {
  getAllIncrementAndPromotionLanding,
  incrementColumnData,
  searchData,
} from "./helper";
import PeopleDeskTable, {
  paginationSize,
} from "../../../common/peopleDeskTable";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const initialValues = {
  searchString: "",
  filterFromDate: monthFirstDate(),
  filterToDate: todayDate(),
};

const validationSchema = Yup.object({});

function IncrementLanding() {
  const debounce = useDebounce();
  const dispatch = useDispatch();
  const history = useHistory();
  // const [filterBadges, setFilterBadges] = useState({});
  // const [filterValues, setFilterValues] = useState({});
  // const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  // const openFilter = Boolean(filterAnchorEl);

  const [loading, setLoading] = useState(false);
  // const [checkedList, setCheckedList] = useState([]);

  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // LS data compensationBenefits
  const { compensationBenefits } = useSelector((state) => {
    return state?.localStorage;
  }, shallowEqual);

  // row data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);

  // const [page, setPage] = useState(1);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  // const [paginationSize, setPaginationSize] = useState(15);

  const {
    setFieldValue,
    setValues,
    values,
    errors,
    touched,
    handleSubmit,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
      filterFromDate:
        compensationBenefits?.incrementLanding?.fromDate ||
        getDateOfYear("first"),
      filterToDate:
        compensationBenefits?.incrementLanding?.toDate || todayDate(),
    },
    onSubmit: () => {},
  });

  // const handleSearch = (values) => {
  //   getData(values);
  //   setFilterBadges(values);
  //   setFilterAnchorEl(null);
  // };
  // const clearBadge = (values, name) => {
  //   const data = values;
  //   data[name] = "";
  //   setFilterBadges(data);
  //   setFilterValues(data);
  //   handleSearch(data);
  // };

  // const clearFilter = () => {
  //   setFilterBadges({});
  //   setFilterValues("");
  //   getData();
  // };

  const getData = (pagination, searchText = "") => {
    getAllIncrementAndPromotionLanding(
      orgId,
      buId,
      wgId,
      searchText,
      setRowDto,
      setAllData,
      setLoading,
      values,
      pagination,
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
      },
      searchText
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
      },
      searchText
    );
  };

  useEffect(() => {
    getData(pages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30304) {
      permission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Increment";

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [transferNpromotion, getTransferNpromotion, loading1] = useAxiosGet();

  return (
    <>
      {(loading || loading1) && <Loading />}
      <form onSubmit={handleSubmit} className="employeeProfile-form-main">
        <div className="employee-profile-main">
          {/* box-employee-profile  */}
          {permission?.isView ? (
            <div className="table-card">
              <div className="table-card-heading">
                <div></div>
                <ul className="d-flex flex-wrap">
                  <li>
                    <MasterFilter
                      inputWidth="250px"
                      width="250px"
                      isHiddenFilter
                      value={values?.searchString}
                      errors={errors}
                      touched={touched}
                      setValue={(value) => {
                        setFieldValue("searchString", value);
                        // searchData(value, allData, setRowDto);
                        debounce(() => {
                          getData(
                            {
                              current: 1,
                              pageSize: paginationSize,
                            },
                            value
                          );
                        }, 500);
                      }}
                      cancelHandler={() => {
                        setFieldValue("searchString", "");
                        getData({
                          current: 1,
                          pageSize: paginationSize,
                        });
                      }}
                      // handleClick={(e) => setFilterAnchorEl(e.currentTarget)}
                    />
                  </li>
                  <li>
                    <BtnActionMenu
                      className="btn btn-default flex-center btn-deafult-create-job"
                      icon={
                        <MdAdd
                          style={{
                            marginRight: "0px",
                            fontSize: "15px",
                          }}
                        />
                      }
                      label="Increment"
                      options={[
                        {
                          value: 1,
                          label: "Single Increment",
                          icon: (
                            <MdAddCircle
                              style={{
                                marginRight: "10px",
                                color: gray500,
                                fontSize: "16px",
                              }}
                            />
                          ),
                          onClick: () => {
                            if (!permission?.isCreate)
                              return toast.warn("You don't have permission");
                            history.push(
                              "/compensationAndBenefits/increment/singleIncrement/create"
                            );
                          },
                        },
                        {
                          value: 2,
                          label: "Bulk Increment",
                          icon: (
                            <MdPlaylistAddCircle
                              style={{
                                marginRight: "10px",
                                color: gray500,
                                fontSize: "16px",
                              }}
                            />
                          ),
                          onClick: () => {
                            if (permission?.isCreate) {
                              history.push(
                                "/compensationAndBenefits/increment/bulkIncrement/create"
                              );
                            } else {
                              toast.warn("You don't have permission");
                            }
                          },
                        },
                      ]}
                    />
                  </li>
                </ul>
              </div>

              {/* <FilterBadgeComponent
                propsObj={{
                  filterBadges,
                  setFieldValue,
                  clearBadge,
                  values: filterValues,
                  resetForm,
                  initData: initialValues,
                  clearFilter,
                }}
              /> */}
              <div className="table-card-body">
                <div className="card-style mb-2" style={{ marginTop: "13px" }}>
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Effective From Date</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.filterFromDate}
                          placeholder=""
                          name="filterFromDate"
                          type="date"
                          errors={errors}
                          touched={touched}
                          className="form-control"
                          onChange={(e) => {
                            dispatch(
                              compensationBenefitsLSAction({
                                ...compensationBenefits,
                                incrementLanding: {
                                  ...compensationBenefits?.incrementLanding,
                                  fromDate: e.target.value,
                                },
                              })
                            );
                            setFieldValue("filterFromDate", e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Effective To Date</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.filterToDate}
                          placeholder="Month"
                          name="filterToDate"
                          type="date"
                          errors={errors}
                          touched={touched}
                          className="form-control"
                          onChange={(e) => {
                            dispatch(
                              compensationBenefitsLSAction({
                                ...compensationBenefits,
                                incrementLanding: {
                                  ...compensationBenefits?.incrementLanding,
                                  toDate: e.target.value,
                                },
                              })
                            );
                            setFieldValue("filterToDate", e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-lg-1">
                      <button
                        disabled={
                          !values?.filterToDate || !values?.filterFromDate
                        }
                        style={{ marginTop: "23px" }}
                        className="btn btn-green"
                        onClick={() => {
                          getAllIncrementAndPromotionLanding(
                            orgId,
                            buId,
                            wgId,
                            "",
                            setRowDto,
                            setAllData,
                            setLoading,
                            values,
                            pages,
                            setPages
                          );
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
                {rowDto?.length > 0 ? (
                  // <div className="table-card-styled employee-table-card tableOne">
                  //   <AntTable
                  //     data={rowDto?.data?.length > 0 ? rowDto?.data : []}
                  //     columnsData={incrementColumn(page, paginationSize)}
                  //     rowClassName="pointer"
                  //     onRowClick={(item) => {
                  //       history.push(
                  //         `/compensationAndBenefits/increment/singleIncrement/view/${item?.intIncrementId}`,
                  //         {
                  //           employeeId: item?.intEmployeeId,
                  //           showButton:
                  //             item?.strStatus !== "Pending" ? false : true,
                  //         }
                  //       );
                  //     }}
                  //     setPage={setPage}
                  //     setPaginationSize={setPaginationSize}
                  //   />
                  // </div>
                  <PeopleDeskTable
                    columnData={incrementColumnData(
                      pages?.current,
                      pages?.pageSize,
                      history,
                      getTransferNpromotion
                    )}
                    pages={pages}
                    rowDto={rowDto}
                    setRowDto={setRowDto}
                    handleChangePage={(e, newPage) =>
                      handleChangePage(e, newPage, values?.searchString)
                    }
                    handleChangeRowsPerPage={(e) =>
                      handleChangeRowsPerPage(e, values?.searchString)
                    }
                    uniqueKey="strEmployeeCode"
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
          ) : (
            <NotPermittedPage />
          )}
        </div>
      </form>
    </>
  );
}

export default IncrementLanding;
