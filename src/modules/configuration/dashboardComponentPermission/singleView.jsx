import React, { useEffect } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Grain } from "@mui/icons-material";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import BackButton from "../../../common/BackButton";
import CircleButton from "../../../common/CircleButton";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";

export default function DashboardCompPermissionDetails() {
  const dispatch = useDispatch();
  const { state } = useLocation();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 20234) {
      permission = item;
    }
  });

  return (
    <>
      {permission?.isCreate ? (
        <>
          <div className="table-card">
            <div className="table-card-heading">
              <div className="d-flex align-items-center">
                <BackButton />
                <h2>View Dashboard Components Permission</h2>
              </div>
            </div>
            <div className="card-style" style={{ padding: "12px 10px 10px" }}>
              <div className="row">
                <div className="col-lg-3">
                  <CircleButton
                    icon={<Grain style={{ fontSize: "24px" }} />}
                    title={state?.accountName || "-"}
                    subTitle="Account Name"
                  />
                </div>
                <div className="col-12">
                  <div className="card-save-border"></div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <div className="salary-breakdown-details-table">
                    <div className="table-card-styled employee-table-card tableOne">
                      <table className="table">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Components Name</th>
                            <th>Permission Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {state?.dashboardComponentViewModels?.length
                            ? state?.dashboardComponentViewModels?.map(
                                (item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td className="text-center">
                                        <div>{index + 1}</div>
                                      </td>
                                      <td>{item?.dashboardComponentName}</td>
                                      <td>
                                        {item?.isChecked
                                          ? "Activated"
                                          : "Deactivated"}
                                      </td>
                                    </tr>
                                  );
                                }
                              )
                            : ""}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <NotPermittedPage />
        </>
      )}
    </>
  );
}
