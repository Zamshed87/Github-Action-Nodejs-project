import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import FormikSelect from "../../common/FormikSelect";
import Loading from "../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../utility/customColor";
import { dateFormatterForDashboard } from "../../utility/dateFormatter";
import { customStyles } from "../../utility/selectCustomStyle";
import ManagementDashboardLanding from "./ManagementDashboardLanding/ManagementDashboardLanding";
import SelfDashboardLanding from "./SelfDashboardLanding/SelfDashboardLanding";
import SupervisorDashboardLanding from "./SupervisorDashboardLanding/SupervisorDashboardLanding";
import { useHistory } from "react-router-dom";

const MasterDashboardLanding = () => {
  const dispatch = useDispatch();
  const { strDisplayName, isOwner, isOfficeAdmin } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { values, setValues, errors, touched } = useFormik({
    initialValues: {
      dashboardroleType: { value: 1, label: "Employee" },
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

  useEffect(() => {
    dispatch(setFirstLevelNameAction("dashboard"));
    document.title = "Dashboard";
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div className="table-card">
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ marginBottom: "4px" }}
        >
          <div>
            <p
              style={{
                color: "#344054",
                fontWeight: 400,
                fontSize: "12px",
              }}
            >
              {dateFormatterForDashboard()}
            </p>
            <h4
              className="employee-self-dashboard-employee-name"
              style={{ color: gray500, fontSize: "1rem" }}
            >
              Hello,{" "}
              <span
                className="pointer"
                onClick={() => {
                  history.push("/SelfService/aboutMe");
                }}
              >
                {strDisplayName}
              </span>
              , Welcome Back !
            </h4>
          </div>
          {values?.dashboardRoles?.length > 1 &&
            (!isOwner || isOfficeAdmin) && (
              <div style={{ width: "120px" }}>
                <FormikSelect
                  isClearable={false}
                  name="userType"
                  options={values?.dashboardRoles}
                  value={values?.dashboardroleType}
                  onChange={(valueOption) =>
                    setValues((prev) => ({
                      ...prev,
                      dashboardroleType: valueOption,
                    }))
                  }
                  styles={customStyles}
                  errors={errors}
                  touched={touched}
                />
              </div>
            )}
        </div>

        {isOwner ? (
          <ManagementDashboardLanding setLoading={setLoading} />
        ) : (
          <>
            {values?.dashboardroleType?.value === 1 && (
              <SelfDashboardLanding
                setLoading={setLoading}
                setDashboardRoles={(dashboardRoles) =>
                  setValues((prev) => ({ ...prev, dashboardRoles }))
                }
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
          </>
        )}
      </div>
    </>
  );
};

export default MasterDashboardLanding;
