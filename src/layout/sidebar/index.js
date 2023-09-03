/* eslint-disable no-unused-vars */
import {
  AccountBoxOutlined,
  AccountCircleOutlined,
  BarChartOutlined,
  ComputerOutlined,
  DashboardCustomizeOutlined,
  DashboardOutlined,
  EmojiEventsOutlined,
  Menu,
  PeopleAltOutlined,
  PeopleOutlineOutlined,
  SettingsOutlined,
  ShowChartOutlined,
  VerifiedUserOutlined,
} from "@mui/icons-material";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link, useHistory } from "react-router-dom";
import authLogo from "../../assets/images/logo.svg";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";

const Sidebar = ({ isOpenSidebar, setIsOpenSidebar }) => {
  const { menuList } = useSelector((state) => state?.auth, shallowEqual);

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [selectedFirstLevelMenu, setSelectedFirstLevelMenu] = useState("");
  const [selectedThirdLevel, setSelectedThirdLevel] = useState("");

  const makeActive = (to, isLink = false) => {
    let isFound = false;

    if (isLink) {
      isFound = to === location.pathname;
    } else {
      const regex = new RegExp(to?.toLowerCase());
      isFound = regex.test(location.pathname.toLowerCase());
    }

    return isFound;
  };

  const menuIcon = (label) => {
    let component = null;
    if (label === "Employee Self Service") {
      component = <AccountBoxOutlined sx={{ marginRight: "17px" }} />;
    } else if (label === "Employee Management") {
      component = <PeopleAltOutlined sx={{ marginRight: "17px" }} />;
    } else if (label === "Administration") {
      component = <SettingsOutlined sx={{ marginRight: "17px" }} />;
    } else if (label === "Approval") {
      component = <VerifiedUserOutlined sx={{ marginRight: "17px" }} />;
    } else if (label === "Compensation & Benefits") {
      component = <EmojiEventsOutlined sx={{ marginRight: "17px" }} />;
    } else if (label === "Analytics") {
      component = <BarChartOutlined sx={{ marginRight: "17px" }} />;
    } else if (label === "Dashboard") {
      component = <DashboardCustomizeOutlined sx={{ marginRight: "17px" }} />;
    } else if (label === "Overview") {
      component = <DashboardOutlined sx={{ marginRight: "17px" }} />;
    } else if (label === "Recruitment") {
      component = <PeopleOutlineOutlined sx={{ marginRight: "17px" }} />;
    } else if (label === "Manning") {
      component = <AccountCircleOutlined sx={{ marginRight: "17px" }} />;
    } else if (label === "Task Management") {
      component = <VerifiedUserOutlined sx={{ marginRight: "17px" }} />;
    } else if (label === "Performance Management System") {
      component = <PeopleAltOutlined sx={{ marginRight: "17px" }} />;
    } else if (label === "Asset Management") {
      component = <ComputerOutlined sx={{ marginRight: "17px" }} />;
    } else if (label === "Training & Development") {
      component = <ShowChartOutlined sx={{ marginRight: "17px" }} />;
    }
    return component;
  };

  return (
    <>
      <div className="logo-wrapper">
        <div className="logo-inner-wrapper">
          <div
            onClick={() => {
              setIsOpenSidebar(!isOpenSidebar);
            }}
            className="sidebar-menu-icon"
          >
            <Menu sx={{ marginRight: "20px" }} />
          </div>
          <Link to="/">
            <div className="logo-img sidebar-logo">
              <img src={authLogo} alt="iBOS" />
            </div>
          </Link>
        </div>
      </div>
      <div className="menu">
        <ul className="list-unstyled components">
          {menuList?.map((firstLevel, index) => (
            <li key={index} className="firstLevel-li">
              {firstLevel?.isFirstLabel ? (
                <>
                  {/* first label parent */}
                  <div
                    className="d-flex justify-content-between align-items-center"
                    onClick={() => {
                      setIsOpenSidebar(!isOpenSidebar);
                      setSelectedFirstLevelMenu(
                        firstLevel?.label === selectedFirstLevelMenu
                          ? ""
                          : firstLevel?.label
                      );
                      dispatch(setFirstLevelNameAction(firstLevel?.label));

                      if (
                        firstLevel?.to === "/compensationAndBenefits" ||
                        firstLevel?.to === "/assetManagement" ||
                        firstLevel?.to === "/trainingAndDevelopment"
                      ) {
                        history.push(
                          firstLevel?.childList[0]?.childList[0]?.to
                        );
                      } else if (firstLevel?.to === "/approval") {
                        history.push(firstLevel?.to);
                      } else {
                        history.push(firstLevel?.childList[0]?.to);
                      }
                    }}
                  >
                    <div className="sidebar-dropdown">
                      {menuIcon(firstLevel?.label)} {firstLevel?.label}
                    </div>
                    {firstLevel?.childList && (
                      <i
                        className={
                          selectedFirstLevelMenu === firstLevel?.label
                            ? "fa fa-angle-right icon-rotate"
                            : "fa fa-angle-right"
                        }
                      ></i>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{ width: "100%" }}
                    onClick={() => {
                      setIsOpenSidebar(!isOpenSidebar);
                      setSelectedFirstLevelMenu(
                        firstLevel?.label === selectedFirstLevelMenu
                          ? ""
                          : firstLevel?.label
                      );
                      dispatch(setFirstLevelNameAction(firstLevel?.label));
                    }}
                  >
                    {firstLevel?.to === "https://recruitment.peopledesk.io/" ? (
                      <a
                        className={
                          firstLevel?.label === selectedThirdLevel ||
                          makeActive(firstLevel?.to, true)
                            ? `active`
                            : ""
                        }
                        // to={firstLevel?.to}
                        href="https://recruitment.peopledesk.io/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {menuIcon(firstLevel?.label)} {firstLevel?.label}
                      </a>
                    ) : (
                      <Link
                        className={
                          firstLevel?.label === selectedThirdLevel ||
                          makeActive(firstLevel?.to, true)
                            ? `active`
                            : ""
                        }
                        to={firstLevel?.to}
                      >
                        {menuIcon(firstLevel?.label)} {firstLevel?.label}
                      </Link>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
