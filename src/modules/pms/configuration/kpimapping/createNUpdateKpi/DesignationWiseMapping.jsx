import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import AntTable from "../../../../../common/AntTable";
import BackButton from "../../../../../common/BackButton";
import Loading from "../../../../../common/loading/Loading";
import PrimaryButton from "../../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../../commonRedux/reduxForLocalStorage/actions";
import { initialValues, validationSchema } from "../helper";
import CreateNEditForm from "./CreateNEditForm";
import {
  handleCreateKpiMapping,
  kpiMappingColumns,
  saveHandler,
} from "./helper";

const DesignationWiseMapping = () => {
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
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [totalDto, setTotalDto] = useState([]);

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
    initialValues: {
      ...initialValues,
      employee: {
        label: "ALL",
        value: 0,
      },
      department: {
        label: params?.id ? location?.state?.deptName : "",
        value: params?.id ? location?.state?.deptId : "",
      },
      designation: {
        label: params?.id ? location?.state?.designationName : "",
        value: params?.id ? location?.state?.designationId : "",
      },
    },
    validationSchema: validationSchema("designation"),
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
    return !params?.id ? setRowDto([]) : ""
  }

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="table-card" ref={scrollRef}>
          <div className="table-card-heading heading pt-0">
            <BackButton
              title={
                params?.id
                  ? "Update KPI Mapping (Designation Wise)"
                  : "Create KPI Mapping (Designation Wise)"
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
                          2,
                          rowDto,
                          orgId,
                          buId,
                          employeeId,
                          "designation",
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
                component: "designation",
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
              }}
            />
            <div>
              {rowDto?.length > 0 && (
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
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default DesignationWiseMapping;
