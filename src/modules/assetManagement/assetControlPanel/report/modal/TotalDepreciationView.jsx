import React, { useEffect } from "react";
import NoResult from "common/NoResult";
import Loading from "common/loading/Loading";
import PeopleDeskTable from "common/peopleDeskTable";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { totalDepreciationColumn } from "../utils";

const TotalDepreciationView = ({ id }) => {
  const [singleData, getSingleData, loading] = useAxiosGet([]);

  useEffect(() => {
    if (id) {
      getSingleData(`/AssetManagement/GetDepreciationDetail?assetId=${id}`);
    }
  }, [id]);

  return (
    <>
      {loading && <Loading />}
      <div className="row">
        <div className="col-lg-12 pl-4 pr-4">
          {singleData?.length > 0 ? (
            <>
              <PeopleDeskTable
                columnData={totalDepreciationColumn()}
                rowDto={singleData}
                uniqueKey="assetAssignId"
                isPagination={false}
              />
            </>
          ) : (
            <>
              {!loading && (
                <div className="col-12">
                  <NoResult title={"No Data Found"} para={""} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TotalDepreciationView;
