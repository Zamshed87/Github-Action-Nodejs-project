import {
  Close,
  Edit,
  Language,
  Layers,
  Lightbulb,
  Star
} from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import FormikToggle from "../../../../common/FormikToggle";
import { blackColor80, greenColor } from "./../../../../utility/customColor";

const initData = {};
const validationSchema = Yup.object().shape({});

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
  handleOpen,
  orgId,
  buId,
  singleData,
  setSingleData,
}) {
  const saveHandler = (values, cb) => {};

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
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
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
                <Form>
                  {isVisibleHeading && (
                    <Modal.Header className="bg-custom">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <Modal.Title className="text-center">
                          {title}
                        </Modal.Title>
                        <IconButton
                          onClick={() => {
                            onHide();
                            setSingleData("");
                          }}
                        >
                          <div>
                            <Close />
                          </div>
                        </IconButton>
                      </div>
                    </Modal.Header>
                  )}

                  <Modal.Body id="example-modal-sizes-title-xl">
                    <div className="businessUnitModal">
                      <div className="modal-body-type-two">
                        {singleData?.strDepartment && (
                          <>
                            <div className="modal-body-top d-flex align-items-center">
                              <div style={{ marginRight: "17px" }}>
                                <Avatar sx={avatarSx}>
                                  <Layers sx={{ color: "#616163" }} />
                                </Avatar>
                              </div>
                              <div className="modal-body-txt">
                                <h6 className="title-item-name">
                                  {singleData?.strDepartment}
                                </h6>
                                <p className="subtitle-p">
                                  {"Department Name"}
                                </p>
                              </div>
                            </div>
                            <div className="modal-body-main d-flex align-items-center">
                              <div style={{ marginRight: "17px" }}>
                                <Avatar sx={avatarSx}>
                                  <Language sx={{ color: "#616163" }} />
                                </Avatar>
                              </div>
                              <div>
                                <h6 className="title-item-name">
                                  {singleData?.strDepartmentCode}
                                </h6>
                                <p className="subtitle-p">{"Code"}</p>
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
                                  {singleData?.strBusinessUnit}
                                </h6>
                                <p className="subtitle-p">
                                  {singleData?.strDepartmentCode}
                                </p>
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
                                    singleData?.isActive
                                      ? greenColor
                                      : blackColor80
                                  }
                                  checked={singleData?.isActive}
                                />
                                <p className="subtitle-p">{"Activation"}</p>
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

                    {/* <button className="btn btn-cancel" onClick={() => {
                      onHide();
                      setSingleData("");
                    }}>
                      Close
                    </button> */}
                  </Modal.Footer>
                </Form>
              </Modal>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
