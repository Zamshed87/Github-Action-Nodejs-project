import { PCard, PCardHeader, PForm, PInput, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  bounusDependsOnList,
  payloadGenerate,
  serviceLengthTypeList,
} from "../Utils";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
import { PModal } from "Components/Modal";
import AddEditForm from "./Bonus/CreateBouns";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
type TCreateBonusSetup = unknown;
const CreateBonusSetup: React.FC<TCreateBonusSetup> = () => {
  // Data From Store
  const { orgId, buId, wgId, employeeId, wId, wgName } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  // Form Instance
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  // Api Actions
  const ReligionDDL = useApiRequest([]);
  const WorkplaceDDL = useApiRequest([]);
  const EmploymentTypeDDL = useApiRequest([]);
  const BonusAllLanding = useApiRequest([]);
  const CheckBounsExist = useApiRequest({});
  const CRUDBonusSetup = useApiRequest({});
  const positionDDL = useApiRequest([]);

  // Life Cycle Hooks
  useEffect(() => {
    ReligionDDL?.action({
      method: "get",
      urlKey: "PeopleDeskAllDDL",
      params: {
        DDLType: "Religion",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: 0,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, idx: number) => {
          data[idx].label = item?.ReligionName;
          data[idx].value = item?.ReligionId;
        });
        data?.length > 1 && data?.unshift({ label: "All", value: 0 });
      },
    });
    WorkplaceDDL?.action({
      method: "get",
      urlKey: "PeopleDeskAllDDL",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: employeeId,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, idx: number) => {
          data[idx].label = item?.strWorkplace;
          data[idx].value = item?.intWorkplaceId;
        });
      },
    });
    getBounsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, employeeId]);

  // Functions
  const getBounsList = () => {
    BonusAllLanding?.action({
      method: "post",
      urlKey: "BonusAllLanding",
      payload: {
        strPartName: "BonusNameList",
        intAccountId: 1,
        intBusinessUnitId: 1,
        intCreatedBy: 1,
        dteEffectedDate: moment().format("YYYY-MM-DD"),
        intWorkplaceGroupId: wgId,
        intWorkplaceId: wId,
        intBonusHeaderId: 0,
        intBonusId: 0,
        intPayrollGroupId: 0,
        intReligionId: 0,
      },
    });
  };
  const getEmployeePosition = () => {
    const { workplace } = form.getFieldsValue(true);

    positionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Position",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId || 0,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.PositionName;
          res[i].value = item?.PositionId;
        });
      },
    });
  };

  const getEmploymentTypeDDL = () => {
    const { workplace } = form.getFieldsValue();
    EmploymentTypeDDL?.action({
      method: "get",
      urlKey: "PeopleDeskAllDDL",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: workplace?.value,
        intId: employeeId,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, idx: number) => {
          data[idx].label = item?.EmploymentType;
          data[idx].value = item?.Id;
        });
      },
    });
  };
  const checkBounsExistence = () => {
    const { bonusName, workplace } = form.getFieldsValue(true);
    CheckBounsExist?.action({
      method: "get",
      urlKey: "CheckBonusAlreadyExistInWorkPlace",
      params: {
        bonusId: bonusName?.value,
        workPlaceId: workplace?.value,
      },
    });
  };

  const submitHandler = () => {
    const values = form.getFieldsValue(true);
    const payload = payloadGenerate(values, wgId, wgName);
    const commonData = {
      intAccountId: orgId,
      intBusinessUnitId: buId,
      intCreatedBy: employeeId,
      isActive: true,
    };
    CRUDBonusSetup?.action({
      method: "post",
      urlKey: "CRUDBonusSetup",
      payload: {
        ...commonData,
        ...payload,
      },
      // onSuccess: (data) => {
      //   form.resetFields();
      //   getBounsList();
      // },
    });
  };
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Bonus Setup";
  }, [dispatch]);

  return (
    <>
      <PForm
        form={form}
        initialValues={{
          serviceLengthType: 2,/* 1 for Month */
          isDividedByLength: false,
        }}
        onValuesChange={(changedFields, allFields) => {
          const { bonusName, workplace } = allFields;

          const isChanged =
            changedFields?.bonusName ||
            changedFields?.workplace ||
            changedFields?.employmentType;
          if (bonusName && workplace && isChanged) {
            setTimeout(() => {
              checkBounsExistence();
            }, 100);
          }
        }}
        onFinish={submitHandler}
      >
        <PCard>
          <PCardHeader
            backButton
            title="Create Bonus Setup"
            submitText="Save"
          />
          <Row gutter={[10, 2]}>
            <Col
              md={6}
              sm={12}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <div style={{ width: "95%" }}>
                <PSelect
                  options={BonusAllLanding?.data || []}
                  label="Bonus Name"
                  name="bonusName"
                  placeholder="Select Bonus Name"
                  onChange={(value: number, op: any) => {
                    form.setFieldsValue({ bonusName: op });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Please Select Bonus",
                    },
                  ]}
                />
              </div>
              <PlusOutlined
                style={{
                  // background: "var(--primary-color)",
                  color: "var(--primary-color)",
                  borderRadius: "50%",
                  border: "1px solid var(--primary-color)",
                  padding: "4px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginTop: "23px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpen(true);
                }}
              />
            </Col>
            <Col md={6} sm={12}>
              <PSelect
                name="workplace"
                label="Workplace"
                placeholder="Select workplace"
                options={WorkplaceDDL?.data || []}
                onChange={(value: number, op: any) => {
                  form.setFieldsValue({ workplace: op });
                  form.setFieldsValue({ employmentType: [] });
                  getEmploymentTypeDDL();
                  getEmployeePosition();
                }}
                rules={[
                  {
                    required: true,
                    message: "Please Select Workplace",
                  },
                ]}
              />
            </Col>
            <Col md={6} sm={24}>
              <PSelect
                options={positionDDL?.data || []}
                name="hrPosition"
                showSearch
                filterOption={true}
                label="HR Position"
                placeholder="HR Position"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    hrPosition: op,
                  });
                }}
                rules={[{ required: true, message: "HR Position is required" }]}
              />
            </Col>
            <Form.Item
              noStyle
              shouldUpdate={(prev, current) => prev !== current}
            >
              {({ getFieldsValue: getValues }) => {
                const { workplace } = getValues();
                return (
                  <Col md={6} sm={12}>
                    <PSelect
                      name="employmentType"
                      label="Employment Type"
                      placeholder={`${
                        workplace
                          ? "Select Employment Type"
                          : "Select Workplace First"
                      }`}
                      options={EmploymentTypeDDL?.data || []}
                      disabled={!workplace}
                      mode="multiple"
                      maxTagCount={"responsive"}
                      onChange={(value: number, op: any) => {
                        form.setFieldsValue({ employmentType: op });
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Please Select Employment Type",
                        },
                      ]}
                    />
                  </Col>
                );
              }}
            </Form.Item>
            <Col md={6} sm={12}>
              <PSelect
                name="bounsDependOn"
                label="Bonus Depend On"
                placeholder="Select Bonus Depend On"
                options={bounusDependsOnList}
                rules={[
                  {
                    required: true,
                    message: "Please Select Bonus Depend On",
                  },
                ]}
              />
            </Col>
            <Col md={6} sm={12}>
              <PInput
                type="number"
                name="bonusPercentage"
                label="Bonus Percentage"
                placeholder="Select Bonus Percentage"
                rules={[
                  {
                    required: true,
                    message: "Please Select Bonus Percentage",
                  },
                ]}
                min={0}
                max={100}
              />
            </Col>
            <Col md={6} sm={12}>
              <PSelect
                options={ReligionDDL?.data || []}
                label="Religion"
                name="religion"
                placeholder="Select Religion"
                onChange={(value: number, op: any) => {
                  form.setFieldsValue({ religion: op });
                }}
                rules={[
                  {
                    required: true,
                    message: "Please Select Religion",
                  },
                ]}
              />
            </Col>

            {/* Service Length */}
            <Col md={6} sm={12}>
              <PSelect
                name="serviceLengthType"
                label="Service Length Type"
                placeholder="Select Service Length Type"
                options={serviceLengthTypeList}
                onChange={(value: number, op: any) => {
                  form.setFieldsValue({ serviceLengthType: op });
                }}
                rules={[
                  {
                    required: true,
                    message: "Please Select Employment Type",
                  },
                ]}
              />
            </Col>
            <Form.Item
              noStyle
              shouldUpdate={(prev, current) => prev !== current}
            >
              {({ getFieldsValue: getValues }) => {
                const { serviceLengthType } = getValues();
                return serviceLengthType?.value === 1 ? (
                  <>
                    <Col md={6} sm={12}>
                      <PInput
                        type="number"
                        name="minServiceLengthDay"
                        label="Min Service Length (Day)"
                        placeholder="Select Min Service Length in Days"
                        onChange={() => {
                          const { maxServiceLengthDay } = form.getFieldsValue();
                          maxServiceLengthDay &&
                            form.validateFields(["maxServiceLengthDay"]);
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please Select Min Service Length in Days",
                          },
                        ]}
                        min={0}
                      />
                    </Col>
                    <Col md={6} sm={12}>
                      <PInput
                        type="number"
                        name="maxServiceLengthDay"
                        label="Max Service Length (Day)"
                        placeholder="Select Max Service Length in Days"
                        rules={[
                          {
                            required: true,
                            message: "Please Select Max Service Length in Days",
                          },
                          ({ getFieldsValue }) => ({
                            validator(_, value) {
                              const { minServiceLengthDay } = getFieldsValue();
                              if (!value || minServiceLengthDay < value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  "Max Service Length can't be less than/equal Min Service Length"
                                )
                              );
                            },
                          }),
                        ]}
                        min={0}
                      />
                    </Col>
                  </>
                ) : (
                  <>
                    <Col md={6} sm={12}>
                      <PInput
                        type="number"
                        name="minServiceLengthMonth"
                        label="Min Service Length (Month)"
                        placeholder="Select Min Service Length (Month)"
                        onChange={() => {
                          const { maxServiceLengthMonth } =
                            form.getFieldsValue();
                          maxServiceLengthMonth &&
                            form.validateFields(["maxServiceLengthMonth"]);
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please Select Min Service Length (Month)",
                          },
                        ]}
                        min={0}
                      />
                    </Col>
                    <Col md={6} sm={12}>
                      <PInput
                        type="number"
                        name="maxServiceLengthMonth"
                        label="Max Service Length (Month)"
                        placeholder="Select Max Service Length (Month)"
                        rules={[
                          {
                            required: true,
                            message: "Please Select Max Service Length (Month)",
                          },
                          ({ getFieldsValue }) => ({
                            validator(_, value) {
                              const { minServiceLengthMonth } =
                                getFieldsValue();
                              if (!value || minServiceLengthMonth < value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  "Max Service Length can't be less than/equal Min Service Length"
                                )
                              );
                            },
                          }),
                        ]}
                        min={0}
                      />
                    </Col>
                    <Col md={8} sm={24} style={{ marginTop: "20px" }}>
                      <PInput
                        label="Divided by Service Length?"
                        type="checkbox"
                        name="isDividedByLength"
                        layout="horizontal"
                        onChange={(e) => {
                          if (e.target.checked) {
                            form.setFieldsValue({});
                          }
                        }}
                      />
                    </Col>
                  </>
                );
              }}
            </Form.Item>
          </Row>
        </PCard>
      </PForm>
      <PModal
        open={open}
        title="Create Bonus Setup"
        width=""
        onCancel={() => setOpen(false)}
        maskClosable={false}
        components={
          <AddEditForm getBounsList={getBounsList} setOpen={setOpen} />
        }
      />
    </>
  );
};

export default CreateBonusSetup;
