import { Clear } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton, Popover } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import axios from "axios";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "../../common/peopleDeskTable/helper";
import { paginationSize } from "../../common/AntTable";
import PeopleDeskTable from "../../common/peopleDeskTable";
import { onBoardColumns } from "./helper";
import { monthFirstDate } from "../../utility/dateFormatter";
import { todayDate } from "../../utility/todayDate";
import { getTodayDateAndTime } from "../../utility/todayDateTime";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import Loading from "../../common/loading/Loading";
import ResetButton from "../../common/ResetButton";
import MasterFilter from "../../common/MasterFilter";
import FormikInput from "../../common/FormikInput";
import NoResult from "../../common/NoResult";
import NotPermittedPage from "../../common/notPermitted/NotPermittedPage";
import ViewModal from "../../common/ViewModal";
import useAxiosGet from "../../utility/customHooks/useAxiosGet";

const initData = {
  search: "",
  designation: "",
  filterFromDate: monthFirstDate(),
  filterToDate: todayDate(),
  confirmDate: getTodayDateAndTime(),
  pinNo: "",
};

const initHeaderList = {
  designationNameList: [],
  designationCodeList: [],
  departmentNameList: [],
  supervisorNameList: [],
  linemanagerList: [],
  employmentTypeList: [],
  wingNameList: [],
  soleDepoNameList: [],
  regionNameList: [],
  areaNameList: [],
  territoryNameList: [],
  // srt: {
  //   viewOrder: true,
  //   columnName: "string",
  // },
};

