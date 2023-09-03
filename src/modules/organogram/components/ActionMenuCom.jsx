import React, { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

export default function ActionMenuCom(props) {
	const [anchorEl, setAnchorEl] = useState(null);

	const open = Boolean(props?.anchorEl || anchorEl);
	const handleClick = (event) => {
		event.stopPropagation();
		if (props?.setAnchorEl) {
			props?.setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(event.currentTarget);
		}
	};
	const handleClose = (e) => {
		e.stopPropagation();
		if (props?.setAnchorEl) {
			props?.setAnchorEl(null);
		} else {
			setAnchorEl(null);
		}
	};

	return (
		<div>
			<Button
				id="basic-button"
				aria-controls="basic-menu"
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				type="button"
				onClick={handleClick}
        disableRipple
        disableFocusRipple
        sx={{minWidth:"30px",padding:"2px 8px"}}
			>
				<MoreVert sx={{ color: props?.color,fontSize:"1rem" }} />
			</Button>
			<Menu
				id="basic-menu"
				anchorEl={props?.anchorEl || anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
				sx={props?.menuStyle}
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
	);
}

/*
	Usage

	<ActionMenu
		options={[
			{
				value: 1,
				label: 'View',
				icon: <RemoveRedEyeOutlined sx={{ marginRight: "10px" }} />,
				onClick: () => {
					alert('View One');
				}
			},
			{
				value: 2,
				label: 'Edit',
				icon: <EditOutlined sx={{ marginRight: "10px" }} />,
				onClick: () => {
					alert('Edit One');
				}
			}
		]}
	/>

*/
