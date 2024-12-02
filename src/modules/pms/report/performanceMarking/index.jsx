import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AntTable from "../../../../common/AntTable";
import FormikSelect from "../../../../common/FormikSelect";
import PrimaryButton from "../../../../common/PrimaryButton";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import Loading from "../../../../common/loading/Loading";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { getFiscalYearForNowOnLoad } from "../../../../utility/getFiscalYearOnLoade";
import { quarterDDL } from "../../../../utility/quaterDDL";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { useHistory } from "react-router";
import { setPerformanceMarkingInitialValuesAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import AntScrollTable from "../../../../common/AntScrollTable";

const PerformanceMarking = () => {
  // 30479
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const { performanceMarkingInitialValues } = useSelector(
    (state) => state?.localStorage || {},
    shallowEqual
  );

  const dispatch = useDispatch();

  const {
    // permissionList,
    businessUnitDDL: permittedBusinessUnitDDL,
    profileData: { orgId, buId, employeeId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [reportData, getReportData, reportDataLoader, setReportData] =
    useAxiosGet();
  const history = useHistory();

  const [departmentDDL, setDepartmentDDL] = useState([]);

  useEffect(() => {
    const modifiedBusinessUnitDDL = permittedBusinessUnitDDL?.map((item) => ({
      ...item,
      label: item?.BusinessUnitName,
      value: item?.BusinessUnitId,
    }));
    setBusinessUnitDDL(modifiedBusinessUnitDDL);

    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&AccountId=${orgId}&BusinessUnitId=${buId}&intId=${employeeId}`,
      "DepartmentId",
      "DepartmentName",
      (departmentData) => {
        setDepartmentDDL([{ label: "All", value: 0 }, ...departmentData]);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, employeeId]);

  const { setFieldValue, values } = useFormik({
    enableReinitialize: true,
    initialValues: performanceMarkingInitialValues,
  });

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      dispatch(
        setPerformanceMarkingInitialValuesAction({
          ...values,
          year: theYearData,
        })
      );
      setFieldValue("year", theYearData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  useEffect(() => {
    if (values?.evaluationCriteria) {
      getTableData(performanceMarkingInitialValues, pages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [performanceMarkingInitialValues]);

  const getTableData = (values, pages) => {
    const url =
      values?.evaluationCriteria?.label === "BSC"
        ? `/PMS/GetKpiChartReportLanding?partName=BscReportLanding&employeeId=0&accountId=${orgId}&businessUnit=${buId}&deptId=${
            values?.department?.value || 0
          }&yearId=${values?.year?.value || 0}&quarterId=${
            values?.quarter?.value
          }&pageNo=${pages?.current}&pageSize=${pages?.pageSize}`
        : `/PMS/GetKpiChartReportLanding?partName=ThreeSixtyReportLanding&employeeId=0&accountId=${orgId}&businessUnit=${buId}&deptId=0&yearId=${
            values?.year?.value || 0
          }&quarterId=${values?.quarter?.value}&pageNo=${
            pages?.current
          }&pageSize=${pages?.pageSize}`;

    getReportData(url, (data) => {
      if (data) {
        setPages((prev) => ({
          ...prev,
          total: data?.totalCount,
        }));
      }
      return data;
    });
  };

  const handleTableChange = ({ pagination }) => {
    setPages((prev) => ({ ...prev, ...pagination }));
    if (
      (pages?.current === pagination?.current &&
        pages?.pageSize !== pagination?.pageSize) ||
      pages?.current !== pagination?.current
    ) {
      return getTableData(values, pagination);
    }
  };

  const performanceMarkingColumn = ({ values }) => {
    const columns = [
      {
        title: "Enroll",
        dataIndex: "employeeId",
      },
      {
        title: "Employee",
        dataIndex: "employeeName",
      },
      {
        title: "Des",
        dataIndex: "designation",
      },
      {
        title: "Section",
        dataIndex: "section",
      },
      {
        title: "Grade",
        dataIndex: "grade",
      },
      {
        title: "",
        dataIndex: "action",
        // width: "150px",
        className: "text-center",
        render: (_, record) =>
          values?.evaluationCriteria?.label === "BSC" ? (
            <div className="d-flex align-items-center">
              <Tooltip title="View" arrow>
                <button
                  type="button"
                  className="iconButton"
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push({
                      pathname: `/pms/report/PerformanceMarking/view`,
                      state: record,
                    });
                  }}
                >
                  <RemoveRedEyeOutlinedIcon sx={{ fontSize: "20px" }} />
                </button>
              </Tooltip>
            </div>
          ) : null,
      },
    ];

    const bscColumns = [
      {
        title: "Values",
        dataIndex: "numValues",
      },
      {
        title: "Competency",
        dataIndex: "numCompetency",
      },
      {
        title: "KPI",
        dataIndex: "numKpi",
      },
      {
        title: "Total",
        dataIndex: "bscTotal",
      },
    ];

    const threeSixtyColumns = [
      {
        title: "Self",
        dataIndex: "numSelf",
      },
      {
        title: "Supervisor",
        dataIndex: "numSupervisor",
      },
      {
        title: "Colleague",
        dataIndex: "numColleague",
      },
      {
        title: "Avg",
        dataIndex: "threeSixtyAvg",
      },
    ];

    let additionalColumns = [];

    if (values?.evaluationCriteria?.label === "BSC") {
      additionalColumns = bscColumns;
    } else if (values?.evaluationCriteria?.label === "360") {
      additionalColumns = threeSixtyColumns;
    }

    // Find index of "Section" column
    const sectionIndex = columns.findIndex(
      (column) => column.title === "Section"
    );

    // Insert additional columns after "Section" column
    const updatedColumns = [
      ...columns.slice(0, sectionIndex + 1),
      ...additionalColumns,
      ...columns.slice(sectionIndex + 1),
    ];

    return updatedColumns;
  };

  return (
    <div className="table-card">
      {(fiscalYearDDLloader || reportDataLoader) && <Loading />}
      <div className="table-card-heading">
        <div className="d-flex align-items-center my-1">
          <h2>Performance Marking Report</h2>
        </div>
      </div>
      <div className="card-style with-form-card pb-0 mb-3 ">
        <div className="row">
          <div className="col-lg-3">
            <label>Year</label>
            <FormikSelect
              classes="input-sm form-control"
              name="year"
              options={fiscalYearDDL || []}
              value={values?.year}
              onChange={(valueOption) => {
                setFieldValue("year", valueOption);
                setReportData([]);
              }}
              styles={customStyles}
            />
          </div>
          <div className="col-lg-3">
            <label>Quarter</label>
            <FormikSelect
              classes="input-sm form-control"
              name="quarter"
              options={quarterDDL || []}
              value={values?.quarter}
              onChange={(valueOption) => {
                setFieldValue("quarter", valueOption);
                setReportData([]);
              }}
              styles={customStyles}
            />
          </div>
          <div className="col-lg-3">
            <label>Department</label>
            <FormikSelect
              name="department"
              options={departmentDDL || []}
              value={values?.department}
              onChange={(valueOption) => {
                if (valueOption) {
                  setFieldValue("department", valueOption);
                  setReportData([]);
                } else {
                  setFieldValue("department", valueOption);
                  setReportData([]);
                }
              }}
              styles={customStyles}
            />
          </div>
          <div className="col-lg-3">
            <label>Evaluation Criteria</label>
            <FormikSelect
              classes="input-sm form-control"
              name="evaluationCriteria"
              options={[
                { value: "BSC", label: "BSC" },
                { value: "360", label: "360" },
              ]}
              value={values?.evaluationCriteria}
              onChange={(valueOption) => {
                setFieldValue("evaluationCriteria", valueOption);
                setReportData([]);
              }}
              styles={customStyles}
            />
          </div>

          <div className="col-lg-3">
            <PrimaryButton
              customStyle={{ marginBottom: "10px" }}
              type="button"
              className="btn btn-default flex-center"
              label={"View"}
              onClick={() => {
                dispatch(
                  setPerformanceMarkingInitialValuesAction({
                    ...values,
                  })
                );
              }}
              disabled={false}
            />
          </div>
        </div>
      </div>
      <div className="table-card-body" style={{ marginTop: "40px" }}>
        <div className="table-card-styled table-responsive tableOne">
          <AntScrollTable
            data={reportData}
            columnsData={performanceMarkingColumn({ values })}
            rowKey={(record) => record?.id}
            pages={pages?.pageSize}
            pagination={pages}
            handleTableChange={handleTableChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PerformanceMarking;
