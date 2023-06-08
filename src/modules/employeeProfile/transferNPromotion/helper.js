import axios from "axios";
// transfer and promotion common api
export const getAllTransferAndPromotionLanding = async (
  orgId,
  buId,
  landingType,
  setter,
  setAllData,
  setLoading,
  fromDate,
  toDate,
  wgId
) => {
  setLoading && setLoading(true);
  const filterDate = `dteFromDate=${fromDate}&dteToDate=${toDate}`;
  try {
    const res = await axios.get(
      `/Employee/GetAllEmpTransferNpromotion?workplaceGroupId=${wgId}&businessUnitId=${buId}&landingType=${landingType}&${filterDate}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
