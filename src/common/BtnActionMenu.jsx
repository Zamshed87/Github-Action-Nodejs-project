import { AddOutlined } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import PrimaryButton from "./PrimaryButton";
export default function BtnActionMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <div>
          <PrimaryButton
            type="button"
            className="btn btn-default flex-center"
            label="Create job"
            icon={<AddOutlined sx={{ marginRight: "11px" }} />}
            onClick={handleMenu}
            {...props}
          />
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {props?.options?.map((item, index) => {
              return (
                <MenuItem onClick={item?.onClick} key={index}>
                  {item?.icon} {item?.label}
                </MenuItem>
              );
            })}
          </Menu>
        </div>
      </Box>
    </div>
  );
}
