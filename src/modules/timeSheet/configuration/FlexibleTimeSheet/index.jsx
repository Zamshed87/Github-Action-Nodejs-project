import { Form } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { PCardHeader, PForm, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import moment from "moment";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

const FlexibleTimeSheet = () => {
  const dispatch = useDispatch();

  const { isSuperuser, isOfficeAdmin, buId, wgId, wId, employeeId, orgId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Flexible Timesheet";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // Form Instance
  const [form] = Form.useForm();

  // api states
  const empDepartmentDDL = useApiRequest([]);
  const supervisorDDL = useApiRequest([]);

  const getEmployeDepartment = () => {
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
  };

  const getSuperVisorDDL = debounce((value) => {
    if (value?.length < 2) return supervisorDDL?.reset();
    supervisorDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmployeeBasicInfoForEmpMgmt",
        AccountId: orgId,
        BusinessUnitId: buId,
        intId: employeeId,
        workplaceGroupId: wgId,
        strWorkplaceIdList: wId,
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

  useEffect(() => {
    isOfficeAdmin && getEmployeDepartment();
  }, []);

  return (
    <PForm
      initialValues={{
        department: null,
        supervisor: null,
        fDate: moment(),
        tDate: moment(),
      }}
    >
      <PCardHeader title="Flexible Timesheet">
        {isOfficeAdmin && (
          <PSelect
            options={empDepartmentDDL?.data || []}
            name="department"
            placeholder="Select Department"
            style={{ width: "200px" }}
            onSelect={(value, op) => {}}
          />
        )}
        <PSelect
          options={empDepartmentDDL?.data || []}
          name="supervisor"
          placeholder="Change Attendance"
          style={{ width: "200px" }}
          onSelect={(value, op) => {}}
        />
      </PCardHeader>
    </PForm>
  );
};

export default FlexibleTimeSheet;
