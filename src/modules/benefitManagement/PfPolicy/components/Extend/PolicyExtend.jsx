import { Col, Form, Row } from "antd";
import { ModalFooter } from "Components/Modal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "common/loading/Loading";
import { createPFPolicy } from "../../PfPolicyCreate/helper";
import { PSelect } from "Components";
import useConfigSelectionHook from "../../PfPolicyCreate/components/PfPolicyConfiguration/useConfigSelectionHook";
import PSelectWithAll from "Components/PForm/Select/PSelectWithAll";

const PolicyExtend = ({ data, setOpenExtend, fetchPfPolicy }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const {
    workplaceDDL,
    employmentTypeDDL,
    getEmploymentTypeDDL,
    pfAssignTypeOpts,
    loadingPfAssignType,
  } = useConfigSelectionHook(form, {
    fetchWorkplace: true,
    fetchEmploymentType: true,
    fetchPfAssignTypeEnum: true,
  });

  const onCancel = () => {
    setOpenExtend({ extend: false, data: {} });
  };

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        const payload = {
          intBusinessUnitId: data.intBusinessUnitId,
          intWorkPlaceGroupId: data.intWorkPlaceGroupId,
          intWorkPlaceId: values?.intWorkPlaceId,
          intEmploymentTypeIds: values?.intEmploymentTypeIds,
          intPFAssignType: values?.StrPfAssignType?.value,
          strPFAssignType: values?.StrPfAssignType?.label,
          strPolicyName: data.strPolicyName,
          strPolicyCode: data.strPolicyCode,
          intPfEligibilityDependOn: data.intPfEligibilityDependOn,
          employeeContributions: data.employees ?? [],
          companyContributions: data.companies ?? [],
          intEmployeeContributionPaidAfter:
            data.intEmployeeContributionPaidAfter,
          intEmployeeContributionInFixedMonth:
            data.intEmployeeContributionInFixedMonth ?? "",
          isPFInvestment: data.isPFInvestment,
          intMonthlyInvestmentWith: data.intMonthlyInvestmentWith,
        };
        await createPFPolicy(payload, setLoading, () => {
          form.resetFields();
          fetchPfPolicy();
          setOpenExtend({ extend: false, data: {} });
        });
      })
      .catch((error) => {
        toast.error("Please fill the form correctly");
      });
  };
  useEffect(() => {
    if (data?.intWorkPlaceId) {
      form.setFieldsValue({ intWorkPlaceId: data.intWorkPlaceId });
      form.setFieldsValue({ StrPfAssignType: {value:data.intPFAssignType, label: data?.strPFAssignType} });
      form.setFieldsValue({
        intEmploymentTypeIds: data?.isForAllEmploymentType
          ? [0]
          : data?.employmentTypes?.map((et) => et.value),
      });
    }
  }, [data?.intWorkPlaceId]);
  return (
    <>
      {loading && <Loading />}
      <Form form={form} layout="vertical">
        <Row gutter={[10, 2]}>
          <Col md={24} sm={24} xs={24}>
            <PSelect
              options={workplaceDDL.data}
              name="intWorkPlaceId"
              label="Workplace"
              placeholder="Select Workplace"
              onChange={(value) => {
                form.setFieldsValue({ intWorkPlaceId: value });
                form.resetFields(["intEmploymentTypeIds"]);
                getEmploymentTypeDDL(value);
              }}
              loading={workplaceDDL.loading}
              rules={[{ required: true, message: "Workplace Is Required" }]}
            />
          </Col>
          <Col md={24} sm={24} xs={24}>
            <PSelectWithAll
              form={form}
              name="intEmploymentTypeIds"
              label="Employment Type"
              placeholder="Select Employment Type"
              options={employmentTypeDDL.data}
              loading={employmentTypeDDL.loading}
              AllValueZero={true}
              rules={[
                { required: true, message: "Employment Type is required" },
              ]}
            />
          </Col>
          <Col md={24} sm={24} xs={24}>
            <PSelect
              options={pfAssignTypeOpts}
              name="StrPfAssignType"
              label="PF Assignment Type"
              placeholder="Select PF Assignment Type"
              onChange={(_, op) => {
                form.setFieldsValue({ StrPfAssignType: op });
              }}
              loading={loadingPfAssignType}
              rules={[
                {
                  required: true,
                  message: "PF Assignment Type Is Required",
                },
              ]}
            />
          </Col>
        </Row>
      </Form>
      <ModalFooter onCancel={onCancel} onSubmit={onSubmit} />
    </>
  );
};

export default PolicyExtend;
