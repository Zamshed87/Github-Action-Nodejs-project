/* eslint-disable react-hooks/exhaustive-deps */
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../../common/loading/Loading";
// import MasterFilter from "../../../../common/MasterFilter";
import { Popover } from "@mui/material";
import axios from "axios";
import moment from "moment";
import profileImg from "../../../../assets/images/profile.jpg";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import ViewModal from "../../../../common/ViewModal";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "../../../../common/peopleDeskTable/helper";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { printDays } from "../offDay/helper";
import PopoverCalender from "./components/PopoverCalender";
import ViewModalCalender from "./components/ViewModalCalender";
import { createMonthlyOffdayAssign, offDayAssignDtoCol } from "./helper";
import "./monthlyOffday.css";

const initData = {
  search: "",
  isAssigned: false,
};

function MonthlyOffdayAssignLanding() {
  const { orgId, buId, employeeId, wId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // const [anchorEl, setAnchorEl] = useState(null);
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
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Monthly Offday Assign";
  }, []);
  // const [resLanding, getLanding, loadingLanding, setLanding] = useAxiosPost();
  const [showModal, setShowModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [calendarData, setCalendarData] = useState([]);
  const [selectedSingleEmployee, setSelectedSingleEmployee] = useState([]);
  const [singleAssign, setSingleAssign] = useState(false);
  const [loading, setLoading] = useState(false);
  const [landingLoading, setLandingLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});
  const [headerList, setHeaderList] = useState({});
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });
  const [checkedList, setCheckedList] = useState([]);
  const [empIDString, setEmpIDString] = useState("");
  const [isAssignAll, setIsAssignAll] = useState(false);

  const open = !loading && Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // landing api call
  const getDataApiCall = async (
    modifiedPayload,
    pagination,
    searchText,
    checkedList,
    currentFilterSelection,
    checkedHeaderList,
    isAssigned
  ) => {
    setLandingLoading(true);
    try {
      const payload = {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        accountId: orgId,
        isAssign: isAssigned === 1 ? true : isAssigned === 2 ? false : null,
        workplaceId: wId,
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
    isAssigned = null
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

  useEffect(() => {
    getData(pages);
    // setChecked([]);
  }, [buId, orgId, wId, wgId]);

  const saveHandler = (values) => {};

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30370) {
      permission = item;
    }
  });

  const { handleSubmit, values, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      saveHandler(values, () => {
        resetForm(initData);
      });
    },
  });

  const handleSave = () => {
    const offdays = calendarData?.map((data) => {
      return {
        date: moment().format(
          `YYYY-MM-${data?.dayId < 10 ? "0" : ""}${data?.dayId}`
        ),
        isOffDay: data?.isOffday,
        isActive: true,
      };
    });
    let empArr = [];
    const intEmployeeId = singleAssign
      ? [selectedSingleEmployee[0]?.employeeId]
      : checkedList?.map((data) => empArr.push(data?.employeeId));
    const payload = {
      intEmployeeId: singleAssign
        ? intEmployeeId
        : isAssignAll
        ? empIDString.split(",")
        : empArr,
      offdays: singleAssign
        ? offdays
        : offdays?.filter((data) => data?.isOffDay === true),
      intActionBy: employeeId,
    };
    const callback = () => {
      setCalendarData([]);
      setCheckedList([]);
      setSingleAssign(false);
      setShowModal(false);
      getData(
        { current: 1, pageSize: paginationSize },
        "",
        [],
        -1,
        filterOrderList,
        checkedHeaderList,
        0
      );
      setCheckedList([]);
      setFieldValue("search", "");
    };
    payload?.offdays?.length > 0
      ? createMonthlyOffdayAssign(payload, setLoading, callback)
      : toast.error("Please select at least one day");
  };

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
      <form onSubmit={handleSubmit}>
        <>
          {(landingLoading || loading) && <Loading />}
          {permission?.isView ? (
            <div className="table-card">
              <div className="table-card-heading">
                <div style={{ paddingLeft: "6px" }}>
                  {checkedList.length > 0 ? (
                    <h6 className="count">
                      Total {checkedList.length}{" "}
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
                              checkedHeaderList,
                              0
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
                              return toast.warn("You don't have permission");
                            setShowModal(true);
                            setIsAssignAll(false);
                          }}
                        >
                          Assign {checkedList.length}
                        </button>
                      )}
                    </li>
                    <li>
                      {rowDto?.length > 0 && (
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
                              return toast.warn("You don't have permission");
                            setIsAssignAll(true);
                            setShowModal(true);
                            setSingleAssign(false);
                          }}
                        >
                          Assign {pages.total}
                        </button>
                      )}
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
                          getData(
                            { current: 1, pageSize: paginationSize },
                            "",
                            [],
                            -1,
                            filterOrderList,
                            checkedHeaderList,
                            0
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
              <div className="table-card-body">
                <div>
                  {rowDto.length > 0 ? (
                    <PeopleDeskTable
                      columnData={offDayAssignDtoCol(
                        pages,
                        permission,
                        setShowModal,
                        setIsAssignAll,
                        checkedList,
                        setCheckedList,
                        setSelectedSingleEmployee,
                        setAnchorEl,
                        setCalendarData,
                        setLoading,
                        loading,
                        headerList,
                        setSingleAssign
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
        </>
        {/* View Form Modal */}
        <ViewModal
          show={!loading && showModal}
          title={`Assign Monthly Calendar (${moment().format("MMM, YYYY")})`}
          onHide={() => {
            setShowModal(false);
            setSingleAssign(false);
            setCalendarData([]);
          }}
          size="lg"
          backdrop="static"
          classes="default-modal creat-job-modal"
        >
          <ViewModalCalender
            propsObj={{
              singleAssign,
              checkedList,
              selectedSingleEmployee,
              profileImg,
              setShowModal,
              calendarData,
              setCalendarData,
              setSingleAssign,
              handleSave,
              isAssignAll,
            }}
          />
        </ViewModal>
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
            setCalendarData([]);
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
      </form>
    </>
  );
}

export default MonthlyOffdayAssignLanding;
