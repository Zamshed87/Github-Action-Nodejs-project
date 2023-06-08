import moment from "moment";

export const durationDifference = (time_1, time_2) => {
  const fromTime = moment(time_1, "HH:mm:ss");
  const toTime = moment(time_2, "HH:mm:ss");
  const duration = moment.duration(toTime.diff(fromTime));
  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.asMinutes()) - hours * 60;

  const formattedDuration = `${hours} hour${
    hours !== 1 ? "s" : ""
  } ${minutes} minute${minutes !== 1 ? "s" : ""}`;

  return formattedDuration;
};
