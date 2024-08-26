import {
  DataTable,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { bounusDependsOnList, serviceLengthTypeList } from "../Utils";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
import { PModal } from "Components/Modal";
import AddEditForm from "./Bonus/CreateBouns";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useLocation, useHistory } from "react-router-dom";
import { rowColumns, rowGenerateFunction } from "../helper";
import { toast } from "react-toastify";
// import { rowGenerateFunction } from "../helper";
type TCreateBonusSetup = unknown;
const CreateBonusSetup: React.FC<TCreateBonusSetup> = () => {
  // Data From Store
  const { orgId, buId, wgId, employeeId, wId, wgName } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  // Form Instance
  const [form] = Form.useForm();
  const history = useHistory();
  const { state }: any = useLocation();

  const dispatch = useDispatch();

  // Api Actions
  const ReligionDDL = useApiRequest([]);
  const WorkplaceDDL = useApiRequest([]);
  const EmploymentTypeDDL = useApiRequest([]);
  const BonusAllLanding = useApiRequest([]);
  const CheckBounsExist = useApiRequest({});
  const CreateUpdateBounsSetup = useApiRequest({});
  const positionDDL = useApiRequest([]);
  const BonusSetupGetbyByBonusCode = useApiRequest([]);

  // state
  const [loading, setLoading] = useState(false);
  const [rowGenerate, setRowGenerate] = useState([]);
  const [rowData, setRowData]: any = useState([]);
  const [headerData, setHeaderData]: any = useState({});

  // Life Cycle Hooks
  useEffect(() => {
    if (state) {
      BonusSetupGetbyByBonusCode?.action({
        method: "get",
        urlKey: "BonusSetupGetbyByBonusCode",
        params: {
          obj: state?.strBonusSetupGroupCode || "",
        },
        onSuccess: (data) => {
          setRowData(data);
          data?.forEach((item: any, idx: number) => {
            setHeaderData(item);
          });
          positionDDL?.action({
            urlKey: "PeopleDeskAllDDL",
            method: "GET",
            params: {
              DDLType: "Position",
              BusinessUnitId: buId,
              WorkplaceGroupId: wgId || 0,
              IntWorkplaceId: data[0]?.intWorkPlaceId || 0,
              intId: 0,
            },
            onSuccess: (res) => {
              res.forEach((item: any, i: number) => {
                res[i].label = item?.PositionName;
                res[i].value = item?.PositionId;
              });
            },
          });
          EmploymentTypeDDL?.action({
            method: "get",
            urlKey: "PeopleDeskAllDDL",
            params: {
              DDLType: "EmploymentType",
              BusinessUnitId: buId,
              WorkplaceGroupId: wgId,
              IntWorkplaceId: data[0]?.intWorkPlaceId || 0,
              intId: employeeId,
            },
            onSuccess: (res) => {
              res?.forEach((item: any, idx: number) => {
                res[idx].label = item?.EmploymentType;
                res[idx].value = item?.Id;
              });
            },
          });
        },
      });
    }

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
        // data?.length > 1 && data?.unshift({ label: "All", value: 0 });
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
        intAccountId: orgId,
        intBusinessUnitId: buId,
        intCreatedBy: employeeId,
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

    const payload = rowGenerate.map((item: any) => ({
      ...item,
      intBonusSetupId: item?.intBonusSetupId || 0,
      strBonusGroupCode: item?.strBonusSetupGroupCode || "",
      intBonusId: values?.bonusName?.value || 0,
      strBonusName: values?.bonusName?.label || "",
      strBonusDescription: values?.bonusName?.strBonusDescription || "",
      intAccountId: orgId || 0,
      intBusinessUnitId: buId || 0,
      intWorkplaceGroupId: wgId || 0,
      strWorkplaceGroupName: wgName || "",
      intWorkPlaceId: values?.workplace?.value || 0,
      strWorkPlaceName: values?.workplace?.label || "",
      isServiceLengthInDays: values?.serviceLengthType?.value === 1,
      intMinimumServiceLengthMonth: values?.minServiceLengthMonth || 0,
      intMaximumServiceLengthMonth: values?.maxServiceLengthMonth || 0,
      intMinimumServiceLengthDays: values?.minServiceLengthDay || 0,
      intMaximumServiceLengthDays: values?.maxServiceLengthDay || 0,
      strBonusPercentageOn: values?.bounsDependOn === 1 ? "Gross" : "Basic",
      numBonusPercentage: values?.bonusPercentage || 0,
      isDividedbyServiceLength: values?.isDividedByLength || false,
      intCreatedBy: employeeId || 0,
    }));

    CreateUpdateBounsSetup?.action({
      method: "post",
      urlKey: "CreateUpdateBounsSetup",
      payload: [...payload],
      onSuccess: (res) => {
        if (Array.isArray(res) && res.length > 0) {
          const updatedRowGenerate: any = rowGenerate.map((row: any) => {
            const matchingRes = res.find(
              (item: any) =>
                item.intEmploymentTypeId === row.intEmploymentTypeId &&
                item.intHrPositionId === row.intHrPositionId &&
                item.intReligion === row.intReligion
            );
            return matchingRes
              ? { ...row, responceMessage: matchingRes.responceMessage }
              : row;
          });
          setRowGenerate(updatedRowGenerate);
        } else {
          history.push("/administration/payrollConfiguration/bonusSetup");
          toast.success("Saved Successfully!");
        }
      },
    });
  };
  const [open, setOpen] = useState(false);
  console.log("rowGenerate from main", rowGenerate);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Bonus Setup";
  }, [dispatch]);

  useEffect(() => {
    const formData = {
      bonusName: {
        label: headerData?.strBonusName || "",
        value: headerData?.intBonusId || 0,
      },
      workplace: {
        label: headerData?.strWorkplace || "",
        value: headerData?.intWorkPlaceId || 0,
      },
      hrPosition: [
        {
          label: headerData?.hrPositionName || "",
          value: headerData?.hrPositionId || 0,
        },
      ],
      employmentType: [
        {
          label: headerData?.strEmploymentType || "",
          value: headerData?.intEmploymentTypeId || 0,
        },
      ],
      bounsDependOn: {
        label: headerData?.strBonusPercentageOn || "",
        value: 0,
      },
      bonusPercentage: headerData?.numBonusPercentage || 0,
      religion: [
        {
          label: headerData?.strReligionName || "",
          value: headerData?.intReligion || 0,
        },
      ],
      serviceLengthType: headerData?.isServiceLengthInDays
        ? {
            label: "Day",
            value: 1,
          }
        : {
            label: "Month",
            value: 2,
          },
      minServiceLengthMonth: headerData?.intMinimumServiceLengthMonth || 0,
      minServiceLengthDay: headerData?.intMinimumServiceLengthDays || 0,
      maxServiceLengthMonth: headerData?.intMaximumServiceLengthMonth || 0,
      maxServiceLengthDay: headerData?.intMaximumServiceLengthDays,
      isDividedByLength: headerData?.isDividedbyServiceLength,
    };
    if (headerData) {
      form.setFieldsValue(formData);
      setRowGenerate(rowData);
    }
  }, [headerData]);
  return (
    <>
      <PForm
        form={form}
        initialValues={{
          serviceLengthType: 2 /* 1 for Month */,
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
                  disabled={state}
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
                // disabled={state}
                onChange={(value: number, op: any) => {
                  form.setFieldsValue({ workplace: op });
                  form.setFieldsValue({ employmentType: [] });
                  form.setFieldsValue({ hrPosition: [] });
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

            {/* Service Length */}
            <Col md={6} sm={12} className="mt-2">
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
                    <Col md={6} sm={12} className="mt-2">
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
                    <Col md={6} sm={12} className="mt-2">
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
                    <Col md={6} sm={12} className="mt-2">
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
                    <Col md={6} sm={12} className="mt-2">
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
                  </>
                );
              }}
            </Form.Item>
            <Col md={6} sm={24} style={{ marginTop: "30px" }}>
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
          </Row>
          <br />
          <br />
          <Row gutter={[10, 2]}>
            <Col md={6} sm={24}>
              <PSelect
                options={positionDDL?.data || []}
                name="attValueOne"
                showSearch
                filterOption={true}
                label="HR Position"
                placeholder="HR Position"
                // disabled={state}
                mode="multiple"
                maxTagCount={"responsive"}
                onChange={(value: number, op: any) => {
                  form.setFieldsValue({ attValueOne: op });
                }}
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
                      name="attValueTwo"
                      label="Employment Type"
                      placeholder={`${
                        workplace
                          ? "Select Employment Type"
                          : "Select Workplace First"
                      }`}
                      options={EmploymentTypeDDL?.data || []}
                      // disabled={!workplace || state}
                      mode="multiple"
                      maxTagCount={"responsive"}
                      onChange={(value: number, op: any) => {
                        form.setFieldsValue({ attValueTwo: op });
                      }}
                    />
                  </Col>
                );
              }}
            </Form.Item>
            <Col md={6} sm={12}>
              <PSelect
                options={ReligionDDL?.data || []}
                label="Religion"
                name="attValueThree"
                placeholder="Select Religion"
                // disabled={state}
                mode="multiple"
                maxTagCount={"responsive"}
                onChange={(value: number, op: any) => {
                  form.setFieldsValue({ attValueThree: op });
                }}
                // rules={[
                //   {
                //     required: true,
                //     message: "Please Select Religion",
                //   },
                // ]}
              />
            </Col>

            <Col md={6} sm={12}>
              <Form.Item
                noStyle
                shouldUpdate={(prev, current) => prev !== current}
              >
                {({ getFieldsValue: getValues }) => {
                  const { attValueOne, attValueTwo, attValueThree } =
                    getValues();
                  const values = form.getFieldsValue(true);
                  return (
                    <button
                      disabled={
                        !values?.attValueOne ||
                        !values?.attValueTwo ||
                        !values?.attValueThree
                      }
                      className="btn btn-green btn-green-disable mt-4"
                      type="button"
                      onClick={() => {
                        rowGenerateFunction(
                          attValueOne || [],
                          attValueTwo || [],
                          attValueThree || [],
                          "",
                          setRowGenerate,
                          values,
                          setLoading,
                          rowGenerate
                        );
                      }}
                    >
                      Add
                    </button>
                  );
                }}
              </Form.Item>
            </Col>
          </Row>

          <div className="mt-3">
            <DataTable
              bordered
              data={rowGenerate || []}
              loading={loading}
              header={rowColumns(setRowGenerate, rowGenerate)}
            />
          </div>
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
