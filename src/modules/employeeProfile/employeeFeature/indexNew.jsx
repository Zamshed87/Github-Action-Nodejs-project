import { AddOutlined, SaveAlt } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import ViewModal from "../../../common/ViewModal";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray900 } from "../../../utility/customColor";
import { dateFormatter } from "../../../utility/dateFormatter";
import AddEditForm from "./addEditFile";
import {
  columnForHeadOffice,
  columnForMarketing,
  empListColumn,
  getBuDetails,
  getTableDataEmployee,
  newEmpListColumn,
} from "./helper";
import "./styles.css";
import axios from "axios";
import MasterFilter from "../../../common/MasterFilter";
import PeopleDeskTable, {
  paginationSize,
} from "./../../../common/peopleDeskTable/index";
import { createCommonExcelFile } from "../../../utility/customExcel/generateExcelAction";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "../../../common/peopleDeskTable/helper";
import { DataTable } from "Components";
import { useApiRequest } from "Hooks";
import { Button } from "antd";

const initData = {
  searchString: "",
  payrollGroup: "",
  supervisor: "",
  rosterGroup: "",
  department: "",
  designation: "",
  calendar: "",
  gender: "",
  religion: "",
  employementType: "",
  joiningFromDate: "",
  joiningToDate: "",
  contractualFromDate: "",
  contractualToDate: "",
  employmentStatus: "",
};

const initHeaderList = {
  strDepartmentList: [],
  strDesignationList: [],
  strSupervisorNameList: [],
  strEmploymentTypeList: [],
  strLinemanagerList: [],
  wingNameList: [],
  soleDepoNameList: [],
  regionNameList: [],
  areaNameList: [],
  territoryNameList: [],
};

