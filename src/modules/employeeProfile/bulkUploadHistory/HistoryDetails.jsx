/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../common/loading/Loading";
import { dateFormatter } from "../../../utility/dateFormatter";
import { getDetailsBulkHistoryAction } from "./helper";

const HistoryDetails = ({ currentItem }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    if (currentItem?.InsertDate) {
      getDetailsBulkHistoryAction(
        setLoading,
        setData,
        buId,
        currentItem?.InsertDate,
        currentItem?.statusId
      );
    }
  }, [currentItem]);

  return (
    <div className="p-3">
      {loading && <Loading />}
      <div className="table-card-body">
        <div className="table-card-styled tableOne">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item?.strEmployeeCode}>
                  <td>
                    <div className="content tableBody-title">
                      {item?.strEmployeeCode}
                    </div>
                  </td>
                  <td>
                    <div className="content tableBody-title">
                      {item?.strEmployeeName}
                    </div>
                  </td>
                  <td>
                    <div className="content tableBody-title">
                      {item?.strDesignationName}
                    </div>
                  </td>
                  <td>
                    <div className="content tableBody-title">
                      {dateFormatter(item?.dteOverTimeDate)}
                    </div>
                  </td>
                  <td>
                    <div className="content tableBody-title">
                      {item?.strFromTime}
                    </div>
                  </td>
                  <td>
                    <div className="content tableBody-title">
                      {item?.strToTime}
                    </div>
                  </td>
                  <td>
                    <div className="content tableBody-title">
                      {item?.strRemarks}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetails;
