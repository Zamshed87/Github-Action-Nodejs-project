import axios from "axios";
import { toast } from "react-toastify";

export const saveApprovalPipeline = async (payload, cb, setLoading) => {
  try {
    setLoading(true);
    const res = await axios.post(
      `/emp/LeaveMovement/CreateLeaveAndMovementPipeline`,
      payload
    );
    cb();
    setLoading(false);
    toast.success(res?.data?.message || "Successfully Submitted");
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};

export const getApprovalLandingData = async (setLoading, setter) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/emp/LeaveMovement/GetLeaveAndMovementPipeline`
    );
    setter(res?.data?.Result)
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
