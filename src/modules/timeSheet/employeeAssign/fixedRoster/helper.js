import axios from "axios";
import { toast } from "react-toastify";

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

      newDDL.push({value:111,label:'Holiday'},{value:222,label:'off Day'})
      setter(newDDL);
  
      // let fistItem = newDDL[0];
      // setterFastValue && setterFastValue([fistItem]);
    } catch (error) {
      console.log(error.message);
    }
  };
export const getFixedRosterLanding = async (
  orgId,
  buId,
  setter,
setAllData,
setLoading,
    // setterFastValue
  ) => {
    setLoading?.(true)
    try {
      const res = await axios.get(`/TimeSheet/GetFixedRoasterMasterById?intAccountId=${orgId}&intBusinessId=${buId}`);
      
      setter(res?.data);
      setAllData(res?.data)
      // let fistItem = newDDL[0];
      // setterFastValue && setterFastValue([fistItem]);
    setLoading?.(false)

    } catch (error) {
      console.log(error.message);
    setLoading?.(false)

    }
  };
export const getFixedRosterDetailsById = async (
 id,
 setLoading,
 setter
  ) => {
    setLoading?.(true)
    try {
      const res = await axios.get(`/TimeSheet/GetFixedRoasterDetaisById?intFixedMasterId=${id}`);
      
      setter(res?.data);
      // let fistItem = newDDL[0];
      // setterFastValue && setterFastValue([fistItem]);
    setLoading?.(false)

    } catch (error) {
      console.log(error.message);
    setLoading?.(false)

    }
  };
export const createNUpdateFixedRoaster = async (
   payload,
   setLoading,
   cb
    // setterFastValue
  ) => {
    console.log(payload)
    setLoading && setLoading(true);
    try {
      const res = await axios.post(
        `/TimeSheet/CreateNUpdateFixedRoaster`,payload
      );
      cb?.()
      toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);

    } catch (error) {
      console.log(error)
      setLoading && setLoading(false);
      toast.warn( "Something went wrong");

    }}
