import { Col, FormInstance } from "antd";
import { PSelect } from "Components";
import { useApiRequest } from "Hooks";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setCustomFieldsValue } from "./helper";

const CommonFilterField = ({
  form,
  isDepartment,
  isDesignation,
  col,
  mode = undefined,
}: {
  form: any;
  isDepartment?: boolean;
  isDesignation?: boolean;
  col?: number;
  mode?: string | undefined;
}) => {
  const dispatch = useDispatch();
  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { buId, wgId, employeeId, orgId, wId } = profileData;

  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const designationApi = useApiRequest([]);
  const positionDDL = useApiRequest([]);
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
        res.unshift({ label: "All", value: 0 });
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
        res.unshift({ label: "All", value: 0 });
      },
    });
  };
  const getEmployeDepartment = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    empDepartmentDDL?.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value,
        workplaceId: workplace?.value,

        accountId: orgId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.strDepartment;
          res[i].value = item?.intDepartmentId;
        });
        res.unshift({ label: "All", value: 0 });
      },
    });
  };

  const getDesignation = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);
    designationApi?.action({
      urlKey: "DesignationIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value,
        workplaceId: workplace?.value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.designationName;
          res[i].value = item?.designationId;
        });
        res.unshift({ label: "All", value: 0 });
      },
    });
  };

  useEffect(() => {
    // getBUnitDDL.action({
    //   urlKey: "BusinessUnitWithRoleExtension",
    //   method: "GET",
    //   params: {
    //     workplaceGroupId: wgId,
    //     businessUnitId: buId,
    //     empId: employeeId || 0,
    //     accountId: orgId,
    //   },
    //   onSuccess: (res) => {
    //     res.forEach((item: any, i: number) => {
    //       res[i].label = item?.strBusinessUnit;
    //       res[i].value = item?.intBusinessUnitId;
    //     });
    //     res.unshift({ label: "All", value: 0 });
    //   },
    // });
    getWorkplaceGroup();
  }, [buId, wgId]);
  return (
    <>
      {/* <Col md={col || 6} sm={12} xs={24}>
        <PSelect
          options={getBUnitDDL?.data?.length > 0 ? getBUnitDDL?.data : []}
          name="bUnit"
          label="Business Unit"
          mode={mode as "multiple" | undefined | "tags"}
          showSearch
          filterOption={true}
          placeholder="Business Unit"
          onChange={(value, op) => {
            form.setFieldsValue({
              bUnit: op,
              bUnitId: value,
            });
          }}
          rules={[{ required: true, message: "Business Unit is required" }]}
        />
      </Col> */}
      <Col md={col || 6} sm={12} xs={24}>
        <PSelect
          options={workplaceGroup?.data || []}
          name="workplaceGroup"
          label="Workplace Group"
          allowClear
          placeholder="Workplace Group"
          mode={mode as "multiple" | undefined | "tags"}
          showSearch
          onChange={(value, op) => {
            form.setFieldsValue({
              workplaceGroup: op,
              workplaceGroupId: value,
              workplace: undefined,
            });
            getWorkplace();
          }}
          //   rules={[{ required: true, message: "Workplace Group is required" }]}
        />
      </Col>
      <Col md={col || 6} sm={12} xs={24}>
        <PSelect
          options={workplace?.data || []}
          name="workplace"
          label="Workplace"
          allowClear
          placeholder="Workplace"
          mode={mode as "multiple" | undefined | "tags"}
          showSearch
          onChange={(value, op) => {
            form.setFieldsValue({
              workplace: op,
              workplaceId: value,
            });
            if (isDepartment) {
              getEmployeDepartment();
            }
            if (isDesignation) {
              getDesignation();
            }
            //
            // getEmployeePosition();
          }}
          //   rules={[{ required: true, message: "Workplace is required" }]}
        />
      </Col>
      {isDepartment && (
        <Col md={col || 6} sm={12} xs={24}>
          <PSelect
            options={empDepartmentDDL?.data || []}
            name="department"
            label="Department"
            mode={"multiple"}
            showSearch
            allowClear
            placeholder="Department"
            onChange={(value, op) => {
              setCustomFieldsValue(form, "department", op);
            }}
            // rules={[
            //   {
            //     required: true,
            //     message: "Department is required",
            //   },
            // ]}
          />
        </Col>
      )}
      {isDesignation && (
        <Col md={col || 6} sm={12} xs={24}>
          <PSelect
            options={designationApi?.data || []}
            name="designation"
            label="Designation"
            mode={"multiple"}
            allowClear
            placeholder="Designation"
            showSearch
            onChange={(value, op) => {
              setCustomFieldsValue(form, "designation", op);
            }}
          />
        </Col>
      )}
    </>
  );
};

export default CommonFilterField;