// const validationSchema = Yup.object({
//   designation: Yup.object()
//     .shape({
//       label: Yup.string().required("Designation is required"),
//       value: Yup.string().required("Designation is required"),
//     })
//     .typeError("Designation is required"),
//   confirmDate: Yup.string().required("Confirmation  Date is required"),
// });
function HiredeskOnboarding() {
  const dispatch = useDispatch();

  // const history = useHistory();
  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // const [landingLoading, setLandingLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState(false);
  const [allData, setAllData] = useState(false);
  const [, setSingleSalaryData] = useState([]);
  const [isAddEditForm, setIsAddEditForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [landingLoading, setLandingLoading] = useState(false);
  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});
  const [resEmpLanding, setEmpLanding] = useState([]);
  const [res, getLanding, loader, setData] = useAxiosGet();
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const [headerList, setHeaderList] = useState({});
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });

  // const getData = (fromDate, toDate, searchText, pages) => {
  //   getPeopleDeskAllLandingForConfirmation(
  //     "EmployeeBasicForConfirmation",
  //     orgId,
  //     buId,
  //     "",
  //     0,
  //     0,
  //     0,
  //     setRowDto,
  //     setAllData,
  //     setLoading,
  //     0,
  //     fromDate,
  //     toDate,
  //     setPages,
  //     wgId,
  //     pages,
  //     searchText
  //   );
  // };

  // landing api call
  const getDataApiCall = async (
    modifiedPayload,
    pages,
    searchText,
    currentFilterSelection = -1,
    checkedHeaderList,
    srtObj,
    values
  ) => {
    try {
      const payload = {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: 0,
        pageNo: pages.current,
        pageSize: pages.pageSize,
        isPaginated: true,
        isHeaderNeed: true,
        searchTxt: searchText || "",
        srt: srtObj,
      };

      const res = await axios.post(
        `/EmployeeAllLanding/EmployeeBasicForConfirmation?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&FromDate=${
          values?.filterFromDate || initData.filterFromDate
        }&ToDate=${values?.filterToDate || initData.filterToDate}&PageNo=${
          pages?.current
        }&PageSize=${pages?.pageSize}&SearchTxt=${
          searchText || ""
        }&IsHeaderNeed=true`,
        { ...payload, ...modifiedPayload }
      );
      if (res?.data?.data) {
        setHeaderListDataDynamically({
          currentFilterSelection,
          checkedHeaderList,
          headerListKey: "employeeHeader",
          headerList,
          setHeaderList,
          response: res?.data,
          filterOrderList,
          setFilterOrderList,
          initialHeaderListData,
          setInitialHeaderListData,
          setEmpLanding,
          setPages,
        });

        setEmpLanding(res?.data?.data);

        setLandingLoading(false);
      }
    } catch (error) {
      setLandingLoading(false);
    }
  };

  const getData = async (
    pages,
    IsForXl = "false",
    searchText = "",
    currentFilterSelection = -1,
    filterOrderList = [],
    checkedHeaderList = { ...initHeaderList },
    srtObj = {},
    values
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
      pages,
      searchText,
      currentFilterSelection,
      checkedHeaderList,
      srtObj,
      values
    );
  };

  // const open = Boolean(anchorEl);
  // const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
  }, [dispatch]);

  const handleClick = (event) => {
    // setViewModal(event.currentTarget);
  };

  const handleChangePage = (event, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });
    getData(
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      "false",
      searchText,
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
      "false",
      searchText,
      -1,
      filterOrderList,
      checkedHeaderList
    );
  };

  //   useEffect(() => {
  //     PeopleDeskSaasDDL(
  //       "EmpDesignation",
  //       wgId,
  //       buId,
  //       setDesignationDDL,
  //       "DesignationId",
  //       "DesignationName"
  //     );
  //   }, [wgId, buId]);

  useEffect(() => {
    // getData(pages);
    getLanding(`/Employee/OnboardingFromHireDeskLanding`, (data) => {
      setEmpLanding(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId]);

  const confirmation = (values) => {
    // confirmationEmpAction(values, singleData, setLoading, () => {
    //   setSingleData(false);
    //   setIsEdit(false);
    //   setAnchorEl(null);
    //   getData(pages, values);
    // });
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30539) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        // onSubmit={(values, { setSubmitting, resetForm }) => {
        //   saveHandler(values, () => {
        //     resetForm(initData);
        //   });
        // }}
      >
        {({
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          setValues,
        }) => (
          <>
            {loading && <Loading />}
            <Form onSubmit={handleSubmit} className="employeeProfile-form-main">
              <div className="employee-profile-main">
                {permission?.isView ? (
                  <div className="table-card">
                    <div
                      className="table-card-heading justify-content-between"
                      style={{ marginBottom: "6px" }}
                    >
                      <div className="ml-2 ">
                        <div className="d-flex justify-content-between align-items-center">
                          {resEmpLanding?.length > 0 ? (
                            <>
                              <h6 className="count">
                                Total {resEmpLanding?.length} employee
                                {resEmpLanding?.length > 1 ? "s" : ""}
                              </h6>
                            </>
                          ) : (
                            <>
                              <h6 className="count">Total result 0</h6>
                            </>
                          )}
                        </div>
                      </div>
                      {/* <ul className="d-flex flex-wrap">
                        {values?.search && (
                          <ResetButton
                            classes="btn-filter-reset"
                            title="Reset"
                            icon={<RefreshIcon sx={{ marginRight: "10px" }} />}
                            onClick={() => {
                              getData(
                                { current: 1, pageSize: paginationSize },
                                "false",
                                "",
                                -1,
                                filterOrderList,
                                checkedHeaderList
                              );
                              setFieldValue("search", "");
                            }}
                            styles={{
                              height: "auto",
                              fontSize: "12px",
                              marginRight: "10px",
                              marginTop: "3px",
                              paddingTop: "0px",
                            }}
                          />
                        )}
                        <li>
                          <MasterFilter
                            isHiddenFilter
                            styles={{
                              marginRight: "0px",
                            }}
                            width="200px"
                            inputWidth="200px"
                            value={values?.search}
                            setValue={(value) => {
                              setFieldValue("search", value);
                              if (value) {
                                getData(
                                  { current: 1, pageSize: paginationSize },
                                  "false",
                                  value,
                                  -1,
                                  filterOrderList,
                                  checkedHeaderList
                                );
                              } else {
                                getData(
                                  { current: 1, pageSize: paginationSize },
                                  "false",
                                  "",
                                  -1,
                                  filterOrderList,
                                  checkedHeaderList
                                );
                              }
                            }}
                            cancelHandler={() => {
                              getData(
                                { current: 1, pageSize: paginationSize },
                                "false",
                                "",
                                -1,
                                filterOrderList,
                                checkedHeaderList
                              );
                              setFieldValue("search", "");
                            }}
                            handleClick={handleClick}
                          />
                        </li>
                      </ul> */}
                    </div>
                    <div className="table-card-body">
                      {/* <div
                        className="card-style mb-2"
                        style={{ marginTop: "13px" }}
                      >
                        <div className="row">
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>From Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.filterFromDate}
                                placeholder=""
                                name="filterFromDate"
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue(
                                    "filterFromDate",
                                    e.target.value
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>To Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.filterToDate}
                                placeholder="Month"
                                name="filterToDate"
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("filterToDate", e.target.value);
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-lg-1">
                            <button
                              // disabled={
                              //   !values?.filterToDate || !values?.filterFromDate
                              // }
                              style={{ marginTop: "21px" }}
                              className="btn btn-green"
                              onClick={() => {
                                getData(pages, "", "", "", [], {}, {}, values);
                              }}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div> */}
                      {resEmpLanding?.length > 0 ? (
                        <div className="table-card-styled employee-table-card tableOne mt-3">
                          <PeopleDeskTable
                            scrollCustomClass="confirmationScrollTable"
                            columnData={onBoardColumns(
                              // setAnchorEl,
                              permission
                              // orgId,
                              // setValues
                              // pages,
                              // wgId,
                              // headerList
                            )}
                            // pages={pages}
                            rowDto={resEmpLanding}
                            setRowDto={setEmpLanding}
                            // checkedHeaderList={checkedHeaderList}
                            // setCheckedHeaderList={setCheckedHeaderList}
                            // handleChangePage={(e, newPage) =>
                            //   handleChangePage(e, newPage, values?.searchString)
                            // }
                            // handleChangeRowsPerPage={(e) =>
                            //   handleChangeRowsPerPage(e, values?.searchString)
                            // }
                            // filterOrderList={filterOrderList}
                            // setFilterOrderList={setFilterOrderList}
                            uniqueKey="phoneNo"
                            // handleSortingData={(obj) => {
                            //   // setEmpLanding([])
                            //   getData(
                            //     {
                            //       current: pages?.current,
                            //       pageSize: pages?.pageSize,
                            //       total: pages?.total,
                            //     },
                            //     "false",
                            //     values?.searchString || "",
                            //     -1,
                            //     filterOrderList,
                            //     checkedHeaderList,
                            //     {
                            //       viewOrder:
                            //         obj?.order === "asc" ? true : false,
                            //       columnName: obj?.current,
                            //     },
                            //     values
                            //   );
                            // }}
                            // getFilteredData={(
                            //   currentFilterSelection,
                            //   updatedFilterData,
                            //   updatedCheckedHeaderData
                            // ) => {
                            //   getData(
                            //     {
                            //       current: 1,
                            //       pageSize: paginationSize,
                            //       total: 0,
                            //     },
                            //     "false",
                            //     "",
                            //     currentFilterSelection,
                            //     updatedFilterData,
                            //     updatedCheckedHeaderData,
                            //     {},
                            //     values
                            //   );
                            // }}
                            // isCheckBox={false}
                            // onRowClick={(item) => {
                            //   if (item?.intEmploymentTypeId === 2) {
                            //     setIsAddEditForm(true);
                            //     let obj = {
                            //       partType: "EmployeeSalaryInfoByEmployeeId",
                            //       businessUnitId: buId,
                            //       workplaceGroupId: 0,
                            //       departmentId: 0,
                            //       designationId: 0,
                            //       supervisorId: 0,
                            //       employeeId: item?.EmployeeId || 0,
                            //     };
                            //     // getEmployeeSalaryInfo(
                            //     //   setSingleSalaryData,
                            //     //   setLoading,
                            //     //   obj
                            //     // );
                            //   }
                            // }}
                            isScrollAble={true}
                            isPagination={false}
                          />
                        </div>
                      ) : (
                        <NoResult title="No Result Found" para="" />
                      )}
                    </div>
                  </div>
                ) : (
                  <NotPermittedPage />
                )}
              </div>
              {/* <Popover
                sx={{
                  "& .MuiPaper-root": {
                    width: "675px",
                    minHeight: "200px",
                    borderRadius: "4px",
                  },
                }}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => {
                  setAnchorEl(null);
                  setSingleData(false);
                  setFieldValue("pinNo", "");
                }}
                anchorOrigin={{
                  vertical: "bottom",
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
                        setAnchorEl(null);
                        setRowDto(allData);
                        setSingleData(false);
                        setIsEdit(false);
                        setFieldValue("confirmDate", "");
                      }}
                    >
                      <Clear sx={{ fontSize: "18px", color: gray900 }} />
                    </IconButton>
                  </div>
                  <hr />
                  <div
                    className="body-employeeProfile-master-filter"
                    style={{ height: "250px" }}
                  >
                    <div className="row content-input-field">
                      <div className="col-6">
                        <div className="input-field-main">
                          <label>Designation</label>
                          <FormikSelect
                            menuPosition="fixed"
                            name="designation"
                            options={designationDDL || []}
                            value={values?.designation}
                            onChange={(valueOption) => {
                              setFieldValue("designation", valueOption);
                            }}
                            styles={customStyles}
                            placeholder=""
                            errors={errors}
                            touched={touched}
                            isDisabled={isEdit && true}
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="input-field-main">
                          <label>Confirmation Date</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.confirmDate}
                            onChange={(e) => {
                              setFieldValue("confirmDate", e.target.value);
                            }}
                            name="confirmDate"
                            type="date"
                            className="form-control"
                            errors={errors}
                            min={dateFormatterForInput(singleData?.JoiningDate)}
                            touched={touched}
                            disabled={isEdit && true}
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="input-field-main">
                          <label>PIN No.</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.pinNo}
                            onChange={(e) => {
                              setFieldValue("pinNo", e.target.value);
                            }}
                            name="pinNo"
                            type="text"
                            className="form-control"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="master-filter-bottom footer-employeeProfile-src-filter">
                    <div className="master-filter-btn-group">
                      <button
                        type="button"
                        className="btn btn-cancel"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnchorEl(null);
                          setRowDto(allData);
                          setSingleData(false);
                          setIsEdit(false);
                          setFieldValue("confirmDate", "");
                          setFieldValue("pinNo", "");
                        }}
                        style={{
                          marginRight: "10px",
                        }}
                      >
                        cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-green btn-green-disable"
                        style={{ width: "auto" }}
                        onClick={() => {
                          confirmation(values);
                        }}
                      >
                        {isEdit ? "Save" : "Assign"}
                      </button>
                    </div>
                  </div>
                </div>
              </Popover> */}
              {/* <PopOverFilter
                propsObj={{
                  openId,
                  openModal,
                  viewModal,
                  setLoading,
                  setIsFilter,
                  handleClose,
                }}
                masterFilterHandler={masterFilterHandler}
              /> */}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default HiredeskOnboarding;
