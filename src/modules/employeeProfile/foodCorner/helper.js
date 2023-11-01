import axios from "axios";
import { toast } from "react-toastify";

export const createCafeteriaEntry = async (partId, date, enrollId, typeId, mealOption, mealFor, countMeal, ownGuest, payable, narration, userId, payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Cafeteria/CafeteriaEntry?PartId=${partId}&ToDate=${date}&EnrollId=${enrollId}&TypeId=${typeId}&MealOption=${mealOption}&MealFor=${mealFor}&CountMeal=${countMeal}&isOwnGuest=${ownGuest}&isPayable=${payable}&Narration=${narration}&ActionBy=${userId}`,
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
  cb
) => {
  setIsLoading && setIsLoading(true);
  try {
    let res = await axios.get(
      `/Cafeteria/GetPendingAndConsumeMealReport?PartId=${partId}&EnrollId=${enrollId}`
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
    let res = await axios.get(
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