import React from "react";

function IHeart({ classNames }) {
  return (
    <>
      <i
        onClick={() => {
          //   updateIsShown(kpiId, !isShown);
        }}
        style={{ fontSize: "17px", cursor: "pointer", zIndex: "99999", position: "absolute", top: "5px", right: "10px" }}
        className="fa fa-heart ml-4 i-heart text-danger"
      ></i>
    </>
  );
}

export default React.memo(IHeart);
