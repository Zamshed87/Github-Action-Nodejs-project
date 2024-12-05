import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { DoubleArrow } from "@material-ui/icons";
import ObjectiveImg from "./images/objective.png";
import KpiImg from "./images/kpi.png";
import SrfImg from "./images/srf.png";
import TargetImg from "./images/target.png";
import AchievementImg from "./images/achievement.png";
import ProgressImg from "./images/progress.png";
import "./styles.css";

const IndividualKpiPresentation = () => {
  const { currentItem, newData, heading, year } = useSelector(
    (state) => state?.localStorage?.SBUBalancedScorecardData
  );

  useEffect(() => {
    setIndex(currentItem?.index);
  }, [currentItem]);
  let colorArr = ["#a6a6a6", "#ffd966"];
  const [index, setIndex] = useState("");
  const [datas, setDatas] = useState([]);
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    setIndex(currentItem.index);
    setDatas(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem]);

  const handleArrowRight = () => {
    // right arrow key
    if (datas[index + 1]) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }

    if (colorArr[colorIndex + 1]) {
      setColorIndex(colorIndex + 1);
    } else {
      setColorIndex(0);
    }
  };

  const handleArrowLeft = () => {
    // left arrow key
    if (datas[index - 1]) {
      setIndex(index - 1);
    } else {
      setIndex(datas.length - 1);
    }
    if (colorArr[colorIndex - 1]) {
      setColorIndex(colorIndex - 1);
    } else {
      setColorIndex(colorArr.length - 1);
    }
  };

  return (
    <div className="mt-5">
      <div className="sbu-balanced-report-wrapper">
        <div className="sbu-balanced-report-container">
          <div className="sbu-balanced-report-header">
            <h2 style={{ textAlign: "center", color: "#344054" }}>
              {" "}
              {heading}
            </h2>
            {/* <h3 style={{ textAlign: "center", color: "#344054" }}>
              {sbuName ? `${sbuName}` : ""}
            </h3> */}
            <p className="mt-2 mb-5">
              {year}
              {/* {newData[index]?.strFrequency} ({from?.label} - {to?.label},
              {year?.label}) */}
            </p>
          </div>
          <div className="sbu-balanced-report-body">
            <div className="row">
              <div className="col-md-12">
                {" "}
                <div className="button-container-grid row justify-content-between">
                  <div
                    className="col-md-3 button"
                    style={{
                      backgroundColor:
                        newData[index]?.heading === "Financial"
                          ? "#2ECC71"
                          : newData[index]?.heading === "Customer"
                          ? "#3498DB"
                          : newData[index]?.heading === "Internal Process"
                          ? "#E67E22"
                          : "#FF7F50",
                      color: "#FFFFFF !important",
                      fontWeight: 600,
                    }}
                  >
                    <p style={{ marginRight: "1rem" }}>
                      <DoubleArrow />
                    </p>
                    <p style={{ fontSize: "1.3rem" }}>
                      {newData[index]?.heading}
                    </p>
                  </div>
                  <div className="pagination-btn-wrapper">
                    <span
                      onClick={() => handleArrowLeft()}
                      className="prev-btn"
                      style={{ borderRadius: "50%", padding: "10px 15px" }}
                    >
                      <i class="fa fa-chevron-left" aria-hidden="true"></i>
                    </span>
                    <span style={{ padding: "0px 8px" }}>
                      {index + 1} / {newData?.length}
                    </span>
                    <span
                      onClick={() => handleArrowRight()}
                      className="next-btn"
                      style={{ borderRadius: "50%", padding: "10px 15px" }}
                    >
                      <i class="fa fa-chevron-right" aria-hidden="true"></i>
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 scorecard-container">
                    <div className="scorecard-grid">
                      <div className="scorecard">
                        <div className="scorecard-heading">
                          <div className="scorecard-title objective">
                            <p>Objective</p>
                          </div>
                          <img
                            className="vector-img"
                            src={ObjectiveImg}
                            alt="vector"
                          />
                        </div>
                        <div className="scorecard-body-container">
                          <div
                            className="scorecard-body"
                            style={{
                              textAlign: "left",
                              width: "100%",
                              fontWeight: 500,
                              fontSize: "20px",
                              color: "#101828",
                            }}
                          >
                            {newData[index]?.objective}
                          </div>
                        </div>
                      </div>
                      <div className="scorecard">
                        <div className="scorecard-heading">
                          <div className="scorecard-title kpi">
                            <p>KPI</p>
                          </div>
                          <img
                            className="vector-img"
                            src={KpiImg}
                            alt="vector"
                          />
                        </div>{" "}
                        <div className="scorecard-body-container">
                          <div
                            className="scorecard-body"
                            style={{
                              textAlign: "left",
                              width: "100%",
                              fontWeight: 500,
                              fontSize: "20px",
                              color: "#101828",
                            }}
                          >
                            {newData[index]?.kpi}
                          </div>
                        </div>
                      </div>
                      <div className="scorecard">
                        <div className="scorecard-heading">
                          <div className="scorecard-title srf">
                            <p>SRF</p>
                          </div>
                          <img
                            className="vector-img"
                            src={SrfImg}
                            alt="vector"
                          />
                        </div>
                        <div className="scorecard-body-container">
                          <div
                            className="scorecard-body"
                            style={{
                              textAlign: "left",
                              width: "100%",
                              fontWeight: 500,
                              fontSize: "20px",
                              color: "#101828",
                            }}
                          >
                            {newData[index]?.strFrequency}
                          </div>
                        </div>
                      </div>
                      <div className="scorecard">
                        <div className="scorecard-heading">
                          <div className="scorecard-title target">
                            <p>Target</p>
                          </div>
                          <img
                            className="vector-img"
                            src={TargetImg}
                            alt="vector"
                          />
                        </div>
                        <div className="scorecard-body-container d-flex justify-content-around align-items-center flex-column">
                          <div
                            style={{ fontSize: "30px" }}
                            className="scorecard-body"
                          >
                            {newData[index]?.numTarget || 0}
                          </div>
                          <div style={{ fontSize: "20px", color: "#373737" }}>
                            Previous: {newData[index]?.previousYearTarget || 0}
                          </div>
                        </div>
                      </div>
                      <div className="scorecard">
                        <div className="scorecard-heading">
                          <div className="scorecard-title achievement">
                            <p>Achievement</p>
                          </div>
                          <img
                            className="vector-img"
                            src={AchievementImg}
                            alt="vector"
                          />
                        </div>
                        <div className="scorecard-body-container d-flex justify-content-around align-items-center flex-column">
                          <div
                            style={{ fontSize: "30px" }}
                            className="scorecard-body"
                          >
                            {newData[index]?.numAchivement || 0}
                          </div>
                          <div style={{ fontSize: "20px", color: "#373737" }}>
                            Previous:{" "}
                            {newData[index]?.previousYearAchivement || 0}
                          </div>
                        </div>
                      </div>
                      <div className="scorecard">
                        <div className="scorecard-heading">
                          <div className="scorecard-title Progress">
                            <p>Progress</p>
                          </div>
                          <img
                            className="vector-img"
                            src={ProgressImg}
                            alt="vector"
                          />
                        </div>
                        <div className="scorecard-body-container  d-flex justify-content-around align-items-center flex-column">
                          <div
                            style={{ fontSize: "30px" }}
                            className="scorecard-body"
                          >
                            {(newData[index]?.numAchivement === 0 &&
                              newData[index]?.numTarget === 0) ||
                            newData[index]?.numAchivement === 0 ||
                            newData[index]?.numTarget === 0
                              ? 0
                              : newData[index]?.intMaxMin === 1
                              ? (
                                  (newData[index]?.numAchivement * 100) /
                                  newData[index]?.numTarget
                                ).toFixed(2)
                              : (
                                  (newData[index]?.numTarget * 100) /
                                  newData[index]?.numAchivement
                                ).toFixed(2)}
                            %{" "}
                            {newData[index]?.numAchivement !== 0 &&
                              newData[index]?.numTarget !== 0 && (
                                <i
                                  // className={`ml-2 fas fa-arrow-alt-${report?.arrowText}`}
                                  style={{
                                    fontSize: "30px",
                                    display: "inline",
                                  }}
                                ></i>
                              )}
                          </div>
                          <div style={{ fontSize: "20px", color: "#373737" }}>
                            Previous:{" "}
                            {(newData[index]?.previousYearAchivement === 0 &&
                              newData[index]?.previousYearTarget === 0) ||
                            newData[index]?.previousYearAchivement === 0 ||
                            newData[index]?.previousYearTarget === 0
                              ? 0
                              : newData[index]?.intMaxMin === 1
                              ? (
                                  (newData[index]?.previousYearAchivement *
                                    100) /
                                  newData[index]?.previousYearTarget
                                ).toFixed(2)
                              : (
                                  (newData[index]?.previousYearTarget * 100) /
                                  newData[index]?.previousYearAchivement
                                ).toFixed(2)}
                            %{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 row">
              <div
                className="col-md-12 kpi-remarks-wrapper"
                style={{ backgroundColor: "#FFFFFF", padding: "1.5rem" }}
              >
                <h2
                  style={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: "#344054",
                  }}
                >
                  REMARKS
                </h2>
                <p
                  style={{
                    fontWeight: 400,
                    color: "#172B4D",
                    fontSize: "1.2rem",
                    marginTop: "1.3rem",
                  }}
                >
                  {newData?.[index]?.remarks}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualKpiPresentation;
