import axios from "axios";
// import PDFViewer from "mgr-pdf-viewer-react";
import DownloadIcon from "@mui/icons-material/Download";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { gray900 } from "../utility/customColor";
import { setDownlloadFileViewEmpty } from "./../commonRedux/auth/actions";
import SpinnerComponent from "./SpinnerComponent";
import PDFViewer from "./pdf-view/PDFViewe";

const AttachmentViewer = ({ isShow, btnTex, backdrop, classes, btnText }) => {
  const imageView = useSelector((state) => {
    return state?.auth?.imageView;
  }, shallowEqual);
  const dispatch = useDispatch();

  const download = (cb) => {
    axios({
      url: imageView?.url,
      method: "GET",
      responseType: "blob", // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileExtension = imageView?.type.split("/")[1];
      link.setAttribute("download", `Ibos.${fileExtension}`);
      cb?.();
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <>
      <div className="viewModal">
        <Modal
          show={imageView?.model}
          onHide={() => {
            dispatch(setDownlloadFileViewEmpty());
          }}
          size="xl"
          aria-labelledby="example-modal-sizes-title-xl"
          dialogClassName=""
          style={{ zIndex: 99999999 }}
          backdrop="static"
          className="default-modal creat-job-modal"
        >
          {isShow ? (
            <SpinnerComponent isShow={isShow} />
          ) : (
            <>
              <Modal.Header className="bg-custom d-flex align-items-center">
                <Modal.Title className="text-center">
                  <span
                    style={{
                      fontSize: "20px",
                    }}
                  >
                    Attachment View
                  </span>
                </Modal.Title>
                <div className="d-flex align-items-center">
                  <span className="pr-4 pointer" onClick={() => download()}>
                    <DownloadIcon sx={{ color: gray900 }} />
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(setDownlloadFileViewEmpty());
                    }}
                    className="btn btn-cancel"
                  >
                    {btnText ? btnText : "Cancel"}
                  </button>
                </div>
              </Modal.Header>

              <Modal.Body id="example-modal-sizes-title-xl">
                <div style={{ border: "1px solid #cccccc61" }}>
                  <div></div>
                  <div>
                    {imageView?.type === "application/pdf" ? (
                      // <PDFViewer
                      //   document={{
                      //     url: imageView?.url,
                      //   }}
                      // />

                      <PDFViewer pdfUrl={imageView?.url} />
                    ) : (
                      <img
                        src={imageView?.url}
                        alt=""
                        style={{ width: "100%" }}
                      />
                    )}
                  </div>
                </div>
              </Modal.Body>
            </>
          )}
        </Modal>
      </div>
    </>
  );
};

export default AttachmentViewer;
