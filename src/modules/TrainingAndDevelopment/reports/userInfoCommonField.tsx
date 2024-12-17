import { Col } from "antd";
import { PSelect } from "Components";
import { useApiRequest } from "Hooks";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

const UserInfoCommonField = ({ form }: any) => {
  const dispatch = useDispatch();
  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { buId, wgId, employeeId, orgId } = profileData;

  const getBUnitDDL = useApiRequest({});
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  // workplace wise
  const getWorkplaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "WorkplaceGroupWithRoleExtension",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        empId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };

  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplace?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        intId: employeeId,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };
  useEffect(() => {
    getBUnitDDL.action({
      urlKey: "BusinessUnitWithRoleExtension",
      method: "GET",
      params: {
        workplaceGroupId: wgId,
        businessUnitId: buId,
        empId: employeeId || 0,
        accountId: orgId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.strBusinessUnit;
          res[i].value = item?.intBusinessUnitId;
        });
      },
    });
    getWorkplaceGroup();
  }, [buId, wgId]);
  return (
    <>
      <Col md={6} sm={12} xs={24}>
        <PSelect
          options={getBUnitDDL?.data?.length > 0 ? getBUnitDDL?.data : []}
          name="bUnit"
          label="Business Unit"
          showSearch
          filterOption={true}
          placeholder="Business Unit"
          onChange={(value, op) => {
            form.setFieldsValue({
              bUnit: op,
            });
          }}
          rules={[{ required: true, message: "Business Unit is required" }]}
        />
      </Col>
      <Col md={6} sm={12} xs={24}>
        <PSelect
          options={workplaceGroup?.data || []}
          name="workplaceGroup"
          label="Workplace Group"
          placeholder="Workplace Group"
          onChange={(value, op) => {
            form.setFieldsValue({
              workplaceGroup: op,
              workplace: undefined,
            });
            getWorkplace();
          }}
          rules={[{ required: true, message: "Workplace Group is required" }]}
        />
      </Col>
      <Col md={6} sm={12} xs={24}>
        <PSelect
          options={workplace?.data || []}
          name="workplace"
          label="Workplace"
          placeholder="Workplace"
          // disabled={+id ? true : false}
          onChange={(value, op) => {
            form.setFieldsValue({
              workplace: op,
            });
            // getEmployeDepartment();
            // getEmployeePosition();

            //   getDesignation();
          }}
          rules={[{ required: true, message: "Workplace is required" }]}
        />
      </Col>
    </>
  );
};

export default UserInfoCommonField;
