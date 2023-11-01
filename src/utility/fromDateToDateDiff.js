function TimeCalculator(seconds) {
  let y = Math.floor(seconds / 31536000);
  let mo = Math.floor((seconds % 31536000) / 2628000);
  let d = Math.floor(((seconds % 31536000) % 2628000) / 86400);
  // let h = Math.floor((seconds % (3600 * 24)) / 3600);
  // let m = Math.floor((seconds % 3600) / 60);
  // let s = Math.floor(seconds % 60);

  let yDisplay = y > 0 ? y + (y === 1 ? " year " : " years ") : "";
  let moDisplay = mo > 0 ? mo + (mo === 1 ? " month " : " months ") : "";
  let dDisplay = d > 0 ? d + (d === 1 ? " day " : " days ") : "";
  // let hDisplay = h > 0 ? h + (h === 1 ? " hour " : " hours ") : "";
  // let mDisplay = m > 0 ? m + (m === 1 ? " minute " : " minutes, ") : "";
  // let sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds ") : "";
  // return yDisplay + moDisplay + dDisplay + hDisplay + mDisplay + sDisplay;
  return yDisplay + moDisplay + dDisplay;
}

export const fromDateToDateDiff = (fromDate, toDate) => {
  const fromDateTime = new Date(fromDate);
  const fromDateSeconds = Math.floor(fromDateTime.getTime() / 1000);

  const toDateTime = new Date(toDate);
  const toDateSeconds = Math.floor(toDateTime.getTime() / 1000);

  const dateDiffSeconds = toDateSeconds - fromDateSeconds;

  return TimeCalculator(dateDiffSeconds);
};
// uses
// let result = fromDateToDateCalculation("2022-04-25T00:00:00", "2023-04-26T00:00:00");

export const fromDateToDateDiffToSeconds = (fromDate, toDate) => {
  const fromDateTime = new Date(fromDate);
  const fromDateSeconds = Math.floor(fromDateTime.getTime() / 1000);

  const toDateTime = new Date(toDate);
  const toDateSeconds = Math.floor(toDateTime.getTime() / 1000);

  const dateDiffSeconds = toDateSeconds - fromDateSeconds;

  return dateDiffSeconds;
};
