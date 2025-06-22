import { VisibilityOutlined } from "@mui/icons-material";
import { Tooltip } from "antd";
import AttachmentShow from "common/AttachmentShow";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import React from "react";
import { useDispatch } from "react-redux";

export default function SingleNotice({ singleNoticeData }) {
  const dispatch = useDispatch();
  return (
    <>
      <div className="create-approval-form  modal-body-two">
        <div className="d-flex justify-content-between align-items-center">
          <div className="modal-body2">
            <h6>{singleNoticeData?.strTitle}</h6>
            <p
              className="my-2"
              dangerouslySetInnerHTML={{
                __html: singleNoticeData?.strDetails,
              }}
            ></p>
          </div>
          <AttachmentShow
            intAttachmentId={singleNoticeData?.intAttachmentId}
            label={"Attachment"}
          />
        </div>
      </div>
    </>
  );
}
