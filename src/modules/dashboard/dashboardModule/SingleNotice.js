import React from "react";

export default function SingleNotice({ singleNoticeData }) {
  return (
    <>
      <div className="create-approval-form  modal-body-two">
        <div className="modal-body2">
          <h6>{singleNoticeData?.strTitle}</h6>
          <p
            className="my-2"
            dangerouslySetInnerHTML={{
              __html: singleNoticeData?.strDetails,
            }}
          ></p>
        </div>
      </div>
    </>
  );
}
