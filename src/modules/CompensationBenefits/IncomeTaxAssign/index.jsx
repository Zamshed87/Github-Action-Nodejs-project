import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
  SaveAlt,
} from "@mui/icons-material";
import { useFormik } from "formik";
import { Tooltip } from "@mui/material";

import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getSearchEmployeeList } from "../../../common/api";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { createTaxAssign, incomeTaxColumnData } from "./helper";
import ResetButton from "../../../common/ResetButton";
import { toast } from "react-toastify";
import AsyncFormikSelect from "../../../common/AsyncFormikSelect";
import PeopleDeskTable from "../../../common/peopleDeskTable";
import axios from "axios";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "common/peopleDeskTable/helper";
import { downloadEmployeeCardFile } from "modules/timeSheet/reports/employeeIDCard/helper";
import { gray900 } from "utility/customColor";

const paginationSize = 100;

const initData = {
  search: "",
  businessUnit: "",
  workplaceGroup: "",
  workplace: "",
  employee: "",
  status: "",
  // master filter
  department: "",
  designation: "",
  supervisor: "",
  employmentType: "",
};

// status DDL
// const statusDDL = [
//   { value: "Yes", label: "Yes" },
//   { value: "No", label: "No" },
// ];

export default function IncomeTaxAssign() {
  // hooks
  const dispatch = useDispatch();
  const history = useHistory();

  // redux data
  const { buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const initHeaderList = {
    designationList: [],
    departmentList: [],
    sectionList: [],
  };

  // state
  const [loading, setLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [status, setStatus] = useState("");
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const [resEmpLanding, setEmpLanding] = useState([]);
  const [headerList, setHeaderList] = useState({});
  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});
  const [landingLoading, setLandingLoading] = useState(false);
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });

  const { handleSubmit, values, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    onSubmit: () => saveHandler(),
  });

  const saveHandler = () => {
    const callBack = () => {
      getData(
        {
          current: pages?.current,
          pageSize: pages?.pageSize,
          total: pages?.total,
        },
        values.search,
        -1,
        filterOrderList,
        checkedHeaderList
      );
    };
    const payload = resEmpLanding.map((item) => {
      return {
        intTaxId: item?.intTaxId,
        intEmployeeId: item?.intEmployeeId,
        numTaxAmount: +item?.numTaxAmount,
        intCreatedBy: employeeId,
        intAccountId: item?.intAccountId,
        intBusinessUnitId: item?.intBusinessUnitId,
        intWorkplaceId: wId || 0,
        intWorkplaceGroupId: wgId || 0,
      };
    });
    createTaxAssign(payload, setLoading, callBack);
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Income Tax Assign";
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 126) {
      permission = item;
    }
  });

  const rowDtoHandler = (name, index, value) => {
    const data = [...resEmpLanding];
    data[index][name] = value;
    setEmpLanding(data);
  };

  useEffect(() => {
    setHeaderList({});
    setEmpLanding([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  const getDataApiCall = async (
    modifiedPayload,
    pagination,
    searchText,
    currentFilterSelection = -1,
    checkedHeaderList
  ) => {
    try {
      const payload = {
        intBusinessUnitId: buId,
        intWorkplaceGroupId: wgId,
        intWorkplaceId: wId,
        intEmployeeId: values?.employee?.value || 0,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        isPaginated: true,
        isHeaderNeed: true,
        searchTxt: searchText || "",
      };

      const res = await axios.post(`/Employee/GetAllEmployeeForTaxAssign`, {
        ...payload,
        ...modifiedPayload,
      });

      if (res?.data?.data) {
        setHeaderListDataDynamically({
          currentFilterSelection,
          checkedHeaderList,
          headerListKey: "activeEmployeeTaxAssignLandingHeader",
          headerList,
          setHeaderList,
          response: res?.data,
          filterOrderList,
          setFilterOrderList,
          initialHeaderListData,
          setInitialHeaderListData,
          setEmpLanding,
          setPages,
        });

        setLandingLoading(false);
      }
    } catch (error) {
      setLandingLoading(false);
    }
  };

  const getData = async (
    pagination,
    searchText = "",
    currentFilterSelection = -1,
    filterOrderList = [],
    checkedHeaderList = { ...initHeaderList }
  ) => {
    setLandingLoading(true);

    const modifiedPayload = createPayloadStructure({
      initHeaderList,
      currentFilterSelection,
      checkedHeaderList,
      filterOrderList,
    });

    getDataApiCall(
      modifiedPayload,
      pagination,
      searchText,
      currentFilterSelection,
      checkedHeaderList
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
      searchText,
      -1,
      filterOrderList,
      checkedHeaderList
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages({
      current: 1,
      total: pages?.total,
      pageSize: +event.target.value,
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      searchText,
      -1,
      filterOrderList,
      checkedHeaderList
    );
  };

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        {permission?.isCreate ? (
          <div className="table-card">
            <div className="table-card-heading">
              <div className="d-flex align-items-center">
                <h2 className="ml-1">Income Tax Assign</h2>
              </div>
              <div className="table-card-head-right">
                <ul>
                  <li className="pr-2">
                    <PrimaryButton
                      type="button"
                      className="btn btn-default flex-center"
                      label="Bulk Tax Assign"
                      icon={
                        <AddOutlined
                          sx={{
                            marginRight: "0px",
                            fontSize: "15px",
                          }}
                        />
                      }
                      onClick={() => {
                        if (permission?.isCreate) {
                          history.push(
                            "/compensationAndBenefits/incometaxmgmt/taxassign/bulk"
                          );
                        } else {
                          toast.warn("You don't have permission");
                        }
                      }}
                    />
                  </li>
                  <li>
                    <PrimaryButton
                      className="btn btn-green btn-green-disable"
                      type="submit"
                      label="Save"
                      disabled={loading || !resEmpLanding?.length}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div className="card-style with-form-card mt-3">
              <div className="row">
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Select Employee</label>
                    <AsyncFormikSelect
                      selectedValue={values?.employee}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                        setEmpLanding([]);
                      }}
                      placeholder="Search (min 3 letter)"
                      loadOptions={(v) => getSearchEmployeeList(buId, wgId, v)}
                    />
                  </div>
                </div>
                <div className="col-lg-3 pb-3">
                  <div className="d-flex align-items-center">
                    <button
                      style={{ marginTop: "21px" }}
                      type="button"
                      className="btn btn-green btn-green-disable"
                      onClick={(e) => {
                        e.stopPropagation();
                        getData(
                          { current: 1, pageSize: paginationSize },
                          "",
                          -1,
                          filterOrderList,
                          checkedHeaderList
                        );
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* tax landing */}
            <div>
              {resEmpLanding?.length > 0 && (
                <div
                  className="table-card-heading"
                  style={{ marginTop: "12px" }}
                >
                  {" "}
                  <div style={{ display: "flex", paddingLeft: "6px" }}>
                    <Tooltip title="Export CSV" arrow>
                      <button
                        type="button"
                        className="btn-save mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLoading(true);

                          const paylaod = {
                            intBusinessUnitId: buId,
                            intWorkplaceGroupId: wgId,
                            intWorkplaceId: wId,
                            intEmployeeId: values?.employee?.value || 0,
                            pageNo: 0,
                            pageSize: 0,
                            isPaginated: false,
                            isHeaderNeed: false,
                            searchTxt: "",
                            ...checkedHeaderList,
                          };
                          const url =
                            "/PdfAndExcelReport/GetAllEmployeeForTaxAssign_RDLC";
                          downloadEmployeeCardFile(
                            url,
                            paylaod,
                            "Tax Assign List",
                            "xlsx",
                            setLoading
                          );
                        }}
                        disabled={resEmpLanding?.length <= 0}
                      >
                        <SaveAlt
                          sx={{
                            color: gray900,
                            fontSize: "14px",
                          }}
                        />
                      </button>
                    </Tooltip>
                    <h6 className="count">
                      Total {resEmpLanding?.length} employees
                    </h6>
                  </div>
                  <ul className="d-flex flex-wrap">
                    {(isFilter || status || values?.searchString) && (
                      <li>
                        <ResetButton
                          classes="btn-filter-reset"
                          title="reset"
                          icon={
                            <SettingsBackupRestoreOutlined
                              sx={{
                                marginRight: "10px",
                                fontSize: "16px",
                              }}
                            />
                          }
                          onClick={() => {
                            setIsFilter(false);
                            setStatus("");
                            setFieldValue("searchString", "");
                            getData(
                              { current: 1, pageSize: paginationSize },
                              "",
                              -1,
                              filterOrderList,
                              checkedHeaderList
                            );
                          }}
                        />
                      </li>
                    )}
                    <li>
                      <MasterFilter
                        inputWidth="250px"
                        width="250px"
                        isHiddenFilter
                        value={values?.searchString}
                        setValue={(value) => {
                          setFieldValue("searchString", value);
                          if (value) {
                            getData(
                              { current: 1, pageSize: paginationSize },
                              value,
                              -1,
                              filterOrderList,
                              checkedHeaderList
                            );
                          } else {
                            getData(
                              { current: 1, pageSize: paginationSize },
                              "",
                              -1,
                              filterOrderList,
                              checkedHeaderList
                            );
                          }
                        }}
                        cancelHandler={() => {
                          setFieldValue("searchString", "");
                          getData(
                            { current: 1, pageSize: paginationSize },
                            "",
                            -1,
                            filterOrderList,
                            checkedHeaderList
                          );
                        }}
                      />
                    </li>
                  </ul>
                </div>
              )}
              <div className="row">
                <div className="col-12">
                  {resEmpLanding?.length > 0 ? (
                    <>
                      <PeopleDeskTable
                        columnData={incomeTaxColumnData(
                          pages?.current,
                          pages?.pageSize,
                          rowDtoHandler,
                          headerList
                        )}
                        pages={pages}
                        rowDto={resEmpLanding}
                        setRowDto={setEmpLanding}
                        checkedHeaderList={checkedHeaderList}
                        setCheckedHeaderList={setCheckedHeaderList}
                        handleChangePage={(e, newPage) =>
                          handleChangePage(e, newPage, values?.searchString)
                        }
                        handleChangeRowsPerPage={(e) =>
                          handleChangeRowsPerPage(e, values?.searchString)
                        }
                        filterOrderList={filterOrderList}
                        setFilterOrderList={setFilterOrderList}
                        uniqueKey="intEmployeeId"
                        getFilteredData={(
                          currentFilterSelection,
                          updatedFilterData,
                          updatedCheckedHeaderData
                        ) => {
                          getData(
                            {
                              current: 1,
                              pageSize: paginationSize,
                              total: 0,
                            },
                            "",
                            currentFilterSelection,
                            updatedFilterData,
                            updatedCheckedHeaderData
                          );
                        }}
                      />
                    </>
                  ) : (
                    <>
                      {!landingLoading && (
                        <div className="col-12">
                          <NoResult title={"No Data Found"} para={""} />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
}
