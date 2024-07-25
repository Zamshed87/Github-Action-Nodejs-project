import { Col, Form, Row } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  dateFormatter,
  monthFirstDate,
  monthLastDate,
} from "utility/dateFormatter";
import { empBasicInfo } from "../helper";
import NoResult from "common/NoResult";

const AttendanceLog = () => {
  const dispatch = useDispatch();
  // redux states data
  const {
    permissionList,
    profileData: { buId, wgId, orgId, employeeId, userName },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const featurePermission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30423),
    []
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Attendance Log";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  const [form] = Form.useForm();

  //   api states and actions
  const [empInfo, setEmpInfo] = useState<any>();
  const CommonEmployeeDDL = useApiRequest([]);
  const landingApi = useApiRequest({});
  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };

  const landingApiCall = () => {
    const values = form.getFieldsValue(true);
    landingApi.action({
      urlKey: "AttendanceLogLanding",
      method: "GET",
      params: {
        employeeId: values?.employee?.value,
        fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values?.toDate).format("YYYY-MM-DD"),
        workplaceGroupId: wgId,
        businessUnitId: buId,
      },
    });
  };

  const attendanceLogTableHeader = () => {
    return [
      {
        title: "SL",
        render: (_: any, rec: any, index: number) => index + 1,
        width: 15,
        align: "center",
      },
      {
        title: "Attendance Date",
        dataIndex: "dteAttendanceDate",
        render: (data: any) => dateFormatter(data),
        align: "center",
        width: 20,
      },
      {
        title: "Attendance Log",
        dataIndex: "attendanceTimeRecord",
      },
    ];
  };

  return featurePermission?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          employee: null,
          fromDate: moment(monthFirstDate()),
          toDate: moment(monthLastDate()),
        }}
        onFinish={() => {
          const { employee } = form.getFieldsValue(true);
          empBasicInfo(buId, orgId, employee?.value, setEmpInfo);
          landingApiCall();
        }}
      >
        <PCard>
          {landingApi?.loading && <Loading />}
          <PCardHeader
            exportIcon={true}
            title={`Total ${landingApi?.data?.length || 0} results`}
            // onSearch={(e) => {
            //   searchFunc(e?.target?.value);
            //   form.setFieldsValue({
            //     search: e?.target?.value,
            //   });
            // }}
            onExport={() => {}}
            printIcon={true}
            pdfExport={() => {}}
          />
          <PCardBody className="">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  name="employee"
                  label="Employee"
                  placeholder="Search Min 2 char"
                  options={CommonEmployeeDDL?.data || []}
                  loading={CommonEmployeeDDL?.loading}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      employee: op,
                    });
                  }}
                  onSearch={(value) => {
                    getEmployee(value);
                  }}
                  showSearch
                  filterOption={false}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="fromDate"
                  label="From Date"
                  placeholder="From Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      fromDate: value,
                    });
                  }}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="toDate"
                  label="To Date"
                  placeholder="To Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      toDate: value,
                    });
                  }}
                />
              </Col>

              <Col
                style={{
                  marginTop: "23px",
                }}
              >
                <PButton type="primary" action="submit" content="View" />
              </Col>
            </Row>
          </PCardBody>
          {landingApi?.data?.length > 0 ? (
            <>
              <Form.Item shouldUpdate noStyle>
                {() => {
                  return (
                    <Row
                      className="mb-1"
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        borderRadius: "6px",
                        padding: "10px",
                        marginRight: "0",
                        marginLeft: "0",
                        marginTop: "15px",
                      }}
                    >
                      <Col
                        md={6}
                        sm={12}
                        xs={24}
                        style={{
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        <div
                          className="card-des"
                          style={{
                            fontSize: "17px",
                          }}
                        >
                          <p>
                            Employee:{" "}
                            <strong>
                              {empInfo?.[0]?.EmployeeName} -
                              {empInfo?.[0]?.EmployeeCode}
                            </strong>{" "}
                          </p>
                          <p>
                            Workplace Group:{" "}
                            <strong>{empInfo?.[0]?.WorkplaceGroupName}</strong>{" "}
                          </p>
                          <p>
                            Workplace Name:{" "}
                            <strong>{empInfo?.[0]?.WorkplaceName}</strong>{" "}
                          </p>
                        </div>
                      </Col>
                      <Col
                        md={6}
                        sm={12}
                        xs={24}
                        style={{
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          paddingLeft: "10px",
                        }}
                      >
                        <div className="card-des" style={{}}>
                          <p>
                            HR Position:{" "}
                            <strong>{empInfo?.[0]?.PositionName}</strong>
                          </p>
                          {/* <p>
                            Business Unit:{" "}
                            <strong>{empInfo?.[0]?.BusinessUnitName}</strong>
                          </p> */}
                          <p>
                            Joining Date:{" "}
                            <strong>
                              {dateFormatter(empInfo?.[0]?.JoiningDate)}
                            </strong>
                          </p>
                        </div>
                      </Col>
                      <Col
                        md={6}
                        sm={12}
                        xs={24}
                        style={{
                          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          paddingLeft: "10px",
                        }}
                      >
                        <div
                          className="card-des"
                          style={{
                            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          }}
                        >
                          <p>
                            Designation:{" "}
                            <strong>{empInfo?.[0]?.DesignationName}</strong>
                          </p>
                          <p>
                            Department:{" "}
                            <strong>{empInfo?.[0]?.DepartmentName}</strong>{" "}
                          </p>
                        </div>
                      </Col>
                      <Col
                        md={6}
                        sm={12}
                        xs={24}
                        style={{
                          paddingLeft: "10px",
                        }}
                      >
                        <div className="card-des">
                          <p>
                            Employment Type:{" "}
                            <strong>{empInfo?.[0]?.EmploymentTypeName}</strong>
                          </p>
                          <p>
                            {"Supervisor"}:{" "}
                            <strong>{empInfo?.[0]?.SupervisorName}</strong>
                          </p>
                        </div>
                      </Col>
                    </Row>
                  );
                }}
              </Form.Item>

              <DataTable
                bordered
                data={landingApi?.data?.length > 0 ? landingApi?.data : []}
                loading={landingApi?.loading}
                header={attendanceLogTableHeader()}
              />
            </>
          ) : (
            <NoResult />
          )}
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default AttendanceLog;
