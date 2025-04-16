import { DataTable } from "Components";
import { getBarHeader } from "./helper";
import { Table } from "antd";

const BankWiseSalaryDisburse = ({ data }) => {

  return (
    <div>
      <h3 className="pb-3 pt-3">Behaviorally Anchored Rating (BAR) Details</h3>
      <DataTable
        header={getBarHeader(
          data?.bardata?.length,
          data?.stakeholderTypeTotalBARScoreByScale,
        )}
        bordered
        data={data?.barDetails || []}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={2} align="end">
              Total
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              {data?.barTotal?.weight}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              {data?.barTotal?.desiredValue}
            </Table.Summary.Cell>
            {data?.barScoreHeaders?.map((header,index) => {
              const found = data?.barTotal?.scores?.find(
                (x) => x.title === header
              );
              return (
                <Table.Summary.Cell align="center" key={index + 1}>
                  {found ? found.score : ""}
                </Table.Summary.Cell>
              );
            })}
            <Table.Summary.Cell align="center">
              {data?.stakeholderTypeTotalBARScoreByScale}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
        // scroll={{ x: "200px" }}
      />
    </div>
  );
};

export default BankWiseSalaryDisburse;
