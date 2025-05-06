import { ModalFooter } from "Components/Modal";
import { PForm, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { getWorkplaceDDL } from "common/api/commonApi";
import Loading from "common/loading/Loading";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function PunishmentExtension({
  orgId,
  buId,
  wgId,
  employeeId,
  getData,
  setOpen,
  setSingleData,
  singleData,
  setExtend,
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
      setExtend(false);
      setSingleData({});
    };

    const payload = {
      workplaceGroupId: wgId,
      leavePunishmentId: singleData?.punishmentId,
      businessUnitId: buId,
      actionBy: employeeId,
      workplaceId: values?.workplace?.value || 0,

      employmentTypeId: values?.intEmploymentTypeList
        ?.map((item: any) => item.value)
        .join(","),
    };
    extensionApi.action({
      urlKey: "LeavePunishmentExtend",
      method: "POST",
      payload: payload,
      onSuccess: (res) => {
        toast.success(res?.message[0]);
        cb();
      },
      onError: (res: any) => {
        toast.error(
          res?.response?.data?.message?.[0] ||
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
      {extensionApi.loading && <Loading />}
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
            setExtend(false);
          }}
          submitAction="submit"
        />
      </PForm>
    </>
  );
}
