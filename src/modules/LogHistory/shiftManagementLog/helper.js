import axios from "axios";
import { toast } from "react-toastify";

export const getLogData = async (id,formDate,todate, setter, setLoading) => {
    setLoading && setLoading(true);
    try {
      const res = await axios.get(
        `/Employee/LogAttendanceOfChangedCalendar?EmployeeId=${id}&FromDate=${formDate}&Todate=${todate}`
      );

      if (res?.data) {
        setter && setter(res?.data);
        setLoading && setLoading(false);
      }
    } catch (error) {
        toast.warn(error?.response?.data?.message || "Something went wrong")
      setLoading && setLoading(false);
    }
  };