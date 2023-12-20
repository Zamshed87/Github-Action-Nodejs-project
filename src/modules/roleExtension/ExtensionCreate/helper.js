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

export const setOrganizationDDLFunc = (
  wgId,
  buId,
  employeeId,
  valueOption,
  setOrganizationDDL
) => {
  return valueOption?.value === 1
    ? getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
        "intBusinessUnitId",
        "strShortCode",
        setOrganizationDDL
      )
    : valueOption?.value === 2
    ? getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${buId}&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
        "intWorkplaceGroupId",
        "strWorkplaceGroup",
        setOrganizationDDL
      )
    : valueOption?.value === 3
    ? getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceWithGroupName&BusinessUnitId=0&WorkplaceGroupId=0&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
        "intWorkplaceId",
        "Column1",
        setOrganizationDDL
      )
    : null;
};

export const postRoleExtension = async (
  payload,
  history,
  setLoading,
  setCreateOrUpdate
) => {
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
