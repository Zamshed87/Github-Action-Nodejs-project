import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Popover, Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import FilterModal from "./components/FilterModal";
import {
  columnForExcel,
  columnForMarketingForExcel,
  empReportListColumns,
  getBuDetails,
  getTableDataEmployeeReports,
} from "./helper";
import axios from "axios";
import { gray900 } from "../../../../utility/customColor";
// import { generateExcelAction } from "./excel/generateExcelList";
import AntScrollTable from "../../../../common/AntScrollTable";
import NoResult from "../../../../common/NoResult";
import { todayDate } from "../../../../utility/todayDate";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { paginationSize } from "../../../../common/AntTable";
import { createCommonExcelFile } from "../../../../utility/customExcel/generateExcelAction";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";

const initData = {
  search: "",
  email: "",
  workplaceGroup: "",
  payrollGroup: "",
  supervisor: "",
  rosterGroup: "",
  department: "",
  designation: "",
  calendar: "",
  gender: "",
  religion: "",
  employmentType: "",
  joiningDate: "",
  confirmDate: "",
  birthCertificate: { value: 0, label: "All" },
  isNID: { value: 0, label: "All" },
  status: "",
};

export default function EmployeeList() {
  // redux
  const dispatch = useDispatch();
  const { orgId, buId, buName, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // states
  const [loading, setLoading] = useState(false);
  const [buDetails, setBuDetails] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowDto, getEmployeeReportLanding, loadingReport, setRowDto] =
    useAxiosGet([]);
  const [allData, setAllData] = useState([]);
  const [status, setStatus] = useState("");
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    // allEmployeeList(
    //   { orgId, buId, wgId },
    //   "",
    //   setLoading,
    //   setRowDto,
    //   setAllData,
    //   "",
    //   pages,
    //   "",
    //   setPages
    // );
    getLandingData(pages, "", "true");
    getBuDetails(buId, setBuDetails, setLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, [dispatch]);

  const getLandingData = (pages, srcText, IsPaginated = "true", cb) => {
    // allEmployeeList(
    //   { orgId, buId, wgId },
    //   "",
    //   setLoading,
    //   setRowDto,
    //   setAllData,
    //   "",
    //   pages,
    //   srcText,
    //   setPages
    // );
    getEmployeeReportLanding(
      `/Employee/EmployeeReportWithFilter?businessUnitId=${buId}&workplaceGroupId=${wgId}&IsPaginated=${IsPaginated}&pageSize=${pages?.pageSize}&pageNo=${pages?.current}&searchTxt=${srcText}`,
      (res) => {
        cb?.(res?.data);
        setRowDto(res?.data);
        setAllData(res?.data);
        setPages?.({
          ...pages,
          current: pages.current,
          pageSize: pages.pageSize,
          total: res?.totalCount,
        });
      }
    );
  };
  const saveHandler = (values) => {};

  // menu permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 131) {
      permission = item;
    }
  });

  const handleTableChange = (pagination, newRowDto, srcText) => {
    if (newRowDto?.action === "filter") {
      return;
    }
    if (
      pages?.current === pagination?.current &&
      pages?.pageSize !== pagination?.pageSize
    ) {
      return getLandingData(pagination, srcText);
    }
    if (pages?.current !== pagination?.current) {
      return getLandingData(pagination, srcText);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {(loading || loadingReport) && <Loading />}
              {permission?.isView ? (
                <div className="table-card">
                  <div className="table-card-heading pb-2">
                    <div className="d-flex justify-content-center align-items-center">
                      <Tooltip title="Export CSV" arrow>
                        <button
                          type="button"
                          className="btn-save"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLoading(true);
                            const excelLanding = async () => {
                              try {
                                const res = await axios.get(
                                  `/Employee/EmployeeReportWithFilter?businessUnitId=${buId}&workplaceGroupId=${wgId}&IsPaginated=false&pageSize=${pages?.pageSize}&pageNo=${pages?.current}&searchTxt=`
                                );
                                if (res?.data) {
                                  const newData = res?.data?.map(
                                    (item, index) => {
                                      return {
                                        ...item,
                                        sl: index + 1,
                                      };
                                    }
                                  );
                                  const date = todayDate();

                                  createCommonExcelFile({
                                    titleWithDate: `Employee List -${dateFormatter(
                                      date
                                    )}`,
                                    fromDate: "",
                                    toDate: "",
                                    buAddress:
                                      buDetails?.strBusinessUnitAddress,
                                    businessUnit: buName,
                                    tableHeader:
                                      wgId === 3
                                        ? columnForMarketingForExcel
                                        : columnForExcel,
                                    getTableData: () =>
                                      getTableDataEmployeeReports(
                                        newData,
                                        wgId === 3
                                          ? Object.keys(
                                              columnForMarketingForExcel
                                            )
                                          : Object.keys(columnForExcel)
                                      ),
                                    tableFooter: [],
                                    extraInfo: {},
                                    tableHeadFontSize: 10,
                                    widthList:
                                      wgId === 3
                                        ? {
                                            B: 30,
                                            D: 20,
                                            E: 20,
                                            J: 15,
                                            M: 15,
                                            N: 15,
                                            O: 20,
                                            P: 20,
                                            Q: 15,
                                            T: 25,
                                            U: 25,
                                            V: 15,
                                            AF: 25,
                                          }
                                        : {
                                            B: 30,
                                            D: 30,
                                            E: 30,
                                            G: 20,
                                            H: 20,
                                            T: 20,
                                            J: 30,
                                            K: 15,
                                            M: 25,
                                            N: 25,
                                            O: 20,
                                            P: 20,
                                            Q: 15,
                                            Y: 15,
                                            AF: 35,
                                          },
                                    commonCellRange: "A1:J1",
                                    CellAlignment: "left",
                                  });
                                  setLoading && setLoading(false);
                                }
                              } catch (error) {
                                setLoading && setLoading(false);
                              }
                            };
                            excelLanding();
                          }}
                          disabled={rowDto?.data?.length <= 0}
                        >
                          <SaveAlt
                            sx={{
                              color: gray900,
                              fontSize: "14px",
                            }}
                          />
                        </button>
                      </Tooltip>
                      <div className="ml-2">
                        {rowDto?.length > 0 ? (
                          <>
                            <h6 className="count">
                              Total {rowDto[0]?.totalCount} employees
                            </h6>
                          </>
                        ) : (
                          <>
                            <h6 className="count">Total result 0</h6>
                          </>
                        )}
                      </div>
                    </div>
                    <ul className="d-flex flex-wrap">
                      {(isFilter || status || values?.search) && (
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
                              getLandingData(
                                { current: 1, pageSize: paginationSize },
                                ""
                              );
                              setStatus("");
                              setFieldValue("search", "");
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <MasterFilter
                          isHiddenFilter
                          inputWidth="200px"
                          width="200px"
                          value={values?.search}
                          setValue={(value) => {
                            setFieldValue("search", value);
                            if (value) {
                              getLandingData(
                                { current: 1, pageSize: paginationSize },
                                value
                              );
                            } else {
                              getLandingData(
                                { current: 1, pageSize: paginationSize },
                                ""
                              );
                            }
                          }}
                          cancelHandler={() => {
                            setFieldValue("search", "");
                            getLandingData(
                              { current: 1, pageSize: paginationSize },
                              ""
                            );
                          }}
                          handleClick={(e) => setAnchorEl(e.currentTarget)}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="table-card-body">
                    {rowDto?.length > 0 ? (
                      <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
                        <AntScrollTable
                          data={rowDto}
                          columnsData={empReportListColumns(pages, wgId)}
                          handleTableChange={({ pagination, newRowDto }) =>
                            handleTableChange(
                              pagination,
                              newRowDto,
                              values?.searchString || ""
                            )
                          }
                          pages={pages?.pageSize}
                          pagination={pages}
                        />
                      </div>
                    ) : (
                      !loading && <NoResult title="No Result Found" para="" />
                    )}
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
              <Popover
                sx={{
                  "& .MuiPaper-root": {
                    width: "675px",
                    minHeight: "auto",
                    borderRadius: "4px",
                  },
                }}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <FilterModal
                  objProps={{
                    resetForm,
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    setIsFilter,
                    setAnchorEl,
                    rowDto,
                    setRowDto,
                    setLoading,
                    setAllData,
                    allData,
                    initData,
                  }}
                />
              </Popover>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
