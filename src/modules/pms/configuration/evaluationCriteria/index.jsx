import { useHistory } from "react-router-dom";
import { AddOutlined, Edit, Grain } from "@mui/icons-material";
import { toast } from "react-toastify";
import React, { useMemo } from "react";
import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import PrimaryButton from "../../../../common/PrimaryButton";
import Loading from "../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { IconButton } from "@mui/material";

const EvaluationCriteria = () => {
  const [criteriaList, getCriteriaList, criteriaListLoader] = useAxiosGet();
  // const [rowDto, getRowData, rowDataLoader] = useAxiosGet();
  const { profileData } = useSelector((state) => state?.auth, shallowEqual);
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getCriteriaList(
      `/PMS/GetEvaluationCriteria?accountId=${profileData?.intAccountId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30469),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <>
      {criteriaListLoader && <Loading />}
      <div className="table-card">
        <div className="table-card-heading justify-content-end">
          <ul className="d-flex flex-wrap">
            <ul className="d-flex flex-wrap">
              {criteriaList?.scoreScaleId ? (
                <li>
                  <PrimaryButton
                    type="button"
                    className="btn btn-default flex-center"
                    label={"Edit"}
                    icon={
                      <Edit sx={{ marginRight: "11px", fontSize: "16px" }} />
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!permission?.isEdit)
                        return toast.warn("You don't have permission");
                      history.push({
                        pathname: `/pms/configuration/EvaluationCriteria/edit/${criteriaList?.scoreScaleId}`,
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
                      history.push(
                        "/pms/configuration/EvaluationCriteria/create"
                      );
                    }}
                  />
                </li>
              )}
            </ul>
          </ul>
        </div>

        <div className="table-card-body about-info-card policy-details">
          <div className="row mb-4">
            <div className="col-12 mb-4">
              <h1>Configuration</h1>
            </div>
            {criteriaList?.positionGroupWiseCriteriaList?.map((item, index) => (
              <div className="col-md-2 d-flex align-items-center mb-2">
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
                  <h2>{item?.positionGroupName}</h2>
                  <p>{item?.evaluationCriteriaOfPMS}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="table-card-body about-info-card policy-details">
          <div className="row mb-4">
            <div className="col-lg-6">
              <h2>Score and Scale for BSC</h2>
              <div className="d-flex align-items-center mb-2 mt-4">
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
                  <h3>Key Performance Indicator - KPI</h3>
                  <p>{criteriaList?.percentageOfKPI}</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
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
                  <h3>Behaviorally Anchored Rating - BAR</h3>
                  <p>{criteriaList?.percentageOfBAR}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h2>Score and Scale for 360</h2>
              <div className="d-flex align-items-center mb-2 mt-4">
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
                  <h3>Key Performance Indicator - KPI</h3>
                  <p>{criteriaList?.percentageOfKPI360 || "N/A"}</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
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
                  <h3>Behaviorally Anchored Rating - BAR</h3>
                  <p>{criteriaList?.percentageOfBAR360 || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="table-card-body about-info-card policy-details">
          <div className="row mb-4">
            <div className="col-12 mb-4">
              <h2>Behavioral Scale</h2>
            </div>
            {criteriaList?.scaleList?.map((item, index) => (
              <div className="col-md-2 d-flex align-items-center mb-2">
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
                  <h2>{item?.scaleName}</h2>
                  <p>{item?.scaleValue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EvaluationCriteria;
