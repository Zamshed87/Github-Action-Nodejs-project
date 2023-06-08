import { SaveAlt, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AntScrollTable from "../../../../common/AntScrollTable";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import AvatarComponent from "../../../../common/AvatarComponent";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray600 } from "../../../../utility/customColor";
import { monthFirstDate } from "../../../../utility/dateFormatter";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../utility/todayDate";
import { generateExcelAction } from "./excel/excelConvert";
import { getBuDetails, getMonthlyPunchDetailsReport } from "./helper";

const initData = {
  search: "",
  workplace: "",
  businessUnit: "",
  workplaceGroup: "",
  fromDate: monthFirstDate(),
  toDate: todayDate(),
};

const MonthlyPunchReportDetails = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => { };
  const [loading, setLoading] = useState(false);

  const [rowDto, setRowDto] = useState(null);
  const [buDetails, setBuDetails] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [tableRowDto, setTableRowDto] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const getData = (values) => {
    getMonthlyPunchDetailsReport(
      employeeId,
      orgId,
      values,
      setRowDto,
      setLoading,
      setTableRowDto
    );
    getBuDetails(buId, setBuDetails, setLoading);
  };

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&WorkplaceGroupId=0&intId=${employeeId}`,
      "intBusinessUnitId",
      "strBusinessUnit",
      setBusinessUnitDDL
    );
  }, [orgId, buId, employeeId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const { buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30337) {
      permission = item;
    }
  });

  const fromToDateList = (fromDate, toDate) => {
    fromDate = moment(fromDate, "YYYY-MM-DD");
    toDate = moment(toDate, "YYYY-MM-DD");
    const difference = moment(toDate, "YYYY-MM-DD").diff(fromDate, "days");
    let dateList = [];
    for (let i = 0; i <= difference; i++) {
      const newDate = moment(fromDate).add(i, "days").format("YYYY-MM-DD");
      const dateLevel = moment(newDate, "YYYY-MM-DD").format("DD MMM, YYYY");
      dateList.push({ date: newDate, level: dateLevel });
    }
    return dateList;
  };

  // search
  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = rowDto?.filter(
        (item) =>
          regex.test(item?.strEmployeeName?.toLowerCase()) ||
          regex.test(item?.strDepartment?.toLowerCase()) ||
          regex.test(item?.strDesignation?.toLowerCase())
      );
      setTableRowDto(newDta);
    } catch (error) {
      setRowDto([]);
    }
  };

  const columns = (fromDate, toDate, page, paginationSize) => {
    const dateList = fromToDateList(fromDate, toDate);
    return [
      {
        title: () => (
          <span style={{ color: gray600, minWidth: "25px" }}>SL</span>
        ),
        render: (_, __, index) => (page - 1) * paginationSize + index + 1,
        sorter: false,
        filter: false,
        className: "text-center",
        width: 40,
        fixed: "left",
      },
      {
        title: () => <span style={{ color: gray600 }}>Employee ID</span>,
        dataIndex: "intEmployeeBasicInfoId",
        sorter: true,
        filter: true,
        fixed: "left",
        width: 120,
      },
      {
        title: "Employee Name",
        dataIndex: "strEmployeeName",
        render: (_, record) => {
          return (
            <div className="d-flex align-items-center">
              <AvatarComponent
                classess=""
                letterCount={1}
                label={record?.strEmployeeName}
              />
              <span className="ml-2">{record?.strEmployeeName}</span>
            </div>
          );
        },
        sorter: true,
        filter: true,
        fixed: "left",
        width: 200,
      },
      {
        title: "Designation",
        dataIndex: "strDesignation",
        sorter: true,
        filter: true,
        width: 180,
      },
      {
        title: "Department",
        dataIndex: "strDepartment",
        sorter: true,
        filter: true,
        width: 180,
      },
      ...(dateList?.length > 0 &&
        dateList.map((item) => ({
          title: () => <span style={{ color: gray600 }}>{item?.level}</span>,
          dataIndex: item?.date,
          width: 150,
        }))),
    ];
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
          setValues,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="loan-application">
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div className="d-flex mx-0 px-0">
                        <Tooltip title="Export CSV" arrow>
                          <button
                            type="button"
                            className="btn-save "
                            onClick={() => {
                              generateExcelAction(
                                "Monthly Punch Details Report",
                                "",
                                "",
                                buName,
                                tableRowDto,
                                buDetails?.strBusinessUnitAddress,
                                fromToDateList(values?.fromDate, values?.toDate)
                              );
                            }}
                          >
                            <SaveAlt
                              sx={{ color: "#637381", fontSize: "16px" }}
                            />
                          </button>
                        </Tooltip>
                      </div>
                      <ul className="d-flex flex-wrap mx-0 px-0">
                        {values?.search && (
                          <li className="mr-2">
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
                                setFieldValue("search", "");
                                getData();
                              }}
                            />
                          </li>
                        )}
                        <li>
                          <MasterFilter
                            isHiddenFilter={true}
                            width="200px"
                            inputWidth="200px"
                            styles={{ marginRight: "0px !important" }}
                            value={values?.search}
                            setValue={(value) => {
                              filterData(value, setRowDto);
                              setFieldValue("search", value);
                            }}
                            cancelHandler={() => {
                              setFieldValue("search", "");
                              getData();
                            }}
                          />
                        </li>
                      </ul>
                    </div>
                    <div className="table-card-body">
                      <div className="card-style my-2">
                        <div className="row">
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>Business Unit</label>
                              <FormikSelect
                                name="businessUnit"
                                options={businessUnitDDL || []}
                                value={values?.businessUnit}
                                onChange={(valueOption) => {
                                  if (valueOption?.value) {
                                    getPeopleDeskAllDDL(
                                      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${valueOption?.value}&intId=${employeeId}&WorkplaceGroupId=0`,
                                      "intWorkplaceGroupId",
                                      "strWorkplaceGroup",
                                      setWorkplaceGroupDDL
                                    );
                                    setValues((prev) => ({
                                      ...prev,
                                      businessUnit: valueOption,
                                    }));
                                    getBuDetails(
                                      valueOption.intBusinessUnitId,
                                      setBuDetails,
                                      setLoading
                                    );
                                  }
                                  setTableRowDto([]);
                                  setRowDto([]);
                                }}
                                placeholder=""
                                styles={customStyles}
                                isClearable={false}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>Workplace Group</label>
                              <FormikSelect
                                name="workplaceGroup"
                                options={[...workplaceGroupDDL] || []}
                                value={values?.workplaceGroup}
                                onChange={(valueOption) => {
                                  setValues((prev) => ({
                                    ...prev,
                                    workplace: "",
                                    workplaceGroup: valueOption,
                                  }));
                                  if (valueOption?.value) {
                                    getPeopleDeskAllDDL(
                                      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${values?.businessUnit?.value}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
                                      "intWorkplaceId",
                                      "strWorkplace",
                                      setWorkplaceDDL
                                    );
                                  }
                                  setTableRowDto([]);
                                  setRowDto([]);
                                  setWorkplaceDDL([]);
                                }}
                                placeholder=""
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>Workplace</label>
                              <FormikSelect
                                name="workplace"
                                options={[...workplaceDDL] || []}
                                value={values?.workplace}
                                onChange={(valueOption) => {
                                  setValues((prev) => ({
                                    ...prev,
                                    workplace: valueOption,
                                  }));
                                  setTableRowDto([]);
                                  setRowDto([]);
                                }}
                                placeholder=""
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>From Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.fromDate}
                                placeholder=""
                                name="fromDate"
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("fromDate", e.target.value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>To Date</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.toDate}
                                placeholder="Month"
                                name="toDate"
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("toDate", e.target.value);
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-lg-1">
                            <button
                              disabled={!values?.toDate || !values?.fromDate}
                              style={{ marginTop: "21px" }}
                              className="btn btn-green"
                              onClick={() => {
                                getData(values);
                              }}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="table-card-styled tableOne mt-2">
                        {rowDto?.length > 0 ? (
                          <AntScrollTable
                            data={values?.search ? tableRowDto : rowDto}
                            columnsData={columns(
                              values?.fromDate,
                              values?.toDate,
                              page,
                              paginationSize

                            )}
                            setColumnsData={(newRow) => setTableRowDto(newRow)}
                            setPage={setPage}
                            setPaginationSize={setPaginationSize}
                          />
                        ) : (
                          <>
                            {!loading && (
                              <NoResult title="No Result Found" para="" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default MonthlyPunchReportDetails;
