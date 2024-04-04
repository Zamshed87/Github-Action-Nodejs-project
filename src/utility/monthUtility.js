//This function return always a string if you need number type please add + before call the function
export const currentMonth = () => {
  const currentMonthInt = new Date().getMonth() + 1;
  return currentMonthInt?.toString().length < 2
    ? `0${currentMonthInt}`
    : currentMonthInt.toString();
};

export const getMonthName = (month) => {
  switch (month) {
    case 1:
      month = "January";
      break;
    case 2:
      month = "February";
      break;
    case 3:
      month = "March";
      break;
    case 4:
      month = "April";
      break;
    case 5:
      month = "May";
      break;
    case 6:
      month = "June";
      break;
    case 7:
      month = "July";
      break;
    case 8:
      month = "August";
      break;
    case 9:
      month = "September";
      break;
    case 10:
      month = "October";
      break;
    case 11:
      month = "November";
      break;
    case 12:
      month = "December";
      break;
    default:
      month = "";
  }
  return month;
};

export const currentMonthValueLabel = () => {
  const currentMonthId = +currentMonth();
  return {
    value: currentMonthId,
    label: getMonthName(currentMonthId),
  };
};

export const monthDDL = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];
