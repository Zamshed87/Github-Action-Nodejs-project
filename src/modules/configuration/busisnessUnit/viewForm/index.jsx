import {
  Close,
  Edit,
  Email,
  Lightbulb,
  MonetizationOn,
  Star,
} from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { APIUrl } from "../../../../App";
import DemoImg from "../../../../assets/images/bigDemo.png";
import FormikToggle from "../../../../common/FormikToggle";
import {
  blackColor80,
  blueColor,
  greenColor,
} from "./../../../../utility/customColor";
import { getBusinessUnitById } from "../helper";

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
  businessUnitId,
  setBusinessUnitId,
  handleOpen,
  orgId,
  buId,
  setImageFile,
}) {
  const avatarSx = {
    background: "#F2F2F7",
    "&": {
      height: "30px",
      width: "30px",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "16px",
    },
  };
  const [singleData, setSingleData] = useState("");
  const [, setLoading] = useState(false);

  useEffect(() => {
    if (businessUnitId) {
      getBusinessUnitById({
        businessUnitId,
        setter: setSingleData,
        setLoading,
      });
    }
  }, [businessUnitId]);
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
                      onClick={() => {
                        onHide();
                        setImageFile("");
                        setSingleData("");
                      }}
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
                  {singleData?.strBusinessUnit && (
                    <>
                      <div className="modal-body-top d-flex align-items-center">
                        <div className="modal-company-img">
                          {singleData?.strLogoUrlId ? (
                            <img
                              src={`${APIUrl}/Document/DownloadFile?id=${singleData?.strLogoUrlId}`}
                              alt="icon"
                            />
                          ) : (
                            <img src={DemoImg} alt="icon" />
                          )}
                        </div>
                        <div className="modal-subContent">
                          <h6 className="title-item-name">
                            {singleData?.strBusinessUnit}
                          </h6>
                          <a
                            className="link-company-web"
                            href={`${singleData?.strWebsiteUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              textTransform: "lowercase",
                              color: blueColor,
                            }}
                          >
                            {singleData?.strWebsiteUrl}
                          </a>
                          <span className="subtitle-span">
                            {singleData?.strAddress}
                          </span>
                          <br />
                          <span className="subtitle-span">
                            {singleData?.strDistrict}
                          </span>
                        </div>
                      </div>
                      <div className="modal-body-main d-flex align-items-center">
                        <div style={{ marginRight: "17px" }}>
                          <Avatar sx={avatarSx}>
                            <Star sx={{ color: "#616163" }} />
                          </Avatar>
                        </div>
                        <div>
                          <FormikToggle
                            color={
                              singleData?.isActive ? greenColor : blackColor80
                            }
                            checked={singleData?.isActive}
                          />

                          <p className="subtitle-p" style={{ display: "flex" }}>
                            Activation
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
                          <h6 className="title-item-name">
                            {singleData?.strShortCode}
                          </h6>
                          <span className="subtitle-span">Code</span>
                        </div>
                      </div>
                      <div className="modal-body-main d-flex align-items-center">
                        <div
                          className="modal-avater"
                          style={{ marginRight: "17px" }}
                        >
                          <Avatar sx={avatarSx}>
                            <MonetizationOn sx={{ color: "#616163" }} />
                          </Avatar>
                        </div>
                        <div>
                          <h6 className="title-item-name">
                            {singleData?.strCurrency}
                          </h6>
                          <span className="subtitle-span">Base Currency</span>
                        </div>
                      </div>
                      <div className="modal-body-main d-flex align-items-center">
                        <div style={{ marginRight: "17px" }}>
                          <Avatar sx={avatarSx}>
                            <Email sx={{ color: "#616163" }} />
                          </Avatar>
                        </div>
                        <div>
                          <h6 className="title-item-name">
                            {singleData?.strEmail}
                          </h6>
                          <span className="subtitle-span">Email</span>
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
                  onHide();
                  setBusinessUnitId(singleData?.intBusinessUnitId);
                  setImageFile(singleData?.strLogoUrlId);
                  handleOpen();
                }}
              >
                <Edit sx={{ marginRight: "10px", fontSize: "16px" }} />
                Edit
              </button>

              {/* <button
              className="btn btn-cancel"
                onClick={() => {
                  onHide();
                  setImageFile("");
                  setSingleData("");
                  setBusinessUnitId(null);
                }}
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
