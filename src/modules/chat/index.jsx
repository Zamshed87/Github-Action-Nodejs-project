/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowBack, SearchOutlined } from "@mui/icons-material";
import CallIcon from "@mui/icons-material/Call";
import NearMeIcon from "@mui/icons-material/NearMe";
import VideocamIcon from "@mui/icons-material/Videocam";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FormikInput from "../../common/FormikInput";
import "./chat.css";
import { getUsersList } from "./helper";
// import { ChatAppSocket } from "../../router/basePage";
import Loading from "../../common/loading/Loading";
import {
  setMessageInfoAction,
  setSelectedUserAction
} from "../../commonRedux/auth/actions";
import Profile from "./Profile.jsx";

const initData = {
  search: "",
  message: "",
};

const Chat = () => {
  const history = useHistory();
  const {
    orgId,
    userAutoId,
    strLoginId,
    strDisplayName,
    strProfileImageUrl,
    designationName,
  } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  const { messageInfo, selectedUser } = useSelector(
    (state) => state?.auth,
    shallowEqual
  );

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    if (messagesEndRef?.current?.scrollIntoView) {
      messagesEndRef.current.scrollIntoView();
    }
  };

  const getUser = () => {
    getUsersList(setLoading, setUser, orgId);
  };

  useEffect(() => {
    getUser();
    return () => {
      dispatch(setSelectedUserAction(""));
      dispatch(setMessageInfoAction(""));
    };
  }, []);

  useEffect(() => {
    // if (selectedUser?.intUserId) {
    //   getAllMessageListAction(
    //     setLoading,
    //     setMessageList,
    //     orgId,
    //     userAutoId,
    //     +selectedUser?.intUserId,
    //     scrollToBottom
    //   );
    // }
  }, [selectedUser]);

  const saveHandler = (values, cb) => {
    if (!values?.message) return null;
    // ChatAppSocket.emit("messageSending", {
    //   ownerId: userAutoId,
    //   receiverId: +selectedUser?.intUserId,
    //   message: values?.message,
    //   from: {
    //     strUserName: strDisplayName,
    //     strLoginId: strLoginId,
    //     strDesignationName: designationName,
    //     strProfileImageUrl: strProfileImageUrl,
    //     intUserId: `${userAutoId}`,
    //   },
    // });
    cb();
  };

  // useEffect(() => {
  //   if (user.length > 0) {
  //     let data = [...user];
  //     // let newUser = data.filter(item => item?.strLoginId === strLoginId)
  //     let newData = data.map((item) => ({
  //       ...item,
  //       isOnline:
  //         item?.strLoginId === newUser?.strLoginId ? newUser?.isOnline : false,
  //     }));
  //     setUser(newData);
  //   }
  // }, [newUser]);

  useEffect(() => {
    // if (
    //   +messageInfo?.intFromUserId === +selectedUser?.intUserId ||
    //   +messageInfo?.intToUserId === +selectedUser?.intUserId
    // ) {
    //   const newMessageList = [...messageList];
    //   newMessageList.shift();
    //   newMessageList.push(messageInfo);
    //   setMessageList(newMessageList);
    //   setTimeout(() => scrollToBottom(), 50);
    // }
  }, [messageInfo]);

  return (
    <>
      <Formik
        enableReinitialize={false}
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
              <div className="chat-head">
                <ArrowBack
                  sx={{ color: "rgba(0, 0, 0, 0.7)", cursor: "pointer" }}
                  onClick={() => history.goBack()}
                />
              </div>
              <div className="container chat-wrapper">
                <div className="row chat-header">
                  <div
                    className="col-3"
                    style={{ borderRight: "1px solid rgba(0, 0, 0, 0.08)" }}
                  >
                    <div className="chat-heading">Chat</div>
                  </div>
                  <div className="col-9">
                    {selectedUser?.strDisplayName && (
                      <div className="d-flex justify-content-between align-items-center h-100">
                        <div>
                          <Profile
                            obj={{
                              image: selectedUser?.strProfileImageUrl,
                              title: selectedUser?.strDisplayName,
                              designation: selectedUser?.strDesignationName,
                            }}
                          />
                        </div>
                        <div className="chat-call">
                          <CallIcon
                            sx={{
                              color: "rgba(0, 0, 0, 0.6)",
                              marginRight: "30px",
                              opacity: 0,
                            }}
                          />
                          <VideocamIcon
                            sx={{ color: "rgba(0, 0, 0, 0.6)", opacity: 0 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="row chat-body">
                  <div
                    className="col-3 p-0"
                    style={{ borderRight: " 1px solid rgba(0, 0, 0, 0.08)" }}
                  >
                    <div className="search-wrapper">
                      <FormikInput
                        classes="search-input fixed-width chat-search"
                        inputClasses="search-inner-input"
                        placeholder="Search"
                        value={values?.search}
                        name="search"
                        type="text"
                        trailicon={
                          <SearchOutlined
                            sx={{ color: "#323232", fontSize: "18px" }}
                          />
                        }
                        onChange={(e) => {
                          setFieldValue("search", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="employee-list">
                      {user?.length > 0 &&
                        user.map(
                          (item) =>
                            item?.strLoginId !== strLoginId && (
                              <div
                                key={item?.strLoginId}
                                onClick={(e) => {
                                  setMessageList([]);
                                  dispatch(setSelectedUserAction(item));
                                  // getAllMessageListAction(
                                  //   setLoading,
                                  //   setMessageList,
                                  //   orgId,
                                  //   userAutoId,
                                  //   +item?.intUserId,
                                  //   scrollToBottom
                                  // );
                                  // updateSeenMessageAction(
                                  //   userAutoId,
                                  //   +item?.intUserId,
                                  //   getUser
                                  // );
                                }}
                                className={`profile-info ${
                                  item?.strLoginId ===
                                    selectedUser?.strLoginId && "active"
                                }`}
                              >
                                <Profile
                                  obj={{
                                    image: item?.strProfileImageUrl,
                                    title: item?.strDisplayName,
                                    designation: item?.strDesignationName,
                                    lastMessage: item?.LastMessage,
                                  }}
                                />
                              </div>
                            )
                        )}
                    </div>
                  </div>
                  {selectedUser?.strDisplayName ? (
                    <div className="col-9 p-0 ">
                      <div className="chat-box">
                        <div className="chat-box-content">
                          {messageList?.length > 0 &&
                            messageList.map((item, index) =>
                              item?.isSelfMsg === "true" ||
                              item?.isSelfMsg === true ? (
                                <div className="own-message" key={index}>
                                  <p>{item?.strMessage}</p>
                                </div>
                              ) : (
                                <div className="others-message" key={index}>
                                  <img
                                    src={
                                      selectedUser?.strProfileImageUrl &&
                                      `https://emgmt.peopledesk.io/emp/Document/DownloadFile?id=${selectedUser?.strProfileImageUrl}`
                                    }
                                    className="chat-img"
                                    alt="pic"
                                  />
                                  <p>{item?.strMessage}</p>
                                </div>
                              )
                            )}
                        </div>
                        <div ref={messagesEndRef} />
                      </div>

                      <div className="chat-footer">
                        <input
                          placeholder="Write your message ...."
                          type="text"
                          className="chat-input"
                          value={values?.message}
                          onChange={(e) => {
                            setFieldValue("message", e.target.value);
                          }}
                        />
                        <div className="chat-icon">
                          <button type="submit">
                            <NearMeIcon
                              sx={{
                                color: "rgba(255, 255, 255, 1)",
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%,-50%)",
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-9 p-0 d-flex align-items-center justify-content-center">
                      <b>Please select user</b>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default Chat;
