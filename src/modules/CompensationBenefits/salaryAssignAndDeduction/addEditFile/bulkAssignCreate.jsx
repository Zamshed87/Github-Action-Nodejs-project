import RefreshIcon from "@mui/icons-material/Refresh";
import AntTable, { paginationSize } from "common/AntTable";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useDebounce from "utility/customHooks/useDebounce";
import { months } from "moment";
import { empListColumn, validationSchema, validationSchema2 } from "./helper";
import Loading from "common/loading/Loading";
import BackButton from "common/BackButton";
import PrimaryButton from "common/PrimaryButton";
import { downloadFile } from "utility/downloadFile";
import { gray600 } from "utility/customColor";
import ResetButton from "common/ResetButton";
import MasterFilter from "common/MasterFilter";
import NoResult from "common/NoResult";
import PeopleDeskTable from "common/peopleDeskTable";
import ViewModal from "common/ViewModal";
import { createEditAllowanceAndDeduction } from "../helper";
import { processDataFromExcelInAllowanceNDeduction, saveBulkUploadAction, initData, bulkLandingTbCol } from "./helperNew";
import ExistsBulkModal from "./ExistsBulkModal";
import { getEmployeeProfileLanding } from "modules/employeeProfile/employeeFeature/helper";

function bulkAssignCreate() {
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
  const [Bulkpages, setBulkPages] = useState({
    current: 1,
    pageSize: 500,
  });

  // States
  const debounce = useDebounce();
  const [loading, setLoading] = useState(false);
  const [headerList, setHeaderList] = useState({});

  const [resEmpLanding, setEmpLanding] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [cleanData, setCleanData] = useState([]);

  const [loadingBulk, setIsLoadingBulk] = useState(false);
  const [isBulkAssign, setIsBulkAssign] = useState(false);
  const [bulkLandingRowDto, setBulkLanding] = useState([]);
  const [assignedBulkEmp, setAssignedBulkEmp] = useState([]);
  const [showExistModal, setShowExistModal] = useState(false);

  console.log("bulkLandingRowDto",bulkLandingRowDto)
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
      searchText
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
      searchText
    );
  };

  const getData = (pagination = pages, srcText = "") => {
    getEmployeeProfileLanding(
      orgId,
      buId,
      employeeId,
      pagination.current,
      pagination.pageSize,
      setRowDto,
      setLoading,
      srcText,
      setAllData,
      setPages
    );
  };
  // const geteData = async () => {
  //   allEmployeeList({ orgId, buId }, {}, setLoading, setRowDto, setAllData);
  // };
  useEffect(() => {
    setCleanData(rowDto?.data);
  }, [rowDto]);

  const saveHandler = (values, cb) => {
    if (!values?.isAutoRenew && !values?.toMonth) {
      return toast.warn("To data must be selected");
    }

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
        strDuration: values?.strDuration || "",
        maxAmount: +values?.maxAmount || 0,
        attendenceStatus: values?.attendenceStatus || "",
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
    getData();
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
            getData();
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
              {loadingBulk && <Loading />}
              <div className="employee-profile-main">
                <div className="table-card w-100">
                  <div className="table-card-heading">
                    <div className="d-flex justify-content-center align-items-center">
                      <BackButton title={"Create Bulk Allowance & Deduction"} />
                    </div>
                    {!isView && (
                      <ul className="d-flex flex-wrap">
                        <li>
                          <PrimaryButton
                            className="btn btn-default mr-1"
                            label="Download Demo"
                            onClick={() => {
                              downloadFile(
                                `${
                                  process.env.NODE_ENV === "development"
                                    ? "/document/downloadfile?id=154"
                                    : "/document/downloadfile?id=155"
                                }`,
                                "BulkAddition and Deduction",
                                "xlsx",
                                setIsLoadingBulk
                              );
                            }}
                            type="button"
                          />
                        </li>
                        <li>
                          <input
                            type="file"
                            accept=".xlsx"
                            onChange={(e) => {
                              setEmpLanding([]);
                              setCheckedList([]);
                              !!e.target.files?.[0] && setIsLoadingBulk(true);
                              processDataFromExcelInAllowanceNDeduction(
                                e.target.files?.[0],
                                setIsBulkAssign,
                                setBulkLanding,
                                employeeId,
                                orgId,
                                buId,
                                wgId,
                                setIsLoadingBulk
                              );
                            }}
                            onClick={(e) => {
                              e.target.value = null;
                            }}
                          />
                        </li>
                        <li>
                          {isBulkAssign ? (
                            <button
                              type="button"
                              className="btn btn-green btn-green-disable"
                              disabled={!bulkLandingRowDto?.length > 0}
                              style={{ width: "auto" }}
                              onClick={() =>
                                saveBulkUploadAction(
                                  bulkLandingRowDto,
                                  setIsLoadingBulk,
                                  setShowExistModal,
                                  setAssignedBulkEmp,
                                  false,
                                  false
                                )
                              }
                            >
                              Save Bulk
                            </button>
                          ) : (
                            <button
                              type="submit"
                              className="btn btn-green btn-green-disable"
                              disabled={checkedList?.length === 0}
                              style={{ width: "auto" }}
                              onClick={() => {}}
                            >
                              Save
                            </button>
                          )}
                        </li>
                      </ul>
                    )}
                  </div>

                  {/* <div
                    className="pt-1"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {isCreate && !isBulkAssign && (
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
                  </div> */}
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
                                getData();
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
                                  values?.searchString
                                );
                              }, 500);
                            }}
                            cancelHandler={(e) => {
                              setFieldValue("searchString", "");
                              getData(
                                { current: 1, pageSize: paginationSize },
                                ""
                              );
                            }}
                            handleClick={(e) => {
                              setFieldValue("searchString", "");
                              getData(
                                { current: 1, pageSize: paginationSize },
                                ""
                              );
                            }}
                          />
                        </div>
                      
                    </div>
                    {isBulkAssign ? (
                      bulkLandingRowDto?.length > 0 ? (
                        <div className="table-card-body">
                          <div className="table-card-styled employee-table-card tableOne  table-responsive mt-3">
                            <AntTable
                              data={bulkLandingRowDto}
                              columnsData={bulkLandingTbCol(
                                pages?.current,
                                pages?.pageSize,
                                setBulkLanding,
                                bulkLandingRowDto
                              )}
                              pages={Bulkpages?.pageSize}
                              rowKey={(record, index) => record?.employeeCode}
                              // pagination={Bulkpages}
                            />
                          </div>
                        </div>
                      ) : (
                        <NoResult />
                      )
                    ) : cleanData?.length > 0 ? (
                      <PeopleDeskTable
                        columnData={empListColumn(
                          pages?.current,
                          pages?.pageSize,
                          headerList
                        )}
                        handleChangePage={(e, newPage) =>
                          handleChangePage(e, newPage, values?.searchString)
                        }
                        handleChangeRowsPerPage={(e) =>
                          handleChangeRowsPerPage(e, values?.searchString)
                        }
                        pages={pages}
                        rowDto={cleanData}
                        setRowDto={setCleanData}
                        checkedList={checkedList}
                        setCheckedList={setCheckedList}
                        uniqueKey="strEmployeeCode"
                        isCheckBox={true}
                        isScrollAble={false}
                      />
                    ) : (
                      <NoResult />
                    )}
                  </div>
                </div>
              </div>
              <div>
                <ViewModal
                  show={showExistModal}
                  title={
                    "Some Employee allowances and deductions have already assigned"
                  }
                  onHide={() => {
                    setShowExistModal(false);
                    setAssignedBulkEmp([]);
                    setIsBulkAssign(false);
                    getData();
                  }}
                  size="lg"
                  backdrop={"static"}
                >
                  <ExistsBulkModal
                    assignedBulkEmp={assignedBulkEmp}
                    setIsLoadingBulk={setIsLoadingBulk}
                    bulkLandingRowDto={bulkLandingRowDto}
                    setShowExistModal={setShowExistModal}
                    setAssignedBulkEmp={setAssignedBulkEmp}
                    setIsBulkAssign={setIsBulkAssign}
                  />
                </ViewModal>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default bulkAssignCreate;
