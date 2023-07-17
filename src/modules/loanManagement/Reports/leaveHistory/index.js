/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import TableScrollable from "./component/TableScrollable";
import FilterModal from "./component/FilterModal";
import { getLeaveHistoryAction } from "./helper";
import ResetButton from "../../../../common/ResetButton";
import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";

const initData = {
  search: "",
};

const LeaveHistory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  const { buId, employeeId } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [isFilter, setIsFilter] = useState(false);

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

  const getData = () => {
    let date = new Date();
    getLeaveHistoryAction(setAllData, buId, date.getFullYear(), setLoading, setRowDto);
  };

  useEffect(() => {
    getData();
  }, [buId]);

  const searchData = (keywords) => {
    try {
      if (!keywords) {
        setRowDto(allData);
        return;
      }
      setLoading(true);
      const regex = new RegExp(keywords?.toLowerCase());
      let newData = allData?.filter(
        (item) => regex.test(item?.employee?.toLowerCase()) || regex.test(item?.designation?.toLowerCase()) || regex.test(item?.department?.toLowerCase())
      );
      setRowDto(newData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setRowDto([]);
    }
  };

  const masterFilterHandler = ({ workplace, department, designation, employee, year }) => {
    let date = new Date();
    getLeaveHistoryAction(setAllData, buId, year?.value || date.getFullYear(), setLoading, setRowDto, workplace?.value, department?.value, designation?.value, employee?.value);
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
        {({ handleSubmit, resetForm, values, errors, touched, setFieldValue, isValid }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="table-card">
                <div className="table-card-heading justify-content-between">
                  <div className="d-flex">
                    <Tooltip title="Export CSV" arrow>
                      <button
                        className="btn-save "
                        type="button"
                        // onClick={(e) => {
                        //   downloadFile(
                        //     `/emp/PdfAndExcelReport/MonthlySalaryReportExportAsExcel?BusinessUnitId=10&Year=2021&Month=12&WorkplaceGroupId=0&DepartmentId=0&DesignationId=0&EmployeeId=0`,
                        //     "Salary Details",
                        //     "xlsx",
                        //     setLoading
                        //   );
                        // }}
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
                        // onClick={() => {
                        //   let splittedMonth = values?.month?.split("-");
                        //   let date = new Date();
                        //   getPDFAction(
                        //     `/emp/PdfAndExcelReport/MonthlySalaryReport?BusinessUnitId=${buId}&Year=${splittedMonth?.[0] || date.getFullYear()}&Month=${
                        //       splittedMonth?.[1] || date.getMonth() + 1
                        //     }&WorkplaceGroupId=${values?.workplaceGroup?.value || 0}&DepartmentId=${values?.department?.value || 0}&DesignationId=${
                        //       values?.designation?.value || 0
                        //     }&EmployeeId=${values?.employee?.value || 0}`,
                        //     setLoading
                        //   );
                        // }}
                        type="button"
                        className="btn-save ml-3"
                        style={{
                          border: "transparent",
                          width: "30px",
                          height: "30px",
                          background: "#f2f2f7",
                          borderRadius: "100px",
                        }}
                      >
                        <PrintIcon sx={{ color: "#637381", fontSize: "16px" }} />
                      </button>
                    </Tooltip>
                  </div>
                  <div className="table-card-head-right">
                    <ul>
                      {(values?.search || isFilter) && (
                        <li>
                          <ResetButton
                            title="reset"
                            icon={<SettingsBackupRestoreOutlined sx={{ marginRight: "10px" }} />}
                            onClick={() => {
                              setRowDto(allData);
                              setIsFilter(false);
                              getData();
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
                            setFieldValue("search", "");
                            getData();
                          }}
                          handleClick={handleClick}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="table-card-body mt-3">
                  <TableScrollable setLoading={setLoading} rowDto={rowDto} employeeId={employeeId} />
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
              getData={getData}
              masterFilterHandler={masterFilterHandler}
            />
          </>
        )}
      </Formik>
    </>
  );
};

export default LeaveHistory;
