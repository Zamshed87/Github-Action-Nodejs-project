import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import moment from "moment";
import MasterFilter from "../../../../common/MasterFilter";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import Loading from "./../../../../common/loading/Loading";
import NoResult from "./../../../../common/NoResult";
import AddEditFormComponent from "./addEditForm";
import ResetButton from "./../../../../common/ResetButton";
import "./calendar.css";
import { columns } from "./helper";
import { Clear, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import Calender from "./component/Calender";
import { IconButton, Popover } from "@mui/material";
import { gray900 } from "../../../../utility/customColor";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import axios from "axios";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "../../../../common/peopleDeskTable/helper";

const initData = {
  searchString: "",
  allSelected: false,
  // master filter
  workplace: "",
  department: "",
  designation: "",
  supervisor: "",
  employmentType: "",
  employee: "",
  assignStatus: { value: "all", label: "All" },
};

const validationSchema = Yup.object({});

function Calendar() {
  const [loading, setLoading] = useState(false);
  // row Data
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState([]);
  // const [checked, setChecked] = useState([]);
  const [singleShiftData, setSingleShiftData] = useState([]);
  const [uniqueShift, setUniqueShift] = useState([]);
  const [uniqueShiftColor, setUniqueShiftColor] = useState({});
  const [uniqueShiftBg, setUniqueShiftBg] = useState({});
  // modal
  const [createModal, setCreateModal] = useState(false);
  const handleCreateClose = () => setCreateModal(false);

  // master filter
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { orgId, buId, wgId, wgName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const colors = [
    "#299647",
    "#B54708",
    "#B42318",
    "#6927DA",
    "#3538CD",
    "#667085",
    "#667085",
  ];
  // eslint-disable-next-line
  const [bgColors, setBgColors] = useState([
    "#E6F9E9",
    "#FEF0C7",
    "#FEE4E2",
    "#ECE9FE",
    "#E0EAFF",
    "#F2F4F7",
    "#FEF0D7",
  ]);

  const [anchorEl2, setAnchorEl2] = useState(null);
  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? "simple-popover" : undefined;
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const initHeaderList = {
    designationList: [],
    departmentList: [],
    supervisorNameList: [],
    wingNameList: [],
    soleDepoNameList: [],
    regionNameList: [],
    areaNameList: [],
    territoryNameList: [],
    employmentTypeList: [],
  };
  const [landingLoading, setLandingLoading] = useState(false);
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
        isNotAssign: null,
        workplaceId: 0,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        isPaginated: true,
        isHeaderNeed: true,
        searchTxt: searchText || "",
      };

      const res = await axios.post(`/Employee/CalendarAssignFilter`, {
        ...payload,
        ...modifiedPayload,
      });
      if (res?.data?.data) {
        setLandingLoading(true);
        setHeaderListDataDynamically({
          currentFilterSelection,
          checkedHeaderList,
          headerListKey: "calendarAssignHeader",
          headerList,
          setHeaderList,
          response: res?.data,
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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getData(pages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId]);

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
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 44) {
      permission = item;
    }
  });

  useEffect(() => {
    setUniqueShift([]);
    if (singleShiftData?.length > 0) {
      const data = [
        ...new Set(singleShiftData.map((item) => item.strCalendarName)),
      ];
      let colorData = {};
      let colorDataBg = {};
      data.forEach((status, index) => {
        colorData[status] = colors[index % colors.length];
      });
      setUniqueShiftColor(colorData);
      data.forEach((status, index) => {
        colorDataBg[status] = bgColors[index % bgColors.length];
      });
      setUniqueShiftBg(colorDataBg);
      setUniqueShift(data);
    }
    // eslint-disable-next-line
  }, [singleShiftData]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          resetForm(initData);
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            {landingLoading && <Loading />}
            <Form onSubmit={handleSubmit}>
              {permission?.isView ? (
                <div className="table-card">
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
                        {checkedList.length > 1 && (
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
                                // setRowDto(allData);
                                setCheckedList([]);
                                setFieldValue("searchString", "");
                              }}
                            />
                          </li>
                        )}
                        <li>
                          {rowDto.length > 0 ? (
                            <div className="d-flex">
                            {/*   <button
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
                                    return toast.warn(
                                      "You don't have permission"
                                    );
                                  setCreateModal(true);
                                }}
                              >
                                Assign {pages.total}
                              </button> */}
                              {rowDto?.filter((item) => item?.isSelected)
                                .length > 0 ? (
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
                                    setCreateModal(true);
                                  }}
                                >
                                  Assign {checkedList.length}
                                </button>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                        </li>
                        <li>
                          <MasterFilter
                            isHiddenFilter
                            value={values?.searchString}
                            setValue={(value) => {
                              setFieldValue("searchString", value);
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
                              setFieldValue("searchString", "");
                              getData(
                                { current: 1, pageSize: paginationSize },
                                "",
                                [],
                                -1,
                                filterOrderList,
                                checkedHeaderList
                              );
                            }}
                            handleClick={handleClick}
                            width="200px"
                            inputWidth="200px"
                          />
                        </li>
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
                        // isAlreadyPresent,
                        setSingleData,
                        setCreateModal,
                        // rowDtoHandler,
                        setSingleShiftData,
                        setLoading,
                        setAnchorEl2,
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
                    !loading && <NoResult title="No Result Found" para="" />
                  )}
                </div>
              ) : (
                <NotPermittedPage />
              )}

              {/* View Form Modal */}
              <AddEditFormComponent
                show={createModal}
                title={id ? "Edit Assign Calendar" : "Assign Calendar"}
                onHide={handleCreateClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                id={id}
                orgId={orgId}
                buId={buId}
                singleData={singleData}
                setSingleData={setSingleData}
                checked={checkedList}
                getData={() =>
                  getData(
                    { current: 1, pageSize: paginationSize },
                    "",
                    checkedList,
                    -1,
                    filterOrderList,
                    checkedHeaderList
                  )
                }
                setChecked={setCheckedList}
                setFieldValueParent={setFieldValue}
              />

              {singleShiftData.length > 0 ? (
                <Popover
                  sx={{
                    "& .MuiPaper-root": {
                      width: "675px",
                      minHeight: "200px",
                      borderRadius: "4px",
                    },
                  }}
                  id={id2}
                  open={open2}
                  anchorEl={anchorEl2}
                  onClose={() => {
                    setAnchorEl2(null);
                  }}
                  anchorOrigin={{
                    // vertical: "bottom",
                    horizontal: "middle",
                  }}
                >
                  <div
                    className="master-filter-modal-container employeeProfile-src-filter-main"
                    style={{ height: "auto" }}
                  >
                    <div className="master-filter-header employeeProfile-src-filter-header">
                      <div></div>
                      <IconButton
                        onClick={() => {
                          setAnchorEl2(null);
                          // setRowDto(allData);
                          setSingleShiftData([]);
                        }}
                      >
                        <Clear sx={{ fontSize: "18px", color: gray900 }} />
                      </IconButton>
                    </div>
                    <hr />

                    {singleShiftData?.length > 0 ? (
                      <>
                        <h6 className="ml-3 fs-1 text-center">
                          {" "}
                          {moment().format("MMMM")}-{moment().format("YYYY")}
                        </h6>

                        <div
                          className="body-employeeProfile-master-filter d-flex"
                          style={{ height: "380px" }}
                        >
                          <div className="row ml-3  my-2">
                            <Calender
                              monthYear={moment().format("YYYY-MM")}
                              singleShiftData={singleShiftData}
                              uniqueShiftColor={uniqueShiftColor}
                              uniqueShiftBg={uniqueShiftBg}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <NoResult title="No Result Found" para="" />
                    )}

                    <div className=" mt-2 mb-3 d-flex justify-content-around">
                      {uniqueShift.length > 0 &&
                        uniqueShift.map((item, index) => (
                          <div key={index} className="text-center">
                            {/* <p style={getChipStyleShift(item)}>{`${item} Shift `}</p> */}
                            <p
                              style={{
                                borderRadius: "99px",
                                fontSize: "14px",
                                padding: "2px 5px",
                                fontWeight: 500,
                                color: `${uniqueShiftColor[item]}`,
                                backgroundColor: `${uniqueShiftBg[item]}`,
                              }}
                            >{`${item} Shift `}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </Popover>
              ) : (
                ""
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
export default Calendar;
