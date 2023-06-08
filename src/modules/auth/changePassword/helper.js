import axios from "axios";
import { toast } from "react-toastify";

export const changePassword = async ({
  accountId,
  loginId,
  oldPassword,
  newPassword,
  employeeId,
  cb,
}) => {
  try {
    const res = await axios.get(
      `/Auth/ChangePassword?accountId=${accountId}&loginId=${loginId}&oldPassword=${oldPassword}&newPassword=${newPassword}&updatedBy=${employeeId}`
    );
    cb();
    toast.success(res?.data?.message || "Updated Successfully");
  } catch (error) {
    toast.warn("Something went wrong");
  }
};
