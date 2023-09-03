import React, { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

export default function ActionMenu(props) {
	const [anchorEl, setAnchorEl] = useState(null);

	const open = Boolean(props?.anchorEl || anchorEl);
	const handleClick = (event) => {
		event.stopPropagation();
		props?.setSingleData && props?.setSingleData(props?.item);
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
		<div className="kebab-menu-action">
			<Button
				id="basic-button"
				aria-controls="basic-menu"
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				type="button"
				onClick={handleClick}
				style={props?.styles}
			>
				<MoreVert sx={{ color: props?.color, fontSize: props?.fontSize || '16px' }} />
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
						<MenuItem
							onClick={item?.onClick}
							key={index}
							sx={{
								"&.MuiMenuItem-root": {
									fontSize: '12px'
								}
							}}
							disabled={item.disabled}
						>
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
