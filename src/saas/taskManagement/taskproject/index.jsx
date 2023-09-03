/* eslint-disable no-unused-vars */
import { AddOutlined } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MasterFilter from "../../../common/MasterFilter";
import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import Logo2 from "./images/akij-logo.jpg";
import Logo1 from "./images/pd-logo.png";
import "./index.css";

const initData = {
  search: "",
};

export default function TMProject() {
  const [value, setValue] = useState("running");

  const [isHiddenFilter, setIsHiddenFilter] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Task Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const style = {
    borderTop: "5px solid #33A551",
    cursor: "pointer",
  };

  let history = useHistory();

  const handleClick = (event) => {
    // setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <Form>
            <div className="table-card tmProject">
              <div className="table-card-heading heading pt-0">
                <div></div>
                <div className="table-card-heading ">
                  <div className="table-card-head-right">
                    <ul>
                      <li>
                        <MasterFilter
                          width="200px"
                          inputWidth="200px"
                          value={values?.search}
                          setValue={(value) => {
                            setFieldValue("search", value);
                          }}
                          cancelHandler={() => {
                            setFieldValue("search", "");
                          }}
                          handleClick={handleClick}
                          isHiddenFilter={isHiddenFilter}
                        />
                      </li>
                      <li>
                        <PrimaryButton
                          type="button"
                          className="btn btn-default flex-center"
                          label={"Create Project"}
                          onClick={() =>
                            history.push(
                              "/taskmanagement/taskmgmt/projects/create"
                            )
                          }
                          icon={
                            <AddOutlined
                              sx={{
                                marginRight: "0px",
                                fontSize: "15px",
                              }}
                            />
                          }
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Box sx={{ width: "100%", typography: "body1" }}>
                <TabContext value={value}>
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                      sx={{
                        "& .MuiTabs-indicator": {
                          borderBottom: 3,
                          borderColor: "#34A853",
                        },
                      }}
                    >
                      <Tab
                        className="pr-5 pl-5"
                        label="running"
                        value="running"
                        sx={{
                          "&.Mui-selected": {
                            color: "#34A853",
                          },
                        }}
                      />
                      <Tab
                        className="pr-5 pl-5"
                        label="complete"
                        value="complete"
                        sx={{
                          "&.Mui-selected": {
                            color: "#34A853",
                          },
                        }}
                      />
                    </TabList>
                  </Box>

                  <div className="row mt-3 tmProjectTabs">
                    {/* created project  */}
                    <div className="col-lg-4 px-0">
                      <TabPanel value="running">
                        <div
                          className="card shadow mb-2"
                          style={style}
                          onClick={() =>
                            history.push(
                              "/taskmanagement/taskmgmt/projects/task-project/:id"
                            )
                          }
                        >
                          <div className="card-body pb-0">
                            <div className="d-flex">
                              <img
                                width="40px"
                                className="pbg 5rounded-circle mb-5"
                                src={Logo1}
                                alt=""
                              />
                              <div className="ml-3 mt-2">
                                <h2
                                  style={{
                                    fontSize: "18px",
                                    color: "rgba(0, 0, 0, 0.6)",
                                  }}
                                >
                                  People Desk
                                </h2>
                                <p
                                  style={{
                                    fontSize: "14px",
                                    color: "rgba(0, 0, 0, 0.6)",
                                    marginTop: "5px",
                                  }}
                                >
                                  24 Apr 2021 to 5 May 2021
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 px-0">
                      <TabPanel value="complete">
                        <div
                          className="card shadow mb-2"
                          style={style}
                          onClick={() =>
                            history.push(
                              "/taskmanagement/taskmgmt/projects/task-project/:id"
                            )
                          }
                        >
                          <div className="card-body pb-0">
                            <div className="d-flex">
                              <img
                                width="40px"
                                className="rounded-circle mb-5"
                                src={Logo2}
                                alt=""
                              />
                              <div className="ml-3 mt-2">
                                <h2
                                  style={{
                                    fontSize: "18px",
                                    color: "rgba(0, 0, 0, 0.6)",
                                  }}
                                >
                                  Akij shipping ltd
                                </h2>
                                <p
                                  style={{
                                    fontSize: "14px",
                                    color: "rgba(0, 0, 0, 0.6)",
                                    marginTop: "5px",
                                  }}
                                >
                                  24 Apr 2021 to 5 May 2021
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                    </div>
                  </div>
                </TabContext>
              </Box>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
