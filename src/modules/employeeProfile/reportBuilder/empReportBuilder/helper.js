import axios from "axios";

export const getColumnNameForReport = async (
  setter,
  setAllData,
  setShowingData,
  setLoading,
  buId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=CustomReportColumnName&BusinessUnitId=${buId}`
    );
    if (res?.data) {
      const modifiedData = res?.data?.map((item) => {
        return {
          ...item,
          isSelected: false,
        };
      });
      setter && setter(modifiedData);
      setAllData && setAllData(modifiedData);
      setShowingData && setShowingData(modifiedData);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getCustomReportData = async (
  orgId,
  buId,
  setter,
  setLoading,
  wgId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=EmployeeProfileAllLandingForCustomReport&AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`
    );
    setter(res?.data);
    // setAlldata && setAlldata(res?.data);
  } catch (error) {
    setter([]);
  } finally {
    setLoading && setLoading(false);
  }
};
