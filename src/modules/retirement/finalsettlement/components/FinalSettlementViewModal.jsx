import { DataTable } from "Components";
import { Card, Col, Collapse, Divider, Row } from "antd";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { dataFormatter } from "../helper";
import EmployeeDetails from "./EmployeeDetails";
import Chips from "common/Chips";
import { dateFormatter } from "utility/dateFormatter";

export default function FinalSettlementViewModal({ id, empId, clearanceId }) {
  const { orgId, intAccountId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [, getSingleEmployeeData, getSingleEmployeeLoading] = useAxiosGet();
  const [, getFinalSettlementData, getFinalSettlementLoading] = useAxiosGet();
  const [, getApprovalHistoryData] = useAxiosGet();
  const [, getAssestHistoryData] = useAxiosGet();
  const [empBasic, setEmpBasic] = useState({});
  const [singleFinalSettlementData, setSingleFinalSettlementData] = useState(
    {}
  );
  const [approvalHistoryData, setApprovalHistoryData] = useState([]);
  const [asesstHistoryData, setAssestHistoryData] = useState([]);

  useEffect(() => {
    getSingleEmployeeData(
      `/SaasMasterData/GetEmpSeparationViewById?AccountId=${orgId}&Id=${id}`,
      (res) => {
        setEmpBasic(res);
      }
    );
    getApprovalHistoryData(
      `Approval/GetApproverList?accountId=${intAccountId}&applicationType=${29}&applicationId=${clearanceId}`,
      (res) => {
        setApprovalHistoryData(res);
      }
    );
    getAssestHistoryData(
      `Separation/GetEmployeeAssets?employeeId=${empId}`,
      (res) => {
        setAssestHistoryData(res?.data);
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
                  name: "Others Addition",
                  value: singleFinalSettlementData?.summary?.otherAddition || 0,
                },
                {
                  name: "Others Deduction",
                  value:
                    singleFinalSettlementData?.summary?.otherDeduction || 0,
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
              collapsible="disabled"
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
                              singleFinalSettlementData?.summary?.totalDueSalary
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
                      : dataFormatter(record.amount),
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
                      return <Chips label="Approved" classess="success p-2" />;
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
                  dataIndex: "itemName",
                },
                {
                  title: "UoM",
                  dataIndex: "itemUom",
                },
                {
                  title: "Last Assign Date",
                  dataIndex: "assignDate",
                  render: (data) => dateFormatter(data),
                },
                {
                  title: "Status",
                  dataIndex: "active",
                  render: (data, record) => {
                    if (record?.active === true) {
                      return <Chips label="Active" classess="success p-2" />;
                    } else {
                      return <Chips label="Inactive" classess="warning p-2" />;
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
              Remarks
            </Divider>
            {singleFinalSettlementData?.remarks && (
              <div
                style={{
                  borderRadius: "10px",
                  padding: "10px",
                  border: "1px solid #34a853",
                }}
              >
                <p>{singleFinalSettlementData?.remarks}</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
}
