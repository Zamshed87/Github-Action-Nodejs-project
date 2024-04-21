import { memo } from "react";
import { gray700 } from "utility/customColor";
import { settlementData } from "../utility/utils";
import AntTable from "common/AntTable";
import { numberWithCommas } from "utility/numberWithCommas";

const FinalSettlementCard = ({ finalSettlement }) => {
  return (
    <div className="card-about-info-main about-info-card">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div className="content-about-info-card ml-3">
            <div className="d-flex justify-content-between">
              <h4 className="name-about-info" style={{ marginBottom: "5px" }}>
                {finalSettlement?.employeeName}
              </h4>
            </div>
            {settlementData(finalSettlement)?.map((dto) => (
              <div className="single-info" key={dto?.title}>
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    {dto?.title} -
                  </small>{" "}
                  {dto?.value || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="row px-4">
        {finalSettlement?.monthlyCompensation?.length > 0 ? (
          <div
            className="table-card-styled tableOne mt-2"
            style={{ width: "100%" }}
          >
            <AntTable
              data={finalSettlement?.monthlyCompensation}
              removePagination={true}
              columnsData={[
                // {
                //   title: "SL",
                //   render: (text, record, index) => index + 1,
                //   sorter: false,
                //   filter: false,
                // },
                {
                  title: "Monthly Compensation",
                  dataIndex: "salaryElement",
                  sorter: true,
                  filter: false,
                  render: (_, record) => (
                    <span>
                      {record?.salaryElement === "Total Gross" ? (
                        <b>{record?.salaryElement}</b>
                      ) : (
                        record?.salaryElement
                      )}
                    </span>
                  ),
                  // width: "200px",
                },
                {
                  title: "Amount (BDT)",
                  dataIndex: "amount",
                  render: (_, record) => (
                    <div className="text-right">
                      {record?.salaryElement === "Total Gross" ? (
                        <b>{numberWithCommas(record?.amount?.toFixed(2))}</b>
                      ) : (
                        numberWithCommas(record?.amount?.toFixed(2))
                      )}
                    </div>
                  ),
                  className: "text-right",
                  sorter: true,
                  filter: false,
                  isNumber: true,
                  // width: "200px",
                },
              ]}
              x={700}
              rowKey={(record) => record?.salaryElement}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default memo(FinalSettlementCard);
