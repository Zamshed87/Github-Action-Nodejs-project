/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Loading from "../../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../../commonRedux/reduxForLocalStorage/actions.js";
import CalendarFooter from "./CalendarFooter.jsx";
import CalendarHeader from "./CalendarHeader.jsx";
import "./style.css";

function DailyAttendenceReport() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(moment());
  const [allDayList, setAllDayList] = useState([]);

  // Generate 1 month all day's
  useEffect(() => {
    const endDay = Number(moment(value).endOf("month").format("D"));
    let finalDayList = [...(Array(endDay) + 1)]?.map((item, index) => {
      if (index + 1 < 10) {
        return `0${index + 1}`;
      } else {
        return `${index + 1}`;
      }
    });
    setAllDayList(finalDayList);
  }, [value]);

  useEffect(() => {
    setValue(moment(value));
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div className="attendence-report">
        <div className="daily-attendance-landing">
          <div className="table-card-heading"></div>
          <div className="">
            <div className="dynamic-calender-css mainBody">
              <CalendarHeader
                allDayList={allDayList}
                setAllDayList={setAllDayList}
                value={value}
                setValue={setValue}
              />
            </div>
            <CalendarFooter />
          </div>
        </div>
      </div>
    </>
  );
}

export default DailyAttendenceReport;
