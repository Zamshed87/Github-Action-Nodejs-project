import React from "react";
import { Box, LinearProgress } from "@mui/material";

export default function FormikLinearProgress(props) {
	const FailProgress = () => {
		return (
			<LinearProgress
				variant="determinate"
				value={props?.progress}
				sx={{
					"&.MuiLinearProgress-root": {
						backgroundColor: "#ffc9cc",
						width: "100%",
						height: "6px",
						borderRadius: "4px",

						"& .MuiLinearProgress-bar": {
							backgroundColor: "#F11014",
						},
					},
				}}
			/>
		);
	};
	const warningProgress = () => {
		return (
			<LinearProgress
				variant="determinate"
				value={props?.progress}
				sx={{
					"&.MuiLinearProgress-root": {
						backgroundColor: "#fee0b3",
						width: "100%",
						height: "6px",
						borderRadius: "4px",

						"& .MuiLinearProgress-bar": {
							backgroundColor: "#F78C12",
						},
					},
				}}
			/>
		);
	};
	const SuccessProgress = () => {
		return (
			<LinearProgress
				variant={props?.variant}
				value={props?.progress}
				sx={{
					"&.MuiLinearProgress-root": {
						backgroundColor: "#b8f9ca",
						width: "100%",
						height: "6px",
						borderRadius: "4px",

						"& .MuiLinearProgress-bar": {
							backgroundColor: "#50DB00",
						},
					},
				}}
			/>
		);
	};

	const RunningProgress = () => {
		return (
			<LinearProgress
				variant={props?.variant}
				value={props?.progress}
				sx={{
					"&.MuiLinearProgress-root": {
						backgroundColor: "#ddf2fb",
						width: "100%",
						height: "6px",
						borderRadius: "4px",

						"& .MuiLinearProgress-bar": {
							backgroundColor: "#009cde",
						},
					},
				}}
			/>
		);
	};

	const resultProgress = () => {
		if (props?.progress <= 39) return FailProgress();
		if (props?.progress >= 40 && props?.progress <= 60)
			return warningProgress();
		if (props?.progress >= 61 && props?.progress <= 79)
			return RunningProgress();
		if (props?.progress >= 80) return SuccessProgress();
	};
	return (
		<>
			<Box sx={{ flexGrow: 1 }}>{resultProgress()}</Box>
		</>
	);
}
