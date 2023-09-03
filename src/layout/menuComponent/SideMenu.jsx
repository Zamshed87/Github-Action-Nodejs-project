/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export default function SideMenu() {
  const location = useLocation();
  const [selectedFirstLevelMenu, setSelectedFirstLevelMenu] = useState("");
  const [selectedSecondLevelMenu, setSelectedSecondLevelMenu] = useState("");
  const [selectedThirdLevel, setSelectedThirdLevel] = useState("");

  const { firstLevelName } = useSelector(
    (state) => state?.localStorage,
    shallowEqual
  );

  const { menuList } = useSelector(
    (state) => state?.auth,
    shallowEqual
  );

  // const [menu] = useState(userRole === "Employee" ? menuListForEmp : menuList);

  const menuObj = menuList?.filter((item, index) => {
    return item?.label === firstLevelName;
  });

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

  return (
    <>
      <div className="side-menu-wrapper scrollbar-remove">
        <div className="menu">
          <ul className="list-unstyled components">
            {menuObj?.map((firstLevel, index) => (
              <li key={index} className="firstLevel-li">
                {firstLevel?.isFirstLabel ? (
                  <>
                    {/* sub-menu */}
                    {firstLevel?.childList?.length > 0 && (
                      <ul
                        className={
                          selectedFirstLevelMenu === firstLevel?.label ||
                            makeActive(firstLevel?.to)
                            ? `dropdown-content firstLabel-dropdown-show`
                            : `dropdown-content firstLabel-dropdown-hide`
                        }
                      >
                        {firstLevel?.childList?.map((secondLevel, index) => (
                          <li key={index}>
                            {secondLevel?.isSecondLabel ? (
                              <>
                                <div
                                  className="d-flex align-items-center justify-content-around"
                                  onClick={() =>
                                    setSelectedSecondLevelMenu(
                                      secondLevel?.label ===
                                        selectedSecondLevelMenu
                                        ? ""
                                        : secondLevel?.label
                                    )
                                  }
                                >
                                  <div className="sidebar-dropdown sidebar-second-dropdown">
                                    <span className="menu-bullet"></span>{" "}
                                    {secondLevel?.label}
                                  </div>
                                </div>

                                {secondLevel?.childList?.length > 0 && (
                                  <ul
                                    className={
                                      selectedSecondLevelMenu ===
                                        secondLevel?.label ||
                                        makeActive(secondLevel?.to)
                                        ? "dropdown-content dropdown-second-content secondLevel-dropdown-show"
                                        : "dropdown-content dropdown-second-content secondLevel-dropdown-hide"
                                    }
                                  >
                                    {secondLevel?.childList?.map(
                                      (thirdLevel, index) => (
                                        <li key={index}>
                                          <div
                                            style={{ width: "100%" }}
                                            onClick={() => { }}
                                          >
                                            <Link
                                              className={
                                                thirdLevel?.label ===
                                                  selectedThirdLevel ||
                                                  makeActive(thirdLevel?.to, true)
                                                  ? "active"
                                                  : ""
                                              }
                                              to={thirdLevel?.to}
                                            >
                                              <span className="menu-bullet"></span>{" "}
                                              {thirdLevel?.label}
                                            </Link>
                                          </div>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                )}
                              </>
                            ) : (
                              <div style={{ width: "100%" }} onClick={() => { }}>
                                <Link
                                  className={
                                    secondLevel?.label ===
                                      selectedSecondLevelMenu ||
                                      makeActive(secondLevel?.to, true)
                                      ? "active"
                                      : ""
                                  }
                                  to={secondLevel?.to}
                                >
                                  <span className="menu-bullet"></span>{" "}
                                  {secondLevel?.label}
                                </Link>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <div style={{ width: "100%" }}>
                    <Link
                      className={
                        firstLevel?.label === selectedThirdLevel ||
                          makeActive(firstLevel?.to, true)
                          ? `active`
                          : ""
                      }
                      to={firstLevel?.to}
                    >
                      <i className="fa fa-cog"></i> {firstLevel?.label}
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
