import { Col, Form, FormInstance, Row, Switch, Tooltip } from "antd";
import Loading from "common/loading/Loading";
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
import React, { useEffect, useState } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { getSerial } from "Utils";
import axios from "axios";
import { message } from "antd";

const TrainingCost = ({ setOpenCostTypeModal }: any) => {
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
      title: "Cost Type",
      dataIndex: "costType",
      filter: true,
      filterKey: "costTypeList",
      filterSearch: true,
    },
    {
      title: "Description",
      dataIndex: "costDescription",
      filter: true,
      filterKey: "costDescriptionList",
      filterSearch: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title="Status">
            {/* <Switch
            size="small"
            defaultChecked={rec?.isActive}
            onChange={() => {
              updateTrainingType(form, profileData, setLoading, rec, true);
            }}
          /> */}
          </Tooltip>
        </Flex>
      ),
      align: "center",
      width: 40,
    },
  ];
  const landingApiCall = () => {
    getLandingApi("/trainingType");
  };
  useEffect(() => {
    landingApiCall();
  }, []);

  const saveHandler = async (form: FormInstance<any>) => {
    try {
      const values = form.getFieldsValue(true);
      setLoading(true);
      await axios.post("/trainingType", values);
      message.success("Training Type saved successfully");
      landingApiCall();
    } catch (error) {
      message.error("Failed to save Training Type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading || (landingLoading && <Loading />)}
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            title={`Total ${
              landingApi?.data?.totalCount || 0
            } Training Cost Type`}
          />
          <PCardBody>
            <Row gutter={[10, 2]}>
              <Col md={6} sm={24}>
                <PInput
                  type="text"
                  placeholder="Cost Type"
                  label="Cost Type"
                  name="costType"
                  rules={[
                    {
                      required: true,
                      message: "Cost Type is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="text"
                  placeholder="Description"
                  label="Cost Description"
                  name="costDescription"
                />
              </Col>
              <Col md={6} sm={24}>
                <PButton
                  style={{ marginTop: "22px" }}
                  type="primary"
                  content="Save"
                  onClick={() => saveHandler(form)}
                />
              </Col>
            </Row>
          </PCardBody>

          <div className="mb-3">
            <DataTable
              bordered
              data={landingApi?.data?.data || []}
              loading={landingApi?.loading}
              header={header}
              pagination={{
                pageSize: landingApi?.data?.pageSize,
                total: landingApi?.data?.totalCount,
              }}
              filterData={landingApi?.data?.filters}
              onChange={(pagination, filters) => {
                landingApiCall();
              }}
            />
          </div>
        </PCard>
      </PForm>
    </div>
  );
};

export default TrainingCost;
