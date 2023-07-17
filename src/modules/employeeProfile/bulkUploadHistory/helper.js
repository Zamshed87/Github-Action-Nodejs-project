import axios from "axios";

export const getSummaryBulkHistoryAction = async (setLoading, setter, buId) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/MasterData/PeopleDeskAllLanding?TableName=OTBulkUploadHistoryLanding&BusinessUnitId=${buId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getDetailsBulkHistoryAction = async (
  setLoading,
  setter,
  buId,
  fromDate,
  statusId
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/emp/MasterData/PeopleDeskAllLanding?TableName=OTBulkUploadHistoryDetails&BusinessUnitId=${buId}&FromDate=${fromDate}&StatusId=${statusId}`
    );
    setter(res?.data?.Result);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
