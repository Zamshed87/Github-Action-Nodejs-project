import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
// import { toast } from "react-toastify";
import { EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Loading from "../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
// import PrimaryButton from "../../../common/PrimaryButton";
import AvatarComponent from "../../../common/AvatarComponent";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { getNotificationSetupLanding } from "./helper";

const initData = {
  search: "",
};

export default function NotificationConfig() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Notification Setup";
  }, []);

  useEffect(() => {
    getNotificationSetupLanding(setRowDto, setLoading, orgId);
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 138) {
      permission = item;
    }
  });

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ handleSubmit }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <>
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div>
                        <h6>Notification Setup</h6>
                      </div>
                      {/* <ul className="d-flex flex-wrap">
                        <li>
                          <PrimaryButton
                            type="button"
                            className="btn btn-default flex-center"
                            label={"Create"}
                            icon={
                              <AddOutlined
                                sx={{
                                  marginRight: "0px",
                                  fontSize: "15px",
                                }}
                              />
                            }
                            onClick={() => {
                              if (!permission?.isCreate) {
                                return toast.warning("Your are not allowed to access", {
                                  toastId: 11
                                });
                              }
                              history.push("/administration/configuration/notificationConfig/create");
                            }}
                          />
                        </li>
                      </ul> */}
                    </div>
                    <div className="table-card-body">
                      <div className="table-card-styled tableOne">
                        {rowDto?.length > 0 ? (
                          <>
                            <table className="table">
                              <thead>
                                <tr>
                                  <th style={{ width: "30px" }}>SL</th>
                                  <th>
                                    <div className="sortable">
                                      <span>Company Name</span>
                                    </div>
                                  </th>
                                  <th width="60px">
                                    <div className="sortable">
                                      <span>Action</span>
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {rowDto?.length > 0 &&
                                  rowDto?.map((item, index) => {
                                    return (
                                      <tr
                                        key={index}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          history.push({
                                            pathname: `/administration/configuration/notificationConfig/view/${item?.companyId}`,
                                            state: item,
                                          });
                                        }}
                                        style={{
                                          cursor: "pointer",
                                        }}
                                      >
                                        <td>
                                          <div>{index + 1}</div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <div className="emp-avatar">
                                              <AvatarComponent
                                                classess=""
                                                letterCount={1}
                                                label={item?.companyName}
                                              />
                                            </div>
                                            <div className="ml-2">
                                              <span className="tableBody-title">
                                                {item?.companyName}
                                              </span>
                                            </div>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex justify-content-center">
                                            <Tooltip title="Edit" arrow>
                                              <button
                                                className="iconButton"
                                                type="button"
                                              >
                                                <EditOutlined
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    history.push({
                                                      pathname: `/administration/configuration/notificationConfig/edit/${item?.companyId}`,
                                                      state: item,
                                                    });
                                                  }}
                                                />
                                              </button>
                                            </Tooltip>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </>
                        ) : (
                          <>
                            {!loading && (
                              <NoResult title="No Result Found" para="" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
