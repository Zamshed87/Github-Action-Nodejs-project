const monthsShortName = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const dateFormatterReport = (paramDate) => {
  if (!paramDate) return "";

  const date = new Date(paramDate);

  const year = date?.getFullYear();

  const month = date?.getMonth();

  const shortMonth = `${monthNames[month]}`;

  const day = `${date?.getDate()}`?.padStart(2, "0") + ",";

  return [shortMonth, day, year]?.join(" ");
};

export const dateFormatter = (paramDate) => {
  if (!paramDate) return "";

  const date = new Date(paramDate);

  const year = date?.getFullYear();

  const month = date?.getMonth();

  const shortMonth = `${monthsShortName[month]},`;

  const day = `${date?.getDate()}`?.padStart(2, "0");

  return [day, shortMonth, year]?.join(" ");
};
export const dateFormatterForDashboard = () => {
  // if (!paramDate) return "";

  // const date = new Date(paramDate);
  const date = new Date();

  // const year = date?.getFullYear();
  const day = date.getDay();
  const dayName = `${days[day]}`;
  const month = date?.getMonth();

  const monthName = `${monthNames[month]},`;

  const dateNumber = `${date?.getDate()},`?.padStart(2, "0");

  return [dateNumber, monthName, dayName]?.join(" ");
};

export const dateFormatterForInput = (param) => {
  const date = new Date(param);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return [year, month, day].join("-") || "";
};

export const monthFirstDate = () => {
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  const firstDay = new Date(y, m, 1);

  return dateFormatterForInput(firstDay);
};

export const monthLastDate = () => {
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  const lastDay = new Date(y, m + 1, 0);

  return dateFormatterForInput(lastDay);
};

export const getMonthwithYear = (month) => {
  const value = month.split("-");
  let monthName = "";
  if (value[1] < 10) {
    monthName = monthNames[value[1].split("")[1] - 1];
  } else {
    monthName = monthNames[value[1] - 1];
  }
  const monthwithYear = `${monthName}, ${value[0]}`;
  return monthwithYear;
};

export const dateFormatterWithDay = (param) => {
  // date short
  const getWeek = (day) => {
    if (day === 0) {
      return "Sun";
    } else if (day === 1) {
      return "Mon";
    } else if (day === 2) {
      return "Tue";
    } else if (day === 3) {
      return "Wed";
    } else if (day === 4) {
      return "Thu";
    } else if (day === 5) {
      return "Fri";
    } else if (day === 6) {
      return "Sat";
    }
  };

  const date = new Date(param);
  const day = date.getDay();
  const month = date?.getMonth();
  const year = date?.getFullYear();

  const monthName = `${monthNames[month]},`;

  const dateNumber = `${date?.getDate()},`?.padStart(2, "0");

  return `${[dateNumber, monthName, year]?.join(" ")} (${getWeek(day)})`;
};

export const dayMonthYearFormatter = (param) => {
  const date = new Date(param);
  const month = date?.getMonth();
  const year = date?.getFullYear();

  const monthName = `${monthNames[month]},`;

  const dateNumber = `${date?.getDate()},`?.padStart(2, "0");

  return `${[dateNumber, monthName, year]?.join(" ")}`;
};

export const monthYearFormatter = (param) => {
  if (!param) return "";

  const date = new Date(param);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return [monthNames[month - 1], year].join(",");
};

export const lastDayOfMonth = (monthId, yearId) => {
  switch (monthId) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return `${yearId}-${monthId <= 9 ? `0${monthId}` : monthId}-31`;

    case 2:
      return `${yearId}-${monthId <= 9 ? `0${monthId}` : monthId}-28`;

    default:
      return `${yearId}-${monthId <= 9 ? `0${monthId}` : monthId}-30`;
  }
};

const currentYear = new Date().getFullYear();

export const getDateOfYear = (type, year) => {
  if (type === "first") {
    const firstDay = new Date(year ? year : currentYear, 0, 1);
    return dateFormatterForInput(firstDay);
  } else if (type === "last") {
    const lastDay = new Date(year ? year : currentYear, 11, 31);
    return dateFormatterForInput(lastDay);
  }
};

export function calculateNextDate(inputDate, n) {
  const dateParts = inputDate.split("-");
  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]);
  const day = parseInt(dateParts[2]);
  const currentDate = new Date(year, month - 1, day);

  for (let i = 0; i < n; i++) {
    currentDate.setDate(currentDate.getDate() + 1); // Add one day
    // Check if we need to handle month boundaries (30/31 days)
    const nextMonth = new Date(year, month, 1);
    if (
      currentDate.getDate() === 1 &&
      currentDate.getMonth() !== nextMonth.getMonth()
    ) {
      currentDate.setDate(1); // Set day to 1 if it's a new month
    }
  }
  // Format the result date as "YYYY-MM-DD"
  const yearStr = currentDate.getFullYear();
  const monthStr = String(currentDate.getMonth() + 1).padStart(2, "0");
  const dayStr = String(currentDate.getDate()).padStart(2, "0");
  const resultDate = `${yearStr}-${monthStr}-${dayStr}`;
  return resultDate;
}
