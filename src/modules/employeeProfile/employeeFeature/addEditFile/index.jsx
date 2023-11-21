import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  getPeopleDeskAllDDL,
  getSearchEmployeeList,
  getSearchEmployeeListForEmp,
} from "../../../../common/api";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import DefaultInput from "../../../../common/DefaultInput";
import FormikSelect from "../../../../common/FormikSelect";
import FormikToggle from "../../../../common/FormikToggle";
import Loading from "../../../../common/loading/Loading";
import { updateUerAndEmpNameAction } from "../../../../commonRedux/auth/actions";
import {
  blackColor40,
  failColor,
  gray900,
  greenColor,
  success800,
} from "../../../../utility/customColor";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../utility/todayDate";
import {
  createEditEmpAction,
  getPeopleDeskWithoutAllDDL,
  userExistValidation,
} from "../helper";
import {
  getCreateDDLs,
  getEditDDLs,
  initData,
  submitHandler,
  validationSchema,
} from "./helper";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import { PForm, PInput, PSelect } from "Components/PForm";
import { ModalFooter } from "Components/Modal";
import { Form, Row, Col, Divider } from "antd";
import { PCard } from "Components";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
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

  const { orgId, buId, employeeId, intUrlId, wgId, intAccountId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  // states

  const [empTypeDDL, setEmpTypeDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  // const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [empStatusDDL, setEmpStatusDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [hrPositionDDL, setHrPositionDDL] = useState([]);
  const [generateEmployeeCode, setGenerateEmployeeCode] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isUserCheckMsg, setIsUserCheckMsg] = useState("");
  const [workplaceGroupName, setWorkplaceGroupName] = useState("");

  // calender assigne
  const [calenderDDL, setCalenderDDL] = useState([]);
  const [calenderRoasterDDL, setCalenderRoasterDDL] = useState([]);
  const [startingCalenderDDL, setStartingCalenderDDL] = useState([]);

  const getDDL = (value) => {
    let ddlType = value === 1 ? "Calender" : "RosterGroup";
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=${ddlType}&BusinessUnitId=${buId}&WorkplaceGroupId=0`,
      value === 1 ? "CalenderId" : "RosterGroupId",
      value === 1 ? "CalenderName" : "RosterGroupName",
      value === 1 ? setCalenderDDL : setCalenderRoasterDDL
    );
  };

  const [empName, setEmpName] = useState("");
  const [empType, setEmpType] = useState("");

  // useEffect(() => {
  //   getPeopleDeskAllDDL(
  //     `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=UserType&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`,
  //     "intUserTypeId",
  //     "strUserType",
  //     setUserTypeDDL
  //   );
  // }, [wgId, buId]);

  // for create
  // useEffect(() => {
  //   getCreateDDLs({
  //     getPeopleDeskAllDDL,
  //     setReligionDDL,
  //     setGenderDDL,
  //     setEmpTypeDDL,
  //     setDepartmentDDL,
  //     getPeopleDeskWithoutAllDDL,
  //     employeeId,
  //     setWorkplaceGroupDDL,
  //     orgId,
  //     wgId,
  //     buId,
  //     setDesignationDDL,
  //     setEmpStatusDDL,
  //     setHrPositionDDL,
  //   });
  // }, [orgId, buId, wgId, employeeId]);

  // for edit
  useEffect(() => {
    if (singleData?.empId) {
      getEditDDLs({
        singleData,
        getPeopleDeskWithoutAllDDL,
        orgId,
        buId,
        employeeId,
        // setWorkplaceDDL,
        // setWingDDL,
        // setSoleDepoDDL,
        // setRegionDDL,
        // setAreaDDL,
        // setTerritoryDDL,
      });
    }
  }, [orgId, buId, singleData, employeeId]);

  useEffect(() => {
    if (workplaceGroupName?.value) {
      getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=AutoEmployeeCode&BusinessUnitId=${buId}&WorkplaceGroupId=${workplaceGroupName?.value}&intId=0`,
        "EmployeeCode",
        "EmployeeCode",
        setGenerateEmployeeCode
      );
    }
  }, [workplaceGroupName?.value, buId]);

  const { values, setFieldValue, handleSubmit, resetForm, errors, touched } =
    useFormik({
      enableReinitialize: true,
      initialValues: isEdit
        ? {
            ...singleData,
            isCreate: false,
          }
        : {
            ...initData,
            fullName: empName || "",
            employeeType: empType || "",
            employeeCode: generateEmployeeCode[0]?.value || "",
            workplaceGroup: workplaceGroupName?.value ? workplaceGroupName : "",
            isCreate: true,
          },

      validationSchema: validationSchema(supervisor),
      onSubmit: () =>
        submitHandler({
          values,
          getData,
          resetForm,
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
        }),
    });

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
          res[i].label = item?.UserTypeName;
          res[i].value = item?.UserTypeId;
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
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
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
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.EmployeeStatusName;
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
        intId: 0,
      },
    });
  };

  useEffect(() => {
    commonConfigurationDDL();
    getUserTypeDDL();
  }, [orgId, buId, wgId, employeeId]);

  return (
    <>
      <PForm form={form}>
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
              type="text"
              name="employeeCode"
              label="Employee Code"
              placeholder="Employee Code"
              rules={[{ required: true, message: "Employee Code is required" }]}
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
                          type="date"
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
          <Col md={12} sm={24}>
            <PInput label="Salary Hold" type="checkbox" name="isSalaryHold" />
          </Col>

          {/* User Create */}
          <Form.Item noStyle shouldUpdate>
            {() => {
              const { isUsersection } = form.getFieldsValue();
              return !isEdit ? (
                <>
                  <Col md={12} sm={24}>
                    <PInput
                      label="Create User"
                      type="checkbox"
                      name="isUsersection"
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
                          onChange={(e) => {
                            const payload = {
                              strLoginId: e.target.value,
                              intUrlId: intUrlId,
                              intAccountId: orgId,
                            };
                            debounce(() => {
                              userExistValidation(payload, setIsUserCheckMsg);
                            }, 500);
                          }}
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
                <Col md={12} sm={24}>
                  <PInput Label="Is Active" name="isActive" type="checkbox" />
                </Col>
              );
            }}
          </Form.Item>
        </Row>
      </PForm>
      <ModalFooter
        onCancel={() => {
          setIsAddEditForm(false);
        }}
      />
    </>
  );
}
