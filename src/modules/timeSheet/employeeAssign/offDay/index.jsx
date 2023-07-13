/* eslint-disable react-hooks/exhaustive-deps */
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../../common/loading/Loading";
// import AntTable, { paginationSize } from "../../../../common/AntTable";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import AddEditFormComponent from "./addEditForm";
import { offDayAssignDtoCol, printDays } from "./helper";
import "./offday.css";
import MasterFilter from "../../../../common/MasterFilter";
import { Popover } from "@mui/material";
import profileImg from "../../../../assets/images/profile.jpg";
import PopoverCalender from "../monthlyOffdayAssign/components/PopoverCalender";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "../../../../common/peopleDeskTable/helper";
import axios from "axios";

const initData = {
  search: "",
};

function OffDay() {
  const { orgId, buId, wgId, wgName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [calendarData, setCalendarData] = useState([]);
  const [selectedSingleEmployee, setSelectedSingleEmployee] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [singleData, setSingleData] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [isMulti, setIsMulti] = useState(false);
  const [empId, setEmpId] = useState("");
  const handleCreateClose = () => setCreateModal(false);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const [empIDString, setEmpIDString] = useState("");
  const [isAssignAll, setIsAssignAll] = useState(false);

  const open = !loading && Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
  }, []);
  // const [resLanding, getLanding, loadingLanding, setLanding] = useAxiosPost();
  // const [checked, setChecked] = useState([]);

  // const isAlreadyPresent = (obj) => {
  //   for (let i = 0; i < checked.length; i++) {
  //     if (checked[i].EmployeeCode === obj.EmployeeCode) {
  //       return i;
  //     }
  //   }
  //   return -1;
  // };

  // const getData = (pagination, srcText, status = "") => {
  //   getOffDayLandingHandler(
  //     buId,
  //     orgId,
  //     wgId,
  //     getLanding,
  //     setLanding,
  //     pagination,
  //     setPages,
  //     srcText,
  //     status,
  //     isAlreadyPresent,
  //     checked
  //   );
  // };

  const initHeaderList = {
    designationList: [],
    departmentList: [],
    supervisorNameList: [],
    employmentTypeList: [],
    wingNameList: [],
    soleDepoNameList: [],
    regionNameList: [],
    areaNameList: [],
    territoryNameList: [],
  };
  const [landingLoading, setLandingLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});
  const [headerList, setHeaderList] = useState({});
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });
  const [checkedList, setCheckedList] = useState([]);

  // landing api call
  const getDataApiCall = async (
    modifiedPayload,
    pagination,
    searchText,
    checkedList,
    currentFilterSelection,
    checkedHeaderList
  ) => {
    try {
      const payload = {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        isAssign: false,
        workplaceId: 0,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        isPaginated: true,
        isHeaderNeed: true,
        searchTxt: searchText || "",
      };

      const res = await axios.post(`/Employee/OffdayLandingFilter`, {
        ...payload,
        ...modifiedPayload,
      });
      if (res?.data?.data) {
        setEmpIDString(res?.data?.employeeList);
        setLandingLoading(true);
        let newData =
          res?.data?.data?.length > 0
            ? res?.data?.data?.map((item) => {
                return {
                  ...item,
                  offDayList:
                    !item?.isFriday &&
                    !item?.isSaturday &&
                    !item?.isSunday &&
                    !item?.isMonday &&
                    !item?.isThursday &&
                    !item?.isTuesday &&
                    !item?.isWednesday
                      ? "N/A"
                      : printDays(item),
                  offDay:
                    item?.isFriday ||
                    item?.isSaturday ||
                    item?.isSunday ||
                    item?.isMonday ||
                    item?.isThursday ||
                    item?.isTuesday ||
                    item?.isWednesday,
                };
              })
            : [];
        // setLanding(newData);
        setHeaderListDataDynamically({
          currentFilterSelection,
          checkedHeaderList,
          headerListKey: "offdayAssignHeader",
          headerList,
          setHeaderList,
          response: { ...res?.data, data: newData },
          filterOrderList,
          setFilterOrderList,
          initialHeaderListData,
          setInitialHeaderListData,
          // setEmpLanding,
          setPages,
        });

        const modifiedData = res?.data?.data?.map((item, index) => ({
          ...item,
          initialSerialNumber: index + 1,
          isSelected: checkedList?.find(
            ({ employeeCode }) => item?.employeeCode === employeeCode
          )
            ? true
            : false,
          offDayList:
            !item?.isFriday &&
            !item?.isSaturday &&
            !item?.isSunday &&
            !item?.isMonday &&
            !item?.isThursday &&
            !item?.isTuesday &&
            !item?.isWednesday
              ? "N/A"
              : printDays(item),
          offDay:
            item?.isFriday ||
            item?.isSaturday ||
            item?.isSunday ||
            item?.isMonday ||
            item?.isThursday ||
            item?.isTuesday ||
            item?.isWednesday,
        }));

        setRowDto(modifiedData);

        setLandingLoading(false);
      }
    } catch (error) {
      setLandingLoading(false);
    }
  };

  const getData = async (
    pagination,
    searchText = "",
    checkedList = [],
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
      checkedList,
      currentFilterSelection,
      checkedHeaderList
    );
  };

  useEffect(() => {
    getData(pages);
    // setChecked([]);
  }, [buId, orgId, wgId]);

  const updateSingleData = (item) => {
    const newRowData = {
      ...item,
      effectiveDate: item?.effectiveDate,
      isSaturday: item?.isSaturday,
      isSunday: item?.isSunday,
      isMonday: item?.isMonday,
      isTuesday: item?.isTuesday,
      isWednesday: item?.isWednesday,
      isThursday: item?.isThursday,
      isFriday: item?.isFriday,
      isEdit: true,
    };
    setSingleData(newRowData);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 45) {
      permission = item;
    }
  });
  // const handleTableChange = (pagination, newRowDto, srcText) => {
  //   if (newRowDto?.action === "filter") {
  //     return;
  //   }
  //   if (
  //     pages?.current === pagination?.current &&
  //     pages?.pageSize !== pagination?.pageSize
  //   ) {
  //     return getData(pagination, srcText);
  //   }
  //   if (pages?.current !== pagination?.current) {
  //     return getData(pagination, srcText);
  //   }
  // };
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
      searchText,
      checkedList,
      -1,
      filterOrderList,
      checkedHeaderList
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
      searchText,
      checkedList,
      -1,
      filterOrderList,
      checkedHeaderList
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          resetForm(initData);
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            {(landingLoading || loading) && <Loading />}
            <Form onSubmit={handleSubmit}>
              {permission?.isView ? (
                <div className="table-card">
                  {rowDto.length > 0 && (
                    <div className="table-card-heading">
                      <div style={{ paddingLeft: "6px" }}>
                        {checkedList.length > 0 ? (
                          <h6 className="count">
                            Total {checkedList.length}{" "}
                            {`employee${checkedList.length > 1 ? "s" : ""}`}{" "}
                            selected from {pages?.total}
                          </h6>
                        ) : (
                          <h6 className="count">
                            {" "}
                            Total {pages.total} Employees
                          </h6>
                        )}
                      </div>
                      <div className="table-card-head-right">
                        <ul>
                          {checkedList.length > 0 && (
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
                                    "",
                                    [],
                                    -1,
                                    filterOrderList,
                                    checkedHeaderList
                                  );
                                  setCheckedList([]);
                                  setFieldValue("search", "");
                                }}
                              />
                            </li>
                          )}
                          <li>
                            {checkedList?.length > 0 && (
                              <button
                                className="btn btn-green"
                                style={{
                                  marginRight: "10px",
                                  height: "30px",
                                  minWidth: "120px",
                                }}
                                onClick={(e) => {
                                  if (!permission?.isCreate)
                                    return toast.warn(
                                      "You don't have permission"
                                    );
                                  setIsMulti(true);
                                  setSingleData(null);
                                  setCreateModal(true);
                                  setIsAssignAll(false);
                                }}
                              >
                                Assign {checkedList.length}
                              </button>
                            )}
                          </li>
                          <li>
                            <button
                              className="btn btn-green"
                              style={{
                                marginRight: "10px",
                                height: "30px",
                                minWidth: "120px",
                                fontSize: "12px",
                              }}
                              onClick={(e) => {
                                if (!permission?.isCreate)
                                  return toast.warn(
                                    "You don't have permission"
                                  );
                                setIsAssignAll(true);
                                setCreateModal(true);
                              }}
                            >
                              Assign {pages.total}
                            </button>
                          </li>
                          <li>
                            <MasterFilter
                              isHiddenFilter
                              value={values?.search}
                              setValue={(value) => {
                                setFieldValue("search", value);
                                if (value) {
                                  getData(
                                    { current: 1, pageSize: paginationSize },
                                    value,
                                    checkedList,
                                    -1,
                                    filterOrderList,
                                    checkedHeaderList
                                  );
                                } else {
                                  getData(
                                    { current: 1, pageSize: paginationSize },
                                    "",
                                    [],
                                    -1,
                                    filterOrderList,
                                    checkedHeaderList
                                  );
                                }
                              }}
                              cancelHandler={() => {
                                getData(
                                  { current: 1, pageSize: paginationSize },
                                  "",
                                  [],
                                  -1,
                                  filterOrderList,
                                  checkedHeaderList
                                );
                                setFieldValue("search", "");
                              }}
                              width="200px"
                              inputWidth="200px"
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  <div className="table-card-body">
                    <div>
                      {rowDto.length > 0 ? (
                        <PeopleDeskTable
                          columnData={offDayAssignDtoCol(
                            pages,
                            paginationSize,
                            permission,
                            updateSingleData,
                            setCreateModal,
                            setEmpId,
                            setSingleData,
                            setIsMulti,
                            checkedList,
                            setCheckedList,
                            // isAlreadyPresent,
                            // filterLanding,
                            // setFilterLanding,
                            setRowDto,
                            rowDto,
                            setSelectedSingleEmployee,
                            setAnchorEl,
                            setCalendarData,
                            setLoading,
                            loading,
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
                            handleChangePage(e, newPage, values?.search)
                          }
                          handleChangeRowsPerPage={(e) =>
                            handleChangeRowsPerPage(e, values?.search)
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
                              "",
                              [],
                              currentFilterSelection,
                              updatedFilterData,
                              updatedCheckedHeaderData
                            );
                          }}
                          isCheckBox={true}
                          isScrollAble={true}
                        />
                      ) : (
                        // <AntTable
                        //   data={resLanding}
                        //   columnsData={offDayAssignDtoCol(
                        //     pages,
                        //     paginationSize,
                        //     permission,
                        //     updateSingleData,
                        //     setCreateModal,
                        //     setEmpId,
                        //     setSingleData,
                        //     setIsMulti,
                        //     checked,
                        //     setChecked,
                        //     isAlreadyPresent,
                        //     // filterLanding,
                        //     // setFilterLanding,
                        //     setLanding,
                        //     resLanding,
                        //     setSelectedSingleEmployee,
                        //     setAnchorEl,
                        //     setCalendarData,
                        //     setLoading,
                        //     loading
                        //   )}
                        //   setColumnsData={(dataRow) => {}}
                        //   pages={pages?.pageSize}
                        //   pagination={pages}
                        //   handleTableChange={({ pagination, newRowDto }) =>
                        //     handleTableChange(
                        //       pagination,
                        //       newRowDto,
                        //       values?.search || ""
                        //     )
                        //   }
                        //   rowKey={(record) => record?.EmployeeCode}
                        // />
                        <>
                          {!landingLoading && (
                            <NoResult title="No Result Found" para="" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
              {/* View Form Modal */}
              <AddEditFormComponent
                show={createModal}
                title={id ? "Edit Assign Day" : "Assign Day"}
                onHide={handleCreateClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                empId={empId}
                orgId={orgId}
                isMulti={isMulti}
                setIsMulti={setIsMulti}
                buId={buId}
                offDayLanding={rowDto}
                singleData={singleData}
                checked={checkedList}
                setChecked={setCheckedList}
                isAssignAll={isAssignAll}
                setIsAssignAll={setIsAssignAll}
                empIDString={empIDString}
                getData={(status) =>
                  getData(
                    { current: 1, pageSize: paginationSize },
                    "",
                    [],
                    -1,
                    filterOrderList,
                    checkedHeaderList
                  )
                }
                setFieldValueParent={setFieldValue}
              />
            </Form>
          </>
        )}
      </Formik>
      <Popover
        sx={{
          "& .MuiPaper-root": {
            width: "600px",
            minHeight: "200px",
            borderRadius: "4px",
          },
        }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          // vertical: "bottom",
          horizontal: "middle",
        }}
      >
        <PopoverCalender
          propsObj={{
            selectedSingleEmployee,
            profileImg,
            calendarData,
            setCalendarData,
          }}
        />
      </Popover>
    </>
  );
}
export default OffDay;
