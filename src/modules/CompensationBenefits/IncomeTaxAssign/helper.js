import axios from "axios";
import { toast } from "react-toastify";

export const getTaxAssignLanding = async (
  buId,
  orgId,
  values,
  setter,
  setLoading,
  setAllData
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetAllEmployeeForTaxAssign?IntAccountId=${orgId}&IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${
        values?.workplaceGroup?.value || 0
      }&IntWorkplaceId=${values?.workplace?.value || 0}&IntEmployeeId=${
        values?.employee?.value || 0
      }`
    );
    setter(res?.data);
    setAllData(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createTaxAssign = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/EmployeeTaxAssign`, payload);
    cb && cb();
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};
