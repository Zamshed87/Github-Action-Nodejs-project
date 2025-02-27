import { DataTable } from "Components";
import { getBarHeader } from "./helper";
import { Table } from "antd";
import { useHistory } from "react-router-dom";

const BehaviorallyAnchoredRatingBARDetails = ({ details }) => {
  const history = useHistory();

  return (
    <div>
      <h3 className="pb-3 pt-3">Behaviorally Anchored Rating (BAR) Details</h3>
      <DataTable
        header={getBarHeader(
          details?.barDetails?.length,
          details?.totalBARScoreByScale,
          history
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
            <Table.Summary.Cell align="center">
              {details?.barTotal?.selfScore}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              {details?.barTotal?.supervisorScore}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              {details?.barTotal?.crossFuncationalScore}
            </Table.Summary.Cell>
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
