import React from "react";
import uploadImageCircle from "../assets/images/uploadImagecircle.png";
import uploadText from "../assets/images/uploadImage.png";
import camera from "../assets/images/camera.png";

const ImageUploadView = ({ setOpen, uploadImageId, singleDataImageId }) => {
  //image view ;
  const imageUpload = (uploadImageId, singleDataImageId) => {
    if (uploadImageId) {
      return `https://emgmt.peopledesk.io/recruitment/Document/DownloadFile?id=${uploadImageId}`;
    } else if (singleDataImageId) {
      return `https://emgmt.peopledesk.io/recruitment/Document/DownloadFile?id=${singleDataImageId}`;
    } else {
      return uploadText;
    }
  };

  return (
    <span
      onClick={() => setOpen(true)}
      style={{ cursor: "pointer", position: "relative", zIndex: 99999999 }}
    >
      <img
        style={{ width: "176px", height: "176px", zIndex: 99999999 }}
        src={uploadImageCircle}
        className="img-fluid"
        alt="Upload Image Circle"
      />
      <img
        style={{ position: "absolute", right: "-21px", top: "24px" }}
        src={camera}
        className="img-fluid"
        alt="Camera"
      />
      <img
        style={{
          position: "absolute",
          top: "50%",
          right: "50%",
          transform: "translate(50%, -50%)",
          width: "100px",
          height: "100px",
          zIndex: -99999999,
        }}
        className={`$img-fluid`}
        src={imageUpload(uploadImageId, singleDataImageId)}
        alt=""
      />
    </span>
  );
};

export default ImageUploadView;
