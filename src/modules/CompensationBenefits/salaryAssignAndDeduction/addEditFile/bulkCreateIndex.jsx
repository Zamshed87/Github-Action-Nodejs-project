import RefreshIcon from "@mui/icons-material/Refresh";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import BackButton from "../../../../common/BackButton";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import { gray600 } from "../../../../utility/customColor";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { createEditAllowanceAndDeduction } from "../helper";
import {
  empListColumn,
  initData,
  validationSchema,
  validationSchema2,
} from "./helper";
import HeaderTableForm from "./headerTableForm";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import axios from "axios";
import {
  createPayloadStructure,
  setHeaderListDataDynamically,
} from "../../../../common/peopleDeskTable/helper";

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

function BulkAddEditForm() {
  const location = useLocation();
  const scrollRef = useRef();
  const { isCreate, isView } = location?.state?.state;

  //redux data
  const { orgId, buId, employeeId, wgId } = useSelector(
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

  const saveHandler = (values, cb) => {
    if (!values?.isAutoRenew && !values?.toMonth) {
      return toast.warn("To data must be selected");
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

    let modifyEmployeeIdListId = [];
    checkedList.map(
      (item) =>
        item?.isSelected &&
        modifyEmployeeIdListId?.push({
          intEmployeeId: item?.intEmployeeBasicInfoId,
        })
    );

    if (!checkedList?.some((itm) => itm.isSelected === true)) {
      return toast.warn("Please select at least one employee");
    }

    const payload = [
      {
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
        employeeIdList: modifyEmployeeIdListId,
      },
    ];
    createEditAllowanceAndDeduction(payload, setLoading, cb);
  };

  useEffect(() => {
    setHeaderList({});
    setEmpLanding([]);
    getData(pages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
        }}
        validationSchema={
          resEmpLanding.filter((itm) => itm.isSelected === true)?.length
            ? validationSchema2
            : validationSchema
        }
        onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
          saveHandler(values, () => {
            resetForm();
            getData(
              { current: 1, pageSize: paginationSize },
              "",
              [],
              -1,
              filterOrderList,
              checkedHeaderList
            );
            setCheckedList([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
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
                            className="btn btn-green btn-green-disable"
                            disabled={checkedList?.length === 0}
                            style={{ width: "auto" }}
                            onClick={() => {}}
                          >
                            Save
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>

                  <div
                    className="pt-1"
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
                          setLoading={setLoading}
                          setAllowanceAndDeductionDDL={
                            setAllowanceAndDeductionDDL
                          }
                          allowanceAndDeductionDDL={allowanceAndDeductionDDL}
                        />
                      </>
                    )}
                  </div>
                  {loading && <Loading />}
                  <div className="table-card-styled pt-2 pb-3" ref={scrollRef}>
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
