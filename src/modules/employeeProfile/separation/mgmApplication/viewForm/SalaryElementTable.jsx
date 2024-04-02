import React from 'react'
import AntTable from 'common/AntTable';
import { updatePayrollElementByIndex } from 'modules/employeeProfile/finalSettlement/utility/utils';
import DefaultInput from 'common/DefaultInput';

const SalaryElementTable = ({
  title,
  rowDto,
  setRowDto,
  showHeader,
  isDisabled,
}) => {
  return (
    <div>
      <h2 className="mb-2" style={{ fontSize: "12px", fontWeight: 600 }}>
        {title}
      </h2>
      <div className="row px-2">
        <div style={{ width: "100%", height: "100%" }}>
          <AntTable
            data={rowDto}
            removePagination={true}
            showHeader={showHeader}
            columnsData={[
              {
                title: "Element",
                dataIndex: "strAdditionTypeName",
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
                      disabled={false}
                    />
                  </span>
                ),
                width: "200px",
              },
              {
                title: "Amount in BDT",
                dataIndex: "numAmount",
                className: "text-right",
                width: "140px",
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
                            value: +e.target.value,
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
            rowKey={(record) => record?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default SalaryElementTable