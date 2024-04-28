import React, { useEffect } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { salesViewColumn } from "../utils";
import PeopleDeskTable from "common/peopleDeskTable";
import Loading from "common/loading/Loading";
import NoResult from "common/NoResult";

const SalesView = ({ id }) => {
  const [singleData, getSingleData, loading] = useAxiosGet([]);

  useEffect(() => {
    if (id) {
      getSingleData(`/AssetManagement/GetSalableAssetItemList?id=${id}`);
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
                columnData={salesViewColumn()}
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

export default SalesView;
