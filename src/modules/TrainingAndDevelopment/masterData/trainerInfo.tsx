import { EditOutlined } from "@ant-design/icons";
import { Checkbox, Col, Form, Row, Switch, Tooltip } from "antd";
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
import { createTrainerInfo, updateTrainerInfo } from "./helper";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";

const TrainerInfo = ({ setOpenTraingTypeModal }: any) => {
  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  let permission: any = {};
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30501) {
      permission = item;
    }
  });
  const { buId, wgId, employeeId, orgId } = profileData;
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
          currentPage: landingApi?.currentPage,
          pageSize: landingApi?.pageSize,
          index,
        }),
      fixed: "left",
      align: "center",
    },
    {
      title: "Inhouse Trainer?",
      dataIndex: "isInHouseTrainer",
      render: (isInHouseTrainer: boolean) => (isInHouseTrainer ? "Yes" : "No"),
    },
    {
      title: "Name of Trainer",
      dataIndex: "name",
      filter: true,
      filterKey: "nameofTrainerList",
      filterSearch: true,
    },
    {
      title: "Name of Organization",
      dataIndex: "organization",
      filter: true,
      filterKey: "nameOfOrganizationList",
      filterSearch: true,
    },
    {
      title: "Trainer Contact No",
      dataIndex: "contactNo",
      filter: true,
      filterKey: "nameOfOrganizationList",
      filterSearch: true,
    },
    {
      title: "Trainer Email",
      dataIndex: "email",
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
                updateTrainerInfo(
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
                color: "var(--primary-color)",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                form.setFieldsValue({
                  nameofTrainer: rec?.name,
                  nameofOrganization: rec?.organization,
                  trainerEmail: rec?.email,
                  contactNo: rec?.contactNo,
                  inhouseTrainer: rec?.isInHouseTrainer || false,
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
  const landingApiCall = (
    pagination: { current: number; pageSize: number } = {
      current: 1,
      pageSize: 25,
    }
  ) => {
    getLandingApi(
      `/TrainerInformation/Training/TrainerInformation?pageNumber=${pagination.current}&pageSize=${pagination.pageSize}`
    );
  };
  useEffect(() => {
    landingApiCall();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      onValuesChange: (changedValues: any, allValues: any) => {},
    });
  }, [form]);

  // Watch for editAction changes
  const editAction = Form.useWatch("editAction", form);
  const nameofTrainer = Form.useWatch("nameofTrainer", form);

  return permission?.isView ? (
    <div>
      {(loading || landingLoading) && <Loading />}
      <PForm form={form} initialValues={{}}>
        {/* <PCard> */}
        <PCardHeader title={`Total ${landingApi?.length || 0} Trainer`} />
        <PCardBody>
          <Row gutter={[10, 2]}>
            <Col md={4} sm={24} style={{ marginTop: "10px" }}>
              <Form.Item
                name="inhouseTrainer"
                valuePropName="checked" // Ensures the checkbox value is bound correctly
              >
                <Checkbox>Inhouse Trainer?</Checkbox>
              </Form.Item>
            </Col>
            <Col md={6} sm={24}>
              <PInput
                type="text"
                placeholder="Name of Trainer"
                label="Name of Trainer"
                name="nameofTrainer"
                rules={[
                  {
                    required: true,
                    message: "Name of Trainer is required",
                  },
                ]}
              />
            </Col>
            <Col md={6} sm={24}>
              <PInput
                type="text"
                placeholder="Name of Organization"
                label="Name of Organization"
                name="nameofOrganization"
                disabled={!nameofTrainer}
                rules={[
                  {
                    required: true,
                    message: "Name of Organization is required",
                  },
                ]}
              />
            </Col>
            <Col md={6} sm={24}>
              <PInput
                type="text"
                placeholder="Trainer Email"
                label="Trainer Email"
                name="trainerEmail"
                rules={[
                  {
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                ]}
              />
            </Col>
            <Col md={6} sm={24}>
              <PInput
                type="text"
                placeholder="Trainer Contact No"
                label="Trainer Contact No"
                name="contactNo"
                rules={[
                  { required: true, message: "Contact number is required" },
                  {
                    pattern: /^[0-9]{11}$/, // Adjust pattern as per your requirements
                    message: "Contact number must be 11 digits",
                  },
                ]}
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
                        ? updateTrainerInfo(
                            form,
                            profileData,
                            setLoading,
                            values?.singleData,
                            false,
                            () => {
                              landingApiCall();
                              form.resetFields();
                              form.setFieldsValue({
                                inhouseTrainer: false,
                              });
                            }
                          )
                        : createTrainerInfo(
                            form,
                            profileData,
                            setLoading,
                            () => {
                              landingApiCall();
                              // Reset form after successful submission
                              form.resetFields();
                              form.setFieldsValue({
                                inhouseTrainer: false,
                              });
                            }
                            // setOpenTraingTypeModal
                          );
                    })
                    .catch(() => {});
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
            data={landingApi?.data || []}
            loading={landingLoading}
            header={header}
            pagination={{
              pageSize: landingApi?.pageSize,
              total: landingApi?.totalCount,
            }}
            filterData={landingApi?.filters}
            onChange={(pagination, filters) => {
              landingApiCall(pagination);
            }}
          />
        </div>
        {/* </PCard> */}
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default TrainerInfo;
