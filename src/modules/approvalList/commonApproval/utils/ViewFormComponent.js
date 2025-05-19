import { Attachment, Close } from "@mui/icons-material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import ChromeReaderModeOutlinedIcon from "@mui/icons-material/ChromeReaderModeOutlined";
import { Avatar, IconButton } from "@mui/material";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import DemoImg from "../../../../../src/assets/images/bigDemo.png";
import Loading from "common/loading/Loading";
import { useState } from "react";

export default function ViewFormComponent({ objProps }) {
  const {
    show,
    title,
    onHide,
    size,
    backdrop,
    classes,
    viewData,
    setViewData,
    isVisibleHeading = true,
    fullscreen = false,
  } = objProps;

  var LogoURL = "";
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

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <Loading />}
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
                    className="crossIcon"
                    onClick={() => {
                      onHide();
                      setViewData("");
                    }}
                  >
                    <Close />
                  </IconButton>
                </div>
              </div>
            </Modal.Header>
          )}

          <Modal.Body id="example-modal-sizes-title-xl">
            <div className="">
              <div className="modal-body-type-two">
                <>
                  <div className="modal-body-top d-flex">
                    <div className="employeeInfo d-flex align-items-center">
                      {LogoURL ? (
                        <img
                          src={`https://emgmt.peopledesk.io/emp/Document/DownloadFile?id=${LogoURL}`}
                          alt="icon"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <img
                          src={DemoImg}
                          alt="icon"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "contain",
                          }}
                        />
                      )}
                      <div className="ml-3">
                        <h6 className="title-item-name">
                          {viewData?.employeeName}
                        </h6>
                        <p className="subtitle-p">
                          {viewData?.designation},{viewData?.employeeTypeName}
                        </p>
                        <p className="subtitle-p">{viewData?.designation}</p>
                      </div>
                    </div>
                  </div>
                  <div className="modal-body-main d-flex align-items-center">
                    <div style={{ marginRight: "17px" }}>
                      <Avatar sx={avatarSx}>
                        <AttachFileOutlinedIcon sx={{ color: "#616163" }} />
                      </Avatar>
                    </div>
                    <div>
                      <h6
                        className="title-item-name"
                        onClick={() => {
                          if (viewData?.documentId) {
                            dispatch(
                              getDownlloadFileView_Action(
                                viewData.documentId,
                                "",
                                "",
                                setLoading
                              )
                            );
                          }
                        }}
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color: viewData?.documentId ? "#0072E5" : "#A0A0A0",
                          cursor: viewData?.documentId
                            ? "pointer"
                            : "not-allowed",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        {viewData?.documentId ? (
                          <>
                            <Attachment style={{ fontSize: "20px" }} />
                            {`Attachment`}
                          </>
                        ) : (
                          "No attachment"
                        )}
                      </h6>

                      <p className="subtitle-p">Attachment</p>
                    </div>
                  </div>
                  <div className="modal-body-main d-flex align-items-center">
                    <div style={{ marginRight: "17px" }}>
                      <Avatar sx={avatarSx}>
                        <ArticleOutlinedIcon sx={{ color: "#616163" }} />
                      </Avatar>
                    </div>
                    <div>
                      <h6 className="title-item-name">{viewData?.status}</h6>
                      <p className="subtitle-p">Status</p>
                    </div>
                  </div>
                  <div className="modal-body-main d-flex align-items-center">
                    <div style={{ marginRight: "17px" }}>
                      <Avatar sx={avatarSx}>
                        <ChromeReaderModeOutlinedIcon
                          sx={{ color: "#616163" }}
                        />
                      </Avatar>
                    </div>
                    <div>
                      <small
                        className="subtitle-p"
                        dangerouslySetInnerHTML={{
                          __html: viewData?.reason,
                        }}
                      />
                    </div>
                  </div>
                </>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="view-modal-footer">
            <button
              className="btn btn-cancel"
              onClick={() => {
                onHide();
                setViewData("");
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
