import React, { useEffect, useState } from "react";
import { Drawer, Row, Col, Form, Button, Checkbox } from "antd";
import { PButton, PForm, PInput, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { FilterOutlined } from "@ant-design/icons";

type CommonFilterProps = {
  visible: boolean;
  onClose: (visible: boolean) => void;
  onFilter: (values: any) => void;
  isDate?: boolean;
  isWorkplaceGroup?: boolean;
  isWorkplace?: boolean;
  isDepartment?: boolean;
  isDesignation?: boolean;
  isAllValue?: boolean;
};

type TokenData = {
  workplaceGroupList: any[];
  workplaceList: any[];
};

type ProfileData = {
  buId: number;
  wgId: number;
  employeeId: number;
  orgId: number;
};

const CommonFilter: React.FC<CommonFilterProps> = ({
  visible,
  onClose,
  onFilter,
  isDate,
  isWorkplaceGroup,
  isWorkplace,
  isDepartment,
  isDesignation,
  isAllValue,
}) => {
  // Form Instance
  const [form] = Form.useForm();

  // Redux Data
  const { profileData, tokenData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  ) as { profileData: ProfileData; tokenData: string };

  const { buId, wgId, employeeId, orgId } = profileData;

  // Decode Token Data
  const decodedToken: TokenData = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : { workplaceGroupList: [], workplaceList: [] };

  const { workplaceGroupList, workplaceList } = decodedToken;

  // API Calls
  const workplaceGroup = useApiRequest([]);
  const workplaceDDL = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const designationApi = useApiRequest([]);
  const [saveFilter, setSaveFilter] = useState(false);

  useEffect(() => {
    if (visible) {
      const savedFilters = localStorage.getItem("commonFilterData");
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
        form.setFieldsValue(parsedFilters);
        setSaveFilter(true);
      }
    }
  }, [visible]);

  const handleSaveToggle = (checked: boolean) => {
    setSaveFilter(checked);
    if (checked) {
      const values = form.getFieldsValue();
      localStorage.setItem("commonFilterData", JSON.stringify(values));
    } else {
      localStorage.removeItem("commonFilterData");
    }
  };

  // workplace Group
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
      onSuccess: (res: any[]) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
        res.unshift({
          label: "All",
          value: (isAllValue && workplaceGroupList) || 0,
        });
      },
    });
  };

  // workplace
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
      onSuccess: (res: any[]) => {
        const list: number[] = [];
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
          list.push(item?.intWorkplaceId);
        });
        res.unshift({
          label: "All",
          value: (isAllValue && workplaceList) || 0,
        });
      },
    });
  };

  // Employee Department
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
      onSuccess: (res: any[]) => {
        res.forEach((item, i) => {
          res[i].label = item?.strDepartment;
          res[i].value = item?.intDepartmentId;
        });
        res.unshift({ label: "All", value: 0 });
      },
    });
  };

  // Designation
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
      onSuccess: (res: any[]) => {
        res.forEach((item, i) => {
          res[i].label = item?.designationName;
          res[i].value = item?.designationId;
        });
        res.unshift({ label: "All", value: 0 });
      },
    });
  };

  // Fetch Data
  useEffect(() => {
    if (isWorkplaceGroup) {
      getWorkplaceGroup();
    } else if (isWorkplace) {
      getWorkplace();
    } else if (isDepartment) {
      getEmployeDepartment();
    } else if (isDesignation) {
      getDesignation();
    }
  }, []);

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        icon={<FilterOutlined />}
        onClick={() => onClose(true)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "30px",
          height: "30px",
          background: "#27b327",
        }}
      />
      <Drawer
        title="Filter"
        placement="right"
        onClose={() => onClose(false)}
        open={visible}
        width={450}
      >
        <PForm
          form={form}
          onFinish={(values) => {
            onFilter(values);
            // onClose(false);
          }}
          initialValues={{
            workplaceGroup: {
              label: "All",
              value: (isAllValue && workplaceGroupList) || 0,
            },
            workplace: {
              label: "All",
              value: (isAllValue && workplaceList) || 0,
            },
          }}
        >
          <Row gutter={[10, 10]}>
            <Col md={24} sm={24}>
              <Checkbox
                checked={saveFilter}
                onChange={(e) => handleSaveToggle(e.target.checked)}
              >
                Save Filters
              </Checkbox>
            </Col>
            {isDate && (
              <Col md={24} sm={24}>
                <PInput
                  label="Date Range"
                  type="dateRange"
                  name="dateRange"
                  onChange={(value) => {
                    if (Array.isArray(value) && value.length === 2) {
                      const [fromDate, toDate] = value?.map((date: any) =>
                        date ? date.format("DD/MM/YYYY") : null
                      );
                      form.setFieldsValue({
                        fromDate,
                        toDate,
                      });
                    } else {
                      form.setFieldsValue({
                        fromDate: null,
                        toDate: null,
                      });
                    }
                  }}
                />
              </Col>
            )}

            {isWorkplaceGroup && (
              <Col md={12} sm={12}>
                <PSelect
                  options={workplaceGroup?.data || []}
                  name="workplaceGroup"
                  label="Workplace Group"
                  placeholder="Select Workplace Group"
                  allowClear
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplaceGroup: op,
                      workplace: undefined,
                      department: undefined,
                    });
                    getWorkplace();
                  }}
                />
              </Col>
            )}

            {isWorkplace && (
              <Col md={12} sm={12}>
                <PSelect
                  options={workplaceDDL?.data || []}
                  name="workplace"
                  label="Workplace"
                  allowClear
                  placeholder="Select Workplace"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                      department: undefined,
                      designation: undefined,
                    });
                    getEmployeDepartment();
                    getDesignation();
                  }}
                />
              </Col>
            )}

            {isDepartment && (
              <Col md={12} sm={12}>
                <PSelect
                  allowClear
                  options={empDepartmentDDL?.data || []}
                  name="department"
                  label="Department"
                  placeholder="Select Department"
                />
              </Col>
            )}

            {isDesignation && (
              <Col md={12} sm={12}>
                <PSelect
                  allowClear
                  options={designationApi?.data || []}
                  name="designation"
                  label="Designation"
                  placeholder="Select Designation"
                />
              </Col>
            )}
          </Row>

          <Col md={12} sm={24}>
            <div style={{ display: "flex", marginTop: "20px" }}>
              <PButton
                type="primary"
                content={"View"}
                style={{ marginRight: "10px" }}
                onClick={() => form.submit()}
              />
              <PButton
                type="secondary"
                content={"Reset"}
                onClick={() => {
                  form.resetFields();
                  localStorage.removeItem("commonFilterData");
                }}
              />
            </div>
          </Col>
        </PForm>
      </Drawer>
    </>
  );
};

export default CommonFilter;
