import {
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { calculateNextDate } from "utility/dateFormatter";
import { todayDate } from "utility/todayDate";
import {
  getEmployeeProfileViewData,
  userExistValidation,
  createEditEmpAction,
} from "../helper";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
import Loading from "common/loading/Loading";
import {
  calculateProbationCloseDateByDateOrMonth,
  submitHandler,
} from "../addEditFile/helper";
import { probationCloseDateCustomDDL } from "utility/yearDDL";
import { updateUerAndEmpNameAction } from "../../../../commonRedux/auth/actions";

const CreateAndEditEmploye = () => {
  // router hooks
  const dispatch = useDispatch();
  const history = useHistory();
  const { empId } = useParams();

  // data from redux
  const {
    orgId,
    buId,
    employeeId,
    intUrlId,
    wgId,
    wId,
    intAccountId,
    isOfficeAdmin,
  } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  const [loading, setLoading] = useState(false);

  // states

  const [isUserCheckMsg, setIsUserCheckMsg] = useState("");
  const [singleData, setSingleData] = useState({});
  const [empSignature, setEmpAuthSignature] = useState([]);

  // Pages Start From Here code from above will be removed soon

  // Form Instance
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // menu permission checking
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let employeeFeature = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 8) {
      employeeFeature = item;
    }
  });

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
  const empSectionDDL = useApiRequest([]);
  const workplaceGroup = useApiRequest([]);
  const workplaceDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  const employeeStatusDDL = useApiRequest([]);
  const payScaleGradeDDL = useApiRequest([]);
  const positionDDL = useApiRequest([]);
  const userTypeDDL = useApiRequest([]);
  const bloodGroupDDL = useApiRequest([]);
  const holidayDDL = useApiRequest([]);

  const getEmpData = () => {
    getEmployeeProfileViewData(
      empId,
      "",
      setLoading,
      buId,
      wgId,
      setSingleData
    );
  };

  useEffect(() => {
    empId && getEmpData();
  }, []);

  // get ddls for reporters

  const getSuperVisorDDL = debounce((value) => {
    if (value?.length < 2) return supervisorDDL?.reset();
    const { workplaceGroup, workplace } = form.getFieldsValue(true);
    supervisorDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmployeeBasicInfoForEmpMgmt",
        AccountId: intAccountId,
        BusinessUnitId: buId,
        intId: employeeId,
        workplaceGroupId: workplaceGroup?.value,
        strWorkplaceIdList: workplace?.value.toString(),
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
        strWorkplaceIdList: wId.toString(),
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
        strWorkplaceIdList: wId.toString(),
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
        res.forEach((item, i) => {
          res[i].label = item?.strSectionName;
          res[i].value = item?.intSectionId;
        });
      },
    });
  };

  const getHolidayGroupDDL = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    holidayDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "HolidayGroup",
        IntWorkplaceId: workplace?.value || wId,
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value || wgId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.HolidayGroupName;
          res[i].value = item?.HolidayGroupId;
        });
      },
    });
  };
  const getCalendarDDL = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    calendarDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Calender",
        IntWorkplaceId: workplace?.value,
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
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
    const { workplaceGroup, workplace } = form.getFieldsValue(true);
    rosterGroupDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "RosterGroup",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: workplace?.value,
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

  const userValidation = debounce(userExistValidation, 500); // delay time

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

  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplaceDDL?.action({
      urlKey: "WorkplaceIdAll",
      method: "GET",
      params: {
        // DDLType: "Workplace",
        // BusinessUnitId: buId,
        // WorkplaceGroupId: workplaceGroup?.value,
        // intId: employeeId,
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

  const getEmploymentType = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);
    employmentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.EmploymentType;
          res[i].value = item?.Id;
        });
      },
    });
  };

  const getUserTypeDDL = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    userTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "UserType",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
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

  // workplace wise
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
      },
    });
  };

  const getEmployeDesignation = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    empDesignationDDL?.action({
      urlKey: "DesignationIdAll",
      method: "GET",
      params: {
        accountId: intAccountId,
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value,
        workplaceId: workplace?.value,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.designationName;
          res[i].value = item?.designationId;
        });
      },
    });
  };
  const getEmployeeStatus = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    employeeStatusDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmployeeStatus",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.EmployeeStatus;
          res[i].value = item?.EmployeeStatusId;
        });
      },
    });
  };

  // const getPayScaleGradeDDL = () => {
  //   const { workplaceGroup, workplace } = form.getFieldsValue(true);
  // };
  const getEmployeePosition = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    positionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Position",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: workplace?.value,
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

  const commonConfigurationDDL = () => {
    workplaceGroup?.action({
      urlKey: "WorkplaceGroupIdAll",
      method: "GET",
      params: {
        // DDLType: "WorkplaceGroup",
        // BusinessUnitId: buId,
        // WorkplaceGroupId: wgId, // This should be removed
        // intId: employeeId,
        accountId: orgId,
        businessUnitId: buId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
    payScaleGradeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "PayscaleGrade",
        BusinessUnitId: buId,
        AccountId: intAccountId,
        WorkplaceGroupId: wgId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.PayscaleGradeName;
          res[i].value = item?.PayscaleGradeId;
        });
      },
    });

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

    bloodGroupDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "BloodGroupName",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strBloodGroup;
          res[i].value = item?.intBloodGroupId;
        });
      },
    });
  };

  useEffect(() => {
    commonConfigurationDDL();
  }, [orgId, buId, wgId, employeeId]);

  useEffect(() => {
    if (singleData?.empId) {
      form.setFieldsValue(singleData);
      getWorkplace();
      getEmploymentType();
      getUserTypeDDL();
      getEmployeDepartment();
      getEmployeDesignation();
      // getPayScaleGradeDDL();
      getEmployeeStatus();
      getEmployeePosition();
      getEmployeeSection();
      // new requirment
      singleData.calenderType?.value === 1
        ? getCalendarDDL()
        : getRosterGroupDDL();
      singleData.calenderType?.value === 2 && getCalendarByRosterDDL();
    }
  }, [orgId, buId, singleData, employeeId]);

  const disabledDate = (current) => {
    const startOfPreviousMonth = moment().subtract(1, "month").startOf("month");
    return current && current < startOfPreviousMonth;
  };

  return (
    <div style={{ marginBottom: "60px" }}>
      {loading && <Loading />}
      <PForm
        formName="empCreate"
        form={form}
        initialValues={{
          generateDate: moment(todayDate()),
          dteLastInactiveDate: moment(todayDate()),
          salaryType: { value: 2, label: "Hourly" },
          otType: {
            value: 1,
            label: "Not Applicable",
          },
          strOTbasedon: {
            value: "Calendar",
            label: "Calendar",
          },
        }}
      >
        <PCard>
          <PCardHeader
            title={empId ? "Edit Employee" : "Create Employee"}
            backButton={true}
            buttonList={[
              {
                type: "cancel",
                content: "Cancel",
                onClick: () => {
                  if (employeeFeature?.isCreate) {
                    history.push("/profile/employee");
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
              {
                type: "primary",
                content: "Save",
                icon: "plus",
                disabled: loading,
                onClick: () => {
                  const payload = {
                    strLoginId:
                      form.getFieldValue("loginUserId") ||
                      form.getFieldValue("employeeCode"),
                    intUrlId: intUrlId,
                    intAccountId: orgId,
                  };
                  if (employeeFeature?.isCreate) {
                    const values = form.getFieldsValue(true);
                    form
                      .validateFields()
                      .then(() => {
                        userValidation(payload, setIsUserCheckMsg, (data) => {
                          if (
                            data.message === "Valid" ||
                            (!values?.isUsersection && empId)
                          ) {
                            submitHandler({
                              values,
                              // empBasic,
                              resetForm: form.resetFields,
                              employeeId,
                              dispatch,
                              updateUerAndEmpNameAction,
                              isUserCheckMsg,
                              createEditEmpAction,
                              isEdit: empId ? true : false,
                              orgId,
                              buId,
                              intUrlId,
                              action: "save",
                              history,
                              setLoading,
                              intSignature:
                                empSignature?.[0]?.response?.[0]
                                  ?.globalFileUrlId || 0,
                            });
                          } else {
                            return toast.error("User Id already exists");
                          }
                        });
                      })
                      .catch(() => {
                        console.log();
                      });
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
              !empId && {
                type: "primary",
                content: "Save & Create New",
                icon: "plus",
                disabled: loading,

                onClick: async () => {
                  const payload = {
                    strLoginId:
                      form.getFieldValue("loginUserId") ||
                      form.getFieldValue("employeeCode"),
                    intUrlId: intUrlId,
                    intAccountId: orgId,
                  };
                  if (employeeFeature?.isCreate) {
                    const values = form.getFieldsValue(true);
                    form
                      .validateFields()
                      .then(() => {
                        userValidation(payload, setIsUserCheckMsg, (data) => {
                          if (
                            data.message === "Valid" ||
                            (!values?.isUsersection && empId)
                          ) {
                            submitHandler({
                              values,
                              // empBasic,
                              resetForm: () => {
                                form.setFieldValue("employeeCode", "");
                                form.setFieldValue("fullName", "");
                                form.setFieldValue("fullNameInBn", "");
                                form.setFieldValue("religion", "");
                                form.setFieldValue("gender", "");
                                form.setFieldValue("dteDateOfBirth", "");
                                form.setFieldValue("loginUserId", "");
                                form.setFieldValue("email", "");
                                form.setFieldValue("phone", "");
                                form.setFieldValue("userType", "");
                                form.setFieldValue("intSignature", "");
                                setEmpAuthSignature([]);
                              },
                              employeeId,
                              dispatch,
                              updateUerAndEmpNameAction,
                              isUserCheckMsg,
                              createEditEmpAction,
                              isEdit: empId ? true : false,
                              orgId,
                              buId,
                              intUrlId,
                              action: "save and new",
                              history,
                              setLoading,
                              intSignature:
                                empSignature?.[0]?.response?.[0]
                                  ?.globalFileUrlId || 0,
                            });
                          } else {
                            return toast.error("User Id already exists");
                          }
                        });
                      })
                      .catch(() => {
                        console.log();
                      });
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
            ]}
          />

          <div>
            <PCardBody>
              <Row gutter={[10, 2]}>
                <Col md={6} sm={24}>
                  <PInput
                    type="text"
                    name="employeeCode"
                    label="Employee ID"
                    placeholder="Employee ID"
                    rules={[
                      { required: true, message: "Employee ID is required" },
                    ]}
                    // disabled={params?.id}
                    disabled={
                      empId && (!employeeFeature?.isEdit || !isOfficeAdmin)
                    }
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PInput
                    type="text"
                    name="fullName"
                    label="Full Name"
                    placeholder="Full Name"
                    rules={[
                      { required: true, message: "Full Name is required" },
                    ]}
                    // disabled={params?.id}
                    disabled={
                      empId && (!employeeFeature?.isEdit || !isOfficeAdmin)
                    }
                  />
                </Col>
                {orgId === 7 && (
                  <Col md={6} sm={24}>
                    <PInput
                      type="text"
                      name="fullNameInBn"
                      label="Full Name (বাংলা)"
                      placeholder="Full Name (বাংলা)"
                      // disabled={params?.id}
                      disabled={
                        empId && (!employeeFeature?.isEdit || !isOfficeAdmin)
                      }
                      rules={[
                        {
                          message: "This Field Must be in Bangla",
                          pattern: new RegExp(/^[\u0980-\u09FF\s]*$/),
                        },
                      ]}
                    />
                  </Col>
                )}

                <Col md={6} sm={24}>
                  <PInput
                    type="text"
                    name="strReferenceId"
                    label="Reference ID"
                    placeholder="Reference ID"
                    // disabled={
                    //   empId && (!employeeFeature?.isEdit || !isOfficeAdmin)
                    // }
                  />
                </Col>

                <Col md={6} sm={24}>
                  <PSelect
                    options={workplaceGroup.data || []}
                    name="workplaceGroup"
                    label="Workplace Group"
                    placeholder="Workplace Group"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        workplaceGroup: op,
                        workplace: undefined,
                        calender: undefined,
                        employeeType: undefined,
                        department: undefined,
                        section: undefined,
                        designation: undefined,
                        hrPosition: undefined,
                      });
                      if (value) {
                        getWorkplace();
                        getCalendarDDL();
                        getRosterGroupDDL();
                        // getUserTypeDDL();
                        getUserTypeDDL();
                        getHolidayGroupDDL();
                      }
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Workplace Group is required",
                      },
                    ]}
                    // disabled={params?.id}
                    disabled={
                      empId && (!employeeFeature?.isEdit || !isOfficeAdmin)
                    }
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PSelect
                    options={workplaceDDL?.data || []}
                    name="workplace"
                    label="Workplace/Concern"
                    placeholder="Workplace/Concern"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        workplace: op,
                        department: undefined,
                        calender: undefined,
                        section: undefined,
                        designation: undefined,
                        hrPosition: undefined,
                        employeeType: undefined,
                      });
                      if (value) {
                        getEmployeDepartment();
                        getEmployeDesignation();
                        getRosterGroupDDL();
                        -getEmployeeStatus();
                        getEmployeePosition();
                        getEmploymentType();
                        getCalendarDDL();
                        getEmployeeSection();
                        getHolidayGroupDDL();
                      }
                    }}
                    rules={[
                      { required: true, message: "Workplace is required" },
                    ]}
                    // disabled={params?.id}
                    disabled={
                      empId && (!employeeFeature?.isEdit || !isOfficeAdmin)
                    }
                  />
                </Col>
                <Col md={6} sm={24}>
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
                      {
                        required: true,
                        message: "Employment Type is required",
                      },
                    ]}
                    // disabled={params?.id}
                    disabled={
                      empId && (!employeeFeature?.isEdit || !isOfficeAdmin)
                    }
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PInput
                    type="date"
                    name="joiningDate"
                    label="Joining Date"
                    placeholder="Joining Date"
                    rules={[
                      { required: true, message: "Joining Date is required" },
                    ]}
                    onChange={(value) => {
                      const next180Days = calculateNextDate(
                        moment(value).format("YYYY-MM-DD"),
                        180
                      );
                      form.setFieldsValue({
                        joiningDate: value,
                        dteProbationaryCloseDate: moment(next180Days),
                        generateDate: value,
                      });
                    }}
                    // disabled={params?.id}
                  />
                </Col>
                <Form.Item shouldUpdate noStyle>
                  {() => {
                    const { employeeType, joiningDate } = form.getFieldsValue();

                    const empType = employeeType?.label;

                    return (
                      <>
                        {empType === "Probationary" ? (
                          <>
                            <Col md={6} sm={24}>
                              <PInput
                                type="date"
                                name="joiningDate"
                                label={`Probation Start Date`}
                                disabled={true}
                              />
                            </Col>
                            <Col md={6} sm={24}>
                              <PSelect
                                options={probationCloseDateCustomDDL || []}
                                name="probationayClosedBy"
                                label="Probation Period"
                                placeholder="Probation Period"
                                allowClear
                                onChange={(value, op) => {
                                  const nextDate =
                                    calculateProbationCloseDateByDateOrMonth({
                                      inputDate: moment(
                                        joiningDate,
                                        "YYYY-MM-DD"
                                      ).format("YYYY-MM-DD"), // Use moment to parse the joiningDate
                                      days:
                                        op?.count?.length > 3
                                          ? null
                                          : parseInt(op?.count),
                                      month:
                                        op?.count?.length > 3
                                          ? parseInt(op?.count?.split(" ")[0])
                                          : null,
                                    });
                                  form.setFieldsValue({
                                    probationayClosedBy: op,
                                    dteProbationaryCloseDate: moment(nextDate),
                                  });
                                }}
                                disabled={joiningDate ? false : true}
                              />
                            </Col>
                            <Col md={6} sm={24}>
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
                            <Col md={6} sm={24}>
                              <PInput
                                type="date"
                                name="joiningDate"
                                label={`Intern Start Date`}
                                disabled={true}
                              />
                            </Col>
                            <Col md={6} sm={24}>
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
                            <Col md={6} sm={24}>
                              <PInput
                                type="date"
                                name="contractualFromDate"
                                label={`Contract From Date`}
                                // disabled={true}
                              />
                            </Col>
                            <Col md={6} sm={24}>
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
                          <Col md={6} sm={24}>
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
                <Col md={6} sm={24}>
                  <PSelect
                    options={empDepartmentDDL?.data || []}
                    name="department"
                    showSearch
                    filterOption={true}
                    label="Department"
                    allowClear
                    placeholder="Department"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        department: op,
                      });
                      value && getEmployeeSection();
                    }}
                    rules={[
                      { required: true, message: "Department is required" },
                    ]}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PSelect
                    options={empSectionDDL.data || []}
                    name="section"
                    showSearch
                    allowClear
                    filterOption={true}
                    label="Section"
                    placeholder="Section"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        section: op,
                      });
                    }}
                    // rules={[{ required: true, message: "Section is required" }]}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PSelect
                    options={empDesignationDDL.data || []}
                    showSearch
                    filterOption={true}
                    name="designation"
                    label="Designation"
                    placeholder="Designation"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        designation: op,
                      });
                    }}
                    rules={[
                      { required: true, message: "Designation is required" },
                    ]}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PSelect
                    options={positionDDL?.data || []}
                    name="hrPosition"
                    showSearch
                    filterOption={true}
                    label="HR Position"
                    placeholder="HR Position"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        hrPosition: op,
                      });
                    }}
                    rules={[
                      { required: true, message: "HR Position is required" },
                    ]}
                  />
                </Col>
                {empId && (employeeFeature?.isEdit || isOfficeAdmin) ? (
                  <Col md={6} sm={24}>
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
                        {
                          required: true,
                          message: "Employee Status is required",
                        },
                      ]}
                    />
                  </Col>
                ) : undefined}
                <Form.Item shouldUpdate noStyle>
                  {() => {
                    const { employeeStatus } = form.getFieldsValue(true);
                    if (employeeStatus?.value === 2) {
                      return (
                        <Col md={6} sm={24}>
                          <PInput
                            type="date"
                            name="dteLastInactiveDate"
                            label="Inactive Date"
                            placeholder="Inactive Date"
                            onChange={(value) => {
                              form.setFieldsValue({
                                dteLastInactiveDate: value,
                              });
                            }}
                            disabledDate={(current) =>
                              moment(current) > moment()
                            }
                            // disabled={params?.id}
                            rules={[
                              {
                                required: employeeStatus?.value === 2 && true,
                                message: "Inactive date is required",
                              },
                            ]}
                          />
                        </Col>
                      );
                    } else return null;
                  }}
                </Form.Item>

                <Form.Item shouldUpdate noStyle>
                  {() => {
                    const { workplaceGroup } = form.getFieldsValue(true);
                    return (
                      <>
                        <Col md={6} sm={24}>
                          <PSelect
                            options={supervisorDDL?.data || []}
                            name="supervisor"
                            label="Supervisor"
                            placeholder={`${
                              workplaceGroup?.value
                                ? "Search minimum 2 character"
                                : "Select Workplace Group first"
                            }`}
                            disabled={!workplaceGroup?.value}
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
                            rules={[
                              {
                                required: true,
                                message: "Supervisor is required",
                              },
                            ]}
                          />
                        </Col>
                        <Col md={6} sm={24}>
                          <PSelect
                            options={dottedSupervisorDDL?.data || []}
                            name="dottedSupervisor"
                            label="Dotted Supervisor"
                            allowClear
                            placeholder={`${
                              workplaceGroup?.value
                                ? "Search minimum 2 character"
                                : "Select Workplace Group first"
                            }`}
                            disabled={!workplaceGroup?.value}
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
                          />
                        </Col>
                        <Col md={6} sm={24}>
                          <PSelect
                            options={lineManagerDDL.data || []}
                            name="lineManager"
                            label="Line Manager"
                            placeholder={`${
                              workplaceGroup?.value
                                ? "Search minimum 2 character"
                                : "Select Workplace Group first"
                            }`}
                            disabled={!workplaceGroup?.value}
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
                            rules={[
                              {
                                required: true,
                                message: "Line Manager is required",
                              },
                            ]}
                          />
                        </Col>
                      </>
                    );
                  }}
                </Form.Item>
                <Col md={6} sm={24}>
                  <PSelect
                    options={[
                      { value: 1, label: "Daily" },
                      { value: 2, label: "Hourly" },
                    ]}
                    name="salaryType"
                    showSearch
                    filterOption={true}
                    label="Salary Type"
                    allowClear
                    placeholder="Salary Type"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        salaryType: op,
                      });
                    }}
                    // rules={[{ required: true, message: "HR Position is required" }]}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PSelect
                    options={[
                      {
                        value: 1,
                        label: "Not Applicable",
                      },
                      { value: 2, label: "With Salary" },
                      {
                        value: 3,
                        label: "Without Salary/Additional OT",
                      },
                    ]}
                    name="otType"
                    label="Overtime Type"
                    placeholder={"Overtime Type"}
                    allowClear
                    // disabled={!calenderType}
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        otType: op,
                      });
                    }}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PSelect
                    options={[
                      {
                        value: "Calendar",
                        label: "Calendar",
                      },
                      { value: "Fixed Hour", label: "Fixed Hour" },
                    ]}
                    name="strOTbasedon"
                    label="Overtime Based On"
                    placeholder={"Overtime Based On"}
                    allowClear
                    // disabled={!calenderType}
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        strOTbasedon: op,
                        intOTFixedHour: null,
                      });
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Overtime Based On is required",
                      },
                    ]}
                  />
                </Col>
                <Form.Item shouldUpdate noStyle>
                  {() => {
                    const { strOTbasedon } = form.getFieldsValue(true);
                    return (
                      strOTbasedon?.value === "Fixed Hour" && (
                        <Col md={6} sm={24}>
                          <PInput
                            type="number"
                            name="intOTFixedHour"
                            label="OT Fixed Hour"
                            placeholder="OT Fixed Hour"
                            onChange={(value) => {
                              if (value > 24) {
                                form.setFieldsValue({
                                  intOTFixedHour: "",
                                });
                                toast.warn(
                                  "OT Fixed Hour can't be more than 24 hours"
                                );
                                return;
                              }
                              if (value < 0) {
                                form.setFieldsValue({
                                  intOTFixedHour: "",
                                });
                                toast.warn("OT Fixed Hour can't be negative");
                                return;
                              }
                              form.setFieldsValue({
                                intOTFixedHour: value,
                              });
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Inactive date is required",
                              },
                            ]}
                          />
                        </Col>
                      )
                    );
                  }}
                </Form.Item>
                <Col md={6} sm={24}>
                  <PSelect
                    options={payScaleGradeDDL?.data || []}
                    name="payScaleGrade"
                    showSearch
                    filterOption={true}
                    label="Pay Scale Grade"
                    placeholder="Pay Scale Grade"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        payScaleGrade: op,
                      });
                    }}
                    // rules={[{ required: true, message: "HR Position is required" }]}
                  />
                </Col>

                {!empId && (
                  <Col className="mt-2" md={6} sm={24}>
                    <div className="mt-3">
                      <FileUploadComponents
                        propsObj={{
                          title: "Employee Signature",
                          attachmentList: empSignature,
                          setAttachmentList: setEmpAuthSignature,
                          accountId: orgId,
                          tableReferrence: "LeaveAndMovement",
                          documentTypeId: 15,
                          userId: employeeId,
                          buId,
                          maxCount: 1,
                          accept: "image/png, image/jpeg, image/jpg",
                        }}
                      />
                    </div>
                  </Col>
                )}
              </Row>
            </PCardBody>
          </div>
          <div>
            <h3 style={{ fontSize: "13px" }} className="my-2">
              Voluntary Disclosures
            </h3>
            <PCardBody>
              <Row gutter={[10, 2]}>
                <Col md={6} sm={24}>
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
                    rules={[
                      { required: true, message: "Religion is required" },
                    ]}
                    disabled={
                      empId && (!employeeFeature?.isEdit || !isOfficeAdmin)
                    }
                  />
                </Col>
                <Col md={6} sm={24}>
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
                    disabled={empId && !isOfficeAdmin}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PInput
                    type="date"
                    name="dateofBirth"
                    label="Date of Birth"
                    placeholder="Date of Birth"
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PSelect
                    options={bloodGroupDDL.data || []}
                    name="bloodGroup"
                    label="Blood Group"
                    placeholder="Blood Group"
                    allowClear
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        bloodGroup: op,
                      });
                    }}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PInput
                    name="officeEmail"
                    type="email"
                    placeholder={
                      intAccountId === 1
                        ? "Personal/Office Email"
                        : "Office Email"
                    }
                    label={
                      intAccountId === 1
                        ? "Personal/Office Email"
                        : "Office Email"
                    }
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PInput
                    name="officePhone"
                    type="text"
                    placeholder={
                      intAccountId === 1
                        ? "Personal/Office Contact No."
                        : "Office Contact No."
                    }
                    label={
                      intAccountId === 1
                        ? "Personal/Office Contact No."
                        : "Office Contact No."
                    }
                  />
                </Col>
                <Col md={6} sm={24} className="d-none">
                  <PInput
                    name="personalEmail"
                    type="email"
                    placeholder="Personal Email"
                    label="Personal Email"
                  />
                </Col>
                <Col md={6} sm={24} className="d-none">
                  <PInput
                    name="personalMobile"
                    type="text"
                    placeholder="Personal Contact No."
                    label="Personal Contact No."
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PInput
                    name="nid"
                    type="text"
                    placeholder="NID"
                    label="NID"
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PInput
                    name="tinNo"
                    type="text"
                    placeholder="TIN No."
                    label="TIN No."
                  />
                </Col>
                <Col md={12} sm={24}>
                  <PInput
                    type="text"
                    name="permanentAddress"
                    label="Permanent Address"
                    placeholder="Permanent Address"
                  />
                </Col>{" "}
                <Col md={12} sm={24}>
                  <PInput
                    type="text"
                    name="presentAddress"
                    label="Present Address"
                    placeholder="Present Address"
                  />
                </Col>
                {orgId === 7 && (
                  <>
                    <Col md={12} sm={24}>
                      <PInput
                        type="text"
                        name="permanentAddressBn"
                        label="Permanent Address (বাংলা)"
                        placeholder="Permanent Address (বাংলা)"
                        rules={[
                          {
                            message: "This Field Must be in Bangla",
                            pattern: new RegExp(/^[\u0980-\u09FF\s]*$/),
                          },
                        ]}
                      />
                    </Col>{" "}
                    <Col md={12} sm={24}>
                      <PInput
                        type="text"
                        name="presentAddressBn"
                        label="Present Address (বাংলা)"
                        placeholder="Present Address (বাংলা)"
                        rules={[
                          {
                            message: "This Field Must be in Bangla",
                            pattern: new RegExp(/^[\u0980-\u09FF\s]*$/),
                          },
                        ]}
                      />
                    </Col>
                  </>
                )}
              </Row>
            </PCardBody>
          </div>

          {!empId && (
            <>
              {" "}
              <div>
                <h3 style={{ fontSize: "13px" }} className="my-2">
                  Employment Shift Info
                </h3>
                <PCardBody>
                  <Row gutter={[10, 2]}>
                    {/*  - // new requirment calender field will be editable @8-01-2024 🔥🔥 - */}
                    {!empId ? (
                      <>
                        <Form.Item shouldUpdate noStyle>
                          {() => {
                            const { workplaceGroup, calenderType, workplace } =
                              form.getFieldsValue(true);
                            return (
                              <>
                                <Col md={8} sm={24}>
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
                                    disabled={!workplaceGroup}
                                    onChange={(value, op) => {
                                      form.setFieldsValue({
                                        calender: null,
                                        // otType: null,
                                        calenderType: op,
                                      });

                                      value === 1
                                        ? getCalendarDDL()
                                        : getRosterGroupDDL();
                                    }}
                                  />
                                </Col>
                                <Col md={8} sm={24}>
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
                                    disabled={!workplace}
                                    onChange={(value, op) => {
                                      form.setFieldsValue({
                                        calender: op,
                                      });

                                      const { calenderType } =
                                        form.getFieldsValue();
                                      calenderType?.value === 2 &&
                                        getCalendarByRosterDDL();
                                    }}
                                  />
                                </Col>

                                {calenderType?.value === 2 ? (
                                  <>
                                    <Col md={8} sm={24}>
                                      <PSelect
                                        options={
                                          calendarByRosterGroupDDL?.data || []
                                        }
                                        name="startingCalender"
                                        label="Starting Calendar"
                                        placeholder={"Starting Calendar"}
                                        disabled={!workplace}
                                        onChange={(value, op) => {
                                          form.setFieldsValue({
                                            startingCalender: op,
                                          });
                                        }}
                                      />
                                    </Col>
                                    <Col md={8} sm={24}>
                                      <PInput
                                        type="date"
                                        name="nextChangeDate"
                                        label="Next Calendar Change"
                                        placeholder={"Next Calendar Change"}
                                      />
                                    </Col>
                                  </>
                                ) : undefined}
                              </>
                            );
                          }}
                        </Form.Item>
                        <Col md={8} sm={24}>
                          <PInput
                            type="date"
                            name="generateDate"
                            label="Calender Generate Date"
                            placeholder="Generate Date"
                            disabledDate={disabledDate}
                            // disabled={params?.id}
                          />
                        </Col>
                        <Col md={8} sm={24}>
                          <PSelect
                            mode="multiple"
                            options={[
                              {
                                value: 1,
                                label: "Friday",
                              },
                              { value: 2, label: "Saturday" },
                              { value: 3, label: "Sunday" },
                              { value: 4, label: "Monday" },
                              { value: 5, label: "Tuseday" },
                              { value: 6, label: "Wednesday" },
                              { value: 7, label: "Thursday" },
                            ]}
                            name="offday"
                            label="Off Day"
                            placeholder=" Off Day"
                            onChange={(value, op) => {
                              form.setFieldsValue({
                                offday: op,
                              });

                              // value && getWorkplace();
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Off Day is required",
                              },
                            ]}
                          />
                        </Col>
                        <Col md={8} sm={24}>
                          <PSelect
                            options={holidayDDL?.data || []}
                            name="holiday"
                            label="Holiday"
                            placeholder="Holiday"
                            disabled={!workplaceGroup}
                            onChange={(value, op) => {
                              form.setFieldsValue({
                                holiday: op,
                              });
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Holiday is required",
                              },
                            ]}
                          />
                        </Col>
                      </>
                    ) : undefined}

                    {/* Hold Salary */}
                    {/* {params?.id ? (
        <Col md={8} sm={24} style={{ marginTop: "20px" }}>
          <PInput
            label="Salary Hold"
            type="checkbox"
            name="isSalaryHold"
            layout="horizontal"
          />
        </Col>
      ) : null} */}
                  </Row>
                </PCardBody>
              </div>
              <div>
                <h2 style={{ fontSize: "13px" }} className="my-2">
                  ESS(Employee Self Service) Portal
                </h2>
                <PCardBody>
                  <Row gutter={[10, 2]}>
                    {/* User Create */}
                    <Form.Item noStyle shouldUpdate>
                      {() => {
                        const { isUsersection, employeeCode } =
                          form.getFieldsValue();
                        return !empId ? (
                          <>
                            <Col md={8} sm={24}>
                              <PInput
                                label="Do you want to create user?"
                                type="checkbox"
                                name="isUsersection"
                                layout="horizontal"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    form.setFieldsValue({
                                      loginUserId: employeeCode,
                                      password: "123456",
                                      userType: {
                                        value: userTypeDDL?.data
                                          ? userTypeDDL?.data?.[0]?.value
                                          : 1,
                                        label: userTypeDDL?.data
                                          ? userTypeDDL?.data?.[0]?.label
                                          : "test",
                                      },
                                    });
                                  }
                                }}
                              />
                            </Col>
                            {isUsersection ? (
                              <>
                                <Divider style={{ margin: "3px 0" }} />
                                <Col md={8} sm={24}>
                                  <PInput
                                    name="loginUserId"
                                    type="text"
                                    placeholder="User Id"
                                    label="User Id"
                                    rules={[
                                      {
                                        required: true,
                                        message: "User Id is required",
                                      },
                                      // () => ({
                                      //   validator(_, value) {
                                      //     return new Promise(
                                      //       (resolve, reject) => {
                                      //         const payload = {
                                      //           strLoginId: value,
                                      //           intUrlId: intUrlId,
                                      //           intAccountId: orgId,
                                      //         };
                                      //         userValidation(
                                      //           payload,
                                      //           setIsUserCheckMsg,
                                      //           (data) => {
                                      //             if (
                                      //               data.message === "Valid"
                                      //             ) {
                                      //               setIsUserCheckMsg(
                                      //                 (prev) => {
                                      //                   return {
                                      //                     ...prev,
                                      //                     ...data,
                                      //                   };
                                      //                 }
                                      //               );
                                      //               resolve();
                                      //             } else {
                                      //               reject(
                                      //                 new Error(
                                      //                   data.message ||
                                      //                     "User is not valid"
                                      //                 )
                                      //               );
                                      //             }
                                      //           }
                                      //         );
                                      //       }
                                      //     );
                                      //   },
                                      // }),
                                    ]}
                                  />
                                </Col>
                                <Col md={8} sm={24}>
                                  <PInput
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    label="Password"
                                  />
                                </Col>
                                <Col md={8} sm={24}>
                                  <PInput
                                    name="email"
                                    type="email"
                                    placeholder="Office Email"
                                    label="Office Email"
                                  />
                                </Col>
                                <Col md={8} sm={24}>
                                  <PInput
                                    name="phone"
                                    type="text"
                                    placeholder="Contact No."
                                    label="Contact No."
                                  />
                                </Col>
                                <Col md={8} sm={24}>
                                  <PSelect
                                    options={userTypeDDL.data || []}
                                    name="userType"
                                    // value="userType"
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
                          <Col md={8} sm={24} style={{ marginTop: "20px" }}>
                            {/* <PInput
                Label="Is Active"
                name="isActive"
                type="checkbox"
                label="Is Active"
                layout="horizontal"
              /> */}
                          </Col>
                        );
                      }}
                    </Form.Item>
                  </Row>
                </PCardBody>
              </div>
            </>
          )}
        </PCard>
      </PForm>
    </div>
  );
};

export default CreateAndEditEmploye;
