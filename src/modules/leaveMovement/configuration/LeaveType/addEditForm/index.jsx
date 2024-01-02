import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Divider, Form, Row } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { updateUerAndEmpNameAction } from "../../../../commonRedux/auth/actions";
// import { createEditEmpAction, userExistValidation } from "../helper";
// import { submitHandler } from "./helper";

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
  const empSectionDDL = useApiRequest([]);
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
    const { workplaceGroup } = form.getFieldsValue(true);
    supervisorDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmployeeBasicInfoForEmpMgmt",
        AccountId: intAccountId,
        BusinessUnitId: buId,
        intId: employeeId,
        workplaceGroupId: workplaceGroup?.value,
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
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    calendarDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Calender",
        IntWorkplaceId: workplace?.value || wId,
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value || wgId,
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

  // const userValidation = debounce(userExistValidation, 500); // delay time

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

  const getReligion = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    religionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Religion",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.ReligionName;
          res[i].value = item?.ReligionId;
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
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDepartment",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.DepartmentName;
          res[i].value = item?.DepartmentId;
        });
      },
    });
  };

  // section wise ddl
  const getEmployeeSection = () => {
    const { department } = form.getFieldsValue(true);
    empSectionDDL?.action({
      urlKey: "SectionDDL",
      method: "GET",
      params: {
        AccountId: intAccountId,
        BusinessUnitId: buId,
        DepartmentId: department?.value || 0,
        WorkplaceId: wId,
      },
      // onSuccess: (res) => {
      //   console.log("res", res);
      //   res.forEach((item, i) => {
      //     res[i].label = item?.label;
      //     res[i].value = item?.value;
      //   });
      // },
    });
  };

  const getEmployeDesignation = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    empDesignationDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDesignation",
        AccountId: intAccountId,
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.DesignationName;
          res[i].value = item?.DesignationId;
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
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "WorkplaceGroup",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId, // This should be removed
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
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
  }, [orgId, buId, wgId, employeeId]);

  useEffect(() => {
    if (singleData?.empId) {
      form.setFieldsValue(singleData);
      getWorkplace();
      getReligion();
      getEmploymentType();
      getUserTypeDDL();
      getEmployeDepartment();
      getEmployeDesignation();
      getEmployeeStatus();
      getEmployeePosition();
      getEmployeeSection();
    }
  }, [orgId, buId, singleData, employeeId]);

  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          // submitHandler({
          //   values,
          //   getData,
          //   // empBasic,
          //   resetForm: form.resetFields,
          //   pages,
          //   setIsAddEditForm,
          //   employeeId,
          //   dispatch,
          //   // updateUerAndEmpNameAction,
          //   isUserCheckMsg,
          //   createEditEmpAction,
          //   isEdit,
          //   orgId,
          //   buId,
          //   intUrlId,
          //   setLoading,
          // });
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
              name="leaveType"
              label="Leave Type"
              placeholder="Leave Type"
              rules={[{ required: true, message: "Leave Type is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="leaveTypeCode"
              label="Leave Type Code"
              placeholder="Leave Type Code"
              rules={[
                { required: true, message: "Leave Type Code is required" },
              ]}
            />
          </Col>
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
