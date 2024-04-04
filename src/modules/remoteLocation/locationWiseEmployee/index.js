import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
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
import LocationDetails from "../components/LocationDetails";
import {
  createNUpdateLocationWiseEmployee,
  getLocationwiseEmpLanding,
  remoteLocColumns,
} from "./helper";

const initialValues = {
  location: {
    label: "",
    value: "",
  },
  search: "",
};

const LocationWiseEmployee = () => {
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const [loading, setLoading] = useState(false);
  const [locationDDL, setLocationDDL] = useState([]);

  const [rowDto, setRowDto] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const location = useLocation();

  const dispatch = useDispatch();

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30361) {
      permission = item;
    }
  });

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getData = (locId) => {
    getLocationwiseEmpLanding(
      orgId,
      buId,
      locId,
      setRowDto,
      setFilterData,
      setLoading
    );
  };

  useEffect(() => {
    location?.state?.locationInfo &&
      getData(location?.state?.locationInfo?.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  // useEffect
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/TimeSheet/GetMasterLocationRegistrationDdlById?AccountId=${orgId}&BussinessUnit=${buId}`,
      "value",
      "label",
      setLocationDDL
    );
  }, [employeeId, buId, orgId]);

  const { handleSubmit, values, setFieldValue, errors, touched } = useFormik({
    initialValues: location?.state?.locationInfo
      ? {
          ...initialValues,
          location: location?.state?.locationInfo,
        }
      : initialValues,
    onSubmit: (values) => {
      saveHandler(values, () => {
        getData(values?.location?.value);
      });
    },
  });

  const saveHandler = (values, cb) => {
    const array = [];
    filterData?.forEach((data) => {
      array.push({
        intEmployeeId: data?.intEmployeeBasicInfoId,
        strEmployeeName: data?.strEmployeeName,
        isCreate: data?.selectCheckbox,
      });
    });

    const payload = {
      masterLocationId: values?.location?.value,
      intActionBy: employeeId,
      intAccountId: orgId,
      listEmployee: array,
    };

    payload.listEmployee.length > 0
      ? createNUpdateLocationWiseEmployee(
          payload,
          setRowDto,
          setFilterData,
          setLoading,
          cb
        )
      : toast.warning("please select employee");
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
                      <label>Select Location</label>
                    </div>
                    <FormikSelect
                      name="location"
                      options={locationDDL || []}
                      value={values?.location}
                      onChange={(valueOption) => {
                        setFieldValue("location", valueOption);
                        getData(valueOption?.value);
                      }}
                      placeholder="Select Location"
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isClearable={false}
                    />
                  </div>
                </div>
                {rowDto?.length > 0 && (
                  <LocationDetails
                    data={{
                      code: values?.location?.strLocationCOde,
                      locationName: values?.location?.strPlaceName,
                      locationLog: values?.location?.locationLog,
                      noOfAssigned: values?.location?.count,
                      status: values?.location?.strStatus,
                    }}
                  />
                )}
              </div>
              {rowDto?.length > 0 && (
                <div>
                  <h2 style={{ fontWeight: 500, margin: "16px 0" }}>
                    Employee List
                  </h2>
                </div>
              )}

              <div
                style={{ height: "250px" }}
                className="table-card-styled tableOne"
              >
                {rowDto?.length > 0 ? (
                  <AntTable
                    data={rowDto}
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
                    rowKey={(record) => record?.intEmployeeBasicInfoId}
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

export default LocationWiseEmployee;
