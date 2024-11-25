import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Loading from "../../../../common/loading/Loading";
import PmsCentralTable from "../../../../common/pmsTable";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import BackButton from "../../../../common/BackButton";

const initData = {
  year: "",
  quarter: "",
  department: "",
  evaluationCriteria: "",
};

const PerformanceMarkingView = () => {
  const [tableData, getTableData, tableDataLoader] = useAxiosGet();

  // const [currentItem, setCurrentItem] = useState("");
  // const [isShowModal, setIsShowModal] = useState(false);

  const location = useLocation();

  const { employeeId, businessUnitId, yearId, fromMonth, toMonth } =
    location?.state || {};

  console.log("location", location);

  const {
    // permissionList,
    profileData: { orgId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const { values } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
  });

  const getData = (values) => {
    getTableData(
      `/PMS/GetKpiChartReport?PartName=TargetedKPI&BusinessUnit=${businessUnitId}&YearId=${yearId}&KpiForId=1&KpiForReffId=${employeeId}&accountId=${orgId}&from=${fromMonth}&to=${toMonth}`
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className="table-card">
      {tableDataLoader && <Loading />}
      <div className="table-card-heading">
        <div className="d-flex align-items-center my-1">
          <BackButton />
          <h2>Performance Marking Report</h2>
        </div>
      </div>
      <div className="achievement">
        <PmsCentralTable
          header={[
            { name: "BSC" },
            { name: "Objective" },
            { name: "KPI" },
            { name: "SRF" },
            { name: "Weight" },
            { name: "Benchmark" },
            { name: "Target" },
            { name: "Ach." },
            { name: "Progress" },
            { name: "Score" },
          ]}
        >
          {tableData?.infoList?.map((itm, indx) => (
            <>
              {itm.dynamicList.map((item, index) => (
                <tr
                  key={item?.kpiId}
                  style={{
                    backgroundColor:
                      item?.isTargetAssigned || item?.parentName === "Total"
                        ? "white"
                        : "#e6e6e6",
                  }}
                >
                  {index === 0 && (
                    <td
                      className={`bsc bsc${indx}`}
                      rowSpan={itm.dynamicList.length}
                    >
                      <div>{itm?.bsc}</div>
                    </td>
                  )}
                  {item?.isParent && (
                    <td className="obj" rowSpan={item?.numberOfChild}>
                      {" "}
                      {item?.parentName}{" "}
                    </td>
                  )}
                  <td
                    style={{
                      width: "250px",
                    }}
                  >
                    {" "}
                    {item?.label}{" "}
                  </td>
                  <td> {item?.strFrequency} </td>
                  <td className="text-center">
                    {" "}
                    {item?.numWeight === 0 ? "" : item?.numWeight}{" "}
                  </td>
                  <td className="text-center">
                    {" "}
                    {item?.benchmark === 0 ? "" : item?.benchmark}{" "}
                  </td>
                  <td className="text-center">
                    {" "}
                    {item?.numTarget === 0 ? "" : item?.numTarget}{" "}
                  </td>
                  {item?.parentName !== "Total" ? (
                    <td className="text-center">
                      <span>
                        <OverlayTrigger
                          overlay={
                            <Tooltip
                              id="tooltip-disabled"
                              style={{
                                fontSize: "11px",
                              }}
                            >
                              Achievement Entry
                            </Tooltip>
                          }
                        >
                          <span
                            style={{
                              cursor: "pointer",
                              color: "blue",
                              textDecoration: "underline",
                            }}
                            onClick={() => {
                              // setCurrentItem({ ...item });
                              // setIsShowModal(true);
                            }}
                          >
                            {item?.numAchivement}
                          </span>
                        </OverlayTrigger>
                      </span>
                    </td>
                  ) : (
                    <td></td>
                  )}
                  {item?.parentName !== "Total" ? (
                    <td
                      style={{
                        minWidth: "90px",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      <span>{item?.progress} % </span>
                      {/* <i
                            className={`fas fa-arrow-alt-${item?.arrowText}`}
                          ></i> */}
                      {item?.arrowText === "up" ? (
                        <ArrowCircleUpIcon
                          style={{
                            color: "green",
                            fontSize: "20px",
                          }}
                        />
                      ) : item?.arrowText === "down" ? (
                        <ArrowCircleDownIcon
                          style={{
                            color: "red",
                            fontSize: "20px",
                          }}
                        />
                      ) : null}
                    </td>
                  ) : (
                    <td></td>
                  )}
                  <td className="text-center"> {item?.score}</td>
                </tr>
              ))}
            </>
          ))}
        </PmsCentralTable>
      </div>

      {/* <ViewModal
        size="xl"
        title="Individual KPI Entry"
        backdrop="static"
        classes="default-modal preview-modal"
        show={isShowModal}
        onHide={() => setIsShowModal(false)}
      >
        <IndividualKpiModal
          currentItem={currentItem}
          setIsShowModal={setIsShowModal}
          getData={getData}
        />
      </ViewModal> */}
    </div>
  );
};

export default PerformanceMarkingView;
