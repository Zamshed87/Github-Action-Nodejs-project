import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../utility/customColor";
import { dateFormatterForDashboard } from "../../utility/dateFormatter";
import ManagementDashboardLanding from "./ManagementDashboardLanding/ManagementDashboardLanding";
import SelfDashboardLanding from "./SelfDashboardLanding/SelfDashboardLanding";
import SupervisorDashboardLanding from "./SupervisorDashboardLanding/SupervisorDashboardLanding";
import { useHistory, useLocation } from "react-router-dom";
import EmployeeBooklet from "./employee-booklet";

const MasterDashboardLanding = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const firstSegment = location.pathname.split("/")[2];
  const { strDisplayName, isOwner, orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { businessUnitDDL } = useSelector((state) => state?.auth, shallowEqual);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const getDashboardId = (name) => {
    switch (name) {
      case "employee":
        return 1;
      case "supervisor":
        return 2;
      case "management":
        return 3;
      case "employeeLifecycle":
        return 4;
      default:
        return 1;
    }
  };

  const { values, setValues } = useFormik({
    initialValues: {
      dashboardroleType: {
        value: getDashboardId(firstSegment),
        label: "Employee",
      },
      dashboardRoles: [
        {
          value: 1,
          label: "Employee",
        },
      ],
    },
    // onSubmit: () => {},
    enableReinitialize: true,
  });

  const businessUnit = businessUnitDDL?.find(
    (item) => item?.BusinessUnitId === buId
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Dashboard"));
    document.title = "Dashboard";
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div className="table-card">
        <div
          className="d-flex justify-flex-start align-items-center"
          style={{ marginBottom: "4px" }}
        >
          <div style={{ width: "42%" }}>
            <h4
              className="employee-self-dashboard-employee-name"
              style={{ color: gray500, fontSize: "1rem" }}
            >
              Hello,{" "}
              <span
                className="pointer"
                style={{ color: "green", textDecoration: "underline" }}
                onClick={() => {
                  history.push("/SelfService/aboutMe");
                }}
              >
                {strDisplayName}
              </span>
              , Welcome Back !
            </h4>
            <p
              style={{
                color: "#344054",
                fontWeight: 400,
                fontSize: "12px",
              }}
            >
              {dateFormatterForDashboard()}
            </p>
          </div>

          <div>
            <h4
              className="employee-self-dashboard-employee-name"
              style={{ color: gray500, fontSize: "1rem" }}
            >
              {businessUnit?.BusinessUnitName + " "}[
              {businessUnit?.BusinessUnitCode}]
            </h4>
            <p
              style={{
                color: "#344054",
                fontWeight: 400,
                fontSize: "12px",
              }}
            >
              {businessUnit?.BusinessUnitAddress}
            </p>
          </div>
        </div>

        {isOwner ? (
          <ManagementDashboardLanding setLoading={setLoading} />
        ) : (
          <>
            {values?.dashboardroleType?.value === 1 && (
              <SelfDashboardLanding
                setLoading={setLoading}
                setDashboardRoles={(dashboardRoles) => {
                  if (
                    Array.isArray(dashboardRoles) &&
                    dashboardRoles.length === 4 &&
                    ![3, 7, 12].includes(orgId)
                  ) {
                    dashboardRoles.pop();
                  }

                  setValues((prev) => ({ ...prev, dashboardRoles }));
                }}
              />
            )}
            {values?.dashboardroleType?.value === 2 && (
              <SupervisorDashboardLanding
                loading={loading}
                setLoading={setLoading}
              />
            )}
            {values?.dashboardroleType?.value === 3 && (
              <ManagementDashboardLanding setLoading={setLoading} />
            )}
            {values?.dashboardroleType?.value === 4 && (
              <EmployeeBooklet setLoading={setLoading} />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MasterDashboardLanding;
