import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { Form, Formik, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import FormikInput from "../../../../common/FormikInput";
import PrimaryButton from "../../../../common/PrimaryButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray600 } from "../../../../utility/customColor";
import { dateFormatterForInput } from "../../../../utility/dateFormatter";
import { getPDFAction } from "../../../../utility/downloadFile";

import { getBuDetails } from "../helper";

import { toast } from "react-toastify";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import ResetButton from "./../../../../common/ResetButton";
import { column, getJoiningData, getTableData, joiningDtoCol } from "./helper";
import { getWorkplaceDetails } from "common/api";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";

const todayDate = dateFormatterForInput(new Date());
const initData = {
  search: "",
  //   fromDate: todayDate,
  //   toDate: todayDate,
};

export default function JoiningReport() {
  // dispatch
  const dispatch = useDispatch();
  const { buId, orgId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const getData = (
    pagination = { current: 1, pageSize: paginationSize },
    srcTxt = "",
    isExcel = false
  ) => {
    getJoiningData(
      buId,
      setRowDto,
      setLoading,
      srcTxt,
      pagination?.current,
      pagination?.pageSize,
      isExcel,
      wgId,
      setPages,
      wId,
      orgId
    );
  };
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  const { buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // hooks
  const [rowDto, setRowDto] = useState([]);
  const [tempLoading, setTempLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buDetails, setBuDetails] = useState({});
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  useEffect(() => {
    getData();
  }, [buId, orgId, wgId, wId]);
  useEffect(() => {
    getWorkplaceDetails(wId, setBuDetails);
  }, [buId, orgId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Joining Report";
  }, []);

  // handleChangePage
  const handleChangePage = (_, newPage) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });
    getData(
      {
        current: newPage === 0 ? 1 : newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      ""
    );
  };
  //handleChangeRowsPerPage
  const handleChangeRowsPerPage = (event) => {
    setPages((prev) => {
      return { ...prev, pageSize: +event.target.value };
    });
    getData(
      {
        current: pages?.current,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      ""
    );
  };

  //   const saveHandler = (values) => {

  //   };

  // const activity_day_total = (fieldName) => {
  //   let total = 0;
  //   rowDto?.data?.map((row) => (total += row[fieldName]));
  //   return total;
  // };

  //  permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30382) {
      permission = item;
    }
  });
  // formik
  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    onSubmit: () => {
      //   getData({ current: 1, pageSize: paginationSize }, "", values?.date);
      //   setFieldValue("search", "");
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        {(loading || tempLoading) && <Loading />}
        <div>
          {permission?.isView ? (
            <div className="table-card">
              <div className="table-card-heading">
                <div className="d-flex">
                  <Tooltip title="Export CSV" arrow>
                    <div
                      className="btn-save"
                      onClick={(e) => {
                        e.preventDefault();
                        const excelLanding = async () => {
                          setLoading && setLoading(true);
                          try {
                            const res = await axios.get(
                              `/Employee/GetEmployeeSalaryReportByJoining?IntAccountId=${orgId}&IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}`
                            );
                            if (res?.data) {
                              if (res?.data < 1) {
                                setLoading(false);
                                return toast.error("No Data Found");
                              }
                              const newData = res?.data?.map((item, index) => {
                                return {
                                  ...item,
                                  sl: index + 1,
                                };
                              });
                              createCommonExcelFile({
                                titleWithDate: `Joining Report ${values?.date} `,
                                fromDate: "",
                                toDate: "",
                                buAddress: buDetails?.strAddress,
                                businessUnit: buDetails?.strWorkplace,
                                tableHeader: column,
                                getTableData: () =>
                                  getTableData(
                                    newData,
                                    Object.keys(column),
                                    res?.data
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
                                tableFooter: [
                                  "Total",
                                  "",
                                  "",
                                  "",
                                  "",
                                  "",
                                  "",
                                  "",
                                  res?.totalEarlyOut,
                                ],
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
                            }
                            setLoading && setLoading(false);
                          } catch (error) {
                            setLoading && setLoading(false);
                          }
                        };
                        excelLanding();
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <SaveAlt sx={{ color: gray600, fontSize: "16px" }} />
                    </div>
                  </Tooltip>
                </div>
                <div className="table-card-head-right d-none">
                  <ul>
                    {(values?.search || values?.dateRange) && (
                      <li>
                        <ResetButton
                          title="reset"
                          icon={
                            <SettingsBackupRestoreOutlined
                              sx={{ marginRight: "10px" }}
                            />
                          }
                          onClick={() => {
                            setFieldValue("dateRange", "");
                            setFieldValue("search", "");
                          }}
                        />
                      </li>
                    )}
                    <li>
                      <div
                        className="d-flex align-items-end"
                        style={{ paddingBottom: "7px" }}
                      >
                        <div className="mr-3 d-flex align-items-center">
                          <label className="mr-2">From Date</label>
                          {/* <FormikInput
                            classes="input-sm"
                            type="date"
                            value={values?.fromDate}
                            name="fromDate"
                            onChange={(e) => {
                              setFieldValue("fromDate", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          /> */}
                        </div>
                        <div className="mr-3 d-flex align-items-center">
                          <label className="mr-2">To Date</label>
                          {/* <FormikInput
                            classes="input-sm"
                            type="date"
                            value={values?.toDate}
                            name="toDate"
                            min={values?.fromDate}
                            onChange={(e) => {
                              setFieldValue("toDate", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          /> */}
                        </div>
                        <div>
                          <PrimaryButton
                            type="submit"
                            className="btn btn-default flex-center"
                            label={"Apply"}
                            onClick={() => {}}
                            onSubmit={() => handleSubmit()}
                          />
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              {rowDto?.data?.length > 0 ? (
                <PeopleDeskTable
                  columnData={joiningDtoCol(pages?.current, pages?.pageSize)}
                  pages={pages}
                  rowDto={rowDto?.data}
                  setRowDto={setRowDto}
                  handleChangePage={(e, newPage) =>
                    handleChangePage(e, newPage, values?.search)
                  }
                  handleChangeRowsPerPage={(e) =>
                    handleChangeRowsPerPage(e, values?.search)
                  }
                  uniqueKey="employeeCode"
                  isScrollAble={true}
                />
              ) : null}
            </div>
          ) : (
            <NotPermittedPage />
          )}
        </div>
      </form>
    </>
  );
}
