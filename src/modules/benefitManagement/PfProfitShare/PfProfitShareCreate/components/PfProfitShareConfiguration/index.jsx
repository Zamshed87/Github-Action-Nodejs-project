import { PCardBody } from "Components";
import PfProfitShareFilter from "./PfProfitShareFilter";
import ProfitShareCalculation from "./ProfitShareCalculation";
import ProfitShareDetailsTable from "modules/benefitManagement/PfProfitShare/components/ProfitShareDetailsTable";
import { shallowEqual, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getPfProfitDetailsData } from "./helper";

const PfProfitShareConfiguration = ({ form, fetchPfShare, data, setData }) => {
  const [loading, setLoading] = useState(true);
  const [detailsData, setDetailsData] = useState({});

  const {
    profileData: { intAccountId },
  } = useSelector((store) => store?.auth, shallowEqual);

  useEffect(() => {
    if (intAccountId) {
        getPfProfitDetailsData(intAccountId,'','', setLoading, setDetailsData);
    }
  }, [intAccountId]);
  return (
    <PCardBody>
      <div className="d-flex mb-3">
        <div
          style={{
            flex: 3,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginBottom: "1rem",
          }}
        >
          <PfProfitShareFilter form={form} fetchPfShare={fetchPfShare} />
          <ProfitShareCalculation form={form} data={data} setData={setData} />
        </div>
        <div style={{ flex: 2 }}>
          <ProfitShareDetailsTable loading={loading} data={detailsData} />
        </div>
      </div>
    </PCardBody>
  );
};

export default PfProfitShareConfiguration;
