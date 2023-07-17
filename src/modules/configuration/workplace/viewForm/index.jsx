import {
  BusinessCenter,
  Close,
  DnsOutlined,
  Edit,
  Layers,
  Lightbulb,
  Star
} from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import FormikToggle from "../../../../common/FormikToggle";
import { getWorkplaceById } from "../helper";
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
  singleData,
  setSingleData,
  handleOpen,
}) {
  const saveHandler = (values, cb) => {};

  useEffect(() => {
    if (id) {
      getWorkplaceById(id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
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
                        <div>
                          <IconButton onClick={() => onHide()}>
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
                                  {singleData?.strWorkplace}
                                </h6>
                                <p className="subtitle-p">{"Workplace"}</p>
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
                                  {singleData?.strWorkplaceCode}
                                </h6>
                                <p className="subtitle-p">Code</p>
                              </div>
                            </div>
                            <div className="modal-body-main d-flex align-items-center">
                              <div style={{ marginRight: "17px" }}>
                                <Avatar sx={avatarSx}>
                                  <DnsOutlined sx={{ color: "#616163" }} />
                                </Avatar>
                              </div>
                              <div>
                                <h6 className="title-item-name">
                                  {singleData?.strWorkplaceGroup}
                                </h6>
                                <p className="subtitle-p">Workplace Group</p>
                              </div>
                            </div>
                            <div className="modal-body-main d-flex align-items-center">
                              <div style={{ marginRight: "17px" }}>
                                <Avatar sx={avatarSx}>
                                  <BusinessCenter sx={{ color: "#616163" }} />
                                </Avatar>
                              </div>
                              <div>
                                <h6 className="title-item-name">
                                  {singleData?.strBusinessUnit}
                                </h6>
                                <p className="subtitle-p">Business Unit</p>
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
                                      singleData?.isActive
                                        ? greenColor
                                        : blackColor80
                                    }
                                    checked={singleData?.isActive}
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
                  <Modal.Footer className="view-modal-footer">
                    <button
                      className="modal-btn modal-btn-edit"
                      startIcon={<Edit />}
                      onClick={() => {
                        handleOpen();
                        onHide();
                      }}
                    >
                      <Edit sx={{ marginRight: "10px", fontSize: "16px" }} />
                      Edit
                    </button>

                    {/* <button
                        className="btn btn-cancel"
                      onClick={() => onHide()}
                    >
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
