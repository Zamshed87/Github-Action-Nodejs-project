import {
  AddCircle,
  AddOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import AntTable from "../../../common/AntTable";
import { getSearchEmployeeList } from "../../../common/api";
import BtnActionMenu from "../../../common/BtnActionMenu";
import DefaultInput from "../../../common/DefaultInput";
import FilterBadgeComponent from "../../../common/FilterBadgeComponent";
import IConfirmModal from "../../../common/IConfirmModal";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PopOverMasterFilter from "../../../common/PopoverMasterFilter";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../utility/customColor";
import { monthFirstDate } from "../../../utility/dateFormatter";
import { todayDate } from "../../../utility/todayDate";
import OvertimeFilterModal from "./component/OvertimeFilterModal";
import { columns, getOvertimeLandingData, overtimeEntry_API } from "./helper";
import AsyncFormikSelect from "../../../common/AsyncFormikSelect";

const initData = {
  search: "",
  workplaceGroup: "",
  employee: "",
  designation: "",
  department: "",
  date: "",
  status: "",
  filterFromDate: monthFirstDate(),
  filterToDate: todayDate(),
};

export default function EmOvertimeEntry() {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // state
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [isFilter, setIsFilter] = useState(false);

  // filter
  const [status, setStatus] = useState("");

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getData = (values, isClear = false) => {
    getOvertimeLandingData(
      {
        strPartName: "Overtime",
        status: values?.status?.label || "All",
        departmentId: values?.department?.value || 0,
        designationId: values?.designation?.value || 0,
        supervisorId: 0,
        employeeId: isClear ? 0 : values?.employee?.value || 0,
        workplaceGroupId: wgId,
        workplaceId: wId,
        businessUnitId: buId,
        loggedEmployeeId: employeeId,
        formDate: values?.filterFromDate,
        toDate: values?.filterToDate,
      },
      setRowDto,
      setLoading,
      () => {}
    );
  };

  // useEffect(() => {
  //   getPeopleDeskAllDDL(
  //     `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfo&AccountId=${orgId}&BusinessUnitId=${buId}&intId=${employeeId}`,
  //     "EmployeeId",
  //     "EmployeeName",
  //     setEmpDDL
  //   );
  // }, [orgId, buId, employeeId]);

  useEffect(() => {
    getOvertimeLandingData(
      {
        strPartName: "Overtime",
        status: "All",
        departmentId: 0,
        designationId: 0,
        supervisorId: 0,
        employeeId: 0,
        workplaceGroupId: wgId,
        businessUnitId: buId,
        loggedEmployeeId: employeeId,
        formDate: monthFirstDate(),
        toDate: todayDate(),
      },
      setRowDto,
      setLoading,
      () => {}
    );
  }, [buId, employeeId, wgId]);

  const saveHandler = (values) => {
    const payload = {
      strPartName: "Overtime",
      status: "All",
      departmentId: 0,
      designationId: 0,
      supervisorId: 0,
      employeeId: values?.employee?.value || 0,
      workplaceGroupId: wgId,
      businessUnitId: buId,
      loggedEmployeeId: employeeId,
      formDate: values?.filterFromDate,
      toDate: values?.filterToDate,
    };
    getOvertimeLandingData(payload, setRowDto, setLoading, () => {});
  };

  // Advanced Filter
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const openFilter = Boolean(filterAnchorEl);
  const id = openFilter ? "simple-popover" : undefined;
  const handleSearch = (values) => {
    getData(values);
    setFilterBages(values);
    setfilterAnchorEl(null);
  };
  const clearFilter = () => {
    setFilterBages({});
    setFilterValues("");
    getData();
  };
  const clearBadge = (values, name) => {
    const data = values;
    data[name] = "";
    setFilterBages(data);
    setFilterValues(data);
    handleSearch(data);
  };
  const getFilterValues = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30333) {
      permission = item;
    }
  });

  const deleteHandler = (item) => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: `Do you want to delete ?`,
      yesAlertFunc: () => {
        const callback = () => {
          getOvertimeLandingData(
            {
              strPartName: "Overtime",
              status: "All",
              departmentId: 0,
              designationId: 0,
              supervisorId: 0,
              employeeId: 0,
              workplaceGroupId: wgId,
              businessUnitId: buId,
              loggedEmployeeId: employeeId,
              formDate: item?.fromDate,
              toDate: item?.toDate,
            },
            setRowDto,
            setLoading,
            () => {}
          );
        };
        let payload = {
          partType: "Overtime",
          employeeId: item?.EmployeeId,
          autoId: item?.OvertimeId,
          isActive: false,
          businessUnitId: buId,
          accountId: orgId,
          startTime: item?.startTime || null,
          endTime: item?.endTime || null,
          workplaceId: 0,
          overtimeDate: item?.date,
          overtimeHour: +item?.overTimeHour,
          reason: item?.reason,
          intCreatedBy: employeeId,
        };
        overtimeEntry_API(payload, setLoading, callback);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
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
          dirty,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <>
                  <div className="table-card">
                    <div
                      className="table-card-heading"
                      style={{ marginBottom: "2px" }}
                    >
                      <div className="d-flex align-items-center">
                        {rowDto?.length > 0 ? (
                          <h6 className="count">
                            Total {rowDto?.length} employees
                          </h6>
                        ) : (
                          <>
                            <h6 className="count">Total result 0</h6>
                          </>
                        )}
                      </div>
                      <ul className="d-flex flex-wrap">
                        {(isFilter || status) && (
                          <li>
                            <ResetButton
                              classes="btn-filter-reset"
                              title="reset"
                              icon={
                                <SettingsBackupRestoreOutlined
                                  sx={{ marginRight: "10px", fontSize: "16px" }}
                                />
                              }
                              styles={{
                                marginRight: "16px",
                              }}
                              onClick={() => {
                                setIsFilter(false);
                                setFieldValue("search", "");
                                setStatus("");
                                getData();
                              }}
                            />
                          </li>
                        )}
                        <li>
                          <BtnActionMenu
                            className="btn btn-default flex-center btn-deafult-create-job"
                            icon={
                              <AddOutlined
                                sx={{
                                  marginRight: "0px",
                                  fontSize: "15px",
                                }}
                              />
                            }
                            label="Overtime"
                            options={[
                              {
                                value: 1,
                                label: "Single Entry",
                                icon: (
                                  <AddCircle
                                    sx={{
                                      marginRight: "10px",
                                      color: gray500,
                                      fontSize: "16px",
                                    }}
                                  />
                                ),
                                onClick: () => {
                                  if (!permission?.isCreate)
                                    return toast.warn(
                                      "You don't have permission"
                                    );
                                  history.push(
                                    `/profile/overTime/manualEntry/create`
                                  );
                                },
                              },
                              {
                                value: 2,
                                label: "Bulk Entry",
                                icon: (
                                  <PlaylistAddCircleIcon
                                    sx={{
                                      marginRight: "10px",
                                      color: gray500,
                                      fontSize: "16px",
                                    }}
                                  />
                                ),
                                onClick: () => {
                                  if (permission?.isCreate) {
                                    history.push(
                                      "/profile/overTime/bulkEntry/create"
                                    );
                                  } else {
                                    toast.warn("You don't have permission");
                                  }
                                },
                              },
                            ]}
                          />
                        </li>
                      </ul>
                    </div>
                    <FilterBadgeComponent
                      propsObj={{
                        filterBages,
                        setFieldValue,
                        clearBadge,
                        values: filterValues,
                        resetForm,
                        initData,
                        clearFilter,
                      }}
                    />

                    <div className="table-card-body">
                      <div className="card-style with-form-card pb-0 my-3 ">
                        <div className="row">
                          <div className="input-field-main  col-lg-3">
                            <label>From Date</label>
                            <DefaultInput
                              classes="input-sm"
                              value={values?.filterFromDate}
                              name="filterFromDate"
                              type="date"
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue("filterFromDate", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="input-field-main col-lg-3">
                            <label>To Date</label>
                            <DefaultInput
                              classes="input-sm"
                              value={values?.filterToDate}
                              name="filterToDate"
                              type="date"
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue("filterToDate", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="input-field-main col-lg-3">
                            <label>Employee</label>
                            {/* <FormikSelect
                              classes="input-sm"
                              name="employee"
                              options={empDDL || []}
                              value={values?.employee}
                              onChange={(valueOption) => {
                                setFieldValue("employee", valueOption);
                                if (!valueOption) {
                                  getData(values, true);
                                }
                              }}
                              placeholder=" "
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                              menuPosition="fixed"
                            /> */}
                            <AsyncFormikSelect
                              selectedValue={values?.employee}
                              isSearchIcon={true}
                              handleChange={(valueOption) => {
                                setFieldValue("employee", valueOption);
                                if (!valueOption) {
                                  getData(values, true);
                                }
                              }}
                              placeholder="Search (min 3 letter)"
                              loadOptions={(v) =>
                                getSearchEmployeeList(buId, wgId, v)
                              }
                            />
                          </div>
                          <div
                            style={{ marginTop: "24px" }}
                            className="col-lg-3"
                          >
                            <PrimaryButton
                              type="submit"
                              className="btn btn-green flex-center"
                              label={"View"}
                            />
                          </div>
                        </div>
                      </div>
                      {rowDto?.length > 0 ? (
                        <div className="table-card-styled tableOne table-responsive">
                          <AntTable
                            data={rowDto}
                            columnsData={columns(
                              values,
                              permission,
                              history,
                              deleteHandler
                            )}
                          />
                        </div>
                      ) : (
                        <NoResult />
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <NotPermittedPage />
              )}
            </Form>

            {/* filter */}
            <PopOverMasterFilter
              propsObj={{
                id,
                open: openFilter,
                anchorEl: filterAnchorEl,
                handleClose: () => setfilterAnchorEl(null),
                handleSearch,
                values: filterValues,
                dirty,
                initData,
                resetForm,
                clearFilter,
                sx: {},
                size: "lg",
              }}
            >
              <OvertimeFilterModal
                propsObj={{
                  getFilterValues,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                }}
              ></OvertimeFilterModal>
            </PopOverMasterFilter>
          </>
        )}
      </Formik>
    </>
  );
}
