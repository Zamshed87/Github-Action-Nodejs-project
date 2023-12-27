import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import Loading from "./../../../../common/loading/Loading";
import NoResult from "./../../../../common/NoResult";
import "./calendar.css";
import {
  columns,
  demoPopup,
  getData,
  handleChangePage,
  handleChangeRowsPerPage,
  initData,
  initHeaderList,
  validationSchema,
} from "./helper";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";

import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { useHistory, useLocation } from "react-router-dom";
import { yearDDLAction } from "utility/yearDDL";

function LeavePolicyAssign() {
  // redux
  let permission = null;
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const history = useHistory();
  const { orgId, buId, wgId, wgName, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 44) {
      permission = item;
    }
  });
  const dispatch = useDispatch();
  const { state } = useLocation();

  // row Data
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState([]);
  // const [checked, setChecked] = useState([]);

  // pagination
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  // peopledesk states
  const [landingLoading, setLandingLoading] = useState(false);
  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});
  const [headerList, setHeaderList] = useState({});
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });
  const [checkedList, setCheckedList] = useState([]);
  const [empIDString, setEmpIDString] = useState([]);
  const [isAssignAll, setIsAssignAll] = useState(false);

  // sidebar
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Leave Policy Assign";
  }, []);

  // landing data
  useEffect(() => {
    let temp = state?.list?.length > 0 ? state?.list : [];
    getData(
      { current: 1, pageSize: paginationSize, total: 0 },
      setLandingLoading,
      buId,
      wgId,
      wId,
      headerList,
      setHeaderList,
      setFilterOrderList,
      initialHeaderListData,
      setInitialHeaderListData,
      setPages,
      setEmpIDString,
      setRowDto,
      "",
      [],
      -1,
      [],
      initHeaderList,
      null,
      temp,
      state?.year,
      setCheckedList
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  const { handleSubmit, values, setFieldValue } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: { ...initData, year: state?.year },

    onSubmit: (values, { resetForm }) => {
      resetForm(initData);
    },
  });

  return (
    <>
      {landingLoading && <Loading />}
      <form onSubmit={handleSubmit}>
        {permission?.isView ? (
          <div className="table-card">
            <>
              <div className="table-card-heading">
                <div style={{ paddingLeft: "6px" }}>
                  {checkedList.length > 0 ? (
                    <h6 className="count">
                      Total {rowDto.length}{" "}
                      {`employee${checkedList.length > 1 ? "s" : ""}`} selected
                      from {pages?.total}
                    </h6>
                  ) : (
                    <h6 className="count">
                      {" "}
                      Total {rowDto?.length > 0 ? pages.total : 0} Employees
                    </h6>
                  )}
                </div>
                <div className="table-card-head-right">
                  <ul>
                    {/* {checkedList.length > 1 && (
                      <li>
                        <ResetButton
                          title="reset"
                          icon={
                            <SettingsBackupRestoreOutlined
                              sx={{ marginRight: "10px" }}
                            />
                          }
                          onClick={() => {
                            getData(
                              { current: 1, pageSize: paginationSize },
                              setLandingLoading,
                              buId,
                              wgId,
                              wId,
                              headerList,
                              setHeaderList,
                              setFilterOrderList,
                              initialHeaderListData,
                              setInitialHeaderListData,
                              setPages,
                              setEmpIDString,
                              setRowDto,
                              "",
                              [],
                              -1,
                              filterOrderList,
                              checkedHeaderList,
                              null,
                              state?.list,
                              values?.year?.value,
                              setCheckedList
                            );

                            // setRowDto(allData);
                            setCheckedList([]);
                            setFieldValue("searchString", "");
                          }}
                        />
                      </li>
                    )} */}
                    <li>
                      {rowDto?.length > 0 && (
                        <div className="d-flex">
                          <button
                            className="btn btn-green"
                            style={{
                              marginRight: "10px",
                              height: "30px",
                              minWidth: "120px",
                              fontSize: "12px",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!permission?.isCreate)
                                return toast.warn("You don't have permission");
                              const cb = () => {
                                getData(
                                  {
                                    current: 1,
                                    pageSize: paginationSize,
                                    total: 0,
                                  },
                                  setLandingLoading,
                                  buId,
                                  wgId,
                                  wId,
                                  headerList,
                                  setHeaderList,
                                  setFilterOrderList,
                                  initialHeaderListData,
                                  setInitialHeaderListData,
                                  setPages,
                                  setEmpIDString,
                                  setRowDto,
                                  "",
                                  [],
                                  -1,
                                  [],
                                  initHeaderList,
                                  null,
                                  state?.list,
                                  state?.year,
                                  setCheckedList
                                );
                              };
                              demoPopup(
                                "assign",
                                empIDString,
                                cb,
                                setLandingLoading,
                                history
                              );
                            }}
                          >
                            Assign {pages.total}
                          </button>
                          {rowDto?.filter((item) => item?.isSelected).length >
                          0 ? (
                            <button
                              className="btn btn-green"
                              style={{
                                height: "30px",
                                minWidth: "120px",
                                fontSize: "12px",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!permission?.isCreate)
                                  return toast.warn(
                                    "You don't have permission"
                                  );
                                let payload = [];
                                rowDto?.forEach((item) => {
                                  if (item?.isSelected) {
                                    payload.push({
                                      intEmpId: item?.intEmpId,
                                      intPolicyId: item?.intPolicyId,
                                      intYear: state?.year,
                                    });
                                  }
                                });
                                const cb = () => {
                                  getData(
                                    {
                                      current: 1,
                                      pageSize: paginationSize,
                                      total: 0,
                                    },
                                    setLandingLoading,
                                    buId,
                                    wgId,
                                    wId,
                                    headerList,
                                    setHeaderList,
                                    setFilterOrderList,
                                    initialHeaderListData,
                                    setInitialHeaderListData,
                                    setPages,
                                    setEmpIDString,
                                    setRowDto,
                                    "",
                                    [],
                                    -1,
                                    [],
                                    initHeaderList,
                                    null,
                                    state?.list,
                                    state?.year,
                                    setCheckedList
                                  );
                                };
                                demoPopup(
                                  "assign",
                                  payload,
                                  cb,
                                  setLandingLoading,
                                  history
                                );
                              }}
                            >
                              Assign {checkedList.length}
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </li>
                    {/* <li className="mr-3" style={{ width: "150px" }}>
                      <FormikSelect
                        name="salaryStatus"
                        options={[
                          { value: "unassigned", label: "unassigned" },
                          { value: "assigned", label: "assigned" },
                        ]}
                        value={values?.salaryStatus}
                        onChange={(valueOption) => {
                          setFieldValue("salaryStatus", valueOption);
                          setFieldValue("searchString", "");
                          getData(
                            { current: 1, pageSize: paginationSize },
                            setLandingLoading,
                            buId,
                            wgId,
                            wId,
                            headerList,
                            setHeaderList,
                            setFilterOrderList,
                            initialHeaderListData,
                            setInitialHeaderListData,
                            setPages,
                            setEmpIDString,
                            setRowDto,
                            "",
                            checkedList,
                            -1,
                            filterOrderList,
                            checkedHeaderList,
                            valueOption?.value,
                            [],
                            values?.year?.value
                          );
                        }}
                        styles={customStyles}
                        isClearable={false}
                      />
                    </li> */}
                    <li className="mr-3 d-none" style={{ width: "150px" }}>
                      <FormikSelect
                        name="year"
                        options={yearDDLAction(5, 10)}
                        value={values?.year}
                        onChange={(valueOption) => {
                          getData(
                            { current: 1, pageSize: paginationSize },
                            setLandingLoading,
                            buId,
                            wgId,
                            wId,
                            headerList,
                            setHeaderList,
                            setFilterOrderList,
                            initialHeaderListData,
                            setInitialHeaderListData,
                            setPages,
                            setEmpIDString,
                            setRowDto,
                            "",
                            checkedList,
                            -1,
                            filterOrderList,
                            checkedHeaderList,
                            null,
                            state?.list,
                            valueOption?.value
                          );
                          setFieldValue("year", valueOption);
                        }}
                        styles={customStyles}
                        isClearable={false}
                      />
                    </li>
                    {/* <li>
                      <MasterFilter
                        isHiddenFilter
                        value={values?.searchString}
                        setValue={(value) => {
                          setFieldValue("searchString", value);
                          if (value) {
                            getData(
                              { current: 1, pageSize: paginationSize },
                              setLandingLoading,
                              buId,
                              wgId,
                              wId,
                              headerList,
                              setHeaderList,
                              setFilterOrderList,
                              initialHeaderListData,
                              setInitialHeaderListData,
                              setPages,
                              setEmpIDString,
                              setRowDto,
                              value,
                              checkedList,
                              -1,
                              filterOrderList,
                              checkedHeaderList,
                              null,
                              state?.list,
                              values?.year?.value,
                              setCheckedList
                            );
                          } else {
                            getData(
                              { current: 1, pageSize: paginationSize },
                              setLandingLoading,
                              buId,
                              wgId,
                              wId,
                              headerList,
                              setHeaderList,
                              setFilterOrderList,
                              initialHeaderListData,
                              setInitialHeaderListData,
                              setPages,
                              setEmpIDString,
                              setRowDto,
                              "",
                              [],
                              -1,
                              filterOrderList,
                              checkedHeaderList,
                              null,
                              state?.list,
                              values?.year?.value
                            );
                          }
                        }}
                        cancelHandler={() => {
                          setFieldValue("searchString", "");
                          getData(
                            { current: 1, pageSize: paginationSize },
                            setLandingLoading,
                            buId,
                            wgId,
                            wId,
                            headerList,
                            setHeaderList,
                            setFilterOrderList,
                            initialHeaderListData,
                            setInitialHeaderListData,
                            setPages,
                            setEmpIDString,
                            setRowDto,
                            "",
                            [],
                            -1,
                            filterOrderList,
                            checkedHeaderList,
                            0
                          );
                        }}
                        width="200px"
                        inputWidth="200px"
                      />
                    </li> */}
                  </ul>
                </div>
              </div>
              {rowDto?.length > 0 ? (
                <PeopleDeskTable
                  columnData={columns(
                    pages,
                    permission,
                    rowDto,
                    setRowDto,
                    checkedList,
                    setCheckedList,
                    setSingleData,
                    headerList,
                    wgName
                  )}
                  pages={pages}
                  rowDto={rowDto}
                  setRowDto={setRowDto}
                  checkedList={checkedList}
                  setCheckedList={setCheckedList}
                  checkedHeaderList={checkedHeaderList}
                  setCheckedHeaderList={setCheckedHeaderList}
                  handleChangePage={(e, newPage) =>
                    handleChangePage(
                      e,
                      newPage,
                      values?.search,
                      setLandingLoading,
                      buId,
                      wgId,
                      wId,
                      headerList,
                      setHeaderList,
                      setFilterOrderList,
                      initialHeaderListData,
                      setInitialHeaderListData,
                      setPages,
                      setEmpIDString,
                      setRowDto,
                      checkedList,
                      pages,
                      filterOrderList,
                      checkedHeaderList,
                      state?.list,
                      state?.year
                    )
                  }
                  handleChangeRowsPerPage={(e) =>
                    handleChangeRowsPerPage(
                      e,
                      values?.search,
                      setLandingLoading,
                      buId,
                      wgId,
                      wId,
                      headerList,
                      setHeaderList,
                      setFilterOrderList,
                      initialHeaderListData,
                      setInitialHeaderListData,
                      setPages,
                      setEmpIDString,
                      setRowDto,
                      checkedList,
                      pages,
                      filterOrderList,
                      checkedHeaderList,
                      state?.list,
                      state?.year
                    )
                  }
                  filterOrderList={filterOrderList}
                  setFilterOrderList={setFilterOrderList}
                  uniqueKey="intEmpId"
                  getFilteredData={(
                    currentFilterSelection,
                    updatedFilterData,
                    updatedCheckedHeaderData
                  ) => {
                    const filterNameUpdate = {
                      designationList:
                        updatedCheckedHeaderData.strEmpDesignationList?.length >
                        0
                          ? updatedCheckedHeaderData.strEmpDesignationList
                          : [],

                      departmentList:
                        updatedCheckedHeaderData.strEmpDepartmentList?.length >
                        0
                          ? updatedCheckedHeaderData.strEmpDepartmentList
                          : [],

                      genderList:
                        updatedCheckedHeaderData.strGenderNameList?.length > 0
                          ? updatedCheckedHeaderData.strGenderNameList
                          : [],

                      hrList:
                        updatedCheckedHeaderData.strHrPositionNameList?.length >
                        0
                          ? updatedCheckedHeaderData.strHrPositionNameList
                          : [],
                    };
                    getData(
                      {
                        current: 1,
                        pageSize: paginationSize,
                        total: 0,
                      },
                      setLandingLoading,
                      buId,
                      wgId,
                      wId,
                      headerList,
                      setHeaderList,
                      setFilterOrderList,
                      initialHeaderListData,
                      setInitialHeaderListData,
                      setPages,
                      setEmpIDString,
                      setRowDto,
                      "",
                      [],
                      currentFilterSelection,
                      updatedFilterData,
                      filterNameUpdate,
                      [],
                      state?.list,
                      state?.year,
                      setCheckedList
                    );
                  }}
                  isCheckBox={true}
                  isScrollAble={true}
                />
              ) : (
                !landingLoading && <NoResult title="No Result Found" para="" />
              )}
            </>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
}
export default LeavePolicyAssign;
