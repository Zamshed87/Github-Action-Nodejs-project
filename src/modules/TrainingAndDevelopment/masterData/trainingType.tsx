import { Col, Form, FormInstance, Row } from "antd";
import Loading from "common/loading/Loading";
import {
  DataTable,
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

const TrainingType = () => {
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
      title: "Letter Type",
      dataIndex: "letterType",
      filter: true,
      filterKey: "letterTypeList",
      filterSearch: true,
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
            title={`Total ${landingApi?.data?.totalCount || 0} Training Type`}
          />
          <PCardBody>
            <Row gutter={[10, 2]}>
              <Col md={6} sm={24}>
                <PInput
                  type="text"
                  placeholder="Training Type"
                  label="Training Type"
                  name="trainingType"
                  rules={[
                    {
                      required: true,
                      message: "Training Type is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PInput
                  type="text"
                  placeholder="Remarks"
                  label="Remarks"
                  name="remarks"
                />
              </Col>
              <Col md={6} sm={24}>
                <PButton
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

export default TrainingType;
