import axios from "axios";

export const getDailyCafeteriaReport = async (
  buId,
  mealDate,
  isDownload,
  setter,
  setIsLoading,
  cb
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/Cafeteria/GetDailyCafeteriaReport?businessUnitId=${buId}&mealDate=${mealDate}&isDownload=${isDownload}`
    );
    setIsLoading(false);
    setter(res?.data);
    cb && cb();
  } catch (err) {
    setIsLoading(false);
    setter([]);
  }
};

export const getMonthlyCafeteriaReport = async (
  buId,
  workplaceId,
  fromDate,
  toDate,
  isDownload,
  setter,
  setIsLoading,
  cb
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/Cafeteria/MonthlyCafeteriaReport?businessUnitId=${buId}&workPlaceId=${workplaceId}&fromDate=${fromDate}&toDate=${toDate}&isDownload=${isDownload}`
    );
    setIsLoading(false);
    setter(res?.data);
    cb && cb();
  } catch (err) {
    setIsLoading(false);
    setter([]);
  }
};
