import { Col } from "antd";
import { PSelect } from "Components";
import { useApiRequest } from "Hooks";
import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { setCustomFieldsValue } from "./helper";
import { orgIdsForBn } from "utility/orgForBanglaField";

const CommonFilterField = ({
  form,
  isDepartment,
  isDesignation,
  col,
  mode = undefined,
  isSection,
}: {
  form: any;
  isDepartment?: boolean;
  isDesignation?: boolean;
  col?: number;
  mode?: string | undefined;
  isSection?: boolean;
}) => {
  const { profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { buId, wgId, employeeId, orgId, intAccountId } = profileData;

  const workplaceGroup = useApiRequest([]);
  const workplaceDDL = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const designationApi = useApiRequest([]);
  const positionDDL = useApiRequest([]);
  const empSectionDDL = useApiRequest([]);

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
    workplaceDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        intId: employeeId,
      },
      onSuccess: (res: any) => {
        const list: any = [];
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
          list.push(item?.intWorkplaceId);
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
        workplaceId: typeof workplace?.value == "string" ? 0 : workplace?.value,

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
        workplaceId: typeof workplace?.value == "string" ? 0 : workplace?.value,
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

  // section wise ddl
  const getEmployeeSection = () => {
    const { department, workplace, workplaceGroup } = form.getFieldsValue(true);
    empSectionDDL?.action({
      urlKey: "SectionIdAll",
      method: "GET",
      params: {
        accountId: intAccountId,
        businessUnitId: buId,
        departmentId: department?.value || 0,
        workplaceGroupId: workplaceGroup?.value,
        workplaceId: workplace?.value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label =
            orgIdsForBn.includes(orgId) && item?.strSectionNameBn
              ? `${item?.strSectionName} (${item?.strSectionNameBn})`
              : item?.strSectionName;
          res[i].value = item?.intSectionId;
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
          options={workplaceDDL?.data || []}
          name="workplace"
          label="Workplace"
          allowClear
          placeholder="Workplace"
          mode={mode as "multiple" | undefined | "tags"}
          showSearch
          onChange={(value, op) => {
            const { workplaceGroup } = form.getFieldsValue(true);
            if (workplaceGroup?.value != 0 && value == 0) {
              form.setFieldsValue({
                workplace: {
                  label: "All",
                  value: workplaceDDL?.data
                    ?.filter((item: any) => item.value != 0)
                    ?.map((item: any) => item.value)
                    .join(","),
                },
                workplaceId: value,
              });
            } else {
              form.setFieldsValue({
                workplace: op,
                workplaceId: value,
                workplaceGroupId: undefined,
              });
            }
            if (isDepartment) {
              getEmployeDepartment();
            }
            if (isDesignation) {
              getDesignation();
            }
            if (isSection) {
              getEmployeeSection();
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
      {isSection && (
        <Col md={col || 6} sm={12} xs={24}>
          <PSelect
            options={empSectionDDL?.data || []}
            name="section"
            label="Section"
            mode={"multiple"}
            showSearch
            allowClear
            placeholder="Section"
            onChange={(value, op) => {
              setCustomFieldsValue(form, "section", op);
            }}
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
