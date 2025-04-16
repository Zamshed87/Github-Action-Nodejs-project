import { DataTable } from "Components";
import { getHeader } from "../helper";
import { Table } from "antd";

const HRPositionExecutive = ({ data }) => {

  return (
    <div>
      <h3 className="pb-3 pt-3">Key Performance Indicator (KPI) Details</h3>
      <DataTable
        header={getHeader(
          data?.kpidata?.length,
          data?.stakeholderTypeTotalKPIScoreByScale,
        )}
        bordered
        data={data?.kpiDetails || []}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={4} align="end">
              Total
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              {data?.kpiTotal?.weight}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              {data?.kpiTotal?.target}
            </Table.Summary.Cell>
            {data?.kpiScoreHeaders?.map((header,index) => {
              const found = data?.kpiTotal?.achivements?.find(
                (x) => x.title === header
              );
              return (
                <Table.Summary.Cell align="center" key={index + 1}>
                  {found ? found.score : ""}
                </Table.Summary.Cell>
              );
            })}
            <Table.Summary.Cell align="center">
              {data?.stakeholderTypeTotalKPIScoreByScale}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
        scroll={{ x: "2200px" }}
      />
    </div>
  );
};

export default HRPositionExecutive;
