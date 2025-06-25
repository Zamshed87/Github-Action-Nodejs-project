import { DataTable } from "Components";
import { useEffect, useState } from "react";
import { getViewHeader, viewPFProfitShare } from "../../helper";
import { shallowEqual, useSelector } from "react-redux";

const ProfitShareView = ({ data }) => {
  const { buId, intAccountId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [landingData, setLandingData] = useState([]);
  useEffect(() => {
    viewPFProfitShare(
      {
        accountId: intAccountId,
        buId: buId,
        headerId: data?.headerId,
      },
      setLandingData,
      setLoading
    );
  }, []);
  return (
    <>
      {landingData && (
        <DataTable
          header={getViewHeader(pages)}
          bordered
          data={landingData?.data || []}
          loading={loading}
          scroll={{ x: 2000 }}
          pagination={{
            pageSize: landingData?.pageSize,
            total: landingData?.totalCount,
            pageSizeOptions: ["25", "50", "100"],
          }}
          onChange={(pagination, _, __, extra) => {
            if (extra.action === "paginate") {
              viewPFProfitShare(
                {
                  accountId: intAccountId,
                  buId: buId,
                  headerId: data?.headerId,
                },
                setLoading
              );
              setPages(pagination);
            }
          }}
        />
      )}
    </>
  );
};

export default ProfitShareView;
