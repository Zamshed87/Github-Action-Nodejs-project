import axios from "axios";
import { toast } from "react-toastify";
import { todayDate } from "../../utility/todayDate";

export const createPosition = async ({
  orgId,
  employeeId,
  buId,
  positionName,
  positionCode,
  intWorkplaceId,
  setLoading,
  cb,
}) => {
  try {
    // if (!positionName || !positionGroupId) return toast.warn("Position and position group are required");
    if (!positionName || !positionCode)
      return toast.warn("Position and position code are required");
    setLoading(true);
    const res = await axios.post(`/SaasMasterData/SavePosition`, {
      intPositionId: 0,
      strPosition: positionName,
      intBusinessUnitId: buId,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: 0,
      strPositionCode: positionCode,
      isActive: true,
      intWorkplaceId: intWorkplaceId,
    });
    setLoading(false);
    toast.success(res?.data?.message);
    cb();
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message);
  }
};

export const createPositionGroup = async (
  accId,
  userId,
  positionGroupName,
  setLoading,
  cb
) => {
  try {
    if (!positionGroupName) return toast.warn("Position group is required");
    setLoading(true);
    const res = await axios.post(`/emp/MasterData/CRUDPositionGroup`, {
      actionTypeId: 1,
      positionGroupId: 0,
      positionGroupCode: positionGroupName,
      positionGroupName: positionGroupName,
      accountId: accId,
      isActive: true,
      insertUserId: userId,
    });
    setLoading(false);
    toast.success(res?.data?.message);
    cb();
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message);
  }
};

export const getOrganogramAction = async (buId, setter) => {
  try {
    const res = await axios.get(
      `/Organogram/GetOrganogramTree?businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter({});
  }
};

export const organogramSaveUpdate = async (obj) => {
  const {
    autoId,
    parentId,
    childList,
    employee,
    position,
    employeeId,
    isActive,
    buId,
    setLoading,
    cb,
    sequence,
    isDrag,
  } = obj;

  if (!isDrag && isActive && !position?.value)
    return toast.warn("Position is required");

  try {
    let payload = [
      {
        autoId: autoId || 0,
        parentId: parentId || 0,
        sequence: sequence || childList?.length + 1 || 1,
        positionId: position?.value || 0,
        positionName: position?.label || "",
        employeeId: employee?.value || 0,
        employeeName: employee?.EmployeeOnlyName || "",
        // insertBy: userId,
        createdBy: employeeId,
        businessUnitId: buId,
        isActive: isActive,
      },
    ];

    if (isDrag) {
      payload = childList?.map((item, index) => ({
        autoId: item?.autoId,
        parentId: item?.parentId,
        sequence: index + 1,
        positionId: item?.positionId,
        positionName: item?.positionName,
        employeeId: item?.employeeId,
        employeeName: item?.employeeName,
        insertBy: employeeId,
        businessUnitId: buId,
        isActive: isActive,
      }));
    }

    setLoading(true);
    const res = await axios.post(`/Organogram/OrganogramReConstruct`, payload);
    setLoading(false);
    cb && cb();
    toast.success(res?.data?.message || "Successful");
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};
