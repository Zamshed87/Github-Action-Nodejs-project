import React from "react";

const ScrollableTable = (props) => {
	return (
		<div className={props?.classes ? `sme-scrollable-table ${props?.classes}` : "sme-scrollable-table"}>
			<div className={props?.secondClasses ? `scroll-table scrollable-table-sm _table tableScrollableOne ${props?.secondClasses} ${props?.customClass ? `${props?.customClass}` : "" }` : `scroll-table scrollable-table-sm _table tableScrollableOne`}>
				<table className="table table-bordered table-hover">
					{props.children}
				</table>
			</div>
		</div>
	);
};

export default ScrollableTable;
