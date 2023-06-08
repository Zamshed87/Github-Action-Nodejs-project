import axios from "axios";
import { toast } from "react-toastify";
import { dateFormatterForInput } from "../../utility/dateFormatter";

export const getDDLForAnnouncement = async (apiUrl, value, label, setter) => {
  try {
    const res = await axios.get(apiUrl);
    const newDDL = res?.data?.map((itm) => ({
      ...itm,
      value: itm[value],
      label: itm[label],
    }));
    const finalDDL = [
      { [value]: 0, [label]: "All", value: 0, label: "All" },
      ...newDDL,
    ];
    setter(finalDDL);
  } catch (error) {}
};

export const getPeopleDeskAllDDL = async (apiUrl, value, label, setter) => {
  try {
    const res = await axios.get(apiUrl);
    const newDDL = res?.data?.map((itm) => ({
      ...itm,
      value: itm[value],
      label: itm[label],
    }));
    setter(newDDL);
  } catch (error) {}
};

export const getAllWorkPlace = async (apiUrl, value, label, setter) => {
  try {
    const res = await axios.get(apiUrl);
    const newDDL = res?.data?.map((itm) => ({
      ...itm,
      value: itm[value],
      label: itm[label],
    }));
    setter((prev) => [...prev, ...newDDL]);
  } catch (error) {}
};

export const getAllAnnouncement = async (
  buId,
  accountId,
  setter,
  setAllData,
  setLoading,
  employeeId,
  yearId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(`/MasterData/GetAnnouncement?YearId=${yearId}`);
    if (res?.data) {
      setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
export const getSingleAnnouncement = async (
  announcementId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/MasterData/GetAnnouncementListById?intId=${announcementId}`
    );
    if (res?.data) {
      //  workgroup
      let wg = res?.data?.announcementRow
        ?.filter((item) => item?.strAnnounceCode === "Wg")
        .map((item) => {
          return {
            ...item,
            value: item?.intAnnouncementReferenceId,
            label: item?.strAnnouncementFor,
          };
        });
      // workplace
      let w = res?.data?.announcementRow
        ?.filter((item) => item?.strAnnounceCode === "w")
        .map((item) => {
          return {
            ...item,
            value: item?.intAnnouncementReferenceId,
            label: item?.strAnnouncementFor,
          };
        });
      // department
      let dept = res?.data?.announcementRow
        ?.filter((item) => item?.strAnnounceCode === "Dept")
        .map((item) => {
          return {
            ...item,
            value: item?.intAnnouncementReferenceId,
            label: item?.strAnnouncementFor,
          };
        });
      // designation
      let desig = res?.data?.announcementRow
        ?.filter((item) => item?.strAnnounceCode === "Desig")
        .map((item) => {
          return {
            ...item,
            value: item?.intAnnouncementReferenceId,
            label: item?.strAnnouncementFor,
          };
        });
      // user group
      let ug = res?.data?.announcementRow
        ?.filter((item) => item?.strAnnounceCode === "UG")
        .map((item) => {
          return {
            ...item,
            value: item?.intAnnouncementReferenceId,
            label: item?.strAnnouncementFor,
          };
        });

      setter({
        body: res?.data?.announcement?.strDetails || " ",
        date: dateFormatterForInput(res?.data?.announcement?.dteExpiredDate),
        title: res?.data?.announcement?.strTitle,
        workGroup: [...wg],
        workPlace: [...w],
        department: [...dept],
        designation: [...desig],
        userGroup: [...ug],
        intAnnouncementId: res?.data?.announcement?.intAnnouncementId,
        intAccountId: res?.data?.announcement?.intAccountId,
        intBusinessUnitId: res?.data?.announcement?.intBusinessUnitId,
        dteExpiredDate: res?.data?.announcement?.dteExpiredDate,
        dteCreatedAt: res?.data?.announcement?.dteCreatedAt,
        intCreatedBy: res?.data?.announcement?.intCreatedBy,
        isActive: true,
      });
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
export const getSingleAnnouncementDeleteData = async (announcementId, cb) => {
  try {
    const res = await axios.get(
      `/MasterData/GetAnnouncementListById?intId=${announcementId}`
    );
    if (res?.data) {
      cb(res?.data);
    }
  } catch (error) {
    // setLoading && setLoading(false);
  }
};

export const createAnnouncement = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(`/MasterData/CreateEditAnnouncement`, payload);
    // cb();
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};
export const deleteAnnouncement = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(`/MasterData/DeleteAnnouncement`, payload);
    cb();
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newData = allData?.filter((item) =>
      regex.test(item?.strTitle?.toLowerCase())
    );
    setRowDto(newData);
  } catch {
    setRowDto([]);
  }
};
