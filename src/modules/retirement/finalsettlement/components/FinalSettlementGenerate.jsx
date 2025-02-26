import { useParams } from "react-router-dom";
import EmployeeDetails from "./EmployeeDetails";
import PrimaryButton from "common/PrimaryButton";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import BackButton from "common/BackButton";
import { Card, Col, Row, Table, Typography } from "antd";
import { DataTable } from "Components";

export default function FinalSettlementGenerate() {
  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const dispatch = useDispatch();
  const params = useParams();
  const [, getSingleEmployeeData, getSingleEmployeeLoading] = useAxiosGet();

  const [empBasic, setEmpBasic] = useState({});

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
  }, [params?.separationid]);

  return (
    <div className="table-card businessUnit-wrapper dashboard-scroll">
      <div className="d-flex  justify-content-between">
        <div className="d-flex align-items-center">
          <BackButton />
          <h2>Final Settlement Generate</h2>
        </div>
        <PrimaryButton
          className="btn btn-green btn-green-disable mb-2"
          type="submit"
          label="Save"
        />
      </div>
      <EmployeeDetails loading={getSingleEmployeeLoading} employee={empBasic} />
      <Row gutter={[48, 16]} style={{ marginTop: "20px" }}>
        <Col span={8}>
          <Card
            title="Final Settlement Due Summary"
            style={{
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }}
            loading={getSingleEmployeeLoading}
          >
            <DataTable
              showHeader={false}
              bordered
              pagination={false}
              data={[
                {
                  name: "Total Due Salary",
                  info: "Info.",
                  value: 100,
                },
                {
                  name: "Total Others Due",
                  info: "Info.",
                  value: 100,
                },
                {
                  name: "Others Deduction",
                  info: "Number",
                  value: 10,
                },
                {
                  name: "Others Addition",
                  info: "Number",
                  value: 20,
                },
                {
                  name: <b>Total Payable Amount</b>,
                  info: <b>info</b>,
                  value: <b>210</b>,
                },
              ]}
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
                {
                  title: "value",
                  dataIndex: "value",
                  align: "right",
                },
              ]}
            />
          </Card>
        </Col>
        <Col span={13} offset={1}>
          <Card
            title="Approval History Details"
            style={{
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }}
            loading={getSingleEmployeeLoading}
          >
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
          </Card>
        </Col>
      </Row>
      <Row gutter={[48, 16]} style={{ marginTop: "20px" }}>
        <Col span={8}>
          <Card
            title="Due Salary"
            style={{
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }}
            loading={getSingleEmployeeLoading}
          >
            <DataTable
              showHeader={false}
              bordered
              pagination={false}
              data={[
                {
                  name: <b>Due Salary as Salary Generate</b>,
                  info: <b>32,000</b>,
                },
              ]}
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
            />
          </Card>
          <Card
            title="Others Due"
            style={{
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              marginTop: "20px",
            }}
            loading={getSingleEmployeeLoading}
          >
            <DataTable
              showHeader={false}
              bordered
              pagination={false}
              data={[
                {
                  name: "Provident Fund (PF)",
                  info: "1,15,000",
                },
                {
                  name: "Gratuity",
                  info: "2,00,000",
                },
                {
                  name: "Leave Encashment",
                  info: "1,50,000",
                },
                {
                  name: <b>Total Others Due</b>,
                  info: <b>4,65,000</b>,
                },
              ]}
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
            />
          </Card>
        </Col>
        <Col span={13} offset={1}>
          <Card
            title="Assets History Details"
            style={{
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }}
            loading={getSingleEmployeeLoading}
          >
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
    </div>
  );
}
