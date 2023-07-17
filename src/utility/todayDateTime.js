import { todayDate } from "./todayDate";

export const getTodayDateAndTime = ()=>{
  let today = new Date();
  // let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let dateTime = todayDate()+'T'+time;
  return dateTime;
}