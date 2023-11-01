/* eslint-disable react-hooks/exhaustive-deps */
import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { downloadFile, getPDFAction } from "../../../../utility/downloadFile";
import FilterModal from "./component/FilterModal";
import MovementHistroyTable from "./component/MovementHistroyTable";
import { getMovementHistory } from "./helper";

let date = new Date();
let year = date.getFullYear();
let initStartData = `${year}-01-01`;
let initEndDate = `${year}-12-31`;

const initData = {
  search: "",
};

const MovementHistory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);

  const [allValues, setAllValues] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [rowDto, setRowDto] = useState(null);
  const [allData, setAllData] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  // filter
  const [viewOrder, setViewOrder] = useState("desc");
  const [designationOrder, setdesignationOrder] = useState("desc");
  const [departmentOrder, setdepartmentOrder] = useState("desc");

  useEffect(() => {
    getMovementHistory(
      buId,
      0,
      0,
      0,
      0,
      0,
      initStartData,
      initEndDate,
      "all",
      setRowDto,
      setLoading,
      setAllData
    );
  }, [orgId, buId]);

  // ascending & descending
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...rowDto];
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
    setRowDto(modifyRowData);
  };
  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter((item) =>
        regex.test(item?.EmployeeName?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };
  const masterFilterHandler = ({
    appStatus,
    department,
    designation,
    employee,
    movementType,
    workplace,
    fromDate,
    toDate,
  }) => {
    getMovementHistory(
      buId,
      workplace?.value || 0,
      department?.value || 0,
      designation?.value || 0,
      movementType?.value || 0,
      employee?.value || 0,
      fromDate || initStartData,
      toDate || initEndDate,
      appStatus?.label || "all",
      setRowDto,
      setLoading,
      setAllData
    );
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
              <div className="table-card">
                <div className="table-card-heading">
                  <div className="d-flex">
                    <Tooltip title="Export CSV" arrow>
                      <button
                        type="button"
                        className="btn-save "
                        onClick={() => {
                          downloadFile(
                            `/emp/PdfAndExcelReport/MovementReportExportAsExcel?BusinessUnitId=${buId}&WorkplaceGroupId=${
                              allValues?.workplace?.value || 0
                            }&DeptId=${
                              allValues?.department?.value || 0
                            }&DesigId=${
                              allValues?.designation?.value || 0
                            }&MovementTypeId=${
                              allValues?.movementType?.value || 0
                            }&EmployeeId=${
                              allValues?.employee?.value || 0
                            }&FromDate=${
                              allValues?.fromDate || initStartData
                            }&ToDate=${
                              allValues?.toDate || initEndDate
                            }&applicationStatus=${
                              allValues?.appStatus?.label || "all"
                            }`,
                            "Movement History",
                            "xlsx",
                            setLoading
                          );
                        }}
                        style={{
                          border: "transparent",
                          width: "30px",
                          height: "30px",
                          background: "#f2f2f7",
                          borderRadius: "100px",
                        }}
                      >
                        <SaveAlt sx={{ color: "#637381", fontSize: "16px" }} />
                      </button>
                    </Tooltip>
                    <Tooltip title="Print" arrow>
                      <button
                        className="btn-save ml-3"
                        type="button"
                        style={{
                          border: "transparent",
                          width: "30px",
                          height: "30px",
                          background: "#f2f2f7",
                          borderRadius: "100px",
                        }}
                        onClick={(e) => {
                          getPDFAction(
                            `/emp/PdfAndExcelReport/MovementReport?BusinessUnitId=${buId}&WorkplaceGroupId=${
                              allValues?.workplace?.value || 0
                            }&DeptId=${
                              allValues?.department?.value || 0
                            }&DesigId=${
                              allValues?.designation?.value || 0
                            }&MovementTypeId=${
                              allValues?.movementType?.value || 0
                            }&EmployeeId=${
                              allValues?.employee?.value || 0
                            }&FromDate=${
                              allValues?.fromDate || initStartData
                            }&ToDate=${
                              allValues?.toDate || initEndDate
                            }&applicationStatus=${
                              allValues?.appStatus?.label || "all"
                            }`,
                            setLoading
                          );
                        }}
                      >
                        <PrintIcon
                          sx={{ color: "#637381", fontSize: "16px" }}
                        />
                      </button>
                    </Tooltip>
                  </div>
                  <ul className="d-flex flex-wrap">
                    {isFilter && (
                      <li>
                        <ResetButton
                          title="reset"
                          icon={
                            <SettingsBackupRestoreOutlined
                              sx={{ marginRight: "10px" }}
                            />
                          }
                          onClick={() => {
                            setIsFilter(false);
                            setFieldValue("search", "");
                            getMovementHistory(
                              buId,
                              0,
                              0,
                              0,
                              0,
                              0,
                              initStartData,
                              initEndDate,
                              "all",
                              setRowDto,
                              setLoading,
                              setAllData
                            );
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
                          searchData(value, allData, setRowDto);
                          setFieldValue("search", value);
                        }}
                        cancelHandler={() => {
                          setIsFilter(false);
                          setFieldValue("search", "");
                          getMovementHistory(
                            buId,
                            0,
                            0,
                            0,
                            0,
                            0,
                            initStartData,
                            initEndDate,
                            "all",
                            setRowDto,
                            setLoading,
                            setAllData
                          );
                        }}
                        handleClick={handleClick}
                      />
                    </li>
                  </ul>
                  {/* <div className="table-card-head-right">
                            <MasterFilter
                              width="200px"
                              value={values?.search}
                              setValue={(value) => {
                                setFieldValue("search", value);
                              }}
                              cancelHandler={() => {
                                setFieldValue("search", "");
                              }}
                              handleClick={handleClick}
                            />
                          </div> */}
                </div>
                <div className="table-card-body">
                  <div className="table-card-styled tableOne">
                    {rowDto?.length > 0 ? (
                      <table className="table">
                        <thead>
                          <tr>
                            <th>
                              <div
                                className="sortable"
                                onClick={() => {
                                  setViewOrder(
                                    viewOrder === "desc" ? "asc" : "desc"
                                  );
                                  commonSortByFilter(viewOrder, "EmployeeName");
                                }}
                              >
                                <span>Employee</span>
                                <div>
                                  {/* <SortingIcon viewOrder={viewOrder}></SortingIcon> */}
                                </div>
                              </div>
                            </th>
                            <th>
                              <div
                                className="sortable"
                                onClick={() => {
                                  setdesignationOrder(
                                    designationOrder === "desc" ? "asc" : "desc"
                                  );
                                  commonSortByFilter(
                                    designationOrder,
                                    "DesignationName"
                                  );
                                }}
                              >
                                <span> Designation Name</span>
                                <div>
                                  {/* <SortingIcon viewOrder={designationOrder}></SortingIcon> */}
                                </div>
                              </div>
                            </th>
                            <th>
                              <div
                                className="sortable"
                                onClick={() => {
                                  setdepartmentOrder(
                                    departmentOrder === "desc" ? "asc" : "desc"
                                  );
                                  commonSortByFilter(
                                    departmentOrder,
                                    "DepartmentName"
                                  );
                                }}
                              >
                                <span> Department</span>
                                <div>
                                  {/* <SortingIcon viewOrder={departmentOrder}></SortingIcon> */}
                                </div>
                              </div>
                            </th>
                            <th>
                              <div className="sortable justify-content-center">
                                <span>Duration (Day)</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map(
                            (item, index) =>
                              item?.EmployeeId === employeeId && (
                                <tr key={index}>
                                  <MovementHistroyTable
                                    item={item}
                                    index={index}
                                    setRowDto={setRowDto}
                                    setLoading={setLoading}
                                  />
                                </tr>
                              )
                          )}
                        </tbody>
                      </table>
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
              setAllValues={setAllValues}
              masterFilterHandler={masterFilterHandler}
            />
          </>
        )}
      </Formik>
    </>
  );
};

export default MovementHistory;
