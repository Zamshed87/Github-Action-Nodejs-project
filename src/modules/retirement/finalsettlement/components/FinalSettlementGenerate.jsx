import { Card, Col, Collapse, Divider, Input, Row } from "antd";
import BackButton from "common/BackButton";
import PrimaryButton from "common/PrimaryButton";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { DataTable, PInput } from "Components";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { dataFormatter } from "../helper";
import EmployeeDetails from "./EmployeeDetails";
import Chips from "common/Chips";

export default function FinalSettlementGenerate() {
  const { orgId, intAccountId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();
  const [, getSingleEmployeeData, singleEmployeeLoading] = useAxiosGet();
  const [, getFinalSettlementData, finalSettlementLoading] = useAxiosGet();
  const [, getApprovalHistoryData] = useAxiosGet();
  const [, getAssestHistoryData] = useAxiosGet();
  const [, postFinalSettlementData] = useAxiosPost();

  const [empBasic, setEmpBasic] = useState({});
  const [singleFinalSettlementData, setSingleFinalSettlementData] = useState(
    {}
  );
  const [approvalHistoryData, setApprovalHistoryData] = useState([]);
  const [asesstHistoryData, setAssestHistoryData] = useState([]);

  const { setFieldValue, values, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      otherDeduction: 0,
      otherAddition: 0,
      remarks: "",
    },
    onSubmit: (values) => {
      setSingleFinalSettlementData((prev) => ({
        ...prev,
        summary: {
          ...prev?.summary,
          otherDeduction: values?.otherDeduction,
          otherAddition: values?.otherAddition,
        },
      }));
      const payload = {
        finalSettlementId: singleFinalSettlementData?.finalSettlementId,
        intSeparationId: singleFinalSettlementData?.intSeparationId,
        intEmployeeId: singleFinalSettlementData?.intEmployeeId,
        strEmployeeName: singleFinalSettlementData?.strEmployeeName,
        strEmployeeCode: singleFinalSettlementData?.strEmployeeCode,
        fromDate: singleFinalSettlementData?.fromDate,
        toDate: singleFinalSettlementData?.toDate,
        totalAllowance: singleFinalSettlementData?.totalAllowance,
        totalDeduction: singleFinalSettlementData?.totalDeduction,
        tax: singleFinalSettlementData?.tax,
        pf: singleFinalSettlementData?.pf,
        remarks: values?.remarks,
        rows: singleFinalSettlementData?.rows,
        loan: singleFinalSettlementData?.loan,
        absentDeduction: singleFinalSettlementData?.absentDeduction,
        earlyResignDeduction: singleFinalSettlementData?.earlyResignDeduction,
        grossSalary: singleFinalSettlementData?.grossSalary,
        headers: singleFinalSettlementData?.headers,
        netPayableAmount: singleFinalSettlementData?.netPayableAmount,
        othersDues: singleFinalSettlementData?.othersDues ?? [],
        summary: {
          ...singleFinalSettlementData?.summary,
          otherAddition: values?.otherAddition ?? 0,
          otherDeduction: values?.otherDeduction ?? 0,
        },
        earnings: singleFinalSettlementData?.earnings ?? [],
        deductions: singleFinalSettlementData?.deductions ?? [],
      };

      postFinalSettlementData(
        `/FinalSettlement/SaveFinalSettlement`,
        payload,
        () => {
          history.push("/retirement/finalsettlement");
        },
        true
      );
    },
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Retirement"));
    document.title = "Final Settlement Generate";
  }, [dispatch]);

  useEffect(() => {
    getSingleEmployeeData(
      `/SaasMasterData/GetEmpSeparationViewById?AccountId=${orgId}&Id=${params?.separationid}`,
      (res) => {
        setEmpBasic(res);
      }
    );
    getApprovalHistoryData(
      `Approval/GetApproverList?accountId=${intAccountId}&applicationType=${21}&applicationId=${
        params?.separationid
      }`,
      (res) => {
        setApprovalHistoryData(res);
      }
    );
    getAssestHistoryData(
      `Separation/GetEmployeeAssets?separationId=${params?.separationid}`,
      (res) => {
        setAssestHistoryData(res?.data);
      }
    );
    getFinalSettlementData(
      `/FinalSettlement/GenerateFinalSettlement?separationId=${params?.separationid}&employeeId=${params?.empid}`,
      (res) => {
        setSingleFinalSettlementData(res?.data);
        setFieldValue("otherDeduction", res?.data?.summary?.otherDeduction);
        setFieldValue("otherAddition", res?.data?.summary?.otherAddition);
      }
    );
  }, [params?.separationid]);
  return (
    <div className="table-card businessUnit-wrapper dashboard-scroll">
      <form onSubmit={handleSubmit}>
        <div className="d-flex  justify-content-between">
          <div className="d-flex align-items-center">
            <BackButton />
            <h2>Final Settlement Generate</h2>
          </div>
          <PrimaryButton
            className="btn btn-green btn-green-disable mb-2 mr-2"
            type="submit"
            label="Save"
          />
        </div>
        <EmployeeDetails loading={singleEmployeeLoading} employee={empBasic} />
        <Row gutter={[8, 8]} style={{ marginTop: "20px" }}>
          <Col span={9}>
            <Card
              style={{
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              }}
              loading={finalSettlementLoading}
            >
              <Divider
                orientation="left"
                style={{ borderColor: "#34a853", fontWeight: "600" }}
              >
                Final Settlement Due Summary
              </Divider>
              <DataTable
                showHeader={false}
                bordered
                pagination={false}
                data={[
                  {
                    name: "Total Due Salary",
                    value:
                      singleFinalSettlementData?.summary?.totalDueSalary || 0,
                  },
                  {
                    name: "Total Others Due",
                    value:
                      singleFinalSettlementData?.summary?.totalOthersDue || 0,
                  },
                  {
                    name: "Others Deduction",
                    value:
                      singleFinalSettlementData?.summary?.otherDeduction || 0,
                  },
                  {
                    name: "Others Addition",
                    value:
                      singleFinalSettlementData?.summary?.otherAddition || 0,
                  },
                  {
                    name: "Total Payable Amount",
                    value:
                      singleFinalSettlementData?.summary?.totalDueSalary +
                        singleFinalSettlementData?.summary?.totalOthersDue -
                        values?.otherDeduction +
                        values?.otherAddition || 0,
                  },
                ]}
                header={[
                  {
                    title: "name",
                    dataIndex: "name",
                    render: (data) => {
                      if (data === "Total Payable Amount") {
                        return <b>{data}</b>;
                      }
                      return data;
                    },
                  },
                  {
                    title: "value",
                    dataIndex: "value",
                    align: "right",
                    render: (data, record) => {
                      {
                        if (record?.name === "Total Payable Amount") {
                          return <b>{dataFormatter(data)}</b>;
                        } else if (record?.name === "Others Deduction") {
                          return (
                            <Input
                              value={values?.otherDeduction}
                              type="text"
                              inputMode="numeric"
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 0) {
                                  setFieldValue("otherDeduction", value);
                                }
                              }}
                              size="small"
                              style={{
                                fontSize: "11px",
                                textAlign: "right",
                                padding: 0,
                                borderColor: "#34a853",
                                width: "40%",
                              }}
                            />
                          );
                        } else if (record?.name === "Others Addition") {
                          return (
                            <Input
                              value={values?.otherAddition}
                              type="text"
                              inputMode="numeric"
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 0) {
                                  setFieldValue("otherAddition", value);
                                }
                              }}
                              size="small"
                              style={{
                                fontSize: "11px",
                                textAlign: "right",
                                padding: 0,
                                borderColor: "#34a853",
                                width: "40%",
                              }}
                            />
                          );
                        } else {
                          return dataFormatter(data);
                        }
                      }
                    },
                  },
                ]}
              />
              <Divider
                orientation="left"
                style={{
                  borderColor: "#34a853",
                  marginTop: "20px",
                  fontWeight: "600",
                }}
              >
                Due Salary
              </Divider>
              <Collapse
                bordered={false}
                ghost={true}
                accordion={true}
                defaultActiveKey={["0"]}
              >
                <Collapse.Panel
                  header={
                    <DataTable
                      showHeader={false}
                      bordered
                      pagination={false}
                      header={[
                        {
                          title: "name",
                          dataIndex: "name",
                        },
                        {
                          title: "info",
                          dataIndex: "info",
                          align: "right",
                        },
                      ]}
                      data={[
                        {
                          name: <b>Due Salary as Salary Generate</b>,
                          info: (
                            <b>
                              {dataFormatter(
                                singleFinalSettlementData?.earnings?.reduce(
                                  (a, b) => a + b.actualAmount,
                                  0
                                )
                              )}
                            </b>
                          ),
                        },
                      ]}
                    />
                  }
                  key="1"
                  style={{ padding: 0 }}
                >
                  <DataTable
                    showHeader={false}
                    bordered
                    pagination={false}
                    data={singleFinalSettlementData?.earnings || []}
                    header={[
                      {
                        title: "name",
                        dataIndex: "strElementName",
                      },
                      {
                        title: "info",
                        dataIndex: "actualAmount",
                        align: "right",
                        render: (data) => dataFormatter(data),
                      },
                    ]}
                  />
                </Collapse.Panel>
              </Collapse>
              <Divider
                orientation="left"
                style={{
                  borderColor: "#34a853",
                  marginTop: "20px",
                  fontWeight: "600",
                }}
              >
                Deductions
              </Divider>
              <DataTable
                showHeader={false}
                pagination={false}
                data={singleFinalSettlementData?.deductions || []}
                header={[
                  {
                    title: "name",
                    dataIndex: "strElementName",
                    render: (data) => (data === "Early Resign" ? null : data),
                  },
                  {
                    title: "info",
                    dataIndex: "amount",
                    align: "right",
                    render: (_, record) =>
                      record.strElementName === "Early Resign"
                        ? null
                        : record.amount,
                  },
                ]}
              />
              <Divider
                orientation="left"
                style={{
                  borderColor: "#34a853",
                  marginTop: "20px",
                  fontWeight: "600",
                }}
              >
                Others Due
              </Divider>
              <DataTable
                showHeader={false}
                pagination={false}
                data={singleFinalSettlementData?.othersDues || []}
                header={[
                  {
                    title: "name",
                    dataIndex: "strElementName",
                    render: (data) =>
                      data === "Total Others Due" ? <b>{data}</b> : data,
                  },
                  {
                    title: "info",
                    dataIndex: "amount",
                    align: "right",
                    render: (data, record) =>
                      record.strElementName === "Total Others Due" ? (
                        <b>{dataFormatter(data)}</b>
                      ) : (
                        dataFormatter(data)
                      ),
                  },
                ]}
              />
            </Card>
          </Col>
          <Col span={12} offset={2}>
            <Card
              style={{
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              }}
              loading={finalSettlementLoading}
            >
              <Divider
                orientation="left"
                style={{ borderColor: "#34a853", fontWeight: "600" }}
              >
                Approval History Details
              </Divider>
              <DataTable
                bordered
                pagination={false}
                data={approvalHistoryData || []}
                header={[
                  {
                    title: "Approver",
                    dataIndex: "approverTypeName",
                  },
                  {
                    title: "Approver Name",
                    dataIndex: "approverName",
                  },
                  {
                    title: "Status",
                    dataIndex: "isApprove",
                    align: "left",
                    render: (data, record) => {
                      if (record?.isApprove === true) {
                        return (
                          <Chips label="Approved" classess="success p-2" />
                        );
                      } else {
                        return <Chips label="Pending" classess="warning p-2" />;
                      }
                    },
                  },
                ]}
              />
              <Divider
                orientation="left"
                style={{
                  borderColor: "#34a853",
                  marginTop: "20px",
                  fontWeight: "600",
                }}
              >
                Assets History Details
              </Divider>
              <DataTable
                bordered
                pagination={false}
                data={asesstHistoryData || []}
                header={[
                  {
                    title: "Asset Name",
                    dataIndex: "ItemName",
                  },
                  {
                    title: "UoM",
                    dataIndex: "ItemUom",
                  },
                  {
                    title: "Last Assign Date",
                    dataIndex: "AssignDate",
                  },
                  {
                    title: "Status",
                    dataIndex: "Active",
                  },
                ]}
              />
              <Divider
                orientation="left"
                style={{
                  borderColor: "#34a853",
                  marginTop: "20px",
                  fontWeight: "600",
                }}
              >
                Remarks
              </Divider>
              <PInput
                style={{ fontSize: "11px" }}
                type="textarea"
                value={values?.remarks}
                onChange={(e) => setFieldValue("remarks", e.target.value)}
              />
            </Card>
          </Col>
        </Row>
      </form>
    </div>
  );
}
