import React from 'react';
import { Link } from 'react-router-dom';

export default function ApprovalSidemenu() {
  return (
    <>
      <div className="side-menu-wrapper scrollbar-remove">
        <div className="menu">
          <ul className="list-unstyled components">
            <li className="firstLevel-li">
              <ul className="dropdown-content firstLabel-dropdown-show">
                <li>
                  <div style={{ width: "100%" }} onClick={() => { }}>
                    <Link className="active" to="/approval">
                      <span className="menu-bullet"></span>{" "}
                      Approval
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
