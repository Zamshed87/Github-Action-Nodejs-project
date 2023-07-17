import moment from "moment";
import { useEffect, useState } from "react";
import { gray200 } from "../../../utility/customColor";

const CalenderCommon = ({ monthYear }) => {
  const [dates, setDates] = useState([]);
  const [date, setDate] = useState({
    year: monthYear.split("-")[0],
    month: monthYear.split("-")[1],
  });

  useEffect(() => {
    let days = moment(`${date?.month}/01/${date?.year}`).daysInMonth();
    const demoDate = [];
    while (days) {
      demoDate.push({
        day: `${days}`,
        dayName: moment(`${date?.month}/${days}/${date?.year}`).format("dddd"),
      });
      days--;
    }
    setDates(demoDate.reverse());
  }, [date]);

  return (
    <div className="employee-attendance-calendar-wrapper h-100">
      <div className="row mx-0 " style={{ height: "80%" }}>
        <div
          className="col-md-8 h-100"
          style={{
            padding: "12px",
            borderRight: `1px solid ${gray200}`,
          }}
        >
          <div className="calendar p-0 rounded-0">
            <div className="calendar-heading">
              <div>
                <p>Sunday</p>
              </div>
              <div>
                <p>Monday</p>
              </div>
              <div>
                <p>Tuesday</p>
              </div>
              <div>
                <p>Wednesday</p>
              </div>
              <div>
                <p>Thursday</p>
              </div>
              <div>
                <p>Friday</p>
              </div>
              <div>
                <p>Saturday</p>
              </div>
            </div>
            <div className="calendar-body">
              {dates?.map((item, i) => (
                <div
                  className="calendar-date-cell"
                  key={i}
                  style={{
                    gridColumn: `${
                      item?.dayName === "Monday"
                        ? "2/3"
                        : item?.dayName === "Tuesday"
                        ? "3/4"
                        : item?.dayName === "Wednesday"
                        ? "4/5"
                        : item?.dayName === "Thursday"
                        ? "5/6"
                        : item?.dayName === "Friday"
                        ? "6/7"
                        : item?.dayName === "Saturday"
                        ? "7/8"
                        : "1/2"
                    }`,
                  }}
                >
                  <div
                    className=""
                    style={{
                      //   background: "#f2daf5",
                      borderRadius: "50%",
                      width: "35px",
                      height: "35px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {item?.day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalenderCommon;
