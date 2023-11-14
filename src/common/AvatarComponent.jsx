import React from "react";
import { Avatar } from "@mui/material";

export default function AvatarComponent(props) {
  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string?.length; i += 1) {
      hash = string?.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value?.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        fontSize: "10px",
      },
      children:
        props?.letterCount === 2
          ? `${name?.split(" ")?.[0]?.[0]}${name?.split(" ")?.[1]?.[0]}`
          : `${name?.split(" ")?.[0]?.[0]}`,
    };
  }

  return (
    <div className={props?.classess}>
      {props?.isImage ? (
        <Avatar alt={props?.alt} src={props?.img} />
      ) : (
        <Avatar
          sx={{
            "&.MuiAvatar-root": {
              width: "22px!important",
              height: "22px!important",
            },
          }}
          {...stringAvatar(props?.label?.trim())}
        />
      )}
    </div>
  );
}

/*
   Usage
   a. Letter

      <AvatarComponent
         classess="mx-2"
         letterCount={2}
         label={"Bulbul Ahmed"}
      />

   b. Image

      <AvatarComponent
         classess="mx-2"
         isImage={true}
         img={logo}
         alt="People Desk"
      />
*/
