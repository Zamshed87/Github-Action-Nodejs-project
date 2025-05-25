import { Col, Form, Row } from "antd";
import { PSelect } from "Components";
import { ModalFooter } from "Components/Modal";
import useConfigSelectionHook from "../absentPunishmentConfiguration/useConfigSelectionHook";
import PSelectWithAll from "Components/PForm/Select/PSelectWithAll";
import { createAbsentPunishment } from "../absentPunishmentConfiguration/helper";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "common/loading/Loading";

const PolicyExtend = ({ data, setOpenExtend }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState({});
  const {
    workplaceDDL,
    employmentTypeDDL,
    empDesignationDDL,
    getEmploymentTypeDDL,
    getEmployeeDesignation,
  } = useConfigSelectionHook(form);
  const onCancel = () => {
    setOpenExtend({ extend: false, data: {} });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/AbsentPunishment/GetDetailsById?policyId=${data?.policyId}`
        );
        setDetail(res?.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, [data]);

  const onSubmit = () => {
    form.validateFields().then(async (values) => {
      const payload = {
        workplaceId: values?.workplaceId,
        employmentTypeList: values?.employmentTypeList,
        designationList: values?.designationList,
        policyName: detail?.policyName,
        policyDescription: detail?.policyDescription,
        absentCalculationType: detail?.absentCalculationType,
        absentPunishmentElementDto: detail?.absentPunishmentElementDetailsDto,
      };
      await createAbsentPunishment(payload, setLoading);
      setOpenExtend({ extend: false, data: {} });
    }).catch((error) => { 
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
              name="workplaceId"
              label="Workplace"
              placeholder="Select Workplace"
              onChange={(value) => {
                form.setFieldsValue({ workplace: value });
                getEmploymentTypeDDL();
                getEmployeeDesignation();
                form.resetFields([
                  "employmentTypeList",
                  "designationList",
                ]);
              }}
              loading={workplaceDDL.loading}
              rules={[{ required: true, message: "Workplace Is Required" }]}
            />
          </Col>
          <Col md={24} sm={24} xs={24}>
            <PSelectWithAll
              form={form}
              name="employmentTypeList"
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
            <PSelectWithAll
              form={form}
              name="designationList"
              label="Employee Designation"
              placeholder="Select Employee Designation"
              options={empDesignationDDL.data}
              loading={empDesignationDDL.loading}
              AllValueZero={true}
              rules={[
                { required: true, message: "Employee Designation is required" },
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
