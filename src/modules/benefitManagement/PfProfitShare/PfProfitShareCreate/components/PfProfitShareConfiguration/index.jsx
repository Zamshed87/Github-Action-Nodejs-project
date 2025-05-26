import { PCardBody } from "Components";
import PfProfitShareFilter from "./PfProfitShareFilter";
import ProfitShareCalculation from "./ProfitShareCalculation";

const PfProfitShareConfiguration = ({ form, fetchPfShare, data, setData }) => {
  return (
    <PCardBody styles={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: 1 }}>
        <PfProfitShareFilter form={form} fetchPfShare={fetchPfShare} />
      </div>
      <div style={{ flex: 1 }}>
        <ProfitShareCalculation form={form} data={data} setData={setData} />
      </div>
    </PCardBody>
  );
};

export default PfProfitShareConfiguration;
