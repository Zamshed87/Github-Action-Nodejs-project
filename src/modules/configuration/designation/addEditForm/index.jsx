import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { levelOfLeaderApiCall } from "modules/pms/configuration/evaluationCriteria/helper";
import { useEffect, useState } from "react";

import { shallowEqual, useSelector } from "react-redux";
import { orgIdsForBn } from "utility/orgForBanglaField";
import { checkBng } from "utility/regxExp";
import { todayDate } from "utility/todayDate";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  const saveHRPostion = useApiRequest({});
  const getBUnitDDL = useApiRequest({});
  const [loading, setLoading] = useState(false);
  const [levelofLeaderShip, setLevelofLeaderShip] = useState([]);

  const { orgId, buId, employeeId, wgId, wId, strWorkplace, intAccountId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

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
    const editFopayload = {
      intDesignationId: singleData?.intDesignationId
        ? singleData?.intDesignationId
        : 0,
      strDesignation: values?.strDesignation,
      strDesignationBn: values?.strDesignationBn || null,
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
      positionGroupId: values?.levelOfLeader?.value || null,
    };
    const payload = {
      designation: values?.strDesignation,
      designationBn: values?.strDesignationBn || null,
      designationCode: values?.strDesignationCode,
      positionId: 0,
      rankingId: 0,
      payscaleGradeId: values?.payscaleGrade?.value,
      workplaceIdList: values?.workplace?.map((wp) => {
        return wp.value;
      }),
      businessUnitId: buId,
      accountId: orgId,
      actionBy: employeeId,
      positionGroupId: values?.levelOfLeader?.value || null,
    };
    saveHRPostion.action({
      urlKey: singleData?.intDesignationId
        ? "SaveDesignation"
        : "CreateDesignation",
      method: "POST",
      payload: singleData?.intDesignationId ? editFopayload : payload,
      onSuccess: () => {
        cb();
      },
      toast: true,
    });
  };
  const getWDDL = useApiRequest({});
  useEffect(() => {
    levelOfLeaderApiCall(intAccountId, setLevelofLeaderShip, setLoading);
    getWDDL.action({
      urlKey: "WorkplaceIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });

    if (singleData?.intDesignationId) {
      form.setFieldValue("workplace", [{ label: strWorkplace, value: wId }]);
      form.setFieldsValue({
        ...singleData,
        payscaleGrade: {
          value: singleData?.intPayscaleGradeId,
          label: singleData?.strPayscaleGradeName,
        },
      });
      form.setFieldValue("levelOfLeader", [
        {
          label: singleData?.srtPositionGroup,
          value: singleData?.intPositionGroupId,
        },
      ]);
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
          {orgIdsForBn.includes(orgId) && (
            <Col md={12} sm={24}>
              <PInput
                type="text"
                name="strDesignationBn"
                label="Designation (In Bangla)"
                placeholder="Designation (In Bangla)"
                rules={[
                  {
                    message: "This Field Must be in Bangla",
                    pattern: new RegExp(checkBng()),
                  },
                ]}
              />
            </Col>
          )}
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
          {!singleData?.intDesignationId && (
            <Col md={12} sm={24}>
              <PSelect
                options={getWDDL?.data?.length > 0 ? getWDDL?.data : []}
                name="workplace"
                label="Workplace"
                showSearch
                filterOption={true}
                mode={!singleData?.intDesignationId && "multiple"}
                maxTagCount={!singleData?.intDesignationId && "responsive"}
                placeholder="Workplace"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    workplace: op,
                  });
                }}
                rules={[{ required: true, message: "Workplace is required" }]}
              />
            </Col>
          )}
          <Col md={12} sm={24}>
            <PSelect
              options={levelofLeaderShip.length > 0 ? levelofLeaderShip : []}
              name="levelOfLeader"
              label="Level of Leadership"
              placeholder="Level of Leadership"
              onChange={(value, op) => {
                form.setFieldsValue({
                  levelOfLeader: op,
                });
              }}
              rules={[
                { required: true, message: "Level of Leadership is required" },
              ]}
            />
          </Col>
        </Row>
        <ModalFooter
          onCancel={() => {
            setId("");
            setIsAddEditForm(false);
          }}
          submitAction="submit"
          loading={saveHRPostion.loading}
        />
      </PForm>
    </>
  );
}

// useEffect(() => {
//   ;
// }, [wgId, buId, employeeId]);

// useEffect(() => {
//   PeopleDeskSaasDDLWithFilter(
//     "UserRoleDDL",
//     wgId,
//     buId,
//     setUserRoleDDL,
//     "value",
//     "label",
//     0,
//     true,
//     "isDefault",
//     true
//   );
//   PeopleDeskSaasDDL(
//     "PayscaleGrade",
//     wgId,
//     "",
//     setPayscaleGradeDDL,
//     "PayscaleGradeId",
//     "PayscaleGradeName",
//     0
//   );
// }, [wgId, buId]);

// useEffect(() => {
//   if (singleData?.intDesignationId) {
//     const newRowData = {
//       designation: singleData?.strDesignation,
//       code: singleData?.strDesignationCode,
//       businessUnit: singleData?.businessUnitValuLabelVMList.map((itm) => {
//         return {
//           value: itm?.value,
//           label: itm?.label,
//         };
//       }),
//       userRole: singleData?.roleValuLabelVMList.map((itm) => {
//         return {
//           value: itm?.value,
//           label: itm?.label,
//         };
//       }),
//       isActive: singleData?.isActive || false,
//       payscaleGrade: {
//         value: singleData?.intPayscaleGradeId,
//         label: singleData?.strPayscaleGradeName,
//       },
//     };
//     setModifySingleData(newRowData);
//   }
// }, [singleData]);

// const saveHandler = (values, cb) => {
//   // if (values?.userRole?.length <= 0) {
//   //   return toast.warn("User role is required!!!");
//   // }

//   let userRoleListId = [];

//   if (values?.userRole?.length > 0) {
//     userRoleListId = values?.userRole?.map((itm) => itm?.value);
//   }

//   // if (busUnitListId[0] !== 0 && busUnitListId?.length > 1) {
//   //   return toast.warn("Please remove all busisness unit type !!!");
//   // }

//   let payload = {
//     strDesignation: values?.designation,
//     strDesignationCode: values?.code,
//     intPositionId: 0,
//     isActive: values?.isActive,
//     isDeleted: values?.isDeleted,
//     intBusinessUnitIdList: buId,
//     intUserRoleIdList: userRoleListId,
//     intAccountId: orgId,
//     dteCreatedAt: todayDate(),
//     dteUpdatedAt: todayDate(),
//     intPayscaleGradeId: values?.payscaleGrade?.value,
//     intWorkplaceId: wId,
//     intRankingId: 0,
//     intBusinessUnitId: buId,
//   };

//   const callback = () => {
//     cb();
//     onHide();

//     // For landing page data
//     getAllDesignation(orgId, buId, setRowDto, setAllData, "", wId);
//   };

//   if (singleData?.intDesignationId) {
//     createDesignation(
//       {
//         ...payload,
//         intDesignationId: singleData?.intDesignationId,
//         intCreatedBy: 0,
//         intUpdatedBy: employeeId,
//       },
//       setLoading,
//       callback
//     );
//   } else {
//     createDesignation(
//       {
//         ...payload,
//         intDesignationId: 0,
//         intCreatedBy: employeeId,
//         intUpdatedBy: 0,
//       },
//       setLoading,
//       callback
//     );
//   }
// };
