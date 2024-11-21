import axios from "axios";
import { toast } from "react-toastify";

export const createCafeteriaEntry = async (
  partId,
  date,
  enrollId,
  typeId,
  mealOption,
  mealFor,
  countMeal,
  ownGuest,
  payable,
  narration,
  userId,
  payload,
  setLoading,
  cb,
  placeId,
  buId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Cafeteria/CafeteriaEntry?PartId=${partId}&ToDate=${date}&EnrollId=${enrollId}&TypeId=1&MealOption=${mealOption}&MealFor=${mealFor}&CountMeal=${countMeal}&isOwnGuest=${ownGuest}&isPayable=${payable}&Narration=${narration}&ActionBy=${userId}&MealConsumePlaceId=${
        placeId || 0
      }&businessUnitId=${buId}`,
      payload
    );
    cb && cb();
    toast.success(res.data?.message || " Create Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.Message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getPendingAndConsumeMealReport = async (
  partId,
  enrollId,
  setter,
  setIsLoading,
  cb,
  date
) => {
  setIsLoading && setIsLoading(true);
  try {
    const res = await axios.get(
      `/Cafeteria/GetPendingAndConsumeMealReport?PartId=${partId}&EnrollId=${enrollId}&mealDate=${date}`
    );
    setIsLoading && setIsLoading(false);
    setter(res?.data);
    cb && cb();
  } catch (err) {
    setIsLoading && setIsLoading(false);
    setter([]);
  }
};

export const getCafeteriaMenuListReport = async (
  loginId,
  setter,
  setIsLoading,
  cb
) => {
  setIsLoading && setIsLoading(true);
  try {
    const res = await axios.get(
      `/Cafeteria/GetCafeteriaMenuListReport?LoginBy=${loginId}`
    );
    setIsLoading && setIsLoading(false);
    setter(res?.data);
    cb && cb();
  } catch (err) {
    setIsLoading && setIsLoading(false);
    setter([]);
  }
};

export const getPlaceDDL = async (ddlType, accId, setter, buId, wgId) => {
  try {
    const res = await axios.get(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=${ddlType}&AccountId=${accId}&intId=0&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`
    );
    // if (res?.data) {
    //   const newDDL = res?.data?.map((itm) => {
    //     return {
    //       ...itm,
    //       value: itm[value],
    //       label: itm[label],
    //     };
    //   });
    //   setter(newDDL);
    // }
    setter(res?.data);
  } catch (error) {}
};
