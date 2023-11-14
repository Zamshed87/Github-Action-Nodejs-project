import axios from "axios";
import { toast } from "react-toastify";

export const getYearlyPolicyPopUpDDL = async (
  apiUrl,
  value,
  label,
  setter,
  cb
) => {
  try {
    const res = await axios.get(apiUrl);
    const newDDL = res?.data?.map((itm) => ({
      ...itm,
      value: itm[value],
      label: itm[label],
    }));
    setter?.([...newDDL]);
    cb && cb(newDDL);
  } catch (error) {}
};

export const getYearlyPolicyLanding = async (apiUrl, setter, cb = {}) => {
  try {
    const res = await axios.get(apiUrl);
    // setter?.(res?.data);
    let i = 1;
    // console.log({ res });
    if (res?.data?.data) {
      let tempArr = res?.data?.data?.map((item, idx) => {
        if (item?.strWorkplaceName.trim()) {
          return {
            ...item,
            strWorkplaceName: item?.strWorkplaceName,
            sl: null,
          };
        } else {
          return {
            ...item,
            sl: i++,
          };
        }
      });
      console.log(tempArr);

      // setter(tempArr);
    }
    console.log(1);
    cb && cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
