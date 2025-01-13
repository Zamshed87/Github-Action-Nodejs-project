import React, { useEffect } from "react";
import PerticipantsChart from "./chart/perticipants";
import { useDispatch } from "react-redux";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import DurationChart from "./chart/duration";

const TnDDashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
  }, []);
  return (
    <div>
      <h1>Dashboard</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "80px",
        }}
      >
        <div style={{ height: "200px", width: "600px" }}>
          <PerticipantsChart />
        </div>
        <div style={{ height: "200px", width: "600px" }}>
          <DurationChart />
        </div>
      </div>
    </div>
  );
};

export default TnDDashboard;
