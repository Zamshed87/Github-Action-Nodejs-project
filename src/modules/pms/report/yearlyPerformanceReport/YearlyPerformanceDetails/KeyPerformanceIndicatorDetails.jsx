import { DataTable } from "Components";
import { getHeader } from "./helper";
import { Table } from "antd";
import { useHistory } from "react-router-dom";

const KeyPerformanceIndicatorDetails = ({ details }) => {
  const history = useHistory();
  return (
    <div>
    <h3 className="pb-3 pt-3">Key Performance Indicator (KPI) Details</h3>
      <DataTable 
      header={getHeader(details?.kpiDetails?.length,details?.totalKPIScoreByScale,history)} 
      bordered
      data={details?.kpiDetails || []} 
      summary={() => (
        <Table.Summary.Row>
          <Table.Summary.Cell colSpan={4} align="end">
            Total
          </Table.Summary.Cell>
          <Table.Summary.Cell  align="center">
            {details?.kpiTotal?.weight}
          </Table.Summary.Cell>
          <Table.Summary.Cell  align="center">
            {details?.kpiTotal?.target}
          </Table.Summary.Cell>
          <Table.Summary.Cell  align="center">
            {details?.kpiTotal?.selfAchivement}
          </Table.Summary.Cell>
          <Table.Summary.Cell  align="center">
            {details?.kpiTotal?.supervisorAchivement}
          </Table.Summary.Cell>
          <Table.Summary.Cell  align="center">
            {details?.kpiTotal?.avgKPIScore}
          </Table.Summary.Cell>
          <Table.Summary.Cell  align="center">
            {details?.totalKPIScoreByScale}
          </Table.Summary.Cell>
        </Table.Summary.Row>
      )}
      />
    </div>
  );
};

export default KeyPerformanceIndicatorDetails;
