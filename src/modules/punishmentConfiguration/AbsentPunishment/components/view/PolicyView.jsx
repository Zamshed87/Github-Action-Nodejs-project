import axios from "axios";
import { DataTable, PCardBody } from "Components";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { detailsHeader } from "../absentPunishmentConfiguration/helper";
import Loading from "common/loading/Loading";

const PolicyView = ({ data }) => {
  const [detail, setDetail] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/AbsentPunishment/GetDetailsById?policyId=${data?.policyId}`
        );
        setDetail(res?.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, [data]);

  return (
    <>
      {loading && <Loading />}
      {!loading && detail && (
        <>
          <p>
            <strong>Policy Name:</strong> {detail?.policyName || "N/A"}
          </p>
          <p>
            <strong>Workplace:</strong> {detail?.workplaceName || "N/A"}
          </p>
          <p>
            <strong>Employment Types:</strong>{" "}
            {detail?.employmentTypeList?.join(", ") || "N/A"}
          </p>
          <p>
            <strong>Designations:</strong>{" "}
            {detail?.designationList?.join(", ") || "N/A"}
          </p>
          <p>
            <strong>Calculation Type:</strong>{" "}
            {detail?.absentCalculationTypeName || "N/A"}
          </p>
          {detail?.policyDescription && (
            <p>
              <strong>Description:</strong> {detail?.policyDescription}
            </p>
          )}
        <div style={{marginBottom:"20px"}}></div>
          {detail?.absentPunishmentElementDetailsDto?.length > 0 && (
            <DataTable
              bordered
              data={detail?.absentPunishmentElementDetailsDto}
              rowKey={(row, idx) => idx}
              header={detailsHeader(
                setDetail,
                detail?.absentCalculationType,
                false
              )}
            />
          )}
        </>
      )}
    </>
  );
};

export default PolicyView;
