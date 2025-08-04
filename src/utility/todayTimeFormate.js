import moment from "moment";

export const todayTimeFormate = () => {
  const now = moment();
  const formattedTime = now.format();

  return formattedTime;
};
