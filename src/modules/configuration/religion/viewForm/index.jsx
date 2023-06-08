import { Close, Layers, Lightbulb, Star } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import FormikToggle from "../../../../common/FormikToggle";
import { blackColor40, greenColor } from "./../../../../utility/customColor";

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
  setAllData,
  allData,
  // setLoading,
  singleData,
  setSingleData,
  handleOpen,
}) {

  useEffect(() => {
    const filterData = allData?.filter((item) => item.intReligionId === id);
    setSingleData(filterData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
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
                {singleData && (
                  <>
                    <div className="modal-body-top d-flex align-items-center">
                      <div style={{ marginRight: "17px" }}>
                        <Avatar sx={avatarSx}>
                          <Layers sx={{ color: "#616163" }} />
                        </Avatar>
                      </div>
                      <div className="modal-body-txt">
                        <h6 className="title-item-name">
                          {singleData[0]?.strReligion}
                        </h6>
                        <p className="subtitle-p">{"Religion Name"}</p>
                      </div>
                    </div>
                    <div className="modal-body-main d-flex align-items-center">
                      <div style={{ marginRight: "17px" }}>
                        <Avatar sx={avatarSx}>
                          <Lightbulb sx={{ color: "#616163" }} />
                        </Avatar>
                      </div>
                      <div className="modal-body-txt">
                        <h6 className="title-item-name">
                          {singleData[0]?.strReligionCode}
                        </h6>
                        <p className="subtitle-p">{"Code"}</p>
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
                              singleData[0]?.isActive ? greenColor : blackColor40
                            }
                            checked={singleData[0]?.isActive}
                          />
                        </h6>
                        <p className="subtitle-p">Activation</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="form-modal-footer">
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => {
                  onHide()
                }}
              >
                Close
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
