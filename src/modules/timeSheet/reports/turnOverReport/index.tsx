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
} from "Components";
import { useApiRequest } from "Hooks";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { monthFirstDate, monthLastDate } from "utility/dateFormatter";
import { empBasicInfo } from "../helper";
import NoResult from "common/NoResult";
import { downloadFile, getPDFAction } from "utility/downloadFile";
import { todayDate } from "utility/todayDate";
import { PModal } from "Components/Modal";
import CommonView from "./CommonView";

const TurnOver = () => {
  const dispatch = useDispatch();
  const [isView, setIsView] = useState(false);
  const [type, setType] = useState("");
  const [period, setPeriod] = useState("");
  const {
    permissionList,
    profileData: { buId, wgId, orgId, wId },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const featurePermission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30529),
    []
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Turn Over Report";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  const [form] = Form.useForm();

  //   api states and actions
  const [loading, setLoading] = useState(false);
  const landingApi = useApiRequest({});

  const landingApiCall = () => {
    const values = form.getFieldsValue(true);
    landingApi.action({
      urlKey: "TurnOver",
      method: "GET",
      params: {
        fromYear: moment(values?.fromDate).format("YYYY"),
        employeeId: values?.employee?.value,
        fromMonth: moment(values?.fromDate).format("MM"),
        toYear: moment(values?.toDate).format("YYYY"),
        toMonth: moment(values?.toDate).format("MM"),
        workplaceId: wId,
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
        title: "Period",
        dataIndex: "period",
        align: "center",
        width: 100,
      },
      {
        title: "Beginning Head Count",
        dataIndex: "beginningHeadCount",
      },
      {
        title: "New Hired",
        dataIndex: "newHired",
        render: (text: any, record: any) => {
          return (
            <div
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                setIsView(true);
                setPeriod(record?.period);
                setType("NewHired");
              }}
            >
              {record?.newHired}
            </div>
          );
        },
      },
      {
        title: "Transfer In",
        dataIndex: "transferIn",
        render: (text: any, record: any) => {
          return (
            <div
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                setIsView(true);
                setPeriod(record?.period);
                setType("TransferIn");
              }}
            >
              {record?.transferIn}
            </div>
          );
        },
      },
      {
        title: "Transfer Out",
        dataIndex: "transferOut",
        render: (text: any, record: any) => {
          return (
            <div
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                setIsView(true);
                setPeriod(record?.period);
                setType("TransferOut");
              }}
            >
              {record?.transferOut}
            </div>
          );
        },
      },
      {
        title: "Separated",
        dataIndex: "separated",
        render: (text: any, record: any) => {
          return (
            <div
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                setIsView(true);
                setPeriod(record?.period);
                setType("Separated");
              }}
            >
              {record?.separated}
            </div>
          );
        },
      },
      {
        title: "Ending Head Count",
        dataIndex: "endingHeadCount",
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
          landingApiCall();
        }}
      >
        <PCard>
          {(landingApi?.data?.loading || loading) && <Loading />}
          <PCardHeader
            exportIcon={false}
            title={`Total ${landingApi?.data?.data?.length || 0} results`}
            onExport={() => {
              const values = form.getFieldsValue(true);
              const url = `/PdfAndExcelReport/GetPunchMachineRawDataPdfNExl?partType=excelView&fromDate=${moment(
                values?.fromDate
              ).format("YYYY-MM-DD")}&toDate=${moment(values?.toDate).format(
                "YYYY-MM-DD"
              )}&employeeId=${
                values?.employee?.value
              }&workplaceGroupId=${wgId}&businessUnitId=${buId}`;
              landingApi?.data?.length > 0 &&
                downloadFile(
                  url,
                  `Attendance Log Report-${todayDate()}`,
                  "xlsx",
                  setLoading
                );
            }}
            printIcon={false}
            pdfExport={() => {
              const values = form.getFieldsValue(true);
              landingApi?.data?.length > 0 &&
                getPDFAction(
                  `/PdfAndExcelReport/GetPunchMachineRawDataPdfNExl?partType=pdfView&fromDate=${moment(
                    values?.fromDate
                  ).format("YYYY-MM-DD")}&toDate=${moment(
                    values?.toDate
                  ).format("YYYY-MM-DD")}&employeeId=${
                    values?.employee?.value
                  }&workplaceGroupId=${wgId}&businessUnitId=${buId}`,
                  setLoading
                );
            }}
          />
          <PCardBody className="">
            <Row gutter={[10, 2]}>
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
          {landingApi?.data?.data?.length > 0 ? (
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
                            Total Beginning Head Count :{" "}
                            <strong>
                              {landingApi?.data?.totalBeginingHeadCount}
                            </strong>{" "}
                          </p>
                          <p>
                            Total New Hired:{" "}
                            <strong>
                              {landingApi?.data?.data?.totalNewHired}
                            </strong>{" "}
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
                            Total Transfer In:{" "}
                            <strong>
                              {landingApi?.data?.data?.totalTransferIn}
                            </strong>{" "}
                          </p>
                          <p>
                            Total Transfer Out:{" "}
                            <strong>
                              {landingApi?.data?.data?.totalTransferOut}
                            </strong>
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
                            Total Separated:{" "}
                            <strong>
                              {landingApi?.data?.data?.totalSeparated}
                            </strong>
                          </p>
                        </div>
                      </Col>
                    </Row>
                  );
                }}
              </Form.Item>

              <DataTable
                bordered
                data={
                  landingApi?.data?.data?.length > 0
                    ? landingApi?.data?.data
                    : []
                }
                loading={landingApi?.loading}
                header={attendanceLogTableHeader()}
              />
            </>
          ) : (
            <NoResult />
          )}
        </PCard>
        <PModal
          title={`${type.replace(/([a-z])([A-Z])/g, "$1 $2")}`}
          open={isView}
          onCancel={() => {
            setIsView(false);
          }}
          components={<CommonView period={period} wId={wId} type={type} />}
          width={1000}
        />
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default TurnOver;
