import axios from "axios";
import { toast } from "react-toastify";

export const saveMovementType = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/SaasMasterData/SaveLveMovementType`,
      payload
    );
    cb && cb();
    toast.success(res?.data?.message);
  } catch (error) {
    toast.warning(error?.response?.data?.message);
  }
};

export const quotaFrequencyDDL = [
  {
    value: 1,
    label: "Daily",
  },
  {
    value: 2,
    label: "Weekly",
  },
  {
    value: 3,
    label: "Monthly",
  },
  {
    value: 4,
    label: "Half-Yearly",
  },
  {
    value: 5,
    label: "Yearly",
  },
];
