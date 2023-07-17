import React from "react";

const PrimaryButton = ({
	icon,
	label,
	type,
	className,
	customStyle,
	...rest
}) => {
	const btnStyle = {
		...customStyle,
	};
	return (
		<button type={type} style={btnStyle} className={className} {...rest}>
			{icon && icon} {label}
		</button>
	);
};

export default PrimaryButton;
