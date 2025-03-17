import { DataTable } from "Components";
import { getBarHeader } from "./helper";
import { Table } from "antd";
import { useHistory } from "react-router-dom";

const BehaviorallyAnchoredRatingBARDetails = ({ details }) => {
  const history = useHistory();
  const dataRows = [];
  if (details != null && details.barDetails != null) {
    details.barDetails.forEach((item) => {
      details.barScoreHeaders.forEach((header, index) => {
        const found = item.scores.find((x) => x.title === header);
        item["barScore." + index] = found ? found.score : "";
      });
      dataRows.push(item);
    });
  }
  return (
    <div>
      <h3 className="pb-3 pt-3">Behaviorally Anchored Rating (BAR) Details</h3>
      <DataTable
        header={getBarHeader(
          details?.barDetails?.length,
          details?.totalBARScoreByScale,
          history,
          details
        )}
        bordered
        data={details?.barDetails || []}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={2} align="end">
              Total
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              {details?.barTotal?.desiredValue}
            </Table.Summary.Cell>
            {details?.barScoreHeaders?.map((header,index) => {
              const found = details?.barTotal?.scores?.find(
                (x) => x.title === header
              );
              return (
                <Table.Summary.Cell align="center" key={index + 1}>
                  {found ? found.score : ""}
                </Table.Summary.Cell>
              );
            })}
            <Table.Summary.Cell align="center">
              {details?.barTotal?.avgBARScore}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              {details?.totalBARScoreByScale}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </div>
  );
};

export default BehaviorallyAnchoredRatingBARDetails;
