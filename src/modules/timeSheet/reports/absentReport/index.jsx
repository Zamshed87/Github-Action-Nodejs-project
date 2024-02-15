/* eslint-disable react-hooks/exhaustive-deps */
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import DefaultInput from "../../../../common/DefaultInput";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../../utility/customColor";

import { getWorkplaceDetails } from "common/api";
import { getPDFAction } from "utility/downloadFile";
import MasterFilter from "../../../../common/MasterFilter";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import { createCommonExcelFile } from "../../../../utility/customExcel/generateExcelAction";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { todayDate } from "../../../../utility/todayDate";
import {
  absentDtoCol,
  column,
  getAbsentData,
  getTableDataDailyAttendance,
} from "./helper";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "common/peopleDeskTable/helper";
import axios from "axios";
import { toast } from "react-toastify";

const initialValues = {
  businessUnit: "",
  date: todayDate(),
  todate: todayDate(),
  workplaceGroup: "",
  workplace: "",
  search: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.date().required("Date is required").typeError("Date is required"),
});

const initHeaderList = {
  departmentList: [],
  sectionList: [],
  designationList: [],
};
const AbsentReport = () => {
  // redux
  const dispatch = useDispatch();

  const { buId, wgId, wId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // states
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [headerList, setHeaderList] = useState({});
  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});
  const [landingLoading, setLandingLoading] = useState(false);
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });
  const [buDetails, setBuDetails] = useState({});
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const [, getExcelData, apiLoading] = useAxiosGet();

  const debounce = useDebounce();

  //  menu permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30381) {
      permission = item;
    }
  });
  const getDataApiCall = async (
    modifiedPayload,
    pagination,
    searchText,
    currentFilterSelection = -1,
    checkedHeaderList
  ) => {
    try {
      const payload = {
        intAccountId: orgId,
        intBusinessUnitId: buId,
        intWorkplaceGroupId: wgId,
        intWorkplaceId: wId,
        fromDate: values?.date,
        toDate: values?.todate,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        isPaginated: true,
        isHeaderNeed: true,
        searchTxt: searchText || "",
      };

      const res = await axios.post(`/TimeSheetReport/GetAbsentReport`, {
        ...payload,
        ...modifiedPayload,
      });

      if (res?.data?.data) {
        setHeaderListDataDynamically({
          currentFilterSelection,
          checkedHeaderList,
          headerListKey: "timeSheetAbsentHeader",
          headerList,
          setHeaderList,
          response: res?.data,
          filterOrderList,
          setFilterOrderList,
          initialHeaderListData,
          setInitialHeaderListData,
          // setRowDto,
          setPages,
        });
        setRowDto(res?.data?.data);
        setLandingLoading(false);
      }
    } catch (error) {
      setLandingLoading(false);
    }
  };
  const getData = async (
    pagination,
    IsForXl = "false",
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
  // const getData = (
  //   pagination = { current: 1, pageSize: paginationSize },
  //   srcTxt = "",
  //   date = todayDate(),
  //   todate = todayDate(),
  //   isExcel = false
  // ) => {
  //   getAbsentData(
  //     buId,
  //     date,
  //     setRowDto,
  //     setLoading,
  //     srcTxt,
  //     pagination?.current,
  //     pagination?.pageSize,
  //     isExcel,
  //     wgId,
  //     setPages,
  //     wId,
  //     todate
  //   );
  // };

  useEffect(() => {
    getWorkplaceDetails(wId, setBuDetails);
    getData(pages);
  }, [wId, wgId]);

  // formik
  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues,
    onSubmit: () => {
      getData(pages);
      setFieldValue("search", "");
    },
  });

  //set to module
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Absent Report";
  }, [dispatch]);
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
      "false",
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
      "false",
      searchText,
      -1,
      filterOrderList,
      checkedHeaderList
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {(loading || apiLoading) && <Loading />}
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading mt-2 pt-1 ">
            <div className="d-flex align-items-center">
              <h2 className="ml-1">Absent Report</h2>
            </div>
            <div className="table-header-right">
              <ul className="d-flex flex-wrap"></ul>
            </div>
          </div>
          <div className="table-card-body" style={{ marginTop: "12px" }}>
            {/* d-none */}
            <div
              className="card-style "
              style={{ margin: "14px 0px 12px 0px" }}
            >
              <div className="row">
                {/* bu */}
                <div className="col-lg-2">
                  <div className="input-field-main">
                    <label>From Date</label>
                    <DefaultInput
                      classes="input-sm"
                      placeholder=""
                      value={values?.date}
                      name="date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                      }}
                      // min={values?.date}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="input-field-main">
                    <label>To Date</label>
                    <DefaultInput
                      classes="input-sm"
                      placeholder=""
                      value={values?.todate}
                      name="todate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("todate", e.target.value);
                      }}
                      // min={values?.date}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3 mt-3 pt-2">
                  <button
                    className="btn btn-green btn-green-disable"
                    type="submit"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            {rowDto?.length > 0 ? (
              <div>
                <div className="d-flex justify-content-between">
                  <div>
                    <h2
                      style={{
                        color: gray500,
                        fontSize: "14px",
                        margin: "7px 0px 10px 10px",
                      }}
                    >
                      Absent Report
                    </h2>
                  </div>

                  <div>
                    <ul className="d-flex flex-wrap">
                      {rowDto?.length > 0 && (
                        <>
                          <li className="pr-2">
                            <Tooltip title="Export CSV" arrow>
                              <IconButton
                                style={{ color: "#101828" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const excelLanding = async () => {
                                    try {
                                      const res = await axios.post(
                                        `/TimeSheetReport/GetAbsentReport`,
                                        {
                                          intAccountId: orgId,
                                          intBusinessUnitId: buId,
                                          intWorkplaceGroupId: wgId,
                                          intWorkplaceId: wId,
                                          fromDate: values?.date,
                                          toDate: values?.todate,
                                          pageNo: 1,
                                          pageSize: 1000000000,
                                          isPaginated: false,
                                          isHeaderNeed: false,
                                          searchTxt: "",
                                          departmentList: [],
                                          sectionList: [],
                                          designationList: [],
                                        }
                                      );
                                      if (res?.data?.data?.length > 0) {
                                        const newData = res?.data?.data?.map(
                                          (item, index) => {
                                            return {
                                              ...item,
                                              sl: index + 1,
                                            };
                                          }
                                        );
                                        const date = todayDate();

                                        createCommonExcelFile({
                                          titleWithDate: `Absent Report ${values?.todate} `,
                                          fromDate: "",
                                          toDate: "",
                                          buAddress: buDetails?.strAddress,
                                          businessUnit: buDetails?.strWorkplace,
                                          tableHeader: column,
                                          getTableData: () =>
                                            getTableDataDailyAttendance(
                                              newData,
                                              Object.keys(column),
                                              res?.data?.data
                                            ),
                                          // getSubTableData: () =>
                                          //   getTableDataSummaryHeadData(res),
                                          // subHeaderInfoArr: [
                                          //   res?.data?.workplaceGroup
                                          //     ? `Workplace Group-${res?.data?.workplaceGroup}`
                                          //     : "",
                                          //   res?.data?.workplace
                                          //     ? `Workplace-${res?.data?.workplace}`
                                          //     : "",
                                          // ],
                                          // subHeaderColumn,
                                          tableFooter: [],
                                          extraInfo: {},
                                          tableHeadFontSize: 10,
                                          widthList: {
                                            B: 30,
                                            C: 30,
                                            D: 15,
                                            E: 25,
                                            F: 20,
                                            G: 25,
                                            H: 15,
                                            I: 15,
                                            J: 20,
                                            K: 20,
                                          },
                                          commonCellRange: "A1:J1",
                                          CellAlignment: "left",
                                        });
                                        setLoading && setLoading(false);
                                      } else {
                                        setLoading && setLoading(false);
                                        toast.warn("Empty Employee Data");
                                      }
                                    } catch (error) {
                                      toast.warn("Failed to download excel");
                                      setLoading && setLoading(false);
                                    }
                                  };
                                  excelLanding();
                                }}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </li>
                          <li className="pr-2 d-none">
                            <Tooltip title="Print" arrow>
                              <IconButton
                                style={{ color: "#101828" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const list = rowDto?.data?.map(
                                    (item) => item?.employeeId
                                  );
                                }}
                              >
                                <LocalPrintshopIcon />
                              </IconButton>
                            </Tooltip>
                          </li>
                        </>
                      )}
                      {values?.search && (
                        <li className="pt-1 d-none">
                          <ResetButton
                            classes="btn-filter-reset"
                            title="Reset"
                            icon={<SettingsBackupRestoreOutlined />}
                            onClick={() => {
                              getData(
                                { current: 1, pageSize: paginationSize },
                                "",
                                values?.date
                              );
                              setFieldValue("search", "");
                            }}
                          />
                        </li>
                      )}
                      <li className="d-none">
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
                              getData(
                                { current: 1, pageSize: paginationSize },
                                value,
                                values?.date
                              );
                            }, 500);
                          }}
                          cancelHandler={() => {
                            setFieldValue("search", "");
                            getData(
                              { current: 1, pageSize: paginationSize },
                              "",
                              values?.date
                            );
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                <PeopleDeskTable
                  columnData={absentDtoCol(
                    pages?.current,
                    pages?.pageSize,
                    headerList
                  )}
                  pages={pages}
                  rowDto={rowDto}
                  setRowDto={setRowDto}
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
                  uniqueKey="employeeCode"
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
                      "false",
                      "",
                      currentFilterSelection,
                      updatedFilterData,
                      updatedCheckedHeaderData
                    );
                  }}
                  isCheckBox={false}
                  isScrollAble={false}
                />
              </div>
            ) : (
              !loading && <NoResult />
            )}
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </form>
  );
};

export default AbsentReport;
