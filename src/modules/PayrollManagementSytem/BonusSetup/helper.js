import axios from "axios";
import { setHeaderListDataDynamically } from "common/peopleDeskTable/helper";
import { toast } from "react-toastify";

export const getBonusNameDDL = async (payload, setter) => {
  try {
    const res = await axios.post(`/Employee/BonusAllLanding`, payload);
    setter(res?.data);
  } catch (error) {}
};

export const getBonusSetupLanding = async (
  payload,
  modifiedPayload,
  setter,
  setLoading,
  pagination,
  searchText,
  currentFilterSelection,
  checkedHeaderList,
  values,
  headerList,
  setHeaderList,
  filterOrderList,
  setFilterOrderList,
  initialHeaderListData,
  setInitialHeaderListData,
  setPages
) => {
  console.log({payload});
  try {
    const res = await axios.post(`/Employee/BonusSetupLandingPagination`, {
      ...payload,
      ...modifiedPayload,
    });
    if (res?.data?.datas?.length > 0) {
      const modified = res?.data?.datas?.map((item) => ({
        ...item,
        statusValue: item?.isActive ? "Active" : "Inactive",
      }));
      modified?.length > 0 && setter(modified);
      if (res?.data?.datas) {
        setHeaderListDataDynamically({
          currentFilterSelection,
          checkedHeaderList,
          headerListKey: "headerList",
          headerList,
          setHeaderList,
          response: {...res?.data},
          filterOrderList,
          setFilterOrderList,
          initialHeaderListData,
          setInitialHeaderListData,
          setter,
          setPages,
        });
        setLoading(false);
      }
    } else {
      setter([]);
    }

    // setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createBonusSetup = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/CRUDBonusSetup`, payload);
    cb && cb();
    toast.success(res.data?.message || " Create Successfully", {
      toastId: "bonusCreate",
    });
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong", {
      toastId: "bonusCreate",
    });
    setLoading && setLoading(false);
  }
};
