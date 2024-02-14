export const yearDDLAction = (prev = 0, next = 10) => {
  const year = new Date().getFullYear();

  const yearStart = year - prev;
  const yearEnd = year + next;
  let years = [];
  for (let i = yearStart; i <= yearEnd; i++) {
    years.push({ value: i, label: i });
  }
  return years;
};


/* 
Array of objects representing probation close date options.
 * @typedef {Object} ProbationCloseDateOption
 * @property {number} value - The value of the option.
 * @property {string} label - The label of the option.
 * @property {string} count - The count of days for the option.
 * 
*/
export const probationCloseDateCustomDDL = [
  { value: 1, label: "15 Days", count: "15" },
  { value: 2, label: "30 Days", count: "30" },
  { value: 3, label: "45 Days", count: "45" },
  { value: 4, label: "60 Days", count: "60" },
  { value: 5, label: "75 Days", count: "75" },
  { value: 6, label: "90 Days", count: "90" },
  { value: 7, label: "105 Days", count: "105" },
  { value: 8, label: "120 Days", count: "120" },
  { value: 9, label: "135 Days", count: "135" },
  { value: 10, label: "150 Days", count: "150" },
  { value: 11, label: "165 Days", count: "165" },
  { value: 12, label: "180 Days", count: "180" },
  { value: 13, label: "195 Days", count: "195" },
  { value: 14, label: "210 Days", count: "210" },
  { value: 15, label: "225 Days", count: "225" },
  { value: 16, label: "240 Days", count: "240" },
  { value: 17, label: "255 Days", count: "255" },
  { value: 18, label: "270 Days", count: "270" },
  { value: 19, label: "285 Days", count: "285" },
  { value: 20, label: "300 Days", count: "300" },
  { value: 21, label: "315 Days", count: "315" },
  { value: 22, label: "330 Days", count: "330" },
  { value: 23, label: "345 Days", count: "345" },
  { value: 24, label: "360 Days", count: "360" },
  { value: 25, label: "365 Days", count: "365" },
  { value: 26, label: "1 Month", count: "1month" },
  { value: 27, label: "2 Months", count: "2month" },
  { value: 28, label: "3 Months", count: "3month" },
  { value: 29, label: "4 Months", count: "4month" },
  { value: 30, label: "5 Months", count: "5month" },
  { value: 31, label: "6 Months", count: "6month" },
  { value: 32, label: "7 Months", count: "7month" },
  { value: 33, label: "8 Months", count: "8month" },
  { value: 34, label: "9 Months", count: "9month" },
  { value: 35, label: "10 Months", count: "10month" },
  { value: 36, label: "11 Months", count: "11month" },
  { value: 37, label: "12 Months", count: "12month" },
];

