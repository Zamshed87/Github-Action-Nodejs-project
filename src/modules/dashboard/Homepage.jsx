import { CardMedia } from "@material-ui/core";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import administration from "../../assets/images/administration.svg";
import analystics from "../../assets/images/analystics.svg";
import approval from "../../assets/images/approval.svg";
import assetManagement from "../../assets/images/assetManagement.svg";
import calander from "../../assets/images/calander.svg";
import employeeSelfService from "../../assets/images/employee-self-service.svg";
import employeeManagement from "../../assets/images/employeeManagement.svg";
import performance from "../../assets/images/performance.svg";
import requirment from "../../assets/images/requirment.svg";
import speedometer from "../../assets/images/speedometer.svg";
import task from "../../assets/images/task.svg";
import training from "../../assets/images/training.svg";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import "./dashBoard.css";

const initData = {
  search: "",
  jobStatus: "",
  publishFromDate: "",
  publishToDate: "",
  assignee: "",
  jobList: "",
};

const Homepage = () => {
  const { strDisplayName, isOwner } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { menuList } = useSelector((state) => state?.auth, shallowEqual);

  const history = useHistory();

  const toAndImage = (label) => {
    let to = null;
    let image = null;
    if (label === "Employee Self Service") {
      to = "/SelfService/dashboard";
      image = employeeSelfService;
    } else if (label === "Employee Management") {
      to = isOwner ? "/profile/reports/employeeList" : "/profile/employee";
      image = employeeManagement;
    } else if (label === "Administration") {
      to = "/administration/roleManagement/usersInfo";
      image = administration;
    } else if (label === "Approval") {
      to = "/approval";
      image = approval;
    } else if (label === "Compensation & Benefits") {
      to = isOwner
        ? "/compensationAndBenefits/reports/salaryReport"
        : "/compensationAndBenefits/employeeSalary/salaryAssign";
      image = calander;
    } else if (label === "Analytics") {
      to = "/analytics/comparativeAnalysis";
      image = analystics;
    } else if (label === "Dashboard") {
      to = "/dashboard";
      image = speedometer;
    } else if (label === "Task Management") {
      to = "/taskManagement";
      image = task;
    } else if (label === "Performance Management System") {
      to = "/performancemanagementsystem";
      image = performance;
    } else if (label === "Recruitment") {
      to = "https://devhire.peopledesk.io/";
      image = requirment;
    } else if (label === "Manning") {
      to = "/manning";
      image = requirment;
    } else if (label === "Training & Development") {
      to = "/trainingAndDevelopment/training/schedule";
      image = training;
    } else if (label === "Asset Management") {
      to = "/assetManagement/registration/items";
      image = assetManagement;
    }
    return { to, image };
  };

  const onClickHandler = (label) => {
    const { to } = toAndImage(label);
    if (to === "https://devhire.peopledesk.io/") {
      window.open(to, "_blank");
    } else {
      history.push(to);
    }
  };

  const saveHandler = (values) => {};

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Overview"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <div className="dashboard">
                <div className="employee-details text-center mb-2">
                  <h4 className="welcome-text">
                    Hi, {strDisplayName} ! Welcome To PeopleDesk
                  </h4>
                </div>
                <div className="item-wrapper">
                  <div className="d-flex flex-wrap justify-content-center">
                    <div
                      onClick={() => {
                        onClickHandler("Dashboard");
                      }}
                      className="item-card text-center"
                    >
                      <Card
                        sx={{
                          height: "170px",
                          width: "170px",
                          border: "1px solid rgba(0, 0, 0, 0.12)",
                          cursor: "pointer",
                          "&:hover": {
                            boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.16)",
                          },
                        }}
                      >
                        <CardContent sx={{ padding: "30px" }}>
                          <CardMedia
                            component="img"
                            image={toAndImage("Dashboard")?.image}
                            alt={"Dashboard"}
                          />
                        </CardContent>
                      </Card>
                      <p className="item-name">{"Dashboard"}</p>
                    </div>
                    {menuList?.map(
                      (item, index) =>
                        item?.label !== "Overview" && (
                          <div
                            onClick={() => {
                              onClickHandler(item?.label);
                            }}
                            className="item-card text-center"
                            key={index}
                          >
                            <Card
                              sx={{
                                height: "170px",
                                width: "170px",
                                border: "1px solid rgba(0, 0, 0, 0.12)",
                                cursor: "pointer",
                                "&:hover": {
                                  boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.16)",
                                },
                              }}
                            >
                              <CardContent sx={{ padding: "30px" }}>
                                <CardMedia
                                  component="img"
                                  image={toAndImage(item?.label)?.image}
                                  alt={item?.label}
                                />
                              </CardContent>
                            </Card>
                            <p className="item-name">{item?.label}</p>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default Homepage;
