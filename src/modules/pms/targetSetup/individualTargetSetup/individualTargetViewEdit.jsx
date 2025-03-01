import React from "react";
import Loading from "../../../../common/loading/Loading";
import BackButton from "../../../../common/BackButton";
import { useLocation } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { EditOutlined } from "@mui/icons-material";
import ViewModal from "../../../../common/ViewModal";
import { useState } from "react";
import TargetEntryModal from "./targetEntryModal";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import PmsCentralTable from "../../../../common/pmsTable";
import VisibilityIcon from "@mui/icons-material/Visibility";

const IndividualTargetViewEdit = () => {
  const location = useLocation();
  const [currentItem, setCurrentItem] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const { isEdit, empInfo, prevlandingValues } = location?.state;
  const { buId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { empId } = useParams();
  const [tableData, getTableData, tableDataLoader] = useAxiosGet();

  const getLandingData = () => {
    getTableData(
      `/PMS/GetKpiChartReport?PartName=MappedKPI&BusinessUnit=${buId}&YearId=${prevlandingValues?.year?.value}&KpiForId=1&KpiForReffId=${empId}&accountId=${orgId}&pmTypeId=${empInfo?.pmTypeId}`
    );
  };
  useEffect(() => {
    getLandingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, prevlandingValues]);
  console.log(empInfo, "empInfo");
  return (
    <>
      {tableDataLoader && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div className="d-flex align-items-center">
            <BackButton />
            <h2>{isEdit ? "Target Setup" : "Target Setup Details"}</h2>
          </div>
        </div>
        <div className="card-style pb-0 mb-2">
          <div className="row">
            <div className="col-lg-12 pt-2 pb-2">
              <h6 className="mb-2">
                <strong>Name: </strong> {empInfo?.employeeName}{" "}
                <strong className="ml-1">Department: </strong>{" "}
                {empInfo?.departmentName}{" "}
                <strong className="ml-1">Designation: </strong>{" "}
                {empInfo?.designationName}{" "}
                <strong className="ml-1">Year: </strong> {empInfo?.yearName}
              </h6>
            </div>
          </div>
        </div>
        {/* table */}
        <div className="table-card-body">
          <PmsCentralTable
            header={[
              { name: "BSC" },
              { name: "Objective" },
              { name: "KPI" },
              { name: "SRF" },
              { name: "Agg. Type" },
              { name: "Weight" },
              { name: "Benchmark" },
              { name: "Target" },
              { name: "Action" },
            ]}
          >
            {tableData?.infoList?.map((itm, indx) => (
              <>
                {itm.dynamicList.map((item, index) => (
                  <tr key={item?.kpiId}>
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
                        backgroundColor:
                          item?.isTargetAssigned || item?.parentName === "Total"
                            ? "white"
                            : "#e6e6e6",
                      }}
                    >
                      {" "}
                      {item?.label}{" "}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          item?.isTargetAssigned || item?.parentName === "Total"
                            ? "white"
                            : "#e6e6e6",
                      }}
                    >
                      {" "}
                      {item?.strFrequency}{" "}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          item?.isTargetAssigned || item?.parentName === "Total"
                            ? "white"
                            : "#e6e6e6",
                      }}
                    >
                      {" "}
                      {item?.strAggregationType || ""}{" "}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          item?.isTargetAssigned || item?.parentName === "Total"
                            ? "white"
                            : "#e6e6e6",
                      }}
                    >
                      {" "}
                      {item?.numWeight === 0 ? "" : item?.numWeight}{" "}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          item?.isTargetAssigned || item?.parentName === "Total"
                            ? "white"
                            : "#e6e6e6",
                      }}
                    >
                      {" "}
                      {item?.benchmark === 0 ? "" : item?.benchmark}{" "}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          item?.isTargetAssigned || item?.parentName === "Total"
                            ? "white"
                            : "#e6e6e6",
                      }}
                    >
                      {" "}
                      {item?.numTarget === 0 ? "" : item?.numTarget}{" "}
                    </td>
                    {isEdit
                      ? item?.parentName !== "Total" && (
                          <td className="text-center">
                            <OverlayTrigger
                              overlay={
                                <Tooltip
                                  id="tooltip-disabled"
                                  style={{
                                    fontSize: "11px",
                                  }}
                                >
                                  Edit
                                </Tooltip>
                              }
                            >
                              <EditOutlined
                                style={{
                                  cursor: "pointer",
                                  fontSize: "15px",
                                }}
                                onClick={() => {
                                  setCurrentItem({
                                    ...item,
                                  });
                                  setIsShowModal(true);
                                }}
                              />
                            </OverlayTrigger>
                          </td>
                        )
                      : item?.parentName !== "Total" && (
                          <td className="text-center">
                            <OverlayTrigger
                              overlay={
                                <Tooltip
                                  id="tooltip-disabled"
                                  style={{
                                    fontSize: "11px",
                                  }}
                                >
                                  View Details
                                </Tooltip>
                              }
                            >
                              <VisibilityIcon
                                style={{
                                  cursor: "pointer",
                                  fontSize: "15px",
                                }}
                                onClick={() => {
                                  setCurrentItem({
                                    ...item,
                                  });
                                  setIsShowModal(true);
                                }}
                              />
                            </OverlayTrigger>
                          </td>
                        )}
                  </tr>
                ))}
              </>
            ))}
          </PmsCentralTable>
        </div>
      </div>
      <ViewModal
        size="xl"
        title="KPI Target Entry"
        backdrop="static"
        classes="default-modal preview-modal"
        show={isShowModal}
        onHide={() => {
          setIsShowModal(false);
        }}
      >
        <TargetEntryModal
          currentItem={currentItem}
          setIsShowModal={setIsShowModal}
          year={empInfo?.yearName}
          empInfo={empInfo}
          getLandingData={getLandingData}
          isEdit={isEdit}
        />
      </ViewModal>
    </>
  );
};

export default IndividualTargetViewEdit;
