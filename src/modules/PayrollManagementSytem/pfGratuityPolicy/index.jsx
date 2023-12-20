import { AddOutlined, Edit, Grain } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { getPfGratuityLanding } from "./helper";

const initialValues = {
  search: "",
};

export default function PfGratuityPolicy() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30305) {
      permission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "PF & Gratuity";
  }, [dispatch]);

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState("");

  useEffect(() => {
    getPfGratuityLanding(orgId, setRowDto, setLoading);
  }, [orgId]);

  const saveHandler = (values) => {};

  // useFormik hooks
  const { handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => saveHandler(values),
  });

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        {permission?.isView ? (
          <>
            <div className="table-card">
              <div className="table-card-heading">
                <div></div>
                <ul className="d-flex flex-wrap">
                  {rowDto?.intPfngratuityId ? (
                    <li>
                      <PrimaryButton
                        type="button"
                        className="btn btn-default flex-center"
                        label={"Edit"}
                        icon={
                          <Edit
                            sx={{ marginRight: "11px", fontSize: "16px" }}
                          />
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!permission?.isEdit)
                            return toast.warn("You don't have permission");
                          history.push({
                            pathname: `/administration/payrollConfiguration/PFAndGratuity/edit/${rowDto?.intPfngratuityId}`,
                            state: rowDto,
                          });
                        }}
                      />
                    </li>
                  ) : (
                    <li>
                      <PrimaryButton
                        type="button"
                        className="btn btn-default flex-center"
                        label={"Create"}
                        icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!permission?.isCreate)
                            return toast.warn("You don't have permission");
                          history.push(
                            "/administration/payrollConfiguration/PFAndGratuity/create"
                          );
                        }}
                      />
                    </li>
                  )}
                </ul>
              </div>
              {rowDto?.intPfngratuityId ? (
                <>
                  <div className="table-card-body about-info-card policy-details">
                    <div className="row mb-4">
                      <div className="col-md-3 d-flex align-items-center mb-2">
                        <IconButton
                          style={{
                            color: "black",
                            backgroundColor: "#EAECF0",
                            padding: "5px",
                          }}
                        >
                          <Grain style={{ width: "25px", height: "25px" }} />
                        </IconButton>
                        <div className="ml-3">
                          <h2>{rowDto?.isHasPfpolicy ? "Yes" : "No"}</h2>
                          <p>Provident Fund</p>
                        </div>
                      </div>
                      <div className="col-md-3 d-flex align-items-center  mb-2">
                        <IconButton
                          style={{
                            color: "black",
                            backgroundColor: "#EAECF0",
                            padding: "5px",
                          }}
                        >
                          <Grain style={{ width: "25px", height: "25px" }} />
                        </IconButton>
                        <div className="ml-3">
                          <h2>
                            {rowDto?.intNumOfEligibleYearForBenifit || "N/A"}
                          </h2>
                          <p>No. Of Eligible Year For PF</p>
                        </div>
                      </div>
                      <div className="col-md-3 d-flex align-items-center  mb-2">
                        <IconButton
                          style={{
                            color: "black",
                            backgroundColor: "#EAECF0",
                            padding: "5px",
                          }}
                        >
                          <Grain style={{ width: "25px", height: "25px" }} />
                        </IconButton>
                        <div className="ml-3">
                          <h2>
                            {rowDto?.numEmployeeContributionOfBasic
                              ? `${rowDto?.numEmployeeContributionOfBasic} %`
                              : "N/A"}
                          </h2>
                          <p>PF Employee Contribution Of Basic</p>
                        </div>
                      </div>
                      <div className="col-md-3 d-flex align-items-center  mb-2">
                        <IconButton
                          style={{
                            color: "black",
                            backgroundColor: "#EAECF0",
                            padding: "5px",
                          }}
                        >
                          <Grain style={{ width: "25px", height: "25px" }} />
                        </IconButton>
                        <div className="ml-3">
                          <h2>
                            {rowDto?.numEmployerContributionOfBasic
                              ? `${rowDto?.numEmployerContributionOfBasic} %`
                              : "N/A"}
                          </h2>
                          <p>PF Employer Contribution Of Basic</p>
                        </div>
                      </div>
                      <div className="col-md-3 d-flex align-items-center  mb-2">
                        <IconButton
                          style={{
                            color: "black",
                            backgroundColor: "#EAECF0",
                            padding: "5px",
                          }}
                        >
                          <Grain style={{ width: "25px", height: "25px" }} />
                        </IconButton>
                        <div className="ml-3">
                          <h2>
                            {rowDto?.intNumOfEligibleMonthForPfinvestment ||
                              "N/A"}
                          </h2>
                          <p>No. Of Eligible Month For PF Investment</p>
                        </div>
                      </div>
                      <div className="col-md-3 d-flex align-items-center  mb-2">
                        <IconButton
                          style={{
                            color: "black",
                            backgroundColor: "#EAECF0",
                            padding: "5px",
                          }}
                        >
                          <Grain style={{ width: "25px", height: "25px" }} />
                        </IconButton>
                        <div className="ml-3">
                          <h2>{rowDto?.isHasGratuityPolicy ? "Yes" : "No"}</h2>
                          <p>Gratuity</p>
                        </div>
                      </div>
                      <div className="col-md-3 d-flex align-items-center">
                        <IconButton
                          style={{
                            color: "black",
                            backgroundColor: "#EAECF0",
                            padding: "5px",
                          }}
                        >
                          <Grain style={{ width: "25px", height: "25px" }} />
                        </IconButton>
                        <div className="ml-3">
                          <h2>
                            {rowDto?.intNumOfEligibleYearForGratuity || "N/A"}
                          </h2>
                          <p>No. Of Eligible Year For Gratuity</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>{!loading && <NoResult title="You have no application." />}</>
              )}
            </div>
          </>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
}
