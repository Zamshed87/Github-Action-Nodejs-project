import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import { extraSideLandingView } from "../helper";

const OutsideDutyViewModal = ({
  onHide,
  singleItem,
  setSingleItem,
  values,
  setLoading,
}) => {
  const { buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [singleItemData, setsingleItemData] = useState([]);
  useEffect(() => {
    let date = { fromDate: values?.fromDate, toDate: values?.toDate };
    extraSideLandingView(
      "ExtraSideDutyDetails",
      buId,
      date,
      singleItem?.intEmployeeId,
      employeeId,
      setsingleItemData,
      setLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="modalBody">
        <table className="table table-card-styled tableOne">
          <thead>
            <tr>
              <th
                style={{ border: "none", width: "30%" }}
                className="text-right"
              >
                Date
              </th>
              <th style={{ border: "none" }} className="text-center">
                Duty Count
              </th>
            </tr>
          </thead>
          <tbody>
            {singleItemData?.length > 0 &&
              singleItemData?.map((data, index) => (
                <tr key={index} style={{ fontSize: "12px" }}>
                  <td className="text-right">
                    {dateFormatter(data?.dteDutyDate)}
                  </td>
                  <td className="text-center">{data?.intDutyCount}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="modal-footer form-modal-footer">
        <button
          type="button"
          className="modal-btn modal-btn-cancel"
          onClick={() => onHide()}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default OutsideDutyViewModal;
