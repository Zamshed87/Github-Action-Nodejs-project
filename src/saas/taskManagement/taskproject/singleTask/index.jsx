/* eslint-disable no-unused-vars */
import { AddOutlined } from "@mui/icons-material";
import { Button, Modal } from "@mui/material";
import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import BackButton from "../../../../common/BackButton";
import PrimaryButton from "../../../../common/PrimaryButton";
import SortingIcon from "../../../../common/SortingIcon";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import SingleTaskTableItem from "../component/SingleTaskTableItem";

// init data
const initData = {
  search: "",
};

// main function
export default function TMProjectSingleTask() {
  // all states
  const [rowDto, setRowDto] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [tableData] = useState([]);

  // filter
  const [endDate, setEndDate] = useState("desc");
  const [priority, setPriority] = useState("desc");
  const [level, setLevel] = useState("desc");
  const [status, setStatus] = useState("desc");

  const history = useHistory();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Task Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ascending & descending
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...rowDto?.Result];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setRowDto({ Result: modifyRowData });
  };

  // modal style
  const style = {
    position: "absolute",
    top: "20%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 264,
    bgcolor: "white",
    boxShadow: 24,
    p: 2,
    borderRadius: 1,
  };

  // fake data
  const items = [
    {
      taskId: 1,
      taskName: "structural Design of Information",
      startDate: "24 Apr,2021",
      priority: "High",
      endDate: "5/5/21",
      status: "Inprogress",
    },
    {
      taskId: 2,
      taskName: "Business Requirement Wireframming",
      startDate: "26 March,2021",
      priority: "Medium",
      endDate: "9/7/21",
      status: "Open",
    },
    {
      taskId: 3,
      taskName: "Design Database",
      startDate: "21 Feb,2021",
      priority: "Low",
      endDate: "2/1/22",
      status: "Review",
    },
    {
      taskId: 4,
      taskName: "User Journey Map",
      startDate: "13 Apr,2020",
      priority: "High",
      endDate: "9/5/20",
      status: "Closed",
    },
    {
      taskId: 5,
      taskName: "Create Design Specification",
      startDate: "6 Sep,2021",
      priority: "Medium",
      endDate: "3/11/21",
      status: "Open",
    },
  ];

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 86) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          resetForm(initData);
        }}
      >
        {({ handleSubmit }) => (
          <>
            <Form onSubmit={handleSubmit}>
              <div className="overtime-entry singleTaskDetails">
                <div className="container-fluid">
                  {/* task details table  */}
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div className="d-flex align-items-center justify-content-center">
                        {/* <div
                          className="text-center"
                          style={{
                            borderRadius: "50%",
                            backgroundColor: "#F2F2F7",
                            height: "30px",
                            width: "30px",
                          }}
                          onClick={() =>
                            history.push("/taskmanagement/taskmgmt/projects")
                          }
                        >
                          <ArrowBackIcon
                            style={{ cursor: "pointer" }}
                            sx={{
                              fontSize: "18px",
                            }}
                          />
                        </div> */}
                        <BackButton title={"People Desk"} />
                      </div>
                      <div className="table-card-head-right">
                        <ul>
                          <li>
                            <PrimaryButton
                              type="button"
                              className="single-btn-outline btn btn-default flex-center "
                              label={"mark as complete"}
                              onClick={handleOpen}
                            />
                          </li>
                          <li>
                            <PrimaryButton
                              type="button"
                              className="btn btn-default flex-center"
                              label={"Create Task"}
                              icon={
                                <AddOutlined
                                  sx={{
                                    marginRight: "0px",
                                    fontSize: "15px",
                                  }}
                                />
                              }
                              onClick={() =>
                                history.push(
                                  "/taskmanagement/taskmgmt/projects/task-project/:id/create"
                                )
                              }
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    {tableData ? (
                      <div className="table-card-body">
                        <div className="table-card-styled tableOne">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>
                                  <div className="sortable">
                                    <span>Task Name</span>
                                  </div>
                                </th>
                                <th style={{ width: "120px" }}>
                                  <div
                                    className="sortable justify-content-center"
                                    onClick={() => {
                                      setPriority(
                                        priority === "desc" ? "asc" : "desc"
                                      );
                                      commonSortByFilter(priority, "End Date");
                                    }}
                                  >
                                    <span>Priority</span>
                                    <div>
                                      <SortingIcon
                                        viewOrder={priority}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                                <th style={{ width: "120px" }}>
                                  <div
                                    className="sortable justify-content-start"
                                    onClick={() => {
                                      setEndDate(
                                        endDate === "desc" ? "asc" : "desc"
                                      );
                                      commonSortByFilter(endDate, "End Date");
                                    }}
                                  >
                                    <span>End Date</span>
                                    <div>
                                      <SortingIcon
                                        viewOrder={endDate}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                                <th>
                                  <div className="sortable justify-content-center">
                                    <span>Due Days</span>
                                  </div>
                                </th>
                                <th>
                                  <div
                                    className="sortable"
                                    onClick={() => {
                                      setLevel(
                                        level === "desc" ? "asc" : "desc"
                                      );
                                      commonSortByFilter(level, "Level");
                                    }}
                                  >
                                    <span>Level</span>
                                    <div>
                                      <SortingIcon
                                        viewOrder={level}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                                <th style={{ width: "20px" }}></th>
                                <th>
                                  <div
                                    className="sortable"
                                    onClick={() => {
                                      setStatus(
                                        status === "desc" ? "asc" : "desc"
                                      );
                                      commonSortByFilter(status, "Status");
                                    }}
                                    style={{
                                      width: "80px",
                                    }}
                                  >
                                    <span>Status</span>
                                    <div>
                                      <SortingIcon
                                        viewOrder={status}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((item, index) => (
                                <tr key={index}>
                                  <SingleTaskTableItem
                                    item={item}
                                    index={index}
                                    rowDto={rowDto}
                                    setRowDto={setRowDto}
                                    permission={permission}
                                  />
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center pt-5 text-center"
                        style={{
                          height: "500px",
                        }}
                      >
                        <div>
                          <div>
                            <img
                              src="https://i.ibb.co/YRb1z3Z/create-project.png"
                              alt=""
                            />
                          </div>
                          <span className="text-secondary">
                            You have no task under cratibuzz project.Please
                            create
                            <br />a task, and enjoy the progress
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>

      {/* mark as complete modal  */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <span className="text-secondary">
            Are you sure you want to mark this project as complete?
          </span>
          <Box sx={{ display: "flex", justifyContent: "end", mt: 4 }}>
            <Button onClick={handleClose}>NO</Button>
            <Button>YES</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
