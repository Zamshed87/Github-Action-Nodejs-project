import {
  BarsOutlined,
  EditOutlined,
  EyeOutlined,
  SyncOutlined,
} from "@ant-design/icons";
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
import { getSerial } from "Utils";
import { Col, Form, Row, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { data, ViewTrainingRequistion } from "./helper";

import { PModal } from "Components/Modal";
import RequisitionView from "./requisitionView";
import Chips from "common/Chips";
const TnDRequisitionLanding = () => {
  // router states
  const history = useHistory();
  // hooks
  const [landingApi, getLandingApi, landingLoading, , landingError] =
    useAxiosGet();

  // state
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModalModal] = useState(false);
  const [viewData, setViewData] = useState<any>(null);

  // Form Instance
  const [form] = Form.useForm();
  // table column
  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          // currentPage: landingApi?.data?.currentPage,
          // pageSize: landingApi?.data?.pageSize,
          currentPage: 1,
          pageSize: 2000,
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
      dataIndex: "status",
      filter: true,
      filterKey: "statusList",
      filterSearch: true,
      render: (status: any) => {
        let statusClass = "secondary p-2 rounded-5"; // Default class

        if (status?.label === "Pending") {
          statusClass = "success p-2 rounded-5";
        } else if (status?.label === "Assigned") {
          statusClass = "secondary p-2 rounded-5";
        } else if (status?.label === "Deferred") {
          statusClass = "warning p-2 rounded-5";
        }

        return (
          <div>
            <Chips label={status?.label} classess={statusClass} />
          </div>
        );
      },
      width: 30,
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
                ViewTrainingRequistion(rec?.id, setLoading, setViewData, () => {
                  setViewModalModal(true);
                });
                // history.push("/trainingAndDevelopment/requisition/view", {
                //   data: rec,
                // });
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
                ViewTrainingRequistion(
                  rec?.id,
                  setLoading,
                  setViewData,
                  (d: any) => {
                    history.push("/trainingAndDevelopment/requisition/edit", {
                      data: d,
                    });
                  }
                );
                history.push("/trainingAndDevelopment/requisition/edit", {
                  data: rec, // need to change
                });
              }}
            />
          </Tooltip>
          {/* <Tooltip placement="bottom" title={"Status"}>
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
          </Tooltip> */}
        </Flex>
      ),
      align: "center",
    },
  ];
  const landingApiCall = (values: any) => {
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
                        landingApiCall(values);
                      })
                      .catch(() => {});
                  }}
                />
              </Col>
            </Row>
          </PCardBody>

          <div className="mb-3">
            <DataTable
              bordered
              data={landingApi || []}
              loading={landingLoading}
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
      {/* Training Title Modal */}
      <PModal
        open={viewModal}
        title={"Training Requisition View"}
        width={1000}
        onCancel={() => {
          setViewModalModal(false);
          // getTrainingTitleDDL(
          //   "/TrainingTitle/Training/Title",
          //   typeDataSetForTitle
          // );
        }}
        maskClosable={false}
        components={
          <>
            <RequisitionView
              data={viewData}
              // setOpenTrainingTitleModal={setOpenTrainingTitleModal}
            />
          </>
        }
      />
    </div>
  );
};

export default TnDRequisitionLanding;
