import React from "react";
import { Avatar } from "antd";
type AvatarType = {
  title: string;
  characterCount?: number;
};
export const PAvatar: React.FC<AvatarType> = ({ title, characterCount }) => {
  function stringToColor(title: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < title?.length; i += 1) {
      hash = title?.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value?.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }
  return (
    <>
      <div
        className={"PAvatar"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Avatar
          style={{
            color: "#fffff",
            backgroundColor: stringToColor(title),
            height: "22px",
            width: "22px",
            fontSize: "10px",
            lineHeight: "normal",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {characterCount === 2
            ? `${title?.split(" ")?.[0]?.[0]}${title?.split(" ")?.[1]?.[0]}`
            : `${title?.split(" ")?.[0]?.[0]}`}
        </Avatar>
      </div>
    </>
  );
};
