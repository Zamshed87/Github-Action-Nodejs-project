import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AttachmentOutlined, FileUpload } from "@mui/icons-material";
import { attachment_action } from "common/api";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";

const AttachmentUpload = ({
  title,
  fileRef,
  setLoading,
  imageFile,
  setImageFile,
}) => {
  const dispatch = useDispatch();
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData
  );

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file) {
        attachment_action(
          orgId,
          "Asset Document",
          36,
          buId,
          employeeId,
          event.target.files,
          setLoading
        )
          .then((data) => setImageFile(data?.[0]))
          .catch(() => setImageFile(""));
      }
    },
    [orgId, buId, employeeId, setLoading, setImageFile]
  );

  const handleButtonClick = useCallback(() => {
    fileRef.current?.click();
  }, [fileRef]);

  const handleDownloadClick = useCallback(() => {
    dispatch(getDownlloadFileView_Action(imageFile?.globalFileUrlId));
  }, [dispatch, imageFile]);

  return (
    <div>
      <p
        onClick={handleButtonClick}
        className="d-inline-block mt-2 pointer upload-para"
      >
        <input
          onChange={handleFileChange}
          type="file"
          id="file"
          accept="image/png, image/jpeg, image/jpg, .pdf"
          ref={fileRef}
          style={{ display: "none" }}
        />
        <span style={{ fontSize: "14px" }}>
          <FileUpload sx={{ marginRight: "5px", fontSize: "18px" }} />
          {title}
        </span>
      </p>
      <br />
      {imageFile?.globalFileUrlId ? (
        <div className="d-inline-block" onClick={handleDownloadClick}>
          <div
            className="d-flex align-items-center"
            style={{
              fontSize: "12px",
              fontWeight: "500",
              color: "#0072E5",
              cursor: "pointer",
            }}
          >
            <AttachmentOutlined sx={{ marginRight: "5px", color: "#0072E5" }} />
            {imageFile?.fileName || "Attachment"}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AttachmentUpload;
