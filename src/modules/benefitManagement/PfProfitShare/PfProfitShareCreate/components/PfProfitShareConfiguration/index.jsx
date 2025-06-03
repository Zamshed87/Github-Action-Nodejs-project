import { PCardBody } from "Components";
import PfProfitShareFilter from "./PfProfitShareFilter";
import ProfitShareCalculation from "./ProfitShareCalculation";
import ProfitShareDetailsTable from "modules/benefitManagement/PfProfitShare/components/ProfitShareDetailsTable";

const PfProfitShareConfiguration = ({ form, fetchPfShare, getPfProfitDetailsData, data, setData, detailsLoading, detailsData }) => {

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
          <ProfitShareCalculation form={form} data={data} setData={setData} getPfProfitDetailsData={getPfProfitDetailsData} />
        </div>
        <div style={{ flex: 2 }}>
          <ProfitShareDetailsTable loading={detailsLoading} data={detailsData} />
        </div>
      </div>
    </PCardBody>
  );
};

export default PfProfitShareConfiguration;
