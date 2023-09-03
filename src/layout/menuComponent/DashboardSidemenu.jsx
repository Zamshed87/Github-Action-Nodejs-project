import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardSidemenu() {
  return (
    <>
      <div className="side-menu-wrapper scrollbar-remove">
        <div className="menu">
          <ul className="list-unstyled components">
            <li className="firstLevel-li">
              <ul className="dropdown-content firstLabel-dropdown-show">
                <li>
                  <div style={{ width: "100%" }} onClick={() => { }}>
                    <Link className="active" to="/dashboard">
                      <span className="menu-bullet"></span>{" "}
                      Dashboard
                    </Link>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
