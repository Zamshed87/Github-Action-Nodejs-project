import React from "react";
import { useDispatch } from "react-redux";
import { AttachmentOutlined } from "@mui/icons-material";
import { getDownlloadFileView_Action } from "../../../../../../commonRedux/auth/actions";

export default function NocSlider({ item }) {
  const dispatch = useDispatch();
  return (
    <>
      <div
        className="mySwiper"
      >
        <div
          className="d-flex align-items-center"
          onClick={() => {
            dispatch(getDownlloadFileView_Action(item?.intTrainingFileUrlId));
          }}>
          <AttachmentOutlined sx={{ marginRight: "1px", color: "#0072E5", fontSize: "16px" }} />
          <p style={{ fontSize: "11px", fontWeight: "500", color: "#0072E5", cursor: "pointer" }}>{"Attachment"}</p>
        </div>
      </div>

    </>
  );
}
