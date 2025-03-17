import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row, Switch } from "antd";
import { getWorkplaceDDL } from "common/api/commonApi";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { orgIdsForBn } from "utility/orgForBanglaField";

export default function LeaveExtension({
  orgId,
  buId,
  wgId,
  employeeId,
  getData,
  setOpen,
  setSingleData,
  singleData,
}: any) {
  const extensionApi = useApiRequest({});

  // states

  // Pages Start From Here code from above will be removed soon

  // Form Instance
  const [form] = Form.useForm();
  // submit
  const submitHandler = () => {
    const values = form.getFieldsValue(true);
    const cb = () => {
      form.resetFields();
      getData();
      setOpen(false);
      setSingleData({});
    };

    const payload = {
      workplaceGroupId: wgId,
      policyId: singleData?.policyId,
      businessUnitId: buId,
      accountId: orgId,
      actionBy: employeeId,
      workplaceId: values?.workplace?.value || 0,
      designationIdList: values?.designationListDTO
        ?.map((item: any) => item.value)
        .join(","),
      employmentTypeIdList: values?.intEmploymentTypeList
        ?.map((item: any) => item.value)
        .join(","),
    };
    extensionApi.action({
      urlKey: "ExtendLeave",
      method: "POST",
      payload: payload,
      onSuccess: (res) => {
        cb();
        toast.success(res?.message[0]);
      },
      onError: (res: any) => {
        toast.error(
          res?.response?.data?.[0] ||
            res?.response?.data?.message ||
            res?.response?.data?.errors?.["GeneralPayload.Description"]?.[0] ||
            res?.response?.data?.Message ||
            res?.response?.data?.title ||
            res?.response?.title ||
            res?.response?.message ||
            res?.response?.Message
        );
      },
    });
  };
  const EmploymentTypeDDL = useApiRequest([]);
  const workplaceDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  const getEmployeDesignation = () => {
    const { workplace } = form.getFieldsValue(true);

    empDesignationDDL?.action({
      urlKey: "DesignationIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: workplace?.value,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = orgIdsForBn.includes(orgId)
            ? item?.designationBn
            : item?.designationName;
          res[i].value = item?.designationId;
        });
      },
    });
  };
  const getEmploymentType = () => {
    const { workplace } = form.getFieldsValue(true);
    // const strWorkplaceIdList = intWorkplaceList
    //   ?.map((item: any) => item.value)
    //   .join(",");

    EmploymentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentTypeWorkplaceWise",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        strWorkplaceIdList: workplace?.value,
      },
      onSuccess: (data) => {
        data?.forEach((item: any, idx: number) => {
          data[idx].label = item?.EmploymentType;
          data[idx].value = item?.Id;
        });
      },
    });
  };
  useEffect(() => {
    getWorkplaceDDL({ workplaceDDL, orgId, buId, wgId });
  }, []);
  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          submitHandler();
        }}
        initialValues={{}}
      >
        <Row gutter={[10, 2]}>
          <Col md={24} sm={24}>
            <PSelect
              showSearch
              allowClear
              options={workplaceDDL?.data || []}
              name="workplace"
              label="Workplace"
              placeholder="Workplace"
              onChange={(value, op) => {
                form.setFieldsValue({
                  intEmploymentTypeList: undefined,
                  hrPositionListDTO: undefined,
                  designationListDTO: undefined,
                  workplace: op,
                });
                if (value) {
                  getEmploymentType();
                  getEmployeDesignation();
                }
              }}
              rules={[
                {
                  required: true,
                  message: "Workplace is required",
                },
              ]}
            />
          </Col>
          <Col md={24} sm={24}>
            <PSelect
              mode="multiple"
              options={
                empDesignationDDL?.data?.length > 0
                  ? [{ value: 0, label: "All" }, ...empDesignationDDL?.data]
                  : []
              }
              name="designationListDTO"
              label="Designation"
              placeholder="Designation"
              onChange={(value, op) => {
                console.log({ value });
                if (value && value.includes(0)) {
                  form.setFieldsValue({
                    designationListDTO: [
                      op.find((item: any) => item.value === 0),
                    ],
                  });
                } else {
                  const filteredOp = op.filter((item: any) => item.value !== 0);
                  form.setFieldsValue({
                    designationListDTO: filteredOp,
                  });
                }
              }}
              rules={[
                {
                  required: true,
                  message: "Designation is required",
                },
              ]}
            />
          </Col>
          <Col md={24} sm={24}>
            <PSelect
              mode="multiple"
              options={
                EmploymentTypeDDL?.data?.length > 0
                  ? [{ value: 0, label: "All" }, ...EmploymentTypeDDL?.data]
                  : []
              }
              name="intEmploymentTypeList"
              label=" Employment Type"
              placeholder="  Employment Type"
              onChange={(value, op) => {
                if (value && value.includes(0)) {
                  form.setFieldsValue({
                    intEmploymentTypeList: [
                      op.find((item: any) => item.value === 0),
                    ],
                  });
                } else {
                  const filteredOp = op.filter((item: any) => item.value !== 0);
                  form.setFieldsValue({
                    intEmploymentTypeList: filteredOp,
                  });
                }
              }}
              rules={[
                {
                  required: true,
                  message: "Employment Type is required",
                },
              ]}
            />
          </Col>
        </Row>
        <ModalFooter
          onCancel={() => {
            setOpen(false);
            setSingleData({});
          }}
          submitAction="submit"
        />
      </PForm>
    </>
  );
}
