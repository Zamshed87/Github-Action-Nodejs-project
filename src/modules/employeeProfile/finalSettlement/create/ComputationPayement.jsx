import React, { memo } from "react";
import { updatePayrollElementByIndex } from "../utility/utils";
import AntTable from "common/AntTable";
import DefaultInput from "common/DefaultInput";
import { numberWithCommas } from "utility/numberWithCommas";

const ComputationPayement = ({ propsObj }) => {
  const {
    rowDto,
    setRowDto,
    total,
    title,
    footerTitle,
    showHeader,
    isDisabled,
  } = propsObj || {};
  return rowDto?.length > 0 ? (
    <div>
      <h2 className="mb-2" style={{ fontSize: "12px", fontWeight: 600 }}>
        {title}
      </h2>
      <div className="row px-2">
        <div style={{ width: "100%", height: "100%" }}>
          <AntTable
            data={
              isDisabled ? rowDto?.filter((item) => item.numAmount) : rowDto
            }
            removePagination={true}
            columnsData={[
              {
                title: "Element",
                dataIndex: "strPayrollElementName",
                width: "200px",
              },
              {
                title: "Remarks",
                dataIndex: "strRemarks",
                className: "text-left",
                render: (_, record, index) => (
                  <span>
                    <DefaultInput
                      classes="input-sm"
                      isParentFormContainerClass="mb-0"
                      placeholder=" "
                      value={record?.strRemarks}
                      name="strRemarks"
                      type="text"
                      onChange={(e) => {
                        if (e.target.value) {
                          updatePayrollElementByIndex({
                            index,
                            fieldName: "strRemarks",
                            value: e.target.value,
                            rowDto,
                            setRowDto,
                          });
                        } else {
                          updatePayrollElementByIndex({
                            index,
                            fieldName: "strRemarks",
                            value: "",
                            rowDto,
                            setRowDto,
                          });
                        }
                      }}
                      disabled={isDisabled}
                    />
                  </span>
                ),
                width: "200px",
              },
              {
                title: "Amount in BDT",
                dataIndex: "numAmount",
                className: "text-right",
                width: "120px",
                render: (_, record, index) => (
                  <span>
                    <DefaultInput
                      classes="input-sm"
                      isParentFormContainerClass="mb-0"
                      placeholder=" "
                      value={record?.numAmount}
                      name="numAmount"
                      type="number"
                      min="0"
                      onChange={(e) => {
                        if (e.target.value) {
                          updatePayrollElementByIndex({
                            index,
                            fieldName: "numAmount",
                            value: e.target.value,
                            rowDto,
                            setRowDto,
                          });
                        } else {
                          updatePayrollElementByIndex({
                            index,
                            fieldName: "numAmount",
                            value: "",
                            rowDto,
                            setRowDto,
                          });
                        }
                      }}
                      disabled={isDisabled}
                    />
                  </span>
                ),
              },
            ]}
            showHeader={showHeader}
            y={2000}
            x={800}
            rowKey={(record, index) => record?.intFinalSettlementRowId}
          />
        </div>
      </div>
      <div className="d-flex justify-content-end my-2">
        <p>
          <span className="mr-3">
            <b>{footerTitle ? footerTitle : "Total"}</b>
          </span>
          <span>
            <b>{numberWithCommas(total)}</b>
          </span>
        </p>
      </div>
    </div>
  ) : (
    <> </>
  );
};

export default memo(ComputationPayement);
