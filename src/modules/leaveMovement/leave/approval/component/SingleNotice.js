import React from "react";

export default function SingleNotice({ allNoticeData }) {
  console.log("allNoticeData", allNoticeData);
  return (
    <>
      <div className="create-approval-form  modal-body-two">
        {allNoticeData?.length > 0 ? (
          <div className="modal-body2">
            {allNoticeData?.map((item, index) => (
              <>
                <p
                  key={index}
                  className="my-2"
                  dangerouslySetInnerHTML={{
                    __html: item?.strLogContent,
                  }}
                ></p>
              </>
            ))}
          </div>
        ) : (
          <h6 className="mb-4">
            There is no Modification!
          </h6>
        )}
      </div>
    </>
  );
}
