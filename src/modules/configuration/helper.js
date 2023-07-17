import axios from "axios";

export const getControlPanelAllLanding = async ({
  apiUrl,
  setter,
  setLoading,
  setAllData,
}) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(apiUrl);
    if (res?.data) {
      setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
