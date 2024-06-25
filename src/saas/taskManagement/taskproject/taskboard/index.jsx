/* eslint-disable no-unused-vars */
import { AddOutlined } from "@mui/icons-material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import PrimaryButton from "../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
// import Dnd from "../../../../modules/componentModule/pageModule/dragAndDropModule/Dnd";
import FormikSelect from "../../../../common/FormikSelect";
import { customStylesSmall } from "../../../../utility/selectCustomStyle";
import AddTaskPopover from "./components/AddTaskPopover";
// import './taskboard.css'
import "./taskboard.css";

// import { customStylesLarge } from './../../../../utility/selectCustomStyle';
import { Form, Formik } from "formik";
import { useState } from "react";
import BackButton from "../../../../common/BackButton";
import Loading from "./../../../../common/loading/Loading";
import DragAndDrop from "./components/DragAndDrop";
import InvitePopover from "./components/InvitePopover";
import MemberPopover from "./components/MemberPopover";
import ProjectDetails from "./components/ProjectDetails";
// const options = [
//   { value: 1, label: "one" },
//   { value: 2, label: "two" },
// ];
const initData = {
  eventType: "",
  firstLavel: "",
  secondLevel: "",
  thirdLevel: "",
  path: "",
};
export default function TMProjectTaskBoard() {
  // const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const open1 = Boolean(anchorEl1);
  const id1 = open1 ? "simple-popover" : undefined;

  const handleClose1 = () => {
    setAnchorEl1(null);
  };
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? "simple-popover" : undefined;

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleInviteClick = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleMemberClick = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  // const [age, setAge] = React.useState("");

  // const handleChange = (event) => {
  //   setAge(event.target.value);
  // };

  // const saveHandler = (values, cb) => {};

  const [loading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Task Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          resetForm(initData);
        }}
      >
        {({
          handleSubmit,

          setFieldValue,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="table-card taskboard">
                <div className="table-card-heading heading pt-0 ">
                  <div
                    style={{
                      gridTemplateColumns: "5% 25% 13% 12% 12% 13% 10% ",
                      gridTemplateRows: "30px",
                      display: "grid",
                      columnGap: "2%",
                    }}
                    className=" w-100 "
                  >
                    <BackButton />
                    <div style={{ borderRadius: "4px" }} className="">
                      <FormikSelect
                        name="user journey map"
                        options={[
                          { value: 1, label: "Level 1" },
                          { value: 2, label: "Level 2" },
                          { value: 3, label: "Level 3" },
                        ]}
                        value={initData?.eventType}
                        className="border-0 "
                        onChange={(valueOption) => {
                          setFieldValue("eventType", valueOption);
                        }}
                        placeholder="User journey map"
                        styles={{
                          ...customStylesSmall,
                          control: (provided) => ({
                            ...provided,
                            minHeight: "30px",
                            height: "30px",
                            borderRadius: "4px",
                            width: "100%",
                            // backgroundColor: "#F2F2F7",
                          }),
                        }}
                        isDisabled={false}
                      />
                    </div>
                    <div
                    // style={{
                    //   backgroundColor: "#F2F2F7",
                    //   borderRadius: "4px",
                    // }}
                    // className=" d-flex align-items-center justify-content-center "
                    >
                      <ProjectDetails />
                    </div>
                    <div style={{ borderRadius: "4px" }}>
                      <div
                        style={{
                          // backgroundColor: "#F2F2F7",
                          color: "#5F6368",
                          borderColor: "white",
                        }}
                        className="dropdown"
                      >
                        <FormikSelect
                          name="level"
                          options={[
                            { value: 1, label: "Level 1" },
                            { value: 2, label: "Level 2" },
                            { value: 3, label: "Level 3" },
                          ]}
                          value={initData?.eventType}
                          className="border-0  "
                          onChange={(valueOption) => {
                            setFieldValue("eventType", valueOption);
                          }}
                          placeholder="Level 1"
                          styles={{
                            ...customStylesSmall,
                            control: (provided) => ({
                              ...provided,
                              minHeight: "30px",
                              height: "30px",
                              borderRadius: "4px",
                              border: "1px solid transparent",
                              width: "100%",
                              backgroundColor: "#F2F2F7",
                            }),
                          }}
                          isDisabled={false}
                        />
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          // backgroundColor: "#F2F2F7",
                          color: "#5F6368",
                          borderColor: "white",
                          fontSize: "14px",
                        }}
                        className="dropdown "
                      >
                        <FormikSelect
                          name="status"
                          options={[
                            { value: 1, label: "Open" },
                            { value: 2, label: "InProgress" },
                            { value: 3, label: "Review" },
                            { value: 4, label: "Closed" },
                          ]}
                          value={initData?.eventType}
                          // className="border-0 "
                          onChange={(valueOption) => {
                            setFieldValue("eventType", valueOption);
                          }}
                          placeholder="Open"
                          styles={{
                            ...customStylesSmall,
                            control: (provided) => ({
                              ...provided,
                              minHeight: "30px",
                              height: "30px",
                              borderRadius: "4px",
                              fontSize: "14px",
                              border: "1px solid transparent",
                              width: "100%",
                              backgroundColor: "#F2F2F7",
                            }),
                          }}
                          style={{}}
                          isDisabled={false}
                        />
                      </div>
                    </div>

                    {/* <div
                      style={{
                        backgroundColor: "#F2F2F7",
                        paddingLeft: "0",
                        color: "#5F6368!important",
                        borderRadius: "4px",
                      }}
                      className=" d-flex align-items-center justify-content-center"
                    >
                      <div
                        style={{
                          color: "#5F6368",
                          borderColor: "white",
                        }}
                        className="dropdown text-center"
                      >
                        <button
                          className="btn btn-transparent dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton1"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <BatchPredictionIcon sx={{marginRight:'25px'}} /> Open
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <li>
                            <a className="dropdown-item" href="#">
                              Action
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div> */}
                    <div
                      onClick={handleMemberClick}
                      role="button"
                      className="p-0 w-100 d-flex align-items-center justify-content-center"
                    >
                      <AvatarGroup
                        sx={{
                          height: "100%!important",
                          overflow: "hidden",
                          "&.MuiAvatarGroup-root": {
                            height: "30px",
                          },
                          "& .MuiAvatar-root": {
                            height: "27px",
                            width: "27px",
                            fontSize: "14px",
                          },
                        }}
                        total={24}
                      >
                        <Avatar
                          alt="Remy Sharp"
                          src="/static/images/avatar/1.jpg"
                        />
                        <Avatar
                          alt="Travis Howard"
                          src="/static/images/avatar/2.jpg"
                        />
                        <Avatar
                          alt="Agnes Walker"
                          src="/static/images/avatar/4.jpg"
                        />
                        <Avatar
                          alt="Trevor Henderson"
                          src="/static/images/avatar/5.jpg"
                        />
                      </AvatarGroup>
                    </div>
                    <div className="">
                      <PrimaryButton
                        style={{
                          backgroundColor: "#637381",
                          color: "white",
                          borderColor: "white",
                          height: "30px",
                          fontSize: "14px",
                        }}
                        type="button"
                        className="btn flex-center"
                        label={"invite"}
                        icon={
                          <PersonAddAltIcon
                            sx={{ marginRight: "5px", fontSize: "18px" }}
                          />
                        }
                        onClick={handleInviteClick}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div
                  className="container-fluid pt-3"
                  style={{
                    backgroundColor: "#FFFAF1",
                    height: "565px",
                    overflow: "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  <PrimaryButton
                    style={{
                      backgroundColor: "#F2F2F7",
                      boxShadow:
                        "0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.2)",
                      color: "#637381",
                      // borderColor: "white",
                      border: "none",
                      borderRadius: "30px",
                      pointer: "cursor",
                      marginBottom: "15px",
                      marginLeft: "10px",
                      fontSize: "14px",
                      fontWeight: "500",
                      padding: "16px 20px 16px 20px",
                    }}
                    type="button"
                    className="btn flex-center "
                    label={"Add task board"}
                    icon={<AddOutlined sx={{ marginRight: "13px" }} />}
                    onClick={handleClick}
                  />
                  <div style={{}} className="">
                    <DragAndDrop />
                  </div>
                </div>
                <AddTaskPopover
                  propsObj={{
                    id,
                    open,
                    anchorEl,
                    handleClose,
                  }}
                />
                <InvitePopover
                  propsObj={{
                    id1,
                    open1,
                    anchorEl1,
                    handleClose1,
                  }}
                />
                <MemberPopover
                  propsObj={{
                    id2,
                    open2,
                    anchorEl2,
                    handleClose2,
                  }}
                />
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
