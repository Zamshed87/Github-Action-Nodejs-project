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
  PSelect,
} from "Components";
import { getSerial } from "Utils";
import { Col, Form, Row, Space, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";

import { PModal } from "Components/Modal";
import Chips from "common/Chips";
import UserInfoCommonField from "../userInfoCommonField";
import { getEnumData } from "common/api/commonApi";
import { filter } from "lodash";
const TnDInventory = () => {
  // router states
  const history = useHistory();
  // hooks
  const [landingApi, getLandingApi, landingLoading, , landingError] =
    useAxiosGet();

  // state
  const [loading, setLoading] = useState(false);
  const [
    trainingTypeDDL,
    getTrainingTypeDDL,
    loadingTrainingType,
    setTrainingType,
  ] = useAxiosGet();

  const [
    trainingTitleDDL,
    getTrainingTitleDDL,
    loadingTrainingTitle,
    setTrainingTitle,
  ] = useAxiosGet();

  const [trainingModeStatusDDL, setTrainingModeStatusDDL] = useState<any>([]);

  // Form Instance
  const [form] = Form.useForm();
  // table column
  const header = [
    {
      title: "SL",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Workplace Group",
      dataIndex: "workplaceGroup",
      filter: true,
      filterKey: "workplaceGroupList",
      filterSearch: true,
    },
    {
      title: "Workplace",
      dataIndex: "workplace",
      filter: true,
      filterKey: "workplaceList",
      filterSearch: true,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
    },
    {
      title: "Designation",
      dataIndex: "designation",
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "No of Training",
      dataIndex: "noOfTraining",
      filter: true,
      filterKey: "noOfTrainingList",
      filterSearch: true,
    },
    {
      title: "Training Hour",
      dataIndex: "trainingHour",
    },
    {
      title: "Total Training Cost",
      dataIndex: "totalTrainingCost",
      filter: true,
      filterKey: "totalTrainingCostList",
      filterSearch: true,
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (_: any, rec: any) => (
        <Space size="middle">
          <Tooltip placement="bottom" title="Delete">
            {/* <DeleteOutlined
              style={{
                color: 'red',
                fontSize: '14px',
                cursor: 'pointer',
                margin: '0 5px',
              }}
              onClick={() => {
                const updatedperticipantField = trainingTime.filter(
                  (item: any) => item.id !== rec.id
                );
                changeTrainingStatus(form, updatedperticipantField);
                setTrainingTime(updatedperticipantField);
              }}
            /> */}
          </Tooltip>
        </Space>
      ),
      align: "center",
      width: 40,
    },
  ];
  const typeDataSetForType = (data: any) => {
    const list: any[] = [];
    data?.map((d: any) => {
      if (d?.isActive === true) list.push({ label: d?.name, value: d?.id });
    });
    setTrainingType(list);
  };

  const typeDataSetForTitle = (data: any) => {
    const list: any[] = [];
    data?.map((d: any) => {
      if (d?.isActive === true) list.push({ label: d?.name, value: d?.id });
    });
    setTrainingTitle(list);
  };
  const landingApiCall = (values: any) => {
    getLandingApi("/TrainingRequisition/Training/TrainingRequisition");
  };
  useEffect(() => {
    landingApiCall({});
    getTrainingTypeDDL("/TrainingType/Training/Type", typeDataSetForType);
    getTrainingTitleDDL("/TrainingTitle/Training/Title", typeDataSetForTitle);
    getEnumData("TrainingModeStatus", setTrainingModeStatusDDL);
  }, []);

  return (
    <div>
      {loading || (landingLoading && <Loading />)}
      <PForm form={form} initialValues={{}}>
        <PCard>
          {/* <PCardHeader
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
          /> */}
          <PCardBody>
            <Row gutter={[10, 2]}>
              <UserInfoCommonField form={form} />
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={trainingTypeDDL || []}
                  name="trainingType"
                  label={"Training Type"}
                  placeholder="Training Type"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      trainingType: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Training Type is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={trainingTitleDDL || []}
                  name="trainingTitle"
                  label={"Training Title"}
                  placeholder="Training Title"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      trainingTitle: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Training Title is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={trainingModeStatusDDL || []}
                  name="trainingMode"
                  label="Training Mode"
                  placeholder="Training Mode"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      trainingMode: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Training Mode is required",
                    },
                  ]}
                />
              </Col>
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
    </div>
  );
};

export default TnDInventory;
