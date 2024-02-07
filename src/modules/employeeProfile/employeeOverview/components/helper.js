import axios from "axios";
import { toast } from "react-toastify";

// 🔥 this is common emp profile update function with api call
/**
 * Updates the employee profile with the given payload.
 * @param {Object} payload - The payload containing the updated employee profile data.
 * @param {Function} setLoading - The function to set the loading state.
 * @param {Function} cb - The callback function to be called after the update is complete.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
export const updateEmployeeProfile = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/UpdateEmployeeProfile`, payload);
    cb?.(res.data);
    if ( // if api is calling for delete then it will show the message
      payload?.value === "" ||
      payload?.value === null ||
      payload?.value === undefined
    ) {
      toast.success(
        `${payload?.partType || "Information"} deleted successfully`
      );
    } else {
      toast.success(res.data?.message || "Successfully");
    }
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.Message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const DDLForAddress = async (
  ddlType,
  wgId,
  busId,
  setter,
  value,
  label,
  id
) => {
  try {
    const res = await axios.get(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=${ddlType}&BusinessUnitId=${busId}&WorkplaceGroupId=${wgId}&intId=${
        id || 0
      }`
    );
    if (res?.data) {
      const newDDL = res?.data?.map((itm) => {
        return {
          ...itm,
          value: itm[value],
          label: itm[label],
        };
      });
      setter(newDDL);
    }
  } catch (error) {}
};
