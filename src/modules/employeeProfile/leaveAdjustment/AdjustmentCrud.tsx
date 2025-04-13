import { InfoOutlined } from "@mui/icons-material";
import { Col, Divider, Form, Row } from "antd";
import { LightTooltip } from "common/LightTooltip";
import { DataTable, PForm, PInput, PSelect } from "Components";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { debounce, get } from "lodash";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { failColor } from "utility/customColor";
import { todayDate } from "utility/todayDate";

export const AdjustmentCrud = ({
  singleData,
  setSingleData,
  setOpen,
  isEdit,
  setIsEdit,
  landingApiCall,
}: any) => {
  const { orgId, buId, wId, employeeId, wgId, userName } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const [leaveTypeDDL, setLeaveTypeDDL] = useState([]);
  const [leaveTypeDDLTo, setLeaveTypeDDLTo] = useState([]);
  const [details, setDetails] = useState([]);
  const [detailsTo, setDetailsTo] = useState([]);

  const beneficiaryType = useApiRequest({});
  const supervisorDDL = useApiRequest({});
  const policyDDL = useApiRequest({});
  const detailsApi = useApiRequest({});
  const createEditApi = useApiRequest({});
  const getById = useApiRequest({});
  //   getBUnitDDL.action({
  //     urlKey: "BusinessUnitWithRoleExtension",
  //     method: "GET",
  //     params: {
  //       workplaceGroupId: wgId,
  //       businessUnitId: buId,
  //       empId: employeeId || 0,
  //       accountId: orgId,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item, i) => {
  //         res[i].label = item?.strBusinessUnit;
  //         res[i].value = item?.intBusinessUnitId;
  //       });
  //     },
  //   });
  const [form] = Form.useForm();
  const getBeneficiaryTypes = () => {
    beneficiaryType?.action({
      urlKey: "GetEnums",
      method: "GET",
      params: {
        types: "LeaveAdjustmentBenefiaciaryEnum",
      },
    });
  };
  useEffect(() => {
    getBeneficiaryTypes();
  }, []);
  const getPolicyDDL = (type: string, id: any) => {
    policyDDL?.action({
      urlKey: "EmployeeLeaveTypeDDL",
      method: "GET",
      params: {
        employeeId: id,
        date: todayDate(),
      },
      onSuccess: (res) => {
        res.forEach((item: any, idx: any) => {
          res[idx].value = item?.policyId;
          res[idx].label = item?.name;
        });
        if (type === "from") {
          setLeaveTypeDDL(res);
        } else {
          setLeaveTypeDDLTo(res);
        }
      },
    });
  };
  const getDetails = (type: string, id: any) => {
    const values = form.getFieldsValue(true);
    detailsApi?.action({
      urlKey: "PolicyWiseEmployeeLeaveBalanceList",
      method: "GET",
      params: {
        employeeId:
          type === "from"
            ? values?.beneficiaryFrom?.value
            : values?.beneficiaryTo?.value,
        date: todayDate(),
        policyId: id,
      },
      onSuccess: (res) => {
        res.forEach((item: any, idx: any) => {
          res[idx].value = item?.id;
          res[idx].label = item?.name;
        });
        if (type === "from") {
          setDetails(res);
        } else {
          setDetailsTo(res);
        }
      },
    });
  };
  const getSuperVisorDDL = debounce((value) => {
    if (value?.length < 2) return supervisorDDL?.reset();
    supervisorDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmployeeBasicInfoForEmpMgmt",
        AccountId: orgId,
        BusinessUnitId: buId,
        intId: employeeId,
        workplaceGroupId: wgId,
        strWorkplaceIdList: wId,
        searchTxt: value || "",
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.EmployeeOnlyName;
          res[i].value = item?.EmployeeId;
        });
      },
    });
  }, 500);
  const submitHandler = () => {
    const values = form.getFieldsValue(true);
    const payload = {
      businessUnitId: buId,
      workplaceGroupId: wgId,
      intBeneficiaryId: values?.beneficiary?.value,
      dteAdjustmentDate: todayDate(),
      intFromBeneficiaryEmployeeId: values?.beneficiaryFrom?.value,
      intFromBeneficiaryPolicyId: values?.policyFrom?.value,
      intFromAdjustBalance: values?.balanceFrom,
      intToBeneficiaryEmployeeId: values?.beneficiaryTo?.value,
      intToBeneficiaryPolicyId: values?.policyTo?.value,
      intToAdjustBalance: values?.balanceTo,
    };
    createEditApi?.action({
      urlKey: "LeaveAdjustmentCreate",
      method: "post",
      payload: payload,
      toast: true,
      onSuccess: (res) => {
        toast.success(res?.message[0]);
        setSingleData({});
        setOpen(false);
        setIsEdit(false);
        landingApiCall();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message?.[0] ||
            error?.response?.data?.message ||
            error?.response?.data?.Message ||
            error?.response?.data?.title ||
            error?.response?.title ||
            error?.response?.message ||
            error?.response?.Message ||
            "Something went wrong"
        );
      },
    });
  };
  const header: any = [
    {
      title: "Remaining",
      dataIndex: "totalBalanceDays",
      width: 100,
    },
    {
      title: "Taken",
      dataIndex: "totalTakenDays",
      width: 100,
    },
    {
      title: "Total",
      dataIndex: "totalAllocatedDays",
      width: 100,
    },
  ];
  useEffect(() => {
    if (singleData?.leaveAdjustmentId) {
      getById?.action({
        urlKey: "LeaveAdjustmentGetById",
        method: "GET",
        params: {
          LeaveAdjustmentId: singleData?.leaveAdjustmentId,
        },
        onSuccess: (res: any) => {
          form.setFieldsValue({
            beneficiaryFrom: {
              value: res?.data?.[0].fromBeneficiaryNameId,
              label: res?.data?.[0].fromBeneficiaryName,
            },
            beneficiaryTo: {
              value: res?.data?.[0].toBeneficiaryNameId,
              label: res?.data?.[0].toBeneficiaryName,
            },
            beneficiary: {
              value: res?.data?.[0].leaveAdjustmentBeneficialId,
              label: res?.data?.[0].leaveAdjustmentBeneficial,
            },
            policyFrom: {
              value: res?.data?.[0].fromBeneficiaryPolicyId,
              label: res?.data?.[0].fromBeneficiaryPolicy,
            },

            policyTo: {
              value: res?.data?.[0].toBeneficiaryPolicyId,
              label: res?.data?.[0].toBeneficiaryPolicy,
            },
            balanceFrom: res?.data?.[0].fromLeaveAdjustmenBalance,
            balanceTo: res?.data?.[0].toLeaveAdjustmenBalance,
          });
          getPolicyDDL("from", res?.data?.[0].fromBeneficiaryNameId);
          getPolicyDDL("to", res?.data?.[0].toBeneficiaryNameId);
          getDetails("from", res?.data?.[0].fromBeneficiaryPolicyId);
          getDetails("to", res?.data?.[0].toBeneficiaryPolicyId);
        },
      });
    }
  }, []);

  return (
    <>
      <PForm form={form} onFinish={submitHandler} initialValues={{}}>
        <Row gutter={[10, 2]}>
          <Col md={8} sm={24}>
            <PSelect
              // mode="multiple"
              allowClear
              options={
                beneficiaryType?.data?.LeaveAdjustmentBenefiaciaryEnum || []
              }
              disabled={isEdit}
              name="beneficiary"
              label="Beneficiary Type"
              placeholder="Beneficiary  Type"
              onChange={(value, op) => {
                form.setFieldsValue({
                  beneficiary: op,
                  beneficiaryFrom: undefined,
                  policyFrom: undefined,
                  balanceFrom: undefined,
                  beneficiaryTo: undefined,
                  policyTo: undefined,
                  balanceTo: undefined,
                });
                if (value == 2) {
                  form.setFieldsValue({
                    beneficiaryTo: { value: employeeId, label: userName },
                  });
                  getPolicyDDL("to", employeeId);
                } else if (value == 3) {
                  form.setFieldsValue({
                    beneficiaryFrom: { value: employeeId, label: userName },
                  });
                  getPolicyDDL("from", employeeId);
                }
              }}
              rules={[
                {
                  required: true,
                  message: "Beneficiary Type is required",
                },
              ]}
            />
          </Col>
        </Row>
        <Divider
          style={{
            marginBlock: "4px",
            marginTop: "20px",
            fontSize: "14px",
            fontWeight: 600,
          }}
          orientation="left"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span>Leave Adjustment From</span>
          </div>
        </Divider>
        <Row gutter={[10, 2]}>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { beneficiary } = form.getFieldsValue(true);

              return (
                <>
                  <Col md={8} sm={24}>
                    <PSelect
                      options={
                        supervisorDDL?.data?.length > 0
                          ? supervisorDDL?.data
                          : []
                      }
                      name="beneficiaryFrom"
                      label="From Beneficiary Name"
                      disabled={beneficiary?.value == "3" || isEdit}
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          beneficiaryFrom: op,
                          policyFrom: undefined,
                          balanceFrom: undefined,
                        });
                        getPolicyDDL("from", value);
                      }}
                      showSearch
                      filterOption={false}
                      // notFoundContent={null}
                      loading={supervisorDDL?.loading}
                      onSearch={(value) => {
                        getSuperVisorDDL(value);
                      }}
                      rules={[
                        {
                          required: true,
                          message: "From Beneficiary Name is required",
                        },
                      ]}
                    />
                  </Col>
                </>
              );
            }}
          </Form.Item>

          <Col md={8} sm={24}>
            <PSelect
              // mode="multiple"
              allowClear
              options={leaveTypeDDL || []}
              disabled={isEdit}
              name="policyFrom"
              label="From Leave Policy"
              onChange={(value, op) => {
                form.setFieldsValue({
                  policyFrom: op,
                });
                getDetails("from", value);
              }}
              rules={[
                {
                  required: true,
                  message: "From Leave Policy is required",
                },
              ]}
            />
          </Col>
          <Col md={8} sm={24}>
            <PInput
              type="number"
              disabled={isEdit}
              name="balanceFrom"
              label={
                <>
                  Adjust From Balance
                  <LightTooltip
                    title={
                      <>
                        <DataTable
                          bordered
                          data={details || []}
                          //   loading={landingApi?.loading}
                          header={header}
                        />
                      </>
                    }
                    arrow
                  >
                    {" "}
                    <InfoOutlined
                      sx={{
                        color: failColor,
                        width: 16,
                        cursor: "pointer",
                      }}
                    />
                  </LightTooltip>
                </>
              }
              rules={[
                { required: true, message: "Adjust From Balance is required" },
              ]}
            />
          </Col>
        </Row>
        <Divider
          style={{
            marginBlock: "4px",
            marginTop: "20px",
            fontSize: "14px",
            fontWeight: 600,
          }}
          orientation="left"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span>Leave Adjustment To</span>
          </div>
        </Divider>
        <Row gutter={[10, 2]}>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { beneficiary } = form.getFieldsValue(true);

              return (
                <>
                  <Col md={8} sm={24}>
                    <PSelect
                      options={[]}
                      name="beneficiaryTo"
                      label="To Beneficiary Name"
                      disabled={beneficiary?.value == "2" || isEdit}
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          beneficiaryTo: op,
                          policyTo: undefined,
                          balanceTo: undefined,
                        });
                        getPolicyDDL("to", value);
                      }}
                      showSearch
                      filterOption={false}
                      // notFoundContent={null}
                      loading={supervisorDDL?.loading}
                      onSearch={(value) => {
                        getSuperVisorDDL(value);
                      }}
                      rules={[
                        {
                          required: true,
                          message: "To Beneficiary Name is required",
                        },
                      ]}
                    />
                  </Col>
                </>
              );
            }}
          </Form.Item>
          <Col md={8} sm={24}>
            <PSelect
              // mode="multiple"
              allowClear
              options={leaveTypeDDLTo || []}
              disabled={isEdit}
              name="policyTo"
              label="To Leave Policy"
              onChange={(value, op) => {
                form.setFieldsValue({
                  policyTo: op,
                });
                getDetails("to", value);
              }}
              rules={[
                {
                  required: true,
                  message: "To Leave Policy is required",
                },
              ]}
            />
          </Col>
          <Col md={8} sm={24}>
            <PInput
              type="number"
              name="balanceTo"
              disabled={isEdit}
              label={
                <>
                  Adjust To Balance{" "}
                  <LightTooltip
                    title={
                      <>
                        <DataTable
                          bordered
                          data={detailsTo || []}
                          //   loading={landingApi?.loading}
                          header={header}
                        />
                      </>
                    }
                    arrow
                  >
                    {" "}
                    <InfoOutlined
                      sx={{
                        color: failColor,
                        width: 16,
                        cursor: "pointer",
                      }}
                    />
                  </LightTooltip>
                </>
              }
              rules={[
                { required: true, message: "Adjust To Balance is required" },
              ]}
            />
          </Col>
        </Row>
        {!isEdit && (
          <ModalFooter
            onCancel={() => {
              setSingleData({});
              setOpen(false);
              setIsEdit(false);
              landingApiCall();
            }}
            submitAction="submit"
            //   loading={saveDepartment.loading}
          />
        )}
      </PForm>
    </>
  );
};
