import { MenuItem } from "@material-ui/core";
import {
  AddOutlined, ArrowDropDown, SettingsBackupRestoreOutlined
} from "@mui/icons-material";
import { Select } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Chips from "../../../common/Chips";
import FilterBadgeComponent from "../../../common/FilterBadgeComponent";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PaginationHandlerUI from "../../../common/PaginationHandlerUI";
import PopOverMasterFilter from "../../../common/PopoverMasterFilter";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
import SortingIcon from "../../../common/SortingIcon";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { dateFormatter } from "../../../utility/dateFormatter";
import { numberWithCommas } from './../../../utility/numberWithCommas';
import SelfIOUFilterModal from "./component/SelfIOUFilterModal";
import {
  getPFLanding
} from "./helper";

// status DDL
const statusDDL = [
  { value: "Completed", label: "Completed" },
  { value: "Active", label: "Active" },
];

const initData = {
  search: "",
  status: "",
};

export default function PfInvestmentLanding() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  // row data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isFilter, setIsFilter] = useState(false);

  // page
  const [pageSize, setPageSize] = useState(15);
  const [pageNo, setPageNo] = useState(0);

  // filter
  const [status, setStatus] = useState("");
  const [reffStatus, setReffStatus] = useState("");
  const [bankOrder, setBankOrder] = useState("desc");
  const [invDateOrder, setInvDateOrder] = useState("desc");
  const [invAmountOrder, setTnvAmountOrder] = useState("desc");
  const [matureDateOrder, setMatureDateOrder] = useState("desc");
  const [interestOrder, setInterestOrder] = useState("desc");
  const [interestAmountOrder, setInterestAmountOrder] = useState("desc");

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 204) {
      permission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
  }, [dispatch]);

  const getData = (values) => {
    getPFLanding(
      orgId,
      buId,
      pageNo,
      pageSize,
      values?.search || "",
      setRowDto,
      setAllData,
      setLoading
    );
  };

  useEffect(() => {
    getPFLanding(
      orgId,
      buId,
      pageNo,
      pageSize,
      "",
      setRowDto,
      setAllData,
      setLoading
    );
  }, [orgId, buId, pageNo, pageSize]);

  // active & inactive filter
  const statusTypeFilter = (statusType) => {
    const newRowData = [...allData?.data];
    let modifyRowData = [];
    if (statusType === "Active") {
      modifyRowData = newRowData?.filter(
        (item) => item?.strStatus === "Active"
      );
    } else if (statusType === "Completed") {
      modifyRowData = newRowData?.filter((item) => item?.strStatus === "Completed");
    }
    setRowDto({ data: modifyRowData });
  };

  // ascending & descending
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...allData?.data];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setRowDto({ data: modifyRowData });
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
    getPFLanding(
      orgId,
      buId,
      pageNo,
      pageSize,
      "",
      setRowDto,
      setAllData,
      setLoading
    );
  };
  const getFilterValues = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const setPaginationHandler = (pageNo, pageSize, values) => {
    getPFLanding(
      orgId,
      buId,
      pageNo,
      pageSize,
      values?.search || "",
      setRowDto,
      setAllData,
      setLoading
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          dirty
        }) => (
          <>
            <Form>
              {loading && <Loading />}
              {permission?.isView ? (
                <>
                  <div className="table-card">
                    <div className="table-card-heading" style={{ marginBottom: "2px" }}>
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
                                marginRight: "16px"
                              }}
                              onClick={() => {
                                setIsFilter(false);
                                setFieldValue("search", "");
                                setStatus("");
                                getData();
                              }}
                            />
                          </li>
                        )}
                        <li>
                          <MasterFilter
                            styles={{
                              marginRight: "10px"
                            }}
                            inputWidth="200px"
                            width="200px"
                            value={values?.search}
                            setValue={(value) => {
                              setFieldValue("search", value);
                              debounce(() => {
                                getPFLanding(
                                  orgId,
                                  buId,
                                  pageNo,
                                  pageSize,
                                  value || "",
                                  setRowDto,
                                  setAllData,
                                  setLoading
                                );
                              }, 500);
                            }}
                            cancelHandler={() => {
                              setFieldValue("search", "");
                              getPFLanding(
                                orgId,
                                buId,
                                pageNo,
                                pageSize,
                                "",
                                setRowDto,
                                setAllData,
                                setLoading
                              );
                            }}
                            handleClick={(e) =>
                              setfilterAnchorEl(e.currentTarget)
                            }
                            isHiddenFilter={true}
                          />
                        </li>
                        <li>
                          <PrimaryButton
                            type="button"
                            className="btn btn-default flex-center"
                            label="Investment"
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
                                return toast.warning("Your are not allowed to access")
                              }
                              history.push(`/compensationAndBenefits/pfandgratuity/pfInvestment/create`)
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
                    <div className="table-card-body">
                      <div className="table-card-styled tableOne">
                        {rowDto?.data?.length > 0 ? (
                          <>
                            <table className="table">
                              <thead>
                                <tr>
                                  <th style={{ width: '30px' }}>SL</th>
                                  <th>
                                    <div
                                      className="d-flex align-items-center pointer"
                                      onClick={() => {
                                        setReffStatus(
                                          reffStatus === "desc" ? "asc" : "desc"
                                        );
                                        commonSortByFilter(
                                          reffStatus,
                                          "strInvestmentReffNo"
                                        );
                                      }}
                                    >
                                      Reff. No.
                                      <div>
                                        <SortingIcon
                                          viewOrder={reffStatus}
                                        ></SortingIcon>
                                      </div>
                                    </div>
                                  </th>
                                  <th>
                                    <div
                                      className="d-flex align-items-center pointer"
                                      onClick={() => {
                                        setBankOrder(
                                          bankOrder === "desc" ? "asc" : "desc"
                                        );
                                        commonSortByFilter(
                                          bankOrder,
                                          "strBankName"
                                        );
                                      }}
                                    >
                                      Bank
                                      <div>
                                        <SortingIcon
                                          viewOrder={bankOrder}
                                        ></SortingIcon>
                                      </div>
                                    </div>
                                  </th>
                                  <th>
                                    <div
                                      className="d-flex align-items-center pointer"
                                      onClick={() => {
                                        setInvDateOrder(
                                          invDateOrder === "desc"
                                            ? "asc"
                                            : "desc"
                                        );
                                        commonSortByFilter(
                                          invDateOrder,
                                          "dteInvestmentDate"
                                        );
                                      }}
                                    >
                                      Inv Date
                                      <div>
                                        <SortingIcon
                                          viewOrder={invDateOrder}
                                        ></SortingIcon>
                                      </div>
                                    </div>
                                  </th>
                                  <th style={{ width: "93px" }}>
                                    <div
                                      className="d-flex align-items-center pointer"
                                      onClick={() => {
                                        setTnvAmountOrder(
                                          invAmountOrder === "desc" ? "asc" : "desc"
                                        );
                                        commonSortByFilter(
                                          invAmountOrder,
                                          "numInvestmentAmount"
                                        );
                                      }}
                                    >
                                      Inv Amount
                                      <div>
                                        <SortingIcon
                                          viewOrder={invAmountOrder}
                                        ></SortingIcon>
                                      </div>
                                    </div>
                                  </th>
                                  <th style={{ width: "100px" }}></th>
                                  <th>
                                    <div
                                      className="d-flex align-items-center pointer"
                                      onClick={() => {
                                        setMatureDateOrder(
                                          matureDateOrder === "desc" ? "asc" : "desc"
                                        );
                                        commonSortByFilter(
                                          matureDateOrder,
                                          "dteMatureDate"
                                        );
                                      }}
                                    >
                                      Mature Date
                                      <div>
                                        <SortingIcon
                                          viewOrder={matureDateOrder}
                                        ></SortingIcon>
                                      </div>
                                    </div>
                                  </th>
                                  <th>
                                    <div
                                      className="d-flex align-items-center pointer"
                                      onClick={() => {
                                        setInterestOrder(
                                          interestOrder === "desc" ? "asc" : "desc"
                                        );
                                        commonSortByFilter(
                                          interestOrder,
                                          "numInterestRate"
                                        );
                                      }}
                                    >
                                      Investment Rate
                                      <div>
                                        <SortingIcon
                                          viewOrder={interestOrder}
                                        ></SortingIcon>
                                      </div>
                                    </div>
                                  </th>
                                  <th style={{ width: "121px" }}>
                                    <div
                                      className="d-flex align-items-center pointer"
                                      onClick={() => {
                                        setInterestAmountOrder(
                                          interestAmountOrder === "desc" ? "asc" : "desc"
                                        );
                                        commonSortByFilter(
                                          interestAmountOrder,
                                          "numInterestAmount"
                                        );
                                      }}
                                    >
                                      Interest Amount
                                      <div>
                                        <SortingIcon
                                          viewOrder={interestAmountOrder}
                                        ></SortingIcon>
                                      </div>
                                    </div>
                                  </th>
                                  <th style={{ width: "120px" }}></th>
                                  <th style={{ width: "105px" }}>
                                    <div className="table-th d-flex align-items-center">
                                      Status
                                      <span>
                                        <Select
                                          sx={{
                                            "& .MuiOutlinedInput-notchedOutline":
                                            {
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
                                            statusTypeFilter(
                                              e.target.value?.label
                                            );
                                          }}
                                        >
                                          {statusDDL?.length > 0 &&
                                            statusDDL?.map((item, index) => {
                                              return (
                                                <MenuItem
                                                  key={index}
                                                  value={item}
                                                >
                                                  {item?.label}
                                                </MenuItem>
                                              );
                                            })}
                                        </Select>
                                      </span>
                                    </div>
                                  </th>
                                  {/* <th></th> */}
                                </tr>
                              </thead>
                              <tbody>
                                {rowDto?.data?.map((item, index) => {
                                  return (
                                    <>
                                      <tr
                                        key={index}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          history.push({
                                            pathname: `/compensationAndBenefits/pfandgratuity/pfInvestment/view/${item?.intInvenstmentHeaderId}`,
                                            state: item
                                          })
                                        }}
                                        style={{
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <td><p className="pl-1">{index + 1}</p></td>
                                        <td>
                                          <div className="content tableBody-title">
                                            {item?.strInvestmentReffNo}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="content tableBody-title">
                                            {item?.strBankName}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="content tableBody-title">
                                            {dateFormatter(item?.dteInvestmentDate)}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="content tableBody-title text-right">
                                            {numberWithCommas(item?.numInvestmentAmount)}
                                          </div>
                                        </td>
                                        <td></td>
                                        <td>
                                          <div className="content tableBody-title">
                                            {dateFormatter(item?.dteMatureDate)}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="content tableBody-title">
                                            {item?.numInterestRate ? `${item?.numInterestRate}%` : ""}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="content tableBody-title text-right">
                                            {numberWithCommas(item?.numInterestAmount)}
                                          </div>
                                        </td>
                                        <td></td>
                                        <td>
                                          {item?.strStatus === "Completed" && (
                                            <Chips
                                              label="Completed"
                                              classess="success p-2"
                                            />
                                          )}
                                          {item?.strStatus === "Active" && (
                                            <Chips
                                              label="Active"
                                              classess="primary p-2"
                                            />
                                          )}
                                        </td>
                                        {/* <td width="60px">
                                          {item?.strStatus === "Active" && (
                                            <div className="d-flex">
                                              <Tooltip title="Edit" arrow>
                                                <button
                                                  className="iconButton"
                                                  type="button"
                                                >
                                                  <EditOutlined
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      history.push(`/compensationAndBenefits/pfandgratuity/pfInvestment/edit/${item?.intInvenstmentHeaderId}`)
                                                    }}
                                                  />
                                                </button>
                                              </Tooltip>
                                            </div>
                                          )}
                                        </td> */}
                                      </tr>
                                    </>
                                  );
                                })}
                              </tbody>
                            </table>
                            {!status && (
                              <div>
                                <PaginationHandlerUI
                                  count={rowDto?.totalCount}
                                  setPaginationHandler={setPaginationHandler}
                                  pageNo={pageNo}
                                  setPageNo={setPageNo}
                                  pageSize={pageSize}
                                  setPageSize={setPageSize}
                                  isPaginatable={true}
                                  values={values}
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {!loading && (
                              <NoResult title="No Result Found" para="" />
                            )}
                          </>
                        )}
                      </div>
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
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
