/* eslint-disable react-hooks/exhaustive-deps */
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import AntTable from "../../../../common/AntTable";
import { paginationSize } from "../../../../common/AntTable";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import DefaultInput from "../../../../common/DefaultInput";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { dailyAttendenceDtoCol, getDailyAttendanceData } from "./helper";
import ResetButton from "../../../../common/ResetButton";
import {
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";

const initialValues = {
  businessUnit: "",
  date: "",
  workplaceGroup: "",
  workplace: "",
  search: "",
  toDate: "",
};

const validationSchema = Yup.object().shape({
  // businessUnit: Yup.object()
  //   .shape({
  //     value: Yup.string().required("Business Unit is required"),
  //     label: Yup.string().required("Business Unit is required"),
  //   })
  //   .typeError("Business Unit is required"),

  date: Yup.date()
    .required("From Date is required")
    .typeError("From Date is required"),
  toDate: Yup.date()
    .required("To Date is required")
    .typeError("To Date is required"),
});

const MgmtInOutReport = () => {
  // redux
  const dispatch = useDispatch();

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // hooks
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [, setAllData] = useState({});
  const [, setTableRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  // DDl section
  // const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);

  // permission
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30341) {
      permission = item;
    }
  });

  // formik
  const { values, errors, touched, setFieldValue, setValues, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      validationSchema,
      initialValues,
      onSubmit: () => {
        getDailyAttendanceData(
          orgId,
          values,
          setRowDto,
          setAllData,
          setLoading,
          setTableRowDto,
          "",
          pages,
          setPages
        );
      },
    });

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkplaceDDL
    );
    // getPeopleDeskAllDDL(
    //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&WorkplaceGroupId=0&intId=${employeeId}`,
    //   "intBusinessUnitId",
    //   "strBusinessUnit",
    //   setBusinessUnitDDL
    // );
  }, [orgId, buId, employeeId]);

  // filter data
  // const filterData = (keywords) => {
  //   try {
  //     const regex = new RegExp(keywords?.toLowerCase());
  //     let newDta = allData?.employeeAttendanceSummaryVM?.filter(
  //       (item) =>
  //         regex.test(item?.employeeName?.toLowerCase()) ||
  //         regex.test(item?.employeeCode?.toLowerCase()) ||
  //         regex.test(item?.department?.toLowerCase()) ||
  //         regex.test(item?.designation?.toLowerCase()) ||
  //         regex.test(item?.employmentType?.toLowerCase()) ||
  //         regex.test(item?.status?.toLowerCase()) ||
  //         regex.test(item?.location?.toLowerCase())
  //     );
  //     setRowDto(newDta);
  //   } catch {
  //     setRowDto([]);
  //   }
  // };

  //set to module
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, [dispatch]);

  const handleTableChange = (pagination, newRowDto, srcText) => {
    if (newRowDto?.action === "filter") {
      return;
    }
    if (
      pages?.current === pagination?.current &&
      pages?.pageSize !== pagination?.pageSize
    ) {
      return getDailyAttendanceData(
        orgId,
        values,
        setRowDto,
        setAllData,
        setLoading,
        setTableRowDto,
        srcText,
        pagination,
        setPages
      );
    }
    if (pages?.current !== pagination?.current) {
      return getDailyAttendanceData(
        orgId,
        values,
        setRowDto,
        setAllData,
        setLoading,
        setTableRowDto,
        srcText,
        pagination,
        setPages
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading && <Loading />}
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading mt-2 pt-1">
            <div className="d-flex align-items-center">
              <h2 className="ml-1">Invalid In/Out Report</h2>
            </div>
          </div>
          <div className="table-card-body" style={{ marginTop: "12px" }}>
            <div className="card-style" style={{ margin: "14px 0px 12px 0px" }}>
              <div className="row">
                <div className="col-lg-3 d-none">
                  <div className="input-field-main">
                    <label>Business Unit</label>
                    <FormikSelect
                      name="businessUnit"
                      // options={businessUnitDDL || []}
                      value={values?.businessUnit}
                      onChange={(valueOption) => {
                        // getPeopleDeskAllDDL(
                        //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${valueOption?.value}&intId=${employeeId}&WorkplaceGroupId=0`,
                        //   "intWorkplaceGroupId",
                        //   "strWorkplaceGroup",
                        //   setWorkplaceGroupDDL
                        // );
                        setValues((prev) => ({
                          ...prev,
                          businessUnit: valueOption,
                        }));
                        setAllData([]);
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
                    <label>Form Date</label>
                    <DefaultInput
                      classes="input-sm"
                      placeholder=""
                      value={values?.date}
                      name="date"
                      type="date"
                      onChange={(e) => {
                        setValues((prev) => ({
                          ...prev,
                          toDate: e.target.value,
                          date: e.target.value,
                        }));
                        setAllData([]);
                        setRowDto([]);
                      }}
                      // min={values?.date}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>To Date</label>
                    <DefaultInput
                      classes="input-sm"
                      placeholder=""
                      value={values?.toDate}
                      name="toDate"
                      type="date"
                      onChange={(e) => {
                        setValues((prev) => ({
                          ...prev,
                          toDate: e.target.value,
                        }));
                        setAllData([]);
                        setRowDto([]);
                      }}
                      min={values?.date}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3 d-none">
                  <div className="input-field-main ">
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
                        // getPeopleDeskAllDDL(
                        //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${values?.businessUnit?.value}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
                        //   "intWorkplaceId",
                        //   "strWorkplace",
                        //   setWorkplaceDDL
                        // );
                        setAllData([]);
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
                        setAllData([]);
                        setRowDto([]);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-green btn-green-disable"
                    type="submit"
                    style={{ marginTop: "24px" }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <div>
                <h2
                  style={{
                    color: gray500,
                    fontSize: "14px",
                    margin: "12px 0px 10px 0px",
                  }}
                >
                  Invalid In/Out Report
                </h2>
              </div>

              <div>
                <ul className="d-flex flex-wrap">
                  {values?.search && (
                    <li className="pt-1">
                      <ResetButton
                        classes="btn-filter-reset"
                        title="Reset"
                        icon={<SettingsBackupRestoreOutlined />}
                        onClick={() => {
                          // setRowDto(allData);
                          setFieldValue("search", "");
                          getDailyAttendanceData(
                            orgId,
                            values,
                            setRowDto,
                            setAllData,
                            setLoading,
                            setTableRowDto,
                            "",
                            pages,
                            setPages
                          );
                        }}
                      />
                    </li>
                  )}
                  <li>
                    <DefaultInput
                      classes="search-input fixed-width mt-1 tableCardHeaderSeach"
                      inputClasses="search-inner-input"
                      placeholder="Search"
                      value={values?.search}
                      name="search"
                      type="text"
                      trailicon={
                        <SearchOutlined
                          sx={{
                            color: "#323232",
                            fontSize: "18px",
                          }}
                        />
                      }
                      onChange={(e) => {
                        // filterData(e.target.value);
                        setFieldValue("search", e.target.value);
                        if (e.target.value) {
                          getDailyAttendanceData(
                            orgId,
                            values,
                            setRowDto,
                            setAllData,
                            setLoading,
                            setTableRowDto,
                            e.target.value,
                            pages,
                            setPages
                          );
                        } else {
                          getDailyAttendanceData(
                            orgId,
                            values,
                            setRowDto,
                            setAllData,
                            setLoading,
                            setTableRowDto,
                            "",
                            pages,
                            setPages
                          );
                        }
                      }}
                      // errors={errors}
                      // touched={touched}
                    />
                  </li>
                </ul>
              </div>
            </div>
            {rowDto?.length > 0 ? (
              <div className="table-card-styled tableOne employee-table-card tableOne  table-responsive">
                <AntTable
                  data={rowDto}
                  columnsData={dailyAttendenceDtoCol}
                  setColumnsData={(newRow) => {
                    setTableRowDto(newRow);
                  }}
                  handleTableChange={({ pagination, newRowDto }) =>
                    handleTableChange(
                      pagination,
                      newRowDto,
                      values?.search || ""
                    )
                  }
                  pages={pages?.pageSize}
                  pagination={pages}
                />
              </div>
            ) : (
              <NoResult />
            )}
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </form>
  );
};

export default MgmtInOutReport;

/*      <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}>
                        <div>SL</div>
                      </th>
                      <th>
                        <div>Code</div>
                      </th>
                      <th>
                        <div>Employee Name</div>
                      </th>
                      <th>
                        <div>Department</div>
                      </th>
                      <th>
                        <div>Designation</div>
                      </th>
                      <th>
                        <div>Employement Type</div>
                      </th>
                      <th>
                        <div>In Time</div>
                      </th>
                      <th>
                        <div>Out Time</div>
                      </th>
                      <th>
                        <div>Status</div>
                      </th>
                      <th>
                        <div>Address</div>
                      </th>
                      <th>
                        <div>Remarks</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((item, index) => (
                      <tr key={index}>
                        <td style={{ width: "30px" }}>
                          <div className="tableBody-title">{index + 1}</div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.employeeCode || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.employeeName || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.department || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.designation || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.employmentType || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.inTime || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.outTime || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title ">
                            {item?.status || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.location || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title text-center">
                            {item?.remarks || "N/A"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>  */
