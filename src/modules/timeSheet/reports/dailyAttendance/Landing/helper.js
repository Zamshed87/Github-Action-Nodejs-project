import axios from "axios";
/* 
 Color Render For present, offday, leave, holiday, late, unprocessed, absent, movement, 
*/
export const colorList = {
  preset: {
    color: "green",
    backgroundColor: {
      // backgroundColor: "rgba(91, 203, 79, 1)",
      backgroundColor: "rgba(125,227,154,1)",
    },
  },
  late: {
    color: "yellow",
    backgroundColor: {
      // backgroundColor: "rgba(251, 191, 36, 1)",
      backgroundColor: "rgba(255,224,130,1)",
    },
  },
  offday: {
    color: "gray",
    backgroundColor: {
      // backgroundColor: "rgba(156, 163, 175, 1)",
      backgroundColor: "rgba(222,228,239,1)",
    },
  },
  absent: {
    color: "red",
    backgroundColor: {
      // backgroundColor: "rgba(254, 114, 104, 1)",
      backgroundColor: "rgba(251,145,157,1)",
    },
  },
  leave: {
    color: "indigo",
    backgroundColor: {
      // backgroundColor: "rgba(183, 120, 221, 1)",
      backgroundColor: "rgba(233,180,242,1)",
    },
  },
  movement: {
    color: "pink",
    backgroundColor: {
      // backgroundColor: "rgba(255, 175, 204, 1)",
      backgroundColor: "rgba(253,219,227,1)",
    },
  },
  holiday: {
    color: "pink",
    backgroundColor: {
      // backgroundColor: "rgba(104, 202, 243, 1)",
      backgroundColor: "rgba(170,229,255,1)",
    },
  },
  unprocessed: {
    color: "purple",
    backgroundColor: {
      // backgroundColor: "rgba(167, 139, 250, 1)",
      backgroundColor: "rgba(222,228,239,1)",
    },
  },
  default: {
    color: "default",
    backgroundColor: {
      // backgroundColor: "rgba(229, 231, 235, 1)",
      backgroundColor: "rgba(255,255,255, 1)",
    },
  },
};

// Filter Single Dataset by day number
const singleDataSetFinder = (day, resDataset) => {
  return resDataset?.filter((item) => item?.dayNumber === +day)[0];
};

// Match All day from allday list with resData set and return final dataset
const matchDataset = (dateList, resDataset) => {
  const finalDataSetModify = dateList?.map((item) => {
    const singleResData = singleDataSetFinder(item, resDataset);
    if (singleResData) {
      return {
        dayName: singleResData?.dayName,
        dayNumber: singleResData?.dayNumber,
        dayOfWeek: singleResData?.dayOfWeek,
        intEmployeeId: singleResData?.intEmployeeId,
        monthDate: singleResData?.monthDate,
        monthName: singleResData?.monthName,
        presentStatus: singleResData?.presentStatus,
        weekOfMonth: singleResData?.weekOfMonth,
      };
    }
    return {
      dayName: "",
      dayNumber: 0,
      dayOfWeek: 0,
      intEmployeeId: 0,
      monthDate: "0",
      monthName: "",
      presentStatus: "-",
      weekOfMonth: 0,
    };
  });
  return finalDataSetModify;
};

export const getEmployeeAttendenceDetailsReport = async (
  empId,
  month,
  year,
  setter,
  allDayList
) => {
  try {
    let res = await axios.get(
      `/Employee/GetAttendanceSummaryCalenderViewReport?EmployeeId=${empId}&Month=${month}&Year=${year}`
    );
    setter(matchDataset(allDayList, res?.data));
  } catch (error) {
    setter([]);
  }
};
