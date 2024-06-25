import { todayDate } from "./todayDate";

export const getTodayDateAndTime = () => {
  const today = new Date();
  // let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = todayDate() + "T" + time;
  return dateTime;
};
