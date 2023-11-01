import React from "react";
import {
  Close, Dns, Edit, Lightbulb, Lock, Phone, Star
} from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { Modal } from "react-bootstrap";
import FormikToggle from "../../../../common/FormikToggle";
import {
  blackColor40, greenColor
} from "./../../../../utility/customColor";

export default function ViewFormComponent({
  singelUser,
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
  orgId,
  buId,
}) {
  //   useEffect(() => {
  //     getPeopleDeskAllLanding("BusinessUnitById", orgId, buId, id, setSingleData);
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [id]);
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
          <>
            {isVisibleHeading && (
              <Modal.Header className="bg-custom">
                <div className="d-flex w-100 justify-content-between align-items-center">
                  <Modal.Title className="text-center">{title}</Modal.Title>
                  <div>
                    <IconButton
                      onClick={() => onHide()}
                    >
                      <Close />
                    </IconButton>
                  </div>
                </div>
              </Modal.Header>
            )}

            <Modal.Body id="example-modal-sizes-title-xl">
              <div className="businessUnitModal">
                <div className="modal-body-type-two">
                  {singelUser && (
                    <>
                      <div className="d-flex align-items-center modal-body-title  py-2">
                        <div className="py-1 px-0">
                          <Avatar
                            alt={"avatar"}
                            src={""}
                            sx={{
                              backgroundColor: "#5BABEF",
                              width: "30px",
                              height: "30px",
                              marginRight:"17px"
                            }}
                          />
                        </div>
                        <div>
                          <h6 className="title-item-name" >
                            {singelUser?.strEmployeeName || "N/A"}
                            [{singelUser?.strEmployeeCode || "N/A"}]
                          </h6>
                          <p className="subtitle-p">
                            {singelUser?.strUserType || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="modal-body-main d-flex align-items-center">
                        <div style={{ marginRight: "17px" }}>
                          <Avatar sx={avatarSx}>
                            <Lightbulb sx={{ color: "#616163" }} />
                          </Avatar>
                        </div>
                        <div>
                          <h6 className="title-item-name">{singelUser?.strLoginId || "N/A"}</h6>
                          <p className="subtitle-p" >User Id</p>
                        </div>
                      </div>
                      <div className="modal-body-main d-flex align-items-center">
                        <div style={{ marginRight: "17px" }}>
                          <Avatar sx={avatarSx}>
                            <Lock sx={{ color: "#616163" }} />
                          </Avatar>
                        </div>
                        <div>
                          <h6 className="title-item-name">******</h6>
                          <p className="subtitle-p" >Password</p>
                        </div>
                      </div>
                      <div className="modal-body-main d-flex align-items-center">
                        <div style={{ marginRight: "17px" }}>
                          <Avatar sx={avatarSx}>
                            <Dns sx={{ color: "#616163" }} />
                          </Avatar>
                        </div>
                        <div>
                          <h6 className="title-item-name">{singelUser?.strOfficeMail || "N/A"}</h6>
                          <p className="subtitle-p">Email</p>
                        </div>
                      </div>
                      <div className="modal-body-main d-flex align-items-center">
                        <div style={{ marginRight: "17px" }}>
                          <Avatar sx={avatarSx}>
                            <Phone sx={{ color: "#616163" }} />
                          </Avatar>
                        </div>
                        <div>
                          <h6 className="title-item-name">{singelUser?.strPersonalMobile || "N/A"}</h6>
                          <p className="subtitle-p" >Contact No</p>
                        </div>
                      </div>
                      {/* <div className="modal-body-main d-flex align-items-center">
                        <div style={{ marginRight: "17px" }}>
                          <Avatar sx={avatarSx}>
                            <Grass sx={{ color: "#616163" }} />
                          </Avatar>
                        </div>
                        <div>
                          <h6 className="title-item-name">{singelUser?.strCountry}</h6>
                          <p className="subtitle-p" >Country</p>
                        </div>
                      </div> */}
                      <div className="modal-body-main  d-flex align-items-center">
                        <div style={{ marginRight: "17px" }}>
                          <Avatar sx={avatarSx}>
                            <Star sx={{ color: "#616163" }} />
                          </Avatar>
                        </div>
                        <div>
                          <h6 className="title-item-name">
                            <FormikToggle
                              color={
                                singelUser?.userStatus ? greenColor : blackColor40
                              }
                              checked={singelUser?.userStatus}
                            />
                          </h6>
                          <p className="subtitle-p" >Activation</p>
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

              {/* <button
                className="modal-btn modal-btn-edit"
                onClick={() => onHide()}
              >
                Close
              </button> */}

            </Modal.Footer>
          </>
        </Modal>
      </div>
    </>
  );
}
