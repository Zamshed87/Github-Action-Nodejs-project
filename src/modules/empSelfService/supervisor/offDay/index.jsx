/* eslint-disable react-hooks/exhaustive-deps */
import { SettingsBackupRestoreOutlined, SaveAlt } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { Tooltip } from "@mui/material";

import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddEditFormComponent from "./addEditForm";
import { offDayAssignDtoCol, printDays } from "./helper";
import "./offday.css";
import { Popover } from "@mui/material";
import axios from "axios";
import { downloadEmployeeCardFile } from "modules/timeSheet/reports/employeeIDCard/helper";
import { gray900 } from "utility/customColor";
import { paginationSize } from "common/AntTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import Loading from "common/loading/Loading";
import ResetButton from "common/ResetButton";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import MasterFilter from "common/MasterFilter";
import PeopleDeskTable from "common/peopleDeskTable";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import OffDayErrorModal from "./OffDayErrorModal";
import PopoverCalender from "modules/timeSheet/employeeAssign/monthlyOffdayAssign/components/PopoverCalender";
import PopoverHistory from "modules/CompensationBenefits/incrementProposal/ApprovalLogInfo";
import { createPayloadStructure, setHeaderListDataDynamically } from "common/peopleDeskTable/helper";
import profileImg from "../../../../assets/images/profile.jpg"

const initData = {
  search: "",
  salaryStatus: "",
};

const statusDDL = [
  { value: 0, label: "All" },
  { value: 1, label: "Assigned" },
  { value: 2, label: "Not Assigned" },
];

function OffDaySelfService() {
  const { orgId, buId, wgId, wgName, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [calendarData, setCalendarData] = useState([]);
  const [selectedSingleEmployee, setSelectedSingleEmployee] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElHistory, setAnchorElHistory] = useState(null);
  const [singleData, setSingleData] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [isMulti, setIsMulti] = useState(false);
  const [erroModalOpen, setErroModalOpen] = useState(false);
  const [errorData, setErrorData] = useState(false);
  const [errorPayload, setErrorPayload] = useState({});
  const [offDayHistory, setOffDayHistory] = useState({});

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
  const openHistory = !loading && Boolean(anchorElHistory);
  const id = open ? "simple-popover" : undefined;
  const idHistory = openHistory ? "simple-popover" : undefined;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    document.title = "OffDay Assign";
  }, []);
 
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
    sectionList: [],
    dottedSupervisorNameList: [],
    lineManagerNameList: [],
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
    checkedHeaderList,
    isAssigned
  ) => {
    setLandingLoading(true);
    try {
      const payload = {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        isAssign: isAssigned === 1 ? true : isAssigned === 2 ? false : null,
        workplaceId: wId || 0,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        isPaginated: true,
        isHeaderNeed: true,
        searchTxt: searchText || "",
      };

      const res = await axios.post(`/Employee/OffdayLandingFilterBySupervisor`, {
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
    setErrorData([]);
    setCheckedList([]);
    // setChecked([]);
  }, [buId, orgId, wgId, wId]);

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
    if (item?.menuReferenceId === 30560) {
      permission = item;
    }
  });

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
                  <div className="table-card-heading">
                    <div style={{ display: "flex", paddingLeft: "6px" }}>
                      <Tooltip title="Export CSV" arrow>
                        <button
                          type="button"
                          className="btn-save mr-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLoading(true);

                            const paylaod = {
                              businessUnitId: buId,
                              workplaceGroupId: wgId,
                              isAssign: null,
                              workplaceId: wId,
                              pageNo: 1,
                              pageSize: 10000000,
                              isPaginated: false,
                              isHeaderNeed: false,
                              searchTxt: "",
                              ...checkedHeaderList,
                            };
                            const url =
                              "/PdfAndExcelReport/OffdayLandingFilter_RDLC";
                            downloadEmployeeCardFile(
                              url,
                              paylaod,
                              "Off Day List",
                              "xlsx",
                              setLoading
                            );
                          }}
                          disabled={rowDto?.length <= 0}
                        >
                          <SaveAlt
                            sx={{
                              color: gray900,
                              fontSize: "14px",
                            }}
                          />
                        </button>
                      </Tooltip>
                      {checkedList.length > 0 ? (
                        <h6 className="count">
                          Total {checkedList.length}{" "}
                          {`employee${checkedList.length > 1 ? "s" : ""}`}{" "}
                          selected from {pages?.total}
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
                                  return toast.warn(
                                    "You don't have permission"
                                  );
                                setIsAssignAll(true);
                                setCreateModal(true);
                              }}
                            >
                              Assign {pages.total}
                            </button>
                          )}
                        </li>
                        <li className="mr-3" style={{ width: "150px" }}>
                          <FormikSelect
                            name="salaryStatus"
                            options={statusDDL}
                            value={values?.salaryStatus}
                            onChange={(valueOption) => {
                              setFieldValue("salaryStatus", valueOption);
                              setFieldValue("search", "");
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
                            wgName,
                            setOffDayHistory,
                            setAnchorElHistory
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
                setErrorData={setErrorData}
                setErroModalOpen={setErroModalOpen}
                setErrorPayload={setErrorPayload}
                setFieldValueParent={setFieldValue}
              />

              <OffDayErrorModal
                show={erroModalOpen}
                title={"⚠️Warning"}
                onHide={() => {
                  setErroModalOpen(false);
                }}
                size="lg"
                backdrop="static"
                classes="default-modal"
                values={values}
                errorData={errorData}
                errorPayload={errorPayload}
                setErrorData={setErrorData}
                setErroModalOpen={setErroModalOpen}
                setErrorPayload={setErrorPayload}
                setLoading={setLoading}
                cb={() => {
                  getData(
                    { current: 1, pageSize: paginationSize },
                    "",
                    [],
                    -1,
                    filterOrderList,
                    checkedHeaderList
                  );
                  setCheckedList([]);
                }}
                // resetForm={resetForm}
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
      <Popover
        sx={{
          "& .MuiPaper-root": {
            width: "600px",
            minHeight: "200px",
            borderRadius: "4px",
          },
        }}
        id={idHistory}
        open={openHistory}
        anchorEl={anchorElHistory}
        onClose={() => {
          setAnchorElHistory(null);
        }}
        anchorOrigin={{
          // vertical: "bottom",
          horizontal: "middle",
        }}
      >
        <PopoverHistory
          propsObj={{
            selectedSingleEmployee,
            profileImg,
            offDayHistory,
            setOffDayHistory,
          }}
        />
      </Popover>
    </>
  );
}
export default OffDaySelfService;
