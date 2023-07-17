import axios from "axios";
import { toast } from "react-toastify";

export const getLandingData = async (
  orgId,
  buId,
  setter,
  setLoading,
  setAllData,
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/AssetManagement/GetItem?accountId=${orgId}&businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createEditItemReg = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/AssetManagement/SaveItem`,
      payload
    );
    cb && cb();
    toast.success(res?.data?.Result?.Message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

// item DDL
export const getDDL = async (url, orgId, buId, setter) => {
  try {
    const res = await axios.get(
      `${url}?accountId=${orgId}&businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to fetch data", {
      toastId: "getDDL",
    });
  }
};

export const createSetup = async (url, payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(url, payload);
    cb && cb();
    toast.success(res.data?.message || "Create Successfully", {
      toastId: "create",
    });
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong", {
      toastId: "create",
    });
    setLoading && setLoading(false);
  }
};
