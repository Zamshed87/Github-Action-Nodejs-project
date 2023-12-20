import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import AntTable from "../../../common/AntTable";
import DefaultInput from "../../../common/DefaultInput";
import FormikSelect from "../../../common/FormikSelect";
import NoResult from "../../../common/NoResult";
import PrimaryButton from "../../../common/PrimaryButton";
import { getPeopleDeskAllDDL } from "../../../common/api";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter, monthLastDate } from "../../../utility/dateFormatter";
import { customStyles } from "../../../utility/selectCustomStyle";
import { timeFormatter } from "../../../utility/timeFormatter";
import { todayDate } from "../../../utility/todayDate";
import { getLogData } from "./helper";

/* eslint-disable react-hooks/exhaustive-deps */
const initData = {
  employee: "",
  fromDate: todayDate(),
  toDate: todayDate(),
};
const validationSchema = Yup.object().shape({
  employee: Yup.object()
    .shape({
      label: Yup.string().required("Employee is required"),
      value: Yup.string().required("Employee is required"),
    })
    .typeError("Employee is required"),
  fromDate: Yup.string().required("Date is required"),
  toDate: Yup.string().required("Date is required"),
});
const ShiftManagementLog = () => {
  const dispatch = useDispatch();
  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [empDDL, setEmpDDL] = useState([]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30368) {
      permission = item;
    }
  });

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfo&BusinessUnitId=${buId}&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
      "EmployeeId",
      "EmployeeName",
      setEmpDDL
    );
  }, [orgId, buId, employeeId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Shift Management Log";
  }, []);

  const columns = [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      className: "text-center",
    },
    {
      title: "Employee Id",
      dataIndex: "intEmployeeId",
      className: "text-center",
    },

    {
      title: "Calendar Type",
      dataIndex: "strCalendarType",
      sorter: true,
      filter: true,
    },
    {
      title: "Calendar",
      dataIndex: "strCalendarName",
      sorter: true,
      filter: true,
    },
    {
      title: "Change Date ",
      dataIndex: "dteNextChangeDate",
      render: (data) => <div>{data && dateFormatter(data)}</div>,
    },
    {
      title: "Start Time",
      dataIndex: "dteStartTime",
      render: (data) => <div>{data && timeFormatter(data)}</div>,
    },
    {
      title: "Extended Start Time",
      dataIndex: "dteExtendedStartTime",
      render: (data) => <div>{data && timeFormatter(data)}</div>,
      className: "text-center",
    },
    {
      title: "Last Start Time",
      dataIndex: "dteLastStartTime",
      render: (data) => <div>{data && timeFormatter(data)}</div>,
    },
    {
      title: "End Time",
      dataIndex: "dteEndTime",
      render: (data) => <div>{data && timeFormatter(data)}</div>,
    },
    {
      title: "Min Work Hour",
      dataIndex: "numMinWorkHour",
      className: "text-center",
    },
    {
      title: "Creator",
      dataIndex: "strCreatorName",
      filter: false,
      sorter: false,
    },
    {
      title: "Create Date",
      dataIndex: "dteCreatedAt",
      render: (data) => dateFormatter(data),
      isDate: true,
    },
  ];

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          getLogData(
            values?.employee?.EmployeeId,
            values?.fromDate,
            values?.toDate,
            setRowDto,
            setLoading
          );
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
                      <div className="d-flex align-items-center mt-4 pt-1"></div>
                      <ul className="d-flex flex-wrap"></ul>
                    </div>

                    <div className="table-card-body ">
                      <div className="card-style with-form-card pb-0 my-3 ">
                        <div className="row">
                          <div className="input-field-main  col-lg-3">
                            <label>From Date</label>
                            <DefaultInput
                              classes="input-sm"
                              value={values?.fromDate}
                              name="fromDate"
                              type="date"
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue("fromDate", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="input-field-main  col-lg-3">
                            <label>To Date</label>
                            <DefaultInput
                              classes="input-sm"
                              value={values?.toDate}
                              name="toDate"
                              type="date"
                              min={values?.fromDate}
                              max={monthLastDate()}
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue("toDate", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>

                          <div className="input-field-main col-lg-3">
                            <label>Employee</label>
                            <FormikSelect
                              classes="input-sm"
                              name="employee"
                              options={empDDL || []}
                              value={values?.employee}
                              onChange={(valueOption) => {
                                setFieldValue("employee", valueOption);
                              }}
                              placeholder=" "
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                              menuPosition="fixed"
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
                          <AntTable data={rowDto} columnsData={columns} />
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
          </>
        )}
      </Formik>
    </>
  );
};

export default ShiftManagementLog;
