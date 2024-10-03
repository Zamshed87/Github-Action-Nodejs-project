import axios from "axios";
import { toast } from "react-toastify";
import { getPeopleDeskAllDDL } from "../../../common/api";

export const organizationTypeList = [
  {
    label: "Business Unit",
    value: 1,
  },
  {
    label: "Workplace Group",
    value: 2,
  },
  {
    label: "Workplace",
    value: 3,
  },
];
const getWorkplaceWithGroup = async (apiUrl, value, label, setter, cb) => {
  try {
    const res = await axios.get(apiUrl);
    const newDDL = res?.data?.map((itm) => ({
      ...itm,
      value: itm[value],
      label: itm?.strWorkplaceGroup
        ? `${itm[label]}-[${itm.strWorkplaceGroup}]`
        : itm[label],
    }));
    setter && setter(newDDL);
    cb && cb();
  } catch (error) {}
};
export const setOrganizationDDLFunc = (
  orgId,
  wgId,
  buId,
  employeeId,
  valueOption,
  setOrganizationDDL
) => {
  return valueOption?.value === 1
    ? getPeopleDeskAllDDL(
        // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
        `/PeopleDeskDdl/BusinessUnitWithRoleExtension?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&empId=${employeeId}`,
        "intBusinessUnitId",
        "strBusinessUnit",
        setOrganizationDDL
      )
    : valueOption?.value === 2
    ? getPeopleDeskAllDDL(
        // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${buId}&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
        `/PeopleDeskDdl/WorkplaceGroupWithRoleExtension?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&empId=${employeeId}`,
        "intWorkplaceGroupId",
        "strWorkplaceGroup",
        setOrganizationDDL
      )
    : valueOption?.value === 3
    ? getWorkplaceWithGroup(
        // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceWithGroupName&BusinessUnitId=0&WorkplaceGroupId=0&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
        `/PeopleDeskDdl/WorkplaceWithRoleExtension?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&empId=${employeeId}`,
        "intWorkplaceId",
        "strWorkplace",
        setOrganizationDDL
      )
    : null;
};

export const postRoleExtension = async (payload, history, setLoading) => {
  setLoading && setLoading(true);
  try {
    const response = await axios.post(
      `/Auth/RoleExtensionCreateOrUpdate`,
      payload
    );
    response?.status === 200 &&
      toast.success(response?.data?.message || "Submitted Successfully");
    response?.status === 200 && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};
