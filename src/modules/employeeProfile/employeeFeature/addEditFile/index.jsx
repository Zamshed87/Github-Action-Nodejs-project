import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { updateUerAndEmpNameAction } from "../../../../commonRedux/auth/actions";
import { createEditEmpAction, userExistValidation } from "../helper";
import { submitHandler } from "./helper";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  pages,
}) {
  const dispatch = useDispatch();
  // const debounce = useDebounce();

  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  const { orgId, buId, employeeId, intUrlId, wgId, wId, intAccountId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  const [loading, setLoading] = useState(false);

  // states

  const [isUserCheckMsg, setIsUserCheckMsg] = useState("");

  // Pages Start From Here code from above will be removed soon

  // Form Instance
  const [form] = Form.useForm();

  // Api Instance
  const supervisorDDL = useApiRequest([]);
  const dottedSupervisorDDL = useApiRequest([]);
  const lineManagerDDL = useApiRequest([]);
  const calendarDDL = useApiRequest([]);
  const rosterGroupDDL = useApiRequest([]);
  const calendarByRosterGroupDDL = useApiRequest([]);
  const religionDDL = useApiRequest([]);
  const genderDDL = useApiRequest([]);
  const employmentTypeDDL = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const workplaceGroup = useApiRequest([]);
  const workplaceDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  const employeeStatusDDL = useApiRequest([]);
  const positionDDL = useApiRequest([]);
  const userTypeDDL = useApiRequest([]);
  const generateEmpCode = useApiRequest([]);

  // Api Functions
  const getSuperVisorDDL = debounce((value) => {
    if (value?.length < 2) return supervisorDDL?.reset();

    supervisorDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmployeeBasicInfoForEmpMgmt",
        AccountId: intAccountId,
        BusinessUnitId: buId,
        intId: employeeId,
        workplaceGroupId: wgId,
        searchTxt: value || "",
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.EmployeeOnlyName;
          res[i].value = item?.EmployeeId;
        });
      },
    });
  }, 500);

  const getDottedSuperVisorDDL = debounce((value) => {
    if (value?.length < 2) return dottedSupervisorDDL?.reset();

    dottedSupervisorDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmployeeBasicInfoForEmpMgmt",
        AccountId: intAccountId,
        BusinessUnitId: buId,
        intId: employeeId,
        workplaceGroupId: wgId,
        searchTxt: value || "",
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.EmployeeOnlyName;
          res[i].value = item?.EmployeeId;
        });
      },
    });
  }, 500);

  const getLineManagerDDL = debounce((value) => {
    if (value?.length < 2) return lineManagerDDL?.reset();

    lineManagerDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmployeeBasicInfoForEmpMgmt",
        AccountId: intAccountId,
        BusinessUnitId: buId,
        intId: employeeId,
        workplaceGroupId: wgId,
        searchTxt: value || "",
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.EmployeeOnlyName;
          res[i].value = item?.EmployeeId;
        });
      },
    });
  }, 500);

  const getCalendarDDL = () => {
    calendarDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Calender",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: 0, // employeeId, Previously set 0
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.CalenderName;
          res[i].value = item?.CalenderId;
        });
      },
    });
  };

  const getRosterGroupDDL = () => {
    rosterGroupDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "RosterGroup",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: 0, // employeeId, Previously set 0
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.RosterGroupName;
          res[i].value = item?.RosterGroupId;
        });
      },
    });
  };

  const userValidation = debounce(userExistValidation, 500); // delay of 1 second

  const getCalendarByRosterDDL = () => {
    const { calender } = form.getFieldsValue(true);
    calendarByRosterGroupDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "CalenderByRosterGroup",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: calender?.value, // employeeId, Previously set 0
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.CalenderName;
          res[i].value = item?.CalenderId;
        });
      },
    });
  };

  const getUserTypeDDL = () => {
    userTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "UserType",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: 0, // employeeId, Previously set 0
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strUserType;
          res[i].value = item?.intUserTypeId;
        });
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
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

  const commonConfigurationDDL = () => {
    religionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Religion",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.ReligionName;
          res[i].value = item?.ReligionId;
        });
      },
    });

    employmentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.EmploymentType;
          res[i].value = item?.Id;
        });
      },
    });

    empDepartmentDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDepartment",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.DepartmentName;
          res[i].value = item?.DepartmentId;
        });
      },
    });

    workplaceGroup?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "WorkplaceGroup",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });

    empDesignationDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDesignation",
        AccountId: intAccountId,
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.DesignationName;
          res[i].value = item?.DesignationId;
        });
      },
    });

    employeeStatusDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmployeeStatus",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.EmployeeStatus;
          res[i].value = item?.EmployeeStatusId;
        });
      },
    });

    genderDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Gender",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.GenderName;
          res[i].value = item?.GenderId;
        });
      },
    });

    positionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Position",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.PositionName;
          res[i].value = item?.PositionId;
        });
      },
    });
  };

  const autoGenerateEmployeeCode = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    generateEmpCode?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "AutoEmployeeCode",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        form.setFieldsValue({ employeeCode: res[0]?.value });
      },
    });
  };

  useEffect(() => {
    commonConfigurationDDL();
    getUserTypeDDL();
  }, [orgId, buId, wgId, employeeId]);

  useEffect(() => {
    if (singleData?.empId) {
      console.log(singleData, "Single Data");
      form.setFieldsValue(singleData);
      getWorkplace();
    }
  }, [orgId, buId, singleData, employeeId]);

  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          submitHandler({
            values,
            getData,
            // empBasic,
            resetForm: form.resetFields,
            pages,
            setIsAddEditForm,
            employeeId,
            dispatch,
            updateUerAndEmpNameAction,
            isUserCheckMsg,
            createEditEmpAction,
            isEdit,
            orgId,
            buId,
            intUrlId,
            setLoading,
          });
        }}
        initialValues={{}}
        onValuesChange={(changedFields, allFields) => {
          if (allFields?.workplaceGroup && changedFields?.workplaceGroup) {
            setTimeout(autoGenerateEmployeeCode, 500);
          }
        }}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="fullName"
              label="Full Name"
              placeholder="Full Name"
              rules={[{ required: true, message: "Full Name is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={employmentTypeDDL?.data || []}
              name="employeeType"
              label="Employment Type"
              placeholder="Employment Type"
              onChange={(value, op) => {
                form.setFieldsValue({
                  employeeType: op,
                });
              }}
              rules={[
                { required: true, message: "Employment Type is required" },
              ]}
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
                });
                value && getWorkplace();
              }}
              rules={[
                { required: true, message: "Workplace Group is required" },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={workplaceDDL?.data || []}
              name="workplace"
              label="Workplace"
              placeholder="Workplace"
              onChange={(value, op) => {
                form.setFieldsValue({
                  workplace: op,
                });
              }}
              rules={[{ required: true, message: "Workplace is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="number"
              name="employeeCode"
              label="Employee Code"
              placeholder="Employee Code"
              rules={[{ required: true, message: "Employee Code is required" }]}
              min
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={religionDDL?.data || []}
              name="religion"
              label="Religion"
              placeholder="Religion"
              onChange={(value, op) => {
                form.setFieldsValue({
                  religion: op,
                });
              }}
              rules={[{ required: true, message: "Religion is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={genderDDL?.data || []}
              name="gender"
              label="Gender"
              placeholder="Gender"
              onChange={(value, op) => {
                form.setFieldsValue({
                  gender: op,
                });
              }}
              rules={[{ required: true, message: "Gender is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="date"
              name="dateofBirth"
              label="Date of Birth"
              placeholder="Date of Birth"
              rules={[{ required: true, message: "Date of Birth is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="date"
              name="joiningDate"
              label="Joining Date"
              placeholder="Joining Date"
              rules={[{ required: true, message: "Joining Date is required" }]}
            />
          </Col>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { employeeType } = form.getFieldsValue();

              const empType = employeeType?.label;

              return (
                <>
                  {empType === "Probationary" ? (
                    <>
                      <Col md={12} sm={24}>
                        <PInput
                          type="text"
                          name="joiningDate"
                          label={`Probation Start Date`}
                          disabled={true}
                        />
                      </Col>
                      <Col md={12} sm={24}>
                        <PInput
                          type="date"
                          name="dteProbationaryCloseDate"
                          label="Probation Close Date"
                          placeholder="Probation Close Date"
                          rules={[
                            {
                              required: true,
                              message: "Probation Close Date is required",
                            },
                          ]}
                        />
                      </Col>
                    </>
                  ) : empType === "Intern" ? (
                    <>
                      <Col md={12} sm={24}>
                        <PInput
                          type="date"
                          name="joiningDate"
                          label={`Intern Start Date`}
                          disabled={true}
                        />
                      </Col>
                      <Col md={12} sm={24}>
                        <PInput
                          type="date"
                          name="dteInternCloseDate"
                          label="Intern Close Date"
                          placeholder="Intern Close Date"
                          rules={[
                            {
                              required: true,
                              message: "Intern Close Date is required",
                            },
                          ]}
                        />
                      </Col>
                    </>
                  ) : [
                      "Contractual",
                      "contractual",
                      "contract",
                      "Contract",
                    ].includes(empType) ? (
                    <>
                      <Col md={12} sm={24}>
                        <PInput
                          type="date"
                          name="contractualFromDate"
                          label={`Contract From Date`}
                          disabled={true}
                        />
                      </Col>
                      <Col md={12} sm={24}>
                        <PInput
                          type="date"
                          name="contractualToDate"
                          label="Contract To Date"
                          placeholder="Contract To Date"
                          rules={[
                            {
                              required: true,
                              message: "Contract To Date is required",
                            },
                          ]}
                        />
                      </Col>
                    </>
                  ) : ["Permanent" || "permanent"].includes(empType) ? (
                    <Col md={12} sm={24}>
                      <PInput
                        type="date"
                        name="dteConfirmationDate"
                        label="Confirmation Date"
                        placeholder="Confirmation Date"
                        rules={[
                          {
                            required: true,
                            message: "Confirmation Date is required",
                          },
                        ]}
                      />
                    </Col>
                  ) : undefined}
                </>
              );
            }}
          </Form.Item>
          <Col md={12} sm={24}>
            <PSelect
              options={empDepartmentDDL?.data || []}
              name="department"
              label="Department"
              placeholder="Department"
              onChange={(value, op) => {
                form.setFieldsValue({
                  department: op,
                });
              }}
              rules={[{ required: true, message: "Department is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={empDesignationDDL.data || []}
              name="designation"
              label="Designation"
              placeholder="Designation"
              onChange={(value, op) => {
                form.setFieldsValue({
                  designation: op,
                });
              }}
              rules={[{ required: true, message: "Designation is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={positionDDL?.data || []}
              name="hrPosition"
              label="HR Position"
              placeholder="HR Position"
              onChange={(value, op) => {
                form.setFieldsValue({
                  hrPosition: op,
                });
              }}
              rules={[{ required: true, message: "HR Position is required" }]}
            />
          </Col>
          {isEdit ? (
            <Col md={12} sm={24}>
              <PSelect
                options={employeeStatusDDL?.data || []}
                name="employeeStatus"
                label="Employee Status"
                placeholder="Employee Status"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    employeeStatus: op,
                  });
                }}
                rules={[
                  { required: true, message: "Employee Status is required" },
                ]}
              />
            </Col>
          ) : undefined}

          <Col md={12} sm={24}>
            <PSelect
              options={supervisorDDL?.data || []}
              name="supervisor"
              label="Supervisor"
              placeholder="Search minimum 2 character"
              onChange={(value, op) => {
                form.setFieldsValue({
                  supervisor: op,
                });
              }}
              showSearch
              filterOption={false}
              // notFoundContent={null}
              loading={supervisorDDL?.loading}
              onSearch={(value) => {
                getSuperVisorDDL(value);
              }}
              rules={[{ required: true, message: "Supervisor is required" }]}
            />
          </Col>
          {/*  Need Searchable */}
          <Col md={12} sm={24}>
            <PSelect
              options={dottedSupervisorDDL?.data || []}
              name="dottedSupervisor"
              label="Dotted Supervisor"
              placeholder="Search minimum 2 character"
              onChange={(value, op) => {
                form.setFieldsValue({
                  dottedSupervisor: op,
                });
              }}
              showSearch
              filterOption={false}
              // notFoundContent={null}
              loading={dottedSupervisorDDL?.loading}
              onSearch={(value) => {
                getDottedSuperVisorDDL(value);
              }}
              rules={[
                { required: true, message: "Dotted Supervisor is required" },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={lineManagerDDL.data || []}
              name="lineManager"
              label="Line Manager"
              placeholder="Search minimum 2 character"
              onChange={(value, op) => {
                form.setFieldsValue({
                  lineManager: op,
                });
              }}
              showSearch
              filterOption={false}
              // notFoundContent={null}
              loading={lineManagerDDL?.loading}
              onSearch={(value) => {
                getLineManagerDDL(value);
              }}
              rules={[{ required: true, message: "Line Manager is required" }]}
            />
          </Col>

          {!isEdit ? (
            <>
              <Col md={12} sm={24}>
                <PInput
                  type="date"
                  name="generateDate"
                  label="Generate Date"
                  placeholder="Generate Date"
                />
              </Col>
              <Col md={12} sm={24}>
                <PSelect
                  options={[
                    {
                      value: 1,
                      label: "Calendar",
                    },
                    { value: 2, label: "Roster" },
                  ]}
                  type="date"
                  name="calenderType"
                  label="Calendar Type"
                  placeholder="Calendar Type"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      calenderType: op,
                    });

                    value === 1 ? getCalendarDDL() : getRosterGroupDDL();
                  }}
                />
              </Col>
              <Form.Item shouldUpdate noStyle>
                {() => {
                  const { calenderType } = form.getFieldsValue();
                  return (
                    <>
                      <Col md={12} sm={24}>
                        <PSelect
                          options={
                            calenderType?.value === 2
                              ? rosterGroupDDL.data || []
                              : calendarDDL?.data || []
                          }
                          name="calender"
                          label={
                            calenderType?.value === 2
                              ? `Roster Name`
                              : `Calendar Name`
                          }
                          placeholder={
                            calenderType?.value === 2
                              ? `Roster Name`
                              : `Calendar Name`
                          }
                          onChange={(value, op) => {
                            form.setFieldsValue({
                              calender: op,
                            });

                            const { calenderType } = form.getFieldsValue();
                            calenderType?.value === 2 &&
                              getCalendarByRosterDDL();
                          }}
                        />
                      </Col>
                      {calenderType?.value === 2 ? (
                        <>
                          <Col md={12} sm={24}>
                            <PSelect
                              options={calendarByRosterGroupDDL?.data || []}
                              name="startingCalender"
                              label="Starting Calendar"
                              placeholder={"Starting Calendar"}
                              onChange={(value, op) => {
                                form.setFieldsValue({
                                  startingCalender: op,
                                });
                              }}
                            />
                          </Col>
                          <Col md={12} sm={24}>
                            <PInput
                              type="date"
                              name="nextChangeDate"
                              label="Next Calendar Change"
                              placeholder={"Next Calendar Change"}
                              onChange={(value, op) => {
                                form.setFieldsValue({
                                  nextChangeDate: op,
                                });
                              }}
                            />
                          </Col>
                        </>
                      ) : undefined}
                    </>
                  );
                }}
              </Form.Item>
            </>
          ) : undefined}

          {/* Hold Salary */}
          <Col md={12} sm={24} style={{ marginTop: "20px" }}>
            <PInput
              label="Salary Hold"
              type="checkbox"
              name="isSalaryHold"
              layout="horizontal"
            />
          </Col>

          {/* User Create */}
          <Form.Item noStyle shouldUpdate>
            {() => {
              const { isUsersection } = form.getFieldsValue();
              return !isEdit ? (
                <>
                  <Col md={12} sm={24} style={{ marginTop: "20px" }}>
                    <PInput
                      label="Create User"
                      type="checkbox"
                      name="isUsersection"
                      layout="horizontal"
                    />
                  </Col>
                  {isUsersection ? (
                    <>
                      <Divider style={{ margin: "3px 0" }} />
                      <Col md={12} sm={24}>
                        <PInput
                          name="loginUserId"
                          type="text"
                          placeholder="User Id"
                          label="User Id"
                          rules={[
                            { required: true, message: "User Id is required" },
                            () => ({
                              validator(_, value) {
                                return new Promise((resolve, reject) => {
                                  const payload = {
                                    strLoginId: value,
                                    intUrlId: intUrlId,
                                    intAccountId: orgId,
                                  };
                                  userValidation(
                                    payload,
                                    setIsUserCheckMsg,
                                    (data) => {
                                      console.log(data)
                                      if (data.message === "Valid") {
                                        resolve();
                                      } else {
                                        reject(
                                          new Error(
                                            data.message || "User is not valid"
                                          )
                                        );
                                      }
                                    }
                                  );
                                });
                              },
                            }),
                          ]}
                        />
                      </Col>
                      <Col md={12} sm={24}>
                        <PInput
                          name="password"
                          type="password"
                          placeholder="Password"
                          label="Password"
                        />
                      </Col>
                      <Col md={12} sm={24}>
                        <PInput
                          name="email"
                          type="email"
                          placeholder="Office Email"
                          label="Office Email"
                        />
                      </Col>
                      <Col md={12} sm={24}>
                        <PInput
                          name="phone"
                          type="text"
                          placeholder="Contact No."
                          label="Contact No."
                        />
                      </Col>
                      <Col md={12} sm={24}>
                        <PSelect
                          options={userTypeDDL.data || []}
                          name="userType"
                          label="User Type"
                          placeholder="User Type"
                          onChange={(value, op) => {
                            form.setFieldsValue({
                              userType: op,
                            });
                          }}
                        />
                      </Col>
                    </>
                  ) : undefined}
                </>
              ) : (
                <Col md={12} sm={24} style={{ marginTop: "20px" }}>
                  <PInput
                    Label="Is Active"
                    name="isActive"
                    type="checkbox"
                    label="Is Active"
                    layout="horizontal"
                  />
                </Col>
              );
            }}
          </Form.Item>
        </Row>
        <ModalFooter
          onCancel={() => {
            setIsAddEditForm(false);
          }}
          submitAction="submit"
          loading={loading}
        />
      </PForm>
    </>
  );
}
