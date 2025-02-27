import { DataTable } from "Components";
import { getHeader } from "./helper";
import { Table } from "antd";
import { useHistory } from "react-router-dom";

const KeyPerformanceIndicatorDetails = ({ details }) => {
  const history = useHistory();
  const dataRows = [];
  if (details != null && details.kpiDetails != null) {
    details.kpiDetails.forEach((item) => {
      details.kpiScoreHeaders.forEach((header, index) => {
        const found = item.achivements.find((x) => x.title === header);
        item["kpiScore." + index] = found ? found.score : "";
      });
      dataRows.push(item);
    });
  }
  return (
    <div>
      <h3 className="pb-3 pt-3">Key Performance Indicator (KPI) Details</h3>
      <DataTable
        header={getHeader(
          details?.kpiDetails?.length,
          details?.totalKPIScoreByScale,
          history,
          details
        )}
        bordered
        data={details?.kpiDetails || []}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={4} align="end">
              Total
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              {details?.kpiTotal?.weight}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              {details?.kpiTotal?.target}
            </Table.Summary.Cell>
            {details?.kpiScoreHeaders?.map((header) => {
              const found = details?.kpiTotal?.achivements?.find(
                (x) => x.title === header
              );
              return (
                <Table.Summary.Cell align="center">
                  {found ? found.score : ""}
                </Table.Summary.Cell>
              );
            })}
            <Table.Summary.Cell align="center">
              {details?.kpiTotal?.avgKPIScore}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              {details?.totalKPIScoreByScale}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </div>
  );
};

export default KeyPerformanceIndicatorDetails;
