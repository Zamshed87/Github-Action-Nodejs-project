import axios from "axios";
import { toast } from "react-toastify";

//Search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.strFeatureGroupName?.toLowerCase())
    );
    setRowDto(newDta);
  } catch (error) {
    setRowDto([]);
  }
};

//DDl
export const getModudleNameDDL = async (setter) => {
  try {
    let res = await axios.get(`/MenuAndFeature/GetFirstLevelMenuList`);
    setter(res?.data);
  } catch (err) {}
};

export const getFeatureNameDDL = async (featureId, setter) => {
  try {
    let res = await axios.get(
      `/MenuAndFeature/GetMenuFeatureList?FirstLevelMenuId=${featureId}`
    );
    setter(res?.data);
  } catch (err) {}
};

//Create
export const createFeatureGroup = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/MenuAndFeature/CreateMenuFeatureGroup`,
      payload
    );
    cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.Message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

//Table Landing
export const getFeatureGroupLanding = async (
  id,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    let res = await axios.get(
      `/MenuAndFeature/GetMenuFeatureGroupLanding?BusinessUnitId=${id}`
    );
    setter(res?.data);
    setAllData(res?.data);
    setLoading && setLoading(false);
  } catch (err) {
    setLoading && setLoading(false);
  }
};

//Edit
export const getMenuFeatureGroup = async (
  buId,
  featureGroupName,
  setter,
  setRowDto,
  setLoading
) => {
  setLoading(true);
  try {
    let res = await axios.get(
      `/MenuAndFeature/GetMenuFeatureGroupById?BusinessUnitId=${buId}&FeatureGroupName=${featureGroupName}`
    );
    const modifySingleData = {
      ...res?.data,
      featureName: res?.data[0]?.strFeatureGroupName,
    };
    setter(modifySingleData);
    setLoading && setLoading(false);
    setRowDto(res?.data);
  } catch (err) {
    setLoading && setLoading(false);
  }
};
