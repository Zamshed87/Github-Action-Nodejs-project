import { useFormik } from "formik";
import React from "react";
import DefaultInput from "../../../../common/DefaultInput";
import { useState } from "react";
import PrimaryButton from "../../../../common/PrimaryButton";
import { useEffect } from "react";
import { getSearchEmployeeListNew } from "../../../../common/api";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  initialValues,
  onGetAttendanceResponse,
  onPostAttendanceResponse,
  validationSchema,
} from "./helper";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import AsyncFormikSelect from "common/AsyncFormikSelect";
import { paginationSize } from "common/peopleDeskTable";
import { DataTable } from "Components";
import { Button, Tag } from "antd";
import { dateFormatter } from "utility/dateFormatter";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { getSerial } from "Utils";
import { useApiRequest } from "Hooks";
import { todayDate } from "utility/todayDate";
import axios from "axios";

function AttendanceRawDataProcess() {
  const { orgId, buId, employeeId, wId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30383) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  const today = moment().format("YYYY-MM-DD");

  //   the api response will throw only a string either success or server error
  const [res, setRes] = useState("");
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const CommonEmployeeDDL = useApiRequest([]);

  useEffect(() => {
    onGetAttendanceResponse(
      wId,
      wgId,
      pages?.pageSize,
      pages?.current,
      setRes,
      setLoading,
      setPages
    );
  }, []);

  const { handleSubmit, values, setFieldValue, errors, touched, resetForm } =
    useFormik({
      enableReinitialize: true,
      initialValues,
      validationSchema,
      onSubmit: (values) => {
        saveHandler(values);
      },
    });

  const saveHandler = (values) => {
    const payload = {
      intAccountId: orgId,
      intWorkplaceGroupId: wgId,
      intWorkplaceId: values?.employee?.value ? 0 : wId, // need to check
      dteFromDate: values?.fromDate,
      dteToDate: values?.toDate,
      intEmployeeId: values?.employee?.value || 0,
    };

    onPostAttendanceResponse({
      setRes,
      setLoading,
      payload,
      cb: () => {
        onGetAttendanceResponse(
          wId,
          wgId,
          pages?.pageSize,
          pages?.current,
          setRes,
          setLoading,
          setPages
        );
      },
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    onGetAttendanceResponse(
      wId,
      wgId,
      pages?.pageSize,
      pages?.current,
      setRes,
      setLoading,
      setPages
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wgId]);
  const landingApi = (pagination) => {
    console.log(pagination);
    onGetAttendanceResponse(
      wId,
      wgId,
      pagination?.pageSize,
      pagination?.current,
      setRes,
      setLoading,
      setPages
    );
  };

  const header = [
    {
      title: "SL",
      render: (_, rec, index) =>
        getSerial({
          currentPage: pages?.current,
          pageSize: pages?.pageSize,
          index,
        }),
      fixed: "left",
      width: 15,
      align: "center",
    },

    {
      title: "Workplace Group",
      dataIndex: "strWorkplaceGroupName",
      sorter: true,
      fieldType: "string",
    },

    {
      title: "Processing For",
      dataIndex: "strProcessingFor",
      sorter: true,
      fieldType: "string",
    },
    {
      title: "From Date",
      dataIndex: "dteFromDate",
      render: (_, record) => dateFormatter(record?.dteFromDate),
      sorter: false,
      filter: false,
      fieldType: "string",
    },
    {
      title: "To Date",
      dataIndex: "dteToDate",
      render: (_, record) => dateFormatter(record?.dteToDate),
      sorter: false,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Processing",
      dataIndex: "strStatus",

      render: (_, record) => (
        <>
          {record?.strStatus === "Pending" && (
            <Tag icon={<ClockCircleOutlined />} color="default">
              Pending
            </Tag>
          )}
          {record?.strStatus === "Processing" && (
            <Tag icon={<SyncOutlined spin />} color="processing">
              Processing
            </Tag>
          )}
          {record?.strStatus === "Success" && (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Success
            </Tag>
          )}
          {record?.strStatus === "Failed" && (
            <Tag icon={<CheckCircleOutlined />} color="magenta">
              Failed
            </Tag>
          )}
        </>
      ),

      sorter: true,
      filter: false,
    },
  ];

  const getEmployee = (value, values) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();
    // const values = form.getFieldsValue(true);

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDLForActiveInactive",
      method: "GET",
      params: {
        workplaceGroupId: wgId,
        searchText: value,
        fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values?.toDate).format("YYYY-MM-DD"),
        businessUnitId: buId,
      },
      onSuccess: (res) => {
        const modifiedData = res?.data?.map((item) => {
          return {
            ...item,
            value: item?.employeeName,
            label: item?.employeeId,
          };
        });
        return modifiedData;
      },
    });
  };

  const getSearchEmployeeListActiveInactive = (v, values) => {
    if (v?.length < 2) return [];

    return axios
      .get(
        `/Employee/CommonEmployeeDDLForActiveInactive?workplaceGroupId=${wgId}&searchText=${v}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&businessUnitId=${buId}`
      )
      .then((res) => {
        const modifiedData = res?.data?.map((item) => {
          return {
            ...item,
            value: item?.employeeId,
            label: item?.employeeName,
          };
        });
        return modifiedData;
      })
      .catch((err) => []);
  };

  return permission?.isView ? (
    <form onSubmit={handleSubmit}>
      {/* {loading && <Loading />} */}
      <div className="table-card">
        <div className="table-card-body">
          <div className="card-style with-form-card pb-0 my-3">
            <div className="row">
              <div
                className="input-field-main col-lg-4"
                style={{ overflow: "hidden", width: "100%", zIndex: 10000 }}
              >
                <label>Employee</label>
                <AsyncFormikSelect
                  selectedValue={values?.employee}
                  isSearchIcon={true}
                  handleChange={(valueOption) => {
                    setFieldValue("employee", valueOption);
                  }}
                  placeholder="Search (min 3 letter)"
                  loadOptions={(v) =>
                    getSearchEmployeeListActiveInactive(v, values)
                  }
                  // isDisabled={!values?.workplaceGroup}
                />
              </div>

              <div className="input-field-main col-lg-3">
                <label>From Date</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.fromDate}
                  name="fromDate"
                  type="date"
                  className="form-control"
                  max={today}
                  onChange={(e) => {
                    setFieldValue("fromDate", e.target.value);
                    setFieldValue("toDate", "");
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="input-field-main col-lg-3">
                <label>To Date</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.toDate}
                  name="toDate"
                  type="date"
                  min={values?.fromDate}
                  max={
                    values?.employee
                      ? // Condition 1: If employee is selected, set max date to 29 days from fromDate
                        moment(values?.fromDate)
                          .add(31, "days")
                          .format("YYYY-MM-DD")
                      : // Condition 2: If no employee is selected, set max date to 6 days from fromDate
                        moment(values?.fromDate)
                          .add(11, "days")
                          .format("YYYY-MM-DD")
                  }
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("toDate", e.target.value);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div style={{ marginTop: "21px" }} className="col-lg-2">
                <div className="d-flex">
                  <PrimaryButton
                    type="submit"
                    className="btn btn-green flex-center"
                    label={"Process"}
                    disabled={loading ? true : false}
                  />
                  {res?.data && (
                    <Button
                      className="btn btn-success flex-center ml-2"
                      onClick={() => {
                        onGetAttendanceResponse(
                          wId,
                          wgId,
                          pages?.pageSize,
                          pages?.current,
                          setRes,
                          setLoading,
                          setPages
                        );
                      }}
                    >
                      Refresh
                    </Button>
                  )}
                </div>
              </div>

              {/* {res !== "" && (
                <div className="col-lg-3">
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
                      resetForm();
                      setRes("");
                    }}
                  />
                </div>
              )} */}
            </div>
            {/* <div className="py-2 pb-4">
              {loading && (
                <>
                  <h3 className="mb-2">Processing</h3>
                  <LinearProgress
                    color="success"
                    sx={{ height: "16px", width: "90%" }}
                  />
                </>
              )}
              {!loading &&
                (res === "success" ? (
                  <>
                    <h3 className="mb-2">Processing Completed</h3>
                    <LinearProgress
                      color="success"
                      sx={{ height: "16px", width: "90%" }}
                      variant="determinate"
                      value={100}
                    />
                  </>
                ) : (
                  res !== "" && (
                    <>
                      <h3 className="mb-2">Something Went Wrong</h3>
                      <ErrorLinearProgress variant="determinate" value={100} />
                    </>
                  )
                ))}
            </div> */}
          </div>
          {res?.data && (
            <DataTable
              header={header}
              bordered
              data={res?.data || []}
              pagination={{
                current: pages?.current,
                pageSize: pages.pageSize, // Page Size From Api Response
                total: pages.total, // Total Count From Api Response
              }}
              loading={loading}
              scroll={{ x: 1000 }}
              onChange={(pagination, filters, sorter, extra) => {
                if (extra.action === "sort") return;
                landingApi(pagination);
              }}
            />
          )}
        </div>
      </div>
    </form>
  ) : (
    <NotPermittedPage />
  );
}

export default AttendanceRawDataProcess;
