import { DataTable } from "Components";
import { Card, Col, Collapse, Divider, Row } from "antd";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { dataFormatter } from "../helper";
import EmployeeDetails from "./EmployeeDetails";

export default function FinalSettlementViewModal({ id, empId }) {
  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [, getSingleEmployeeData, getSingleEmployeeLoading] = useAxiosGet();
  const [, getFinalSettlementData, getFinalSettlementLoading] = useAxiosGet();
  const [empBasic, setEmpBasic] = useState({});
  const [singleFinalSettlementData, setSingleFinalSettlementData] = useState(
    {}
  );

  useEffect(() => {
    getSingleEmployeeData(
      `/SaasMasterData/GetEmpSeparationViewById?AccountId=${orgId}&Id=${id}`,
      (res) => {
        setEmpBasic(res);
      }
    );
    getFinalSettlementData(
      `/FinalSettlement/GetFinalSettlement?separationId=${id}&employeeId=${empId}`,
      (res) => {
        setSingleFinalSettlementData(res?.data);
      }
    );
  }, [id]);
  return (
    <>
      <EmployeeDetails loading={getSingleEmployeeLoading} employee={empBasic} />
      <Row gutter={[8, 8]} style={{ marginTop: "20px" }}>
        <Col span={9}>
          <Card
            style={{
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }}
            loading={getFinalSettlementLoading}
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
                  value: singleFinalSettlementData?.summary?.otherAddition || 0,
                },
                {
                  name: "Total Payable Amount",
                  value: singleFinalSettlementData?.netPayableAmount || 0,
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
                  render: (data) => {
                    if (data === "Total Payable Amount") {
                      return <b>{dataFormatter(data)}</b>;
                    }
                    return dataFormatter(data);
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
            loading={getFinalSettlementLoading}
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
              data={[
                {
                  SL: 1,
                  Approver: "Admin",
                  "Approver Name": "John Doe",
                  "Approval Date": "2022-01-01 12:00:00",
                  Status: "Approved",
                  Comments: "no comments",
                },
                {
                  SL: 2,
                  Approver: "Finance",
                  "Approver Name": "Jane Doe",
                  "Approval Date": "2022-01-02 12:00:00",
                  Status: "Rejected",
                  Comments: "Need More Information",
                },
              ]}
              header={[
                {
                  title: "SL",
                  dataIndex: "SL",
                },
                {
                  title: "Approver",
                  dataIndex: "Approver",
                },
                {
                  title: "Approver Name",
                  dataIndex: "Approver Name",
                },
                {
                  title: "Approval Date",
                  dataIndex: "Approval Date",
                },
                {
                  title: "Status",
                  dataIndex: "Approval Date",
                  align: "right",
                },
                {
                  title: "Comments",
                  dataIndex: "Comments",
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
              data={[
                {
                  SL: 1,
                  "Asset Name": "Laptop",
                  UoM: "Pcs",
                  "Last Assign Date": "2022-01-01 12:00:00",
                  Status: "Assigned",
                },
                {
                  SL: 2,
                  "Asset Name": "Mouse",
                  UoM: "Pcs",
                  "Last Assign Date": "2022-01-02 12:00:00",
                  Status: "Assigned",
                },
                {
                  SL: 3,
                  "Asset Name": "Keyboard",
                  UoM: "Pcs",
                  "Last Assign Date": "2022-01-03 12:00:00",
                  Status: "Assigned",
                },
              ]}
              header={[
                {
                  title: "SL",
                  dataIndex: "SL",
                },
                {
                  title: "Asset Name",
                  dataIndex: "Asset Name",
                },
                {
                  title: "UoM",
                  dataIndex: "UoM",
                },
                {
                  title: "Last Assign Date",
                  dataIndex: "Last Assign Date",
                },
                {
                  title: "Status",
                  dataIndex: "Status",
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
