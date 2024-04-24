import Loading from "common/loading/Loading";
import React, { useEffect } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { assetDepreciationDetailsColumn, getById } from "../utils";
import NoResult from "common/NoResult";
import PeopleDeskTable from "common/peopleDeskTable";

const AssetDepreciationDetailsView = ({ id, wId, wgId }) => {
  const [singleData, getSingleData, loading] = useAxiosGet([]);

  useEffect(() => {
    if (id) {
      getById(getSingleData, id, wId, wgId);
    }
  }, [id, wId, wgId]);

  return (
    <>
      <div className="row">
        <div className="col-lg-12 pl-4 pr-4">
          {loading && <Loading />}
          {singleData?.length > 0 ? (
            <>
              <PeopleDeskTable
                columnData={assetDepreciationDetailsColumn()}
                rowDto={singleData}
                uniqueKey="assetId"
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

export default AssetDepreciationDetailsView;
