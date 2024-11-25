/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from "react";
import AntTable from "../../../../../common/AntTable";
import Loading from "../../../../../common/loading/Loading";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import {
  demonstrateBehaviourTableColumn,
  onGetCoreValuesyById,
} from "./helper";

const CoreValuesView = ({ buId, coreValueId, clusterList, setClusterList }) => {
  const [, getCoreValuesById, loadingOnGetValues] = useAxiosGet();
  const [values, setValues] = useState({});
  const [demonstratedBehaviourList, setDemonstratedBehaviourList] = useState(
    []
  );
  useEffect(() => {
    if (coreValueId) {
      onGetCoreValuesyById({
        buId,
        coreValueId,
        getCoreValuesById,
        setValues,
        setDemonstratedBehaviourList,
      });
    }
    return () => {
      setValues({});
      setDemonstratedBehaviourList([]);
    };
  }, [coreValueId, buId]);

  return (
    <>
      {loadingOnGetValues && <Loading />}
      <div className="container">
        <div className="row my-1">
          <p className="col-md-3">
            <b>Core values name</b>
          </p>
          <div className="col-md-9">
            <p>: {values?.coreValueName || "N/A"}</p>
          </div>
        </div>
        <div className="row my-1">
          <p className="col-md-3">
            <b>Core values definition </b>
          </p>
          <div className="col-md-9">
            <p>: {values?.coreValueDefinition || "N/A"}</p>
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
      {/* <div className="container">
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
      </div> */}
    </>
  );
};

export default memo(CoreValuesView);
