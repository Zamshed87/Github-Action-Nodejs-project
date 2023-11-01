/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import companyLogo from "../../../assets/images/company/logo.png";
import DashboardHead from "../../../layout/dashboardHead/DashboardHead";
import SideMenu from "../../../layout/menuComponent/SideMenu";
import OverviewTab from "./components/OverviewTab";

// always it should be last position import
import "./employeeOverview.css";

export default function EmployeeOverview() {
  return (
    <>
      <div>
        <DashboardHead companyLogo={companyLogo} moduleTitle={"Employee Management"} />
        <div className="employee-profile">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-2">
                <SideMenu />
              </div>
              <div className="col-md-10" style={{ background: "#E5E5E5" }}>
                <div className="table-card">
                  <div className="table-card-heading">
                    <span></span>
                    <div className="table-card-head-right"></div>
                  </div>
                  <div className="table-card-body">
                    <div className="row m-0">
                      <div className="col-lg-10 m-auto">
                        <div className="employee-overview-filter">
                          <h6>Overview</h6>
                          <OverviewTab />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
