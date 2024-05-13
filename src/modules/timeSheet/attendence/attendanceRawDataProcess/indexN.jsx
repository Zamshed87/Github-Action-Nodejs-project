import { useFormik } from "formik";
import React from "react";
import DefaultInput from "../../../../common/DefaultInput";
import { useState } from "react";
import PrimaryButton from "../../../../common/PrimaryButton";
import { useEffect } from "react";
import { getSearchEmployeeListNew } from "../../../../common/api";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  calcDateDiff,
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
import { CheckCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { getSerial } from "Utils";

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

  useEffect(() =>{
    onGetAttendanceResponse(
      wId,
      wgId,
      pages?.pageSize,
      pages?.current,
      setRes,
      setLoading,
      setPages
    );
  },[])

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
      intAccountId: employeeId,
      intWorkplaceId: wId,
      dteFromDate: values?.fromDate,
      dteToDate: values?.toDate,
      intEmployeeId: values?.employee?.value || 0,
      intCreatedBy: 0,
      dteCreatedAt: "2024-02-15T08:50:05.869Z",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const landingApi = (pagination) => {
    console.log(pagination)
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
  console.log({pages})

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
      dataIndex: "isProcessing",
      render: (_, record) => (
        <>
          {record?.isProcessing ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              success
            </Tag>
          ) : (
            <Tag icon={<SyncOutlined spin />} color="processing">
              processing
            </Tag>
          )}
        </>
      ),
      sorter: true,
      filter: false,
    },
  ];

  return permission?.isView ? (
    <form onSubmit={handleSubmit}>
      {/* {loading && <Loading />} */}
      <div className="table-card">
        <div className="table-card-body">
          <div className="card-style with-form-card pb-0 my-3">
            <div className="row">
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
                    values?.employee ? 
                    // Condition 1: If employee is selected, set max date to 45 days from fromDate
                    moment(values?.fromDate).add(44, 'days').format("YYYY-MM-DD") : 
                    // Condition 2: If no employee is selected, set max date to 7 days from fromDate
                    moment(values?.fromDate).add(6, 'days').format("YYYY-MM-DD")
                }
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
                <AsyncFormikSelect
                  selectedValue={values?.employee}
                  isSearchIcon={true}
                  handleChange={(valueOption) => {
                    setFieldValue("employee", valueOption);
                  }}
                  placeholder="Search (min 3 letter)"
                  loadOptions={(v) => getSearchEmployeeListNew(buId, orgId, v)}
                  // isDisabled={!values?.workplaceGroup}
                />
              </div>

              <div style={{ marginTop: "21px" }} className="col-lg-3">
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
      </div>
    </form>
  ) : (
    <NotPermittedPage />
  );
}

export default AttendanceRawDataProcess;
