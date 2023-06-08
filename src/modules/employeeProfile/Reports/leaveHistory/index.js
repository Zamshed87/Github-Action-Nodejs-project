/* eslint-disable react-hooks/exhaustive-deps */
import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AntTable from "../../../../common/AntTable";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { getPDFAction } from "../../../../utility/downloadFile";
import FilterModal from "./component/FilterModal";
import { generateExcelAction } from "./excel/excelConvert";
import {
  contractualExcelColumn,
  contractualExcelData,
} from "./excel/excelStyle";
import {
  getBuDetails,
  getLeaveHistoryAction,
  hasLeave,
  leaveHistoryCol,
} from "./helper";
let date = new Date();
let year = date.getFullYear();
const initData = {
  search: "",
};

const EmLeaveHistory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, []);
  const { buId, orgId, buName, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [isFilter, setIsFilter] = useState(false);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [buDetails, setBuDetails] = useState({});

  const getData = () => {
    let date = new Date();
    getLeaveHistoryAction(
      setAllData,
      buId,
      orgId,
      wgId,
      date.getFullYear(),
      setLoading,
      setRowDto,
      setTableRowDto
    );
  };

  useEffect(() => {
    getData();
    getBuDetails(buId, setBuDetails, setLoading);
  }, [buId, wgId]);

  const searchData = (keywords) => {
    try {
      if (!keywords) {
        setRowDto(allData);
        return;
      }
      setLoading(true);
      const regex = new RegExp(keywords?.toLowerCase());
      let newData = allData?.filter(
        (item) =>
          regex.test(item?.employee?.toLowerCase()) ||
          regex.test(item?.designation?.toLowerCase()) ||
          regex.test(item?.department?.toLowerCase())
      );
      setRowDto(newData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setRowDto([]);
    }
  };

  const masterFilterHandler = ({
    workplace,
    department,
    designation,
    employee,
    year,
  }) => {
    let date = new Date();
    getLeaveHistoryAction(
      setAllData,
      buId,
      orgId,
      year?.value || date.getFullYear(),
      setLoading,
      setRowDto,
      workplace?.value,
      department?.value,
      designation?.value,
      employee?.value
    );
  };
  const [tableRowDto, setTableRowDto] = useState([]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 100) {
      permission = item;
    }
  });
  // excel column set up
  const excelColumnFunc = () => {
    return contractualExcelColumn;
  };

  // excel data set up
  const excelDataFunc = () => {
    return contractualExcelData(rowDto);
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
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="loan-application">
                  <div className="table-card">
                    <div className="table-card-heading justify-content-between pb-2">
                      <div className="d-flex">
                        <Tooltip title="Export CSV" arrow>
                          <button
                            disabled={tableRowDto?.data?.length <= 0}
                            type="button"
                            className="btn-save"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (rowDto?.length <= 0) {
                                return toast.warning("Data is empty !!!!", {
                                  toastId: 1,
                                });
                              }
                              const excelLanding = () => {
                                generateExcelAction(
                                  "Leave History Report",
                                  "",
                                  "",
                                  excelColumnFunc(),
                                  excelDataFunc(),
                                  buName,
                                  0,
                                  tableRowDto?.data,
                                  buDetails?.strBusinessUnitAddress
                                );
                              };
                              excelLanding();
                            }}
                          >
                            <SaveAlt
                              sx={{ color: "#637381", fontSize: "16px" }}
                            />
                          </button>
                        </Tooltip>
                      </div>
                      <div></div>
                      <div className="table-card-head-right">
                        <ul>
                          {(values?.search || isFilter) && (
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
                                  setRowDto(allData);
                                  setIsFilter(false);
                                  getData();
                                  setFieldValue("search", "");
                                }}
                              />
                            </li>
                          )}
                          <li>
                            <MasterFilter
                              width="200px"
                              inputWidth="200px"
                              value={values?.search}
                              setValue={(value) => {
                                setFieldValue("search", value);
                                searchData(value);
                              }}
                              cancelHandler={() => {
                                getData();
                                setFieldValue("search", "");
                              }}
                              isHiddenFilter
                              handleClick={handleClick}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-card-body">
                      {/*  <TableScrollable
                        setLoading={setLoading}
                        rowDto={rowDto}
                      /> */}
                      {rowDto?.length > 0 ? (
                        <>
                          <div className="table-card-styled employee-table-card tableOne">
                            <AntTable
                              data={rowDto}
                              columnsData={leaveHistoryCol(
                                page,
                                paginationSize
                              )}
                              onRowClick={(data) => {
                                hasLeave(data) &&
                                  getPDFAction(
                                    `/PdfAndExcelReport/LeaveHistoryReport?EmployeeId=${data?.employeeId}&fromDate=${year}-01-01&toDate=${year}-12-31`,
                                    setLoading
                                  );
                              }}
                              setColumnsData={(newRow) =>
                                setTableRowDto((prev) => ({
                                  ...prev,
                                  data: newRow,
                                  totalCount: newRow?.length,
                                }))
                              }
                              setPage={setPage}
                              setPaginationSize={setPaginationSize}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <NoResult title="No Result Found" para="" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
            <FilterModal
              propsObj={{
                id,
                open,
                anchorEl,
                setAnchorEl,
                handleClose,
                setFieldValue,
                values,
                errors,
                touched,
                setIsFilter,
              }}
              getData={getData}
              masterFilterHandler={masterFilterHandler}
            />
          </>
        )}
      </Formik>
    </>
  );
};

export default EmLeaveHistory;