function EmployeeFeatureNew() {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();

  // redux
  const { orgId, buId, buName, wgId, wgName, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // state
  const [loading, setLoading] = useState(false);
  const [landingLoading, setLandingLoading] = useState(false);
  const [buDetails, setBuDetails] = useState("");
  const [isAddEditForm, setIsAddEditForm] = useState(false);

  // landing table
  const [headerList, setHeaderList] = useState({});
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });
  const [resEmpLanding, setEmpLanding] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});

  // Api Instance
  const landingApi = useApiRequest({});

  const landingApiCall = (pagination = {}, filerList = {}, searchText = "") => {
    const payload = {
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      pageNo: pagination?.current || 1,
      pageSize: pagination?.pageSize || 25,
      isPaginated: true,
      isHeaderNeed: true,
      searchTxt: searchText || "",
      strDepartmentList: filerList?.strDepartment || [],
      strDesignationList: filerList?.strDesignation || [],
      strSupervisorNameList: filerList?.strSupervisorName || [],
      strEmploymentTypeList: filerList?.strEmploymentType || [],
      strLinemanagerList: filerList?.strLinemanager || [],
      wingNameList: [],
      soleDepoNameList: [],
      regionNameList: [],
      areaNameList: [],
      territoryNameList: [],
    };
    landingApi.action({
      urlKey: "EmployeeProfileLandingPaginationWithMasterFilter",
      method: "post",
      payload: payload,
    });
  };

  useEffect(() => {
    landingApiCall();
  }, [buId, wgId, wId]);

  // landing api call
  const getDataApiCall = async (
    modifiedPayload,
    pagination,
    searchText,
    currentFilterSelection = -1,
    checkedHeaderList
  ) => {
    const payload = {
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      isPaginated: true,
      isHeaderNeed: true,
      searchTxt: searchText || "",
      ...modifiedPayload,
    };

    try {
      const res = await axios.post(
        `/Employee/EmployeeProfileLandingPaginationWithMasterFilter`,
        payload
      );
      console.log(res?.data);
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

        setLandingLoading(false);
      }
    } catch (error) {
      setLandingLoading(false);
    }
  };

  const getData = async (
    pagination,
    IsForXl = "false",
    searchText = "",
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
      currentFilterSelection,
      checkedHeaderList
    );
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

  // menu permission
  let employeeFeature = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 8) {
      employeeFeature = item;
    }
  });

  useEffect(() => {
    getBuDetails(buId, setBuDetails, setLoading);
  }, [orgId, buId, wgId, wId]);

  useEffect(() => {
    setHeaderList({});
    setEmpLanding([]);
    getData(pages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            {(landingLoading || loading) && <Loading />}
            <Form onSubmit={handleSubmit} className="employeeProfile-form-main">
              <div className="employee-profile-main">
                {/* box-employee-profile  */}
                {employeeFeature?.isView ? (
                  <div className="table-card">
                    {/* header-employee-profile  */}
                    <div className="table-card-heading">
                      <div className="d-flex justify-content-center align-items-center">
                        <Tooltip title="Export CSV" arrow>
                          <button
                            type="button"
                            className="btn-save"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLoading(true);
                              const excelLanding = async () => {
                                try {
                                  // const res = await axios.get(
                                  //   `/Employee/EmployeeProfileLandingPagination?accountId=${orgId}&businessUnitId=${buId}&EmployeeId=${employeeId}&PageNo=1&PageSize=1000000&searchTxt=&WorkplaceGroupId=${wgId}&IsForXl=true`
                                  // );
                                  const payload = {
                                    businessUnitId: buId,
                                    workplaceGroupId: wgId,
                                    workplaceId: 0,
                                    pageNo: 0,
                                    pageSize: 0,
                                    isPaginated: false,
                                    isHeaderNeed: false,
                                    searchTxt: values?.searchString,
                                    ...checkedHeaderList,
                                  };
                                  const res = await axios.post(
                                    `/Employee/EmployeeProfileLandingPaginationWithMasterFilter`,
                                    payload
                                  );
                                  if (res?.data) {
                                    if (!res?.data?.data?.length > 0) {
                                      setLoading(false);
                                      return toast.error(
                                        "No Employee Data Found"
                                      );
                                    }
                                    let newData = res?.data?.data?.map(
                                      (item, index) => ({
                                        ...item,
                                        sl: index + 1,
                                        strEmployeeName:
                                          item?.strEmployeeName || " ",
                                        intEmployeeId:
                                          item?.intEmployeeId ||
                                          item?.intEmployeeBasicInfoId ||
                                          " ",
                                        strEmployeeCode:
                                          item?.strEmployeeCode || " ",
                                        JoiningDate: item?.dteJoiningDate
                                          ? dateFormatter(item?.dteJoiningDate)
                                          : item?.JoiningDate || " ",
                                        ServiceLength:
                                          item?.strServiceLength ||
                                          item?.ServiceLength ||
                                          " ",
                                        ConfirmationDate:
                                          item?.dteConfirmationDate
                                            ? dateFormatter(
                                                item?.dteConfirmationDate
                                              )
                                            : item?.ConfirmationDate || " ",
                                        strSupervisorName:
                                          item?.strSupervisorName ||
                                          item?.strSupervisorName ||
                                          " ",
                                        DottedSupervisor:
                                          item?.DottedSupervisor ||
                                          item?.strDottedSupervisorName ||
                                          " ",
                                        strLinemanager:
                                          item?.strLinemanager || " ",
                                        strDesignation:
                                          item?.strDesignation || " ",
                                        strDepartment:
                                          item?.strDepartment || " ",
                                        strOfficeMail:
                                          item?.strOfficeMail || " ",
                                        strPersonalMail:
                                          item?.strPersonalMail || " ",
                                        strOfficeMobile:
                                          item?.strOfficeMobile || " ",
                                        strPersonalMobile:
                                          item?.strPersonalMobile || " ",
                                        strGender: item?.strGender || " ",
                                        strReligion: item?.strReligion || " ",
                                        strPayrollGroupName:
                                          item?.strPayrollGroupName || " ",
                                        strBankWalletName:
                                          item?.strBankWalletName || " ",
                                        strBranchName:
                                          item?.strBranchName || " ",
                                        strAccountName_BankDetails:
                                          item?.strBankAccountName || " ",
                                        strAccountNo:
                                          item?.strBankAccountNo || " ",
                                        strRoutingNo: item?.strRoutingNo || " ",
                                        strWorkplace:
                                          item?.strWorkplace ||
                                          item?.strWorkplaceName ||
                                          " ",
                                        strWorkplaceGroup:
                                          item?.strWorkplaceGroup ||
                                          item?.strWorkplaceName ||
                                          " ",
                                        strBusinessUnit:
                                          item?.strBusinessUnit ||
                                          item?.strBusinessUnitName ||
                                          " ",
                                        DateOfBirth: item?.dteDateOfBirth
                                          ? dateFormatter(item?.dteDateOfBirth)
                                          : item?.DateOfBirth || " ",
                                        strEmploymentType:
                                          item?.strEmploymentType ||
                                          item?.employmentType ||
                                          " ",
                                        strEmployeeStatus:
                                          item?.strEmployeeStatus || " ",
                                        contractualFromDate:
                                          item?.dteContractFromDate
                                            ? dateFormatter(
                                                item?.dteContractFromDate
                                              )
                                            : item?.dteContactFromDate || "",
                                        contractualToDate:
                                          item?.dteContractToDate
                                            ? dateFormatter(
                                                item?.dteContractToDate
                                              )
                                            : item?.dteContactToDate || "",
                                      })
                                    );

                                    createCommonExcelFile({
                                      titleWithDate: `Employee List`,
                                      fromDate: "",
                                      toDate: "",
                                      buAddress:
                                        buDetails?.strBusinessUnitAddress,
                                      businessUnit: buName,
                                      tableHeader:
                                        wgId === 3
                                          ? columnForMarketing
                                          : columnForHeadOffice,
                                      getTableData: () =>
                                        getTableDataEmployee(
                                          newData,
                                          wgId === 3
                                            ? Object.keys(columnForMarketing)
                                            : Object.keys(columnForHeadOffice)
                                        ),
                                      tableFooter: [],
                                      extraInfo: {},
                                      tableHeadFontSize: 10,
                                      widthList:
                                        wgId === 3
                                          ? {
                                              C: 30,
                                              E: 30,
                                              F: 30,
                                              G: 15,
                                              H: 15,
                                              I: 15,
                                              J: 15,
                                              K: 20,
                                              L: 30,
                                              M: 25,
                                              N: 25,
                                            }
                                          : {
                                              C: 30,
                                              E: 30,
                                              F: 30,
                                              G: 30,
                                              H: 25,
                                              I: 25,
                                              J: 20,
                                            },
                                      commonCellRange: "A1:J1",
                                      CellAlignment: "left",
                                    });
                                    setLoading && setLoading(false);
                                  }
                                } catch (error) {
                                  setLoading && setLoading(false);
                                  toast.error(error?.response?.data?.message);
                                }
                              };
                              excelLanding();
                            }}
                          >
                            <SaveAlt
                              sx={{
                                color: gray900,
                                fontSize: "14px",
                              }}
                            />
                          </button>
                        </Tooltip>
                        <div className="ml-2">
                          {resEmpLanding?.length > 0 ? (
                            <>
                              <h6 className="count">
                                Total {pages?.total} employees
                              </h6>
                            </>
                          ) : (
                            <>
                              <h6 className="count">Total result 0</h6>
                            </>
                          )}
                        </div>
                      </div>
                      <ul className="d-flex flex-wrap">
                        <li>
                          <MasterFilter
                            inputWidth="250px"
                            width="250px"
                            isHiddenFilter
                            value={values?.searchString}
                            setValue={(value) => {
                              setFieldValue("searchString", value);
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
                              setFieldValue("searchString", "");
                              getData(
                                { current: 1, pageSize: paginationSize },
                                "false",
                                "",
                                -1,
                                filterOrderList,
                                checkedHeaderList
                              );
                            }}
                          />
                        </li>
                        <li className="pr-2">
                          <PrimaryButton
                            type="button"
                            className="btn btn-default flex-center"
                            label="Bulk Employee"
                            icon={
                              <AddOutlined
                                sx={{
                                  marginRight: "0px",
                                  fontSize: "15px",
                                }}
                              />
                            }
                            onClick={() => {
                              if (employeeFeature?.isCreate) {
                                history.push("/profile/employee/bulk");
                              } else {
                                toast.warn("You don't have permission");
                              }
                            }}
                          />
                        </li>
                        <li>
                          <PrimaryButton
                            type="button"
                            className="btn btn-default flex-center"
                            label="New Employee"
                            icon={
                              <AddOutlined
                                sx={{
                                  marginRight: "0px",
                                  fontSize: "15px",
                                }}
                              />
                            }
                            onClick={() => {
                              if (employeeFeature?.isCreate) {
                                setIsAddEditForm(true);
                              } else {
                                toast.warn("You don't have permission");
                              }
                            }}
                          />
                        </li>
                      </ul>
                    </div>
                    {/* Example Using Data Table Designed By Ant-Design v4 */}
                    <DataTable
                      bordered
                      data={landingApi?.data?.data || []}
                      header={newEmpListColumn(
                        pages?.current,
                        pages?.pageSize,
                        headerList,
                        wgName,
                        history
                      )}
                      pagination={{
                        pageSize: pages?.pageSize,
                        total: pages?.total,
                      }}
                      filterData={landingApi?.data?.employeeHeader}
                      onChange={(pagination, filters, sorter, extra) => {
                        // console.log(filters);
                        // const { current, pageSize } = pagination;
                        // Return if sort function is called
                        if (extra.action === "sort") return;
                        landingApiCall(
                          pagination,
                          filters,
                          values?.searchString
                        );
                      }}
                    />
                    {/* Previous Table */}
                    {/* {resEmpLanding.length > 0 ? (
                      <PeopleDeskTable
                        columnData={empListColumn(
                          pages?.current,
                          pages?.pageSize,
                          headerList,
                          wgName,
                          history
                        )}
                        pages={pages}
                        rowDto={resEmpLanding}
                        setRowDto={setEmpLanding}
                        checkedHeaderList={checkedHeaderList}
                        setCheckedHeaderList={setCheckedHeaderList}
                        handleChangePage={(e, newPage) =>
                          handleChangePage(e, newPage, values?.searchString)
                        }
                        handleChangeRowsPerPage={(e) =>
                          handleChangeRowsPerPage(e, values?.searchString)
                        }
                        filterOrderList={filterOrderList}
                        setFilterOrderList={setFilterOrderList}
                        uniqueKey="strEmployeeCode"
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
                            "false",
                            "",
                            currentFilterSelection,
                            updatedFilterData,
                            updatedCheckedHeaderData
                          );
                        }}
                        isCheckBox={false}
                        isScrollAble={true}
                      />
                    ) : (
                      <>
                        {!loading && (
                          <div className="col-12">
                            <NoResult title={"No Data Found"} para={""} />
                          </div>
                        )}
                      </>
                    )} */}
                  </div>
                ) : (
                  <NotPermittedPage />
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>

      <ViewModal
        show={isAddEditForm}
        title="Create New Employee"
        onHide={() => setIsAddEditForm(false)}
        size="lg"
        backdrop="static"
        classes="default-modal form-modal"
      >
        <AddEditForm
          getData={getData}
          pages={pages}
          setIsAddEditForm={setIsAddEditForm}
        />
      </ViewModal>
    </>
  );
}

export default EmployeeFeatureNew;
