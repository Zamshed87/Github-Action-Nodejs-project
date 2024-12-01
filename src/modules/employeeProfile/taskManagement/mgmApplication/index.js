import React, { useEffect } from "react";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import NoResult from "../../../../common/NoResult";
import DefaultInput from "../../../../common/DefaultInput";
import Loading from "../../../../common/loading/Loading";
import { AddOutlined, SaveAlt } from "@mui/icons-material";
import MasterFilter from "../../../../common/MasterFilter";
import PrimaryButton from "../../../../common/PrimaryButton";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import {
  column,
  getTableDataForExcel,
  getTask,
  initDataForLanding,
  taskLandingTableCol,
  validationSchemaForLanding,
} from "../helper";
import AntTable from "../../../../common/AntTable";
import { Tooltip } from "antd";
import { gray600 } from "../../../../utility/customColor";
import { createCommonExcelFile } from "../../../../utility/customExcel/generateExcelAction";

const ManagementTaskManagement = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const { employeeId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30363) {
      permission = item;
    }
  });

  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const [, getAllTasks, loading] = useAxiosGet([]);

  const getData = (values, pages) => {
    getTask({
      getAllTasks,
      setRowDto,
      fDate: values?.filterFromDate || "",
      tDate: values?.filterToDate || "",
      employeeId: values?.employee?.value || 0,
      isManagement: true,
      srcTxt: values?.search,
      isPaginated: true,
      pageNo: pages?.current,
      pageSize: pages?.pageSize,
      setPages,
    });
  };

  const { setFieldValue, values, handleSubmit, errors, touched } = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchemaForLanding,
    initialValues: initDataForLanding,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      getData(values, pages);
    },
  });

  const handleChangePage = (_, newPage, values) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });
    getData(values, {
      current: newPage,
      pageSize: pages?.pageSize,
      total: pages?.total,
    });
  };
  const handleTableChange = ({ pagination, newRowDto}) => {
    if (newRowDto?.action === "filter") {
      return;
    }
    if (
      pages?.current === pagination?.current &&
      pages?.pageSize !== pagination?.pageSize
    ) {
      return  getData(values, pagination);
    }
    if (pages?.current !== pagination?.current) {
      getData(values, pagination);
    }
  };


  useEffect(() => {
    getData(values, pages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, [dispatch]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/Employee/EmployeeListBySupervisorORLineManagerNOfficeadmin?EmployeeId=${employeeId}`,
      "intEmployeeBasicInfoId",
      "strEmployeeName",
      setEmployeeDDL
    );
  }, [employeeId]);

  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <form onSubmit={handleSubmit}>
          <div className="table-card businessUnit-wrapper dashboard-scroll">
            <div className="d-flex">
              <Tooltip title="Export CSV" arrow>
                <div
                  className="btn-save"
                  onClick={(e) => {
                    createCommonExcelFile({
                      titleWithDate: `Employee Assigned Report`,
                      buAddress: "",
                      businessUnit: buName,
                      orgId,
                      tableHeader: column,
                      getTableData: () => getTableDataForExcel(rowDto),
                      // widthList,
                    });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <SaveAlt sx={{ color: gray600, fontSize: "16px" }} />
                </div>
              </Tooltip>
            </div>
            <div className="table-card-heading">
              <div>{/* <h6>Separation</h6> */}</div>
              <ul className="d-flex flex-wrap">
                <li>
                  <MasterFilter
                    inputWidth="200"
                    width="200px"
                    isHiddenFilter
                    value={values?.search}
                    setValue={(value) => {
                      setFieldValue("search", value);
                      getTask({
                        getAllTasks,
                        setRowDto,
                        fDate: values?.filterFromDate || "",
                        tDate: values?.filterToDate || "",
                        employeeId: values?.employee?.value || employeeId,
                        isManagement: true,
                        srcTxt: value,
                        isPaginated: true,
                        pageNo: pages?.current,
                        pageSize: pages?.pageSize,
                        setPages,
                      });
                    }}
                    cancelHandler={() => {
                      setFieldValue("search", "");
                      getTask({
                        getAllTasks,
                        setRowDto,
                        fDate: values?.filterFromDate || "",
                        tDate: values?.filterToDate || "",
                        employeeId: values?.employee?.value || employeeId,
                        isManagement: true,
                        srcTxt: "",
                        isPaginated: true,
                        pageNo: pages?.current,
                        pageSize: pages?.pageSize,
                        setPages,
                      });
                    }}
                  />
                </li>
                <li>
                  <PrimaryButton
                    type="button"
                    className="btn btn-default flex-center"
                    label={"Create"}
                    icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!permission?.isCreate)
                        return toast.warn("You don't have permission");
                      history.push("/profile/taskManagement/create");
                    }}
                  />
                </li>
              </ul>
            </div>

            <div className="card-style pb-0 mb-2" style={{ marginTop: "12px" }}>
              <div className="row">
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>From Date</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.filterFromDate}
                      placeholder="Month"
                      name="filterFromDate"
                      max={values?.filterToDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("filterFromDate", e.target.value);
                        setFieldValue("filterToDate", "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>To Date</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.filterToDate}
                      placeholder="Month"
                      name="filterToDate"
                      min={values?.filterFromDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("filterToDate", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Assigned Employee</label>

                    <FormikSelect
                      menuPosition="fixed"
                      name="employee"
                      options={employeeDDL || []}
                      value={values?.employee}
                      onChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                      }}
                      styles={customStyles}
                      errors={errors}
                      placeholder=""
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <button
                    className="btn btn-green btn-green-disable mt-4"
                    type="submit"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
            {rowDto?.length > 0 ? (
              // <div className="table-card-body">
              //   <PeopleDeskTable
              //     columnData={taskLandingTableCol(
              //       pages?.current,
              //       pages?.pageSize
              //     )}
              //     pages={pages}
              //     rowDto={rowDto}
              //     setRowDto={setRowDto}
              //     handleChangePage={(e, newPage) =>
              //       handleChangePage(e, newPage, values)
              //     }
              //     handleChangeRowsPerPage={(e) =>
              //       handleChangeRowsPerPage(e, values)
              //     }
              //     onRowClick={(res) => {

              //       history.push(
              //         `/profile/taskManagement/view/${res?.headerId}`
              //       );
              //     }}
              //     uniqueKey="headerId"
              //   />
              // </div>

              <div className="table-card-body">
                <div className="table-card-styled tableOne">
                  <div className="table-card-styled employee-table-card tableOne">
                    <AntTable
                      data={rowDto}
                      columnsData={taskLandingTableCol(
                        setPage,
                        setPaginationSize
                      )}
                      onRowClick={(res) => {
                        history.push(
                          `/profile/taskManagement/view/${res?.headerId}`
                        );
                      }}
                      handleTableChange={handleTableChange}
                      setPage={setPage}
                      setPaginationSize={setPaginationSize}
                      rowClassName="pointer"
                      rowKey={(record) => record?.headerId}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>{!loading && <NoResult title="No Result Found" para="" />}</>
            )}
          </div>
        </form>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default ManagementTaskManagement;
