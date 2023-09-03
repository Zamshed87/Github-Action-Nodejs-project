import React from "react";
import axios from "axios";
import { setSearchUserListAction } from "./redux/Action";

export const getUserSearch = async (
  name,
  buId,
  dispatch,
  setLoading,
  skip,
  limit
) => {
  setLoading(true);
  try {
    let res = await axios.get(
      `https://chat.ibos.io/api/user/getUser?name=${name}&buId=${buId}&skip=${skip}&limit=${limit}`
    );
    if (res?.status === 200) {
      dispatch(setSearchUserListAction(res?.data));
      setLoading(false);
    }
  } catch (err) {
    dispatch(setSearchUserListAction([]));
    setLoading(false);
  }
};

export const getUserSearchForGroupCreate = async (name, buId) => {
  try {
    let res = await axios.get(
      `https://chat.ibos.io/api/user/getUser?name=${name}&buId=${buId}&skip=${0}&limit=${50}`
    );
    if (res?.status === 200) {
      const data = res?.data?.map((item) => {
        return {
          ...item,
          value: item?.intUserId,
          label: item?.strUserName + ` [${item?.strBusinessUnitCode}]`,
        };
      });
      return data;
    }
  } catch (err) {
    return [];
  }
};

export const colorCodeList = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
];

export const ProfilePicIcon = ({ name, className, color }) => {
  return (
    <div
      style={{
        width: "40px",
        color: "white",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: color
          ? color
          : colorCodeList[Math.floor(Math.random() * 6)],
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "17px",
        fontWeight: "500",
      }}
      className={className || ""}
    >
      {name?.split(" ").join("")[0] || "A"}
    </div>
  );
};

export const ProfilePicIconGroup = ({ name, className, color }) => {
  return (
    <div
      style={{
        width: "40px",
        color: "white",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: color
          ? color
          : colorCodeList[Math.floor(Math.random() * 6)],
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "17px",
        fontWeight: "500",
      }}
      className={className || ""}
    >
      <i style={{ color: "white" }} className="fas fa-users"></i>
    </div>
  );
};
