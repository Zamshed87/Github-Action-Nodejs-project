import React from "react";

export default function FavButton({ icon, onClick }) {
	return (
		<button  onClick={onClick} className="btn-fav">
			{icon}
		</button>
	);
}
