import { IconButton } from "@mui/material";
import React from "react";
import { Modal } from "react-bootstrap";
import crossIcon from "../assets/images/icon/cross.svg";

export default function ViewModal({
  id,
  show,
  onHide,
  size,
  history,
  isShow,
  children,
  title,
  btnText,
  saveBtnText,
  handleSubmit,
  saveBtnRef,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  email,
  body,
  subject,
}) {
  return (
    <div className="viewModal">
      <Modal show={show} onHide={onHide} size={size} backdrop={backdrop} aria-labelledby="example-modal-sizes-title-xl" className={classes} fullscreen={fullscreen && fullscreen}>
        {isVisibleHeading && (
          <Modal.Header className="bg-custom">
            <Modal.Title className="text-center">{title}</Modal.Title>
            <div className="d-flex">
              {handleSubmit && (
                <button
                  onClick={() => {
                    handleSubmit(saveBtnRef && saveBtnRef);
                  }}
                  type="submit"
                  className="btn btn-primary save-btn"
                >
                  {saveBtnText ? saveBtnText : "Save"}
                </button>
              )}

              <div>
                <IconButton type="button" onClick={() => onHide()} className="btn btn-auth-modal-cross">
                  {btnText ? btnText : <img src={crossIcon} alt="iBOS" />}
                </IconButton>
                <> </>
              </div>
            </div>
          </Modal.Header>
        )}

        <Modal.Body id="example-modal-sizes-title-xl">{children}</Modal.Body>
        {/* <Modal.Footer></Modal.Footer> */}
      </Modal>
    </div>
  );
}
