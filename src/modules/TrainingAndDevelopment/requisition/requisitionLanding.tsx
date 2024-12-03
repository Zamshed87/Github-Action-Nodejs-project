import React, { useEffect, useState } from "react";
import { Col, Form, FormInstance, Row, Tooltip } from "antd";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import {
  DataTable,
  Flex,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
} from "Components";
import Loading from "common/loading/Loading";
import { getSerial } from "Utils";
import { dateFormatter } from "utility/dateFormatter";
import { BarsOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { data } from "./helper";
const TnDRequisitionLanding = () => {
  // router states
  const history = useHistory();
  // hooks
  const [landingApi, getLandingApi, landingLoading, , landingError] =
    useAxiosGet();

  // state
  const [loading, setLoading] = useState(false);

  // Form Instance
  const [form] = Form.useForm();
  // table column
  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.data?.currentPage,
          pageSize: landingApi?.data?.pageSize,
          index,
        }),
      fixed: "left",
      align: "center",
    },
    {
      title: "Requestor",
      dataIndex: "employmentName",
      filter: true,
      filterKey: "requestorList",
      filterSearch: true,
    },
    {
      title: "Training Type",
      dataIndex: "trainingTypeName",
      filter: true,
      filterKey: "trainingTypeList",
      filterSearch: true,
    },
    // {
    //   title: "Created by",
    //   dataIndex: "createdBy",
    //   filter: true,
    //   filterKey: "createdByList",
    //   filterSearch: true,
    // },
    // {
    //   title: "Created Date",
    //   dataIndex: "createdDate",
    //   render: (data: any) => dateFormatter(data),
    //   filter: true,
    //   sorter: true,
    // },
    {
      title: "Status",
      dataIndex: "trainingStatus",
      filter: true,
      filterKey: "statusList",
      filterSearch: true,
    },
    {
      title: "Action",
      dataIndex: "letterGenerateId",
      render: (generateId: number, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title={"View"}>
            <EyeOutlined
              style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
              onClick={() => {
                history.push("/trainingAndDevelopment/requisition/view", {
                  data: rec,
                });
              }}
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"Edit"}>
            <EditOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                history.push("/trainingAndDevelopment/requisition/edit", {
                  data: rec,
                });
              }}
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"Status"}>
            <BarsOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                history.push("/trainingAndDevelopment/requisition/status", {
                  data: rec,
                });
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
    },
  ];
  const landingApiCall = (values: any) => {
    console.log(values);
    getLandingApi("/TrainingRequisition/Training/TrainingRequisition");
  };
  useEffect(() => {
    landingApiCall({});
  }, []);

  return (
    <div>
      {loading || (landingLoading && <Loading />)}
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            title={`Total ${
              landingApi?.data?.totalCount || 0
            } Training Requisition`}
            buttonList={[
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  history.push("/trainingAndDevelopment/requisition/create");
                },
              },
            ]}
          />
          <PCardBody>
            <Row gutter={[10, 2]}>
              <Col md={6} sm={24}>
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
                  rules={[
                    {
                      required: true,
                      message: "From Date is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
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
                  rules={[
                    {
                      required: true,
                      message: "To Date is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PButton
                  style={{ marginTop: "22px" }}
                  type="primary"
                  content="View"
                  onClick={() => {
                    const values = form.getFieldsValue(true);
                    form
                      .validateFields()
                      .then(() => {
                        console.log(values);
                        landingApiCall(values);
                      })
                      .catch(() => {
                        console.log("error");
                      });
                  }}
                />
              </Col>
            </Row>
          </PCardBody>

          <div className="mb-3">
            <DataTable
              bordered
              data={landingApi || []}
              loading={landingApi?.loading}
              header={header}
              pagination={{
                pageSize: landingApi?.data?.pageSize,
                total: landingApi?.data?.totalCount,
              }}
              filterData={landingApi?.data?.filters}
              onChange={(pagination, filters) => {
                landingApiCall({});
              }}
            />
          </div>
        </PCard>
      </PForm>
    </div>
  );
};

export default TnDRequisitionLanding;
