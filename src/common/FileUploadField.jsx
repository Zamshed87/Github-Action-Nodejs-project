import React, { useRef, useState } from "react";
import { AttachmentOutlined } from "@mui/icons-material";
import placeholderImg from "../assets/images/placeholderImg.png";
import Loading from "./loading/Loading";
import { attachment_action } from "./api";

const FileUploadField = ({ fileId, setFileId }) => {
  // images
  const [loading, setLoading] = useState(false);
  const inputFile = useRef(null);
  const onButtonClick = () => {
    inputFile.current.click();
  };
  return (
    <div className="upload-input-filed">
      {loading && <Loading />}
      <div
        className={fileId ? "image-upload-box with-img" : "image-upload-box"}
        onClick={onButtonClick}
        style={{ cursor: "pointer", position: "relative" }}
      >
        <input
          onChange={(e) => {
            if (e.target.files?.[0]) {
              attachment_action(e.target.files, setLoading)
                .then((data) => {
                  setFileId(data?.[0]?.id);
                })
                .catch((error) => {
                  setFileId("");
                });
            }
          }}
          type="file"
          id="file"
          ref={inputFile}
          style={{ display: "none" }}
        />
        <div>
          {!fileId && (
            <img
              style={{ maxWidth: "80px" }}
              src={placeholderImg}
              className="img-fluid"
              alt="Upload or drag documents"
            />
          )}
        </div>
        {/* {fileId && (
          <img
            src={`https://emgmt.peopledesk.io/emp/Document/DownloadFile?id=${fileId}`}
            alt="Upload"
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              width: "100%",
              height: "100%",
            }}
          ></img>
        )} */}
        {fileId && (
          <div
            className="d-flex align-items-center"
            onClick={() => {
              // dispatch(getDownlloadFileView_Action(imageFile?.id));
            }}
          >
            <AttachmentOutlined
              sx={{ marginRight: "5px", color: "#0072E5" }}
            />
            <div
              style={{
                fontSize: "12px",
                fontWeight: "500",
                color: "#0072E5",
                cursor: "pointer",
              }}
            >
              {fileId}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadField;
