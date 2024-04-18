import axios from "axios";

export const getHolidaySetupLanding = async (
  tableName,
  accId,
  busId,
  id,
  setter,
  setAllData,
  setLoading,
  wId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=${tableName}&BusinessUnitId=${busId}&workplaceId=${wId}&intId=${id}`
    );
    if (res?.data) {
      const newData = res?.data?.map((item) => {
        return {
          ...item,
          noOfDays: item?.TotalDays ? +item?.TotalDays : +0,
        };
      });
      setter(newData);
      setAllData && setAllData(newData);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
