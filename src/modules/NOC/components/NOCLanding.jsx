import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { monthFirstDate, monthLastDate } from "utility/dateFormatter";
import Loading from "common/loading/Loading";
import MasterFilter from "common/MasterFilter";
import PrimaryButton from "common/PrimaryButton";
import DefaultInput from "common/DefaultInput";
import AntScrollTable from "common/AntScrollTable";
import { NocLandingColumn } from "./utils";
import NoResult from "common/NoResult";

const NOCLanding = ({ isManagement, pathurl }) => {
  const {
    profileData: { orgId, buId, employeeId, wgId, wId },
  } = useSelector((state) => state?.auth, shallowEqual);
  const history = useHistory();
  const [rowDto, getRowDataApi, loadingData] = useAxiosGet([]);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  
  // Add state for pagination
  const [pageNo, setPageNo] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const { values, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: {
      searchString: "",
      filterFromDate: monthFirstDate(),
      filterToDate: monthLastDate(),
    },
    onSubmit: (values, { setSubmitting, resetForm }) => {
      saveHandler(values);
    },
  });
  const saveHandler = (values) => {};

  const getLanding = (values) => {
    // &EmployeeId=${employeeId}
    let api = `/NocApplication?Accountid=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&WorkplaceId=${wId}&EmployeeId=0&FromDate=${values?.filterFromDate}&ToDate=${values?.filterToDate}&PageNo=${pageNo}&PageSize=${pageSize}&IsDescending=false`;
    getRowDataApi(api);
  };
  
  useEffect(() => {
    getLanding(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, employeeId, pageNo, pageSize]);

  // Function to handle page change
  const handlePageChange = (page, size) => {
    setPageNo(page);
    setPageSize(size);
  };

  // Reset pagination when applying filters
  const applyFilters = () => {
    setPageNo(1); // Reset to first page when applying new filters
    getLanding(values);
  };

  return (
    <form>
      {(loadingData || loading) && <Loading />}
      <div className="table-card">
        {/* header-employee-profile  */}
        <div className="table-card-heading">
          <div className="d-flex justify-content-center align-items-center">
            <div className="ml-2">
              <>
                <h6 className="count">NOC Application</h6>
              </>
            </div>
          </div>
          <ul className="d-flex flex-wrap">
            <li className="d-none">
              <MasterFilter
                inputWidth="250px"
                width="250px"
                isHiddenFilter
                value={values?.searchString}
                setValue={(value) => {
                  setFieldValue("searchString", value);
                 
                }}
                cancelHandler={() => {
                  setFieldValue("searchString", "");
                }}
              />
            </li>
            <li>
              <PrimaryButton
                type="button"
                className="btn btn-default flex-center"
                label="Create NOC Request"
                onClick={() => {
                  history.push({
                    pathname: `${pathurl}/create`,
                    state: { isManagement },
                  });
                }}
              />
            </li>
          </ul>
        </div>
        <div className="card-style pb-0 mb-2" style={{ marginTop: "12px" }}>
          <div className="row">
            <div className="col-lg-3">
              <div className="input-field-main">
                <label>From Date</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.filterFromDate}
                  placeholder="Month"
                  name="toDate"
                  max={values?.filterToDate}
                  type="date"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("filterFromDate", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="input-field-main">
                <label>To Date</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.filterToDate}
                  placeholder="Month"
                  name="toDate"
                  min={values?.filterFromDate}
                  type="date"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("filterToDate", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-lg-3">
              <button
                className="btn btn-green btn-green-disable mt-4"
                type="button"
                disabled={!values?.filterFromDate || !values?.filterToDate}
                onClick={applyFilters}
              >
                View
              </button>
            </div>
          </div>
        </div>
        {console.log("rowDto", rowDto?.data)}
        <div className="table-card-body">
          <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
            {rowDto?.data?.length > 0 ? (
              <>
                <AntScrollTable
                  data={rowDto?.data || []}
                  columnsData={NocLandingColumn(
                    history,
                    pathurl,
                    isManagement,
                    setLoading,
                    dispatch
                  )}
                  currentPage={pageNo}
                  pageSize={pageSize}
                  setPage={setPageNo}
                  setPaginationSize={setPageSize}
                  onChange={handlePageChange}
                  rowKey={(record) => record?.intNocApplicationId}
                />
              </>
            ) : (
              <>
                {!loadingData && <NoResult title="No Result Found" para="" />}
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default NOCLanding;
