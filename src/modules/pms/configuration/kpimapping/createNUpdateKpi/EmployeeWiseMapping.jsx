/* eslint-disable eqeqeq */
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import AntTable from "../../../../../common/AntTable";
import BackButton from "../../../../../common/BackButton";
import NoResult from "../../../../../common/NoResult";
import PrimaryButton from "../../../../../common/PrimaryButton";
import Loading from "../../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../../commonRedux/reduxForLocalStorage/actions";
import { initialValues, validationSchema } from "../helper";
import CreateNEditForm from "./CreateNEditForm";
import {
  handleCreateKpiMapping,
  kpiColumnDataForViewOnly,
  kpiMappingColumns,
  saveHandler,
} from "./helper";

const EmployeeWiseMapping = () => {
  const { orgId, buId, employeeId, strBusinessUnit } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [rowDto, setRowDto] = useState([]);
  const [totalDto, setTotalDto] = useState([]);
  const [secondTableData, setSecondTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef();
  const history = useHistory();
  const params = useParams();
  const location = useLocation();

  // formik setup
  const {
    values,
    setFieldValue,
    handleSubmit,
    errors,
    touched,
    setValues,
    resetForm,
  } = useFormik({
    initialValues: params.id
      ? {
          ...initialValues,
          employee: {
            label: location?.state?.employeeName,
            value: location?.state?.employeeId,
          },
        }
      : initialValues,
    validationSchema: validationSchema("employee"),
    onSubmit: () => {
      saveHandler(
        params,
        rowDto,
        values,
        setRowDto,
        strBusinessUnit,
        setValues
      );
    },
  });

  const callback = () => {
    return !params?.id ? setRowDto([]) : "";
  };

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="table-card" ref={scrollRef}>
          <div className="table-card-heading heading pt-0">
            <BackButton
              title={
                params?.id
                  ? "Update KPI Mapping (Employee Wise)"
                  : "Create KPI Mapping (Employee Wise)"
              }
            />
            <div className="table-card-heading">
              <div className="table-card-head-right">
                <ul>
                  <li>
                    <PrimaryButton
                      type="button"
                      className="btn btn-green flex-center"
                      label={"Save"}
                      onClick={() =>
                        handleCreateKpiMapping(
                          3,
                          rowDto,
                          orgId,
                          buId,
                          employeeId,
                          "employee",
                          history,
                          setLoading,
                          totalDto,
                          resetForm,
                          callback
                        )
                      }
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="table-card-body">
            <CreateNEditForm
              propsObj={{
                component: "employee",
                values,
                setFieldValue,
                errors,
                touched,
                orgId,
                buId,
                setRowDto,
                setLoading,
                setTotalDto,
                params,
                setSecondTableData,
              }}
            />
            <div>
              {params?.id == 1 ? (
                <h1 className="mb-2">Department Wise KPI List</h1>
              ) : (
                <h1 className="mb-2">Employee Wise KPI List222</h1>
              )}
              {rowDto?.length > 0 ? (
                <div className="table-card-styled employee-table-card tableOne table-responsive">
                  <AntTable
                    data={rowDto}
                    columnsData={kpiMappingColumns(
                      page,
                      paginationSize,
                      rowDto,
                      setRowDto
                    )}
                    setPage={setPage}
                    setPaginationSize={setPaginationSize}
                  />
                </div>
              ) : (
                <NoResult />
              )}
            </div>
            <div>
              {params?.id == 1 ? (
                <h1 className="mb-2">Employee Wise KPI List</h1>
              ) : (
                <h1 className="mb-2">Department Wise KPI List</h1>
              )}
              {secondTableData?.length > 0 ? (
                <div className="table-card-styled employee-table-card tableOne table-responsive">
                  <AntTable
                    data={secondTableData}
                    columnsData={kpiColumnDataForViewOnly(params?.id)}
                    removePagination={true}
                  />
                </div>
              ) : (
                <NoResult />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default EmployeeWiseMapping;
