import { Avatar } from "@material-ui/core";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import movement from "../../../assets/images/ApprovalIcons/movement.svg";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import "./styles.css";

const initData = {
  search: "",
};

export default function UserRoleManager() {
  const saveHandler = () => {};
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableData = [
    {
      name: "Feature Assign To Role",
      path: "featureAssignToRole",
      icon: movement,
    },
    {
      name: "Feature Assign To User",
      path: "featureAssignToUser",
      icon: movement,
    },
    {
      name: "Role Assign To User",
      path: "roleAssignToUser",
      icon: movement,
    },
  ];
  const history = useHistory();

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
              <div className="table-card userRoleManager-wrapper">
                <div className="table-card-heading"></div>
                <div className="table-card-body" style={{ marginTop: "44px" }}>
                  <div className="table-card-styled tableOne">
                    <table className="table align-middle">
                      <tbody>
                        {tableData.map((item, index) => {
                          const { path, name, icon } = item;
                          return (
                            <tr className="hasEvent" key={index}>
                              <td>
                                <div
                                  onClick={() =>
                                    history.push(
                                      `/administration/roleManagement/userRoleManager/${path}`
                                    )
                                  }
                                  className="employeeInfo d-flex align-items-center justify-content-between"
                                >
                                  <div className="content tableBody-title d-flex align-items-center">
                                    <Avatar
                                      alt="Remy Sharp"
                                      src={icon}
                                      sx={{
                                        height: 50,
                                        width: 50,
                                        fontSize: "16px",
                                      }}
                                    />
                                    <p className="table-title ml-3">{name}</p>
                                  </div>
                                  <div className="icon mr-3">
                                    <ArrowForwardOutlinedIcon
                                      sx={{ fontSize: "16px" }}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
