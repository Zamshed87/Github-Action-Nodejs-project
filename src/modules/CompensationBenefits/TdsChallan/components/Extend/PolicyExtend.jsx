import { Col, Form, Row } from "antd";
import { ModalFooter } from "Components/Modal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "common/loading/Loading";
import { createTdsChallan } from "../../TdsChallanCreate/helper";
import { PSelect } from "Components";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";

const PolicyExtend = ({ data, setOpenExtend, fetchPfPolicy }) => {
  const {
    profileData: { orgId, buId, wgId, wId, employeeId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const workplaceDDL = useApiRequest([]);

  const getWorkplaceDDL = () => {
    workplaceDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

  useEffect(() => {
    getWorkplaceDDL();
  }, [orgId, buId, wId]);

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
          intEmploymentTypeIds: data?.isForAllEmploymentType
            ? [0]
            : data.employmentTypes?.map((et) => et.value),
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
        await createTdsChallan(payload, setLoading, () => {
          form.resetFields();
          fetchPfPolicy();
          setOpenExtend({ extend: false, data: {} });
        });
      })
      .catch((error) => {
        toast.error("Please fill the form correctly");
      });
  };

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
              }}
              loading={workplaceDDL.loading}
              rules={[{ required: true, message: "Workplace Is Required" }]}
            />
          </Col>
        </Row>
      </Form>
      <ModalFooter onCancel={onCancel} onSubmit={onSubmit} />
    </>
  );
};

export default PolicyExtend;
