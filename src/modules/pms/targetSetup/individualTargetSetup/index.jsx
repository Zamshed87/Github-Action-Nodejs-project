import React from "react";
import Loading from "../../../../common/loading/Loading";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { useFormik } from "formik";
import FormikSelect from "../../../../common/FormikSelect";
import { useHistory } from "react-router-dom";
import {
  getAsyncEmployeeCommonApi,
  getFiscalYearForNowOnLoad,
  individualtargetSetupTableColumn,
} from "./helper";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { useEffect } from "react";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import AntTable from "../../../../common/AntTable";
// import BtnActionMenu from "../../../../common/BtnActionMenu";
// import { AddOutlined } from "@mui/icons-material";
import { useState } from "react";
import AntScrollTable from "../../../../common/AntScrollTable";
import { getAsyncEmployeeApi } from "../../../../common/api";
const initData = {
  employee: "",
  year: "",
  targetType: {
    value: 1,
    label: "Target Assigned",
  },
};
const IndividualTargetSetup = () => {
  // 30471
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const dispatch = useDispatch();
  const [pmTypeDDL, getPMTypeDDL] = useAxiosGet();
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [tableData, getTableData, tableDataLoader, setTableData] =
    useAxiosGet();
  const history = useHistory();
  const { values, setFieldValue } = useFormik({
    initialValues: initData,
  });

  const {
    profileData: { orgId, buId, intAccountId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const getData = (values, pages) => {
    // kpiForId = 1 => Employee
    // kpiForId = 2 => Department
    // kpiForId = 3 => Sbu
    getTableData(
      `/PMS/GetAllTypeTargetSetupLanding?kpiForId=1&kpiForReffId=${
        values?.employee?.value || 0
      }&businessUnitId=${
        values?.employee?.value
          ? values?.employee?.intBusinessUnitId || buId
          : buId
      }&yearId=${values?.year?.value}&isTargetAssigned=${
        values?.targetType?.value === 1 ? true : false
      }&pageNo=${pages?.current}&pageSize=${
        pages?.pageSize
      }&accountId=${intAccountId}&from=1&to=12`,
      (data) => {
        if (data) {
          setPages((prev) => ({
            ...prev,
            total: data?.totalCount,
          }));
        }
        return data;
      }
    );
  };

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      initData.year = theYearData;
      setFieldValue("year", theYearData);
      // call landing data api
      getData(values, pages);
    });
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const handleTableChange = ({ pagination }) => {
    setPages((prev) => ({ ...prev, ...pagination }));
    if (
      (pages?.current === pagination?.current &&
        pages?.pageSize !== pagination?.pageSize) ||
      pages?.current !== pagination?.current
    ) {
      return getData(values, pagination);
    }
  };
  useEffect(() => {
    getPMTypeDDL("/PMS/PMTypeDDL");
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {(fiscalYearDDLloader || tableDataLoader) && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div>
            <h2 style={{ color: "#344054" }}>Individual Target Setup</h2>
          </div>
          <ul className="d-flex flex-wrap">
            <li>
              {/* <BtnActionMenu
                className="btn btn-default flex-center btn-deafult-create-job"
                icon={
                  <AddOutlined
                    sx={{
                      marginRight: "0px",
                      fontSize: "15px",
                    }}
                  />
                }
                label="Bulk Target Setup"
                options={[
                  {
                    value: 2,
                    label: "Department Wise",

                    onClick: () => {
                      history.push({
                        pathname: "/pms/targetsetup/EmployeeTarget/create",
                        state: { isCreate: true, type: "Department Wise" },
                      });
                    },
                  },
                  {
                    value: 3,
                    label: "Designation Wise",
                    onClick: () => {
                      history.push({
                        pathname: "/pms/targetsetup/EmployeeTarget/create",
                        state: { isCreate: true, type: "Designation Wise" },
                      });
                    },
                  },
                ]}
              /> */}
            </li>
          </ul>
        </div>
        <div className="card-style pb-0 mb-2">
          <div className="row">
            <div className="col-lg-3">
              <label>PM Type</label>
              <FormikSelect
                classes="input-sm form-control"
                name="pmType"
                options={pmTypeDDL?.filter((i) => i?.value !== 2) || []}
                value={values?.pmType}
                onChange={(valueOption) => {
                  setFieldValue("pmType", valueOption);
                }}
                styles={customStyles}
              />
            </div>

            <div className="col-lg-3">
              <div className="input-field-main">
                <label>Employee</label>
                <AsyncFormikSelect
                  isClear={true}
                  selectedValue={values?.employee}
                  styles={{
                    control: (provided) => ({
                      ...customStyles?.control(provided),
                      width: "100%",
                    }),
                  }}
                  isSearchIcon={true}
                  handleChange={(valueOption) => {
                    setFieldValue("employee", valueOption);
                    setTableData([]);
                  }}
                  loadOptions={async (value) => {
                    return getAsyncEmployeeApi({
                      orgId,
                      buId: buId,
                      intId: 0,
                      value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-lg-3">
              <label>Year</label>
              <FormikSelect
                classes="input-sm form-control"
                name="year"
                placeholder="Select Year"
                options={fiscalYearDDL || []}
                value={values?.year}
                onChange={(valueOption) => {
                  setFieldValue("year", valueOption);
                  setTableData([]);
                }}
                styles={customStyles}
              />
            </div>
            <div className="col-lg-3">
              <label>Type</label>
              <FormikSelect
                classes="input-sm form-control"
                name="targetType"
                options={[
                  {
                    value: 1,
                    label: "Target Assigned",
                  },
                  {
                    value: 2,
                    label: "Target Not Assigned",
                  },
                ]}
                value={values?.targetType}
                onChange={(valueOption) => {
                  setFieldValue("targetType", valueOption);
                  setTableData([]);
                }}
                styles={customStyles}
              />
            </div>
            <div className="col-lg-3">
              <button
                type="button"
                className="btn btn-green mr-2"
                style={{ marginTop: "10px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  getTableData(
                    `/PMS/GetAllTypeTargetSetupLanding?kpiForId=1&kpiForReffId=${
                      values?.employee?.value || 0
                    }&businessUnitId=${
                      values?.employee?.value
                        ? values?.employee?.intBusinessUnitId || buId
                        : buId
                    }&yearId=${values?.year?.value}&isTargetAssigned=${
                      values?.targetType?.value === 1 ? true : false
                    }&pageNo=${pages?.current}&pageSize=${
                      pages?.pageSize
                    }&accountId=${intAccountId}&from=1&to=12&pmTypeId=${
                      values?.pmType?.value
                    }`,
                    (data) => {
                      if (data) {
                        setPages((prev) => ({
                          ...prev,
                          total: data?.totalCount,
                        }));
                      }
                      return data;
                    }
                  );
                }}
                disabled={
                  !values?.year || !values?.targetType || !values?.pmType
                }
              >
                View
              </button>
            </div>
          </div>
        </div>
        {/* table */}
        <div className="table-card-body">
          {tableData?.data?.length ? (
            <div className="table-card-styled table-responsive tableOne">
              <AntScrollTable
                data={tableData?.data}
                columnsData={individualtargetSetupTableColumn({
                  values,
                  history,
                })}
                rowKey={(record) => record?.id}
                pages={pages?.pageSize}
                pagination={pages}
                handleTableChange={handleTableChange}
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default IndividualTargetSetup;
