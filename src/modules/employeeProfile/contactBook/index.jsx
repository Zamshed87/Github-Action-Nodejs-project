/* eslint-disable react-hooks/exhaustive-deps */
import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NoResult from "../../../common/NoResult";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import Loading from "./../../../common/loading/Loading";
import "./contactBook.css";
import { generateExcelAction } from "./Excel/excelConvert";
import {
  empSelfContactBookCol,
  getBuDetails,
  getEmpContactInfoNew,
} from "./helper";
import PeopleDeskTable, {
  paginationSize,
} from "../../../common/peopleDeskTable";
import MasterFilter from "../../../common/MasterFilter";
import useDebounce from "../../../utility/customHooks/useDebounce";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";

const initData = {
  search: "",
};

export default function ContactBook() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  // eslint-disable-next-line no-unused-vars
  const { buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [buDetails, setBuDetails] = useState({});
  // const [allData, setAllData] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const debounce = useDebounce();
  const [, getExcelData, apiLoading] = useAxiosGet();

  const getData = (
    pagination = { current: 1, pageSize: paginationSize },
    srcTxt = "",
    isExcel = false
  ) => {
    getEmpContactInfoNew({
      setLoading,
      setter: setRowDto,
      buId,
      pageNo: pagination?.current,
      pageSize: pagination?.pageSize,
      srcTxt,
      setPages,
      isExcel,
    });
  };

  useEffect(() => {
    getData();
  }, [wgId]);
  useEffect(() => {
    getBuDetails(buId, setBuDetails, setLoading);
  }, [buId]);

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
      searchText
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      searchText
    );
  };

  const saveHandler = (values) => {};

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {(loading || apiLoading) && <Loading />}
              <div className="table-card">
                <div
                  className="table-card-heading"
                  style={{ marginBottom: "12px" }}
                >
                  <div className="d-flex justify-content-center align-items-center">
                    <Tooltip title="Download Application">
                      <button
                        className="btn-save "
                        style={{
                          border: "transparent",
                          width: "30px",
                          height: "30px",
                          background: "#f2f2f7",
                          borderRadius: "100px",
                        }}
                        onClick={() => {
                          getExcelData(
                            `/Employee/EmployeeContactInfo?businessUnitId=${buId}&pageSize=10000&pageNo=1&isForEXL=true&searchText=${values?.search}`,
                            (res) => {
                              generateExcelAction(
                                "Employee Contact Report",
                                "",
                                "",
                                buDetails?.strBusinessUnit,
                                res,
                                buDetails?.strBusinessUnitAddress
                              );
                            }
                          );
                        }}
                      >
                        <SaveAlt sx={{ color: "#637381", fontSize: "16px" }} />
                      </button>
                    </Tooltip>
                    <div className="ml-2">
                      {rowDto?.totalCount > 0 ? (
                        <>
                          <h6 className="count">
                            Total {rowDto?.totalCount} employees
                          </h6>
                        </>
                      ) : (
                        <>
                          <h6 className="count">Total result 0</h6>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="table-card-head-right">
                    <ul className="d-flex">
                      {values?.search && (
                        <li>
                          <ResetButton
                            classes="btn-filter-reset"
                            title="reset"
                            icon={
                              <SettingsBackupRestoreOutlined
                                sx={{ marginRight: "10px", fontSize: "16px" }}
                              />
                            }
                            onClick={() => {
                              setFieldValue("search", "");
                              getData(
                                { current: 1, pageSize: paginationSize },
                                ""
                              );
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
                            debounce(() => {
                              getData(
                                { current: 1, pageSize: paginationSize },
                                value
                              );
                            }, 500);
                          }}
                          cancelHandler={() => {
                            setFieldValue("search", "");
                            getData(
                              { current: 1, pageSize: paginationSize },
                              ""
                            );
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                {/* <div className="table-card-styled tableOne"> */}
                {rowDto?.data?.length > 0 ? (
                  <PeopleDeskTable
                    columnData={empSelfContactBookCol(
                      pages?.current,
                      pages?.pageSize
                    )}
                    pages={pages}
                    rowDto={rowDto?.data}
                    setRowDto={setRowDto}
                    handleChangePage={(e, newPage) =>
                      handleChangePage(e, newPage, values?.search)
                    }
                    handleChangeRowsPerPage={(e) =>
                      handleChangeRowsPerPage(e, values?.search)
                    }
                    uniqueKey="expenseId"
                    isCheckBox={false}
                    isScrollAble={true}
                  />
                ) : (
                  <>
                    {!loading && <NoResult title="No Result Found" para="" />}
                  </>
                )}
              </div>
              {/* </div> */}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

// old table

/* <table className="table">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>
                            <div>SL</div>
                          </th>
                          <th style={{ width: "30px" }}>
                            <div>Code</div>
                          </th>
                          <th>
                            <div
                              className="d-flex align-items-center pointer"
                              onClick={() => {
                                setEmployeeOrder(
                                  employeeOrder === "desc" ? "asc" : "desc"
                                );
                                commonSortByFilter(
                                  employeeOrder,
                                  "EmployeeName"
                                );
                              }}
                            >
                              Employee Name
                              <div>
                                <SortingIcon
                                  viewOrder={employeeOrder}
                                ></SortingIcon>
                              </div>
                            </div>
                          </th>
                          <th className="text-center">Reference Id</th>
                          <th>
                            <div
                              className="d-flex align-items-center pointer"
                              onClick={() => {
                                setDepartment(
                                  department === "desc" ? "asc" : "desc"
                                );
                                commonSortByFilter(
                                  department,
                                  "DepartmentName"
                                );
                              }}
                            >
                              Department
                              <div>
                                <SortingIcon
                                  viewOrder={department}
                                ></SortingIcon>
                              </div>
                            </div>
                          </th>
                          <th>
                            <div
                              className="d-flex align-items-center pointer"
                              onClick={() => {
                                setDesignation(
                                  designation === "desc" ? "asc" : "desc"
                                );
                                commonSortByFilter(
                                  designation,
                                  "DesignationName"
                                );
                              }}
                            >
                              Designation
                              <div>
                                <SortingIcon
                                  viewOrder={designation}
                                ></SortingIcon>
                              </div>
                            </div>
                          </th>
                          <th>Mobile No</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((item, i) => (
                          <tr key={i}>
                            <td>
                              <div>{i + 1}</div>
                            </td>
                            <td>
                              <div className="tableBody-title">
                                {item?.EmployeeCode}
                              </div>
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              <div className="employeeInfo d-flex align-items-center">
                                <div className="pr-2">
                                  <AvatarComponent
                                    letterCount={1}
                                    label={item?.EmployeeName}
                                  />
                                </div>

                                <div className="tableBody-title">
                                  {item?.EmployeeName}
                                </div>
                              </div>
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              <div className="tableBody-title text-center">
                                {item?.strReferenceId}
                              </div>
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              <div className="tableBody-title">
                                {item?.DepartmentName}
                              </div>
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              <div className="tableBody-title">
                                {item?.DesignationName}
                              </div>
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              <div className="tableBody-title">
                                {item?.Phone}
                              </div>
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              <div className="tableBody-title">
                                {item?.Email}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table> */
