/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from "react";
import {
  demonstrateBehaviourTableColumn,
  employeeClusterTableColumn,
  onGetCompetencyById,
} from "./helper";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import Loading from "../../../../../common/loading/Loading";
import AntTable from "../../../../../common/AntTable";

const CoreCompetencyView = ({
  buId,
  competencyId,
  clusterList,
  setClusterList,
}) => {
  const [, getCompetencyById, loadingOnGetCompetency] = useAxiosGet();
  const [values, setValues] = useState({});
  const [demonstratedBehaviourList, setDemonstratedBehaviourList] = useState(
    []
  );
  useEffect(() => {
    if (competencyId) {
      onGetCompetencyById({
        buId,
        competencyId,
        getCompetencyById,
        setValues,
        clusterList,
        setClusterList,
        setDemonstratedBehaviourList,
      });
    }
    return () => {
      setValues({});
      setDemonstratedBehaviourList([]);
    };
  }, [competencyId, buId]);
  return (
    <>
      {loadingOnGetCompetency && <Loading />}
      <div className="container">
        <div className="row">
          <p className="col-md-3">
            <b>Competency type</b>
          </p>
          <div className="col-md-9">
            <p>: {values?.competencyType?.label || "N/A"}</p>
          </div>
        </div>
        <div className="row my-1">
          <p className="col-md-3">
            <b>Competency name</b>
          </p>
          <div className="col-md-9">
            <p>: {values?.competencyName || "N/A"}</p>
          </div>
        </div>
        <div className="row my-1">
          <p className="col-md-3">
            <b>Competency definition </b>
          </p>
          <div className="col-md-9">
            <p>: {values?.competencyDefinition || "N/A"}</p>
          </div>
        </div>
        <div className="row my-1">
          <p className="col-md-3">
            <b>Position Group</b>
          </p>
          <div className="col-md-9">
            <p>: {values?.employeeLabel?.label || "N/A"}</p>
          </div>
        </div>
        <div className="row my-1">
          <p className="col-md-3">
            <b>Desired Value</b>
          </p>
          <div className="col-md-9">
            <p>: {values?.desiredValue || "N/A"}</p>
          </div>
        </div>
        <hr />
        {/* <div className="row">
          <div className="col-md-8">
            {clusterList?.length > 0 ? (
              <div className="table-card-styled table-responsive tableOne mb-2">
                <AntTable
                  tableContainerClass=""
                  removePagination={true}
                  data={clusterList || []}
                  columnsData={employeeClusterTableColumn({
                    clusterList,
                    setClusterList,
                    fromView: true,
                  })}
                />
              </div>
            ) : (
              <p className="text-center">
                Warning : There is no cluster list for employee
              </p>
            )}
          </div>
        </div> */}
        <hr />
        <div className="row">
          <div className="col-md-12">
            {demonstratedBehaviourList?.length > 0 ? (
              <div className="table-card-styled table-responsive tableOne mb-2">
                <AntTable
                  data={demonstratedBehaviourList || []}
                  removePagination={true}
                  columnsData={demonstrateBehaviourTableColumn({
                    demonstratedBehaviourList,
                    fromView: true,
                  })}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(CoreCompetencyView);
