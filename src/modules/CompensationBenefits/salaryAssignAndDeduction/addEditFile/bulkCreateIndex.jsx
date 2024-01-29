import RefreshIcon from "@mui/icons-material/Refresh";
import { DataTable } from "Components";
import axios from "axios";
import FormikSelect from "common/FormikSelect";
import { getPeopleDeskAllDDL } from "common/api";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import BackButton from "../../../../common/BackButton";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import Loading from "../../../../common/loading/Loading";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "../../../../common/peopleDeskTable/helper";
import { gray600, success500 } from "../../../../utility/customColor";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { createEditAllowanceAndDeduction } from "../helper";
import HeaderTableForm from "./headerTableForm";
import {
  bulkAssignEmpListTableColumn,
  empListColumn,
  initData,
  validationSchema,
  validationSchema2,
} from "./helper";

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

const addAllFieldToDDL = (field, arr) => {
  const isAll = (field || []).some((item) => item?.value === 0);
  if (isAll) return [];
  else if (arr.length > 1) return [{ label: "All", value: 0 }, ...arr];
  else return arr;
};

function BulkAddEditForm() {
  const location = useLocation();
  const scrollRef = useRef();
  const { isCreate, isView } = location?.state?.state;

  //redux data
  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // pages
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  // States
  const debounce = useDebounce();
  const [loading, setLoading] = useState(false);
  const [allowanceAndDeductionDDL, setAllowanceAndDeductionDDL] =
    useState(false);
  const [filterOrderList, setFilterOrderList] = useState([]);
  const [initialHeaderListData, setInitialHeaderListData] = useState({});
  const [headerList, setHeaderList] = useState({});
  const [checkedHeaderList, setCheckedHeaderList] = useState({
    ...initHeaderList,
  });
  const [resEmpLanding, setEmpLanding] = useState([]);
  const [checkedList, setCheckedList] = useState([]);

  const getDataApiCall = async (
    modifiedPayload,
    pagination,
    searchText,
    checkedList = [],
    currentFilterSelection = -1,
    checkedHeaderList
  ) => {
    try {
      const payload = {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: 0,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        isPaginated: true,
        isHeaderNeed: true,
        searchTxt: searchText || "",
      };

      const res = await axios.post(
        `/Employee/EmployeeProfileLandingPaginationWithMasterFilter`,
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
          // setEmpLanding,
          setPages,
        });

        const modifiedData = res?.data?.data?.map((item, index) => ({
          ...item,
          initialSerialNumber: index + 1,
          isSelected: checkedList?.find(
            ({ strEmployeeCode }) => item?.strEmployeeCode === strEmployeeCode
          )
            ? true
            : false,
        }));

        setEmpLanding(modifiedData);

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
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
    setLoading(true);
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

  const saveHandler = (values, cb, isAll = false) => {
    if (!values?.isAutoRenew && !values?.toMonth) {
      return toast.warn("To Month must be selected");
    }
    if(values?.intAllowanceDuration?.value === 1){
     if(!values?.intAllowanceAttendenceStatus){
      return toast.warn("Allowance Attendence Status Required");
     }
     if(!values?.maxAmount){
      return toast.warn("Max Amount Required");
     }
    }
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // let modifyEmployeeIdListId = [];
    // checkedList.map(
    //   (item) =>
    //     item?.isSelected &&
    //     modifyEmployeeIdListId?.push({
    //       intEmployeeId: item?.intEmployeeBasicInfoId,
    //     })
    // );

    // if (!checkedList?.some((itm) => itm.isSelected === true)) {
    //   return toast.warn("Please select at least one employee");
    // }
    let empListString = "";
    if (isAll) {
      empListString = bulkEmpString;
    } else {
      empListString = selectedRow
        ?.map((item) => item?.intEmployeeBasicInfoId)
        .join(",");
    }

    const payload = {
      strEntryType: "BulkUpload",
      intSalaryAdditionAndDeductionId: 0,
      intAccountId: orgId,
      intBusinessUnitId: buId,
      intEmployeeId: values?.employee?.value || null,
      isAutoRenew: values?.isAutoRenew ? values?.isAutoRenew : false,
      intYear: +values?.fromMonth?.split("-")[0] || null,
      intMonth: +values?.fromMonth?.split("-")[1] || null,
      strMonth: months[+values?.fromMonth?.split("-")[1] - 1] || null,
      isAddition: values?.salaryType?.value === 1 ? true : false,
      strAdditionNDeduction: values?.allowanceAndDeduction?.label,
      intAdditionNDeductionTypeId: values?.allowanceAndDeduction?.value,
      intAmountWillBeId: values?.amountDimension?.value,
      strAmountWillBe: values?.amountDimension?.label,
      numAmount: +values?.amount,
      isActive: true,
      isReject: false,
      intActionBy: employeeId,
      intToYear: +values?.toMonth?.split("-")[0] || null,
      intToMonth: +values?.toMonth?.split("-")[1] || null,
      strToMonth: months[+values?.toMonth?.split("-")[1] - 1] || null,
      // employeeIdList: modifyEmployeeIdListId, 🔥

      // new requirement added 🔥 25-01-24
      // strEntryType: "string",
      // intSalaryAdditionAndDeductionId: 0,
      // intAccountId: 0,
      // intBusinessUnitId: 0,
      intWorkplaceGroupId: wgId,
      intWorkplaceId: wId,
      // intEmployeeId: 0,
      // isAutoRenew: true,
      // intYear: 0,
      // intMonth: 0,
      // strMonth: "string",
      // isAddition: true,
      // strAdditionNDeduction: "string",
      // intAdditionNDeductionTypeId: 0,
      // intAmountWillBeId: 0,
      // strAmountWillBe: "string",
      // numAmount: 0,
      intAllowanceDuration: values?.intAllowanceDuration?.value,
      numMaxLimit: +values?.maxAmount,
      intAllowanceAttendenceStatus: values?.intAllowanceAttendenceStatus?.value,
      // isActive: true,
      // isReject: true,
      // intActionBy: 0,
      // intToYear: 0,
      // intToMonth: 0,
      // strToMonth: "string",
      strEmployeeIdList: empListString,
    };

    createEditAllowanceAndDeduction(payload, setLoading, cb);
  };

  const saveAllHandler = (values) => {
    const errorMessages = {
      fromMonth: "From month is required",
      salaryType: "Salary Type is required",
      allowanceAndDeduction: "Allowance/Deduction type is required",
      amountDimension: "Amount Dimension is required",
      amount: "Amount is required",
    };
    // throw error 🔥
    const remainingError = Object.keys(errorMessages).some((fieldName) => {
      if (!values?.[fieldName]) {
        toast.warn(errorMessages[fieldName]);
        return true;
      }
      return false;
    });

    if (!remainingError) {
      saveHandler(
        values,
        getLandingBulkAssignEmpListHandler(
          values,
          { current: 1, pageSize: paginationSize },
          ""
        ),
        true
      );
    }
  };

  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [empTypeDDL, setEmpTypeDDL] = useState([]);
  const [hrTypeDDL, setHRTypeDDL] = useState([]);
  const [
    bulkAssignEmpList,
    getBulkAssignEmpList,
    loadingBulkAssign,
    setBulkAssignEmpList,
  ] = useAxiosPost([]);
  const [bulkEmpString, setBulkEmpString] = useState("");
  const [selectedRow, setSelectedRow] = useState([]);
  const formikRef = useRef();

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}&intId=0`,
      "DepartmentId",
      "DepartmentName",
      setDepartmentDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmploymentType&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}&intId=0`,
      "Id",
      "EmploymentType",
      setEmpTypeDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Position&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}&intId=0`,
      "PositionId",
      "PositionName",
      setHRTypeDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDesignation&AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}&intId=0`,
      "DesignationId",
      "DesignationName",
      setDesignationDDL
    );
    setSelectedRow([]);
    setBulkAssignEmpList([]);
    setPages({
      current: 1,
      pageSize: paginationSize,
      total: 0,
    });
    formikRef?.current?.setValues((prev) => ({
      ...prev,
      empType: [],
      department: [],
      hrPosition: [],
      designation: [],
      intAllowanceDuration: {
        value: 2,
        label: "Per Month",
      },
      intAllowanceAttendenceStatus: "",
      maxAmount: "",
    }));
    setHeaderList({});
    setEmpLanding([]);
    getLandingBulkAssignEmpListHandler(
      formikRef?.current?.values,
      { current: 1, pageSize: paginationSize },
      ""
    );
  }, [wgId, buId, employeeId, wId, orgId]);

  const getLandingBulkAssignEmpListHandler = (values, pages, searchString) => {
    setBulkAssignEmpList([]);
    setSelectedRow([]);
    const checkingAll = (ddlList) => {
      const isAll = (ddlList || []).some((item) => item?.value === 0);
      if (isAll) {
        return [];
      } else {
        return (ddlList || []).map((item) => item.value);
      }
    };
    const payload = {
      accountId: orgId,
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      employmentTypeId: checkingAll(values?.empType), // (values?.empType || []).map((item) => item.value),
      hrPositionId: checkingAll(values?.hrPosition),
      departmentId: checkingAll(values?.department),
      designationId: checkingAll(values?.designation),
      isPaginated: true,
      searchTxt: searchString || "",
      currentPage: pages?.current,
      pageSize: pages?.pageSize,
    };
    getBulkAssignEmpList(
      `/Employee/EmployeeProfileLandingPaginationMaster`,
      payload,
      (res) => {
        setBulkAssignEmpList(res?.data || []);
        setBulkEmpString(res?.strEmployeeIdList);
        setPages({
          current: res?.currentPage,
          pageSize: res?.pageSize,
          total: res?.totalCount,
        });
      }
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
        }}
        validationSchema={
          bulkAssignEmpList.filter((itm) => itm.isSelected === true)?.length
            ? validationSchema2
            : validationSchema
        }
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm();
            // getData(
            //   { current: 1, pageSize: paginationSize },
            //   "",
            //   [],
            //   -1,
            //   filterOrderList,
            //   checkedHeaderList
            // );
            getLandingBulkAssignEmpListHandler(
              values,
              { current: 1, pageSize: paginationSize },
              ""
            ),
              setCheckedList([]);
          });
        }}
        innerRef={formikRef}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Form
              onSubmit={handleSubmit}
              className="employeeProfile-form-main w-100"
            >
              <div className="employee-profile-main">
                <div className="table-card w-100">
                  <div className="table-card-heading">
                    <div className="d-flex justify-content-center align-items-center">
                      <BackButton title={"Create Bulk Allowance & Deduction"} />
                    </div>
                    {!isView && (
                      <ul className="d-flex flex-wrap">
                        <li>
                          <button
                            type="submit"
                            className="btn btn-green btn-green-disable mr-3"
                            disabled={!selectedRow.length > 0}
                            style={{ width: "auto" }}
                          >
                            Save {selectedRow.length}
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="btn btn-green btn-green-disable"
                            disabled={!bulkAssignEmpList?.length > 0}
                            style={{ width: "auto" }}
                            onClick={() => saveAllHandler(values)}
                          >
                            Save All {pages?.total}
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                  <div className="row card-style pt-3 mb-3">
                    <div className="col-lg-4">
                      <div>
                        <label>Employment Type</label>
                        <FormikSelect
                          placeholder=" "
                          classes="input-sm"
                          styles={{
                            ...customStyles,
                            control: (provided) => ({
                              ...provided,
                              minHeight: "auto",
                              height:
                                values?.empType?.length > 1 ? "auto" : "30px",
                              borderRadius: "4px",
                              boxShadow: `${success500}!important`,
                              ":hover": {
                                borderColor: `${gray600}!important`,
                              },
                              ":focus": {
                                borderColor: `${gray600}!important`,
                              },
                            }),
                            valueContainer: (provided) => ({
                              ...provided,
                              height:
                                values?.empType?.length > 1 ? "auto" : "30px",
                              padding: "0 6px",
                            }),
                            multiValue: (styles) => {
                              return {
                                ...styles,
                                position: "relative",
                                top: "-1px",
                              };
                            },
                            multiValueLabel: (styles) => ({
                              ...styles,
                              padding: "0",
                            }),
                          }}
                          name="empType"
                          options={addAllFieldToDDL(
                            values?.empType,
                            empTypeDDL
                          )}
                          value={values?.empType || { label: "All", value: 0 }}
                          onChange={(valueOption) => {
                            setFieldValue("empType", valueOption);
                          }}
                          isMulti
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div>
                        <label>HR Position</label>
                        <FormikSelect
                          placeholder=" "
                          classes="input-sm"
                          styles={{
                            ...customStyles,
                            control: (provided) => ({
                              ...provided,
                              minHeight: "auto",
                              height:
                                values?.hrPosition?.length > 1
                                  ? "auto"
                                  : "30px",
                              borderRadius: "4px",
                              boxShadow: `${success500}!important`,
                              ":hover": {
                                borderColor: `${gray600}!important`,
                              },
                              ":focus": {
                                borderColor: `${gray600}!important`,
                              },
                            }),
                            valueContainer: (provided) => ({
                              ...provided,
                              height:
                                values?.hrPosition?.length > 1
                                  ? "auto"
                                  : "30px",
                              padding: "0 6px",
                            }),
                            multiValue: (styles) => {
                              return {
                                ...styles,
                                position: "relative",
                                top: "-1px",
                              };
                            },
                            multiValueLabel: (styles) => ({
                              ...styles,
                              padding: "0",
                            }),
                          }}
                          name="hrPosition"
                          options={addAllFieldToDDL(
                            values?.hrPosition,
                            hrTypeDDL
                          )}
                          value={
                            values?.hrPosition || { label: "All", value: 0 }
                          }
                          onChange={(valueOption) => {
                            setFieldValue("hrPosition", valueOption);
                          }}
                          isMulti
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div>
                        <label>Department</label>
                        <FormikSelect
                          placeholder=" "
                          classes="input-sm"
                          styles={{
                            ...customStyles,
                            control: (provided) => ({
                              ...provided,
                              minHeight: "auto",
                              height:
                                values?.department?.length > 1
                                  ? "auto"
                                  : "30px",
                              borderRadius: "4px",
                              boxShadow: `${success500}!important`,
                              ":hover": {
                                borderColor: `${gray600}!important`,
                              },
                              ":focus": {
                                borderColor: `${gray600}!important`,
                              },
                            }),
                            valueContainer: (provided) => ({
                              ...provided,
                              height:
                                values?.department?.length > 1
                                  ? "auto"
                                  : "30px",
                              padding: "0 6px",
                            }),
                            multiValue: (styles) => {
                              return {
                                ...styles,
                                position: "relative",
                                top: "-1px",
                              };
                            },
                            multiValueLabel: (styles) => ({
                              ...styles,
                              padding: "0",
                            }),
                          }}
                          name="department"
                          options={addAllFieldToDDL(
                            values?.department,
                            departmentDDL
                          )}
                          value={
                            values?.department || { label: "All", value: 0 }
                          }
                          onChange={(valueOption) => {
                            setFieldValue("department", valueOption);
                          }}
                          isMulti
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div>
                        <label>Designation</label>
                        <FormikSelect
                          placeholder=" "
                          classes="input-sm"
                          styles={{
                            ...customStyles,
                            control: (provided) => ({
                              ...provided,
                              minHeight: "auto",
                              height:
                                values?.designation?.length > 1
                                  ? "auto"
                                  : "30px",
                              borderRadius: "4px",
                              boxShadow: `${success500}!important`,
                              ":hover": {
                                borderColor: `${gray600}!important`,
                              },
                              ":focus": {
                                borderColor: `${gray600}!important`,
                              },
                            }),
                            valueContainer: (provided) => ({
                              ...provided,
                              height:
                                values?.designation?.length > 1
                                  ? "auto"
                                  : "30px",
                              padding: "0 6px",
                            }),
                            multiValue: (styles) => {
                              return {
                                ...styles,
                                position: "relative",
                                top: "-1px",
                              };
                            },
                            multiValueLabel: (styles) => ({
                              ...styles,
                              padding: "0",
                            }),
                          }}
                          name="designation"
                          options={addAllFieldToDDL(
                            values?.designation,
                            designationDDL
                          )}
                          value={
                            values?.designation || { label: "All", value: 0 }
                          }
                          onChange={(valueOption) => {
                            setFieldValue("designation", valueOption);
                          }}
                          isMulti
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: "23px",
                      }}
                      className="col-md-6"
                    >
                      <button
                        type="button"
                        className="btn btn-green btn-green-disable"
                        style={{ width: "auto" }}
                        label="Show"
                        onClick={() => {
                          getLandingBulkAssignEmpListHandler(values, pages);
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>

                  <div
                    // className="pt-1"
                    className={`pt-1 ${
                      bulkAssignEmpList?.length > 0 ? "" : "d-none"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {isCreate && (
                      <>
                        <HeaderTableForm
                          values={values}
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          orgId={orgId}
                          buId={buId}
                          wId={wId}
                          setLoading={setLoading}
                          setAllowanceAndDeductionDDL={
                            setAllowanceAndDeductionDDL
                          }
                          allowanceAndDeductionDDL={allowanceAndDeductionDDL}
                        />
                      </>
                    )}
                  </div>
                  {(loading || loadingBulkAssign) && <Loading />}
                  {/* 🔥 display none class added for new table - start 🔥  */}
                  <div
                    className="table-card-styled pt-2 pb-3 d-none"
                    ref={scrollRef}
                  >
                    <div
                      className="d-flex justify-content-between align-items-center px-0 mx-0"
                      style={{ marginBottom: "8px" }}
                    >
                      <p
                        style={{
                          color: gray600,
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        Employee List{" "}
                        {checkedList?.length > 0 && (
                          <span
                            style={{
                              fontSize: "12px",
                              paddingLeft: "8px",
                              fontWeight: "500",
                            }}
                          >
                            ({checkedList?.length} employee selected.)
                          </span>
                        )}
                      </p>
                      <div className="d-flex">
                        {checkedList?.length ? (
                          <ResetButton
                            classes="btn-filter-reset px-2"
                            title="Reset"
                            icon={
                              <RefreshIcon
                                sx={{
                                  marginRight: "4px",
                                  fontSize: "12px",
                                }}
                              />
                            }
                            onClick={() => {
                              setFieldValue("searchString", "");
                              setCheckedList([]);
                              getData(
                                { current: 1, pageSize: paginationSize },
                                "",
                                [],
                                -1,
                                filterOrderList,
                                checkedHeaderList
                              );
                            }}
                            styles={{ height: "auto", fontSize: "12px" }}
                          />
                        ) : (
                          <></>
                        )}

                        <MasterFilter
                          inputWidth="250px"
                          width="250px"
                          isHiddenFilter
                          value={values?.searchString}
                          setValue={(value) => {
                            setFieldValue("searchString", value);
                            debounce(() => {
                              getData(
                                { current: 1, pageSize: paginationSize },
                                value,
                                checkedList,
                                -1,
                                filterOrderList,
                                checkedHeaderList
                              );
                            }, 500);
                          }}
                          cancelHandler={(e) => {
                            setFieldValue("searchString", "");
                            getData(
                              { current: 1, pageSize: paginationSize },
                              "",
                              checkedList,
                              -1,
                              filterOrderList,
                              checkedHeaderList
                            );
                          }}
                          handleClick={(e) => {
                            setFieldValue("searchString", "");
                            getData(
                              { current: 1, pageSize: paginationSize },
                              "",
                              checkedList,
                              -1,
                              filterOrderList,
                              checkedHeaderList
                            );
                          }}
                        />
                      </div>
                    </div>
                    {resEmpLanding?.length > 0 ? (
                      <PeopleDeskTable
                        columnData={empListColumn(
                          pages?.current,
                          pages?.pageSize,
                          headerList
                        )}
                        pages={pages}
                        rowDto={resEmpLanding}
                        setRowDto={setEmpLanding}
                        checkedList={checkedList}
                        setCheckedList={setCheckedList}
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
                            "",
                            currentFilterSelection,
                            updatedFilterData,
                            updatedCheckedHeaderData
                          );
                        }}
                        isCheckBox={true}
                        isScrollAble={false}
                      />
                    ) : (
                      <NoResult />
                    )}
                  </div>
                  {/* 🔥 display none class added for new table - end 🔥  */}

                  <div className="table-card-styled pt-2 pb-3">
                    <div
                      className="d-flex justify-content-between align-items-center px-0 mx-0"
                      style={{ marginBottom: "8px" }}
                    >
                      <p
                        style={{
                          color: gray600,
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        Employee List{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            paddingLeft: "8px",
                            fontWeight: "500",
                          }}
                        >
                          ({selectedRow.length} employee selected)
                        </span>
                      </p>
                      <div className="d-flex">
                        {selectedRow?.length ? (
                          <ResetButton
                            classes="btn-filter-reset px-2"
                            title="Reset"
                            icon={
                              <RefreshIcon
                                sx={{
                                  marginRight: "4px",
                                  fontSize: "12px",
                                }}
                              />
                            }
                            onClick={() => {
                              setFieldValue("searchString", "");
                              setCheckedList([]);
                              setSelectedRow([]);
                              getLandingBulkAssignEmpListHandler(
                                values,
                                { current: 1, pageSize: paginationSize },
                                ""
                              );
                            }}
                            styles={{ height: "auto", fontSize: "12px" }}
                          />
                        ) : (
                          <></>
                        )}

                        <MasterFilter
                          inputWidth="250px"
                          width="250px"
                          isHiddenFilter
                          value={values?.searchString}
                          setValue={(value) => {
                            setFieldValue("searchString", value);
                            debounce(() => {
                              getLandingBulkAssignEmpListHandler(
                                values,
                                { current: 1, pageSize: paginationSize },
                                values?.searchString
                              );
                            }, 500);
                          }}
                          cancelHandler={() => {
                            setFieldValue("searchString", "");
                            getLandingBulkAssignEmpListHandler(
                              values,
                              { current: 1, pageSize: paginationSize },
                              ""
                            );
                          }}
                          handleClick={() => {
                            setFieldValue("searchString", "");
                            getLandingBulkAssignEmpListHandler(
                              values,
                              { current: 1, pageSize: paginationSize },
                              ""
                            );
                          }}
                        />
                      </div>
                    </div>
                    {bulkAssignEmpList?.length > 0 ? (
                      <DataTable
                        bordered
                        data={bulkAssignEmpList || []}
                        loading={loadingBulkAssign}
                        header={bulkAssignEmpListTableColumn(pages)}
                        pagination={{
                          current: pages?.current,
                          pageSize: pages?.pageSize,
                          total: pages?.total,
                        }}
                        onChange={(pagination, filters, sorter, extra) => {
                          // Return if sort function is called
                          if (extra.action === "sort") return;
                          if (extra.action === "filter") return;
                          getLandingBulkAssignEmpListHandler(
                            values,
                            pagination,
                            values?.searchString
                          );
                        }}
                        rowSelection={{
                          type: "checkbox",
                          selectedRowKeys: selectedRow.map((item) => item?.key),
                          onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRow(selectedRows);
                          },
                          getCheckboxProps: () => {
                            // console.log({ rec });
                            // return {
                            //   disabled: rec?.ApplicationStatus === "Approved",
                            // };
                          },
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default BulkAddEditForm;
