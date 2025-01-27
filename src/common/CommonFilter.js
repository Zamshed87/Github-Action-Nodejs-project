import React, { useEffect } from "react";
import { Drawer, Row, Col, Form, Button } from "antd";
import { PButton, PForm, PInput, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { FilterOutlined } from "@ant-design/icons";

const CommonFilter = ({
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
    (state) => state?.auth,
    shallowEqual
  );
  const { buId, wgId, employeeId, orgId } = profileData;

  // Decode Token Data
  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;

  const { workplaceGroupList, workplaceList } = decodedToken;


  // API Calls
  const workplaceGroup = useApiRequest([]);
  const workplaceDDL = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const designationApi = useApiRequest([]);

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
      onSuccess: (res) => {
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
      onSuccess: (res) => {
        const list = [];
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
      onSuccess: (res) => {
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
      onSuccess: (res) => {
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
        width={400}
      >
        <PForm
          form={form}
          onFinish={(values) => {
            onFilter(values);
            onClose(false);
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
            {isDate && (
              <>
                <Col md={24} sm={24}>
                  <PInput
                    label="Date Range"
                    type="dateRange"
                    name="dateRange"
                    onChange={(value) => {
                      if (value && value.length === 2) {
                        const [fromDate, toDate] = value.map((date) =>
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
                    placeholder={["From Date", "To Date"]}
                  />
                </Col>
              </>
            )}

            {isWorkplaceGroup && (
              <Col md={24} sm={24}>
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
              <Col md={24} sm={24}>
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
                  }}
                />
              </Col>
            )}

            {isDepartment && (
              <Col md={24} sm={24}>
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
              <Col md={24} sm={24}>
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
            <div
              style={{
                display: "flex",
                marginTop: "20px",
              }}
            >
              <PButton
                type="primary"
                content={"View"}
                style={{ marginRight: "10px" }}
                onClick={() => {
                  const values = form.getFieldsValue(true);
                  onFilter(values);
                }}
              />
              <PButton
                type="default"
                content={"Reset"}
                onClick={() => {
                  form.resetFields();
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

/**
 * 
 * How to use
 * 
 * 
Short Documentation for Filter Drawer Integration

Step 1: Declare State
- Add a state variable to control the visibility of the drawer:

const [isFilterVisible, setIsFilterVisible] = useState(false);


Step 2: Add a Button to Open the Drawer

<Button
  type="primary"
  icon={<FilterOutlined />}
  onClick={() => setIsFilterVisible(true)} // Opens the drawer
>
  Filter
</Button>

---

Step 3: Add the FilterDrawer Component
- Add the `FilterDrawer` component and pass the required props:

      <CommonFilter
        visible={isFilterVisible} // Control visibility
        onClose={(visible) => setIsFilterVisible(visible)} // Update visibility state
        onFilter={handleFilter} // Handle filter submission
        isDate={true}
        isWorkplaceGroup={true}
        isWorkplace={true}
        isAllValue={true}
      />

Step 4: Configure Conditional Fields

const handleFilter = (values) => {
  console.log("Filters Applied:", values);
  // Implement API calls or logic with filter values
};
 */
