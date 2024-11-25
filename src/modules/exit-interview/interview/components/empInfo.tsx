import { Flex } from "Components";
import { useEffect, useState } from "react";

const EmpInfo = ({ empBasic }: any) => {
  const startTime: any = new Date();

  // State to store elapsed time (in milliseconds)
  const [elapsedTime, setElapsedTime] = useState(0);

  // Function to format the time in HH:mm:ss
  const formatTime = (time: any) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Get the current time and calculate the elapsed time since startTime
      const currentTime: any = new Date();
      const timeElapsed = currentTime - startTime;
      setElapsedTime(timeElapsed);
    }, 1000); // Update every second

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Flex
      justify="space-between"
      style={{
        fontSize: "12px",
      }}
    >
      <div>
        <div>
          <span style={{ fontWeight: 500, fontSize: "14px" }}>
            {empBasic?.EmployeeName}[{empBasic?.EmployeeCode}]
          </span>
        </div>
        <div>
          Designation :{" "}
          <span style={{ fontWeight: "500" }}>{empBasic?.DesignationName}</span>
        </div>
        <div>
          Department :{" "}
          <span style={{ fontWeight: "500" }}>{empBasic?.DepartmentName}</span>
        </div>
        <div>
          Service Length :{" "}
          <span style={{ fontWeight: "500" }}>{empBasic?.ServiceLength}</span>
        </div>
      </div>
      <div style={{ fontSize: "2em" }}>{formatTime(elapsedTime)}</div>
    </Flex>
  );
};

export default EmpInfo;
