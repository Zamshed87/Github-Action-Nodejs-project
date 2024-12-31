import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect } from "react";
import { Switch } from "antd";

import { shallowEqual, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";
import { checkBng } from "utility/regxExp";
import { orgIdsForBn } from "utility/orgForBanglaField";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  // const debounce = useDebounce();
  const getBUnitDDL = useApiRequest({});
  const saveDepartment = useApiRequest({});
  const workplaceGroup = useApiRequest([]);
  const workplaceDDL = useApiRequest([]);

  const { orgId, buId, employeeId, wgId, wId, strBusinessUnit } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // states

  // ddls
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
        res.forEach((item, i) => {
          res[i].label = item?.strBusinessUnit;
          res[i].value = item?.intBusinessUnitId;
        });
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId]);
  // Pages Start From Here code from above will be removed soon

  // submit
  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      resetForm();
      setIsAddEditForm(false);
      getData();
    };
    const payloadFoEdit = {
      actionTypeId: singleData?.intDepartmentId ? 2 : 1,
      intDepartmentId: singleData?.intDepartmentId
        ? singleData?.intDepartmentId
        : 0,
      strDepartment: values?.strDepartment || "",
      strDepartmentBn: values?.strDepartmentBn || null,
      strDepartmentCode: values?.strDepartmentCode,
      isActive: values?.isActive,
      isDeleted: true,
      strCostCenterDivision: values?.strCostCenterDivision?.value,
      // intParentDepId: values?.sectionDepartment?.value,
      // strParentDepName: values?.sectionDepartment?.label,
      intBusinessUnitId: values?.bUnit?.value || buId,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
      intWorkplaceId: values?.workplace?.value || wId,
      intWorkplaceGroupId: values?.workplaceGroup?.value || wgId,
    };
    const payload = {
      departmentId: singleData?.intDepartmentId
        ? singleData?.intDepartmentId
        : 0,
      departmentName: values?.strDepartment || "",
      departmentBn: values?.strDepartmentBn || null,
      departmentCode: values?.strDepartmentCode,
      workplaceList:
        values?.workplace?.length > 0
          ? values?.workplace?.map((wp) => {
              return wp.value;
            })
          : [wgId],
      businessUnitId: values?.bUnit?.value || buId,
      accountId: orgId,
      costCenterDivisionId: 0,
      costCenterDivision: values?.strCostCenterDivision?.value,
      // parentDepId: 0,
      // parentDepName: "string",
      actionBy: employeeId,
    };

    saveDepartment.action({
      urlKey: singleData?.intDepartmentId
        ? "SaveEmpDepartment"
        : "CreateEmpDepartment",
      method: "POST",
      payload: singleData?.intDepartmentId ? payloadFoEdit : payload,
      onSuccess: () => {
        cb();
      },
      toast: true,
    });
  };
  // Form Instance
  const [form] = Form.useForm();
  useEffect(() => {
    if (singleData?.intDepartmentId) {
      form.setFieldsValue({
        ...singleData,
        bUnit: {
          value: singleData?.intBusinessUnitId,
          label: singleData?.strBusinessUnit,
        },
        workplace: {
          value: singleData?.intWorkplaceId,
          label: singleData?.strWorkplace,
        },

        workplaceGroup: {
          value: singleData?.intWorkplaceGroupId,
          label: singleData?.strWorkplaceGroup,
        },
        strCostCenterDivision: {
          value: singleData?.strCostCenterDivision,
          label: singleData?.strCostCenterDivision,
        },
      });
    }
  }, [singleData, getBUnitDDL?.data]);

  const getWorkplace = () => {
    const { bUnit, workplaceGroup } = form.getFieldsValue(true);
    workplaceDDL?.action({
      urlKey: "WorkplaceIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: bUnit?.value || buId,
        workplaceGroupId: workplaceGroup?.value || wgId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };
  const getWorkplaceGroup = () => {
    const { values } = form.getFieldsValue(true);
    workplaceGroup?.action({
      urlKey: "WorkplaceGroupIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId || values?.bUnit?.value,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };
  useEffect(() => {
    getWorkplaceGroup();
    if (singleData) {
      getWorkplace();
    }
  }, [buId]);

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
        initialValues={{ bUnit: { value: buId, label: strBusinessUnit } }}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strDepartment"
              label="Department Name"
              placeholder="Department Name"
              rules={[
                { required: true, message: "Department Name is required" },
              ]}
            />
          </Col>
          {orgIdsForBn.includes(orgId) && (
            <Col md={12} sm={24}>
              <PInput
                type="text"
                name="strDepartmentBn"
                label="Department Name (In Bangla)"
                placeholder="Department Name (In Bangla)"
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
              name="strDepartmentCode"
              label="Code"
              placeholder="Code"
              rules={[{ required: true, message: "Code is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
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
                if (value) {
                  getWorkplaceGroup();
                }
              }}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={workplaceGroup.data || []}
              name="workplaceGroup"
              label="Workplace Group"
              placeholder="Workplace Group"
              onChange={(value, op) => {
                form.setFieldsValue({
                  workplaceGroup: op,
                  workplace: undefined,
                });
                if (value) {
                  getWorkplace();
                }
              }}
              rules={[
                {
                  required: true,
                  message: "Workplace Group is required",
                },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            {
              <PSelect
                options={workplaceDDL?.data || []}
                name="workplace"
                label="Workplace/Concern"
                placeholder="Workplace/Concern"
                mode={!singleData?.intDepartmentId && "multiple"}
                maxTagCount={!singleData?.intDepartmentId && "responsive"}
                onChange={(value, op) => {
                  form.setFieldsValue({
                    workplace: op,
                  });
                }}
                rules={[{ required: true, message: "Workplace is required" }]}
              />
            }
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={[
                {
                  label: "Sales",
                  value: "Sales",
                },
                {
                  label: "Admin",
                  value: "Admin",
                },
              ]}
              name="strCostCenterDivision"
              label="Cost Center Division"
              showSearch
              filterOption={true}
              placeholder="Cost Center Division"
              onChange={(value, op) => {
                form.setFieldsValue({
                  strCostCenterDivision: op,
                });
              }}
            />
          </Col>

          {isEdit && (
            <Col
              md={24}
              style={{
                marginLeft: "-0.5rem",
              }}
            >
              <div
                className=""
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  className="input-main position-group-select "
                  style={{ margin: "3rem 0 0 0.7rem" }}
                >
                  <h6 className="title-item-name">Department Activation</h6>
                  <p className="subtitle-p">
                    Activation toggle indicates to the particular department
                    status (Active/Inactive)
                  </p>
                </div>
                <div
                  style={{
                    margin: "4rem 0 -1.5rem -2rem",
                    // padding: "5rem -2rem 0 -15rem",
                  }}
                >
                  <Form.Item name="isActive" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </div>
              </div>
            </Col>
          )}
        </Row>
        <ModalFooter
          onCancel={() => {
            setId("");
            setIsAddEditForm(false);
          }}
          submitAction="submit"
          loading={saveDepartment.loading}
        />
      </PForm>
    </>
  );
}
