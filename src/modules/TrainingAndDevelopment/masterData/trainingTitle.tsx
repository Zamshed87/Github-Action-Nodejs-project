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
import { createTrainingTitle, updateTrainingTitle } from "./helper";
import { shallowEqual, useSelector } from "react-redux";

const TrainingTitle = ({ setOpenTrainingTitleModal }: any) => {
  // hooks
  const [landingApi, getLandingApi, landingLoading, , landingError] =
    useAxiosGet();

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

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
      title: "Training Title",
      dataIndex: "trainingTitle",
      filter: true,
      filterKey: "trainingTitleList",
      filterSearch: true,
    },
    {
      title: "Training Description",
      dataIndex: "trainingDescription",
      filter: true,
      filterKey: "trainingDescriptionList",
      filterSearch: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title="Status">
            <Switch
              size="small"
              checked={rec?.isActive}
              onChange={() => {
                updateTrainingTitle(
                  form,
                  profileData,
                  setLoading,
                  rec,
                  true,
                  () => {
                    landingApiCall();
                  }
                );
              }}
            />
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

  return (
    <div>
      {loading || (landingLoading && <Loading />)}
      <PForm form={form} initialValues={{}}>
        {/* <PCard> */}
        <PCardHeader
          title={`Total ${landingApi?.data?.totalCount || 0} Training Title`}
        />
        <PCardBody>
          <Row gutter={[10, 2]}>
            <Col md={6} sm={24}>
              <PInput
                type="text"
                placeholder="Training Title"
                label="Training Title"
                name="trainingTitle"
                rules={[
                  {
                    required: true,
                    message: "Training Title is required",
                  },
                ]}
              />
            </Col>
            <Col md={6} sm={24}>
              <PInput
                type="text"
                placeholder="Training Description"
                label="Training Description"
                name="trainingDescription"
              />
            </Col>
            <Col md={6} sm={24}>
              <PButton
                style={{ marginTop: "22px" }}
                type="primary"
                content="Save"
                onClick={() => {
                  const values = form.getFieldsValue(true);
                  form
                    .validateFields()
                    .then(() => {
                      createTrainingTitle(
                        form,
                        profileData,
                        setLoading,
                        () => {
                          landingApiCall();
                        },
                        setOpenTrainingTitleModal
                      );
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
            loading={landingLoading}
            header={header}
            // pagination={{
            //   pageSize: landingApi?.data?.pageSize,
            //   total: landingApi?.data?.totalCount,
            // }}
            filterData={landingApi?.data?.filters}
            // onChange={(pagination, filters) => {
            //   landingApiCall();
            // }}
          />
        </div>
        {/* </PCard> */}
      </PForm>
    </div>
  );
};

export default TrainingTitle;
