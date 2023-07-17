import axios from "axios";
import { toast } from "react-toastify";

export const notificationList = [
  {
    id: 1,
    companyName: "iBOS",
    notificationCategoryList: [
      {
        id: 1,
        categoryName: "Leave Application",
        notificationCategoryTypes: [
          {
            permissionId: 0,
            categoryTypeId: 1,
            typeName: "Mail",
            isChecked: true,
          },
          {
            permissionId: 0,
            categoryTypeId: 2,
            typeName: "SMS",
            isChecked: true,
          },
          {
            permissionId: 0,
            categoryTypeId: 4,
            typeName: "RealTime",
            isChecked: false,
          },
        ],
      },
      {
        id: 2,
        categoryName: "Movement Application",
        notificationCategoryTypes: [
          {
            permissionId: 0,
            categoryTypeId: 1,
            typeName: "Mail",
            isChecked: true,
          },
        ],
      },
    ],
  },
];

// ddl
const ddlConvert = (array, value, label) => {
  return array?.map((itm) => {
    return {
      ...itm,
      value: itm[value],
      label: itm[label],
    };
  });
};
const hasDDLConvert = (array, value, label) => {
  return array
    ?.filter((itm) => itm?.isChecked === true)
    ?.map((itm) => {
      return {
        ...itm,
        value: itm[value],
        label: itm[label],
      };
    });
};

export const getNotificationSetupLanding = async (setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/NotificationPermissionLanding`
    );
    const modifyData = res?.data?.map((itm) => {
      return {
        ...itm,
        // notificationCategoryTypes: ddlConvert(
        //   itm?.notificationCategoryTypes,
        //   "categoryTypeId",
        //   "typeName"
        // ),
        // [itm?.categoryName.toLowerCase().split(" ").join("")]: hasDDLConvert(
        //   itm?.notificationCategoryTypes,
        //   "categoryTypeId",
        //   "typeName"
        // ),
        // levelVariable: itm?.categoryName.toLowerCase().split(" ").join(""),
      };
    });
    setter(modifyData);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getNotificationCategoryLanding = async (
  accId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/NotificaitonPermission?IntAccountId=${accId}`
    );
    const modifyData = res?.data?.map((itm) => {
      return {
        ...itm,
        notificationCategoryTypes: ddlConvert(
          itm?.notificationCategoryTypes,
          "categoryTypeId",
          "typeName"
        ),
        [itm?.categoryName.toLowerCase().split(" ").join("")]: hasDDLConvert(
          itm?.notificationCategoryTypes,
          "categoryTypeId",
          "typeName"
        ),
        levelVariable: itm?.categoryName.toLowerCase().split(" ").join(""),
      };
    });
    setter(modifyData);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createNotification = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/SaasMasterData/NotificationPermissionCRUD`,
      payload
    );
    cb && cb();
    toast.success(res.data?.message || "Successfully", { toastId: 101 });
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong", {
      toastId: 101,
    });
    setLoading && setLoading(false);
  }
};
