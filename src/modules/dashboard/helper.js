import axios from "axios";
import { toast } from "react-toastify";
import AvatarComponent from "../../common/AvatarComponent";
import { gray600 } from "../../utility/customColor";

export const getPeopleDeskAllLanding = async (
  tableName,
  accId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=${tableName}&AccountId=${accId}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getEmployeeDashboard = async (employeeId, buId, setter) => {
  try {
    const res = await axios.get(`/Dashboard/EmployeeDashboard`);
    setter(res?.data?.employeeDashboardViewModel);
  } catch (error) {
    setter("");
  }
};

export const getMidLevelDashboard = async (
  employeeId,
  buId,
  setter,
  setEmployeeList,
  setAllEmployeeList
) => {
  try {
    const res = await axios.get(
      `/emp/Dashboard/MidLevelDashboard?EmployeeId=${employeeId}&BusinessUnitId=${buId}`
    );
    setEmployeeList &&
      setEmployeeList(
        res?.data?.midLevelDashboardViewModel?.employeeQryProfileAllList
      );
    setAllEmployeeList &&
      setAllEmployeeList(
        res?.data?.midLevelDashboardViewModel?.employeeQryProfileAllList
      );
    setter(res?.data);
  } catch (error) {}
};

export const getBirthAnniversary = async (setter, setLoading) =>{
  try{
    setLoading(true)

    const res = await axios.get(`/SaasMasterData/BirthDayWorkAnniversary`)
    setter(res?.data)
    setLoading(false)

  }catch(error){

  }
}

export const getTopLevelDashboard = async (employeeId, buId, setter) => {
  try {
    const res = await axios.get(
      `/emp/Dashboard/TopLevelDashboard?EmployeeId=${employeeId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getMonthAndYearBasedAttendanceSummary = async (
  employeeId,
  yearId,
  monthId,
  rowDto,
  setter,
  setCircleChartData
) => {
  try {
    const res = await axios.get(
      `/Dashboard/MonthAndYearBasedAttendanceSummary?EmployeeId=${employeeId}&YearId=${yearId}&MonthId=${monthId}`
    );

    setCircleChartData &&
      setCircleChartData({
        options: {
          toolbar: {
            show: true,
          },
          plotOptions: {
            radialBar: {
              hollow: {
                margin: 0,
                size: "75%",
                background: "#fff",
                image: undefined,
                imageOffsetX: 0,
                imageOffsetY: 0,
                position: "front",
              },
              track: {
                background: "gray",
                strokeWidth: "100%",
                margin: 0,
              },
              dataLabels: {
                show: false,
                name: {
                  fontSize: "16px",
                  offsetY: -10,
                  show: true,
                  color: "#888",
                },
              },
            },
          },
          fill: {
            type: ["gradient"],
            gradient: {
              type: "vertical",
              shadeIntensity: 1,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100],
              colorStops: [
                {
                  offset: 5,
                  color: "#5BE584",
                  opacity: 1,
                },
                {
                  offset: 80,
                  color: "#007B55",
                  opacity: 1,
                },
                {
                  offset: 90,
                  color: "#007B55",
                  opacity: 1,
                },
              ],
            },
          },
          stroke: {
            lineCap: "round",
          },
          labels: [`Present`],
        },
        series: [
          Math.floor((res?.data?.presentDays * 100) / res?.data?.workingDays),
        ],
      });

    setter({
      ...rowDto,
      monthName: res?.data?.monthName,
      workingDays: res?.data?.workingDays,
      presentDays: res?.data?.presentDays,
      absentDays: res?.data?.absentDays,
      lateDays: res?.data?.lateDays,
    });
  } catch (error) {
    setter([]);
  }
};

export const getWeather = async (lat, long, setter) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather/?lat=${lat}&lon=${long}&units=metric&APPID=b371f173815ac94b938c6962478a38c6`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        setter(data);
      }
    })
    .catch((err) => {});
};

export const getDefaultDashboardChange = async (loginId, roleId, cb) => {
  try {
    const res = await axios.get(
      `/emp/Auth/DefaultDashboardChange?loginId=${loginId}&defaultDashboardId=${roleId}`
    );
    cb && cb();
    toast.success(res?.data || "Update  Successfully");
  } catch (error) {
    toast.warn(error?.response?.data || "Something went wrong");
  }
};

export const getAllAnnouncement = async (
  buId,
  accountId,
  employeeId,
  yearId,
  setter
) => {
  try {
    const res = await axios.get(`/MasterData/GetAnnouncement?YearId=${yearId}`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getDashboardTotalEmployee = async (tableName, buId, setter) => {
  try {
    const res = await axios.get(
      `/emp/MasterData/PeopleDeskAllLanding?TableName=${tableName}&BusinessUnitId=${buId}`
    );
    let totalEmployee = res?.data?.Result?.reduce(function (
      accumulator,
      currentValue
    ) {
      return accumulator + currentValue?.NumberOfEmployee || 0;
    },
    0);
    setter({ ...res?.data, totalEmployee: totalEmployee });
  } catch (error) {
    setter([]);
  }
};

export const getEmploymentTypeDDL = async (tableName, acId, buId, setter) => {
  try {
    const res = await axios.get(
      `/emp/MasterData/PeopleDeskAllDDL?DDLType=${tableName}&AccountId=${acId}&BusinessUnitId=${buId}`
    );
    if (res?.data) {
      const newDDL = res?.data?.Result?.map((itm) => {
        return {
          ...itm,
          value: itm["Id"],
          label: itm["EmploymentType"],
        };
      });
      setter([
        {
          Id: 0,
          EmploymentType: "All",
          value: 0,
          label: "All",
        },
        ...newDDL,
        {
          Id: -1,
          EmploymentType: "None",
          value: -1,
          label: "None",
        },
      ]);
    }
  } catch (error) {
    setter([]);
  }
};

export const getDashboardDeptSecEmpTypeWiseEmployee = async (
  buId,
  employeeTypeId,
  statusId,
  setter
) => {
  try {
    const res = await axios.get(
      `/emp/MasterData/PeopleDeskAllLanding?TableName=DashboardDeptSecEmpTypeWiseEmployee&BusinessUnitId=${buId}&intId=${employeeTypeId}&StatusId=${statusId}`
    );
    if (res?.data) {
      setter(res?.data?.Result);
    }
  } catch (error) {
    setter([]);
  }
};


export const workannivarsayList = (
  rowDto,
  filterData,
  setFilterData,
  setRowDto,
  setLoading,
  
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      className: "text-center",
    },
    
    {
      title: () => <span style={{ color: gray600 }}>Description</span>,
      dataIndex: "birthDay",
    },
  ].filter((item) => !item.hidden);
};
