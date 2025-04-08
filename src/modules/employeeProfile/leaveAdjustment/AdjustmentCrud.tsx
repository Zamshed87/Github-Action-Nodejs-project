import { InfoOutlined } from "@mui/icons-material";
import { Col, Divider, Form, Row } from "antd";
import { LightTooltip } from "common/LightTooltip";
import { DataTable, PForm, PInput, PSelect } from "Components";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { failColor } from "utility/customColor";
import { todayDate } from "utility/todayDate";

export const AdjustmentCrud = () => {
  const { orgId, buId, intProfileImageUrl, employeeId, wgId, permissionList } =
    useSelector((state: any) => state?.auth?.profileData, shallowEqual);
  const beneficiaryType = useApiRequest({});
  const supervisorDDL = useApiRequest({});
  const policyDDL = useApiRequest({});
  const createEditApi = useApiRequest({});
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
        types: "LeavePolicyDependOnEnum",
      },
    });
  };
  const getPolicyDDL = () => {
    policyDDL?.action({
      urlKey: "GetEnums",
      method: "GET",
      params: {
        types: "LeavePolicyDependOnEnum",
      },
    });
  };
  const getSuperVisorDDL = debounce((value) => {
    if (value?.length < 2) return supervisorDDL?.reset();
    const { workplaceGroup, workplace } = form.getFieldsValue(true);
    supervisorDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        // DDLType: "EmployeeBasicInfoForEmpMgmt",
        // AccountId: intAccountId,
        // BusinessUnitId: buId,
        // intId: employeeId,
        // workplaceGroupId: workplaceGroup?.value,
        // strWorkplaceIdList: workplace?.value.toString(),
        // searchTxt: value || "",
      },
      //   onSuccess: (res) => {
      //     res.forEach((item, i) => {
      //       res[i].label = item?.EmployeeOnlyName;
      //       res[i].value = item?.EmployeeId;
      //     });
      //   },
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
      dataIndex: "beneficiaryType",
      width: 100,
    },
    {
      title: "Taken",
      dataIndex: "beneficiaryType",
      width: 100,
    },
    {
      title: "Total",
      dataIndex: "duration",
      width: 100,
    },
  ];
  return (
    <>
      <PForm form={form} onFinish={submitHandler} initialValues={{}}>
        <Row gutter={[10, 2]}>
          <Col md={8} sm={24}>
            <PSelect
              // mode="multiple"
              allowClear
              options={beneficiaryType?.data?.DaysTypeEnum || []}
              name="beneficiary"
              label="Beneficiary Type"
              placeholder="Beneficiary  Type"
              onChange={(value, op) => {
                form.setFieldsValue({
                  encashType: op,
                });
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
              const { beneficiaryType } = form.getFieldsValue(true);

              return (
                <>
                  <Col md={8} sm={24}>
                    <PSelect
                      options={[]}
                      name="beneficiaryFrom"
                      label="From Beneficiary Name"
                      disabled={beneficiaryType?.value === 3}
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          beneficiaryFrom: op,
                        });
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
              options={[]}
              name="policyFrom"
              label="From Leave Policy"
              onChange={(value, op) => {
                form.setFieldsValue({
                  policyFrom: op,
                });
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
              name="balanceFrom"
              label={
                <>
                  Adjust From Balance
                  <LightTooltip
                    title={
                      <>
                        <DataTable
                          bordered
                          data={
                            //   leaveHistoryData.employeeLeaveApplicationListDto?.length > 0
                            //     ? leaveHistoryData?.employeeLeaveApplicationListDto
                            //     :
                            []
                          }
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
              const { beneficiaryType } = form.getFieldsValue(true);

              return (
                <>
                  <Col md={8} sm={24}>
                    <PSelect
                      options={[]}
                      name="beneficiaryTo"
                      label="To Beneficiary Name"
                      disabled={beneficiaryType?.value === 2}
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          beneficiaryTo: op,
                        });
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
              options={[]}
              name="policyTo"
              label="To Leave Policy"
              onChange={(value, op) => {
                form.setFieldsValue({
                  policyTo: op,
                });
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
              label={
                <>
                  Adjust To Balance{" "}
                  <LightTooltip
                    title={
                      <>
                        <DataTable
                          bordered
                          data={
                            //   leaveHistoryData.employeeLeaveApplicationListDto?.length > 0
                            //     ? leaveHistoryData?.employeeLeaveApplicationListDto
                            //     :
                            []
                          }
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
        <ModalFooter
          onCancel={() => {
            // setId("");
            // setIsAddEditForm(false);
          }}
          submitAction="submit"
          //   loading={saveDepartment.loading}
        />
      </PForm>
    </>
  );
};
