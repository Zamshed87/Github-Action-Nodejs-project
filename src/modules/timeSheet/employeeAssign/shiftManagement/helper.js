import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";

export const getShiftAssignFilter = async (
  setAllData,
  setter,
  setIsLoading,
  rowDto,
  payload,
  cb
) => {
  setIsLoading(true);
  try {
    let res = await axios.post(`/Employee/CalendarAssignFilter`, payload);
    setIsLoading(false);
    const newList = res?.data?.map((item) => ({
      ...item,
      isAssigned: false,
    }));
    setAllData && setAllData(newList);
    setter?.(newList);
    res?.data?.length > 0 && cb?.(res?.data);
    /* 
    if (!rowDto?.length > 0) {
      setter(newList);
    } else {
      let temp = [];
      res?.data?.forEach((item) => {
        rowDto.forEach((filterd) => {
          if (item?.EmployeeId === filterd?.EmployeeId) {
            temp.push({
              ...item,
              isAssigned: false,
            });
          }
        });
      });
      setter(temp);
    } */
  } catch (err) {
    setIsLoading(false);
    setter("");
  }
};

export const getEmployeeProfileViewData = async (id, setter, setLoading) => {
    setLoading && setLoading(true);
    try {
      const res = await axios.get(
        `/Employee/EmployeeProfileView?employeeId=${id}`
      );
      if (res?.data) {
        setter && setter(res?.data);
        setLoading && setLoading(false);
      }
    } catch (error) {
      setLoading && setLoading(false);
    }
  };
export const getShiftInfo = async (id,setter, setLoading) => {
    setLoading && setLoading(true);
    try {
      const res = await axios.get(
        `Employee/GetEmployeeShiftInfo?intEmployeeId=${id}&intYear=${moment().format("YYYY")}&intMonth=${moment().format("M")}`
      );
      if (res?.data) {
        setter && setter(res?.data);
        setLoading && setLoading(false);
      }
      res?.data?.length === 0 && toast.warn("no data found");
    } catch (error) {
      setLoading && setLoading(false);
    }
  };
export const createShiftManagement = async (payload, setLoading,cb) => {
    setLoading && setLoading(true);
    try {
      const res = await axios.post(
        `Employee/PostCalendarAssign`,payload
      );
      cb && cb()
      toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);

    } catch (error) {
      console.log(error)
      setLoading && setLoading(false);
      toast.warn( "Something went wrong");

    }
  };
  export const getCalenderDDL = async (
    apiUrl,
    value,
    label,
    setter
    // setterFastValue
  ) => {
    try {
      const res = await axios.get(apiUrl);
      const newDDL = res?.data?.map((itm) => ({
        ...itm,
        value: itm[value],
        label: itm[label],
      }));
      setter(newDDL);
  
      // let fistItem = newDDL[0];
      // setterFastValue && setterFastValue([fistItem]);
    } catch (error) {
      console.log(error.message);
    }
  };

  export const getChipStyle = (status) => ({
    color:
      status === "A"
        ? "#6927DA"
        : status === "B"
        ? "#B42318"
        : status === "C"
        ? "#299647"
        : status === "D"
        ? " #B54708"
        : status === "General"
        ? " #722F37"
        : status === "E"
        ? "#3538CD"
        : "#667085",
    backgroundColor:
      status === "A"
        ? "#ECE9FE"
        : status === "B"
        ? "#FEE4E2"
        : status === "C"
        ? "#E6F9E9"
        : status === "D"
        ? "#FEF0C7"
        : status === "General"
        ? "#FEF0D7"
        : status === "E"
        ? "#E0EAFF"
        : "#F2F4F7",
    borderRadius: "50%",
    fontSize: "15px",
    // padding: "2px 5px",
    paddingTop: "7px",
    fontWeight: 500,
    textAlign: "center",
    width: "30px",
    height: "30px",
  });
  export const getChipStyleShift = (status) => ({
    color:
      status === "A"
        ? "#6927DA"
        : status === "B"
        ? "#B42318"
        : status === "C"
        ? "#299647"
        : status === "D"
        ? " #B54708"
        : status === "General"
        ? " #722F37"
        : status === "E"
        ? "#3538CD"
        : "#667085",
    backgroundColor:
      status === "A"
        ? "#ECE9FE"
        : status === "B"
        ? "#FEE4E2"
        : status === "C"
        ? "#E6F9E9"
        : status === "D"
        ? "#FEF0C7"
        : status === "General"
        ? "#FEF0D7"
        : status === "E"
        ? "#E0EAFF"
        : "#F2F4F7",
    borderRadius: "99px",
    fontSize: "14px",
    padding: "2px 5px",
    fontWeight: 500,
   
  });

  