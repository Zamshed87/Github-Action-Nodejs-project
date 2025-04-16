import { DataTable } from "Components";
import { getDesignationWiseSalaryDisburseHeader } from "../helper";
import { Table } from "antd";

const HRPosition = ({ reportType, data }) => {
  return (
    <div>
      <h3 className="pb-3 pt-3">{`HR Position: ${
        data?.hrPosDesig ?? "N/A"
      }`}</h3>
      <DataTable
        header={getDesignationWiseSalaryDisburseHeader(reportType)}
        bordered
        data={data?.details || []}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={5} align="center">
              Total Amount
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              {data?.totalAmount}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </div>
  );
};

export default HRPosition;
