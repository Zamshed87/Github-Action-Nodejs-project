import { DataTable } from "Components";
import { getBankWiseSalaryDisburseHeader } from "./helper";
import { Table } from "antd";

const BankWiseSalaryDisburse = ({ data }) => {

  return (
    <div>
      <h3 className="pb-3 pt-3">HR Position: Staff</h3>
      <DataTable
        header={getBankWiseSalaryDisburseHeader()}
        bordered
        data={data?.bankWiseSalaryDisburse || []}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={2} align="center">
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

export default BankWiseSalaryDisburse;
