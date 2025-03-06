import React, { useEffect, useState } from "react";
import { Drawer, Row, Col, Form, Button, Checkbox } from "antd";
import { PButton, PForm, PInput, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { FilterOutlined } from "@ant-design/icons";
import moment from "moment";

type CommonFilterProps = {
  visible: boolean;
  onClose: (visible: boolean) => void;
  onFilter: (values: any) => void;
  isDate?: boolean;
  isDateSeparate?: boolean;
  isWorkplaceGroup?: boolean;
  isWorkplace?: boolean;
  isDepartment?: boolean;
  isDesignation?: boolean;
  isStatus?: boolean;
  statusDDL?: any;
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

type FilterData = {
  workplaceGroup?: { value: number };
  [key: string]: any;
};

const CommonFilter: React.FC<CommonFilterProps> = ({
  visible,
  onClose,
  onFilter,
  isDate,
  isDateSeparate,
  isWorkplaceGroup,
  isWorkplace,
  isDepartment,
  isDesignation,
  isStatus,
  statusDDL,
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

  const [filterData, setFilterData] = useState<FilterData>({});

  useEffect(() => {
    if (visible) {
      const savedFilters = localStorage.getItem("commonFilterData");

      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);

        const fromDate = parsedFilters.fromDate
          ? moment(parsedFilters.fromDate)
          : null;
        const toDate = parsedFilters.toDate
          ? moment(parsedFilters.toDate)
          : null;

        form.setFieldsValue({
          ...parsedFilters,
          fromDate,
          toDate,
        });

        setFilterData(parsedFilters);
        setSaveFilter(true);
      }
    }
  }, [visible]);

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
    const workplaceIds = workplace?.value
      ? workplace?.value.toString().split(",")
      : [];

    if (!workplaceGroup?.value || workplaceIds.length > 1) {
      console.warn(
        "Skipping Department API call: Multiple workplaces selected."
      );
      return;
    }

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

    const workplaceIds = workplace?.value
      ? workplace?.value.toString().split(",")
      : [];

    if (!workplaceGroup?.value || workplaceIds.length > 1) {
      console.warn(
        "Skipping Designation API call: Multiple workplaces selected."
      );
      return;
    }

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

  // Fetch Data Only When Drawer Opens
  useEffect(() => {
    if (visible) {
      if (isWorkplaceGroup) {
        getWorkplaceGroup();
      }
      if (isWorkplace) {
        getWorkplace();
      }
      if (isDepartment) {
        getEmployeDepartment();
      }
      if (isDesignation) {
        getDesignation();
      }
    }
  }, [visible]); // Runs only when 'visible' changes

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
          border: "none",
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
            {isStatus && (
              <Col md={24} sm={12} xs={24}>
                <PSelect
                  style={{ marginBottom: "5px" }}
                  options={statusDDL || []}
                  name="status"
                  label={"Status"}
                  showSearch
                  placeholder="Status"
                  onChange={(value) => {
                    form.setFieldsValue({
                      status: value,
                    });
                  }}
                />
              </Col>
            )}
            {isDate && (
              <>
                <Col md={12} sm={24}>
                  <PInput
                    type="date"
                    name="fromDate"
                    label="From Date"
                    placeholder="From Date"
                    onChange={(value) => {
                      form.setFieldsValue({
                        fromDate: value,
                      });
                    }}
                  />
                </Col>
                <Col md={12} sm={24}>
                  <PInput
                    type="date"
                    name="toDate"
                    label="To Date"
                    placeholder="To Date"
                    onChange={(value) => {
                      form.setFieldsValue({
                        toDate: value,
                      });
                    }}
                  />
                </Col>
              </>
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
                    const workplaceIds = value
                      ? value.toString().split(",")
                      : [];
                    if (workplaceIds.length > 1) {
                      form.setFieldsValue({
                        workplace: op,
                        department: undefined,
                        designation: undefined,
                      });
                    } else {
                      form.setFieldsValue({ workplace: op });
                    }
                    if (workplaceIds.length === 1) {
                      getEmployeDepartment();
                      getDesignation();
                    }
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
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      department: op,
                      designation: undefined,
                    });
                  }}
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
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      designation: op,
                    });
                  }}
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
                onClick={() => {
                  const values = form.getFieldsValue();
                  console.log("values", values);

                  localStorage.setItem(
                    "commonFilterData",
                    JSON.stringify(values)
                  );
                  onFilter(values);
                }}
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
