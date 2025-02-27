import { AddOutlined, SaveAlt } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import AntTable from "../../../../common/AntTable";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import PrimaryButton from "../../../../common/PrimaryButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray900 } from "../../../../utility/customColor";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import {
  excelHeaderForKpi,
  excelTableHeaderForKpi,
  excelTableRowForKpi,
  getKPIsLanding,
  kpisLandingColumn,
} from "./helper";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { generateCommonExcelAction } from "../../../../common/Excel/excelConvert";
import AntScrollTable from "../../../../common/AntScrollTable";
import FormikSelect from "common/FormikSelect";
import { getPeopleDeskAllDDL } from "common/api";
import { customStyles } from "utility/selectCustomStyle";

const initData = {
  search: "",
  objectiveType: "",
  objective: "",
  status: "",
};

const Kpis = () => {
  const [, getExcelData, excelDataLoader] = useAxiosGet();
  const { orgId, buId, buName, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [objectiveTypeDDL, setObjectiveTypeDDL] = useState([]);
  const [objectiveDDL, setObjectiveDDL] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // permission

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const permission = useMemo(
    () => permissionList?.find((item) => item?.menuReferenceId === 30461),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.strPmtype?.toLowerCase()) ||
          regex.test(item?.strObjective?.toLowerCase()) ||
          regex.test(item?.strKpis?.toLowerCase()) ||
          regex.test(item?.strAggregationType?.toLowerCase()) ||
          regex.test(item?.kpiformat?.toLowerCase()) ||
          regex.test(item?.strMinMax?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  const history = useHistory();
  const debounce = useDebounce();

  // states
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  // const [page, setPage] = useState(1);
  // const [paginationSize, setPaginationSize] = useState(15);
  const [allData, setAllData] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 30,
    total: 0,
  });

  const {
    values,
    setFieldValue,
    handleSubmit,
    errors,
    touched,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: initData,
    onSubmit: (formValues) => {
      getData(formValues);
    },
  });

  const getData = (formValues) => {
    getKPIsLanding(
      buId,
      orgId,
      setAllData,
      setRowDto,
      setLoading,
      pages,
      setPages,
      formValues
    );
  };

  const handleTableChange = ({ pagination }) => {
    setPages((prev) => ({ ...prev, ...pagination }));
    if (
      (pages?.current === pagination?.current &&
        pages?.pageSize !== pagination?.pageSize) ||
      pages?.current !== pagination?.current
    ) {
      console.log("pagination", pagination);
      return getKPIsLanding(
        buId,
        orgId,
        setAllData,
        setRowDto,
        setLoading,
        pagination,
        setPages
      );
    }
  };

  useEffect(() => {
    getData();
    getPeopleDeskAllDDL(
      `/PMS/ObjectiveTypeDDL?PMTypeId=1`,
      "value",
      "label",
      setObjectiveTypeDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  return (
    <>
      {(loading || excelDataLoader) && <Loading />}
      {permission?.isView ? (
        <form>
          <div className="table-card">
            <div className="table-card-heading heading pt-0">
              <div className="d-flex justify-content-between align-items-center">
                <Tooltip title="Export CSV" arrow>
                  <button
                    type="button"
                    className="btn-save"
                    onClick={(e) => {
                      e.stopPropagation();
                      getExcelData(
                        `/PMS/GetKPISPagination?AccountId=${orgId}&BusinessUnitId=${buId}&pageNo=1&pageSize=${pages?.total}`,
                        (resExcelData) => {
                          try {
                            generateCommonExcelAction({
                              title: "KPI List",
                              getHeader: () => {
                                return excelHeaderForKpi({
                                  businessUnit: buName,
                                  title: `KPI List`,
                                });
                              },
                              getTableHeader: () => {
                                return excelTableHeaderForKpi();
                              },
                              getTableRow: () => {
                                return excelTableRowForKpi({
                                  rowData: resExcelData?.data,
                                });
                              },
                            });
                          } catch (err) {
                            console.log(err);
                          }
                        }
                      );
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
                  {rowDto?.length > 0 ? (
                    <>
                      <h6 className="count">Total {pages?.total} Kpis</h6>
                    </>
                  ) : (
                    <>
                      <h6 className="count">Total result 0</h6>
                    </>
                  )}
                </div>
              </div>
              <div className="table-card-head-right pt-2">
                <ul className="d-flex flex-column flex-md-row">
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
                        debounce(() => {
                          searchData(value, allData, setRowDto);
                        }, 500);
                        setFieldValue("search", value);
                      }}
                      cancelHandler={() => {
                        getData();
                        setFieldValue("search", "");
                      }}
                    />
                  </li>
                  <li>
                    <PrimaryButton
                      type="button"
                      className="btn btn-default flex-center"
                      label={"New KPI"}
                      icon={
                        <AddOutlined
                          sx={{
                            marginRight: "0px",
                            fontSize: "15px",
                          }}
                        />
                      }
                      onClick={() => {
                        if (!permission?.isCreate)
                          return toast.warn("You don't have permission");
                        history.push(`/pms/configuration/kpis/create`);
                      }}
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <div className="input-field-main">
                  <label>Objective Type</label>
                  <FormikSelect
                    name="objectiveType"
                    placeholder=""
                    options={objectiveTypeDDL || []}
                    value={values?.objectiveType}
                    onChange={(valueOption) => {
                      setFieldValue("objectiveType", valueOption);
                      getPeopleDeskAllDDL(
                        `/PMS/ObjectiveDDL?PMTypeId=1&ObjectiveTypeId=${
                          valueOption?.value || 0
                        }`,
                        "value",
                        "label",
                        setObjectiveDDL
                      );
                    }}
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="input-field-main">
                  <label>Objective</label>
                  <FormikSelect
                    name="objective"
                    placeholder=""
                    options={objectiveDDL || []}
                    value={values?.objective}
                    onChange={(valueOption) => {
                      setFieldValue("objective", valueOption);
                    }}
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="input-field-main col-md-3">
                <label>Status</label>
                <FormikSelect
                  classes="input-sm  form-control"
                  name="status"
                  options={
                    [
                      { label: "All", value: null },
                      { label: "Active", value: true },
                      { label: "Inactive", value: false },
                    ] || []
                  }
                  value={values?.status}
                  onChange={(valueOption) => {
                    setFieldValue("status", valueOption);
                  }}
                  styles={customStyles}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-md-3 mt-4">
                <PrimaryButton
                  onClick={() => handleSubmit()}
                  type="button"
                  className="btn btn-green flex-center"
                  label="View"
                />
              </div>
            </div>
            <div>
              {rowDto?.length > 0 ? (
                <div className="table-card-styled employee-table-card tableOne table-responsive mt-4">
                  <AntScrollTable
                    data={rowDto?.length > 0 ? rowDto : []}
                    columnsData={kpisLandingColumn(
                      pages?.current,
                      pages?.pageSize,
                      history,
                      orgId,
                      employeeId,
                      setLoading,
                      getData
                    )}
                    pages={pages?.pageSize}
                    pagination={pages}
                    handleTableChange={handleTableChange}
                  />
                </div>
              ) : (
                <NoResult />
              )}
            </div>
          </div>
        </form>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default Kpis;
