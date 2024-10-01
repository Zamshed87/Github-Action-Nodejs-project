import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  const dispatch = useDispatch();
  // const debounce = useDebounce();

  const saveHRPostion = useApiRequest({});
  const getBUnitDDL = useApiRequest({});

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  // ddls
  useEffect(() => {
    getBUnitDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        // id: singleData?.intBusinessUnitId,
        DDLType: "PayscaleGrade",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        intId: employeeId || 0,
        intWorkplaceId: wId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.PayscaleGradeName;
          res[i].value = item?.PayscaleGradeId;
        });
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId]);
  // states

  // Pages Start From Here code from above will be removed soon

  // Form Instance
  const [form] = Form.useForm();
  // submit
  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      resetForm();
      setIsAddEditForm(false);
      getData();
    };
    let payload = {
      intDesignationId: singleData?.intDesignationId
        ? singleData?.intDesignationId
        : 0,
      strDesignation: values?.strDesignation,
      strDesignationCode: values?.strDesignationCode,
      intPositionId: 0,
      isActive: values?.isActive || true,
      isDeleted: values?.isDeleted,
      intBusinessUnitIdList: buId,
      intUserRoleIdList: [],
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      dteUpdatedAt: todayDate(),
      intPayscaleGradeId: values?.payscaleGrade?.value,
      intWorkplaceId: wId,
      intRankingId: 0,
      intBusinessUnitId: buId,
    };
    saveHRPostion.action({
      urlKey: "SaveDesignation",
      method: "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
    });
  };

  useEffect(() => {
    if (singleData?.intDesignationId) {
      form.setFieldsValue({
        ...singleData,
        payscaleGrade: {
          value: singleData?.intPayscaleGradeId,
          label: singleData?.strPayscaleGradeName,
        },
      });
    }
  }, [singleData]);
  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          submitHandler({
            values,
            getData,
            resetForm: form.resetFields,
            setIsAddEditForm,
            isEdit,
          });
        }}
        initialValues={{}}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strDesignation"
              label="Designation"
              placeholder="Designation"
              rules={[{ required: true, message: "Designation is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strDesignationCode"
              label="Code"
              placeholder="Code"
              rules={[{ required: true, message: "Code is required" }]}
            />
          </Col>

          <Col md={12} sm={24}>
            <PSelect
              options={getBUnitDDL?.data?.length > 0 ? getBUnitDDL?.data : []}
              name="payscaleGrade"
              label="Payscale Grade"
              showSearch
              filterOption={true}
              placeholder="Payscale Grade"
              onChange={(value, op) => {
                form.setFieldsValue({
                  payscaleGrade: op,
                });
              }}
              // rules={[{ required: true, message: "District is required" }]}
            />
          </Col>
        </Row>
        <ModalFooter
          onCancel={() => {
            setId("");
            setIsAddEditForm(false);
          }}
          submitAction="submit"
          loading={loading}
        />
      </PForm>
    </>
  );
}
