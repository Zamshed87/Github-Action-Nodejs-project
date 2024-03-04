import { Form, Formik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import MasterFilter from "../../../../common/MasterFilter";
import ViewModal from "../../../../common/ViewModal";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import NoResult from "./../../../../common/NoResult";
import Loading from "./../../../../common/loading/Loading";

import { Clear, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Avatar, IconButton, Popover } from "@mui/material";
import axios from "axios";
import CommonEmpInfo from "../../../../common/CommonEmpInfo";
import FormikSelect from "../../../../common/FormikSelect";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "../../../../common/peopleDeskTable/helper";
import { gray900 } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";
import ResetButton from "./../../../../common/ResetButton";
import "./calendar.css";
import Calender from "./component/Calender";
import { columns } from "./helper";
import SingleShiftAssign from "./singleShiftAssign";

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
  salaryStatus: "",
};

const statusDDL = [
  { value: 0, label: "All" },
  { value: 1, label: "Assigned" },
  { value: 2, label: "Not Assigned" },
];

const validationSchema = Yup.object({});

function ShiftManagement() {
  // row Data
  const [rowDto, setRowDto] = useState([]);
  // const [checked, setChecked] = useState([]);
  const [singleShiftData, setSingleShiftData] = useState([]);
  const [uniqueShift, setUniqueShift] = useState([]);
  const [uniqueShiftColor, setUniqueShiftColor] = useState({});
  const [uniqueShiftBg, setUniqueShiftBg] = useState({});
  // modal
  const [createModal, setCreateModal] = useState(false);
  const [calendarData, setCalendarData] = useState([]);
  const [ismulti, setIsmulti] = useState(false);

  const { orgId, buId, wgId, wId } = useSelector(
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
    sectionList: [],
    hrPositionList: [],
  };
  const [landingLoading, setLandingLoading] = useState(false);
  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});
  const [headerList, setHeaderList] = useState({});
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });
  const [checkedList, setCheckedList] = useState([]);
  const [empIDString, setEmpIDString] = useState("");
  const [isAssignAll, setIsAssignAll] = useState(false);

  // landing api call
  const getDataApiCall = async (
    modifiedPayload,
    pagination,
    searchText,
    checkedList,
    currentFilterSelection,
    checkedHeaderList,
    isAssigned = null
  ) => {
    setLandingLoading(true);
    try {
      const payload = {
        businessUnitId: buId,
        workplaceGroupId: wgId, // null
        isNotAssign: isAssigned === 1 ? false : isAssigned === 2 ? true : null,
        workplaceId: wId || 0,
        accountId: orgId,
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

        setEmpIDString(res?.data?.employeeIdList);
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
      } else {
        setRowDto([]);
      }
      setLandingLoading(false);
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
    checkedHeaderList = { ...initHeaderList },
    isAssigned
  ) => {
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
      checkedHeaderList,
      isAssigned
    );
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Shift Management";
  }, []);

  useEffect(() => {
    getData(pages);
    setCalendarData([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

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
    setPages(() => {
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
    if (item?.menuReferenceId === 30369) {
      permission = item;
    }
  });

  useEffect(() => {
    setUniqueShift([]);
    if (singleShiftData?.length > 0) {
      const data = [
        ...new Set(singleShiftData.map((item) => item.strCalendarName)),
      ];
      const colorData = {};
      const colorDataBg = {};
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
  const numberString = empIDString
    .replace("{empIDString: '", "")
    .replace("'}", "");

  // Split the string into an array of strings using comma as a delimiter
  const numberArray = numberString.split(",");

  // Convert each element of the array to a number using parseInt
  // const numbers = numberArray.map((numString) => parseInt(numString, 10));
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          resetForm(initData);
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            {landingLoading && <Loading />}
            <Form onSubmit={handleSubmit}>
              {permission?.isView ? (
                <div className="table-card">
                  <>
                    <div className="table-card-heading">
                      <div style={{ paddingLeft: "6px" }}>
                        {rowDto.filter((item) => item?.isSelected).length >
                        0 ? (
                          <h6 className="count">
                            Total {checkedList.length}{" "}
                            {`employee${checkedList.length > 1 ? "s" : ""}`}{" "}
                            selected from {pages?.total}
                          </h6>
                        ) : (
                          <h6 className="count">
                            {" "}
                            Total {rowDto?.length > 0 ? pages.total : 0}{" "}
                            Employees
                          </h6>
                        )}
                      </div>
                      <div className="table-card-head-right">
                        <ul>
                          {rowDto.filter((item) => item?.isSelected).length >
                            0 && (
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
                                      return toast.warn(
                                        "You don't have permission"
                                      );
                                    setIsAssignAll(true);
                                    setIsmulti(false);
                                    setCalendarData([]);
                                    setCreateModal(true);
                                  }}
                                >
                                  Assign {pages.total}
                                </button>
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
                                      setIsAssignAll(false);
                                      setIsmulti(true);
                                      setCreateModal(true);
                                      setCalendarData([]);
                                    }}
                                  >
                                    Assign{" "}
                                    {
                                      rowDto?.filter((item) => item?.isSelected)
                                        .length
                                    }
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}
                          </li>
                          <li className="mr-3" style={{ width: "150px" }}>
                            <FormikSelect
                              name="salaryStatus"
                              options={statusDDL}
                              value={values?.salaryStatus}
                              onChange={(valueOption) => {
                                setFieldValue("salaryStatus", valueOption);
                                setFieldValue("searchString", "");
                                getData(
                                  { current: 1, pageSize: paginationSize },
                                  "",
                                  checkedList,
                                  -1,
                                  filterOrderList,
                                  checkedHeaderList,
                                  valueOption?.value
                                );
                              }}
                              styles={customStyles}
                              isClearable={false}
                            />
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
                                    checkedHeaderList,
                                    values?.salaryStatus?.value
                                  );
                                } else {
                                  getData(
                                    { current: 1, pageSize: paginationSize },
                                    "",
                                    [],
                                    -1,
                                    filterOrderList,
                                    checkedHeaderList,
                                    values?.salaryStatus?.value
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
                                  checkedHeaderList,
                                  0
                                );
                              }}
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
                          setCreateModal,
                          setSingleShiftData,
                          setAnchorEl2,
                          headerList
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
                      !landingLoading && (
                        <NoResult title="No Result Found" para="" />
                      )
                    )}
                  </>
                </div>
              ) : (
                <NotPermittedPage />
              )}

              {isAssignAll || ismulti ? (
                <ViewModal
                  show={createModal}
                  title={`Assign Shift`}
                  onHide={() => {
                    setCreateModal(false);
                    // setSingleAssign(false);
                    setCalendarData([]);
                    setIsAssignAll(false);
                    setIsmulti(false);
                  }}
                  size="lg"
                  backdrop="static"
                  classes="default-modal creat-job-modal"
                >
                  <div className="row">
                    <div
                      className={ismulti ? "col-4 px-2" : "col-2"}
                      style={
                        ismulti ? { height: "550px", overflow: "scroll" } : {}
                      }
                    >
                      {/* <div
                      style={{ height: "550px", overflow: "scroll" }}
                      className="col-4  px-2"
                    > */}
                      {/* {!singleAssign && (
                        <p className=" ml-4 ">
                          Total Selected{" "}
                          {
                            checked?.filter((item) => item?.selectCheckbox)
                              .length
                          }
                        </p>
                      )} */}

                      {ismulti ? (
                        <div className="">
                          {rowDto?.map(
                            (data, index) =>
                              data?.isSelected && (
                                <ol key={index} className="mb-2">
                                  <li
                                    style={{ display: "list-item !important" }}
                                  >
                                    <div className="">
                                      <div>
                                        <Avatar
                                          className="ml-4 mb-1"
                                          sx={{
                                            mt: 0.2,
                                            "&.MuiAvatar-root": {
                                              width: "22px!important",
                                              height: "22px!important",
                                            },
                                          }}
                                        />
                                      </div>
                                      <CommonEmpInfo
                                        classes={"ml-4"}
                                        employeeName={data?.employeeName}
                                        designationName={data?.designation}
                                        departmentName={data?.department}
                                      />
                                    </div>
                                  </li>
                                </ol>
                              )
                          )}
                        </div>
                      ) : null}
                    </div>

                    <div className="col-8">
                      <div className="mr-2">
                        {isAssignAll ? (
                          <>
                            {/* <SingleShiftAssign
                              listId={[selectedSingleEmployee[0]?.EmployeeId]}
                              setCreateModal={setCreateModal}
                              setSingleAssign={setSingleAssign}
                              getData={getData}
                              pages={pages}
                              calendarData={calendarData}
                              setCalendarData={setCalendarData}
                              singleShiftData={singleShiftData}
                              uniqueShiftColor={uniqueShiftColor}
                              uniqueShiftBg={uniqueShiftBg}
                              uniqueShift={uniqueShift}
                            /> */}
                            <SingleShiftAssign
                              listId={numberArray?.map((item) => item)}
                              setCreateModal={setCreateModal}
                              setSingleAssign={setIsAssignAll}
                              getData={getData}
                              pages={pages}
                              calendarData={calendarData}
                              setCalendarData={setCalendarData}
                              isMargin={true}
                            />
                          </>
                        ) : (
                          <>
                            {
                              <SingleShiftAssign
                                listId={rowDto
                                  ?.filter((item) => item?.isSelected)
                                  .map((item) => item?.employeeId.toString())}
                                setCreateModal={setCreateModal}
                                setSingleAssign={setIsmulti}
                                getData={getData}
                                pages={pages}
                                calendarData={calendarData}
                                setCalendarData={setCalendarData}
                              />
                            }
                            {null}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </ViewModal>
              ) : (
                ""
              )}
              {/* calendar pop up  */}
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
                            >{`${item}`}</p>
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
export default ShiftManagement;
