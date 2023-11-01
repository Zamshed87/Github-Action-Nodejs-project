import axios from "axios";
import { toast } from "react-toastify";

export const commonUpdateEmployeeProfileAction = async (
  payload,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/UpdateEmployeeProfile`, payload);
    cb && cb();
    toast.success(res.data?.message || "Successfully");
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
