import { Close, Edit, Star } from "@mui/icons-material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import EmailIcon from "@mui/icons-material/Email";
import LayersIcon from "@mui/icons-material/Layers";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Avatar } from "@mui/material";
import React from "react";
import { Modal } from "react-bootstrap";
import FormikToggle from "../../../../common/FormikToggle";
import { blackColor80, greenColor } from "./../../../../utility/customColor";

export default function ViewFormComponent({
  id,
  show,
  onHide,
  size,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  singleData,
  setSingleData,
  handleOpen,
}) {

  const avatarSx = {
    background: '#F2F2F7',
    "&": {
      height: "30px",
      width: "30px",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "16px"
    }
  }
  return (
    <>
      <div className="viewModal">
        <Modal
          show={show}
          onHide={onHide}
          size={size}
          backdrop={backdrop}
          aria-labelledby="example-modal-sizes-title-xl"
          className={classes}
          fullscreen={fullscreen && fullscreen}
        >
          {isVisibleHeading && (
            <Modal.Header className="bg-custom">
              <div className="d-flex w-100 justify-content-between">
                <Modal.Title className="text-center">{title}</Modal.Title>
                <div>
                  <div
                    className="crossIcon"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      onHide();
                      setSingleData("");
                    }}
                  >
                    <Close />
                  </div>
                </div>
              </div>
            </Modal.Header>
          )}

          <Modal.Body id="example-modal-sizes-title-xl">
            <div className="businessUnitModal">
              <div className="modal-body-type-two">
                {singleData?.SBUName && (
                  <>
                    <div className="modal-body-top d-flex">
                      <div style={{ marginRight: "17px" }}>
                        <Avatar sx={avatarSx}>
                          <LayersIcon sx={{ color: "#616163" }} />
                        </Avatar>
                      </div>
                      <div className="modal-body-txt">
                        <h6 className="title-item-name">{singleData?.SBUName}</h6>
                        <p className="subtitle-p">{"SBU"}</p>
                      </div>
                    </div>
                    <div className="modal-body-main d-flex align-items-center">
                      <div style={{ marginRight: "17px" }}>
                        <Avatar sx={avatarSx}>
                          <LocationOnIcon sx={{ color: "#616163" }} />
                        </Avatar>
                      </div>
                      <div>
                        <h6 className="title-item-name">{singleData?.SBUAddress}</h6>
                        <p className="subtitle-p">Address</p>
                      </div>
                    </div>
                    <div className="modal-body-main d-flex align-items-center">
                      <div style={{ marginRight: "17px" }}>
                        <Avatar sx={avatarSx}>
                          <Star sx={{ color: "#616163" }} />
                        </Avatar>
                      </div>
                      <div>
                        <h6 className="title-item-name">
                          <FormikToggle
                            color={
                              singleData?.Status
                                ? greenColor
                                : blackColor80
                            }
                            checked={singleData?.Status}
                          />
                        </h6>
                        <p className="subtitle-p">Activation</p>
                      </div>
                    </div>
                    <div className="modal-body-main d-flex align-items-center">
                      <div style={{ marginRight: "17px" }}>
                        <Avatar sx={avatarSx}>
                          <EmailIcon sx={{ color: "#616163" }} />
                        </Avatar>
                      </div>
                      <div>
                        <h6 className="title-item-name">{singleData?.Email}</h6>
                        <p className="subtitle-p">Email</p>
                      </div>
                    </div>
                    <div className="modal-body-main d-flex align-items-center">
                      <div style={{ marginRight: "17px" }}>
                        <Avatar sx={avatarSx}>
                          <LightbulbIcon sx={{ color: "#616163" }} />
                        </Avatar>
                      </div>
                      <div>
                        <h6 className="title-item-name">{singleData?.SBUCode}</h6>
                        <p className="subtitle-p">Code</p>
                      </div>
                    </div>
                    <div className="modal-body-main d-flex align-items-center">
                      <div style={{ marginRight: "17px" }}>
                        <Avatar sx={avatarSx}>
                          <BusinessCenterIcon sx={{ color: "#616163" }} />
                        </Avatar>
                      </div>
                      <div>
                        <h6 className="title-item-name">{singleData?.BusinessUnitName}</h6>
                        <p className="subtitle-p">Business Unit</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="view-modal-footer">

            <button
              className="modal-btn modal-btn-edit"
              onClick={() => {
                handleOpen();
                onHide();
              }}

            >
              <Edit sx={{ marginRight: "10px", fontSize: "16px" }} />
              Edit
            </button>

            <button
              className="modal-btn modal-btn-edit"
              onClick={() => {
                onHide()
                setSingleData("")
              }}
            >
              Close
            </button>

          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
