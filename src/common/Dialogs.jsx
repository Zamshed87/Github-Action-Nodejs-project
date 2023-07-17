import React from "react";

export default function Dialogs({
	headerCenter,
	title,
	para,
	icon,
	dialogYes,
	dialogNo,
	buttonRight,
}) {
	return (
		<div className={`dialogs-wrapper`}>
			{title && (
				<div
					className={headerCenter ? "dialogs-head text-center" : "dialogs-head"}
				>
					{icon && <div className="dialogs-icon">{icon}</div>}
					<h2>{title}</h2>
				</div>
			)}

			<div className="dialogs-body">
				<p>{para}</p>
			</div>

			<div
				className={
					buttonRight
						? `dialogs-footer justify-content-between`
						: `dialogs-footer`
				}
			>
				<div></div>
				<div className="button-group">
					<button
						type="button"
						className="btn btn-text"
						onClick={() => dialogYes()}
					>
						{" "}
						Button{" "}
					</button>
					<button
						type="button"
						className="btn btn-text"
						onClick={() => dialogNo()}
					>
						Button
					</button>
				</div>
			</div>
		</div>
	);
}
