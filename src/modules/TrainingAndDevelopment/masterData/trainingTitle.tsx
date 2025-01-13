import { EditOutlined } from "@ant-design/icons";
import { Col, Form, Row, Switch, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import {
  DataTable,
  Flex,
  PButton,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
} from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { getSerial } from "Utils";
import { createTrainingTitle, updateTrainingTitle } from "./helper";

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
          currentPage: 1,
          pageSize: 1000,
          index,
        }),
      fixed: "left",
      align: "center",
    },
    {
      title: "Training Title",
      dataIndex: "name",
      filter: true,
      filterKey: "trainingTitleList",
      filterSearch: true,
    },
    {
      title: "Training Description",
      dataIndex: "description",
      filter: true,
      filterKey: "trainingDescriptionList",
      filterSearch: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Tooltip
            placement="bottom"
            title={rec?.isActive ? "Inactive" : "Active"}
          >
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
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title="Edit">
            <EditOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                form.setFieldsValue({
                  trainingTitle: rec?.name,
                  trainingDescription: rec?.description,
                  singleData: rec,
                  editAction: true,
                });
              }}
            />
          </Tooltip>

          {/* <Tooltip placement="bottom" title="Delete">
            <DeleteOutlined
              style={{
                color: "red",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                deleteTrainingType(rec, setLoading, () => {
                  landingApiCall();
                  form.resetFields();
                });
              }}
            />
          </Tooltip> */}
        </Flex>
      ),
      align: "center",
      width: 30,
    },
  ];
  const landingApiCall = () => {
    getLandingApi("/TrainingTitle/Training/Title");
  };
  useEffect(() => {
    landingApiCall();
  }, []);

  // Watch for editAction changes
  const editAction = Form.useWatch("editAction", form);

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
            <Col md={6} sm={24} style={{ display: "flex" }}>
              <Form.Item name="editAction" hidden>
                <input type="hidden" />
              </Form.Item>
              <PButton
                style={{
                  marginTop: "22px",
                  backgroundColor: editAction ? "red" : "",
                }}
                type="primary"
                content={editAction ? "Edit" : "Save"}
                onClick={() => {
                  const values = form.getFieldsValue(true);
                  form
                    .validateFields()
                    .then(() => {
                      editAction
                        ? updateTrainingTitle(
                            form,
                            profileData,
                            setLoading,
                            values?.singleData,
                            false,
                            () => {
                              landingApiCall();
                              form.resetFields();
                            }
                          )
                        : createTrainingTitle(
                            form,
                            profileData,
                            setLoading,
                            () => {
                              landingApiCall();
                              // Reset form after successful submission
                              form.resetFields();
                            }
                            // setOpenTraingTypeModal
                          );
                    })
                    .catch(() => {
                      console.log("error");
                    });
                }}
              />
              {editAction && (
                <PButton
                  style={{
                    marginTop: "22px",
                    marginLeft: "10px",
                  }}
                  type="primary"
                  content={"Reset"}
                  onClick={() => {
                    landingApiCall();
                    form.resetFields();
                  }}
                />
              )}
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
