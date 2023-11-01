/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowBack } from "@mui/icons-material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EditIcon from "@mui/icons-material/Edit";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MessageIcon from "@mui/icons-material/Message";
import PushPinIcon from "@mui/icons-material/PushPin";
import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AvatarComponent from "../../../../../common/AvatarComponent";
import Loading from "../../../../../common/loading/Loading";
import PrimaryButton from "../../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../../commonRedux/reduxForLocalStorage/actions";
import "./singleCardTask.css";

const initData = {};

export default function TMProjectTaskBoardCard() {
  // eslint-disable-next-line no-unused-vars
  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Task Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const chatList = [];
  const [reaplyButton, setReaplyButton] = useState(false);
  const saveHandler = (values) => {};
  // eslint-disable-next-line no-unused-vars

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="table-card">
                <div className="table-card-heading heading pt-0">
                  <div
                    className=""
                    style={{
                      borderRadius: "100px",
                      background: "transparent",
                      cursor: "pointer",
                      backgroundColor: "#F2F2F7",
                      width: "25px",
                      height: "25px",
                      justifyContent: "center",
                    }}
                  >
                    <Tooltip title="Back">
                      <ArrowBack
                        onClick={() => history.goBack()}
                        sx={{
                          fontSize: "16px",
                          marginLeft: "4px",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </div>
                  <div className="table-card-head-right"></div>
                </div>
                <div
                  className="row body-content"
                  style={{
                    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                    marginTop: "10px",
                    paddingTop: "10px",
                  }}
                >
                  <div
                    className="col-lg-8 body-left"
                    style={{ borderRight: "1px solid rgba(0, 0, 0, 0.12)" }}
                  >
                    <div className="row">
                      <div className="col-lg-12 ">
                        <div className="d-flex align-items-flex-start">
                          <FeaturedPlayListIcon style={{ color: "#5C6369" }} />
                          <div>
                            <h6
                              style={{
                                marginLeft: "10px",
                                fontWeight: "500",
                                fontSize: "18px",
                                lineHeight: "23px",
                                color: "#5C6369",
                              }}
                            >
                              Requirement Gathering
                            </h6>
                            <p
                              style={{
                                fontWeight: "400",
                                fontSize: "14px",
                                lineHeight: "19px",
                                color: "#777777",
                                marginTop: "5px",
                                marginLeft: "10px",
                              }}
                            >
                              Todo
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mt-4">
                          <MessageIcon style={{ color: "#5C6369" }} />
                          <h6
                            style={{
                              marginLeft: "10px",
                              fontWeight: "500",
                              fontSize: "18px",
                              lineHeight: "23px",
                              color: "#5C6369",
                            }}
                          >
                            Activity
                          </h6>
                        </div>
                        <div
                          className="input-filed-main mt-4 editorIcon"
                          style={{
                            display:
                              reaplyButton || chatList?.length
                                ? "block"
                                : "none",
                          }}
                        >
                          <ReactQuill
                          //   value={values?.body}
                          //   onChange={(value) => setFieldValue("body", value)}
                          />
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                            }}
                          >
                            <div
                              style={{
                                paddingRight: "15px",
                                paddingBottom: "5px",
                              }}
                            >
                              <TextFieldsIcon
                                className="customColorEditorIcon"
                                onClick={(e) => {}}
                              />
                              <AlternateEmailIcon
                                className="customColorEditorIcon"
                                onClick={(e) => {}}
                              />
                              <InsertEmoticonIcon
                                className="customColorEditorIcon"
                                onClick={(e) => {}}
                              />
                              <AttachFileIcon
                                className="customColorEditorIcon"
                                onClick={(e) => {}}
                              />
                              <SendIcon
                                className="customColorEditorIcon"
                                onClick={(e) => {}}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-flex-start mt-3">
                          <AvatarComponent letterCount={1} label={"A"} />
                          <div
                            style={{
                              marginLeft: "5px",
                              width: "100%",
                              minHeight: "100px",
                              backgroundColor: "#F8F8F8",
                              borderRadius: "15px",
                            }}
                          >
                            <p
                              style={{
                                fontWeight: "500",
                                fontSize: "14px",
                                lineHeight: "23px",
                                color: "#5C6369",
                                padding: "10px",
                              }}
                            >
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Justo, aenean sed nec sagittis, morbi
                              facilisi. Viverra ac ipsum turpis sodales.
                              Placerat eros auctor interdum ipsum in et mattis
                              lacinia. Arcu risus, purus, purus mi quis elit.
                            </p>
                          </div>
                        </div>
                        <div
                          className="d-flex justify-content-between"
                          style={{ marginLeft: "40px" }}
                        >
                          <div className="d-flex">
                            <PrimaryButton
                              type="button"
                              className="btn flex-center"
                              label={"Edit"}
                              icon={
                                <EditIcon
                                  sx={{ marginRight: "10px", fontSize: "18px" }}
                                />
                              }
                              onClick={() => {}}
                            />
                            <PrimaryButton
                              type="button"
                              className="btn flex-center me-2"
                              label={"Reply"}
                              icon={
                                <ReplyIcon
                                  sx={{ marginRight: "10px", fontSize: "18px" }}
                                />
                              }
                              onClick={() => {
                                setReaplyButton(!reaplyButton);
                              }}
                            />
                            <PrimaryButton
                              type="button"
                              className="btn flex-center me-2"
                              label={"Important"}
                              icon={
                                <PushPinIcon
                                  sx={{ marginRight: "10px", fontSize: "18px" }}
                                />
                              }
                              onClick={() => {}}
                            />
                          </div>
                          <p
                            style={{
                              fontWeight: "400",
                              fontSize: "12px",
                              lineHeight: "19px",
                              color: "#777777",
                              marginTop: "10px",
                            }}
                          >
                            Feb16, 2022
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="d-flex align-items-flex-start">
                      <PushPinIcon style={{ color: "#5C6369" }} />
                      <div>
                        <h6
                          style={{
                            marginLeft: "10px",
                            fontWeight: "500",
                            fontSize: "18px",
                            lineHeight: "23px",
                            color: "#5C6369",
                          }}
                        >
                          Important
                        </h6>
                        <p
                          style={{
                            fontWeight: "400",
                            fontSize: "14px",
                            lineHeight: "19px",
                            color: "#777777",
                            marginTop: "5px",
                            marginLeft: "10px",
                          }}
                        >
                          No important text available
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
