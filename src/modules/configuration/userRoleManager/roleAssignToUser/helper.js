import axios from "axios";
import { toast } from "react-toastify";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.strDesignation?.toLowerCase())
    );
    setRowDto(newDta);
  } catch {
    setRowDto([]);
  }
};

export const createRoleAssignToUser = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Auth/RoleAssignToUser`, payload);
    cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getAllRoleAssignLanding = async (
  orgId,
  buId,
  setter,
  setAllData,
  setLoading,
  wId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/GetAllDesignation?accountId=${orgId}&businessUnitId=${buId}&workplaceId=${wId}`
    );
    if (res?.data) {
      setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getAssignedDataById = async (
  buId,
  wgId,
  id,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Auth/RoleAssignToUserById?businessUnitId=${buId}&workplaceGroupId=${wgId}&employeeId=${id}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
