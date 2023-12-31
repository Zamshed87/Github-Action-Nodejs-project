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
import {
  dateFormatter,
  dateFormatterForInput,
} from "../../../../utility/dateFormatter";
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
import MasterFilter from "common/MasterFilter";
import useDebounce from "utility/customHooks/useDebounce";

const todayDate = dateFormatterForInput(new Date());
const initData = {
  search: "",
  //   fromDate: todayDate,
  //   toDate: todayDate,
};

export default function JoiningReport() {
  // dispatch
  const dispatch = useDispatch();
  const { buId, orgId, wgId, wId, wName, wgName } = useSelector(
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
                              `/Employee/GetEmployeeSalaryReportByJoining?IntAccountId=${orgId}&IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}&PageNo=${1}&PageSize=${100000}`
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
                                  workplace: wName,
                                  workplaceGroup: wgName,
                                  dteJoiningDate: dateFormatter(
                                    item?.dteJoiningDate
                                  ),
                                };
                              });
                              createCommonExcelFile({
                                titleWithDate: `Joining Report  `,
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
                <div className="table-card-head-right ">
                  <ul>
                    {values?.search && (
                      <li>
                        <ResetButton
                          title="reset"
                          icon={
                            <SettingsBackupRestoreOutlined
                              sx={{ marginRight: "10px" }}
                            />
                          }
                          onClick={() => {
                            setFieldValue("search", "");
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
                          useDebounce(() => {
                            getData(
                              { current: 1, pageSize: paginationSize },
                              value
                            );
                          }, 500);
                        }}
                        cancelHandler={() => {
                          setFieldValue("search", "");
                          getData({ current: 1, pageSize: paginationSize }, "");
                        }}
                      />
                    </li>
                  </ul>
                </div>
              </div>
              {rowDto?.length > 0 ? (
                <PeopleDeskTable
                  columnData={joiningDtoCol(
                    pages?.current,
                    pages?.pageSize,
                    wName,
                    wgName
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
