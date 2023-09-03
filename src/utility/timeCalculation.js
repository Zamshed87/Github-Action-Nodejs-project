export const toHoursAndMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return {
    hours,
    minutes: minutes >= 9 ? minutes : `0${minutes}`,
  };
};

export const hourToMinute = (hours) => {
  const timeParts = hours.split(".");
  let totalMin;
  if (timeParts?.length < 2) {
    totalMin = +timeParts[0] * 60;
  } else {
    totalMin = +timeParts[0] * 60 + +timeParts[1];
  }
  return totalMin;
};
