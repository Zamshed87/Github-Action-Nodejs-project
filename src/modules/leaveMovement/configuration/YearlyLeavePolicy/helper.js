import axios from "axios";

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
    setter([{ value: 0, label: "All" }, ...newDDL]);
    cb && cb();
  } catch (error) {}
};
