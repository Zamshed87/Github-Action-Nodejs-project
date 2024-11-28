import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Loading from "./loading/Loading";

export default function ImageViewer({
  show,
  onHide,
  image,
  isShow,
  title,
  btnText,
  modelSize,
  isModalFooterActive = true,
  dialogClassName,
}) {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    // setShow(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="viewModal">
      <Modal
        show={show}
        onHide={onHide}
        size={modelSize ? modelSize : "xl"}
        aria-labelledby="example-modal-sizes-title-xl"
        dialogClassName={dialogClassName}
      >
        {isLoading && <Loading />}

        <>
          {" "}
          <Modal.Header className="bg-custom ">
            <Modal.Title className="text-center">{title}</Modal.Title>
          </Modal.Header>
          {/* <p style={{ borderBottom: "1px solid gray" }} className="my-1"></p> */}
          <Modal.Body id="example-modal-sizes-title-xl">
            <div style={{ border: "1px solid #cccccc61" }}>
              <div>
                <img src={image} alt="" style={{ width: "100%" }} />
              </div>
            </div>
          </Modal.Body>
          {isModalFooterActive && (
            <Modal.Footer>
              <div>
                <button
                  type="button"
                  onClick={() => onHide()}
                  className="btn btn-light btn-elevate"
                >
                  {btnText ? btnText : "Close"}
                </button>
                <> </>
              </div>
            </Modal.Footer>
          )}
        </>
      </Modal>
    </div>
  );
}
