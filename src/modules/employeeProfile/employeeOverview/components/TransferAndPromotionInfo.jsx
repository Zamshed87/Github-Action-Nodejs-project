import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import HistoryTransferTable from "../../transferNPromotion/transferNPromotion/components/HistoryTransferTable";
import { getTransferAndPromotionHistoryById } from "../../transferNPromotion/transferNPromotion/helper";

const TransferAndPromotionInfo = ({ index, tabIndex, empId }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getTransferAndPromotionHistoryById(
      orgId,
      empId,
      setHistoryData,
      setLoading,
      buId,
      wgId
    );
  }, [orgId, empId, buId, wgId]);

  return (
    index === tabIndex && (
      <>
        <div className="common-overview-part">
          <div className="common-overview-content">
            {loading && <Loading />}
            {historyData?.length ? (
              <HistoryTransferTable historyData={historyData} />
            ) : (
              <div className="pb-4">
                <NoResult title={"No Transfer And Promotion History Found"} />
              </div>
            )}
          </div>
        </div>
      </>
    )
  );
};

export default TransferAndPromotionInfo;
