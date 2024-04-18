import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AntTable from "../../../common/AntTable";
import BackButton from "../../../common/BackButton";
import FormikSelect from "../../../common/FormikSelect";
import NoResult from "../../../common/NoResult";
import { getPeopleDeskAllDDL } from "../../../common/api";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { customStyles } from "../../../utility/selectCustomStyle";
import EmployeeCard from "../components/EmployeeCard";
import {
  createNUpdateEmployeeWiseLocation,
  getAllLocationAssignLanding,
  remoteLocColumns,
} from "./helper";

const initialValues = {
  employee: {
    label: "",
    value: "",
  },
};

const EmployeeWiseLocation = () => {
  const [rowDto, setRowDto] = useState([]);

  const [filterData, setFilterData] = useState([]);
  const dispatch = useDispatch();

  const { orgId, employeeId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // redux state
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const [empDDL, setEmpDDL] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [loading, setLoading] = useState(false);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30361) {
      permission = item;
    }
  });

  const getData = (empId) => {
    getAllLocationAssignLanding(
      orgId,
      empId,
      setRowDto,
      setFilterData,
      setLoading
    );
  };

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/Employee/EmployeeListBySupervisorORLineManagerNOfficeadmin?EmployeeId=${employeeId}&WorkplaceGroupId=${wgId}`,
      "intEmployeeBasicInfoId",
      "strEmployeeName",
      setEmpDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, buId, wgId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { values, setFieldValue, handleSubmit, errors, touched } = useFormik({
    initialValues,
    onSubmit: (values) => {
      saveHandler(values, () => {
        getData(values?.employee?.value);
      });
    },
  });

  const saveHandler = (values, cb) => {
    const array = [];
    filterData?.resultList?.forEach((data) => {
      array.push({
        masterLocationId: data?.intMasterLocationId,
        isCreate: data?.selectCheckbox,
      });
    });

    const payload = {
      intEmployeeId: values?.employee?.value,
      intAccountId: orgId,
      strEmployeeName: values?.employee?.label,
      intActionBy: employeeId,
      listLocations: array,
    };

    if (payload.listLocations.length > 0) {
      createNUpdateEmployeeWiseLocation(
        payload,
        setRowDto,
        setFilterData,
        setLoading,
        cb
      );
    } else {
      return toast.warning("Please select location");
    }
  };

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading mb-2">
              <div className="d-flex align-items-center">
                <BackButton />
                <h2>Assign Location</h2>
              </div>
              <ul className="d-flex flex-wrap">
                <li>
                  <button
                    type="submit"
                    className="btn btn-green flex-center mr-2"
                    disabled={rowDto?.length === 0 || loading}
                  >
                    Save
                  </button>
                </li>
              </ul>
            </div>
            <div className="table-card-body">
              <div className="card-style py-2 px-3">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Search Employee</label>
                    </div>
                    <FormikSelect
                      name="employee"
                      options={empDDL || []}
                      value={values?.employee}
                      onChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                        getData(valueOption?.value);
                      }}
                      placeholder="Select Employee"
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isClearable={false}
                    />
                  </div>
                </div>

                {rowDto?.employeeInfo && (
                  <EmployeeCard
                    data={{
                      photoURL: rowDto?.employeeInfo?.intEmployeeImageUrlId,
                      name: rowDto?.employeeInfo?.strEmployeeName,
                      designation: rowDto?.employeeInfo?.strDesignation,
                      dapartment: rowDto?.employeeInfo?.strDepartment,
                      supervisor: rowDto?.employeeInfo?.strSupervisorName,
                      lineManager: rowDto?.employeeInfo?.strLinemanager,
                      userRole: rowDto?.employeeInfo?.role,
                      businessUnit: rowDto?.employeeInfo?.strBusinessUnitName,
                      workplaceGroup:
                        rowDto?.employeeInfo?.strWorkplaceGroupName,
                      workplace: rowDto?.employeeInfo?.strWorkplaceName,
                    }}
                  />
                )}
              </div>
              {rowDto?.resultList?.length > 0 && (
                <div>
                  <h2 style={{ fontWeight: 500, margin: "16px 0" }}>
                    Locations
                  </h2>
                </div>
              )}

              <div className="table-card-styled tableOne">
                {rowDto?.resultList?.length > 0 ? (
                  <AntTable
                    data={rowDto?.resultList}
                    columnsData={remoteLocColumns(
                      page,
                      paginationSize,
                      filterData,
                      setFilterData,
                      rowDto,
                      setRowDto,
                      setFieldValue
                    )}
                    setColumnsData={(dataRow) => {
                      if (dataRow?.length === rowDto?.length) {
                        const temp = dataRow?.map((item) => {
                          return {
                            ...item,
                            selectCheckbox: false,
                          };
                        });
                        setFilterData(temp);
                        setRowDto(temp);
                      } else {
                        setFilterData(dataRow);
                      }
                    }}
                    setPage={setPage}
                    setPaginationSize={setPaginationSize}
                  />
                ) : (
                  <NoResult />
                )}
              </div>
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
};

export default EmployeeWiseLocation;
