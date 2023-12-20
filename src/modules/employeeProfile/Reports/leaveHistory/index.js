import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { getWorkplaceDetails } from "common/api";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormikSelect from "../../../../common/FormikSelect";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { getPDFAction } from "../../../../utility/downloadFile";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { yearDDLAction } from "../../../../utility/yearDDL";
import { currentYear } from "../../../CompensationBenefits/reports/salaryReport/helper";
import { generateExcelAction } from "./excel/excelConvert";
import { getLeaveHistoryAction, hasLeave, leaveHistoryCol } from "./helper";
const initData = {
  search: "",
  yearDDL: { label: currentYear(), value: currentYear() },
};

const EmLeaveHistory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { buId, buName, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);

  const [rowDto, setRowDto] = useState([]);
  const [buDetails, setBuDetails] = useState({});
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const [, getExcelData, apiLoading] = useAxiosGet();
  const debounce = useDebounce();

  const getData = (
    year = currentYear(),
    pagination = { current: 1, pageSize: paginationSize },
    srcTxt = "",
    isPaginated = true
  ) => {
    getLeaveHistoryAction(
      wId,
      buId,
      wgId,
      year,
      setLoading,
      setRowDto,
      srcTxt,
      isPaginated,
      pagination?.current,
      pagination?.pageSize,
      setPages
    );
  };

  useEffect(() => {
    getData();
    getWorkplaceDetails(wId, setBuDetails, setLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 100) {
      permission = item;
    }
  });

  const handleChangePage = (_, newPage, searchText, year) => {
    console.log(newPage, searchText);
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      year,
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      searchText
    );
  };

  const handleChangeRowsPerPage = (event, searchText, year) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      year,
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      searchText
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {(loading || apiLoading) && <Loading />}
              {permission?.isView ? (
                <div>
                  <div className="table-card">
                    <div className="table-card-heading justify-content-between">
                      <div className="d-flex">
                        <Tooltip title="Export CSV" arrow>
                          <button
                            disabled={rowDto?.length <= 0}
                            type="button"
                            className="btn-save"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (rowDto?.length <= 0) {
                                return toast.warning("Data is empty !!!!", {
                                  toastId: 1,
                                });
                              }

                              getExcelData(
                                `/Employee/LeaveBalanceHistoryForAllEmployee?BusinessUnitId=${buId}&yearId=${values.yearDDL?.value}&WorkplaceGroupId=${wgId}&WorkplaceId=${wId}&SearchText=${values?.search}&IsPaginated=false&PageNo=0&PageSize=0`,
                                (res) => {
                                  const excelLanding = () => {
                                    generateExcelAction(
                                      "Leave History Report",
                                      buDetails?.strWorkplace,
                                      res?.data,
                                      buDetails?.strAddress
                                    );
                                  };
                                  excelLanding();
                                }
                              );
                            }}
                          >
                            <SaveAlt
                              sx={{ color: "#637381", fontSize: "16px" }}
                            />
                          </button>
                        </Tooltip>
                        <div className="ml-2">
                          {pages?.total > 0 ? (
                            <>
                              <h6 className="count">
                                Total {pages?.total} results
                              </h6>
                            </>
                          ) : (
                            <>
                              <h6 className="count">Total result 0</h6>
                            </>
                          )}
                        </div>
                      </div>
                      <div></div>
                      <div className="table-card-head-right">
                        <ul>
                          {values?.search && (
                            <li>
                              <ResetButton
                                classes="btn-filter-reset"
                                title="reset"
                                icon={
                                  <SettingsBackupRestoreOutlined
                                    sx={{
                                      marginRight: "10px",
                                      fontSize: "16px",
                                    }}
                                  />
                                }
                                onClick={() => {
                                  getData();
                                  resetForm();
                                }}
                              />
                            </li>
                          )}
                          <li style={{ width: "200px" }}>
                            <FormikSelect
                              name="yearDDL"
                              options={yearDDLAction(2, 0) || []}
                              value={values?.yearDDL}
                              onChange={(valueOption) => {
                                setFieldValue("yearDDL", valueOption);
                                getData(valueOption?.value);
                              }}
                              placeholder=""
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                              isDisabled={false}
                              isClearable={false}
                            />
                          </li>
                          <li>
                            <MasterFilter
                              width="200px"
                              inputWidth="200px"
                              value={values?.search}
                              setValue={(value) => {
                                setFieldValue("search", value);
                                debounce(() => {
                                  getData(
                                    values?.yearDDL?.value,
                                    { current: 1, pageSize: paginationSize },
                                    value
                                  );
                                }, 500);
                              }}
                              cancelHandler={() => {
                                getData();
                                setFieldValue("search", "");
                              }}
                              isHiddenFilter
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-card-body">
                      {/*  <TableScrollable
                        setLoading={setLoading}
                        rowDto={rowDto}
                      /> */}
                      {rowDto?.data?.length > 0 ? (
                        <PeopleDeskTable
                          columnData={leaveHistoryCol(
                            pages?.current,
                            pages?.pageSize
                          )}
                          pages={pages}
                          rowDto={rowDto?.data}
                          setRowDto={setRowDto}
                          handleChangePage={(e, newPage) =>
                            handleChangePage(
                              e,
                              newPage,
                              values?.search,
                              values?.yearDDL?.value
                            )
                          }
                          handleChangeRowsPerPage={(e) =>
                            handleChangeRowsPerPage(
                              e,
                              values?.search,
                              values?.yearDDL?.value
                            )
                          }
                          onRowClick={(data) => {
                            hasLeave(data) &&
                              getPDFAction(
                                `/PdfAndExcelReport/LeaveHistoryReport?EmployeeId=${data?.employeeId}&fromDate=${values?.yearDDL?.value}-01-01&toDate=${values?.yearDDL?.value}-12-31`,
                                setLoading
                              );
                          }}
                          uniqueKey="employeeId"
                          isCheckBox={false}
                          isScrollAble={false}
                        />
                      ) : (
                        !loading && <NoResult title="No Result Found" para="" />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
            {/* <FilterModal
              propsObj={{
                id,
                open,
                anchorEl,
                setAnchorEl,
                handleClose,
                setFieldValue,
                values,
                errors,
                touched,
                setIsFilter,
              }}
              getData={getData}
              masterFilterHandler={masterFilterHandler}
            /> */}
          </>
        )}
      </Formik>
    </>
  );
};

export default EmLeaveHistory;
