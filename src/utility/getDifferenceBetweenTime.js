import { dateFormatterForInput } from "./dateFormatter";

export const getDifferenceBetweenTime = (date, startTime, endTime) => {
  let date1 = new Date(`${date} ${startTime}`);
  let date2 = new Date(`${date} ${endTime}`);

  function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return dateFormatterForInput(result);
  }

  let diff = date2.getTime() - date1.getTime();

  if (date2.getTime() < date1.getTime()) {
    let nextDate = addDays(date, 1);
    let nextDateTime = new Date(`${nextDate} ${endTime}`);
    diff = nextDateTime.getTime() - date1.getTime();
  }

  let msec = diff;
  let hh = Math.floor(msec / 1000 / 60 / 60);
  msec -= hh * 1000 * 60 * 60;
  let mm = Math.floor(msec / 1000 / 60);
  msec -= mm * 1000 * 60;
  let ss = Math.floor(msec / 1000);
  msec -= ss * 1000;

  if (hh < 10) {
    hh = `0${hh}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  if (ss < 10) {
    ss = `0${ss}`;
  }

  let difference = `${hh}:${mm}:${ss}`;

  return difference;
};
